import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// (basic) in-memory rate limit (dev/low traffic ok)
const RATE = new Map(); // ip -> {count, ts}
function rateLimit(ip, limit = 5, windowMs = 60_000) {
    const now = Date.now();
    const prev = RATE.get(ip);
    if (!prev || now - prev.ts > windowMs) {
        RATE.set(ip, { count: 1, ts: now });
        return true;
    }
    if (prev.count >= limit) return false;
    prev.count += 1;
    RATE.set(ip, prev);
    return true;
}

function getIP(req) {
    const xf = req.headers.get("x-forwarded-for");
    if (xf) return xf.split(",")[0].trim();
    return "unknown";
}

function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}
function isPhone(v) {
    const s = String(v || "").replace(/\D/g, "");
    return s.length >= 10 && s.length <= 15;
}

async function sendOwnerEmail({ name, email, phone, purpose, source, ip, ua, page }) {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    const to = process.env.CONTACT_TO;       // already in your .env.local
    const from = process.env.CONTACT_FROM;   // already in your .env.local

    if (!host || !user || !pass || !to || !from) return false;

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: true,
        auth: { user, pass },
    });

    const subject = `📄 New Resume Lead: ${name} (${phone})`;
    const text =
        `New Resume Access Request

Name: ${name}
Email: ${email}
Phone: ${phone}
Purpose: ${purpose}
Source: ${source}
Page: ${page}

IP: ${ip}
UA: ${ua}
`;

    await transporter.sendMail({ from, to, subject, text });
    return true;
}

export async function GET() {
    return Response.json({ ok: true, hint: "POST JSON to this endpoint" });
}

export async function POST(req) {
    try {
        const ip = getIP(req);
        const ua = req.headers.get("user-agent") || "";
        const page = req.headers.get("referer") || "";

        // rate limit (bots)
        if (!rateLimit(ip, 5, 60_000)) {
            return Response.json({ ok: false, message: "Too many requests. Try later." }, { status: 429 });
        }

        const body = await req.json();

        // Honeypot (premium anti-bot): frontend hidden field "website"
        if (body?.website) {
            // act like success but don't process
            return Response.json({ ok: true });
        }

        const name = String(body?.name || "").trim();
        const email = String(body?.email || "").trim();
        const phone = String(body?.phone || "").trim();
        const purpose = String(body?.purpose || "Resume Access").trim();
        const source = String(body?.source || "resume-gate").trim();

        if (!name || name.length < 2) {
            return Response.json({ ok: false, message: "Name required" }, { status: 400 });
        }
        if (!isEmail(email)) {
            return Response.json({ ok: false, message: "Valid email required" }, { status: 400 });
        }
        if (!isPhone(phone)) {
            return Response.json({ ok: false, message: "Valid phone required" }, { status: 400 });
        }

        // ✅ create short-lived token (10 min)
        const secret = process.env.RESUME_JWT_SECRET;
        if (!secret) return Response.json({ ok: false, message: "Server misconfigured" }, { status: 500 });

        const token = jwt.sign(
            { email, phone, ts: Date.now() },
            secret,
            { expiresIn: "10m" }
        );

        // resume URL (relative is fine)
        const resumeUrl = `/api/resume/download?token=${token}`;

        // ✅ Save to Google Sheet via Apps Script WebApp
        const webapp = process.env.GOOGLE_LEADS_WEBAPP_URL;
        let sheetOk = false;

        if (webapp) {
            const r = await fetch(webapp, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name, email, phone, purpose, source,
                    ip, ua, page,
                    createdAt: new Date().toISOString(),
                }),
            });
            sheetOk = r.ok;
        }

        // ✅ Email notification (owner)
        let emailSent = false;
        try {
            emailSent = await sendOwnerEmail({ name, email, phone, purpose, source, ip, ua, page });
        } catch (e) {
            emailSent = false;
        }

        return Response.json({
            ok: true,
            sheetOk,
            emailSent,
            resumeUrl,     // frontend will open this after success
            openDelayMs: 1000,
        });
    } catch (err) {
        return Response.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
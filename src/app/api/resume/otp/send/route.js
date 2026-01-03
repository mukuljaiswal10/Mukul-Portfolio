// import { NextResponse } from "next/server";
// import { Redis } from "@upstash/redis";
// import crypto from "crypto";

// const redis = Redis.fromEnv();

// const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// function normEmail(email = "") {
//     return String(email).trim().toLowerCase();
// }

// function otpHash(email, otp) {
//     const secret = process.env.OTP_SECRET || "dev_secret_change_me";
//     return crypto
//         .createHmac("sha256", secret)
//         .update(`${email}:${otp}`)
//         .digest("hex");
// }

// function genOtp4() {
//     // 4-digit (1000-9999)
//     return String(Math.floor(1000 + Math.random() * 9000));
// }

// export async function POST(req) {
//     try {
//         const body = await req.json().catch(() => ({}));
//         const email = normEmail(body?.email);

//         if (!EMAIL_RE.test(email)) {
//             return NextResponse.json({ ok: false, message: "Invalid email." }, { status: 400 });
//         }

//         // ✅ Per-email OTP send rate limit (example: max 3 per 10 minutes)
//         const rlKey = `rl:otp_send:${email}`;
//         const sendCount = await redis.incr(rlKey);
//         if (sendCount === 1) await redis.expire(rlKey, 10 * 60);
//         if (sendCount > 3) {
//             return NextResponse.json(
//                 { ok: false, message: "Too many OTP requests. Try later." },
//                 { status: 429 }
//             );
//         }

//         const otp = genOtp4();

//         // ✅ Store hashed OTP (TTL 5 minutes)
//         const codeKey = `otp:code:${email}`;
//         await redis.set(codeKey, otpHash(email, otp), { ex: 5 * 60 });

//         // ✅ Reset verify attempts on new OTP
//         await redis.del(`otp:attempts:${email}`);

//         // ✅ TODO: yaha apna email send function call karo (nodemailer/resend etc.)
//         // sendEmail(email, otp)
//         // For now assume tumhara already working hai.

//         return NextResponse.json({ ok: true, message: "OTP sent." });
//     } catch (e) {
//         return NextResponse.json({ ok: false, message: "Server error." }, { status: 500 });
//     }
// }














import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // ✅ IMPORTANT (nodemailer needs node runtime)

const redis = Redis.fromEnv();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normEmail(email = "") {
    return String(email).trim().toLowerCase();
}

function otpHash(email, otp) {
    const secret = process.env.OTP_SECRET || "dev_secret_change_me";
    return crypto.createHmac("sha256", secret).update(`${email}:${otp}`).digest("hex");
}

function genOtp4() {
    return String(Math.floor(1000 + Math.random() * 9000));
}

// ✅ cache transporter (avoid re-create every request in dev)
function getTransporter() {
    if (globalThis.__otpMailer) return globalThis.__otpMailer;

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        // transporter not configured
        globalThis.__otpMailer = null;
        return null;
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // 465 => true, 587 => false
        auth: { user, pass },
    });

    globalThis.__otpMailer = transporter;
    return transporter;
}

async function sendOtpEmail(toEmail, otp) {
    const transporter = getTransporter();
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;

    // ✅ If SMTP not configured, in dev we can log OTP so you can test flow
    if (!transporter) {
        console.log(`[OTP DEV] SMTP not configured. OTP for ${toEmail}: ${otp}`);
        return { sent: false, dev: true };
    }

    await transporter.sendMail({
        from,
        to: toEmail,
        subject: `Your OTP Code: ${otp}`,
        text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <h2>Your OTP</h2>
        <p>Your OTP is:</p>
        <div style="font-size:28px;font-weight:700;letter-spacing:4px;margin:12px 0">${otp}</div>
        <p>This OTP is valid for <b>5 minutes</b>.</p>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
    });

    return { sent: true };
}

export async function POST(req) {
    try {
        const body = await req.json().catch(() => ({}));
        const email = normEmail(body?.email);

        if (!EMAIL_RE.test(email)) {
            return NextResponse.json({ ok: false, message: "Invalid email." }, { status: 400 });
        }

        // ✅ Per-email OTP send rate limit (max 3 per 10 minutes)
        const rlKey = `rl:otp_send:${email}`;
        const sendCount = await redis.incr(rlKey);
        if (sendCount === 1) await redis.expire(rlKey, 10 * 60);
        if (sendCount > 3) {
            return NextResponse.json(
                { ok: false, message: "Too many OTP requests. Try later." },
                { status: 429 }
            );
        }

        const otp = genOtp4();

        // ✅ Store hashed OTP (TTL 5 minutes)
        const codeKey = `otp:code:${email}`;
        await redis.set(codeKey, otpHash(email, otp), { ex: 5 * 60 });

        // ✅ Reset verify attempts on new OTP
        await redis.del(`otp:attempts:${email}`);
        await redis.del(`otp:block:${email}`);

        // ✅ SEND EMAIL (THIS WAS MISSING)
        await sendOtpEmail(email, otp);

        return NextResponse.json({ ok: true, message: "OTP sent." });
    } catch (e) {
        console.error("OTP send error:", e);
        return NextResponse.json({ ok: false, message: "Server error." }, { status: 500 });
    }
}
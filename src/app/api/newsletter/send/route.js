export const runtime = "nodejs";

import fs from "fs";
import path from "path";
import { sendNotifyEmail } from "@/lib/mailer";

const SUB_FILE = path.join(process.cwd(), "private/data/newsletter.json");

function readList() {
    if (!fs.existsSync(SUB_FILE)) return [];
    return JSON.parse(fs.readFileSync(SUB_FILE, "utf8") || "[]");
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

export async function POST(req) {
    // ✅ simple protection
    const secret = req.headers.get("x-newsletter-secret");
    if (!process.env.NEWSLETTER_SECRET || secret !== process.env.NEWSLETTER_SECRET) {
        return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { subject, html, text } = await req.json();

    if (!subject || !html) {
        return Response.json({ ok: false, message: "subject & html required" }, { status: 400 });
    }

    const emails = readList();

    let sent = 0;
    for (const to of emails) {
        await sendNotifyEmail({
            to, // ✅ subscriber email
            subject,
            text: text || "New update from Mukul.dev",
            html: html.replaceAll("{{email}}", to),
        });

        sent++;
        // ✅ Gmail SMTP limit safe (small delay)
        await sleep(400);
    }

    return Response.json({ ok: true, sent });
}
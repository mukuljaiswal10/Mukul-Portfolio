export const runtime = "nodejs";

import { redis } from "@/lib/redis";
import { sendNotifyEmail } from "@/lib/mailer";

export async function POST(req) {
    const { email } = await req.json();
    const cleaned = String(email || "").trim().toLowerCase();

    if (!cleaned || !cleaned.includes("@")) {
        return Response.json({ ok: false, message: "Invalid email" }, { status: 400 });
    }

    // ✅ SADD returns 1 if added, 0 if already existed
    const added = await redis.sadd("newsletter:subs", cleaned);

    // ✅ Notify only when it's a NEW subscriber
    if (added === 1) {
        try {
            await sendNotifyEmail({
                subject: "📩 New Newsletter Subscriber",
                text: `New subscriber: ${cleaned}\nTime: ${new Date().toLocaleString()}`,
                html: `<h2>New Newsletter Subscriber 📩</h2>
              <p><b>Email:</b> ${cleaned}</p>
              <p><b>Time:</b> ${new Date().toLocaleString()}</p>`,
            });
        } catch { }
    }

    return Response.json({ ok: true, isNew: added === 1 });
}

export async function GET() {
    return Response.json({ ok: true, message: "Use POST to subscribe" });
}
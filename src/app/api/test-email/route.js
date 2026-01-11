export const runtime = "nodejs";

import { sendNotifyEmail } from "@/lib/mailer";

export async function GET() {
    try {
        await sendNotifyEmail({
            subject: "✅ Test email from Mukul.dev",
            text: "SMTP working test.",
            html: "<h2>Test Email ✅</h2><p>If you received this, SMTP is working.</p>",
        });

        return Response.json({ ok: true });
    } catch (e) {
        return Response.json(
            { ok: false, error: String(e?.message || e) },
            { status: 500 }
        );
    }
}
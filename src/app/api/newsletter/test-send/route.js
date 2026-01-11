export const runtime = "nodejs";

import { resend } from "@/lib/resend";

export async function GET(req) {
    const auth = req.headers.get("authorization") || "";
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const to = searchParams.get("to");

    if (!to) {
        return Response.json({ ok: false, message: "Pass ?to=email" }, { status: 400 });
    }

    const from = process.env.RESEND_FROM || process.env.RESEND_FROM_EMAIL;

    const { data, error } = await resend.emails.send({
        from,
        to,
        subject: "✅ Resend Single Test from Mukul.dev",
        html: "<h2>Test ✅</h2><p>If you received this, Resend sending works.</p>",
    });

    if (error) {
        return Response.json({ ok: false, error }, { status: 500 });
    }

    return Response.json({ ok: true, data });
}
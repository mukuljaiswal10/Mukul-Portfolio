// export const runtime = "nodejs";

// import { redis } from "@/lib/redis";
// import { resend } from "@/lib/resend";

// export async function POST(req) {
//     const { email } = await req.json();
//     const cleaned = String(email || "").trim().toLowerCase();

//     if (!cleaned || !cleaned.includes("@")) {
//         return Response.json({ ok: false, message: "Invalid email" }, { status: 400 });
//     }

//     // ✅ Unique subscribers set
//     await redis.sadd("newsletter:subs", cleaned); // set based save  [oai_citation:1‡Upstash: Serverless Data Platform](https://upstash.com/docs/redis/sdks/ts/commands/set/smembers?utm_source=chatgpt.com)

//     // ✅ Optional: admin notify (tumhe email)
//     // (Agar nahi chahiye to is block ko remove kar sakte ho)
//     const adminTo = process.env.FEEDBACK_NOTIFY_TO || process.env.EMAIL_TO || process.env.CONTACT_TO;
//     const from = process.env.RESEND_FROM || process.env.RESEND_FROM_EMAIL;

//     if (adminTo && from) {
//         try {
//             await resend.emails.send({
//                 from,
//                 to: adminTo,
//                 subject: "📩 New Newsletter Subscriber",
//                 html: `<p><b>Email:</b> ${cleaned}</p><p><b>Time:</b> ${new Date().toLocaleString()}</p>`,
//             });
//         } catch {
//             // ignore notify errors
//         }
//     }

//     return Response.json({ ok: true });
// }

// export async function GET() {
//     return Response.json({ ok: true, message: "Use POST to subscribe" });
// }










export const runtime = "nodejs";

import { redis } from "@/lib/redis";

export async function GET(req) {
    const auth = req.headers.get("authorization") || "";
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const subs = await redis.smembers("newsletter:subs");
    return Response.json({
        ok: true,
        count: subs.length,
        subs: subs.slice(0, 50), // first 50 only
    });
}
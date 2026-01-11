export const runtime = "nodejs";

import { redis } from "@/lib/redis";

export async function POST(req) {
    const auth = req.headers.get("authorization") || "";
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    await redis.del("newsletter:lastSentSlug");
    return Response.json({ ok: true, message: "Reset done" });
}
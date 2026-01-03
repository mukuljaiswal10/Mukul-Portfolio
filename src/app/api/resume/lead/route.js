import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

const redis = Redis.fromEnv();

function randToken() {
    return (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`)
        .toString()
        .replaceAll(".", "");
}

function safeJson(v) {
    if (!v) return null;
    if (typeof v === "string") {
        try { return JSON.parse(v); } catch { return null; }
    }
    // upstash sometimes returns object directly
    return v;
}

export async function POST(req) {
    try {
        const sid = req.cookies.get("rg_sid")?.value;
        if (!sid) {
            return NextResponse.json(
                { ok: false, message: "OTP session missing. Please verify OTP again." },
                { status: 401 }
            );
        }

        const sessionRaw = await redis.get(`rg:sid:${sid}`);
        const session = safeJson(sessionRaw);

        if (!session?.email) {
            return NextResponse.json(
                { ok: false, message: "OTP session expired. Please verify OTP again." },
                { status: 401 }
            );
        }

        // body read (optional)
        await req.json().catch(() => ({}));

        // optional anti-spam (safe)
        const rlKey = `rl:lead:${session.email}`;
        const count = await redis.incr(rlKey);
        if (count === 1) await redis.expire(rlKey, 10 * 60);
        if (count > 10) {
            return NextResponse.json(
                { ok: false, message: "Too many requests. Try later." },
                { status: 429 }
            );
        }

        // ✅ single-use download token (cookie-bound)
        const token = randToken();
        await redis.set(
            `rg:dl:${token}`,
            JSON.stringify({
                sid,
                rid: session.rid,
                used: false,
                createdAt: Date.now(),
            }),
            { ex: 10 * 60 }
        );

        return NextResponse.json({
            ok: true,
            resumeUrl: `/api/resume/download?token=${token}`,
            message: "Lead saved. Resume link generated.",
        });
    } catch (e) {
        console.error("Lead error:", e);
        return NextResponse.json({ ok: false, message: "Server error." }, { status: 500 });
    }
}
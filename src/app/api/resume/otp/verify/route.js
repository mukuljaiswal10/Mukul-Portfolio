import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

export const runtime = "nodejs";

const redis = Redis.fromEnv();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normEmail(email = "") {
    return String(email).trim().toLowerCase();
}

function otpHash(email, otp) {
    const secret = process.env.OTP_SECRET || "dev_secret_change_me";
    return crypto.createHmac("sha256", secret).update(`${email}:${otp}`).digest("hex");
}

function randId() {
    return (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`)
        .toString()
        .replaceAll(".", "");
}

export async function POST(req) {
    try {
        const body = await req.json().catch(() => ({}));
        const email = normEmail(body?.email);
        const otp = String(body?.otp || "").trim();

        if (!EMAIL_RE.test(email)) {
            return NextResponse.json({ ok: false, message: "Invalid email." }, { status: 400 });
        }
        if (!/^\d{4}$/.test(otp)) {
            return NextResponse.json({ ok: false, message: "Invalid OTP." }, { status: 400 });
        }

        // ✅ block check (5 min)
        const blockKey = `otp:block:${email}`;
        const blocked = await redis.get(blockKey);
        if (blocked) {
            return NextResponse.json(
                { ok: false, message: "Too many wrong attempts. Try again after 5 minutes." },
                { status: 429 }
            );
        }

        // ✅ read stored otp hash
        const codeKey = `otp:code:${email}`;
        const saved = await redis.get(codeKey);
        if (!saved) {
            return NextResponse.json(
                { ok: false, message: "OTP expired. Please request again." },
                { status: 401 }
            );
        }

        // ✅ compare
        const incoming = otpHash(email, otp);
        if (incoming !== saved) {
            // ✅ attempts limit: 3 tries within 5 min
            const attKey = `otp:attempts:${email}`;
            const tries = await redis.incr(attKey);
            if (tries === 1) await redis.expire(attKey, 5 * 60);

            if (tries >= 3) {
                await redis.set(blockKey, "1", { ex: 5 * 60 }); // 5 min block
                await redis.del(attKey);
                return NextResponse.json(
                    { ok: false, message: "OTP not correct. You are blocked for 5 minutes." },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { ok: false, message: `OTP not correct. (${tries}/3)` },
                { status: 401 }
            );
        }

        // ✅ SUCCESS: make otp single-use (delete it)
        await redis.del(codeKey);
        await redis.del(`otp:attempts:${email}`);
        await redis.del(blockKey);

        // ✅ create session cookie (this is what blocks incognito/paste link)
        const sid = randId();
        const rid = String(body?.rid || "").trim() || randId();

        // store session -> email + rid (ttl 10 min)
        await redis.set(`rg:sid:${sid}`, JSON.stringify({ email, rid }), { ex: 10 * 60 });

        const res = NextResponse.json({ ok: true, rid, message: "OTP verified." });

        res.cookies.set("rg_sid", sid, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 10 * 60, // 10 min
        });

        return res;
    } catch (e) {
        console.error("OTP verify error:", e);
        return NextResponse.json({ ok: false, message: "Server error." }, { status: 500 });
    }
}
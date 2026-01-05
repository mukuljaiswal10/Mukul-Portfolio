import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { cookies, headers } from "next/headers";

const redis = Redis.fromEnv();

// ---- helpers
function slugKey(s) {
    return decodeURIComponent(String(s || ""))
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function getIP() {
    const h = headers();
    const xf = h.get("x-forwarded-for");
    if (xf) return xf.split(",")[0].trim();
    return h.get("x-real-ip") || "unknown";
}

function getOrSetUID(res) {
    const store = cookies();
    let uid = store.get("pf_uid")?.value;

    if (!uid) {
        uid = crypto.randomUUID();
        // 180 days cookie
        res.cookies.set("pf_uid", uid, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 180,
        });
    }

    return uid;
}

async function getStats(slug, uid) {
    const likeKey = `pf:likes:${slug}`;
    const rSumKey = `pf:ratingSum:${slug}`;
    const rCountKey = `pf:ratingCount:${slug}`;
    const rHashKey = `pf:ratings:${slug}`;
    const fbKey = `pf:feedback:${slug}`;

    const [likes, sum, count, viewerLiked, viewerRated, recent] =
        await Promise.all([
            redis.scard(likeKey),
            redis.get(rSumKey),
            redis.get(rCountKey),
            uid ? redis.sismember(likeKey, uid) : false,
            uid ? redis.hexists(rHashKey, uid) : false,
            redis.lrange(fbKey, 0, 9),
        ]);

    const ratingSum = Number(sum || 0);
    const ratingCount = Number(count || 0);
    const avgRating =
        ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 10) / 10 : 0;

    const parsed = (recent || [])
        .map((x) => {
            try {
                return JSON.parse(x);
            } catch {
                return null;
            }
        })
        .filter(Boolean);

    return {
        likes: Number(likes || 0),
        avgRating,
        ratingCount,
        viewerLiked: Boolean(viewerLiked),
        viewerRated: Boolean(viewerRated),
        recentFeedback: parsed,
    };
}

async function rateLimitOrThrow(slug) {
    const ip = getIP();
    const key = `pf:rl:${ip}:${slug}`;
    const n = await redis.incr(key);
    if (n === 1) await redis.expire(key, 60); // 60s window
    if (n > 25) {
        return NextResponse.json(
            { error: "Too many requests. Try again in a minute." },
            { status: 429 }
        );
    }
    return null;
}

// ---- GET: stats
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const slug = slugKey(searchParams.get("slug"));
    if (!slug) {
        return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    // rate limit
    const rl = await rateLimitOrThrow(slug);
    if (rl) return rl;

    const res = NextResponse.json({ ok: true });
    const uid = getOrSetUID(res);

    const stats = await getStats(slug, uid);
    res.headers.set("cache-control", "no-store");
    return NextResponse.json({ ok: true, slug, ...stats }, { headers: res.headers });
}

// ---- POST: like / rating / feedback
export async function POST(req) {
    const body = await req.json().catch(() => ({}));
    const slug = slugKey(body.slug);
    const type = String(body.type || "").toLowerCase();

    if (!slug || !type) {
        return NextResponse.json({ error: "Missing slug/type" }, { status: 400 });
    }

    const rl = await rateLimitOrThrow(slug);
    if (rl) return rl;

    const res = NextResponse.json({ ok: true });
    const uid = getOrSetUID(res);

    const likeKey = `pf:likes:${slug}`;
    const rSumKey = `pf:ratingSum:${slug}`;
    const rCountKey = `pf:ratingCount:${slug}`;
    const rHashKey = `pf:ratings:${slug}`;
    const fbKey = `pf:feedback:${slug}`;
    const userKey = `pf:user:${uid}`;

    if (type === "like") {
        // toggle like
        const added = await redis.sadd(likeKey, uid);
        if (added === 0) {
            await redis.srem(likeKey, uid);
        }
    }

    if (type === "rating") {
        const rating = Number(body.rating || 0);
        const name = String(body.name || "").trim().slice(0, 50);
        const email = String(body.email || "").trim().slice(0, 80);

        if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
        }

        const already = await redis.hexists(rHashKey, uid);
        if (already) {
            return NextResponse.json(
                { error: "You already rated this project." },
                { status: 409 }
            );
        }

        await Promise.all([
            redis.hset(rHashKey, { [uid]: String(rating) }),
            redis.incrby(rSumKey, rating),
            redis.incr(rCountKey),
            name || email ? redis.set(userKey, JSON.stringify({ name, email })) : null,
        ]);
    }

    if (type === "feedback") {
        const message = String(body.message || "").trim().slice(0, 600);
        const rating = body.rating ? Number(body.rating) : null;
        const name = String(body.name || "").trim().slice(0, 50);
        const email = String(body.email || "").trim().slice(0, 80);

        if (!message || message.length < 3) {
            return NextResponse.json(
                { error: "Feedback is too short." },
                { status: 400 }
            );
        }

        // store feedback entry (who + what)
        const entry = {
            uid,
            name: name || "Anonymous",
            email: email || "",
            rating: Number.isFinite(rating) ? rating : null,
            message,
            createdAt: new Date().toISOString(),
        };

        await Promise.all([
            redis.lpush(fbKey, JSON.stringify(entry)),
            redis.ltrim(fbKey, 0, 49), // keep last 50
            name || email ? redis.set(userKey, JSON.stringify({ name, email })) : null,
        ]);
    }

    const stats = await getStats(slug, uid);
    res.headers.set("cache-control", "no-store");
    return NextResponse.json({ ok: true, slug, ...stats }, { headers: res.headers });
}
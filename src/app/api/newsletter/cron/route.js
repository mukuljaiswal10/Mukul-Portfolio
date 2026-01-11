export const runtime = "nodejs";

import { redis } from "@/lib/redis";
import { blogPosts } from "@/data/blogPosts";
import { sendEmail } from "@/lib/mailer";

function authOK(req) {
    const secret = process.env.CRON_SECRET;
    if (!secret) return false;

    const auth = req.headers.get("authorization") || "";
    if (auth === `Bearer ${secret}`) return true;

    const { searchParams } = new URL(req.url);
    return searchParams.get("secret") === secret;
}

function getSiteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

function getLatestPost() {
    const posts = [...blogPosts].filter((p) => p && p.slug);

    // Optional: agar tum status field add karoge to drafts ignore
    const published = posts.filter((p) => (p.status ? p.status === "published" : true));

    published.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return published[0] || null;
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

export async function GET(req) {
    if (!authOK(req)) {
        return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const latest = getLatestPost();
    if (!latest) {
        return Response.json({ ok: false, message: "No posts found" }, { status: 400 });
    }

    // ✅ prevent duplicate sends
    const lastSentSlug = await redis.get("newsletter:lastSentSlug");
    if (lastSentSlug === latest.slug) {
        return Response.json({ ok: true, message: "Already notified", slug: latest.slug });
    }

    const siteUrl = getSiteUrl();
    const postUrl = `${siteUrl}/blog/${latest.slug}`;

    // ✅ subscribers list (Upstash Redis)
    const subs = await redis.smembers("newsletter:subs");
    if (!subs?.length) {
        return Response.json({ ok: true, message: "No subscribers", slug: latest.slug });
    }

    const subject = `New Blog: ${latest.title}`;
    const tags = (latest.tags || []).join(", ");
    const excerpt = latest.excerpt || "";

    const makeHtml = (to) => `
    <div style="font-family:Arial;line-height:1.6">
      <h2>${latest.title}</h2>
      <p>${excerpt}</p>
      <p><b>Category:</b> ${latest.category || "Blog"}</p>
      ${tags ? `<p><b>Tags:</b> ${tags}</p>` : ""}
      <p><a href="${postUrl}">Read full post →</a></p>
      <hr/>
      <p style="font-size:12px;color:#777">You received this because you subscribed (${to}).</p>
    </div>
  `;

    let sent = 0;
    const failed = [];

    // ✅ Gmail SMTP sending (good for small subscriber list)
    for (const to of subs) {
        try {
            await sendEmail({
                to,
                subject,
                text: `New post is live: ${postUrl}`,
                html: makeHtml(to),
            });
            sent++;

            // small delay to avoid Gmail limits
            await sleep(700);
        } catch (e) {
            failed.push({ to, error: String(e?.message || e) });
        }
    }

    // ✅ mark latest as notified only if at least 1 sent
    if (sent > 0) {
        await redis.set("newsletter:lastSentSlug", latest.slug);
    }

    return Response.json({
        ok: true,
        sent,
        failedCount: failed.length,
        failed: failed.slice(0, 5), // only first 5 errors (debug)
        slug: latest.slug,
        url: postUrl,
    });
}
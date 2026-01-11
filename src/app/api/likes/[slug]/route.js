export const runtime = "nodejs";

import fs from "fs";
import path from "path";
import { sendNotifyEmail } from "@/lib/mailer";
import { blogPosts } from "@/data/blogPosts";

const FILE = path.join(process.cwd(), "private/data/likes.json");

function readJson() {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, "utf8") || "{}");
}
function writeJson(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function escapeHtml(str) {
    return String(str || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getPostMeta(slug) {
    const p = blogPosts?.find((x) => x?.slug === slug);
    return {
        title: p?.title || slug,
        category: p?.category || "Blog",
        tags: Array.isArray(p?.tags) ? p.tags : [],
    };
}

export async function GET(req, ctx) {
    const { slug } = await ctx.params; // ✅ Next 16 compatible

    if (!slug || slug === "undefined") {
        return Response.json({ ok: false, message: "Missing slug" }, { status: 400 });
    }

    const store = readJson();
    const count = store[slug] ?? 0;
    return Response.json({ count });
}

export async function POST(req, ctx) {
    const { slug } = await ctx.params; // ✅ Next 16 compatible

    if (!slug || slug === "undefined") {
        return Response.json({ ok: false, message: "Missing slug" }, { status: 400 });
    }

    const store = readJson();
    store[slug] = (store[slug] ?? 0) + 1;
    writeJson(store);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const postUrl = `${siteUrl}/blog/${slug}`;

    const meta = getPostMeta(slug);
    const tagsText = meta.tags.length ? meta.tags.join(", ") : "—";
    const time = new Date().toLocaleString();

    const subject = `👍 New Like — ${meta.title}`;

    const html = `
  <div style="margin:0;padding:0;background:#0b0f1a;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:620px;margin:0 auto;padding:24px;">
      <div style="border:1px solid rgba(231,194,102,0.25);border-radius:18px;overflow:hidden;background:rgba(255,255,255,0.03);">
        <div style="padding:18px 18px 14px 18px;border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:42px;height:42px;border-radius:12px;background:rgba(231,194,102,0.12);border:1px solid rgba(231,194,102,0.25);display:flex;align-items:center;justify-content:center;font-size:20px;">
              👍
            </div>
            <div>
              <div style="color:#E7C266;font-weight:700;font-size:16px;letter-spacing:0.3px;">
                New Like Received
              </div>
              <div style="color:rgba(255,255,255,0.65);font-size:12px;margin-top:2px;">
                Mukul.dev • ${time}
              </div>
            </div>
          </div>
        </div>

        <div style="padding:18px;">
          <div style="color:rgba(255,255,255,0.9);font-size:14px;margin-bottom:10px;">
            Someone liked your blog post:
          </div>

          <div style="padding:14px;border-radius:14px;background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.08);">
            <div style="color:#fff;font-weight:700;font-size:16px;line-height:1.35;">
              ${escapeHtml(meta.title)}
            </div>
            <div style="margin-top:8px;color:rgba(255,255,255,0.7);font-size:13px;">
              <b style="color:rgba(255,255,255,0.85);">Category:</b> ${escapeHtml(meta.category)}<br/>
              <b style="color:rgba(255,255,255,0.85);">Tags:</b> ${escapeHtml(tagsText)}<br/>
              <b style="color:rgba(255,255,255,0.85);">Slug:</b> ${escapeHtml(slug)}<br/>
              <b style="color:rgba(255,255,255,0.85);">Total Likes:</b> ${store[slug]}
            </div>
          </div>

          <div style="margin-top:14px;text-align:center;">
            <a href="${postUrl}" style="display:inline-block;padding:11px 16px;border-radius:999px;text-decoration:none;
              background:rgba(231,194,102,0.12);border:1px solid rgba(231,194,102,0.35);color:#E7C266;font-weight:700;">
              Open Post →
            </a>
          </div>

          <div style="margin-top:16px;color:rgba(255,255,255,0.55);font-size:12px;text-align:center;">
            You’re receiving this because you enabled like notifications.
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

    const text = `New Like 👍
Post: ${meta.title}
Category: ${meta.category}
Tags: ${tagsText}
Slug: ${slug}
Total Likes: ${store[slug]}
Open: ${postUrl}
Time: ${time}
`;

    await sendNotifyEmail({ subject, html, text });

    return Response.json({ count: store[slug] });
}
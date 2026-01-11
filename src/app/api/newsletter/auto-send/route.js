export const runtime = "nodejs";

import fs from "fs";
import path from "path";
import { blogPosts } from "@/data/blogPosts";
import { sendNotifyEmail } from "@/lib/mailer";

const SUB_FILE = path.join(process.cwd(), "private/data/newsletter.json");
const STATE_FILE = path.join(process.cwd(), "private/data/newsletter_state.json");

function readList() {
    if (!fs.existsSync(SUB_FILE)) return [];
    return JSON.parse(fs.readFileSync(SUB_FILE, "utf8") || "[]");
}

function readState() {
    if (!fs.existsSync(STATE_FILE)) return { lastSentSlug: "" };
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8") || "{}");
}

function writeState(state) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function getLatestPost() {
    const posts = [...blogPosts].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return posts[0] || null;
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

export async function POST(req) {
    const secret = req.headers.get("x-newsletter-secret");
    if (!process.env.NEWSLETTER_SECRET || secret !== process.env.NEWSLETTER_SECRET) {
        return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const latest = getLatestPost();
    if (!latest) return Response.json({ ok: false, message: "No posts found" }, { status: 400 });

    const state = readState();
    if (state.lastSentSlug === latest.slug) {
        return Response.json({ ok: true, message: "Already sent for latest post", slug: latest.slug });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const postUrl = `${siteUrl}/blog/${latest.slug}`;

    const emails = readList();
    for (const to of emails) {
        await sendNotifyEmail({
            to,
            subject: `New Blog: ${latest.title} 🚀`,
            text: `New post is live: ${postUrl}`,
            html: `
        <h2>Hello ${to} 👋</h2>
        <p>New post is live on Mukul.dev:</p>
        <p><b>${latest.title}</b></p>
        <p>${latest.excerpt || ""}</p>
        <p><a href="${postUrl}">Read Now</a></p>
      `,
        });
        await sleep(400);
    }

    // ✅ mark as sent
    writeState({ lastSentSlug: latest.slug });

    return Response.json({ ok: true, sent: emails.length, slug: latest.slug, url: postUrl });
}
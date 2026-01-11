export const runtime = "nodejs";

import fs from "fs";
import path from "path";
import { sendNotifyEmail } from "@/lib/mailer";

const FILE = path.join(process.cwd(), "private/data/comments.json");

function readStore() {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, "utf8") || "{}");
}
function writeStore(store) {
    fs.writeFileSync(FILE, JSON.stringify(store, null, 2));
}

export async function GET(req, ctx) {
    const { slug } = await ctx.params; // ✅ Next 16 compatible

    if (!slug || slug === "undefined") {
        return Response.json({ ok: false, message: "Missing slug" }, { status: 400 });
    }

    const store = readStore();
    return Response.json({ ok: true, comments: store[slug] ?? [] });
}

export async function POST(req, ctx) {
    const { slug } = await ctx.params; // ✅ Next 16 compatible

    if (!slug || slug === "undefined") {
        return Response.json({ ok: false, message: "Missing slug" }, { status: 400 });
    }

    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const message = String(body.message || "").trim();

    if (!name || !message) {
        return Response.json(
            { ok: false, message: "Name & message required" },
            { status: 400 }
        );
    }

    const store = readStore();
    store[slug] = store[slug] ?? [];

    const comment = {
        id: `${Date.now()}`,
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
    };

    store[slug].unshift(comment);
    writeStore(store);

    // ✅ notify you
    await sendNotifyEmail({
        subject: `💬 New Comment — ${slug}`,
        text: `Post: ${slug}\nFrom: ${name} (${email || "no email"})\nMessage: ${message}`,
        html: `<h2>New Comment 💬</h2>
           <p><b>Post:</b> ${slug}</p>
           <p><b>From:</b> ${name} ${email ? `(${email})` : ""}</p>
           <p><b>Message:</b><br/>${message.replace(/\n/g, "<br/>")}</p>`,
    });

    return Response.json({ ok: true, comment });
}
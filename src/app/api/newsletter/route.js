export const runtime = "nodejs";

import fs from "fs";
import path from "path";
import { sendNotifyEmail } from "@/lib/mailer";

const FILE = path.join(process.cwd(), "private/data/newsletter.json");

function readList() {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf8") || "[]");
}
function writeList(list) {
    fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
}

export async function POST(req) {
    const { email } = await req.json();
    const cleaned = String(email || "").trim().toLowerCase();

    if (!cleaned || !cleaned.includes("@")) {
        return Response.json({ ok: false, message: "Invalid email" }, { status: 400 });
    }

    const list = readList();
    const isNew = !list.includes(cleaned);

    if (isNew) {
        list.push(cleaned);
        writeList(list);
    }

    await sendNotifyEmail({
        subject: `📩 Newsletter Signup: ${cleaned}`,
        text: `Email: ${cleaned}\nNew: ${isNew}\nTotal: ${list.length}`,
        html: `
      <h2>Newsletter Signup 📩</h2>
      <p><b>Email:</b> ${cleaned}</p>
      <p><b>New subscriber:</b> ${isNew ? "Yes" : "No (already exists)"}</p>
      <p><b>Total subscribers:</b> ${list.length}</p>
      <p><b>Time:</b> ${new Date().toLocaleString()}</p>
    `,
    });

    return Response.json({ ok: true, isNew, total: list.length });
}

export async function GET() {
    return Response.json({ ok: true, message: "Use POST to subscribe" });
}
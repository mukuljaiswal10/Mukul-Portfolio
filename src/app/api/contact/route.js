export const runtime = "nodejs";

import nodemailer from "nodemailer";

function isEmail(v = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
}

function safeText(v = "", max = 2000) {
  return String(v || "").replace(/\s+/g, " ").trim().slice(0, max);
}

export async function POST(req) {
  try {
    const body = await req.json();

    // ✅ honeypot (spam bots)
    if (body?.companyWebsite) {
      return Response.json({ ok: true }, { status: 200 });
    }

    const name = safeText(body?.name, 80);
    const email = safeText(body?.email, 120);
    const message = safeText(body?.message, 2000);
    const projectType = safeText(body?.projectType, 60);
    const budget = safeText(body?.budget, 60);
    const timeline = safeText(body?.timeline, 60);
    const source = safeText(body?.source, 120);
    const page = safeText(body?.page, 120);

    if (!name || name.length < 2) {
      return Response.json({ ok: false, error: "Name is required." }, { status: 400 });
    }
    if (!isEmail(email)) {
      return Response.json({ ok: false, error: "Valid email is required." }, { status: 400 });
    }
    if (!message || message.length < 10) {
      return Response.json({ ok: false, error: "Message must be at least 10 characters." }, { status: 400 });
    }

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      CONTACT_TO,
      CONTACT_FROM,
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO || !CONTACT_FROM) {
      return Response.json(
        {
          ok: false,
          error:
            "Server is missing email config. Please set SMTP_* and CONTACT_* env variables.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // 465 true, 587 false
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const subject = `New Contact: ${name} (${projectType || "General"})`;

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2 style="margin:0 0 10px">New message from portfolio</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Project Type:</b> ${projectType || "-"}</p>
        <p><b>Budget:</b> ${budget || "-"}</p>
        <p><b>Timeline:</b> ${timeline || "-"}</p>
        <p><b>Source:</b> ${source || "-"}</p>
        <p><b>Page:</b> ${page || "-"}</p>
        <hr/>
        <p style="white-space:pre-wrap"><b>Message:</b><br/>${message}</p>
      </div>
    `;

    await transporter.sendMail({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject,
      html,
    });

    return Response.json({ ok: true }, { status: 200 });
  } catch (err) {
    return Response.json(
      { ok: false, error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
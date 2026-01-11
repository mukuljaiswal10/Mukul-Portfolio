import nodemailer from "nodemailer";

function getTransport() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: String(process.env.SMTP_SECURE || "true") === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

// ✅ New function (used by newsletter cron SMTP)
export async function sendEmail({ to, subject, text, html }) {
    const transporter = getTransport();
    const from = process.env.SMTP_USER;

    await transporter.sendMail({
        from: `Mukul.dev <${from}>`,
        to,
        subject,
        text,
        html,
    });
}

// ✅ Backward compatible alias (used by old likes/comments routes)
export async function sendNotifyEmail({ subject, text, html }) {
    const to = process.env.EMAIL_TO || process.env.CONTACT_TO || process.env.FEEDBACK_NOTIFY_TO;
    if (!to) throw new Error("EMAIL_TO (or CONTACT_TO/FEEDBACK_NOTIFY_TO) missing in env");

    return sendEmail({ to, subject, text, html });
}
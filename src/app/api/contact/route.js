export async function POST(req) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !message) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    // ✅ Here you can integrate email service later (Resend/Nodemailer/etc.)
    // For now: server receives message successfully.
    console.log("CONTACT_FORM:", { name, email, message });

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
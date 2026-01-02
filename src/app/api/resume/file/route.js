export const runtime = "nodejs";

import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return new Response("Missing token", { status: 401 });
        }

        const secret = process.env.RESUME_JWT_SECRET;
        if (!secret) return new Response("Server misconfigured", { status: 500 });

        // ✅ verify token
        jwt.verify(token, secret);

        // ✅ read private PDF
        const filePath = path.join(process.cwd(), "private", "resume.pdf");
        const pdfBuffer = await fs.readFile(filePath);

        return new Response(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                // inline = browser me open, attachment = direct download
                "Content-Disposition": 'inline; filename="Mukul-Jaiswal-Resume.pdf"',
                "Cache-Control": "no-store",
            },
        });
    } catch (err) {
        return new Response("Unauthorized / Expired token", { status: 401 });
    }
}
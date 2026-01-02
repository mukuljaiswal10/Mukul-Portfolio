import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return new Response("Missing token", { status: 401 });
        }

        const secret = process.env.RESUME_JWT_SECRET;
        if (!secret) return new Response("Server misconfigured", { status: 500 });

        // token verify (expiry included)
        jwt.verify(token, secret);

        const filePath = path.join(process.cwd(), "private", "resume.pdf");
        if (!fs.existsSync(filePath)) {
            return new Response("Resume not found", { status: 404 });
        }

        const file = fs.readFileSync(filePath);

        return new Response(file, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                // inline => new tab me view
                "Content-Disposition": `inline; filename="Mukul-Jaiswal-Resume.pdf"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (err) {
        return new Response("Invalid/Expired token", { status: 401 });
    }
}
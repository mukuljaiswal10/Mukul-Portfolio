// import { NextResponse } from "next/server";
// import { Redis } from "@upstash/redis";
// import fs from "fs";
// import path from "path";

// export const runtime = "nodejs";

// const redis = Redis.fromEnv();

// export async function GET(req) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const token = searchParams.get("token");

//         if (!token) {
//             return NextResponse.json({ ok: false, message: "Missing token." }, { status: 400 });
//         }

//         // ✅ must have same browser cookie
//         const sid = req.cookies.get("rg_sid")?.value;
//         if (!sid) {
//             return NextResponse.json(
//                 { ok: false, message: "Unauthorized (session missing)." },
//                 { status: 401 }
//             );
//         }

//         const raw = await redis.get(`rg:dl:${token}`);
//         if (!raw) {
//             return NextResponse.json(
//                 { ok: false, message: "Link expired or invalid." },
//                 { status: 410 }
//             );
//         }

//         const data = JSON.parse(raw); // { sid, rid, used, createdAt }

//         // ✅ cookie-bound protection: incognito/new device will FAIL here
//         if (data.sid !== sid) {
//             return NextResponse.json(
//                 { ok: false, message: "Unauthorized (different session)." },
//                 { status: 401 }
//             );
//         }

//         // ✅ single-use
//         if (data.used) {
//             return NextResponse.json(
//                 { ok: false, message: "This link was already used." },
//                 { status: 410 }
//             );
//         }

//         // ✅ mark used (atomic-ish)
//         data.used = true;
//         await redis.set(`rg:dl:${token}`, JSON.stringify(data), { ex: 10 * 60 });

//         // ✅ Serve PDF from private folder (NOT /public)
//         // Put your file here: <projectRoot>/private/resume.pdf
//         const filePath =
//             process.env.RESUME_FILE_PATH ||
//             path.join(process.cwd(), "private", "resume.pdf");

//         if (!fs.existsSync(filePath)) {
//             return NextResponse.json(
//                 { ok: false, message: "Resume file not found on server." },
//                 { status: 500 }
//             );
//         }

//         const fileBuffer = fs.readFileSync(filePath);

//         return new NextResponse(fileBuffer, {
//             status: 200,
//             headers: {
//                 "Content-Type": "application/pdf",
//                 "Content-Disposition": `inline; filename="resume.pdf"`,
//                 "Cache-Control": "no-store",
//             },
//         });
//     } catch (e) {
//         console.error("Download error:", e);
//         return NextResponse.json({ ok: false, message: "Server error." }, { status: 500 });
//     }
// }

















import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const redis = Redis.fromEnv();

function safeJson(v) {
    if (!v) return null;

    // Upstash can return either stringified JSON or object
    if (typeof v === "string") {
        try {
            return JSON.parse(v);
        } catch {
            return null;
        }
    }

    if (typeof v === "object") return v;

    return null;
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json(
                { ok: false, message: "Missing token." },
                { status: 400 }
            );
        }

        // ✅ must have same browser cookie
        const sid = req.cookies.get("rg_sid")?.value;
        if (!sid) {
            return NextResponse.json(
                { ok: false, message: "Unauthorized (session missing)." },
                { status: 401 }
            );
        }

        const raw = await redis.get(`rg:dl:${token}`);
        const data = safeJson(raw); // { sid, rid, used, createdAt }

        if (!data) {
            return NextResponse.json(
                { ok: false, message: "Link expired or invalid." },
                { status: 410 }
            );
        }

        // ✅ cookie-bound protection: incognito/new device will FAIL here
        if (data.sid !== sid) {
            return NextResponse.json(
                { ok: false, message: "Unauthorized (different session)." },
                { status: 401 }
            );
        }

        // ✅ single-use
        if (data.used) {
            return NextResponse.json(
                { ok: false, message: "This link was already used." },
                { status: 410 }
            );
        }

        // ✅ mark used (keep TTL)
        data.used = true;
        await redis.set(`rg:dl:${token}`, JSON.stringify(data), { ex: 10 * 60 });

        // ✅ Serve PDF from private folder (NOT /public)
        const filePath =
            process.env.RESUME_FILE_PATH ||
            path.join(process.cwd(), "private", "resume.pdf");

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { ok: false, message: "Resume file not found on server." },
                { status: 500 }
            );
        }

        const fileBuffer = fs.readFileSync(filePath);

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="resume.pdf"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (e) {
        console.error("Download error:", e);
        return NextResponse.json(
            { ok: false, message: "Server error." },
            { status: 500 }
        );
    }
}
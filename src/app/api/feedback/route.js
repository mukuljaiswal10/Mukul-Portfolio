// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// import { NextResponse } from "next/server";
// import { cookies, headers } from "next/headers";
// import { prisma } from "@/lib/prisma";
// import crypto from "crypto";
// import { Resend } from "resend";

// /** ---------- helpers ---------- */
// function normScope(v) {
//     const s = String(v || "").trim().toLowerCase();
//     return s === "blog" ? "blog" : "project";
// }

// function normSlug(v) {
//     return String(v || "")
//         .trim()
//         .toLowerCase()
//         .replace(/%20/g, "-")
//         .replace(/\s+/g, "-")
//         .replace(/-+/g, "-")
//         .replace(/^-|-$/g, "");
// }

// function clip(v, max) {
//     const s = String(v ?? "").trim();
//     if (!s) return null;
//     return s.length > max ? s.slice(0, max) : s;
// }

// function toBool(v) {
//     if (v === true || v === false) return v;
//     if (typeof v === "string") {
//         const s = v.trim().toLowerCase();
//         if (s === "true") return true;
//         if (s === "false") return false;
//     }
//     return null;
// }

// function toNumberOrNull(v) {
//     if (v === null || v === undefined || v === "") return null;
//     const n = Number(v);
//     return Number.isFinite(n) ? n : null;
// }

// const ALLOWED_ACTIONS = new Set([
//     // old
//     "like",
//     "unlike",
//     "rating_set",
//     "rating_clear",
//     "feedback_set",
//     "feedback_clear",
//     "reset_all",
//     // new (single-form)
//     "submit",
// ]);

// async function getClientIp() {
//     const h = await headers();
//     const xff = h.get("x-forwarded-for");
//     if (xff) return xff.split(",")[0].trim();
//     return h.get("x-real-ip") || "";
// }

// async function getOrSetVisitorId() {
//     const jar = await cookies(); // ✅ Next 15+ async
//     const existing = jar.get("mukul_vid")?.value;
//     if (existing) return { id: existing, isNew: false };

//     const id = crypto.randomUUID();
//     jar.set("mukul_vid", id, {
//         httpOnly: true,
//         sameSite: "lax",
//         secure: process.env.NODE_ENV === "production",
//         path: "/",
//         maxAge: 60 * 60 * 24 * 365,
//     });
//     return { id, isNew: true };
// }

// /** ---------- Email (Resend) ---------- */
// const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// function formatActionLabel(action) {
//     const map = {
//         submit: "SUBMIT (single form)",
//         like: "LIKE",
//         unlike: "UNLIKE",
//         rating_set: "RATING SET",
//         rating_clear: "RATING CLEAR",
//         feedback_set: "FEEDBACK SET",
//         feedback_clear: "FEEDBACK CLEAR",
//         reset_all: "RESET ALL",
//     };
//     return map[action] || action;
// }

// async function sendFeedbackEmail(payload) {
//     try {
//         const to = process.env.FEEDBACK_NOTIFY_TO;
//         const from = process.env.FEEDBACK_FROM || process.env.RESEND_FROM_EMAIL;

//         // If env missing, silently skip
//         if (!resend || !to || !from) return;

//         const {
//             action,
//             scope,
//             slug,
//             visitorId,
//             liked,
//             rating,
//             name,
//             email,
//             message,
//             ip,
//             userAgent,
//         } = payload;

//         const actionLabel = formatActionLabel(action);
//         const subject = `[Portfolio Feedback] ${actionLabel} • ${scope}/${slug}`;

//         const safeMessage = message ? message.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";

//         const html = `
//       <div style="font-family:Arial,sans-serif;line-height:1.5">
//         <h2 style="margin:0 0 12px 0;">Portfolio Feedback Update</h2>
//         <p style="margin:0 0 10px 0;"><b>Action:</b> ${actionLabel}</p>

//         <table cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;max-width:720px">
//           <tr><td style="border:1px solid #ddd"><b>Scope</b></td><td style="border:1px solid #ddd">${scope}</td></tr>
//           <tr><td style="border:1px solid #ddd"><b>Slug</b></td><td style="border:1px solid #ddd">${slug}</td></tr>
//           <tr><td style="border:1px solid #ddd"><b>VisitorId</b></td><td style="border:1px solid #ddd">${visitorId}</td></tr>
//           <tr><td style="border:1px solid #ddd"><b>Liked</b></td><td style="border:1px solid #ddd">${String(liked)}</td></tr>
//           <tr><td style="border:1px solid #ddd"><b>Rating</b></td><td style="border:1px solid #ddd">${rating ?? "null"}</td></tr>
//           <tr><td style="border:1px solid #ddd"><b>Name</b></td><td style="border:1px solid #ddd">${name ?? "null"}</td></tr>
//           <tr><td style="border:1px solid #ddd"><b>Email</b></td><td style="border:1px solid #ddd">${email ?? "null"}</td></tr>
//           <tr><td style="border:1px solid #ddd"><b>Message</b></td><td style="border:1px solid #ddd">${safeMessage || "null"}</td></tr>
//           <tr><td style="border:1px solid #ddd"><b>IP</b></td><td style="border:1px solid #ddd">${ip || "n/a"}</td></tr>
//           <tr><td style="border:1px solid #ddd"><b>User-Agent</b></td><td style="border:1px solid #ddd">${(userAgent || "n/a").slice(0, 220)}</td></tr>
//         </table>

//         <p style="margin:12px 0 0 0;color:#666;font-size:12px">
//           Sent by your Portfolio feedback system.
//         </p>
//       </div>
//     `;

//         const text = [
//             `Portfolio Feedback Update`,
//             `Action: ${actionLabel}`,
//             `Scope: ${scope}`,
//             `Slug: ${slug}`,
//             `VisitorId: ${visitorId}`,
//             `Liked: ${liked}`,
//             `Rating: ${rating ?? "null"}`,
//             `Name: ${name ?? "null"}`,
//             `Email: ${email ?? "null"}`,
//             `Message: ${message ?? "null"}`,
//             `IP: ${ip || "n/a"}`,
//             `User-Agent: ${(userAgent || "n/a").slice(0, 220)}`,
//         ].join("\n");

//         await resend.emails.send({
//             from,
//             to,
//             subject,
//             html,
//             text,
//         });
//     } catch (e) {
//         // do not break API if email fails
//         console.error("Feedback email send failed:", e);
//     }
// }

// /** ---------- GET: fetch saved state ---------- */
// export async function GET(req) {
//     try {
//         const { searchParams } = new URL(req.url);

//         const scope = normScope(searchParams.get("scope"));
//         const slug = normSlug(searchParams.get("slug"));

//         if (!slug) {
//             return NextResponse.json({ ok: false, error: "slug_missing" }, { status: 400 });
//         }

//         const { id: cookieVisitorId } = await getOrSetVisitorId();
//         const visitorId = cookieVisitorId;

//         const state = await prisma.feedbackState.findUnique({
//             where: {
//                 visitorId_scope_slug: { visitorId, scope, slug },
//             },
//         });

//         return NextResponse.json({ ok: true, visitorId, state: state || null });
//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
//     }
// }

// /** ---------- POST: mutate state + log event ---------- */
// export async function POST(req) {
//     try {
//         const body = await req.json();

//         const scope = normScope(body.scope);
//         const slug = normSlug(body.slug);
//         const action = String(body.action || "").trim();

//         if (!slug) {
//             return NextResponse.json({ ok: false, error: "slug_missing" }, { status: 400 });
//         }
//         if (!ALLOWED_ACTIONS.has(action)) {
//             return NextResponse.json({ ok: false, error: "invalid_action" }, { status: 400 });
//         }

//         // Visitor id (cookie)
//         const { id: cookieVisitorId } = await getOrSetVisitorId();

//         // (dev-only) allow overriding visitorId if you really want in ThunderClient
//         const visitorId =
//             process.env.NODE_ENV !== "production" && typeof body.visitorId === "string" && body.visitorId.trim()
//                 ? body.visitorId.trim()
//                 : cookieVisitorId;

//         const h = await headers();
//         const userAgent = h.get("user-agent") || "";
//         const ip = await getClientIp();

//         // common fields
//         const rating = toNumberOrNull(body.rating);
//         const name = clip(body.name, 120);
//         const email = clip(body.email, 180);
//         const message = clip(body.message, 5000);

//         // if single-form submit, liked can be passed as boolean
//         const likedFromBody = toBool(body.liked);

//         // 1) EVENT LOG (history)
//         await prisma.feedbackEvent.create({
//             data: {
//                 scope,
//                 slug,
//                 visitorId,
//                 action,
//                 rating,
//                 name,
//                 email,
//                 message,
//                 userAgent,
//                 ip,
//             },
//         });

//         // 2) STATE (latest saved)
//         const where = { visitorId_scope_slug: { visitorId, scope, slug } };

//         let stateUpdate = {};

//         if (action === "like") stateUpdate.liked = true;
//         if (action === "unlike") stateUpdate.liked = false;

//         if (action === "rating_set") {
//             stateUpdate.rating = rating;
//             stateUpdate.name = name;
//             stateUpdate.email = email;
//         }

//         if (action === "rating_clear") {
//             stateUpdate.rating = null;
//             stateUpdate.name = null;
//             stateUpdate.email = null;
//         }

//         if (action === "feedback_set") {
//             stateUpdate.message = message;
//         }

//         if (action === "feedback_clear") {
//             stateUpdate.message = null;
//         }

//         if (action === "reset_all") {
//             stateUpdate = {
//                 liked: false,
//                 rating: null,
//                 name: null,
//                 email: null,
//                 message: null,
//             };
//         }

//         // ✅ single-form submit: set everything in one go
//         if (action === "submit") {
//             stateUpdate = {
//                 liked: likedFromBody === null ? false : likedFromBody,
//                 rating: rating,
//                 name: name,
//                 email: email,
//                 message: message,
//             };
//         }

//         const nextState = await prisma.feedbackState.upsert({
//             where,
//             create: {
//                 scope,
//                 slug,
//                 visitorId,
//                 liked: stateUpdate.liked ?? false,
//                 rating: stateUpdate.rating ?? null,
//                 name: stateUpdate.name ?? null,
//                 email: stateUpdate.email ?? null,
//                 message: stateUpdate.message ?? null,
//             },
//             update: stateUpdate,
//         });

//         // ✅ Email notify for EVERY action (including submit/reset/like etc)
//         await sendFeedbackEmail({
//             action,
//             scope,
//             slug,
//             visitorId,
//             liked: nextState.liked,
//             rating: nextState.rating,
//             name: nextState.name,
//             email: nextState.email,
//             message: nextState.message,
//             ip,
//             userAgent,
//         });

//         return NextResponse.json({ ok: true, visitorId, state: nextState });
//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
//     }
// }



// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// import { NextResponse } from "next/server";
// import { cookies, headers } from "next/headers";
// import { prisma } from "@/lib/prisma";
// import crypto from "crypto";
// import { Resend } from "resend";

// /** ---------- helpers ---------- */
// function normScope(v) {
//     const s = String(v || "").trim().toLowerCase();
//     return s === "blog" ? "blog" : "project";
// }

// function normSlug(v) {
//     return String(v || "")
//         .trim()
//         .toLowerCase()
//         .replace(/%20/g, "-")
//         .replace(/\s+/g, "-")
//         .replace(/-+/g, "-")
//         .replace(/^-|-$/g, "");
// }

// function clip(v, max) {
//     const s = String(v ?? "").trim();
//     if (!s) return null;
//     return s.length > max ? s.slice(0, max) : s;
// }

// function toBool(v) {
//     if (v === true || v === false) return v;
//     if (typeof v === "string") {
//         const s = v.trim().toLowerCase();
//         if (s === "true") return true;
//         if (s === "false") return false;
//     }
//     return null;
// }

// function toNumberOrNull(v) {
//     if (v === null || v === undefined || v === "") return null;
//     const n = Number(v);
//     return Number.isFinite(n) ? n : null;
// }

// function hasProp(obj, key) {
//     return Object.prototype.hasOwnProperty.call(obj || {}, key);
// }

// function escapeHtml(s) {
//     return String(s || "")
//         .replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;");
// }

// const ALLOWED_ACTIONS = new Set([
//     // old
//     "like",
//     "unlike",
//     "rating_set",
//     "rating_clear",
//     "feedback_set",
//     "feedback_clear",
//     "reset_all",
//     // new (single-form)
//     "submit",
// ]);

// async function getClientIp() {
//     const h = await headers();
//     const xff = h.get("x-forwarded-for");
//     if (xff) return xff.split(",")[0].trim();
//     return h.get("x-real-ip") || "";
// }

// async function getOrSetVisitorId() {
//     const jar = await cookies(); // ✅ Next 15+ async
//     const existing = jar.get("mukul_vid")?.value;
//     if (existing) return { id: existing, isNew: false };

//     const id = crypto.randomUUID();
//     jar.set("mukul_vid", id, {
//         httpOnly: true,
//         sameSite: "lax",
//         secure: process.env.NODE_ENV === "production",
//         path: "/",
//         maxAge: 60 * 60 * 24 * 365,
//     });
//     return { id, isNew: true };
// }

// /** ---------- Email (Resend) ---------- */
// const resend = process.env.RESEND_API_KEY
//     ? new Resend(process.env.RESEND_API_KEY)
//     : null;

// function actionMeta(action) {
//     const map = {
//         submit: { label: "Submit", emoji: "📩" },
//         like: { label: "Like", emoji: "❤️" },
//         unlike: { label: "Unlike", emoji: "💔" },
//         rating_set: { label: "Rating set", emoji: "⭐" },
//         rating_clear: { label: "Rating cleared", emoji: "🧽" },
//         feedback_set: { label: "Feedback set", emoji: "💬" },
//         feedback_clear: { label: "Feedback cleared", emoji: "🧼" },
//         reset_all: { label: "Reset all", emoji: "🧨" },
//     };
//     return map[action] || { label: action, emoji: "📝" };
// }

// function makePageLink({ scope, slug }, reqUrl, referer) {
//     // 1) explicit referer if exists
//     if (referer && /^https?:\/\//i.test(referer)) return referer;

//     // 2) derive origin from req url
//     try {
//         const u = new URL(reqUrl);
//         const path = scope === "blog" ? `/blog/${slug}` : `/projects/${slug}`;
//         return `${u.origin}${path}`;
//     } catch {
//         return "";
//     }
// }

// async function sendFeedbackEmail(payload, reqUrl) {
//     try {
//         const to =
//             process.env.FEEDBACK_NOTIFY_TO ||
//             process.env.CONTACT_TO ||
//             process.env.SMTP_USER;

//         const from =
//             process.env.FEEDBACK_FROM ||
//             process.env.RESEND_FROM_EMAIL ||
//             process.env.CONTACT_FROM;

//         // If env missing, silently skip
//         if (!resend || !to || !from) return;

//         const {
//             action,
//             scope,
//             slug,
//             visitorId,
//             liked,
//             rating,
//             name,
//             email,
//             message,
//             ip,
//             userAgent,
//             referer,
//         } = payload;

//         const { label, emoji } = actionMeta(action);
//         const pageLink = makePageLink({ scope, slug }, reqUrl, referer);

//         const subject = `${emoji} Feedback • ${label} • ${scope}/${slug}`;

//         const safeMessage = message ? escapeHtml(message) : "";
//         const safeUA = escapeHtml((userAgent || "n/a").slice(0, 220));

//         const html = `
//       <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.5; color:#111">
//         <div style="padding:14px 16px; border:1px solid #eee; border-radius:14px; background:#fff">
//           <div style="font-size:12px; color:#666">Portfolio Feedback</div>
//           <div style="font-size:18px; font-weight:800; margin-top:4px">${emoji} ${label}</div>
//           <div style="margin-top:8px; font-size:13px; color:#333">
//             <b>Scope:</b> ${scope} &nbsp; • &nbsp; <b>Slug:</b> ${slug}
//           </div>
//           ${pageLink
//                 ? `<div style="margin-top:10px"><a href="${pageLink}" style="color:#0b5fff; text-decoration:none; font-weight:700">Open page ↗</a></div>`
//                 : ""
//             }
//         </div>

//         <div style="margin-top:12px; padding:14px 16px; border:1px solid #eee; border-radius:14px; background:#fff">
//           <div style="font-weight:800; margin-bottom:10px">Saved State</div>
//           <table cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;max-width:760px">
//             <tr><td style="border:1px solid #eee"><b>VisitorId</b></td><td style="border:1px solid #eee">${escapeHtml(visitorId)}</td></tr>
//             <tr><td style="border:1px solid #eee"><b>Liked</b></td><td style="border:1px solid #eee">${liked ? "true" : "false"}</td></tr>
//             <tr><td style="border:1px solid #eee"><b>Rating</b></td><td style="border:1px solid #eee">${rating ?? "null"}</td></tr>
//             <tr><td style="border:1px solid #eee"><b>Name</b></td><td style="border:1px solid #eee">${escapeHtml(name ?? "null")}</td></tr>
//             <tr><td style="border:1px solid #eee"><b>Email</b></td><td style="border:1px solid #eee">${escapeHtml(email ?? "null")}</td></tr>
//             <tr>
//               <td style="border:1px solid #eee; vertical-align:top"><b>Message</b></td>
//               <td style="border:1px solid #eee">${safeMessage ? `<div style="white-space:pre-wrap">${safeMessage}</div>` : "null"}</td>
//             </tr>
//           </table>

//           <div style="margin-top:10px; font-size:12px; color:#666">
//             <div><b>IP:</b> ${escapeHtml(ip || "n/a")}</div>
//             <div><b>User-Agent:</b> ${safeUA}</div>
//           </div>
//         </div>

//         <div style="margin-top:10px; font-size:12px; color:#777">
//           Sent by your portfolio feedback system.
//         </div>
//       </div>
//     `;

//         const text = [
//             `Portfolio Feedback (${label})`,
//             pageLink ? `Link: ${pageLink}` : "",
//             `Scope: ${scope}`,
//             `Slug: ${slug}`,
//             `VisitorId: ${visitorId}`,
//             `Liked: ${liked}`,
//             `Rating: ${rating ?? "null"}`,
//             `Name: ${name ?? "null"}`,
//             `Email: ${email ?? "null"}`,
//             `Message: ${message ?? "null"}`,
//             `IP: ${ip || "n/a"}`,
//             `User-Agent: ${(userAgent || "n/a").slice(0, 220)}`,
//         ]
//             .filter(Boolean)
//             .join("\n");

//         await resend.emails.send({
//             from,
//             to,
//             subject,
//             html,
//             text,
//         });
//     } catch (e) {
//         // do not break API if email fails
//         console.error("Feedback email send failed:", e);
//     }
// }

// /** ---------- GET: fetch saved state ---------- */
// export async function GET(req) {
//     try {
//         const { searchParams } = new URL(req.url);

//         const scope = normScope(searchParams.get("scope"));
//         const slug = normSlug(searchParams.get("slug"));

//         if (!slug) {
//             return NextResponse.json(
//                 { ok: false, error: "slug_missing" },
//                 { status: 400 }
//             );
//         }

//         const { id: visitorId } = await getOrSetVisitorId();

//         const state = await prisma.feedbackState.findUnique({
//             where: { visitorId_scope_slug: { visitorId, scope, slug } },
//         });

//         return NextResponse.json({ ok: true, visitorId, state: state || null });
//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
//     }
// }

// /** ---------- POST: mutate state + log event ---------- */
// export async function POST(req) {
//     try {
//         const body = await req.json();

//         const scope = normScope(body.scope);
//         const slug = normSlug(body.slug);
//         const action = String(body.action || "").trim();

//         if (!slug) {
//             return NextResponse.json({ ok: false, error: "slug_missing" }, { status: 400 });
//         }
//         if (!ALLOWED_ACTIONS.has(action)) {
//             return NextResponse.json({ ok: false, error: "invalid_action" }, { status: 400 });
//         }

//         // Visitor id (cookie)
//         const { id: cookieVisitorId } = await getOrSetVisitorId();

//         // (dev-only) allow overriding visitorId if you really want in ThunderClient
//         const visitorId =
//             process.env.NODE_ENV !== "production" &&
//                 typeof body.visitorId === "string" &&
//                 body.visitorId.trim()
//                 ? body.visitorId.trim()
//                 : cookieVisitorId;

//         const h = await headers();
//         const userAgent = h.get("user-agent") || "";
//         const referer = h.get("referer") || "";
//         const ip = await getClientIp();

//         // common fields (body)
//         const rating = toNumberOrNull(body.rating);
//         const name = clip(body.name, 120);
//         const email = clip(body.email, 180);
//         const message = clip(body.message, 5000);
//         const likedFromBody = toBool(body.liked);

//         // ✅ block empty submit (prevents null emails / junk submits)
//         if (action === "submit") {
//             const hasAny =
//                 (likedFromBody === true) ||
//                 (rating !== null) ||
//                 !!name ||
//                 !!email ||
//                 !!message;

//             if (!hasAny) {
//                 return NextResponse.json(
//                     { ok: false, error: "empty_submit" },
//                     { status: 400 }
//                 );
//             }
//         }

//         // 1) EVENT LOG (history)
//         await prisma.feedbackEvent.create({
//             data: {
//                 scope,
//                 slug,
//                 visitorId,
//                 action,
//                 rating,
//                 name,
//                 email,
//                 message,
//                 userAgent,
//                 ip,
//             },
//         });

//         // 2) STATE (latest saved)
//         const where = { visitorId_scope_slug: { visitorId, scope, slug } };

//         // For submit: preserve old values if a field is NOT provided at all
//         const existing =
//             action === "submit"
//                 ? await prisma.feedbackState.findUnique({ where })
//                 : null;

//         let stateUpdate = {};

//         if (action === "like") stateUpdate.liked = true;
//         if (action === "unlike") stateUpdate.liked = false;

//         if (action === "rating_set") {
//             stateUpdate.rating = rating;
//             stateUpdate.name = name;
//             stateUpdate.email = email;
//         }

//         if (action === "rating_clear") {
//             stateUpdate.rating = null;
//             stateUpdate.name = null;
//             stateUpdate.email = null;
//         }

//         if (action === "feedback_set") {
//             stateUpdate.message = message;
//         }

//         if (action === "feedback_clear") {
//             stateUpdate.message = null;
//         }

//         if (action === "reset_all") {
//             stateUpdate = {
//                 liked: false,
//                 rating: null,
//                 name: null,
//                 email: null,
//                 message: null,
//             };
//         }

//         // ✅ single-form submit: update everything, BUT preserve if prop not sent
//         if (action === "submit") {
//             const nextLiked = hasProp(body, "liked")
//                 ? (likedFromBody ?? false)
//                 : (existing?.liked ?? false);

//             const nextRating = hasProp(body, "rating")
//                 ? rating
//                 : (existing?.rating ?? null);

//             const nextName = hasProp(body, "name")
//                 ? name
//                 : (existing?.name ?? null);

//             const nextEmail = hasProp(body, "email")
//                 ? email
//                 : (existing?.email ?? null);

//             const nextMessage = hasProp(body, "message")
//                 ? message
//                 : (existing?.message ?? null);

//             stateUpdate = {
//                 liked: nextLiked,
//                 rating: nextRating,
//                 name: nextName,
//                 email: nextEmail,
//                 message: nextMessage,
//             };
//         }

//         const nextState = await prisma.feedbackState.upsert({
//             where,
//             create: {
//                 scope,
//                 slug,
//                 visitorId,
//                 liked: stateUpdate.liked ?? false,
//                 rating: stateUpdate.rating ?? null,
//                 name: stateUpdate.name ?? null,
//                 email: stateUpdate.email ?? null,
//                 message: stateUpdate.message ?? null,
//             },
//             update: stateUpdate,
//         });

//         // ✅ Email notify for EVERY action (including submit/reset/like etc)
//         await sendFeedbackEmail(
//             {
//                 action,
//                 scope,
//                 slug,
//                 visitorId,
//                 liked: nextState.liked,
//                 rating: nextState.rating,
//                 name: nextState.name,
//                 email: nextState.email,
//                 message: nextState.message,
//                 ip,
//                 userAgent,
//                 referer,
//             },
//             req.url
//         );

//         return NextResponse.json({ ok: true, visitorId, state: nextState });
//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
//     }
// }
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";

/** ---------- helpers ---------- */
function normScope(v) {
    const s = String(v || "").trim().toLowerCase();
    return s === "blog" ? "blog" : "project";
}

function normSlug(v) {
    return String(v || "")
        .trim()
        .toLowerCase()
        .replace(/%20/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function clip(v, max) {
    const s = String(v ?? "").trim();
    if (!s) return null;
    return s.length > max ? s.slice(0, max) : s;
}

function toBool(v) {
    if (v === true || v === false) return v;
    if (typeof v === "string") {
        const s = v.trim().toLowerCase();
        if (s === "true") return true;
        if (s === "false") return false;
    }
    return null;
}

function toNumberOrNull(v) {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function hasProp(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj || {}, key);
}

function escapeHtml(s) {
    return String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function trimForEmail(s, max = 1200) {
    const t = String(s || "");
    if (!t) return "";
    return t.length > max ? t.slice(0, max) + "…" : t;
}

const ALLOWED_ACTIONS = new Set([
    // old
    "like",
    "unlike",
    "rating_set",
    "rating_clear",
    "feedback_set",
    "feedback_clear",
    "reset_all",
    // new (single-form)
    "submit",
]);

async function getClientIp() {
    const h = await headers();
    const xff = h.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim();
    return h.get("x-real-ip") || "";
}

async function getOrSetVisitorId() {
    const jar = await cookies(); // ✅ Next 15+ async
    const existing = jar.get("mukul_vid")?.value;
    if (existing) return { id: existing, isNew: false };

    const id = crypto.randomUUID();
    jar.set("mukul_vid", id, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
    });
    return { id, isNew: true };
}

/** ---------- Email (Resend) ---------- */
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

function actionMeta(action) {
    const map = {
        submit: { label: "Submitted", emoji: "📩", tone: "#0b5fff" },
        like: { label: "Liked", emoji: "❤️", tone: "#e11d48" },
        unlike: { label: "Unliked", emoji: "💔", tone: "#64748b" },
        rating_set: { label: "Rating set", emoji: "⭐", tone: "#f59e0b" },
        rating_clear: { label: "Rating cleared", emoji: "🧽", tone: "#64748b" },
        feedback_set: { label: "Feedback set", emoji: "💬", tone: "#10b981" },
        feedback_clear: { label: "Feedback cleared", emoji: "🧼", tone: "#64748b" },
        reset_all: { label: "Reset all", emoji: "🧨", tone: "#ef4444" },
    };
    return map[action] || { label: action, emoji: "📝", tone: "#0b5fff" };
}

function makePageLink({ scope, slug }, reqUrl, referer) {
    if (referer && /^https?:\/\//i.test(referer)) return referer;
    try {
        const u = new URL(reqUrl);
        const path = scope === "blog" ? `/blog/${slug}` : `/projects/${slug}`;
        return `${u.origin}${path}`;
    } catch {
        return "";
    }
}

function normalizeState(s) {
    return {
        liked: Boolean(s?.liked),
        rating: s?.rating ?? null,
        name: s?.name ?? null,
        email: s?.email ?? null,
        message: s?.message ?? null,
    };
}

function stateDiff(prev, next) {
    const p = normalizeState(prev);
    const n = normalizeState(next);

    const diffs = [];

    if (p.liked !== n.liked) diffs.push({ key: "Liked", from: String(p.liked), to: String(n.liked) });
    if ((p.rating ?? null) !== (n.rating ?? null)) diffs.push({ key: "Rating", from: p.rating ?? "null", to: n.rating ?? "null" });
    if ((p.name ?? null) !== (n.name ?? null)) diffs.push({ key: "Name", from: p.name ?? "null", to: n.name ?? "null" });
    if ((p.email ?? null) !== (n.email ?? null)) diffs.push({ key: "Email", from: p.email ?? "null", to: n.email ?? "null" });

    const pm = p.message ?? null;
    const nm = n.message ?? null;
    if (pm !== nm) {
        const from = pm ? trimForEmail(pm, 240) : "null";
        const to = nm ? trimForEmail(nm, 240) : "null";
        diffs.push({ key: "Message", from, to });
    }

    return diffs;
}

async function sendFeedbackEmail(payload, reqUrl) {
    try {
        const to =
            process.env.FEEDBACK_NOTIFY_TO ||
            process.env.CONTACT_TO ||
            process.env.SMTP_USER;

        const from =
            process.env.FEEDBACK_FROM ||
            process.env.RESEND_FROM_EMAIL ||
            process.env.CONTACT_FROM;

        if (!resend || !to || !from) return;

        const {
            action,
            scope,
            slug,
            visitorId,
            prevState,
            nextState,
            ip,
            userAgent,
            referer,
        } = payload;

        const { label, emoji, tone } = actionMeta(action);
        const pageLink = makePageLink({ scope, slug }, reqUrl, referer);

        const diffs = stateDiff(prevState, nextState);
        const now = new Date().toLocaleString();

        // Subject: premium + clear
        const subject = `${emoji} ${label} • ${scope}/${slug}`;

        const n = normalizeState(nextState);

        const safeUA = escapeHtml((userAgent || "n/a").slice(0, 220));
        const safeIP = escapeHtml(ip || "n/a");
        const safeVisitor = escapeHtml(visitorId || "n/a");
        const safeScope = escapeHtml(scope);
        const safeSlug = escapeHtml(slug);

        const diffRows = diffs.length
            ? diffs
                .map((d) => {
                    const from = escapeHtml(String(d.from));
                    const toV = escapeHtml(String(d.to));
                    return `
              <tr>
                <td style="border:1px solid #eee; padding:10px; font-weight:700">${escapeHtml(d.key)}</td>
                <td style="border:1px solid #eee; padding:10px; color:#6b7280">${from}</td>
                <td style="border:1px solid #eee; padding:10px; color:#111">${toV}</td>
              </tr>
            `;
                })
                .join("")
            : `
        <tr>
          <td colspan="3" style="border:1px solid #eee; padding:10px; color:#6b7280">
            No field changes detected (action logged anyway).
          </td>
        </tr>
      `;

        const messageBlock = n.message
            ? `<div style="white-space:pre-wrap; background:#0b1220; color:#e5e7eb; padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,.08)">${escapeHtml(n.message)}</div>`
            : `<div style="color:#6b7280">null</div>`;

        const chips = [
            n.liked ? "❤️ liked" : "♡ not-liked",
            n.rating ? `⭐ ${n.rating}/5` : "☆ no-rating",
            n.message ? "💬 has-message" : "🫥 no-message",
        ];

        const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.45; background:#f6f7fb; padding:18px">
        <div style="max-width:760px; margin:0 auto">
          <div style="background:#0b0f19; border-radius:18px; padding:16px; color:#fff; border:1px solid rgba(255,255,255,.08)">
            <div style="font-size:12px; opacity:.8">Mukul Portfolio • Feedback</div>
            <div style="display:flex; align-items:center; gap:10px; margin-top:6px">
              <div style="width:10px; height:10px; border-radius:999px; background:${tone}; box-shadow:0 0 18px ${tone}"></div>
              <div style="font-size:18px; font-weight:900">${emoji} ${escapeHtml(label)}</div>
              <div style="margin-left:auto; font-size:12px; opacity:.75">${escapeHtml(now)}</div>
            </div>

            <div style="margin-top:10px; display:flex; flex-wrap:wrap; gap:8px">
              ${chips
                .map(
                    (c) =>
                        `<span style="font-size:12px; padding:6px 10px; border-radius:999px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.10)">${escapeHtml(
                            c
                        )}</span>`
                )
                .join("")}
            </div>

            <div style="margin-top:10px; font-size:13px; opacity:.9">
              <b>Scope:</b> ${safeScope} &nbsp; • &nbsp; <b>Slug:</b> ${safeSlug}
              ${pageLink
                ? `&nbsp; • &nbsp; <a href="${pageLink}" style="color:#93c5fd; text-decoration:none; font-weight:800">Open page ↗</a>`
                : ""
            }
            </div>
          </div>

          <div style="margin-top:12px; background:#fff; border-radius:18px; border:1px solid #e9e9ef; overflow:hidden">
            <div style="padding:14px 16px; border-bottom:1px solid #eef0f6">
              <div style="font-weight:900; font-size:14px">What changed</div>
              <div style="color:#6b7280; font-size:12px; margin-top:4px">Old → New (diff)</div>
            </div>
            <div style="padding:0 16px 16px 16px">
              <table cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse; margin-top:12px">
                <thead>
                  <tr>
                    <th style="text-align:left; padding:10px; border:1px solid #eee; background:#fafafa">Field</th>
                    <th style="text-align:left; padding:10px; border:1px solid #eee; background:#fafafa">From</th>
                    <th style="text-align:left; padding:10px; border:1px solid #eee; background:#fafafa">To</th>
                  </tr>
                </thead>
                <tbody>
                  ${diffRows}
                </tbody>
              </table>
            </div>
          </div>

          <div style="margin-top:12px; background:#fff; border-radius:18px; border:1px solid #e9e9ef; overflow:hidden">
            <div style="padding:14px 16px; border-bottom:1px solid #eef0f6">
              <div style="font-weight:900; font-size:14px">Saved message</div>
            </div>
            <div style="padding:14px 16px">
              ${messageBlock}
            </div>
          </div>

          <div style="margin-top:12px; background:#fff; border-radius:18px; border:1px solid #e9e9ef">
            <div style="padding:14px 16px; display:grid; gap:6px; font-size:12px; color:#374151">
              <div><b>VisitorId:</b> ${safeVisitor}</div>
              <div><b>IP:</b> ${safeIP}</div>
              <div><b>User-Agent:</b> ${safeUA}</div>
            </div>
          </div>

          <div style="margin-top:10px; text-align:center; font-size:12px; color:#6b7280">
            Sent by your Portfolio feedback system.
          </div>
        </div>
      </div>
    `;

        const text = [
            `Mukul Portfolio • Feedback`,
            `${emoji} ${label}`,
            pageLink ? `Link: ${pageLink}` : "",
            `Scope: ${scope}`,
            `Slug: ${slug}`,
            `VisitorId: ${visitorId}`,
            `--- DIFF ---`,
            diffs.length
                ? diffs.map((d) => `${d.key}: ${d.from} -> ${d.to}`).join("\n")
                : "No changes detected",
            `--- SAVED STATE ---`,
            `Liked: ${String(n.liked)}`,
            `Rating: ${n.rating ?? "null"}`,
            `Name: ${n.name ?? "null"}`,
            `Email: ${n.email ?? "null"}`,
            `Message: ${n.message ?? "null"}`,
            `IP: ${ip || "n/a"}`,
            `User-Agent: ${(userAgent || "n/a").slice(0, 220)}`,
        ]
            .filter(Boolean)
            .join("\n");

        await resend.emails.send({
            from,
            to,
            subject,
            html,
            text,
        });
    } catch (e) {
        console.error("Feedback email send failed:", e);
    }
}

/** ---------- GET: fetch saved state ---------- */
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const scope = normScope(searchParams.get("scope"));
        const slug = normSlug(searchParams.get("slug"));

        if (!slug) {
            return NextResponse.json({ ok: false, error: "slug_missing" }, { status: 400 });
        }

        const { id: visitorId } = await getOrSetVisitorId();

        const state = await prisma.feedbackState.findUnique({
            where: { visitorId_scope_slug: { visitorId, scope, slug } },
        });

        return NextResponse.json({ ok: true, visitorId, state: state || null });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
    }
}

/** ---------- POST: mutate state + log event ---------- */
export async function POST(req) {
    try {
        const body = await req.json();

        const scope = normScope(body.scope);
        const slug = normSlug(body.slug);
        const action = String(body.action || "").trim();

        if (!slug) {
            return NextResponse.json({ ok: false, error: "slug_missing" }, { status: 400 });
        }
        if (!ALLOWED_ACTIONS.has(action)) {
            return NextResponse.json({ ok: false, error: "invalid_action" }, { status: 400 });
        }

        // Visitor id (cookie)
        const { id: cookieVisitorId } = await getOrSetVisitorId();

        // (dev-only) allow overriding visitorId if you really want in ThunderClient
        const visitorId =
            process.env.NODE_ENV !== "production" &&
                typeof body.visitorId === "string" &&
                body.visitorId.trim()
                ? body.visitorId.trim()
                : cookieVisitorId;

        const h = await headers();
        const userAgent = h.get("user-agent") || "";
        const referer = h.get("referer") || "";
        const ip = await getClientIp();

        // common fields (body)
        const rating = toNumberOrNull(body.rating);
        const name = clip(body.name, 120);
        const email = clip(body.email, 180);
        const message = clip(body.message, 5000);
        const likedFromBody = toBool(body.liked);

        // ✅ block empty submit (prevents null emails / junk submits)
        if (action === "submit") {
            const hasAny =
                likedFromBody === true ||
                rating !== null ||
                !!name ||
                !!email ||
                !!message;

            if (!hasAny) {
                return NextResponse.json({ ok: false, error: "empty_submit" }, { status: 400 });
            }
        }

        const where = { visitorId_scope_slug: { visitorId, scope, slug } };

        // ✅ always fetch previous state for premium diff email
        const prevState = await prisma.feedbackState.findUnique({ where });

        // 1) EVENT LOG (history)
        await prisma.feedbackEvent.create({
            data: {
                scope,
                slug,
                visitorId,
                action,
                rating,
                name,
                email,
                message,
                userAgent,
                ip,
            },
        });

        let stateUpdate = {};

        if (action === "like") stateUpdate.liked = true;
        if (action === "unlike") stateUpdate.liked = false;

        if (action === "rating_set") {
            stateUpdate.rating = rating;
            stateUpdate.name = name;
            stateUpdate.email = email;
        }

        if (action === "rating_clear") {
            stateUpdate.rating = null;
            stateUpdate.name = null;
            stateUpdate.email = null;
        }

        if (action === "feedback_set") {
            stateUpdate.message = message;
        }

        if (action === "feedback_clear") {
            stateUpdate.message = null;
        }

        if (action === "reset_all") {
            stateUpdate = {
                liked: false,
                rating: null,
                name: null,
                email: null,
                message: null,
            };
        }

        // ✅ single-form submit: update everything, BUT preserve if prop not sent
        if (action === "submit") {
            const nextLiked = hasProp(body, "liked")
                ? likedFromBody ?? false
                : prevState?.liked ?? false;

            const nextRating = hasProp(body, "rating") ? rating : prevState?.rating ?? null;
            const nextName = hasProp(body, "name") ? name : prevState?.name ?? null;
            const nextEmail = hasProp(body, "email") ? email : prevState?.email ?? null;
            const nextMessage = hasProp(body, "message") ? message : prevState?.message ?? null;

            stateUpdate = {
                liked: nextLiked,
                rating: nextRating,
                name: nextName,
                email: nextEmail,
                message: nextMessage,
            };
        }

        const nextState = await prisma.feedbackState.upsert({
            where,
            create: {
                scope,
                slug,
                visitorId,
                liked: stateUpdate.liked ?? false,
                rating: stateUpdate.rating ?? null,
                name: stateUpdate.name ?? null,
                email: stateUpdate.email ?? null,
                message: stateUpdate.message ?? null,
            },
            update: stateUpdate,
        });

        // ✅ Email notify for EVERY action (including submit/reset/like etc)
        await sendFeedbackEmail({
            action,
            scope,
            slug,
            visitorId,
            prevState,
            nextState,
            ip,
            userAgent,
            referer,
        }, req.url);

        return NextResponse.json({ ok: true, visitorId, state: nextState });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
    }
}
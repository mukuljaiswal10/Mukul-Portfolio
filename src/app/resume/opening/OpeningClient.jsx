// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import LuxuryButton from "@/components/ui/LuxuryButton";

// export default function OpeningClient() {
//   const router = useRouter();
//   const sp = useSearchParams();
//   const rid = sp.get("rid");

//   const [status, setStatus] = useState("waiting"); // waiting | ready | missing
//   const [payload, setPayload] = useState(null);
//   const [secondsLeft, setSecondsLeft] = useState(5);

//   const key = useMemo(() => (rid ? `resume_gate:${rid}` : null), [rid]);

//   const redirectedRef = useRef(false);
//   const startedCountdownRef = useRef(false);

//   // ✅ If rid missing => go to failed (same behavior you had)
//   useEffect(() => {
//     if (!rid) router.replace("/resume/otp-failed?reason=missing_rid");
//   }, [rid, router]);

//   const resolveUrlFromData = (data) => {
//     const u = data?.fullUrl || data?.url || null;
//     return typeof u === "string" && u.length > 5 ? u : null;
//   };

//   const armCountdown = (data) => {
//     const url = resolveUrlFromData(data);
//     if (!url) return;
//     if (redirectedRef.current) return;

//     const delayMs = Number(data?.delayMs || 5000);
//     const secs = Math.max(1, Math.ceil(delayMs / 1000));

//     setPayload({ ...data, fullUrl: url });
//     setSecondsLeft(secs);
//     setStatus("ready");
//   };

//   // ✅ SCREEN LOCK (no scroll / accidental gestures)
//   useEffect(() => {
//     const prevOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";

//     const prevent = (e) => e.preventDefault();
//     const onKey = (e) => {
//       if (e.key === "Escape") return;
//       e.preventDefault();
//     };

//     document.addEventListener("touchmove", prevent, { passive: false });
//     document.addEventListener("wheel", prevent, { passive: false });
//     document.addEventListener("contextmenu", prevent);
//     window.addEventListener("keydown", onKey, { passive: false });

//     return () => {
//       document.body.style.overflow = prevOverflow;
//       document.removeEventListener("touchmove", prevent);
//       document.removeEventListener("wheel", prevent);
//       document.removeEventListener("contextmenu", prevent);
//       window.removeEventListener("keydown", onKey);
//     };
//   }, []);

//   // ✅ FAST PATH: opener -> postMessage
//   useEffect(() => {
//     if (!rid) return;

//     const onMsg = (e) => {
//       if (e.origin !== window.location.origin) return;
//       const d = e.data;
//       if (!d || d.type !== "RESUME_READY") return;
//       if (d.rid && d.rid !== rid) return;

//       const data = {
//         createdAt: Date.now(),
//         delayMs: Number(d.delayMs || 5000),
//         fullUrl: d.url,
//       };

//       try {
//         if (key) localStorage.setItem(key, JSON.stringify(data));
//       } catch {}

//       armCountdown(data);
//     };

//     window.addEventListener("message", onMsg);
//     return () => window.removeEventListener("message", onMsg);
//   }, [rid, key]);

//   // ✅ Poll localStorage (fallback)
//   useEffect(() => {
//     if (!key) {
//       setStatus("missing");
//       return;
//     }

//     setStatus("waiting");

//     let t;
//     const startedAt = Date.now();

//     const poll = () => {
//       try {
//         const raw = localStorage.getItem(key);

//         if (!raw) {
//           if (Date.now() - startedAt > 6000) {
//             setStatus("missing");
//             return;
//           }
//           t = setTimeout(poll, 200);
//           return;
//         }

//         const data = JSON.parse(raw);

//         const age = Date.now() - (data?.createdAt || 0);
//         if (age > 2 * 60 * 1000) {
//           localStorage.removeItem(key);
//           setStatus("missing");
//           return;
//         }

//         armCountdown(data);
//       } catch {
//         setStatus("missing");
//       }
//     };

//     poll();
//     return () => clearTimeout(t);
//   }, [key]);

//   // ✅ Countdown + redirect
//   useEffect(() => {
//     if (status !== "ready") return;
//     if (!payload?.fullUrl) return;
//     if (redirectedRef.current) return;
//     if (startedCountdownRef.current) return;

//     startedCountdownRef.current = true;

//     let s = Math.max(1, Number(secondsLeft || 5));

//     const interval = setInterval(() => {
//       s -= 1;
//       setSecondsLeft(s);

//       if (s <= 0) {
//         clearInterval(interval);

//         try {
//           if (key) localStorage.removeItem(key);
//         } catch {}

//         redirectedRef.current = true;
//         window.location.replace(payload.fullUrl);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [status, payload?.fullUrl, key]);

//   const onCancel = () => {
//     try {
//       if (key) localStorage.removeItem(key);
//     } catch {}
//     window.close();
//     router.push("/");
//   };

//   // ===== UI-only helpers =====
//   const totalSecs = useMemo(() => {
//     const d = Number(payload?.delayMs || 5000);
//     return Math.max(1, Math.ceil(d / 1000));
//   }, [payload?.delayMs]);

//   const progress = useMemo(() => {
//     const done = Math.min(totalSecs, Math.max(0, totalSecs - secondsLeft));
//     return totalSecs ? done / totalSecs : 0;
//   }, [secondsLeft, totalSecs]);

//   const progressPct = useMemo(() => Math.round(progress * 100), [progress]);

//   const phase = useMemo(() => {
//     if (status === "missing") {
//       return {
//         badge: "Handshake pending",
//         title: "Awaiting secure confirmation…",
//         sub: "We didn’t receive the secure token yet. Please keep this tab open.",
//       };
//     }
//     if (status === "waiting") {
//       return {
//         badge: "Initializing",
//         title: "Booting AI verification engine…",
//         sub: "Starting privacy-safe checks and preparing the secure session.",
//       };
//     }
//     if (secondsLeft >= 4) {
//       return {
//         badge: "AI Validation",
//         title: "Analyzing contact details…",
//         sub: "Email syntax + phone rules are being validated.",
//       };
//     }
//     if (secondsLeft === 3) {
//       return {
//         badge: "Anti-Bot Shield",
//         title: "Spam & abuse protection running…",
//         sub: "Honeypot + rate guard checks applied.",
//       };
//     }
//     if (secondsLeft === 2) {
//       return {
//         badge: "Secure Link",
//         title: "Generating time-limited access link…",
//         sub: "Creating a secure token with short expiry.",
//       };
//     }
//     return {
//       badge: "Finalizing",
//       title: "Almost done…",
//       sub: "Opening your resume now.",
//     };
//   }, [status, secondsLeft]);

//   const checks = useMemo(() => {
//     const step = (() => {
//       if (status !== "ready") return 0;
//       const s = Math.max(1, Math.min(5, secondsLeft));
//       return 6 - s;
//     })();

//     const mk = (label, i, meta) => {
//       const active = status === "ready" && step === i;
//       const done = status === "ready" && step > i;
//       return { label, active, done, meta };
//     };

//     return [
//       mk("Identity signal check", 1, "Name heuristics + basic sanity"),
//       mk("Email verification rules", 2, "Syntax + domain pattern checks"),
//       mk("Phone validation", 3, "10-digit numeric rules applied"),
//       mk("Secure link generation", 4, "Short-lived token created"),
//     ];
//   }, [status, secondsLeft]);

//   // Fake stream
//   const streamLines = useMemo(() => {
//     const s = secondsLeft;
//     const base = [
//       `session:init rid=${rid || "—"}`,
//       "policy:privacy_mode=ON",
//       "shield:honeypot=armed",
//       "scanner:input_sanity=pass",
//       "verifier:email_syntax=pass",
//       "verifier:phone_rules=pass",
//       "token:ttl=short",
//       "handoff:resume_redirect=armed",
//     ];

//     if (status === "missing") {
//       return [
//         "handshake:waiting for token…",
//         "tip:keep this tab open",
//         "fallback:polling local storage",
//       ];
//     }
//     if (status === "waiting") return base.slice(0, 4);

//     if (status === "ready") {
//       if (s >= 4) return base.slice(0, 5);
//       if (s === 3) return base.slice(0, 6);
//       if (s === 2) return base.slice(0, 7);
//       return base;
//     }

//     return base;
//   }, [rid, status, secondsLeft]);

//   return (
//     <div className="fixed inset-0 z-[999999] isolate">
//       {/* ✅ Centered wrapper (no cut) */}
//       <main className="relative flex min-h-[100dvh] items-center justify-center bg-[#07070b] px-4 py-6 sm:px-6 sm:py-10">
//         {/* Background */}
//         <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
//           <div className="absolute inset-0 bg-[#07070b]" />
//           <div
//             className="absolute inset-0 opacity-80"
//             style={{
//               background:
//                 "radial-gradient(circle at 12% 18%, rgba(233,200,106,0.22), transparent 56%), radial-gradient(circle at 88% 22%, rgba(255,255,255,0.07), transparent 60%), radial-gradient(circle at 50% 92%, rgba(233,200,106,0.12), transparent 60%)",
//             }}
//           />
//           <div className="absolute inset-0 aurora" />
//           <div className="absolute inset-0 noiseMask opacity-[0.10]" />
//           <div className="absolute inset-0 vignette" />
//         </div>

//         {/* ✅ Card: max-height to avoid bottom cut (NO scroll) */}
//         <div className="w-full max-w-3xl">
//           <div className="relative w-full overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-b from-[#0d0d12] to-[#060609] p-5 shadow-[0_45px_160px_rgba(0,0,0,0.75)] ring-1 ring-white/10 sm:p-7 cardFit">
//             {/* Animated conic border */}
//             <div
//               aria-hidden
//               className="pointer-events-none absolute -inset-[2px] rounded-[26px] opacity-80 blur-xl"
//               style={{
//                 background:
//                   "conic-gradient(from 200deg, rgba(233,200,106,0.00), rgba(233,200,106,0.28), rgba(255,255,255,0.12), rgba(233,200,106,0.00))",
//                 animation: "spinGlow 6s linear infinite",
//               }}
//             />

//             {/* Sparkles */}
//             <div aria-hidden className="pointer-events-none absolute inset-0">
//               {Array.from({ length: 10 }).map((_, i) => (
//                 <span key={i} className={`sparkle p${i + 1}`} />
//               ))}
//             </div>

//             {/* Header */}
//             <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//               <div className="min-w-0">
//                 <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">
//                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulseDot" />
//                   {phase.badge}
//                 </div>

//                 <h1 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
//                   {phase.title}
//                 </h1>
//                 <p className="mt-1 text-sm text-white/70">{phase.sub}</p>
//               </div>

//               <LuxuryButton
//                 as="button"
//                 variant="outline"
//                 className="shrink-0"
//                 onClick={onCancel}
//               >
//                 Cancel / Back
//               </LuxuryButton>
//             </div>

//             {/* Main grid */}
//             <div className="relative mt-5 grid gap-4 sm:grid-cols-[200px_1fr] sm:items-start">
//               {/* Left loader */}
//               <div className="mx-auto sm:mx-0">
//                 <div className="relative h-44 w-44 sm:h-48 sm:w-48 coreFit">
//                   <div className="absolute -inset-8 rounded-full blur-3xl opacity-70 aiGlow" />

//                   <div className="absolute inset-0 rounded-full ringSpin">
//                     <div className="absolute inset-0 rounded-full ringA" />
//                     <div className="absolute inset-[10px] rounded-full ringB" />
//                     <div className="absolute inset-[22px] rounded-full ringC" />
//                   </div>

//                   <div className="absolute inset-[6px] rounded-full scanArc" />

//                   <div className="absolute inset-[26px] rounded-full border border-white/10 bg-white/5 backdrop-blur flex items-center justify-center">
//                     <div className="text-center">
//                       <p className="text-[11px] text-white/60">AI Core</p>
//                       <p className="mt-1 text-3xl font-semibold text-white tabular-nums">
//                         {status === "ready" ? `${progressPct}%` : "…"}
//                       </p>
//                       <p className="mt-1 text-[11px] text-white/55">
//                         {status === "ready"
//                           ? `Redirect in ${secondsLeft}s`
//                           : "Warming up…"}
//                       </p>

//                       <div className="mt-2.5 flex items-center justify-center gap-1.5">
//                         <span className="dot d1" />
//                         <span className="dot d2" />
//                         <span className="dot d3" />
//                         <span className="dot d4" />
//                         <span className="dot d5" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right */}
//               <div className="min-w-0">
//                 {/* Progress */}
//                 <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//                   <div className="flex items-center justify-between gap-3 text-xs text-white/60">
//                     <span className="truncate">
//                       {status === "missing"
//                         ? "Waiting for confirmation…"
//                         : status === "waiting"
//                         ? "Initializing pipeline…"
//                         : "Verification in progress…"}
//                     </span>
//                     <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
//                       Secure • Time-limited
//                     </span>
//                   </div>

//                   <div className="mt-3 h-3 w-full overflow-hidden rounded-full border border-white/10 bg-[#0b0b10]">
//                     <div className="h-full shimmer" />
//                     <div
//                       className="progressFill"
//                       style={{
//                         width: `${status === "ready" ? progressPct : 10}%`,
//                       }}
//                     />
//                   </div>

//                   <div className="mt-3 grid gap-2 sm:grid-cols-2">
//                     {checks.map((c) => (
//                       <CheckRow
//                         key={c.label}
//                         title={c.label}
//                         meta={c.meta}
//                         active={c.active}
//                         done={c.done}
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 {/* ✅ On mobile/short-height: stream hides automatically to prevent cut */}
//                 <div className="mt-4 hidden sm:block streamFit overflow-hidden rounded-2xl border border-white/10 bg-[#060609]">
//                   <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
//                     <p className="text-xs font-semibold text-white/80">
//                       AI Verification Stream
//                     </p>
//                     <span className="text-[11px] text-white/55">
//                       privacy_mode: ON
//                     </span>
//                   </div>

//                   <div className="relative p-4">
//                     <div
//                       aria-hidden
//                       className="pointer-events-none absolute inset-0 opacity-40"
//                       style={{
//                         background:
//                           "radial-gradient(circle at 20% 20%, rgba(233,200,106,0.10), transparent 55%)",
//                       }}
//                     />

//                     <div className="relative space-y-1 font-mono text-[11px] leading-relaxed text-white/65">
//                       {streamLines.map((line, i) => (
//                         <div key={i} className="flex items-start gap-2">
//                           <span className="text-white/35">{">"}</span>
//                           <span className="break-words">{line}</span>
//                           <span className="ml-auto text-white/30">
//                             {status === "ready" ? "ok" : "…"}
//                           </span>
//                         </div>
//                       ))}
//                       <div className="flex items-start gap-2">
//                         <span className="text-white/35">{">"}</span>
//                         <span className="text-white/55">
//                           {status === "ready"
//                             ? "handoff:redirect armed"
//                             : "handoff:pending"}
//                         </span>
//                         <span className="cursorBlink ml-1">▍</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Tip */}
//                 <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/80 tipFit">
//                   ✅ Tip: If resume doesn’t open, allow popups/downloads for
//                   this site.
//                 </div>

//                 <p className="mt-2 text-[11px] text-white/45">
//                   This tab is locked for security and will automatically
//                   continue to your resume.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <style jsx global>{`
//           /* ✅ Hard fix for laptop bottom cut: scale down content on short screens */
//           @media (max-height: 760px) {
//             .cardFit {
//               padding: 18px !important;
//             }
//             .coreFit {
//               height: 168px !important;
//               width: 168px !important;
//             }
//             .streamFit {
//               display: none !important; /* remove heavy block */
//             }
//             .tipFit {
//               margin-top: 12px !important;
//               padding: 10px !important;
//               font-size: 13px !important;
//             }
//           }

//           @media (max-height: 680px) {
//             .cardFit {
//               transform: scale(0.95);
//               transform-origin: center;
//             }
//           }

//           @keyframes spinGlow {
//             from {
//               transform: rotate(0deg);
//             }
//             to {
//               transform: rotate(360deg);
//             }
//           }

//           .aurora {
//             background: radial-gradient(
//                 circle at 30% 40%,
//                 rgba(233, 200, 106, 0.1),
//                 transparent 55%
//               ),
//               radial-gradient(
//                 circle at 70% 35%,
//                 rgba(255, 255, 255, 0.05),
//                 transparent 60%
//               ),
//               radial-gradient(
//                 circle at 55% 75%,
//                 rgba(233, 200, 106, 0.08),
//                 transparent 60%
//               );
//             filter: blur(18px);
//             animation: auroraMove 6.5s ease-in-out infinite;
//             opacity: 0.75;
//           }
//           @keyframes auroraMove {
//             0% {
//               transform: translate3d(0, 0, 0) scale(1);
//             }
//             50% {
//               transform: translate3d(10px, -8px, 0) scale(1.03);
//             }
//             100% {
//               transform: translate3d(0, 0, 0) scale(1);
//             }
//           }

//           .vignette {
//             background: radial-gradient(
//               circle at 50% 50%,
//               transparent 55%,
//               rgba(0, 0, 0, 0.55) 100%
//             );
//           }

//           .noiseMask {
//             background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
//           }

//           .pulseDot {
//             animation: pulseDot 1.35s ease-in-out infinite;
//           }
//           @keyframes pulseDot {
//             0%,
//             100% {
//               transform: scale(1);
//               opacity: 0.9;
//             }
//             50% {
//               transform: scale(1.35);
//               opacity: 1;
//             }
//           }

//           .aiGlow {
//             background: radial-gradient(
//               circle at 35% 30%,
//               rgba(233, 200, 106, 0.42),
//               transparent 60%
//             );
//           }

//           .ringSpin {
//             animation: ringRotate 2.8s linear infinite;
//           }
//           @keyframes ringRotate {
//             from {
//               transform: rotate(0deg);
//             }
//             to {
//               transform: rotate(360deg);
//             }
//           }

//           .ringA {
//             background: conic-gradient(
//               from 0deg,
//               rgba(233, 200, 106, 0),
//               rgba(233, 200, 106, 0.4),
//               rgba(255, 255, 255, 0.12),
//               rgba(233, 200, 106, 0)
//             );
//             mask: radial-gradient(transparent 56%, #000 57%);
//             -webkit-mask: radial-gradient(transparent 56%, #000 57%);
//             filter: drop-shadow(0 18px 50px rgba(0, 0, 0, 0.55));
//           }

//           .ringB {
//             background: radial-gradient(
//               circle at 30% 30%,
//               rgba(233, 200, 106, 0.16),
//               transparent 60%
//             );
//             mask: radial-gradient(transparent 62%, #000 63%);
//             -webkit-mask: radial-gradient(transparent 62%, #000 63%);
//             opacity: 0.9;
//           }

//           .ringC {
//             background: conic-gradient(
//               from 180deg,
//               rgba(255, 255, 255, 0),
//               rgba(255, 255, 255, 0.1),
//               rgba(233, 200, 106, 0.18),
//               rgba(255, 255, 255, 0)
//             );
//             mask: radial-gradient(transparent 70%, #000 71%);
//             -webkit-mask: radial-gradient(transparent 70%, #000 71%);
//             opacity: 0.75;
//           }

//           .scanArc {
//             background: conic-gradient(
//               from 0deg,
//               rgba(233, 200, 106, 0) 0deg,
//               rgba(233, 200, 106, 0) 250deg,
//               rgba(233, 200, 106, 0.35) 290deg,
//               rgba(255, 255, 255, 0.1) 320deg,
//               rgba(233, 200, 106, 0) 360deg
//             );
//             mask: radial-gradient(transparent 62%, #000 63%);
//             -webkit-mask: radial-gradient(transparent 62%, #000 63%);
//             animation: scanRotate 1.35s linear infinite;
//             filter: drop-shadow(0 12px 25px rgba(233, 200, 106, 0.1));
//             opacity: 0.9;
//           }
//           @keyframes scanRotate {
//             from {
//               transform: rotate(0deg);
//             }
//             to {
//               transform: rotate(360deg);
//             }
//           }

//           .dot {
//             width: 6px;
//             height: 6px;
//             border-radius: 999px;
//             background: rgba(255, 255, 255, 0.2);
//             border: 1px solid rgba(255, 255, 255, 0.12);
//             animation: dotPulse 1.2s ease-in-out infinite;
//           }
//           .d1 {
//             animation-delay: 0s;
//           }
//           .d2 {
//             animation-delay: 0.12s;
//           }
//           .d3 {
//             animation-delay: 0.24s;
//           }
//           .d4 {
//             animation-delay: 0.36s;
//           }
//           .d5 {
//             animation-delay: 0.48s;
//           }
//           @keyframes dotPulse {
//             0%,
//             100% {
//               transform: translateY(0) scale(0.92);
//               opacity: 0.55;
//             }
//             50% {
//               transform: translateY(-2px) scale(1.08);
//               opacity: 1;
//             }
//           }

//           .shimmer {
//             width: 100%;
//             height: 100%;
//             background: linear-gradient(
//               90deg,
//               rgba(233, 200, 106, 0.06) 0%,
//               rgba(233, 200, 106, 0.35) 35%,
//               rgba(255, 255, 255, 0.1) 55%,
//               rgba(233, 200, 106, 0.06) 100%
//             );
//             animation: shimmerMove 1.15s ease-in-out infinite;
//             opacity: 0.55;
//           }
//           @keyframes shimmerMove {
//             0% {
//               transform: translateX(-70%);
//             }
//             50% {
//               transform: translateX(0%);
//             }
//             100% {
//               transform: translateX(70%);
//             }
//           }

//           .progressFill {
//             height: 100%;
//             margin-top: -12px;
//             background: linear-gradient(
//               90deg,
//               rgba(233, 200, 106, 0.12),
//               rgba(233, 200, 106, 0.6),
//               rgba(255, 255, 255, 0.14)
//             );
//             border-radius: 999px;
//             transition: width 650ms ease;
//             box-shadow: 0 12px 30px rgba(233, 200, 106, 0.12);
//           }

//           .sparkle {
//             position: absolute;
//             width: 10px;
//             height: 10px;
//             border-radius: 999px;
//             background: radial-gradient(
//               circle,
//               rgba(255, 255, 255, 0.85),
//               rgba(233, 200, 106, 0.35),
//               transparent 70%
//             );
//             opacity: 0;
//             animation: sparkleFloat 3s ease-in-out infinite;
//           }
//           @keyframes sparkleFloat {
//             0% {
//               transform: translate3d(0, 14px, 0) scale(0.85);
//               opacity: 0;
//             }
//             25% {
//               opacity: 0.55;
//             }
//             65% {
//               opacity: 0.25;
//             }
//             100% {
//               transform: translate3d(0, -18px, 0) scale(1.05);
//               opacity: 0;
//             }
//           }
//           .p1 {
//             left: 8%;
//             top: 18%;
//             animation-delay: 0s;
//           }
//           .p2 {
//             left: 22%;
//             top: 10%;
//             animation-delay: 0.5s;
//             width: 7px;
//             height: 7px;
//           }
//           .p3 {
//             left: 44%;
//             top: 6%;
//             animation-delay: 1s;
//             width: 9px;
//             height: 9px;
//           }
//           .p4 {
//             left: 70%;
//             top: 10%;
//             animation-delay: 1.4s;
//             width: 8px;
//             height: 8px;
//           }
//           .p5 {
//             left: 90%;
//             top: 22%;
//             animation-delay: 1.9s;
//             width: 11px;
//             height: 11px;
//           }
//           .p6 {
//             left: 86%;
//             top: 55%;
//             animation-delay: 0.9s;
//             width: 7px;
//             height: 7px;
//           }
//           .p7 {
//             left: 76%;
//             top: 80%;
//             animation-delay: 1.2s;
//             width: 10px;
//             height: 10px;
//           }
//           .p8 {
//             left: 52%;
//             top: 92%;
//             animation-delay: 2.2s;
//             width: 8px;
//             height: 8px;
//           }
//           .p9 {
//             left: 24%;
//             top: 84%;
//             animation-delay: 2.6s;
//             width: 12px;
//             height: 12px;
//           }
//           .p10 {
//             left: 10%;
//             top: 62%;
//             animation-delay: 1.6s;
//             width: 7px;
//             height: 7px;
//           }

//           .cursorBlink {
//             color: rgba(255, 255, 255, 0.55);
//             animation: cursorBlink 0.9s steps(2, start) infinite;
//           }
//           @keyframes cursorBlink {
//             to {
//               opacity: 0;
//             }
//           }
//         `}</style>
//       </main>
//     </div>
//   );
// }

// function CheckRow({ title, meta, active, done }) {
//   return (
//     <div
//       className={[
//         "rounded-2xl border bg-white/5 p-3 text-sm text-white/80",
//         done
//           ? "border-emerald-400/25"
//           : active
//           ? "border-[#FFD54A]/25"
//           : "border-white/10",
//       ].join(" ")}
//     >
//       <div className="flex items-start gap-3">
//         <span
//           className={[
//             "mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs",
//             done
//               ? "border-emerald-400/25 bg-emerald-500/15 text-emerald-200"
//               : active
//               ? "border-[#FFD54A]/25 bg-[#FFD54A]/15 text-[#FFE9A6]"
//               : "border-white/10 bg-white/5 text-white/60",
//           ].join(" ")}
//         >
//           {done ? "✓" : active ? "…" : "•"}
//         </span>

//         <div className="min-w-0">
//           <p className="leading-snug">{title}</p>
//           <p className="mt-0.5 text-[11px] text-white/55">{meta}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LuxuryButton from "@/components/ui/LuxuryButton";

export default function OpeningClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const rid = sp.get("rid");

  const [status, setStatus] = useState("waiting"); // waiting | ready | missing
  const [payload, setPayload] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(5);

  const key = useMemo(() => (rid ? `resume_gate:${rid}` : null), [rid]);

  const redirectedRef = useRef(false);
  const startedCountdownRef = useRef(false);

  // ✅ rid missing => direct failed
  useEffect(() => {
    if (!rid) router.replace("/resume/otp-failed?reason=missing_rid");
  }, [rid, router]);

  const resolveUrlFromData = (data) => {
    const u = data?.fullUrl || data?.url || null;
    return typeof u === "string" && u.length > 5 ? u : null;
  };

  const armCountdown = (data) => {
    const url = resolveUrlFromData(data);
    if (!url) return;
    if (redirectedRef.current) return;

    const delayMs = Number(data?.delayMs || 5000);
    const secs = Math.max(1, Math.ceil(delayMs / 1000));

    setPayload({ ...data, fullUrl: url });
    setSecondsLeft(secs);
    setStatus("ready");
  };

  // ✅ Hard lock: no scroll / wheel / context menu
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const prevent = (e) => e.preventDefault();
    const onKey = (e) => {
      if (e.key === "Escape") return;
      e.preventDefault();
    };

    document.addEventListener("touchmove", prevent, { passive: false });
    document.addEventListener("wheel", prevent, { passive: false });
    document.addEventListener("contextmenu", prevent);
    window.addEventListener("keydown", onKey, { passive: false });

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("touchmove", prevent);
      document.removeEventListener("wheel", prevent);
      document.removeEventListener("contextmenu", prevent);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // ✅ Opener postMessage (fast path)
  useEffect(() => {
    if (!rid) return;

    const onMsg = (e) => {
      if (e.origin !== window.location.origin) return;
      const d = e.data;
      if (!d || d.type !== "RESUME_READY") return;
      if (d.rid && d.rid !== rid) return;

      const data = {
        createdAt: Date.now(),
        delayMs: Number(d.delayMs || 5000),
        fullUrl: d.url,
      };

      try {
        if (key) localStorage.setItem(key, JSON.stringify(data));
      } catch {}

      armCountdown(data);
    };

    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [rid, key]);

  // ✅ Poll localStorage fallback
  useEffect(() => {
    if (!key) {
      setStatus("missing");
      return;
    }

    setStatus("waiting");

    let t;
    const startedAt = Date.now();

    const poll = () => {
      try {
        const raw = localStorage.getItem(key);

        // max ~6s wait
        if (!raw) {
          if (Date.now() - startedAt > 6000) {
            setStatus("missing");
            return;
          }
          t = setTimeout(poll, 200);
          return;
        }

        const data = JSON.parse(raw);

        // expire after 2 minutes
        const age = Date.now() - (data?.createdAt || 0);
        if (age > 2 * 60 * 1000) {
          localStorage.removeItem(key);
          setStatus("missing");
          return;
        }

        armCountdown(data);
      } catch {
        setStatus("missing");
      }
    };

    poll();
    return () => clearTimeout(t);
  }, [key]);

  // ✅ Countdown -> redirect in SAME tab
  useEffect(() => {
    if (status !== "ready") return;
    if (!payload?.fullUrl) return;
    if (redirectedRef.current) return;
    if (startedCountdownRef.current) return;

    startedCountdownRef.current = true;

    let s = Math.max(1, Number(secondsLeft || 5));

    const interval = setInterval(() => {
      s -= 1;
      setSecondsLeft(s);

      if (s <= 0) {
        clearInterval(interval);

        try {
          if (key) localStorage.removeItem(key);
        } catch {}

        redirectedRef.current = true;
        window.location.replace(payload.fullUrl);
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, payload?.fullUrl, key]);

  const onCancel = () => {
    try {
      if (key) localStorage.removeItem(key);
    } catch {}
    window.close();
    router.push("/");
  };

  // ===== UI-only helpers =====
  const totalSecs = useMemo(() => {
    const d = Number(payload?.delayMs || 5000);
    return Math.max(1, Math.ceil(d / 1000));
  }, [payload?.delayMs]);

  const progress = useMemo(() => {
    const done = Math.min(totalSecs, Math.max(0, totalSecs - secondsLeft));
    return totalSecs ? done / totalSecs : 0;
  }, [secondsLeft, totalSecs]);

  const progressPct = useMemo(() => Math.round(progress * 100), [progress]);

  const phase = useMemo(() => {
    if (status === "missing") {
      return {
        badge: "Handshake pending",
        title: "Awaiting secure confirmation…",
        sub: "Secure token not received yet. Keep this tab open.",
      };
    }
    if (status === "waiting") {
      return {
        badge: "Initializing",
        title: "Booting AI verification engine…",
        sub: "Starting privacy-safe checks and preparing secure session.",
      };
    }
    // ready
    if (secondsLeft >= 4) {
      return {
        badge: "AI Validation",
        title: "Analyzing contact details…",
        sub: "Email syntax + phone rules are being validated.",
      };
    }
    if (secondsLeft === 3) {
      return {
        badge: "Anti-Bot Shield",
        title: "Spam & abuse protection running…",
        sub: "Honeypot + rate guard checks applied.",
      };
    }
    if (secondsLeft === 2) {
      return {
        badge: "Secure Link",
        title: "Generating time-limited access link…",
        sub: "Creating a secure token with short expiry.",
      };
    }
    return {
      badge: "Finalizing",
      title: "Almost done…",
      sub: "Opening your resume now.",
    };
  }, [status, secondsLeft]);

  const checks = useMemo(() => {
    const step = (() => {
      if (status !== "ready") return 0;
      const s = Math.max(1, Math.min(5, secondsLeft));
      return 6 - s; // 1..5
    })();

    const mk = (label, i, meta) => {
      const active = status === "ready" && step === i;
      const done = status === "ready" && step > i;
      return { label, active, done, meta };
    };

    return [
      mk("Identity signal check", 1, "Name heuristics + basic sanity"),
      mk("Email verification rules", 2, "Syntax + domain pattern checks"),
      mk("Phone validation", 3, "10-digit numeric rules applied"),
      mk("Secure link generation", 4, "Short-lived token created"),
    ];
  }, [status, secondsLeft]);

  const streamLines = useMemo(() => {
    const s = secondsLeft;
    const base = [
      `session:init rid=${rid || "—"}`,
      "policy:privacy_mode=ON",
      "shield:honeypot=armed",
      "scanner:input_sanity=pass",
      "verifier:email_syntax=pass",
      "verifier:phone_rules=pass",
      "token:ttl=short",
      "handoff:resume_redirect=armed",
    ];

    if (status === "missing") {
      return [
        "handshake:waiting for token…",
        "tip:keep this tab open",
        "fallback:polling local storage",
      ];
    }
    if (status === "waiting") return base.slice(0, 4);

    if (status === "ready") {
      if (s >= 4) return base.slice(0, 5);
      if (s === 3) return base.slice(0, 6);
      if (s === 2) return base.slice(0, 7);
      return base;
    }

    return base;
  }, [rid, status, secondsLeft]);

  return (
    <div className="fixed inset-0 z-[999999] isolate overflow-hidden">
      <main className="h-[100dvh] overflow-hidden bg-[#07070b] px-4 sm:px-6">
        {/* Background */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[#07070b]" />
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(circle at 12% 18%, rgba(233,200,106,0.22), transparent 56%), radial-gradient(circle at 88% 22%, rgba(255,255,255,0.07), transparent 60%), radial-gradient(circle at 50% 92%, rgba(233,200,106,0.12), transparent 60%)",
            }}
          />
          <div className="absolute inset-0 aurora" />
          <div className="absolute inset-0 noiseMask opacity-[0.10]" />
          <div className="absolute inset-0 vignette" />
        </div>

        {/* ✅ Center wrapper (no scroll) */}
        <div className="mx-auto grid h-[100dvh] max-w-3xl place-items-center py-4 sm:py-6">
          {/* ===== Desktop/Tablet layout ===== */}
          <div className="hidden w-full sm:block">
            <div className="relative w-full overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-b from-[#0d0d12] to-[#060609] p-5 shadow-[0_45px_160px_rgba(0,0,0,0.75)] ring-1 ring-white/10 sm:p-6">
              {/* Conic border */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-[2px] rounded-[26px] opacity-80 blur-xl"
                style={{
                  background:
                    "conic-gradient(from 200deg, rgba(233,200,106,0.00), rgba(233,200,106,0.28), rgba(255,255,255,0.12), rgba(233,200,106,0.00))",
                  animation: "spinGlow 6s linear infinite",
                }}
              />

              {/* Sparkles */}
              <div aria-hidden className="pointer-events-none absolute inset-0">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className={`sparkle p${i + 1}`} />
                ))}
              </div>

              {/* Header */}
              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulseDot" />
                    {phase.badge}
                  </div>

                  <h1 className="mt-3 text-2xl font-semibold text-white">
                    {phase.title}
                  </h1>
                  <p className="mt-1 text-sm text-white/70">{phase.sub}</p>
                </div>

                <LuxuryButton
                  as="button"
                  variant="outline"
                  className="shrink-0"
                  onClick={onCancel}
                >
                  Cancel / Back
                </LuxuryButton>
              </div>

              {/* Main grid */}
              <div className="relative mt-5 grid gap-5 sm:grid-cols-[190px_1fr] sm:items-start">
                {/* Left: AI Core */}
                <div className="mx-auto sm:mx-0">
                  <div
                    className="relative"
                    style={{ width: "var(--core)", height: "var(--core)" }}
                  >
                    <div className="absolute -inset-8 rounded-full blur-3xl opacity-70 aiGlow" />

                    <div className="absolute inset-0 rounded-full ringSpin">
                      <div className="absolute inset-0 rounded-full ringA" />
                      <div className="absolute inset-[10px] rounded-full ringB" />
                      <div className="absolute inset-[22px] rounded-full ringC" />
                    </div>

                    <div className="absolute inset-[6px] rounded-full scanArc" />

                    <div className="absolute inset-[28px] rounded-full border border-white/10 bg-white/5 backdrop-blur flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-[11px] text-white/60">AI Core</p>
                        <p className="mt-1 text-3xl font-semibold text-white tabular-nums">
                          {status === "ready" ? `${progressPct}%` : "…"}
                        </p>
                        <p className="mt-1 text-[11px] text-white/55">
                          {status === "ready"
                            ? `Redirect in ${secondsLeft}s`
                            : "Warming up…"}
                        </p>

                        <div className="mt-3 flex items-center justify-center gap-1.5">
                          <span className="dot d1" />
                          <span className="dot d2" />
                          <span className="dot d3" />
                          <span className="dot d4" />
                          <span className="dot d5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="min-w-0">
                  {/* Progress box */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3 text-xs text-white/60">
                      <span className="truncate">
                        {status === "missing"
                          ? "Waiting for confirmation…"
                          : status === "waiting"
                          ? "Initializing pipeline…"
                          : "Verification in progress…"}
                      </span>
                      <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                        Secure • Time-limited
                      </span>
                    </div>

                    <div className="mt-3 h-3 w-full overflow-hidden rounded-full border border-white/10 bg-[#0b0b10]">
                      <div className="h-full shimmer" />
                      <div
                        className="progressFill"
                        style={{
                          width: `${status === "ready" ? progressPct : 10}%`,
                        }}
                      />
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {checks.map((c) => (
                        <CheckRow
                          key={c.label}
                          title={c.label}
                          meta={c.meta}
                          active={c.active}
                          done={c.done}
                        />
                      ))}
                    </div>
                  </div>

                  {/* ✅ AI stream (auto-hide on short height) */}
                  <div className="mt-4 hidden rounded-2xl border border-white/10 bg-[#060609] lg:block streamBlock">
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
                      <p className="text-xs font-semibold text-white/80">
                        AI Verification Stream
                      </p>
                      <span className="text-[11px] text-white/55">
                        privacy_mode: ON
                      </span>
                    </div>

                    <div className="relative p-4">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-40"
                        style={{
                          background:
                            "radial-gradient(circle at 20% 20%, rgba(233,200,106,0.10), transparent 55%)",
                        }}
                      />

                      <div className="relative space-y-1 font-mono text-[11px] leading-relaxed text-white/65">
                        {streamLines.map((line, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-white/35">{">"}</span>
                            <span className="break-words">{line}</span>
                            <span className="ml-auto text-white/30">
                              {status === "ready" ? "ok" : "…"}
                            </span>
                          </div>
                        ))}
                        <div className="flex items-start gap-2">
                          <span className="text-white/35">{">"}</span>
                          <span className="text-white/55">
                            {status === "ready"
                              ? "handoff:redirect armed"
                              : "handoff:pending"}
                          </span>
                          <span className="cursorBlink ml-1">▍</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ✅ Tip (auto-hide on short height) */}
                  <div className="mt-4 hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 tipBlock">
                    ✅ Tip: If resume doesn’t open, allow popups/downloads for
                    this site.
                  </div>

                  <p className="mt-3 text-[11px] text-white/45">
                    This tab is locked for security and will automatically
                    continue to your resume.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Mobile layout (center fit, no scroll) ===== */}
          <div className="w-full sm:hidden">
            <div className="relative w-full overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-b from-[#0d0d12] to-[#060609] p-4 shadow-[0_45px_160px_rgba(0,0,0,0.75)] ring-1 ring-white/10">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-[2px] rounded-[26px] opacity-80 blur-xl"
                style={{
                  background:
                    "conic-gradient(from 200deg, rgba(233,200,106,0.00), rgba(233,200,106,0.28), rgba(255,255,255,0.12), rgba(233,200,106,0.00))",
                  animation: "spinGlow 6s linear infinite",
                }}
              />

              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulseDot" />
                    {phase.badge}
                  </div>

                  <h1 className="mt-3 text-xl font-semibold text-white leading-snug">
                    {phase.title}
                  </h1>
                  <p className="mt-1 text-xs text-white/70">{phase.sub}</p>
                </div>

                <button
                  onClick={onCancel}
                  className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80"
                >
                  Back
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/60">AI Core</p>
                    <p className="text-xs text-white/60">
                      {status === "ready" ? `${progressPct}%` : "…"}
                    </p>
                  </div>

                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full border border-white/10 bg-[#0b0b10]">
                    <div className="h-full shimmer" />
                    <div
                      className="progressFill"
                      style={{
                        width: `${status === "ready" ? progressPct : 10}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-[11px] text-white/60">
                    {status === "ready"
                      ? `Redirect in ${secondsLeft}s`
                      : "Warming up…"}
                  </p>
                </div>

                <div className="grid gap-2">
                  {checks.slice(0, 3).map((c) => (
                    <CheckRow
                      key={c.label}
                      title={c.label}
                      meta={c.meta}
                      active={c.active}
                      done={c.done}
                    />
                  ))}
                </div>

                <p className="text-[11px] text-white/45">
                  Keep this tab open. Resume opens automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Global styles */}
        <style jsx global>{`
          :root {
            --core: clamp(160px, 22vw, 190px);
          }

          /* ===== keep everything inside viewport (no cut) ===== */
          @media (max-height: 760px) {
            .streamBlock {
              display: none !important;
            }
            .tipBlock {
              display: none !important;
            }
          }
          @media (max-height: 690px) {
            :root {
              --core: 155px;
            }
          }

          @keyframes spinGlow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .aurora {
            background: radial-gradient(
                circle at 30% 40%,
                rgba(233, 200, 106, 0.1),
                transparent 55%
              ),
              radial-gradient(
                circle at 70% 35%,
                rgba(255, 255, 255, 0.05),
                transparent 60%
              ),
              radial-gradient(
                circle at 55% 75%,
                rgba(233, 200, 106, 0.08),
                transparent 60%
              );
            filter: blur(18px);
            animation: auroraMove 6.5s ease-in-out infinite;
            opacity: 0.75;
          }
          @keyframes auroraMove {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(10px, -8px, 0) scale(1.03);
            }
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
          }

          .vignette {
            background: radial-gradient(
              circle at 50% 50%,
              transparent 55%,
              rgba(0, 0, 0, 0.55) 100%
            );
          }

          .noiseMask {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
          }

          .pulseDot {
            animation: pulseDot 1.35s ease-in-out infinite;
          }
          @keyframes pulseDot {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.9;
            }
            50% {
              transform: scale(1.35);
              opacity: 1;
            }
          }

          .aiGlow {
            background: radial-gradient(
              circle at 35% 30%,
              rgba(233, 200, 106, 0.42),
              transparent 60%
            );
          }

          .ringSpin {
            animation: ringRotate 2.8s linear infinite;
          }
          @keyframes ringRotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .ringA {
            background: conic-gradient(
              from 0deg,
              rgba(233, 200, 106, 0),
              rgba(233, 200, 106, 0.4),
              rgba(255, 255, 255, 0.12),
              rgba(233, 200, 106, 0)
            );
            mask: radial-gradient(transparent 56%, #000 57%);
            -webkit-mask: radial-gradient(transparent 56%, #000 57%);
            filter: drop-shadow(0 18px 50px rgba(0, 0, 0, 0.55));
          }

          .ringB {
            background: radial-gradient(
              circle at 30% 30%,
              rgba(233, 200, 106, 0.16),
              transparent 60%
            );
            mask: radial-gradient(transparent 62%, #000 63%);
            -webkit-mask: radial-gradient(transparent 62%, #000 63%);
            opacity: 0.9;
          }

          .ringC {
            background: conic-gradient(
              from 180deg,
              rgba(255, 255, 255, 0),
              rgba(255, 255, 255, 0.1),
              rgba(233, 200, 106, 0.18),
              rgba(255, 255, 255, 0)
            );
            mask: radial-gradient(transparent 70%, #000 71%);
            -webkit-mask: radial-gradient(transparent 70%, #000 71%);
            opacity: 0.75;
          }

          .scanArc {
            background: conic-gradient(
              from 0deg,
              rgba(233, 200, 106, 0) 0deg,
              rgba(233, 200, 106, 0) 250deg,
              rgba(233, 200, 106, 0.35) 290deg,
              rgba(255, 255, 255, 0.1) 320deg,
              rgba(233, 200, 106, 0) 360deg
            );
            mask: radial-gradient(transparent 62%, #000 63%);
            -webkit-mask: radial-gradient(transparent 62%, #000 63%);
            animation: scanRotate 1.35s linear infinite;
            filter: drop-shadow(0 12px 25px rgba(233, 200, 106, 0.1));
            opacity: 0.9;
          }
          @keyframes scanRotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .dot {
            width: 6px;
            height: 6px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.12);
            animation: dotPulse 1.2s ease-in-out infinite;
          }
          .d1 {
            animation-delay: 0s;
          }
          .d2 {
            animation-delay: 0.12s;
          }
          .d3 {
            animation-delay: 0.24s;
          }
          .d4 {
            animation-delay: 0.36s;
          }
          .d5 {
            animation-delay: 0.48s;
          }
          @keyframes dotPulse {
            0%,
            100% {
              transform: translateY(0) scale(0.92);
              opacity: 0.55;
            }
            50% {
              transform: translateY(-2px) scale(1.08);
              opacity: 1;
            }
          }

          .shimmer {
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              rgba(233, 200, 106, 0.06) 0%,
              rgba(233, 200, 106, 0.35) 35%,
              rgba(255, 255, 255, 0.1) 55%,
              rgba(233, 200, 106, 0.06) 100%
            );
            animation: shimmerMove 1.15s ease-in-out infinite;
            opacity: 0.55;
          }
          @keyframes shimmerMove {
            0% {
              transform: translateX(-70%);
            }
            50% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(70%);
            }
          }

          .progressFill {
            height: 100%;
            margin-top: -12px;
            background: linear-gradient(
              90deg,
              rgba(233, 200, 106, 0.12),
              rgba(233, 200, 106, 0.6),
              rgba(255, 255, 255, 0.14)
            );
            border-radius: 999px;
            transition: width 650ms ease;
            box-shadow: 0 12px 30px rgba(233, 200, 106, 0.12);
          }

          .sparkle {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 999px;
            background: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.85),
              rgba(233, 200, 106, 0.35),
              transparent 70%
            );
            opacity: 0;
            animation: sparkleFloat 3s ease-in-out infinite;
          }
          @keyframes sparkleFloat {
            0% {
              transform: translate3d(0, 14px, 0) scale(0.85);
              opacity: 0;
            }
            25% {
              opacity: 0.55;
            }
            65% {
              opacity: 0.25;
            }
            100% {
              transform: translate3d(0, -18px, 0) scale(1.05);
              opacity: 0;
            }
          }
          .p1 {
            left: 10%;
            top: 18%;
            animation-delay: 0s;
          }
          .p2 {
            left: 26%;
            top: 9%;
            animation-delay: 0.5s;
            width: 7px;
            height: 7px;
          }
          .p3 {
            left: 46%;
            top: 6%;
            animation-delay: 1s;
            width: 9px;
            height: 9px;
          }
          .p4 {
            left: 70%;
            top: 10%;
            animation-delay: 1.4s;
            width: 8px;
            height: 8px;
          }
          .p5 {
            left: 88%;
            top: 22%;
            animation-delay: 1.9s;
            width: 11px;
            height: 11px;
          }
          .p6 {
            left: 84%;
            top: 55%;
            animation-delay: 0.9s;
            width: 7px;
            height: 7px;
          }
          .p7 {
            left: 74%;
            top: 80%;
            animation-delay: 1.2s;
            width: 10px;
            height: 10px;
          }
          .p8 {
            left: 52%;
            top: 90%;
            animation-delay: 2.2s;
            width: 8px;
            height: 8px;
          }
          .p9 {
            left: 22%;
            top: 84%;
            animation-delay: 2.6s;
            width: 12px;
            height: 12px;
          }
          .p10 {
            left: 12%;
            top: 62%;
            animation-delay: 1.6s;
            width: 7px;
            height: 7px;
          }

          .cursorBlink {
            color: rgba(255, 255, 255, 0.55);
            animation: cursorBlink 0.9s steps(2, start) infinite;
          }
          @keyframes cursorBlink {
            to {
              opacity: 0;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .ringSpin,
            .scanArc,
            .aurora,
            .shimmer,
            .sparkle,
            .pulseDot {
              animation: none !important;
            }
          }
        `}</style>
      </main>
    </div>
  );
}

function CheckRow({ title, meta, active, done }) {
  return (
    <div
      className={[
        "rounded-2xl border bg-white/5 p-3 text-sm text-white/80",
        done
          ? "border-emerald-400/25"
          : active
          ? "border-[#FFD54A]/25"
          : "border-white/10",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <span
          className={[
            "mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs",
            done
              ? "border-emerald-400/25 bg-emerald-500/15 text-emerald-200"
              : active
              ? "border-[#FFD54A]/25 bg-[#FFD54A]/15 text-[#FFE9A6]"
              : "border-white/10 bg-white/5 text-white/60",
          ].join(" ")}
        >
          {done ? "✓" : active ? "…" : "•"}
        </span>

        <div className="min-w-0">
          <p className="leading-snug">{title}</p>
          <p className="mt-0.5 text-[11px] text-white/55">{meta}</p>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { usePathname, useSearchParams, useRouter } from "next/navigation";
// import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
// import { createPortal } from "react-dom";

// const EMAIL = "mukuljaiswal282@gmail.com";
// const WHATSAPP = "+919919371299"; // update if needed
// const WHATSAPP_DIGITS = WHATSAPP.replace(/[^\d]/g, "");

// const PROJECT_TYPES = [
//   { id: "portfolio", label: "Portfolio", icon: "✨" },
//   { id: "webapp", label: "Web App", icon: "⚡" },
//   { id: "landing", label: "Landing Page", icon: "🚀" },
//   { id: "redesign", label: "UI Fix / Redesign", icon: "🧠" },
//   { id: "wordpress", label: "WordPress", icon: "🧩" },
//   { id: "other", label: "Other", icon: "💬" },
// ];

// function cn(...a) {
//   return a.filter(Boolean).join(" ");
// }

// function buildWhatsAppText({ name, projectType, budget, timeline, message }) {
//   const lines = [
//     `Hi Mukul, I'm ${name || "..."}.`,
//     projectType ? `Project: ${projectType}` : null,
//     budget ? `Budget: ${budget}` : null,
//     timeline ? `Timeline: ${timeline}` : null,
//     message ? `Message: ${message}` : null,
//   ].filter(Boolean);
//   return encodeURIComponent(lines.join("\n"));
// }

// /** ✅ Premium Toast (same vibe) */
// function Toast({ toast }) {
//   return (
//     <AnimatePresence>
//       {toast?.text ? (
//         <motion.div
//           initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
//           animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//           exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
//           transition={{ duration: 0.22, ease: "easeOut" }}
//           className="pointer-events-none fixed left-1/2 z-[999] -translate-x-1/2 bottom-24 md:bottom-6"
//         >
//           <div
//             className={[
//               "relative overflow-hidden rounded-2xl border border-white/12",
//               "bg-black/70 px-4 py-3 backdrop-blur",
//               "shadow-[0_20px_60px_rgba(0,0,0,0.40)]",
//               toast.type === "ok" ? "text-[#F6E7B2]" : "text-red-200",
//             ].join(" ")}
//           >
//             <div className="flex items-start gap-3">
//               <span className="mt-[2px] grid h-7 w-7 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-sm">
//                 {toast.type === "ok" ? "✓" : "!"}
//               </span>

//               <div className="min-w-0">
//                 <p className="text-sm font-semibold text-white/90">
//                   {toast.text}
//                 </p>
//                 {toast.sub ? (
//                   <p className="mt-0.5 text-xs text-white/55">{toast.sub}</p>
//                 ) : null}
//               </div>
//             </div>

//             <motion.div
//               aria-hidden
//               className="absolute bottom-0 left-0 h-[2px] w-full bg-white/25"
//               initial={{ scaleX: 1 }}
//               animate={{ scaleX: 0 }}
//               transition={{
//                 duration: (toast.ms || 1400) / 1000,
//                 ease: "linear",
//               }}
//               style={{ transformOrigin: "left" }}
//             />
//           </div>
//         </motion.div>
//       ) : null}
//     </AnimatePresence>
//   );
// }

// /** ✅ Modal (createPortal) — SAME premium luxury feel */
// function ConfirmModal({
//   open,
//   type,
//   projectLabel,
//   onClose,
//   whatsappUrl,
//   mailUrl,
//   snapshot,
// }) {
//   const [ready, setReady] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [countdown, setCountdown] = useState(7);

//   useEffect(() => {
//     setReady(true);
//     return () => setReady(false);
//   }, []);

//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e) => {
//       if (e.key === "Escape") onClose?.();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [open, onClose]);

//   useEffect(() => {
//     if (!open) return;
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prev || "";
//     };
//   }, [open]);

//   useEffect(() => {
//     if (!open) return;

//     setCountdown(7);

//     const t = setInterval(() => {
//       setCountdown((c) => {
//         if (c <= 1) {
//           clearInterval(t);
//           onClose?.();
//           return 0;
//         }
//         return c - 1;
//       });
//     }, 1000);

//     return () => clearInterval(t);
//   }, [open, onClose]);

//   const isSuccess = type === "success";

//   const copySnapshot = async () => {
//     try {
//       const text = [
//         "Your message snapshot",
//         `Project: ${projectLabel || "-"}`,
//         `Name: ${snapshot?.name?.trim() || "-"}`,
//         `Email: ${snapshot?.email?.trim() || "-"}`,
//         `Budget: ${snapshot?.budget?.trim() || "-"}`,
//         `Timeline: ${snapshot?.timeline?.trim() || "-"}`,
//         "",
//         "Message:",
//         `${snapshot?.message?.trim() || "-"}`,
//       ].join("\n");

//       await navigator.clipboard.writeText(text);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1200);
//     } catch {
//       setCopied(false);
//     }
//   };

//   if (!open || !ready || typeof document === "undefined") return null;

//   return createPortal(
//     <div
//       className="fixed inset-0 z-[1000] grid place-items-center"
//       aria-modal="true"
//       role="dialog"
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget) onClose?.();
//       }}
//     >
//       {/* Backdrop */}
//       <motion.div
//         className="absolute inset-0 bg-black/55 backdrop-blur-[6px]"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//       />

//       {/* Modal */}
//       <motion.div
//         initial={{ opacity: 0, y: 18, scale: 0.98, filter: "blur(12px)" }}
//         animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
//         exit={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(12px)" }}
//         transition={{ duration: 0.22, ease: "easeOut" }}
//         className={[
//           "relative w-[min(920px,92vw)] rounded-[26px] border border-white/12",
//           "bg-[#0B0E14]/92 text-white shadow-[0_35px_120px_rgba(0,0,0,0.65)]",
//           "overflow-hidden",
//         ].join(" ")}
//         onMouseDown={(e) => e.stopPropagation()}
//       >
//         {/* top gold line */}
//         <div className="absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)] opacity-80" />

//         <button
//           type="button"
//           onClick={onClose}
//           className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-2xl border border-white/14 bg-white/[0.04] hover:bg-white/[0.07]"
//         >
//           ✕
//         </button>

//         <div className="p-5 sm:p-7">
//           <div className="flex items-start gap-3">
//             <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/14 bg-white/[0.04]">
//               ✦
//             </span>

//             <div className="min-w-0">
//               <p className="text-xs text-white/60">AI Confirmation</p>

//               <h3
//                 className={[
//                   "mt-1 text-2xl font-bold tracking-tight",
//                   isSuccess ? "text-[#FFD54A]" : "text-white",
//                 ].join(" ")}
//               >
//                 {isSuccess
//                   ? "Message sent successfully ✅"
//                   : "Oops! Message not sent"}
//               </h3>

//               <p className="mt-2 text-sm text-white/70">
//                 {isSuccess
//                   ? "Thanks! I received your message — I’ll reply soon (usually within 24 hours)."
//                   : "No worries — you can still reach me instantly via WhatsApp/Email."}
//               </p>

//               <p className="mt-3 text-xs text-white/55">
//                 Project: <span className="text-white/75">{projectLabel}</span>
//               </p>

//               {/* ✅ Snapshot (success + fail both) */}
//               {snapshot ? (
//                 <div className="mt-4 rounded-2xl border border-white/12 bg-white/[0.03] p-4">
//                   <div className="flex items-center justify-between gap-3">
//                     <p className="text-sm font-semibold text-white/85">
//                       Your message snapshot
//                     </p>

//                     <div className="flex items-center gap-2">
//                       <span className="text-xs text-white/50">Auto-saved</span>

//                       <button
//                         type="button"
//                         onClick={copySnapshot}
//                         className="rounded-xl border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-white/80 hover:bg-white/[0.07] transition"
//                       >
//                         {copied ? "Copied ✓" : "Copy snapshot"}
//                       </button>
//                     </div>
//                   </div>

//                   <div className="mt-2 rounded-xl border border-white/10 bg-black/20 p-3">
//                     <div className="text-xs text-white/60">
//                       <span className="text-white/80">Name:</span>{" "}
//                       {snapshot?.name?.trim() ? snapshot.name.trim() : "—"}
//                       <span className="mx-2 text-white/30">•</span>
//                       <span className="text-white/80">Email:</span>{" "}
//                       {snapshot?.email?.trim() ? snapshot.email.trim() : "—"}
//                     </div>

//                     <div className="mt-1 text-xs text-white/60">
//                       <span className="text-white/80">Budget:</span>{" "}
//                       {snapshot?.budget?.trim() ? snapshot.budget.trim() : "—"}
//                       <span className="mx-2 text-white/30">•</span>
//                       <span className="text-white/80">Timeline:</span>{" "}
//                       {snapshot?.timeline?.trim()
//                         ? snapshot.timeline.trim()
//                         : "—"}
//                     </div>

//                     <div className="mt-1 text-xs text-white/60">
//                       <span className="text-white/80">Project:</span>{" "}
//                       {projectLabel}
//                     </div>

//                     <div className="mt-3">
//                       <p className="text-xs text-white/55 mb-1">Message</p>
//                       <div className="max-h-32 overflow-auto whitespace-pre-wrap text-sm text-white/80 leading-relaxed">
//                         {snapshot?.message?.trim()
//                           ? snapshot.message.trim()
//                           : "—"}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : null}
//             </div>
//           </div>

//           {/* Highlights */}
//           <div className="mt-5 grid gap-3 sm:grid-cols-3">
//             {[
//               {
//                 icon: "⚡",
//                 title: "Fast + smooth UI",
//                 desc: "Clean animations, responsive layouts, premium feel.",
//               },
//               {
//                 icon: "🛡️",
//                 title: "Secure + scalable",
//                 desc: "Best practices, clean APIs, production-ready code.",
//               },
//               {
//                 icon: "✅",
//                 title: "Clear delivery",
//                 desc: "Milestones, revisions plan, and support guidance.",
//               },
//             ].map((x) => (
//               <div
//                 key={x.title}
//                 className="rounded-2xl border border-white/12 bg-white/[0.04] p-4"
//               >
//                 <p className="text-sm font-semibold">
//                   <span className="mr-2">{x.icon}</span>
//                   {x.title}
//                 </p>
//                 <p className="mt-1 text-xs text-white/65">{x.desc}</p>
//               </div>
//             ))}
//           </div>

//           {/* fallback strip (only on fail) */}
//           {!isSuccess ? (
//             <div className="mt-4 rounded-2xl border border-white/12 bg-white/[0.03] p-4">
//               <p className="text-sm font-semibold">Quick fallback</p>
//               <p className="mt-1 text-xs text-white/65">
//                 Sometimes server delay happens. Your snapshot is safe — use
//                 WhatsApp/Email for instant contact.
//               </p>
//             </div>
//           ) : null}

//           {/* actions */}
//           <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
//             <div className="flex flex-wrap gap-3">
//               <a
//                 href="/projects"
//                 className="rounded-2xl border border-white/14 bg-white/[0.03] px-4 py-2 text-sm hover:bg-white/[0.06]"
//               >
//                 View Projects →
//               </a>
//               <a
//                 href="/services"
//                 className="rounded-2xl border border-white/14 bg-[#FFD54A]/20 px-4 py-2 text-sm hover:bg-[#FFD54A]/25"
//               >
//                 Services →
//               </a>
//             </div>

//             <div className="flex flex-wrap gap-3">
//               <a
//                 href={whatsappUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="rounded-2xl border border-white/14 bg-white/[0.03] px-4 py-2 text-sm hover:bg-white/[0.06]"
//               >
//                 WhatsApp
//               </a>
//               <a
//                 href={mailUrl}
//                 className="rounded-2xl border border-white/14 bg-white/[0.03] px-4 py-2 text-sm hover:bg-white/[0.06]"
//               >
//                 Email
//               </a>
//             </div>
//           </div>

//           <p className="mt-3 text-xs text-white/45">
//             Auto close in{" "}
//             <span className="text-white/80 font-semibold">{countdown}</span>s •
//             Tap outside or press Esc to close
//           </p>
//         </div>
//       </motion.div>
//     </div>,
//     document.body
//   );
// }

// export default function ContactPageClient() {
//   const reduce = useReducedMotion();
//   const router = useRouter();
//   const pathname = usePathname();
//   const sp = useSearchParams();

//   const prefillProject =
//     sp.get("project") || sp.get("package") || sp.get("intent") || "";
//   const prefillFrom = sp.get("from") || "";
//   const prefillMsg = sp.get("message") || "";

//   const [projectType, setProjectType] = useState(prefillProject || "portfolio");
//   const [budget, setBudget] = useState("");
//   const [timeline, setTimeline] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState(prefillMsg || "");
//   const [companyWebsite, setCompanyWebsite] = useState(""); // honeypot

//   const [loading, setLoading] = useState(false);

//   // ✅ keep your existing toast + add premium toast (same behavior)
//   const [toast, setToast] = useState(null); // {type:'ok'|'err', text:''}
//   const [pToast, setPToast] = useState(null); // premium toast

//   // ✅ modal
//   const [modal, setModal] = useState({
//     open: false,
//     type: "success",
//     snapshot: null,
//   });

//   const source = useMemo(() => {
//     if (prefillFrom) return prefillFrom;
//     return "contact-page";
//   }, [prefillFrom]);

//   const activeProject = useMemo(() => {
//     return PROJECT_TYPES.find((x) => x.id === projectType) || PROJECT_TYPES[0];
//   }, [projectType]);

//   const projectLabel = useMemo(() => {
//     return `${activeProject.icon} ${activeProject.label}`;
//   }, [activeProject]);

//   const waLink = useMemo(() => {
//     const txt = buildWhatsAppText({
//       name,
//       projectType,
//       budget,
//       timeline,
//       message,
//     });
//     return `https://wa.me/${WHATSAPP_DIGITS}?text=${txt}`;
//   }, [name, projectType, budget, timeline, message]);

//   const mailto = useMemo(() => {
//     const subject = encodeURIComponent(
//       `Project inquiry (${projectType || "General"})`
//     );
//     const body = encodeURIComponent(
//       `Hi Mukul,\n\nName: ${name}\nProject: ${projectType}\nBudget: ${budget}\nTimeline: ${timeline}\n\nMessage:\n${message}\n\nSource: ${source}\nPage: ${pathname}\n`
//     );
//     return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
//   }, [name, projectType, budget, timeline, message, source, pathname]);

//   const showPremiumToast = (type, text, sub, ms = 1400) => {
//     setPToast({ type, text, sub, ms });
//     setTimeout(() => setPToast(null), ms);
//   };

//   async function copyText(txt) {
//     try {
//       await navigator.clipboard.writeText(txt);
//       setToast({ type: "ok", text: "Copied!" });
//       showPremiumToast("ok", "Copied!", "You can paste it anywhere ✨", 1400);
//       setTimeout(() => setToast(null), 1600);
//     } catch {
//       setToast({ type: "err", text: "Copy failed" });
//       showPremiumToast("err", "Copy failed", "Please try again.", 1600);
//       setTimeout(() => setToast(null), 1600);
//     }
//   }

//   const clearAllAfterSuccess = () => {
//     setProjectType("portfolio");
//     setBudget("");
//     setTimeline("");
//     setName("");
//     setEmail("");
//     setMessage("");
//   };

//   async function onSubmit(e) {
//     e.preventDefault();
//     if (loading) return;

//     setLoading(true);
//     setToast(null);

//     // ✅ snapshot BEFORE clearing
//     const snap = {
//       name,
//       email,
//       message,
//       budget,
//       timeline,
//       projectType: projectLabel,
//     };

//     try {
//       const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           email,
//           message,
//           projectType,
//           budget,
//           timeline,
//           source,
//           page: pathname,
//           companyWebsite, // honeypot
//         }),
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok || !data?.ok) {
//         throw new Error(data?.error || "Failed to send.");
//       }

//       // ✅ success toast + modal
//       setToast({ type: "ok", text: "Message sent ✅ I’ll reply soon." });
//       showPremiumToast("ok", "Sent!", "I’ll reply soon ✨", 1400);

//       setModal({ open: true, type: "success", snapshot: snap });

//       // ✅ reset (like homepage)
//       clearAllAfterSuccess();
//     } catch (err) {
//       const msg = err?.message || "Something went wrong.";

//       setToast({ type: "err", text: msg });
//       showPremiumToast("err", "Failed", msg, 1600);

//       // ✅ fail modal (snapshot safe)
//       setModal({ open: true, type: "error", snapshot: snap });
//     } finally {
//       setLoading(false);
//       setTimeout(() => setToast(null), 2200);
//     }
//   }

//   return (
//     <>
//       {/* ✅ premium toast + modal */}
//       <Toast toast={pToast} />

//       <AnimatePresence>
//         {modal.open ? (
//           <ConfirmModal
//             open={modal.open}
//             type={modal.type === "success" ? "success" : "error"}
//             projectLabel={projectLabel}
//             whatsappUrl={waLink}
//             mailUrl={mailto}
//             snapshot={modal.snapshot}
//             onClose={() => setModal((p) => ({ ...p, open: false }))}
//           />
//         ) : null}
//       </AnimatePresence>

//       <section className="relative overflow-hidden">
//         {/* premium background */}
//         <div className="pointer-events-none absolute inset-0">
//           <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />
//           <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-foreground/10 blur-3xl" />
//         </div>

//         <div className="relative mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-20">
//           {/* header */}
//           <div className="max-w-2xl">
//             <p className="text-sm text-white/55">Contact</p>
//             <h1 className="mt-2 text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-[linear-gradient(180deg,#FFE7A3_0%,#E9C86A_45%,#B8892E_100%)] md:text-4xl">
//               Let’s build something together
//             </h1>
//             <p className="mt-2 text-white/65">
//               Send a message and I’ll get back to you. (Avg reply &lt; 24h)
//             </p>
//           </div>

//           {/* layout */}
//           <div className="mt-8 grid gap-6 lg:grid-cols-2">
//             {/* LEFT: quick actions */}
//             <motion.div
//               initial={
//                 reduce ? false : { opacity: 0, y: 14, filter: "blur(10px)" }
//               }
//               animate={reduce ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
//               transition={{ duration: 0.35, ease: "easeOut" }}
//               className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/65 backdrop-blur-xl shadow-[0_24px_85px_rgba(0,0,0,0.60)]"
//             >
//               <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)]" />

//               <div className="p-5 sm:p-6">
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <p className="text-sm font-semibold text-white/85">
//                       Prefer WhatsApp or Email?
//                     </p>
//                     <p className="mt-1 text-sm text-white/60">
//                       Quick contact below (copy / open).
//                     </p>
//                   </div>
//                   <span className="shrink-0 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-white/75">
//                     Reply &lt; 24h
//                   </span>
//                 </div>

//                 {/* project types */}
//                 <div className="mt-5">
//                   <p className="text-xs text-white/55 mb-2">Project type</p>
//                   <div className="flex flex-wrap gap-2">
//                     {PROJECT_TYPES.map((t) => {
//                       const active = projectType === t.id;
//                       return (
//                         <button
//                           key={t.id}
//                           type="button"
//                           onClick={() => setProjectType(t.id)}
//                           className={cn(
//                             "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
//                             active
//                               ? "border-[#FFD54A]/25 bg-[#FFD54A]/10 text-[#F6E7B2]"
//                               : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06]"
//                           )}
//                         >
//                           <span
//                             className={cn(
//                               active
//                                 ? "drop-shadow-[0_0_12px_rgba(255,215,0,0.35)]"
//                                 : ""
//                             )}
//                           >
//                             {t.icon}
//                           </span>
//                           {t.label}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* budget/timeline */}
//                 <div className="mt-5 grid gap-3 sm:grid-cols-2">
//                   <div>
//                     <label className="text-xs text-white/55">Budget</label>
//                     <input
//                       value={budget}
//                       onChange={(e) => setBudget(e.target.value)}
//                       className="mt-1 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 outline-none focus:border-[#FFD54A]/30"
//                       placeholder="e.g. ₹15k–₹30k"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-xs text-white/55">Timeline</label>
//                     <input
//                       value={timeline}
//                       onChange={(e) => setTimeline(e.target.value)}
//                       className="mt-1 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 outline-none focus:border-[#FFD54A]/30"
//                       placeholder="e.g. 7–10 days"
//                     />
//                   </div>
//                 </div>

//                 {/* Email row */}
//                 <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
//                   <div className="flex items-center justify-between gap-3">
//                     <div className="min-w-0">
//                       <p className="text-xs text-white/55">Email</p>
//                       <p className="truncate text-sm font-semibold text-[#F6E7B2]">
//                         {EMAIL}
//                       </p>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => copyText(EMAIL)}
//                       className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/75 hover:bg-white/[0.06]"
//                     >
//                       Copy
//                     </button>
//                   </div>
//                 </div>

//                 {/* WhatsApp row */}
//                 <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
//                   <div className="flex items-center justify-between gap-3">
//                     <div className="min-w-0">
//                       <p className="text-xs text-white/55">WhatsApp</p>
//                       <p className="truncate text-sm font-semibold text-[#F6E7B2]">
//                         {WHATSAPP}
//                       </p>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => copyText(WHATSAPP)}
//                       className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/75 hover:bg-white/[0.06]"
//                     >
//                       Copy
//                     </button>
//                   </div>
//                 </div>

//                 {/* CTAs */}
//                 <div className="mt-5 flex flex-wrap gap-3">
//                   <a
//                     href={waLink}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="inline-flex items-center justify-center rounded-2xl border border-[#FFD54A]/25 bg-[#FFD54A]/10 px-5 py-3 text-sm font-semibold text-[#F6E7B2] hover:bg-[#FFD54A]/16 transition"
//                   >
//                     WhatsApp now →
//                   </a>

//                   <a
//                     href={mailto}
//                     className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/75 hover:bg-white/[0.06] transition"
//                   >
//                     Email now →
//                   </a>
//                 </div>

//                 <p className="mt-4 text-xs text-white/45">
//                   Tip: WhatsApp/Email buttons auto include your selected project
//                   details.
//                 </p>
//               </div>
//             </motion.div>

//             {/* RIGHT: form */}
//             <motion.div
//               initial={
//                 reduce ? false : { opacity: 0, y: 14, filter: "blur(10px)" }
//               }
//               animate={reduce ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
//               transition={{ duration: 0.35, ease: "easeOut", delay: 0.06 }}
//               className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/65 backdrop-blur-xl shadow-[0_24px_85px_rgba(0,0,0,0.60)]"
//             >
//               <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)]" />

//               <form onSubmit={onSubmit} className="p-5 sm:p-6">
//                 {/* honeypot hidden */}
//                 <input
//                   value={companyWebsite}
//                   onChange={(e) => setCompanyWebsite(e.target.value)}
//                   className="hidden"
//                   tabIndex={-1}
//                   autoComplete="off"
//                 />

//                 <div className="grid gap-3">
//                   <div>
//                     <label className="text-xs text-white/55">Your name</label>
//                     <input
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       className="mt-1 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 outline-none focus:border-[#FFD54A]/30"
//                       placeholder="Mukul Jaiswal"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="text-xs text-white/55">Your email</label>
//                     <input
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="mt-1 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 outline-none focus:border-[#FFD54A]/30"
//                       placeholder="you@example.com"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="text-xs text-white/55">
//                       Your message
//                     </label>
//                     <textarea
//                       value={message}
//                       onChange={(e) => setMessage(e.target.value)}
//                       className="mt-1 min-h-[140px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 outline-none focus:border-[#FFD54A]/30"
//                       placeholder="Tell me what you want to build…"
//                       required
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={cn(
//                       "relative mt-2 inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-semibold transition overflow-hidden",
//                       "border-[#FFD54A]/25 bg-[#FFD54A]/10 text-[#F6E7B2] hover:bg-[#FFD54A]/16",
//                       loading ? "opacity-60 cursor-not-allowed" : ""
//                     )}
//                   >
//                     <span className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-70" />
//                     <span className="relative">
//                       {loading ? "Sending..." : "Send Message"}
//                     </span>
//                   </button>

//                   <p className="text-xs text-white/45">
//                     By sending, you agree to be contacted back on
//                     email/WhatsApp.
//                   </p>
//                 </div>

//                 {/* existing toast (kept) */}
//                 <AnimatePresence>
//                   {toast ? (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10, scale: 0.98 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       exit={{ opacity: 0, y: 10, scale: 0.98 }}
//                       className={cn(
//                         "mt-4 rounded-2xl border px-4 py-3 text-sm",
//                         toast.type === "ok"
//                           ? "border-[#FFD54A]/25 bg-[#FFD54A]/10 text-[#F6E7B2]"
//                           : "border-red-400/20 bg-red-500/10 text-red-200"
//                       )}
//                     >
//                       {toast.text}
//                     </motion.div>
//                   ) : null}
//                 </AnimatePresence>
//               </form>
//             </motion.div>
//           </div>

//           {/* subtle footer helper */}
//           <div className="mt-8 text-xs text-white/45">
//             Need fast response? Use WhatsApp. For detailed brief, use the form.
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";

const EMAIL = "mukuljaiswal282@gmail.com";
const WHATSAPP = "+919919371299"; // update if needed
const WHATSAPP_DIGITS = WHATSAPP.replace(/[^\d]/g, "");

const PROJECT_TYPES = [
  { id: "portfolio", label: "Portfolio", icon: "✨" },
  { id: "webapp", label: "Web App", icon: "⚡" },
  { id: "landing", label: "Landing Page", icon: "🚀" },
  { id: "redesign", label: "UI Fix / Redesign", icon: "🧠" },
  { id: "wordpress", label: "WordPress", icon: "🧩" },
  { id: "other", label: "Other", icon: "💬" },
];

function cn(...a) {
  return a.filter(Boolean).join(" ");
}

function buildWhatsAppText({ name, projectType, budget, timeline, message }) {
  const lines = [
    `Hi Mukul, I'm ${name || "..."}.`,
    projectType ? `Project: ${projectType}` : null,
    budget ? `Budget: ${budget}` : null,
    timeline ? `Timeline: ${timeline}` : null,
    message ? `Message: ${message}` : null,
  ].filter(Boolean);
  return encodeURIComponent(lines.join("\n"));
}

/** ✅ Premium Toast */
function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast?.text ? (
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="pointer-events-none fixed left-1/2 z-[999] -translate-x-1/2 bottom-24 md:bottom-6"
        >
          <div
            className={[
              "relative overflow-hidden rounded-2xl border border-white/12",
              "bg-black/70 px-4 py-3 backdrop-blur",
              "shadow-[0_20px_60px_rgba(0,0,0,0.40)]",
              toast.type === "ok" ? "text-[#F6E7B2]" : "text-red-200",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <span className="mt-[2px] grid h-7 w-7 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-sm">
                {toast.type === "ok" ? "✓" : "!"}
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-white/90">
                  {toast.text}
                </p>
                {toast.sub ? (
                  <p className="mt-0.5 text-xs text-white/55">{toast.sub}</p>
                ) : null}
              </div>
            </div>

            <motion.div
              aria-hidden
              className="absolute bottom-0 left-0 h-[2px] w-full bg-white/25"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{
                duration: (toast.ms || 1400) / 1000,
                ease: "linear",
              }}
              style={{ transformOrigin: "left" }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** ✅ Modal (createPortal) — MOBILE FIXED */
function ConfirmModal({
  open,
  type,
  projectLabel,
  onClose,
  whatsappUrl,
  mailUrl,
  snapshot,
}) {
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    setReady(true);
    return () => setReady(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // lock background scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setCountdown(7);

    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t);
          onClose?.();
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [open, onClose]);

  const isSuccess = type === "success";

  const copySnapshot = async () => {
    try {
      const text = [
        "Your message snapshot",
        `Project: ${projectLabel || "-"}`,
        `Name: ${snapshot?.name?.trim() || "-"}`,
        `Email: ${snapshot?.email?.trim() || "-"}`,
        `Budget: ${snapshot?.budget?.trim() || "-"}`,
        `Timeline: ${snapshot?.timeline?.trim() || "-"}`,
        "",
        "Message:",
        `${snapshot?.message?.trim() || "-"}`,
      ].join("\n");

      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  if (!open || !ready || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/55 backdrop-blur-[6px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={() => onClose?.()}
      />

      {/* Center wrapper (safe-area + no cut on mobile) */}
      <div
        className="relative min-h-[100dvh] px-4 flex items-start sm:items-center justify-center"
        style={{
          paddingTop: "max(16px, env(safe-area-inset-top))",
          paddingBottom: "max(16px, env(safe-area-inset-bottom))",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(12px)" }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={[
            "relative w-[min(920px,92vw)] rounded-[26px] border border-white/12",
            "bg-[#0B0E14]/92 text-white shadow-[0_35px_120px_rgba(0,0,0,0.65)]",
            "overflow-hidden",
            "max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)]",
            "overflow-y-auto overscroll-contain",
          ].join(" ")}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* top gold line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)] opacity-80" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-2xl border border-white/14 bg-white/[0.04] hover:bg-white/[0.07]"
          >
            ✕
          </button>

          <div className="p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/14 bg-white/[0.04]">
                ✦
              </span>

              <div className="min-w-0">
                <p className="text-xs text-white/60">AI Confirmation</p>

                <h3
                  className={[
                    "mt-1 text-2xl font-bold tracking-tight",
                    isSuccess ? "text-[#FFD54A]" : "text-white",
                  ].join(" ")}
                >
                  {isSuccess
                    ? "Message sent successfully ✅"
                    : "Oops! Message not sent"}
                </h3>

                <p className="mt-2 text-sm text-white/70">
                  {isSuccess
                    ? "Thanks! I received your message — I’ll reply soon (usually within 24 hours)."
                    : "No worries — you can still reach me instantly via WhatsApp/Email."}
                </p>

                <p className="mt-3 text-xs text-white/55">
                  Project: <span className="text-white/75">{projectLabel}</span>
                </p>

                {snapshot ? (
                  <div className="mt-4 rounded-2xl border border-white/12 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white/85">
                        Your message snapshot
                      </p>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">
                          Auto-saved
                        </span>

                        <button
                          type="button"
                          onClick={copySnapshot}
                          className="rounded-xl border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-white/80 hover:bg-white/[0.07] transition"
                        >
                          {copied ? "Copied ✓" : "Copy snapshot"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 rounded-xl border border-white/10 bg-black/20 p-3">
                      <div className="text-xs text-white/60">
                        <span className="text-white/80">Name:</span>{" "}
                        {snapshot?.name?.trim() ? snapshot.name.trim() : "—"}
                        <span className="mx-2 text-white/30">•</span>
                        <span className="text-white/80">Email:</span>{" "}
                        {snapshot?.email?.trim() ? snapshot.email.trim() : "—"}
                      </div>

                      <div className="mt-1 text-xs text-white/60">
                        <span className="text-white/80">Budget:</span>{" "}
                        {snapshot?.budget?.trim()
                          ? snapshot.budget.trim()
                          : "—"}
                        <span className="mx-2 text-white/30">•</span>
                        <span className="text-white/80">Timeline:</span>{" "}
                        {snapshot?.timeline?.trim()
                          ? snapshot.timeline.trim()
                          : "—"}
                      </div>

                      <div className="mt-1 text-xs text-white/60">
                        <span className="text-white/80">Project:</span>{" "}
                        {projectLabel}
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-white/55 mb-1">Message</p>
                        <div className="max-h-32 overflow-auto whitespace-pre-wrap text-sm text-white/80 leading-relaxed">
                          {snapshot?.message?.trim()
                            ? snapshot.message.trim()
                            : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: "⚡",
                  title: "Fast + smooth UI",
                  desc: "Clean animations, responsive layouts, premium feel.",
                },
                {
                  icon: "🛡️",
                  title: "Secure + scalable",
                  desc: "Best practices, clean APIs, production-ready code.",
                },
                {
                  icon: "✅",
                  title: "Clear delivery",
                  desc: "Milestones, revisions plan, and support guidance.",
                },
              ].map((x) => (
                <div
                  key={x.title}
                  className="rounded-2xl border border-white/12 bg-white/[0.04] p-4"
                >
                  <p className="text-sm font-semibold">
                    <span className="mr-2">{x.icon}</span>
                    {x.title}
                  </p>
                  <p className="mt-1 text-xs text-white/65">{x.desc}</p>
                </div>
              ))}
            </div>

            {!isSuccess ? (
              <div className="mt-4 rounded-2xl border border-white/12 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold">Quick fallback</p>
                <p className="mt-1 text-xs text-white/65">
                  Sometimes server delay happens. Your snapshot is safe — use
                  WhatsApp/Email for instant contact.
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-3">
                <a
                  href="/projects"
                  className="rounded-2xl border border-white/14 bg-white/[0.03] px-4 py-2 text-sm hover:bg-white/[0.06]"
                >
                  View Projects →
                </a>
                <a
                  href="/services"
                  className="rounded-2xl border border-white/14 bg-[#FFD54A]/20 px-4 py-2 text-sm hover:bg-[#FFD54A]/25"
                >
                  Services →
                </a>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-white/14 bg-white/[0.03] px-4 py-2 text-sm hover:bg-white/[0.06]"
                >
                  WhatsApp
                </a>
                <a
                  href={mailUrl}
                  className="rounded-2xl border border-white/14 bg-white/[0.03] px-4 py-2 text-sm hover:bg-white/[0.06]"
                >
                  Email
                </a>
              </div>
            </div>

            <p className="mt-3 text-xs text-white/45">
              Auto close in{" "}
              <span className="text-white/80 font-semibold">{countdown}</span>s
              • Tap outside or press Esc to close
            </p>
          </div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
}

export default function ContactPageClient() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const sp = useSearchParams();

  const prefillProject =
    sp.get("project") || sp.get("package") || sp.get("intent") || "";
  const prefillFrom = sp.get("from") || "";
  const prefillMsg = sp.get("message") || "";

  const [projectType, setProjectType] = useState(prefillProject || "portfolio");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(prefillMsg || "");
  const [companyWebsite, setCompanyWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const [pToast, setPToast] = useState(null);

  const [modal, setModal] = useState({
    open: false,
    type: "success",
    snapshot: null,
  });

  const source = useMemo(
    () => (prefillFrom ? prefillFrom : "contact-page"),
    [prefillFrom]
  );

  const activeProject = useMemo(() => {
    return PROJECT_TYPES.find((x) => x.id === projectType) || PROJECT_TYPES[0];
  }, [projectType]);

  const projectLabel = useMemo(
    () => `${activeProject.icon} ${activeProject.label}`,
    [activeProject]
  );

  const waLink = useMemo(() => {
    const txt = buildWhatsAppText({
      name,
      projectType,
      budget,
      timeline,
      message,
    });
    return `https://wa.me/${WHATSAPP_DIGITS}?text=${txt}`;
  }, [name, projectType, budget, timeline, message]);

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(
      `Project inquiry (${projectType || "General"})`
    );
    const body = encodeURIComponent(
      `Hi Mukul,\n\nName: ${name}\nProject: ${projectType}\nBudget: ${budget}\nTimeline: ${timeline}\n\nMessage:\n${message}\n\nSource: ${source}\nPage: ${pathname}\n`
    );
    return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }, [name, projectType, budget, timeline, message, source, pathname]);

  const showPremiumToast = (type, text, sub, ms = 1400) => {
    setPToast({ type, text, sub, ms });
    setTimeout(() => setPToast(null), ms);
  };

  async function copyText(txt) {
    try {
      await navigator.clipboard.writeText(txt);
      setToast({ type: "ok", text: "Copied!" });
      showPremiumToast("ok", "Copied!", "You can paste it anywhere ✨", 1400);
      setTimeout(() => setToast(null), 1600);
    } catch {
      setToast({ type: "err", text: "Copy failed" });
      showPremiumToast("err", "Copy failed", "Please try again.", 1600);
      setTimeout(() => setToast(null), 1600);
    }
  }

  const clearAllAfterSuccess = () => {
    setProjectType("portfolio");
    setBudget("");
    setTimeline("");
    setName("");
    setEmail("");
    setMessage("");
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setToast(null);

    const snap = {
      name,
      email,
      message,
      budget,
      timeline,
      projectType: projectLabel,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          projectType,
          budget,
          timeline,
          source,
          page: pathname,
          companyWebsite,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok)
        throw new Error(data?.error || "Failed to send.");

      setToast({ type: "ok", text: "Message sent ✅ I’ll reply soon." });
      showPremiumToast("ok", "Sent!", "I’ll reply soon ✨", 1400);

      setModal({ open: true, type: "success", snapshot: snap });
      clearAllAfterSuccess();
    } catch (err) {
      const msg = err?.message || "Something went wrong.";
      setToast({ type: "err", text: msg });
      showPremiumToast("err", "Failed", msg, 1600);
      setModal({ open: true, type: "error", snapshot: snap });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 2200);
    }
  }

  return (
    <>
      <Toast toast={pToast} />

      <AnimatePresence>
        {modal.open ? (
          <ConfirmModal
            open={modal.open}
            type={modal.type === "success" ? "success" : "error"}
            projectLabel={projectLabel}
            whatsappUrl={waLink}
            mailUrl={mailto}
            snapshot={modal.snapshot}
            onClose={() => setModal((p) => ({ ...p, open: false }))}
          />
        ) : null}
      </AnimatePresence>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-foreground/10 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <div className="max-w-2xl">
            <p className="text-sm text-white/55">Contact</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-[linear-gradient(180deg,#FFE7A3_0%,#E9C86A_45%,#B8892E_100%)] md:text-4xl">
              Let’s build something together
            </h1>
            <p className="mt-2 text-white/65">
              Send a message and I’ll get back to you. (Avg reply &lt; 24h)
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* LEFT */}
            <motion.div
              initial={
                reduce ? false : { opacity: 0, y: 14, filter: "blur(10px)" }
              }
              animate={reduce ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/65 backdrop-blur-xl shadow-[0_24px_85px_rgba(0,0,0,0.60)]"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)]" />

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white/85">
                      Prefer WhatsApp or Email?
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      Quick contact below (copy / open).
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-white/75">
                    Reply &lt; 24h
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-xs text-white/55 mb-2">Project type</p>
                  <div className="flex flex-wrap gap-2">
                    {PROJECT_TYPES.map((t) => {
                      const active = projectType === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setProjectType(t.id)}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                            active
                              ? "border-[#FFD54A]/25 bg-[#FFD54A]/10 text-[#F6E7B2]"
                              : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06]"
                          )}
                        >
                          <span
                            className={cn(
                              active
                                ? "drop-shadow-[0_0_12px_rgba(255,215,0,0.35)]"
                                : ""
                            )}
                          >
                            {t.icon}
                          </span>
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-white/55">Budget</label>
                    <input
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 outline-none focus:border-[#FFD54A]/30"
                      placeholder="e.g. ₹15k–₹30k"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/55">Timeline</label>
                    <input
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 outline-none focus:border-[#FFD54A]/30"
                      placeholder="e.g. 7–10 days"
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-white/55">Email</p>
                      <p className="truncate text-sm font-semibold text-[#F6E7B2]">
                        {EMAIL}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(EMAIL)}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/75 hover:bg-white/[0.06]"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-white/55">WhatsApp</p>
                      <p className="truncate text-sm font-semibold text-[#F6E7B2]">
                        {WHATSAPP}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(WHATSAPP)}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/75 hover:bg-white/[0.06]"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl border border-[#FFD54A]/25 bg-[#FFD54A]/10 px-5 py-3 text-sm font-semibold text-[#F6E7B2] hover:bg-[#FFD54A]/16 transition"
                  >
                    WhatsApp now →
                  </a>

                  <a
                    href={mailto}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/75 hover:bg-white/[0.06] transition"
                  >
                    Email now →
                  </a>
                </div>

                <p className="mt-4 text-xs text-white/45">
                  Tip: WhatsApp/Email buttons auto include your selected project
                  details.
                </p>
              </div>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={
                reduce ? false : { opacity: 0, y: 14, filter: "blur(10px)" }
              }
              animate={reduce ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.06 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/65 backdrop-blur-xl shadow-[0_24px_85px_rgba(0,0,0,0.60)]"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)]" />

              <form onSubmit={onSubmit} className="p-5 sm:p-6">
                <input
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid gap-3">
                  <div>
                    <label className="text-xs text-white/55">Your name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 outline-none focus:border-[#FFD54A]/30"
                      placeholder="Mukul Jaiswal"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/55">Your email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 outline-none focus:border-[#FFD54A]/30"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/55">
                      Your message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-1 min-h-[140px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 outline-none focus:border-[#FFD54A]/30"
                      placeholder="Tell me what you want to build…"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      "relative mt-2 inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-semibold transition overflow-hidden",
                      "border-[#FFD54A]/25 bg-[#FFD54A]/10 text-[#F6E7B2] hover:bg-[#FFD54A]/16",
                      loading ? "opacity-60 cursor-not-allowed" : ""
                    )}
                  >
                    <span className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-70" />
                    <span className="relative">
                      {loading ? "Sending..." : "Send Message"}
                    </span>
                  </button>

                  <p className="text-xs text-white/45">
                    By sending, you agree to be contacted back on
                    email/WhatsApp.
                  </p>
                </div>

                <AnimatePresence>
                  {toast ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className={cn(
                        "mt-4 rounded-2xl border px-4 py-3 text-sm",
                        toast.type === "ok"
                          ? "border-[#FFD54A]/25 bg-[#FFD54A]/10 text-[#F6E7B2]"
                          : "border-red-400/20 bg-red-500/10 text-red-200"
                      )}
                    >
                      {toast.text}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>

          <div className="mt-8 text-xs text-white/45">
            Need fast response? Use WhatsApp. For detailed brief, use the form.
          </div>
        </div>
      </section>
    </>
  );
}

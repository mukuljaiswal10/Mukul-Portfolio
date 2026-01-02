// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { createPortal } from "react-dom";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import Input from "@/components/ui/Input";
// import Textarea from "@/components/ui/Textarea";
// import Button from "@/components/ui/Button";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";

// /** ✅ Draft sync */
// const STORAGE_KEY = "mukul_contact_draft";
// function broadcastDraft(next) {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
//   } catch {}
//   window.dispatchEvent(new CustomEvent("mukul:contactDraft", { detail: next }));
// }

// function Chip({ active, onClick, children }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={[
//         "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm transition",
//         "border border-border/15 backdrop-blur select-none",
//         active ? "text-foreground" : "text-foreground/75 hover:text-foreground",
//       ].join(" ")}
//     >
//       <span
//         className={[
//           "absolute inset-0 rounded-full",
//           active ? "bg-foreground/[0.09]" : "bg-foreground/[0.03]",
//         ].join(" ")}
//       />
//       {active ? (
//         <span className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[7px]" />
//       ) : null}
//       <span
//         className={[
//           "relative h-1.5 w-1.5 rounded-full",
//           active ? "bg-foreground/80" : "bg-foreground/40",
//         ].join(" ")}
//       />
//       <span className="relative">{children}</span>
//     </button>
//   );
// }

// /** ✅ Premium Toast */
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
//               "relative overflow-hidden rounded-2xl border border-border/15",
//               "bg-background/80 px-4 py-3 backdrop-blur",
//               "shadow-[0_20px_60px_rgba(0,0,0,0.40)]",
//               toast.type === "success" ? "text-green-200" : "text-red-200",
//             ].join(" ")}
//           >
//             <div className="flex items-start gap-3">
//               <span className="mt-[2px] grid h-7 w-7 place-items-center rounded-xl border border-border/15 bg-foreground/[0.04] text-sm">
//                 {toast.type === "success" ? "✓" : "!"}
//               </span>

//               <div className="min-w-0">
//                 <p className="text-sm font-semibold text-foreground/90">
//                   {toast.text}
//                 </p>
//                 {toast.sub ? (
//                   <p className="mt-0.5 text-xs text-muted/70">{toast.sub}</p>
//                 ) : null}
//               </div>
//             </div>

//             <motion.div
//               aria-hidden
//               className="absolute bottom-0 left-0 h-[2px] w-full bg-foreground/30"
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

// function ConfettiBurst({ fire }) {
//   const [reduceMotion, setReduceMotion] = useState(false);

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
//     const update = () => setReduceMotion(!!mq.matches);
//     update();
//     mq.addEventListener?.("change", update);
//     return () => mq.removeEventListener?.("change", update);
//   }, []);

//   if (!fire || reduceMotion) return null;

//   const pieces = Array.from({ length: 18 }).map((_, i) => {
//     const x = (Math.random() - 0.5) * 260;
//     const y = -120 - Math.random() * 160;
//     const r = (Math.random() - 0.5) * 520;
//     const d = Math.random() * 0.12;
//     const s = 0.9 + Math.random() * 0.6;
//     return { id: i, x, y, r, d, s };
//   });

//   return (
//     <div className="pointer-events-none fixed bottom-14 left-1/2 z-[998] -translate-x-1/2">
//       {pieces.map((p) => (
//         <motion.span
//           key={p.id}
//           className="absolute h-2 w-1.5 rounded-full bg-foreground/80"
//           initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 1 }}
//           animate={{
//             opacity: [0, 1, 1, 0],
//             x: p.x,
//             y: p.y,
//             rotate: p.r,
//             scale: p.s,
//           }}
//           transition={{
//             duration: 0.9,
//             delay: p.d,
//             ease: [0.16, 1, 0.3, 1],
//           }}
//           style={{
//             filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.35))",
//           }}
//         />
//       ))}
//     </div>
//   );
// }

// function StickyWhatsApp({ href, onClick, isMobile, tick }) {
//   if (!isMobile) return null;

//   return (
//     <div className="fixed inset-x-0 bottom-0 z-[90] pb-[max(env(safe-area-inset-bottom),0px)] md:hidden">
//       <div className="mx-auto max-w-6xl px-3 pb-3">
//         <a
//           href={href}
//           target="_blank"
//           rel="noopener noreferrer"
//           onClick={onClick}
//           className="relative flex items-center justify-between gap-3 rounded-2xl border border-border/15 bg-background/80 px-4 py-3 text-sm text-foreground/90 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.38)] overflow-hidden"
//         >
//           <motion.span
//             aria-hidden
//             className="pointer-events-none absolute -inset-[10px] rounded-2xl bg-gradient-to-r from-foreground/20 via-transparent to-foreground/20 blur-2xl"
//             animate={{ opacity: [0.12, 0.22, 0.12], scale: [1, 1.06, 1] }}
//             transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
//           />

//           <span className="relative flex items-center gap-2">
//             <span className="grid h-9 w-9 place-items-center rounded-xl border border-border/15 bg-foreground/[0.04]">
//               💬
//             </span>
//             <span className="leading-tight">
//               <span className="block font-semibold">Quick WhatsApp</span>
//               <span className="block text-xs text-muted/70">
//                 Fast reply • 24h
//               </span>
//             </span>
//           </span>

//           <span className="relative rounded-xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-xs">
//             Open →
//           </span>

//           <AnimatePresence>
//             {tick ? (
//               <motion.span
//                 initial={{ opacity: 0, y: 8, scale: 0.98 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: -8 }}
//                 transition={{ duration: 0.18, ease: "easeOut" }}
//                 className="pointer-events-none absolute inset-0 grid place-items-center bg-background/55 backdrop-blur"
//               >
//                 <span className="inline-flex items-center gap-2 rounded-full border border-border/15 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/85">
//                   Opened <span aria-hidden>✓</span>
//                 </span>
//               </motion.span>
//             ) : null}
//           </AnimatePresence>
//         </a>
//       </div>
//     </div>
//   );
// }

// /** ✅ Modal (createPortal) */
// function ConfirmModal({
//   open,
//   type,
//   topicLabel,
//   onClose,
//   whatsappUrl,
//   mailUrl,
//   snapshot,
// }) {
//   const mounted = useRef(false);
//   const [ready, setReady] = useState(false);

//   // ✅ FIX: hooks must be before any return
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     mounted.current = true;
//     setReady(true);
//     return () => {
//       mounted.current = false;
//       setReady(false);
//     };
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

//   // ✅ FIX: function also stays before any return
//   const copySnapshot = async () => {
//     try {
//       const text = [
//         "Your message snapshot",
//         `Topic: ${topicLabel || "-"}`,
//         `Name: ${snapshot?.name?.trim() || "-"}`,
//         `Email: ${snapshot?.email?.trim() || "-"}`,
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

//   const isSuccess = type === "success";

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
//                 Topic: <span className="text-white/75">{topicLabel}</span>
//               </p>
//               {/* ✅ Your message snapshot */}
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
//                       <span className="text-white/80">Topic:</span> {topicLabel}
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
//                 Sometimes server delay happens. Your draft is safe — use
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
//             Tip: Tap outside or press Esc to close
//           </p>
//         </div>
//       </motion.div>
//     </div>,
//     document.body
//   );
// }

// /**
//  * ✅ UPDATED:
//  * - Success / Failed modal via createPortal
//  * - Success pe: draft clear + status text remove
//  * - Fail pe: fallback WhatsApp/Email
//  * - Project type: Admin Panel + E-commerce add
//  * - Other select => smooth input + suggestion chips (tap => autofill)
//  * - Bug fix: no reset() usage => no "Cannot read properties of null"
//  */
// export default function ContactSection({ id = "contact", compact = false }) {
//   const [loading, setLoading] = useState(false);

//   const [topic, setTopic] = useState("webapp");
//   const [otherText, setOtherText] = useState("");

//   /** ✅ Draft (controlled) */
//   const [draft, setDraft] = useState({ name: "", email: "", message: "" });

//   const [toast, setToast] = useState(null);
//   const [confetti, setConfetti] = useState(false);

//   const [isMobile, setIsMobile] = useState(false);
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const mq = window.matchMedia("(max-width: 640px)");
//     const update = () => setIsMobile(!!mq.matches);
//     update();
//     mq.addEventListener?.("change", update);
//     return () => mq.removeEventListener?.("change", update);
//   }, []);

//   // ✅ hash -> auto scroll
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const scrollIfMatch = () => {
//       const hash = (window.location.hash || "").replace("#", "");
//       if (!hash) return;
//       if (hash !== id) return;

//       const el = document.getElementById(id);
//       if (!el) return;

//       setTimeout(() => {
//         el.scrollIntoView({ behavior: "smooth", block: "start" });
//       }, 60);
//     };

//     scrollIfMatch();
//     window.addEventListener("hashchange", scrollIfMatch);
//     return () => window.removeEventListener("hashchange", scrollIfMatch);
//   }, [id]);

//   // ✅ load from localStorage once + listen broadcasts
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         setDraft({
//           name: parsed?.name || "",
//           email: parsed?.email || "",
//           message: parsed?.message || "",
//         });
//         if (parsed?.topic) setTopic(parsed.topic);
//         if (parsed?.otherText) setOtherText(parsed.otherText);
//       }
//     } catch {}

//     const onDraft = (e) => {
//       const d = e?.detail || {};
//       setDraft({
//         name: d?.name || "",
//         email: d?.email || "",
//         message: d?.message || "",
//       });
//       if (d?.topic) setTopic(d.topic);
//       if (typeof d?.otherText === "string") setOtherText(d.otherText);
//     };
//     window.addEventListener("mukul:contactDraft", onDraft);
//     return () => window.removeEventListener("mukul:contactDraft", onDraft);
//   }, []);

//   const setDraftField = (key, value) => {
//     setDraft((prev) => {
//       const next = { ...prev, [key]: value };
//       if (typeof window !== "undefined")
//         broadcastDraft({ ...next, topic, otherText });
//       return next;
//     });
//   };

//   const setTopicSafe = (nextTopic) => {
//     setTopic(nextTopic);
//     if (typeof window !== "undefined")
//       broadcastDraft({ ...draft, topic: nextTopic, otherText });
//   };

//   const setOtherSafe = (val) => {
//     setOtherText(val);
//     if (typeof window !== "undefined")
//       broadcastDraft({ ...draft, topic, otherText: val });
//   };

//   // ✅ submit button states
//   const [sent, setSent] = useState(false);
//   const [ripple, setRipple] = useState(null);
//   const btnRef = useRef(null);

//   // ✅ WhatsApp tick + haptic
//   const [waTick, setWaTick] = useState(false);

//   // ✅ Modal state
//   const [modal, setModal] = useState({
//     open: false,
//     type: "success",
//     snapshot: null,
//   });

//   const EMAIL = "mukuljaiswal282@gmail.com";
//   const WHATSAPP = "+919919371299";
//   const whatsappDigits = WHATSAPP.replace(/\D/g, "");

//   const topics = useMemo(
//     () => [
//       { id: "portfolio", label: "Portfolio", emoji: "✨" },
//       { id: "webapp", label: "Web App", emoji: "⚡" },
//       { id: "landing", label: "Landing Page", emoji: "🚀" },
//       { id: "admin", label: "Admin Panel", emoji: "🧩" },
//       { id: "ecommerce", label: "E-commerce Website", emoji: "🛒" },
//       { id: "uifix", label: "UI Fix / Redesign", emoji: "🎨" },
//       { id: "other", label: "Other", emoji: "💬" },
//     ],
//     []
//   );

//   const otherSuggestions = useMemo(
//     () => [
//       "Gym / Fitness",
//       "Restaurant",
//       "Clinic",
//       "Travel / Tour",
//       "School / Institute",
//       "Real Estate",
//       "Salon / Spa",
//       "Coaching",
//       "Construction",
//     ],
//     []
//   );

//   const activeTopic = topics.find((t) => t.id === topic) || topics[1];

//   const topicLabel = useMemo(() => {
//     if (topic !== "other") return `${activeTopic.emoji} ${activeTopic.label}`;
//     return otherText?.trim() ? `💬 Other — ${otherText.trim()}` : `💬 Other`;
//   }, [topic, activeTopic, otherText]);

//   const buildMessage = () => {
//     const lines = [];
//     lines.push(`Hi Mukul 👋`);
//     lines.push(`I saw your portfolio and want to discuss a project.`);
//     lines.push("");
//     lines.push(`Topic: ${topicLabel}`);
//     if (draft.name?.trim()) lines.push(`Name: ${draft.name.trim()}`);
//     if (draft.email?.trim()) lines.push(`Email: ${draft.email.trim()}`);
//     if (draft.message?.trim()) {
//       lines.push("");
//       lines.push("Message:");
//       lines.push(draft.message.trim());
//     }
//     lines.push("");
//     lines.push("Thanks!");
//     return lines.join("\n");
//   };

//   const whatsappUrl = useMemo(() => {
//     return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
//       buildMessage()
//     )}`;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [whatsappDigits, topic, draft, otherText]);

//   const mailUrl = useMemo(() => {
//     const subject = `Project Inquiry — ${topicLabel}`;
//     const body = buildMessage();
//     return `mailto:${EMAIL}?subject=${encodeURIComponent(
//       subject
//     )}&body=${encodeURIComponent(body)}`;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [EMAIL, topic, draft, otherText]);

//   /** ✅ Premium toast helper */
//   const showToast = (type, text, sub, ms = 1400) => {
//     setToast({ type, text, sub, ms });
//     setTimeout(() => setToast(null), ms);
//   };

//   const fireConfetti = () => {
//     setConfetti(false);
//     requestAnimationFrame(() => setConfetti(true));
//     setTimeout(() => setConfetti(false), 1100);
//   };

//   /** ✅ Copy with label */
//   const copy = async (text, label = "Text") => {
//     try {
//       await navigator.clipboard.writeText(text);
//       showToast(
//         "success",
//         `${label} copied`,
//         "You can paste it anywhere ✨",
//         1400
//       );
//     } catch {
//       showToast("error", "Copy failed", "Please try again.", 1600);
//     }
//   };

//   const triggerRipple = (evt) => {
//     const el = btnRef.current;
//     if (!el) return;

//     const rect = el.getBoundingClientRect();
//     const x = evt?.clientX ? evt.clientX - rect.left : rect.width / 2;
//     const y = evt?.clientY ? evt.clientY - rect.top : rect.height / 2;
//     setRipple({ x, y, id: Date.now() });
//     setTimeout(() => setRipple(null), 520);
//   };

//   const onWhatsAppClick = () => {
//     if (navigator?.vibrate) navigator.vibrate(12);
//     setWaTick(true);
//     setTimeout(() => setWaTick(false), 900);
//     showToast(
//       "success",
//       "Opening WhatsApp…",
//       "Sending your pre-filled message",
//       1200
//     );
//   };

//   const onEmailClick = () => {
//     if (navigator?.vibrate) navigator.vibrate(8);
//     showToast("success", "Opening Email…", "Draft is ready ✉️", 1200);
//   };

//   const clearAllAfterSuccess = () => {
//     setDraft({ name: "", email: "", message: "" });
//     setOtherText("");
//     setTopic("webapp");

//     try {
//       localStorage.removeItem(STORAGE_KEY);
//     } catch {}
//     try {
//       broadcastDraft({
//         name: "",
//         email: "",
//         message: "",
//         topic: "webapp",
//         otherText: "",
//       });
//     } catch {}
//   };

//   async function onSubmit(evn) {
//     evn.preventDefault();
//     setLoading(true);
//     setSent(false);

//     const payload = {
//       name: draft.name,
//       email: draft.email,
//       message: `Topic: ${topicLabel}\n\n${draft.message}`,
//     };

//     try {
//       const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data?.error || "Something went wrong");

//       // ✅ SUCCESS
//       showToast("success", "Sent!", "I’ll reply soon ✨", 1400);
//       fireConfetti();

//       setSent(true);
//       setTimeout(() => setSent(false), 1600);

//       // ✅ open SUCCESS modal
//       setModal({
//         open: true,
//         type: "success",
//         snapshot: {
//           name: draft.name,
//           email: draft.email,
//           message: draft.message,
//         },
//       });

//       // ✅ clear all inputs + remove any status text
//       clearAllAfterSuccess();
//     } catch (err) {
//       // ✅ FAIL
//       const msg = err?.message || "Something went wrong";
//       showToast("error", "Failed", msg, 1600);

//       // ✅ open FAIL modal
//       setModal({ open: true, type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <>
//       <Toast toast={toast} />
//       <ConfettiBurst fire={confetti} />

//       {/* ✅ Success/Fail Modal (createPortal) */}
//       <AnimatePresence>
//         {modal.open ? (
//           <ConfirmModal
//             open={modal.open}
//             type={modal.type === "success" ? "success" : "error"}
//             topicLabel={topicLabel}
//             whatsappUrl={whatsappUrl}
//             mailUrl={mailUrl}
//             snapshot={modal.snapshot}
//             onClose={() => setModal({ open: false, type: modal.type })}
//           />
//         ) : null}
//       </AnimatePresence>

//       {/* ✅ Sticky WhatsApp CTA only on mobile */}
//       <StickyWhatsApp
//         href={whatsappUrl}
//         isMobile={isMobile}
//         onClick={onWhatsAppClick}
//         tick={waTick}
//       />

//       <section
//         id={id}
//         className={`${compact ? "py-10" : "py-16"} scroll-mt-24`}
//       >
//         <Container>
//           <Parallax from={12} to={-12}>
//             <Reveal>
//               <SectionHeading
//                 title="Let’s build something together"
//                 desc="Send a message and I’ll get back to you."
//               />
//             </Reveal>
//           </Parallax>

//           <div className="grid gap-6 md:grid-cols-2">
//             {/* LEFT */}
//             <Reveal delay={0.12}>
//               <Card className="h-full">
//                 <div className="flex items-start justify-between gap-3">
//                   <p className="text-white/80">
//                     Prefer WhatsApp or Email? Quick contact below:
//                   </p>

//                   <span className="shrink-0 rounded-full border border-border/15 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/80">
//                     Reply &lt; 24h
//                   </span>
//                 </div>

//                 <div className="mt-4">
//                   <p className="text-xs text-muted/60">Project type</p>
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     {topics.map((t) => (
//                       <Chip
//                         key={t.id}
//                         active={topic === t.id}
//                         onClick={() => setTopicSafe(t.id)}
//                       >
//                         {t.emoji} {t.label}
//                       </Chip>
//                     ))}
//                   </div>

//                   {/* ✅ Other input (smooth open) */}
//                   <AnimatePresence>
//                     {topic === "other" ? (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0, y: -6 }}
//                         animate={{ opacity: 1, height: "auto", y: 0 }}
//                         exit={{ opacity: 0, height: 0, y: -6 }}
//                         transition={{ duration: 0.22, ease: "easeOut" }}
//                         className="mt-3 overflow-hidden"
//                       >
//                         <div className="rounded-2xl border border-border/12 bg-foreground/[0.03] p-3">
//                           <p className="text-xs text-muted/60">
//                             Write your project type (e.g. Gym / Fitness)
//                           </p>
//                           <div className="mt-2">
//                             <Input
//                               value={otherText}
//                               onChange={(e) => setOtherSafe(e.target.value)}
//                               placeholder="Type project category…"
//                             />
//                           </div>

//                           <div className="mt-3 flex flex-wrap gap-2">
//                             {otherSuggestions.map((s) => (
//                               <button
//                                 key={s}
//                                 type="button"
//                                 onClick={() => setOtherSafe(s)}
//                                 className="rounded-full border border-border/12 bg-foreground/[0.03] px-3 py-1 text-xs text-foreground/80 hover:bg-foreground/[0.06]"
//                               >
//                                 {s}
//                               </button>
//                             ))}
//                           </div>

//                           <p className="mt-2 text-[11px] text-muted/60">
//                             Tip: tap a suggestion or type custom.
//                           </p>
//                         </div>
//                       </motion.div>
//                     ) : null}
//                   </AnimatePresence>
//                 </div>

//                 <div className="mt-5 space-y-3 text-sm text-white/75">
//                   {/* Email row */}
//                   <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/12 bg-foreground/[0.03] px-4 py-3">
//                     <div className="min-w-0">
//                       <p className="text-xs text-muted/60">Email</p>
//                       <a
//                         href={mailUrl}
//                         onClick={onEmailClick}
//                         className="block truncate text-white/85 underline decoration-white/15 underline-offset-4 transition hover:text-white hover:decoration-white/45"
//                       >
//                         {EMAIL}
//                       </a>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => copy(EMAIL, "Email")}
//                       className="cursor-pointer rounded-xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-xs text-foreground/85 hover:bg-foreground/[0.06]"
//                     >
//                       Copy
//                     </button>
//                   </div>

//                   {/* WhatsApp row */}
//                   <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/12 bg-foreground/[0.03] px-4 py-3">
//                     <div className="min-w-0">
//                       <p className="text-xs text-muted/60">WhatsApp</p>
//                       <a
//                         href={whatsappUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         onClick={onWhatsAppClick}
//                         className="block truncate text-white/85 underline decoration-white/15 underline-offset-4 transition hover:text-white hover:decoration-white/45"
//                       >
//                         {WHATSAPP}
//                       </a>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => copy(WHATSAPP, "WhatsApp")}
//                       className="cursor-pointer rounded-xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-xs text-foreground/85 hover:bg-foreground/[0.06]"
//                     >
//                       Copy
//                     </button>
//                   </div>

//                   {/* CTA buttons */}
//                   <div className="mt-4 flex flex-wrap gap-3">
//                     <a
//                       href={whatsappUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       onClick={onWhatsAppClick}
//                       className="relative inline-flex items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] px-5 py-3 text-sm text-foreground/90 backdrop-blur transition hover:bg-foreground/[0.06] overflow-hidden"
//                     >
//                       <motion.span
//                         aria-hidden
//                         className="pointer-events-none absolute -inset-[10px] rounded-2xl bg-gradient-to-r from-foreground/25 via-transparent to-foreground/25 blur-2xl"
//                         animate={{
//                           opacity: isMobile
//                             ? [0.12, 0.22, 0.12]
//                             : [0.18, 0.38, 0.18],
//                           scale: [1, 1.08, 1],
//                         }}
//                         transition={{
//                           duration: 2.2,
//                           repeat: Infinity,
//                           ease: "easeInOut",
//                         }}
//                       />
//                       <span className="relative">WhatsApp now →</span>
//                     </a>

//                     <a
//                       href={mailUrl}
//                       onClick={onEmailClick}
//                       className="relative inline-flex items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] px-5 py-3 text-sm text-foreground/90 backdrop-blur transition hover:bg-foreground/[0.06]"
//                     >
//                       Email now →
//                     </a>
//                   </div>
//                 </div>
//               </Card>
//             </Reveal>

//             {/* RIGHT */}
//             <Reveal delay={0.18}>
//               <Card className="h-full">
//                 <form onSubmit={onSubmit} className="space-y-4">
//                   <Reveal delay={0.02}>
//                     <Input
//                       name="name"
//                       placeholder="Your name"
//                       required
//                       value={draft.name}
//                       onChange={(ev) => setDraftField("name", ev.target.value)}
//                     />
//                   </Reveal>

//                   <Reveal delay={0.05}>
//                     <Input
//                       name="email"
//                       type="email"
//                       placeholder="Your email"
//                       required
//                       value={draft.email}
//                       onChange={(ev) => setDraftField("email", ev.target.value)}
//                     />
//                   </Reveal>

//                   <Reveal delay={0.08}>
//                     <Textarea
//                       name="message"
//                       placeholder="Your message"
//                       required
//                       value={draft.message}
//                       onChange={(ev) =>
//                         setDraftField("message", ev.target.value)
//                       }
//                     />
//                   </Reveal>

//                   {/* ✅ Button ripple + Sent tick */}
//                   <Reveal delay={0.12}>
//                     <div className="relative">
//                       <motion.div
//                         ref={btnRef}
//                         onPointerDown={triggerRipple}
//                         className="relative"
//                       >
//                         <Button
//                           type="submit"
//                           disabled={loading}
//                           className="w-full relative overflow-hidden cursor-pointer"
//                         >
//                           <span className="relative z-10">
//                             {loading
//                               ? "Sending..."
//                               : sent
//                               ? "Sent ✓"
//                               : "Send Message"}
//                           </span>

//                           <AnimatePresence>
//                             {ripple ? (
//                               <motion.span
//                                 key={ripple.id}
//                                 className="pointer-events-none absolute rounded-full bg-foreground/20"
//                                 initial={{
//                                   opacity: 0.6,
//                                   width: 0,
//                                   height: 0,
//                                   left: ripple.x,
//                                   top: ripple.y,
//                                   translateX: "-50%",
//                                   translateY: "-50%",
//                                 }}
//                                 animate={{
//                                   opacity: 0,
//                                   width: 520,
//                                   height: 520,
//                                 }}
//                                 exit={{ opacity: 0 }}
//                                 transition={{ duration: 0.5, ease: "easeOut" }}
//                               />
//                             ) : null}
//                           </AnimatePresence>
//                         </Button>
//                       </motion.div>
//                     </div>
//                   </Reveal>

//                   {/* ✅ IMPORTANT: no status text on success (only toast + modal) */}
//                 </form>
//               </Card>
//             </Reveal>
//           </div>

//           <div className="h-20 md:hidden" />
//         </Container>
//       </section>
//     </>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";

/** ✅ Draft sync */
const STORAGE_KEY = "mukul_contact_draft";
function broadcastDraft(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  window.dispatchEvent(new CustomEvent("mukul:contactDraft", { detail: next }));
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm transition",
        "border border-border/15 backdrop-blur select-none",
        active ? "text-foreground" : "text-foreground/75 hover:text-foreground",
      ].join(" ")}
    >
      <span
        className={[
          "absolute inset-0 rounded-full",
          active ? "bg-foreground/[0.09]" : "bg-foreground/[0.03]",
        ].join(" ")}
      />
      {active ? (
        <span className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[7px]" />
      ) : null}
      <span
        className={[
          "relative h-1.5 w-1.5 rounded-full",
          active ? "bg-foreground/80" : "bg-foreground/40",
        ].join(" ")}
      />
      <span className="relative">{children}</span>
    </button>
  );
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
              "relative overflow-hidden rounded-2xl border border-border/15",
              "bg-background/80 px-4 py-3 backdrop-blur",
              "shadow-[0_20px_60px_rgba(0,0,0,0.40)]",
              toast.type === "success" ? "text-green-200" : "text-red-200",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <span className="mt-[2px] grid h-7 w-7 place-items-center rounded-xl border border-border/15 bg-foreground/[0.04] text-sm">
                {toast.type === "success" ? "✓" : "!"}
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground/90">
                  {toast.text}
                </p>
                {toast.sub ? (
                  <p className="mt-0.5 text-xs text-muted/70">{toast.sub}</p>
                ) : null}
              </div>
            </div>

            <motion.div
              aria-hidden
              className="absolute bottom-0 left-0 h-[2px] w-full bg-foreground/30"
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

function ConfettiBurst({ fire }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  if (!fire || reduceMotion) return null;

  const pieces = Array.from({ length: 18 }).map((_, i) => {
    const x = (Math.random() - 0.5) * 260;
    const y = -120 - Math.random() * 160;
    const r = (Math.random() - 0.5) * 520;
    const d = Math.random() * 0.12;
    const s = 0.9 + Math.random() * 0.6;
    return { id: i, x, y, r, d, s };
  });

  return (
    <div className="pointer-events-none fixed bottom-14 left-1/2 z-[998] -translate-x-1/2">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute h-2 w-1.5 rounded-full bg-foreground/80"
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: p.x,
            y: p.y,
            rotate: p.r,
            scale: p.s,
          }}
          transition={{
            duration: 0.9,
            delay: p.d,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.35))",
          }}
        />
      ))}
    </div>
  );
}

function StickyWhatsApp({ href, onClick, isMobile, tick }) {
  if (!isMobile) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] pb-[max(env(safe-area-inset-bottom),0px)] md:hidden">
      <div className="mx-auto max-w-6xl px-3 pb-3">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className="relative flex items-center justify-between gap-3 rounded-2xl border border-border/15 bg-background/80 px-4 py-3 text-sm text-foreground/90 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.38)] overflow-hidden"
        >
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-[10px] rounded-2xl bg-gradient-to-r from-foreground/20 via-transparent to-foreground/20 blur-2xl"
            animate={{ opacity: [0.12, 0.22, 0.12], scale: [1, 1.06, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />

          <span className="relative flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-border/15 bg-foreground/[0.04]">
              💬
            </span>
            <span className="leading-tight">
              <span className="block font-semibold">Quick WhatsApp</span>
              <span className="block text-xs text-muted/70">
                Fast reply • 24h
              </span>
            </span>
          </span>

          <span className="relative rounded-xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-xs">
            Open →
          </span>

          <AnimatePresence>
            {tick ? (
              <motion.span
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0 grid place-items-center bg-background/55 backdrop-blur"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-border/15 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/85">
                  Opened <span aria-hidden>✓</span>
                </span>
              </motion.span>
            ) : null}
          </AnimatePresence>
        </a>
      </div>
    </div>
  );
}

/** ✅ Modal (createPortal) */
function ConfirmModal({
  open,
  type,
  topicLabel,
  onClose,
  whatsappUrl,
  mailUrl,
  snapshot,
}) {
  const mounted = useRef(false);
  const [ready, setReady] = useState(false);

  // ✅ FIX: hooks must be before any return
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    mounted.current = true;
    setReady(true);
    return () => {
      mounted.current = false;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  // ✅ FIX: function also stays before any return
  const copySnapshot = async () => {
    try {
      const text = [
        "Your message snapshot",
        `Topic: ${topicLabel || "-"}`,
        `Name: ${snapshot?.name?.trim() || "-"}`,
        `Email: ${snapshot?.email?.trim() || "-"}`,
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

  const isSuccess = type === "success";

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] grid place-items-center p-3 sm:p-6"
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/55 backdrop-blur-[6px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(12px)" }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={[
          "relative w-[min(920px,92vw)] rounded-[26px] border border-white/12",
          "bg-[#0B0E14]/92 text-white shadow-[0_35px_120px_rgba(0,0,0,0.65)]",
          "overflow-hidden",
          // ✅ MOBILE: height small + internal scroll
          "max-h-[78svh] sm:max-h-none",
        ].join(" ")}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* top gold line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)] opacity-80" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 grid h-10 w-10 place-items-center rounded-2xl border border-white/14 bg-white/[0.04] hover:bg-white/[0.07] z-10"
        >
          ✕
        </button>

        {/* ✅ Scroll wrapper (mobile) */}
        <div className="max-h-[78svh] overflow-y-auto overscroll-contain p-4 sm:max-h-none sm:overflow-visible sm:p-7">
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
                Topic: <span className="text-white/75">{topicLabel}</span>
              </p>

              {/* ✅ Your message snapshot */}
              {snapshot ? (
                <div className="mt-4 rounded-2xl border border-white/12 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white/85">
                      Your message snapshot
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50">Auto-saved</span>

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
                      <span className="text-white/80">Topic:</span> {topicLabel}
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

          {/* Highlights */}
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

          {/* fallback strip (only on fail) */}
          {!isSuccess ? (
            <div className="mt-4 rounded-2xl border border-white/12 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold">Quick fallback</p>
              <p className="mt-1 text-xs text-white/65">
                Sometimes server delay happens. Your draft is safe — use
                WhatsApp/Email for instant contact.
              </p>
            </div>
          ) : null}

          {/* actions */}
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
            Tip: Tap outside or press Esc to close
          </p>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

/**
 * ✅ UPDATED:
 * - Success / Failed modal via createPortal
 * - Success pe: draft clear + status text remove
 * - Fail pe: fallback WhatsApp/Email
 * - Project type: Admin Panel + E-commerce add
 * - Other select => smooth input + suggestion chips (tap => autofill)
 * - Bug fix: no reset() usage => no "Cannot read properties of null"
 */
export default function ContactSection({ id = "contact", compact = false }) {
  const [loading, setLoading] = useState(false);

  const [topic, setTopic] = useState("webapp");
  const [otherText, setOtherText] = useState("");

  /** ✅ Draft (controlled) */
  const [draft, setDraft] = useState({ name: "", email: "", message: "" });

  const [toast, setToast] = useState(null);
  const [confetti, setConfetti] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // ✅ hash -> auto scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollIfMatch = () => {
      const hash = (window.location.hash || "").replace("#", "");
      if (!hash) return;
      if (hash !== id) return;

      const el = document.getElementById(id);
      if (!el) return;

      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    };

    scrollIfMatch();
    window.addEventListener("hashchange", scrollIfMatch);
    return () => window.removeEventListener("hashchange", scrollIfMatch);
  }, [id]);

  // ✅ load from localStorage once + listen broadcasts
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setDraft({
          name: parsed?.name || "",
          email: parsed?.email || "",
          message: parsed?.message || "",
        });
        if (parsed?.topic) setTopic(parsed.topic);
        if (parsed?.otherText) setOtherText(parsed.otherText);
      }
    } catch {}

    const onDraft = (e) => {
      const d = e?.detail || {};
      setDraft({
        name: d?.name || "",
        email: d?.email || "",
        message: d?.message || "",
      });
      if (d?.topic) setTopic(d.topic);
      if (typeof d?.otherText === "string") setOtherText(d.otherText);
    };
    window.addEventListener("mukul:contactDraft", onDraft);
    return () => window.removeEventListener("mukul:contactDraft", onDraft);
  }, []);

  const setDraftField = (key, value) => {
    setDraft((prev) => {
      const next = { ...prev, [key]: value };
      if (typeof window !== "undefined")
        broadcastDraft({ ...next, topic, otherText });
      return next;
    });
  };

  const setTopicSafe = (nextTopic) => {
    setTopic(nextTopic);
    if (typeof window !== "undefined")
      broadcastDraft({ ...draft, topic: nextTopic, otherText });
  };

  const setOtherSafe = (val) => {
    setOtherText(val);
    if (typeof window !== "undefined")
      broadcastDraft({ ...draft, topic, otherText: val });
  };

  // ✅ submit button states
  const [sent, setSent] = useState(false);
  const [ripple, setRipple] = useState(null);
  const btnRef = useRef(null);

  // ✅ WhatsApp tick + haptic
  const [waTick, setWaTick] = useState(false);

  // ✅ Modal state
  const [modal, setModal] = useState({
    open: false,
    type: "success",
    snapshot: null,
  });

  const EMAIL = "mukuljaiswal282@gmail.com";
  const WHATSAPP = "+919919371299";
  const whatsappDigits = WHATSAPP.replace(/\D/g, "");

  const topics = useMemo(
    () => [
      { id: "portfolio", label: "Portfolio", emoji: "✨" },
      { id: "webapp", label: "Web App", emoji: "⚡" },
      { id: "landing", label: "Landing Page", emoji: "🚀" },
      { id: "admin", label: "Admin Panel", emoji: "🧩" },
      { id: "ecommerce", label: "E-commerce Website", emoji: "🛒" },
      { id: "uifix", label: "UI Fix / Redesign", emoji: "🎨" },
      { id: "other", label: "Other", emoji: "💬" },
    ],
    []
  );

  const otherSuggestions = useMemo(
    () => [
      "Gym / Fitness",
      "Restaurant",
      "Clinic",
      "Travel / Tour",
      "School / Institute",
      "Real Estate",
      "Salon / Spa",
      "Coaching",
      "Construction",
    ],
    []
  );

  const activeTopic = topics.find((t) => t.id === topic) || topics[1];

  const topicLabel = useMemo(() => {
    if (topic !== "other") return `${activeTopic.emoji} ${activeTopic.label}`;
    return otherText?.trim() ? `💬 Other — ${otherText.trim()}` : `💬 Other`;
  }, [topic, activeTopic, otherText]);

  const buildMessage = () => {
    const lines = [];
    lines.push(`Hi Mukul 👋`);
    lines.push(`I saw your portfolio and want to discuss a project.`);
    lines.push("");
    lines.push(`Topic: ${topicLabel}`);
    if (draft.name?.trim()) lines.push(`Name: ${draft.name.trim()}`);
    if (draft.email?.trim()) lines.push(`Email: ${draft.email.trim()}`);
    if (draft.message?.trim()) {
      lines.push("");
      lines.push("Message:");
      lines.push(draft.message.trim());
    }
    lines.push("");
    lines.push("Thanks!");
    return lines.join("\n");
  };

  const whatsappUrl = useMemo(() => {
    return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
      buildMessage()
    )}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatsappDigits, topic, draft, otherText]);

  const mailUrl = useMemo(() => {
    const subject = `Project Inquiry — ${topicLabel}`;
    const body = buildMessage();
    return `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EMAIL, topic, draft, otherText]);

  /** ✅ Premium toast helper */
  const showToast = (type, text, sub, ms = 1400) => {
    setToast({ type, text, sub, ms });
    setTimeout(() => setToast(null), ms);
  };

  const fireConfetti = () => {
    setConfetti(false);
    requestAnimationFrame(() => setConfetti(true));
    setTimeout(() => setConfetti(false), 1100);
  };

  /** ✅ Copy with label */
  const copy = async (text, label = "Text") => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(
        "success",
        `${label} copied`,
        "You can paste it anywhere ✨",
        1400
      );
    } catch {
      showToast("error", "Copy failed", "Please try again.", 1600);
    }
  };

  const triggerRipple = (evt) => {
    const el = btnRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = evt?.clientX ? evt.clientX - rect.left : rect.width / 2;
    const y = evt?.clientY ? evt.clientY - rect.top : rect.height / 2;
    setRipple({ x, y, id: Date.now() });
    setTimeout(() => setRipple(null), 520);
  };

  const onWhatsAppClick = () => {
    if (navigator?.vibrate) navigator.vibrate(12);
    setWaTick(true);
    setTimeout(() => setWaTick(false), 900);
    showToast(
      "success",
      "Opening WhatsApp…",
      "Sending your pre-filled message",
      1200
    );
  };

  const onEmailClick = () => {
    if (navigator?.vibrate) navigator.vibrate(8);
    showToast("success", "Opening Email…", "Draft is ready ✉️", 1200);
  };

  const clearAllAfterSuccess = () => {
    setDraft({ name: "", email: "", message: "" });
    setOtherText("");
    setTopic("webapp");

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    try {
      broadcastDraft({
        name: "",
        email: "",
        message: "",
        topic: "webapp",
        otherText: "",
      });
    } catch {}
  };

  async function onSubmit(evn) {
    evn.preventDefault();
    setLoading(true);
    setSent(false);

    const payload = {
      name: draft.name,
      email: draft.email,
      message: `Topic: ${topicLabel}\n\n${draft.message}`,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Something went wrong");

      // ✅ SUCCESS
      showToast("success", "Sent!", "I’ll reply soon ✨", 1400);
      fireConfetti();

      setSent(true);
      setTimeout(() => setSent(false), 1600);

      // ✅ open SUCCESS modal
      setModal({
        open: true,
        type: "success",
        snapshot: {
          name: draft.name,
          email: draft.email,
          message: draft.message,
        },
      });

      // ✅ clear all inputs + remove any status text
      clearAllAfterSuccess();
    } catch (err) {
      // ✅ FAIL
      const msg = err?.message || "Something went wrong";
      showToast("error", "Failed", msg, 1600);

      // ✅ open FAIL modal
      setModal({ open: true, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toast toast={toast} />
      <ConfettiBurst fire={confetti} />

      {/* ✅ Success/Fail Modal (createPortal) */}
      <AnimatePresence>
        {modal.open ? (
          <ConfirmModal
            open={modal.open}
            type={modal.type === "success" ? "success" : "error"}
            topicLabel={topicLabel}
            whatsappUrl={whatsappUrl}
            mailUrl={mailUrl}
            snapshot={modal.snapshot}
            onClose={() => setModal({ open: false, type: modal.type })}
          />
        ) : null}
      </AnimatePresence>

      {/* ✅ Sticky WhatsApp CTA only on mobile */}
      <StickyWhatsApp
        href={whatsappUrl}
        isMobile={isMobile}
        onClick={onWhatsAppClick}
        tick={waTick}
      />

      <section
        id={id}
        className={`${compact ? "py-10" : "py-16"} scroll-mt-24`}
      >
        <Container>
          <Parallax from={12} to={-12}>
            <Reveal>
              <SectionHeading
                title="Let’s build something together"
                desc="Send a message and I’ll get back to you."
              />
            </Reveal>
          </Parallax>

          <div className="grid gap-6 md:grid-cols-2">
            {/* LEFT */}
            <Reveal delay={0.12}>
              <Card className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-white/80">
                    Prefer WhatsApp or Email? Quick contact below:
                  </p>

                  <span className="shrink-0 rounded-full border border-border/15 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/80">
                    Reply &lt; 24h
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-muted/60">Project type</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {topics.map((t) => (
                      <Chip
                        key={t.id}
                        active={topic === t.id}
                        onClick={() => setTopicSafe(t.id)}
                      >
                        {t.emoji} {t.label}
                      </Chip>
                    ))}
                  </div>

                  {/* ✅ Other input (smooth open) */}
                  <AnimatePresence>
                    {topic === "other" ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -6 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="mt-3 overflow-hidden"
                      >
                        <div className="rounded-2xl border border-border/12 bg-foreground/[0.03] p-3">
                          <p className="text-xs text-muted/60">
                            Write your project type (e.g. Gym / Fitness)
                          </p>
                          <div className="mt-2">
                            <Input
                              value={otherText}
                              onChange={(e) => setOtherSafe(e.target.value)}
                              placeholder="Type project category…"
                            />
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {otherSuggestions.map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setOtherSafe(s)}
                                className="rounded-full border border-border/12 bg-foreground/[0.03] px-3 py-1 text-xs text-foreground/80 hover:bg-foreground/[0.06]"
                              >
                                {s}
                              </button>
                            ))}
                          </div>

                          <p className="mt-2 text-[11px] text-muted/60">
                            Tip: tap a suggestion or type custom.
                          </p>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div className="mt-5 space-y-3 text-sm text-white/75">
                  {/* Email row */}
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/12 bg-foreground/[0.03] px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs text-muted/60">Email</p>
                      <a
                        href={mailUrl}
                        onClick={onEmailClick}
                        className="block truncate text-white/85 underline decoration-white/15 underline-offset-4 transition hover:text-white hover:decoration-white/45"
                      >
                        {EMAIL}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(EMAIL, "Email")}
                      className="cursor-pointer rounded-xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-xs text-foreground/85 hover:bg-foreground/[0.06]"
                    >
                      Copy
                    </button>
                  </div>

                  {/* WhatsApp row */}
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/12 bg-foreground/[0.03] px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs text-muted/60">WhatsApp</p>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onWhatsAppClick}
                        className="block truncate text-white/85 underline decoration-white/15 underline-offset-4 transition hover:text-white hover:decoration-white/45"
                      >
                        {WHATSAPP}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(WHATSAPP, "WhatsApp")}
                      className="cursor-pointer rounded-xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-xs text-foreground/85 hover:bg-foreground/[0.06]"
                    >
                      Copy
                    </button>
                  </div>

                  {/* CTA buttons */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onWhatsAppClick}
                      className="relative inline-flex items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] px-5 py-3 text-sm text-foreground/90 backdrop-blur transition hover:bg-foreground/[0.06] overflow-hidden"
                    >
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute -inset-[10px] rounded-2xl bg-gradient-to-r from-foreground/25 via-transparent to-foreground/25 blur-2xl"
                        animate={{
                          opacity: isMobile
                            ? [0.12, 0.22, 0.12]
                            : [0.18, 0.38, 0.18],
                          scale: [1, 1.08, 1],
                        }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <span className="relative">WhatsApp now →</span>
                    </a>

                    <a
                      href={mailUrl}
                      onClick={onEmailClick}
                      className="relative inline-flex items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] px-5 py-3 text-sm text-foreground/90 backdrop-blur transition hover:bg-foreground/[0.06]"
                    >
                      Email now →
                    </a>
                  </div>
                </div>
              </Card>
            </Reveal>

            {/* RIGHT */}
            <Reveal delay={0.18}>
              <Card className="h-full">
                <form onSubmit={onSubmit} className="space-y-4">
                  <Reveal delay={0.02}>
                    <Input
                      name="name"
                      placeholder="Your name"
                      required
                      value={draft.name}
                      onChange={(ev) => setDraftField("name", ev.target.value)}
                      className="text-[16px] sm:text-sm"
                    />
                  </Reveal>

                  <Reveal delay={0.05}>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your email"
                      required
                      value={draft.email}
                      onChange={(ev) => setDraftField("email", ev.target.value)}
                      className="text-[16px] sm:text-sm"
                    />
                  </Reveal>

                  <Reveal delay={0.08}>
                    <Textarea
                      name="message"
                      placeholder="Your message"
                      required
                      value={draft.message}
                      onChange={(ev) =>
                        setDraftField("message", ev.target.value)
                      }
                      className="text-[16px] sm:text-sm"
                    />
                  </Reveal>

                  {/* ✅ Button ripple + Sent tick */}
                  <Reveal delay={0.12}>
                    <div className="relative">
                      <motion.div
                        ref={btnRef}
                        onPointerDown={triggerRipple}
                        className="relative"
                      >
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full relative overflow-hidden cursor-pointer"
                        >
                          <span className="relative z-10">
                            {loading
                              ? "Sending..."
                              : sent
                              ? "Sent ✓"
                              : "Send Message"}
                          </span>

                          <AnimatePresence>
                            {ripple ? (
                              <motion.span
                                key={ripple.id}
                                className="pointer-events-none absolute rounded-full bg-foreground/20"
                                initial={{
                                  opacity: 0.6,
                                  width: 0,
                                  height: 0,
                                  left: ripple.x,
                                  top: ripple.y,
                                  translateX: "-50%",
                                  translateY: "-50%",
                                }}
                                animate={{
                                  opacity: 0,
                                  width: 520,
                                  height: 520,
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                              />
                            ) : null}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </div>
                  </Reveal>

                  {/* ✅ IMPORTANT: no status text on success (only toast + modal) */}
                </form>
              </Card>
            </Reveal>
          </div>

          <div className="h-20 md:hidden" />
        </Container>
      </section>
    </>
  );
}

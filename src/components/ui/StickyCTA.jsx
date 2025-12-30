// "use client";

// import Link from "next/link";

// export default function StickyCTA() {
//   return (
//     <div className="fixed bottom-3 left-0 right-0 z-50 px-3 md:hidden">
//       <div className="mx-auto flex max-w-6xl gap-2 rounded-2xl border border-white/10 bg-black/70 p-2 backdrop-blur">
//         <Link
//           href="/contact"
//           className="flex-1 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-black active:scale-[0.99]"
//         >
//           Contact
//         </Link>

//         <a
//           href="https://wa.me/91XXXXXXXXXX"
//           target="_blank"
//           className="flex-1 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-center text-sm font-semibold text-white active:scale-[0.99]"
//           rel="noreferrer"
//         >
//           WhatsApp
//         </a>
//       </div>
//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";

// export default function StickyCTA({
//   whatsappNumber = "919919371299",
//   email = "mukuljaiswal282@gmail.com",
//   defaultMessage = "Hi Mukul, I want to discuss a project.",
//   showCall = false,
// }) {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const mq = window.matchMedia("(max-width: 768px)");
//     const update = () => setIsMobile(mq.matches);
//     update();
//     mq.addEventListener?.("change", update);
//     return () => mq.removeEventListener?.("change", update);
//   }, []);

//   const whatsappUrl = useMemo(() => {
//     const msg = encodeURIComponent(defaultMessage);
//     // ✅ wa.me format (works best)
//     return `https://wa.me/${whatsappNumber}?text=${msg}`;
//   }, [whatsappNumber, defaultMessage]);

//   const mailUrl = useMemo(() => {
//     const subject = encodeURIComponent("Project Inquiry");
//     const body = encodeURIComponent(defaultMessage);
//     return `mailto:${email}?subject=${subject}&body=${body}`;
//   }, [email, defaultMessage]);

//   const callUrl = useMemo(() => `tel:+${whatsappNumber}`, [whatsappNumber]);

//   if (!isMobile) return null;

//   return (
//     <div className="fixed inset-x-0 bottom-0 z-[90] pb-[max(env(safe-area-inset-bottom),0px)] md:hidden">
//       <div className="mx-auto max-w-6xl px-3 pb-3">
//         <div className="relative flex items-center gap-2 rounded-2xl border border-border/15 bg-background/80 p-2 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.38)]">
//           {/* subtle luxury glow */}
//           <motion.span
//             aria-hidden
//             className="pointer-events-none absolute -inset-[10px] rounded-2xl bg-gradient-to-r from-foreground/20 via-transparent to-foreground/20 blur-2xl"
//             animate={{ opacity: [0.12, 0.22, 0.12], scale: [1, 1.06, 1] }}
//             transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
//           />

//           {/* Contact (internal page) */}
//           <Link
//             href="/contact"
//             className="relative flex-1 rounded-2xl bg-foreground px-4 py-3 text-center text-sm font-semibold text-background transition active:scale-[0.99]"
//           >
//             Contact
//           </Link>

//           {/* WhatsApp */}
//           <a
//             href={whatsappUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="relative flex-1 rounded-2xl border border-border/15 bg-foreground/[0.03] px-4 py-3 text-center text-sm font-semibold text-foreground/90 transition hover:bg-foreground/[0.06] active:scale-[0.99]"
//           >
//             WhatsApp
//           </a>

//           {/* Email icon button */}
//           <a
//             href={mailUrl}
//             className="relative inline-flex h-[46px] w-[46px] items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] text-sm text-foreground/90 transition hover:bg-foreground/[0.06] active:scale-[0.99]"
//             aria-label="Email"
//             title="Email"
//           >
//             ✉️
//           </a>

//           {/* Optional Call */}
//           {showCall ? (
//             <a
//               href={callUrl}
//               className="relative inline-flex h-[46px] w-[46px] items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] text-sm text-foreground/90 transition hover:bg-foreground/[0.06] active:scale-[0.99]"
//               aria-label="Call"
//               title="Call"
//             >
//               📞
//             </a>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";

// const STORAGE_KEY = "mukul_contact_draft";

// function safeSlugToTitle(slug = "") {
//   return slug
//     .replace(/[-_]+/g, " ")
//     .replace(/\b\w/g, (m) => m.toUpperCase())
//     .trim();
// }

// export default function StickyCTA({
//   whatsappNumber = "919919371299",
//   email = "mukuljaiswal282@gmail.com",
//   defaultMessage = "Hi Mukul, I want to discuss a project.",
//   showCall = false,
// }) {
//   const [isMobile, setIsMobile] = useState(false);
//   const [pageUrl, setPageUrl] = useState("");
//   const [projectName, setProjectName] = useState("");
//   const [draft, setDraft] = useState({ name: "", email: "", message: "" });

//   // mobile only
//   useEffect(() => {
//     const mq = window.matchMedia("(max-width: 768px)");
//     const update = () => setIsMobile(mq.matches);
//     update();
//     mq.addEventListener?.("change", update);
//     return () => mq.removeEventListener?.("change", update);
//   }, []);

//   // ✅ current page URL + project auto detect
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const url = window.location.href;
//     setPageUrl(url);

//     try {
//       const u = new URL(url);
//       const qProject = u.searchParams.get("project") || u.searchParams.get("p");

//       // /projects/<slug> detect
//       const path = u.pathname || "";
//       const match = path.match(/\/projects\/([^\/\?]+)/i);
//       const fromPath = match?.[1];

//       const slug = qProject || fromPath || "";
//       setProjectName(slug ? safeSlugToTitle(slug) : "");
//     } catch {}
//   }, []);

//   // ✅ read draft from localStorage + listen to live updates
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const readDraft = () => {
//       try {
//         const raw = localStorage.getItem(STORAGE_KEY);
//         if (!raw) return;
//         const parsed = JSON.parse(raw);
//         setDraft({
//           name: parsed?.name || "",
//           email: parsed?.email || "",
//           message: parsed?.message || "",
//         });
//       } catch {}
//     };

//     readDraft();

//     const onDraft = (e) => {
//       const d = e?.detail;
//       if (!d) return;
//       setDraft({
//         name: d?.name || "",
//         email: d?.email || "",
//         message: d?.message || "",
//       });
//       try {
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
//       } catch {}
//     };

//     window.addEventListener("mukul:contactDraft", onDraft);
//     window.addEventListener("storage", readDraft);
//     return () => {
//       window.removeEventListener("mukul:contactDraft", onDraft);
//       window.removeEventListener("storage", readDraft);
//     };
//   }, []);

//   const whatsappUrl = useMemo(() => {
//     const parts = [];

//     // base line
//     parts.push(defaultMessage);

//     // auto project
//     if (projectName) parts.push(`Project: ${projectName}`);

//     // typed draft
//     if (draft.name) parts.push(`Name: ${draft.name}`);
//     if (draft.email) parts.push(`Email: ${draft.email}`);
//     if (draft.message) parts.push(`Message: ${draft.message}`);

//     // page url
//     if (pageUrl) parts.push(`Page: ${pageUrl}`);

//     const msg = encodeURIComponent(parts.join("\n"));
//     return `https://wa.me/${whatsappNumber}?text=${msg}`;
//   }, [whatsappNumber, defaultMessage, projectName, draft, pageUrl]);

//   const mailUrl = useMemo(() => {
//     const subject = encodeURIComponent(
//       projectName ? `Project: ${projectName}` : "Project Inquiry"
//     );

//     const bodyLines = [];
//     bodyLines.push(defaultMessage);
//     if (projectName) bodyLines.push(`Project: ${projectName}`);
//     if (draft.name) bodyLines.push(`Name: ${draft.name}`);
//     if (draft.email) bodyLines.push(`Email: ${draft.email}`);
//     if (draft.message) bodyLines.push(`Message: ${draft.message}`);
//     if (pageUrl) bodyLines.push(`Page: ${pageUrl}`);

//     const body = encodeURIComponent(bodyLines.join("\n"));
//     return `mailto:${email}?subject=${subject}&body=${body}`;
//   }, [email, defaultMessage, projectName, draft, pageUrl]);

//   const callUrl = useMemo(() => `tel:+${whatsappNumber}`, [whatsappNumber]);

//   if (!isMobile) return null;

//   return (
//     <div className="fixed inset-x-0 bottom-0 z-[90] pb-[max(env(safe-area-inset-bottom),0px)] md:hidden">
//       <div className="mx-auto max-w-6xl px-3 pb-3">
//         <div className="relative flex items-center gap-2 rounded-2xl border border-border/15 bg-background/80 p-2 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.38)]">
//           {/* subtle luxury glow */}
//           <motion.span
//             aria-hidden
//             className="pointer-events-none absolute -inset-[10px] rounded-2xl bg-gradient-to-r from-foreground/20 via-transparent to-foreground/20 blur-2xl"
//             animate={{ opacity: [0.12, 0.22, 0.12], scale: [1, 1.06, 1] }}
//             transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
//           />

//           {/* Contact */}
//           <Link
//             href="/contact"
//             className="relative flex-1 rounded-2xl bg-foreground px-4 py-3 text-center text-sm font-semibold text-background transition active:scale-[0.99]"
//           >
//             Contact
//           </Link>

//           {/* ✅ WhatsApp (pulse glow only here) */}
//           <motion.a
//             href={whatsappUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="relative flex-1 rounded-2xl border border-border/15 bg-foreground/[0.03] px-4 py-3 text-center text-sm font-semibold text-foreground/90 transition hover:bg-foreground/[0.06] active:scale-[0.99]"
//             animate={{
//               boxShadow: [
//                 "0 0 0 rgba(255,255,255,0)",
//                 "0 0 22px rgba(255,255,255,0.12)",
//                 "0 0 0 rgba(255,255,255,0)",
//               ],
//             }}
//             transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
//           >
//             WhatsApp
//           </motion.a>

//           {/* Email */}
//           <a
//             href={mailUrl}
//             className="relative inline-flex h-[46px] w-[46px] items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] text-sm text-foreground/90 transition hover:bg-foreground/[0.06] active:scale-[0.99]"
//             aria-label="Email"
//             title="Email"
//           >
//             ✉️
//           </a>

//           {/* Optional Call */}
//           {showCall ? (
//             <a
//               href={callUrl}
//               className="relative inline-flex h-[46px] w-[46px] items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] text-sm text-foreground/90 transition hover:bg-foreground/[0.06] active:scale-[0.99]"
//               aria-label="Call"
//               title="Call"
//             >
//               📞
//             </a>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const STORAGE_KEY = "mukul_contact_draft";

// function safeSlugToTitle(slug = "") {
//   return slug
//     .replace(/[-_]+/g, " ")
//     .replace(/\b\w/g, (m) => m.toUpperCase())
//     .trim();
// }

// export default function StickyCTA({
//   whatsappNumber = "919919371299",
//   email = "mukuljaiswal282@gmail.com",
//   defaultMessage = "Hi Mukul, I want to discuss a project.",
//   showCall = false,
// }) {
//   const [isMobile, setIsMobile] = useState(false);
//   const [pageUrl, setPageUrl] = useState("");
//   const [projectName, setProjectName] = useState("");
//   const [draft, setDraft] = useState({ name: "", email: "", message: "" });
//   const [waClicked, setWaClicked] = useState(false);

//   useEffect(() => {
//     const mq = window.matchMedia("(max-width: 768px)");
//     const update = () => setIsMobile(mq.matches);
//     update();
//     mq.addEventListener?.("change", update);
//     return () => mq.removeEventListener?.("change", update);
//   }, []);

//   // current URL + project detect
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const url = window.location.href;
//     setPageUrl(url);

//     try {
//       const u = new URL(url);
//       const qProject = u.searchParams.get("project") || u.searchParams.get("p");
//       const match = (u.pathname || "").match(/\/projects\/([^\/\?]+)/i);
//       const fromPath = match?.[1];
//       const slug = qProject || fromPath || "";
//       setProjectName(slug ? safeSlugToTitle(slug) : "");
//     } catch {}
//   }, []);

//   // read + listen draft
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const readDraft = () => {
//       try {
//         const raw = localStorage.getItem(STORAGE_KEY);
//         if (!raw) return;
//         const parsed = JSON.parse(raw);
//         setDraft({
//           name: parsed?.name || "",
//           email: parsed?.email || "",
//           message: parsed?.message || "",
//         });
//       } catch {}
//     };

//     readDraft();

//     const onDraft = (e) => {
//       const d = e?.detail || {};
//       setDraft({
//         name: d?.name || "",
//         email: d?.email || "",
//         message: d?.message || "",
//       });
//       try {
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
//       } catch {}
//     };

//     window.addEventListener("mukul:contactDraft", onDraft);
//     window.addEventListener("storage", readDraft);
//     return () => {
//       window.removeEventListener("mukul:contactDraft", onDraft);
//       window.removeEventListener("storage", readDraft);
//     };
//   }, []);

//   const whatsappUrl = useMemo(() => {
//     const parts = [];
//     parts.push(defaultMessage);
//     if (projectName) parts.push(`Project: ${projectName}`);
//     if (draft.name) parts.push(`Name: ${draft.name}`);
//     if (draft.email) parts.push(`Email: ${draft.email}`);
//     if (draft.message) parts.push(`Message: ${draft.message}`);
//     if (pageUrl) parts.push(`Page: ${pageUrl}`);
//     return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
//       parts.join("\n")
//     )}`;
//   }, [whatsappNumber, defaultMessage, projectName, draft, pageUrl]);

//   const mailUrl = useMemo(() => {
//     const subject = encodeURIComponent(
//       projectName ? `Project: ${projectName}` : "Project Inquiry"
//     );

//     const bodyLines = [];
//     bodyLines.push(defaultMessage);
//     if (projectName) bodyLines.push(`Project: ${projectName}`);
//     if (draft.name) bodyLines.push(`Name: ${draft.name}`);
//     if (draft.email) bodyLines.push(`Email: ${draft.email}`);
//     if (draft.message) bodyLines.push(`Message: ${draft.message}`);
//     if (pageUrl) bodyLines.push(`Page: ${pageUrl}`);

//     return `mailto:${email}?subject=${subject}&body=${encodeURIComponent(
//       bodyLines.join("\n")
//     )}`;
//   }, [email, defaultMessage, projectName, draft, pageUrl]);

//   const callUrl = useMemo(() => `tel:+${whatsappNumber}`, [whatsappNumber]);

//   const onWhatsAppClick = () => {
//     if (navigator?.vibrate) navigator.vibrate(12);
//     setWaClicked(true);
//     window.setTimeout(() => setWaClicked(false), 900);
//   };

//   if (!isMobile) return null;

//   return (
//     <div className="fixed inset-x-0 bottom-0 z-[90] pb-[max(env(safe-area-inset-bottom),0px)] md:hidden">
//       <div className="mx-auto max-w-6xl px-3 pb-3">
//         <div className="relative flex items-center gap-2 rounded-2xl border border-border/15 bg-background/80 p-2 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.38)]">
//           <motion.span
//             aria-hidden
//             className="pointer-events-none absolute -inset-[10px] rounded-2xl bg-gradient-to-r from-foreground/20 via-transparent to-foreground/20 blur-2xl"
//             animate={{ opacity: [0.12, 0.22, 0.12], scale: [1, 1.06, 1] }}
//             transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
//           />

//           <Link
//             href="/contact"
//             className="relative flex-1 rounded-2xl bg-foreground px-4 py-3 text-center text-sm font-semibold text-background transition active:scale-[0.99]"
//           >
//             Contact
//           </Link>

//           {/* WhatsApp (pulse only here) */}
//           <motion.a
//             href={whatsappUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             onClick={onWhatsAppClick}
//             className="relative flex-1 rounded-2xl border border-border/15 bg-foreground/[0.03] px-4 py-3 text-center text-sm font-semibold text-foreground/90 transition hover:bg-foreground/[0.06] active:scale-[0.99] overflow-hidden"
//             animate={{
//               boxShadow: [
//                 "0 0 0 rgba(255,255,255,0)",
//                 "0 0 22px rgba(255,255,255,0.12)",
//                 "0 0 0 rgba(255,255,255,0)",
//               ],
//             }}
//             transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
//           >
//             WhatsApp
//             <AnimatePresence>
//               {waClicked ? (
//                 <motion.span
//                   initial={{ opacity: 0, y: 6, scale: 0.96 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: -6 }}
//                   transition={{ duration: 0.18, ease: "easeOut" }}
//                   className="pointer-events-none absolute inset-0 grid place-items-center rounded-2xl bg-background/55 backdrop-blur"
//                 >
//                   <span className="inline-flex items-center gap-2 rounded-full border border-border/15 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/85">
//                     Opened <span aria-hidden>✓</span>
//                   </span>
//                 </motion.span>
//               ) : null}
//             </AnimatePresence>
//           </motion.a>

//           <a
//             href={mailUrl}
//             className="relative inline-flex h-[46px] w-[46px] items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] text-sm text-foreground/90 transition hover:bg-foreground/[0.06] active:scale-[0.99]"
//             aria-label="Email"
//             title="Email"
//           >
//             ✉️
//           </a>

//           {showCall ? (
//             <a
//               href={callUrl}
//               className="relative inline-flex h-[46px] w-[46px] items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] text-sm text-foreground/90 transition hover:bg-foreground/[0.06] active:scale-[0.99]"
//               aria-label="Call"
//               title="Call"
//             >
//               📞
//             </a>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "mukul_contact_draft";

function safeSlugToTitle(slug = "") {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

export default function StickyCTA({
  whatsappNumber = "919919371299",
  defaultMessage = "Hi Mukul, I want to discuss a project.",
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [pageUrl, setPageUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [draft, setDraft] = useState({ name: "", email: "", message: "" });
  const [waClicked, setWaClicked] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // current URL + project detect
  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = window.location.href;
    setPageUrl(url);

    try {
      const u = new URL(url);
      const qProject = u.searchParams.get("project") || u.searchParams.get("p");
      const match = (u.pathname || "").match(/\/projects\/([^\/\?]+)/i);
      const fromPath = match?.[1];
      const slug = qProject || fromPath || "";
      setProjectName(slug ? safeSlugToTitle(slug) : "");
    } catch {}
  }, []);

  // read + listen draft
  useEffect(() => {
    if (typeof window === "undefined") return;

    const readDraft = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        setDraft({
          name: parsed?.name || "",
          email: parsed?.email || "",
          message: parsed?.message || "",
        });
      } catch {}
    };

    readDraft();

    const onDraft = (e) => {
      const d = e?.detail || {};
      setDraft({
        name: d?.name || "",
        email: d?.email || "",
        message: d?.message || "",
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
      } catch {}
    };

    window.addEventListener("mukul:contactDraft", onDraft);
    window.addEventListener("storage", readDraft);
    return () => {
      window.removeEventListener("mukul:contactDraft", onDraft);
      window.removeEventListener("storage", readDraft);
    };
  }, []);

  const whatsappUrl = useMemo(() => {
    const parts = [];
    parts.push(defaultMessage);
    if (projectName) parts.push(`Project: ${projectName}`);
    if (draft.name) parts.push(`Name: ${draft.name}`);
    if (draft.email) parts.push(`Email: ${draft.email}`);
    if (draft.message) parts.push(`Message: ${draft.message}`);
    if (pageUrl) parts.push(`Page: ${pageUrl}`);
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      parts.join("\n")
    )}`;
  }, [whatsappNumber, defaultMessage, projectName, draft, pageUrl]);

  const onWhatsAppClick = () => {
    if (navigator?.vibrate) navigator.vibrate(12);
    setWaClicked(true);
    window.setTimeout(() => setWaClicked(false), 900);
  };

  if (!isMobile) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] pb-[max(env(safe-area-inset-bottom),0px)] md:hidden">
      <div className="mx-auto max-w-6xl px-3 pb-3">
        <div className="relative flex items-center gap-2 rounded-2xl border border-border/15 bg-background/80 p-2 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.38)]">
          {/* soft ambient glow */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-[10px] rounded-2xl bg-gradient-to-r from-foreground/20 via-transparent to-foreground/20 blur-2xl"
            animate={{ opacity: [0.12, 0.22, 0.12], scale: [1, 1.06, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Contact */}
          <Link
            href="/contact"
            className="relative flex-1 rounded-2xl bg-foreground px-4 py-3 text-center text-sm font-semibold text-background transition active:scale-[0.99]"
          >
            Contact
          </Link>

          {/* WhatsApp (pulse only here) */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
            className="relative flex-1 rounded-2xl border border-border/15 bg-foreground/[0.03] px-4 py-3 text-center text-sm font-semibold text-foreground/90 transition hover:bg-foreground/[0.06] active:scale-[0.99] overflow-hidden"
            animate={{
              boxShadow: [
                "0 0 0 rgba(255,255,255,0)",
                "0 0 22px rgba(255,255,255,0.12)",
                "0 0 0 rgba(255,255,255,0)",
              ],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            WhatsApp
            <AnimatePresence>
              {waClicked ? (
                <motion.span
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 grid place-items-center rounded-2xl bg-background/55 backdrop-blur"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/15 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/85">
                    Opened <span aria-hidden>✓</span>
                  </span>
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.a>
        </div>
      </div>
    </div>
  );
}

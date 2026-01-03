// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { AnimatePresence, motion } from "framer-motion";

// import { getAllPosts } from "@/lib/blog";
// import { aiSuggestions } from "@/data/aiSuggestions";

// /**
//  * ✅ Position rule (premium + comfortable):
//  * - Mobile: TOP-CENTER (navbar ke niche) + slide-down + fade
//  * - Desktop: BOTTOM-RIGHT + slide-up + fade
//  *
//  * ✅ LOGIC FIX:
//  * - Ab suggestions ka source = src/data/aiSuggestions.js (global)
//  * - Blog-only dependency remove -> ab har page par pool non-empty रहेगा
//  */

// const START_DELAY_MS = 5000;
// const SHOW_MS = 7000;
// const NEXT_GAP_MS = 8000;

// function isMobileLike() {
//   if (typeof window === "undefined") return false;
//   return window.matchMedia?.("(max-width: 640px)")?.matches;
// }

// function safeText(s = "") {
//   return String(s || "")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// function pickPosition(isMobile) {
//   if (isMobile) {
//     return {
//       key: "mobile-top-center",
//       cls: "top-[calc(env(safe-area-inset-top)+88px)] left-1/2 -translate-x-1/2",
//     };
//   }
//   return { key: "desktop-bottom-right", cls: "bottom-8 right-8" };
// }

// function getMotion(isMobile) {
//   if (isMobile) {
//     return {
//       initial: { opacity: 0, y: -14, scale: 0.985, filter: "blur(10px)" },
//       animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
//       exit: { opacity: 0, y: -10, scale: 0.985, filter: "blur(10px)" },
//     };
//   }
//   return {
//     initial: { opacity: 0, y: 14, scale: 0.985, filter: "blur(10px)" },
//     animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
//     exit: { opacity: 0, y: 10, scale: 0.985, filter: "blur(10px)" },
//   };
// }

// export default function AISuggestions() {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [open, setOpen] = useState(false);
//   const [pos, setPos] = useState(null);
//   const [current, setCurrent] = useState(null);
//   const [mobile, setMobile] = useState(false);

//   // ✅ Countdown (7..1)
//   const SHOW_SEC = Math.ceil(SHOW_MS / 1000);
//   const [secLeft, setSecLeft] = useState(SHOW_SEC);

//   useEffect(() => {
//     if (!open) return;
//     setSecLeft(SHOW_SEC);

//     const t = setInterval(() => {
//       setSecLeft((p) => (p <= 1 ? 1 : p - 1));
//     }, 1000);

//     return () => clearInterval(t);
//   }, [open, SHOW_SEC]);

//   const timers = useRef({ start: null, autoClose: null, next: null });
//   const cardRef = useRef(null);
//   const usedRef = useRef(new Set());

//   const isHome =
//     pathname === "/" || pathname?.includes("/(site)") || pathname === "/home";
//   const isBlogList = pathname === "/blog";
//   const isBlogDetail = pathname?.startsWith("/blog/") && pathname !== "/blog";

//   useEffect(() => {
//     const update = () => setMobile(isMobileLike());
//     update();
//     window.addEventListener?.("resize", update);
//     return () => window.removeEventListener?.("resize", update);
//   }, []);

//   const posts = useMemo(() => {
//     try {
//       return getAllPosts?.() || [];
//     } catch {
//       return [];
//     }
//   }, []);

//   // ✅ GLOBAL POOL (always non-empty)
//   const pool = useMemo(() => {
//     const base = Array.isArray(aiSuggestions) ? aiSuggestions : [];

//     // normalize base suggestions (ensure required fields)
//     const normalizedBase = base
//       .map((s) => ({
//         id: s.id,
//         type: s.type || "page", // "section" | "page"
//         target: s.target, // sectionId OR href
//         title: s.title || "AI Suggestion",
//         desc: s.desc || "",
//         cta: s.cta || "Open →",
//         icon: s.icon || "✦",
//       }))
//       .filter((x) => x.id && x.target);

//     // ✅ Add context-only blog suggestions (optional)
//     let blogExtras = [];
//     try {
//       const sorted = (posts || []).slice().sort((a, b) => {
//         const da = new Date(a.date || a.publishedAt || 0).getTime();
//         const db = new Date(b.date || b.publishedAt || 0).getTime();
//         return db - da;
//       });

//       const latest = sorted[0];
//       const second = sorted[1];

//       if (isBlogList) {
//         if (latest?.slug) {
//           blogExtras.push({
//             id: "sug:blog:latest",
//             type: "page",
//             target: `/blog/${latest.slug}`,
//             title: "AI Suggestion",
//             desc: `Read: ${safeText(latest.title)}`,
//             cta: "Open latest →",
//             icon: "✦",
//           });
//         }
//         if (second?.slug) {
//           blogExtras.push({
//             id: "sug:blog:second",
//             type: "page",
//             target: `/blog/${second.slug}`,
//             title: "AI Suggestion",
//             desc: `Also try: ${safeText(second.title)}`,
//             cta: "Open →",
//             icon: "✦",
//           });
//         }
//       }

//       if (isBlogDetail) {
//         blogExtras.push({
//           id: "sug:blog:back",
//           type: "page",
//           target: "/blog",
//           title: "AI Suggestion",
//           desc: "Back to all blogs.",
//           cta: "Open Blog →",
//           icon: "✦",
//         });
//       }

//       // even on other pages: sometimes show latest blog
//       if (!isBlogList && !isBlogDetail && latest?.slug) {
//         blogExtras.push({
//           id: "sug:any:latest-blog",
//           type: "page",
//           target: `/blog/${latest.slug}`,
//           title: "AI Suggestion",
//           desc: `Latest read: ${safeText(latest.title)}`,
//           cta: "Read now →",
//           icon: "✦",
//         });
//       }
//     } catch {
//       // ignore
//     }

//     // de-dupe by id
//     const map = new Map();
//     [...normalizedBase, ...blogExtras].forEach((x) => map.set(x.id, x));
//     return [...map.values()].filter(Boolean);
//   }, [posts, isBlogList, isBlogDetail]);

//   const clearTimers = () => {
//     const t = timers.current;
//     if (t.start) clearTimeout(t.start);
//     if (t.autoClose) clearTimeout(t.autoClose);
//     if (t.next) clearTimeout(t.next);
//     timers.current = { start: null, autoClose: null, next: null };
//   };

//   const pickNext = () => {
//     if (!pool.length) return null;
//     const available = pool.filter((x) => !usedRef.current.has(x.id));
//     const list = available.length ? available : pool;
//     if (!available.length) usedRef.current.clear();

//     const item = list[Math.floor(Math.random() * list.length)];
//     usedRef.current.add(item.id);
//     return item;
//   };

//   const scheduleNext = () => {
//     clearTimeout(timers.current.next);
//     timers.current.next = setTimeout(() => {
//       const nextItem = pickNext();
//       if (!nextItem) return;

//       setPos(pickPosition(mobile));
//       setCurrent(nextItem);
//       setOpen(true);

//       clearTimeout(timers.current.autoClose);
//       timers.current.autoClose = setTimeout(() => closeNow(), SHOW_MS);
//     }, NEXT_GAP_MS);
//   };

//   const closeNow = () => {
//     setOpen(false);
//     setCurrent(null);
//     clearTimeout(timers.current.autoClose);
//     scheduleNext();
//   };

//   const startCycle = () => {
//     clearTimers();
//     timers.current.start = setTimeout(() => {
//       const nextItem = pickNext();
//       if (!nextItem) return;

//       setPos(pickPosition(mobile));
//       setCurrent(nextItem);
//       setOpen(true);

//       timers.current.autoClose = setTimeout(() => closeNow(), SHOW_MS);
//     }, START_DELAY_MS);
//   };

//   useEffect(() => {
//     // ✅ pool change / route change pe restart (important)
//     usedRef.current.clear();
//     setOpen(false);
//     setCurrent(null);
//     startCycle();
//     return () => clearTimers();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pathname, mobile, pool.length]);

//   useEffect(() => {
//     if (!open) return;

//     const onDown = (e) => {
//       const el = cardRef.current;
//       if (!el) return;
//       if (el.contains(e.target)) return;
//       closeNow();
//     };

//     const onKey = (e) => {
//       if (e.key === "Escape") closeNow();
//     };

//     document.addEventListener("pointerdown", onDown, true);
//     window.addEventListener("keydown", onKey);

//     return () => {
//       document.removeEventListener("pointerdown", onDown, true);
//       window.removeEventListener("keydown", onKey);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open]);

//   const onCTAClick = () => {
//     if (!current) return;

//     setOpen(false);
//     setCurrent(null);
//     clearTimeout(timers.current.autoClose);

//     setTimeout(() => {
//       // ✅ Section navigation (scroll)
//       if (current.type === "section") {
//         const id = String(current.target || "").replace(/^#/, "");
//         if (!id) return;

//         if (isHome) {
//           // already on home -> scroll
//           const el = document.getElementById(id);
//           el?.scrollIntoView({ behavior: "smooth", block: "start" });
//           return;
//         }

//         // go home with hash -> ScrollToHash will handle
//         router.push(`/#${id}`);
//         return;
//       }

//       // ✅ Page navigation
//       if (current.type === "page") {
//         router.push(String(current.target));
//         return;
//       }

//       // fallback
//       router.push("/");
//     }, 120);

//     scheduleNext();
//   };

//   if (!current) return null;

//   const mv = getMotion(mobile);

//   return (
//     <AnimatePresence>
//       {open ? (
//         <motion.div
//           className={[
//             "fixed z-[999] w-[min(360px,92vw)] pointer-events-auto",
//             pos?.cls ||
//               "top-[calc(env(safe-area-inset-top)+88px)] left-1/2 -translate-x-1/2",
//           ].join(" ")}
//           initial={mv.initial}
//           animate={mv.animate}
//           exit={mv.exit}
//           transition={{ duration: 0.22, ease: "easeOut" }}
//         >
//           <motion.div
//             ref={cardRef}
//             className={[
//               "relative overflow-hidden rounded-3xl border",
//               "border-white/10 bg-black/75 backdrop-blur-xl",
//               "shadow-[0_24px_85px_rgba(0,0,0,0.70)]",
//             ].join(" ")}
//             animate={{ y: [0, -4, 0] }}
//             transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
//           >
//             {/* glow aura */}
//             <motion.div
//               aria-hidden
//               className="pointer-events-none absolute -inset-12 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.20),transparent_55%)] blur-3xl"
//               animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.08, 1] }}
//               transition={{
//                 duration: 2.6,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             />

//             {/* top shimmer line */}
//             <motion.div
//               aria-hidden
//               className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)]"
//               animate={{
//                 opacity: [0.25, 0.9, 0.25],
//                 x: ["-40%", "40%", "-40%"],
//               }}
//               transition={{
//                 duration: 2.4,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             />

//             <div className="relative p-4">
//               <div className="flex items-start justify-between gap-3">
//                 <div className="flex items-center gap-2">
//                   <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
//                     <span className="text-[#FFD54A] drop-shadow-[0_0_12px_rgba(255,215,0,0.45)]">
//                       ✦
//                     </span>
//                   </span>
//                   <div className="leading-tight">
//                     <p className="text-xs text-white/55">{current.title}</p>
//                     <p className="text-sm font-semibold text-[#F6E7B2]">
//                       Quick tip for you
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={closeNow}
//                   className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]"
//                   aria-label="Close"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <p className="mt-3 text-sm leading-relaxed text-white/75">
//                 {current.desc}
//               </p>

//               <div className="mt-4 flex items-center justify-between gap-3">
//                 <button
//                   type="button"
//                   onClick={onCTAClick}
//                   className={[
//                     "relative inline-flex items-center justify-center",
//                     "rounded-2xl border px-4 py-2.5 text-sm font-semibold",
//                     "border-[#FFD54A]/25 bg-[#FFD54A]/10 text-[#F6E7B2]",
//                     "hover:bg-[#FFD54A]/16 transition overflow-hidden",
//                   ].join(" ")}
//                 >
//                   <span className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 hover:translate-x-[520px] transition duration-700" />
//                   <span className="relative">{current.cta}</span>
//                 </button>

//                 <span className="text-[11px] text-white/45">
//                   Auto close in {secLeft}s
//                 </span>
//               </div>

//               {/* progress bar (7s) */}
//               <motion.div
//                 aria-hidden
//                 className="absolute bottom-0 left-0 h-[2px] w-full bg-[#FFD54A]/55"
//                 initial={{ scaleX: 1 }}
//                 animate={{ scaleX: 0 }}
//                 transition={{ duration: SHOW_MS / 1000, ease: "linear" }}
//                 style={{ transformOrigin: "left" }}
//               />
//             </div>
//           </motion.div>
//         </motion.div>
//       ) : null}
//     </AnimatePresence>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { aiSuggestions } from "@/data/aiSuggestions";

/**
 * ✅ Position rule (premium + comfortable):
 * - Mobile: TOP-CENTER (navbar ke niche) + slide-down + fade
 * - Desktop: BOTTOM-RIGHT + slide-up + fade
 *
 * UI SAME. Logic = data-driven engine.
 */

const START_DELAY_MS = 5000;
const SHOW_MS = 7000;
const NEXT_GAP_MS = 20000;

function isMobileLike() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(max-width: 640px)")?.matches;
}

function safeText(s = "") {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim();
}

/** ✅ Fixed premium positions */
function pickPosition(isMobile) {
  if (isMobile) {
    return {
      key: "mobile-top-center",
      cls: "top-[calc(env(safe-area-inset-top)+88px)] left-1/2 -translate-x-1/2",
    };
  }
  return {
    key: "desktop-bottom-right",
    cls: "bottom-8 right-8",
  };
}

/** ✅ Motion variants based on device */
function getMotion(isMobile) {
  if (isMobile) {
    return {
      initial: { opacity: 0, y: -14, scale: 0.985, filter: "blur(10px)" },
      animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
      exit: { opacity: 0, y: -10, scale: 0.985, filter: "blur(10px)" },
    };
  }
  return {
    initial: { opacity: 0, y: 14, scale: 0.985, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: 10, scale: 0.985, filter: "blur(10px)" },
  };
}

function normPathname(p) {
  const s = String(p || "/");
  // normalize: remove trailing slash except "/"
  if (s.length > 1 && s.endsWith("/")) return s.slice(0, -1);
  return s;
}

function inList(list, pathname) {
  return Array.isArray(list) && list.includes(pathname);
}

/**
 * ✅ Build pool from aiSuggestions.js
 * schema:
 *  { id, type:"page"|"section", target, title, desc, cta, showOn?, hideOn?, weight? }
 */
function buildPoolFromData({ pathname, baseList }) {
  const p = normPathname(pathname);
  const list = Array.isArray(baseList) ? baseList : [];

  return list
    .filter((s) => {
      if (!s?.id || !s?.target) return false;

      // showOn => only these pages
      if (Array.isArray(s.showOn) && s.showOn.length) {
        if (!inList(s.showOn.map(normPathname), p)) return false;
      }

      // hideOn => exclude
      if (Array.isArray(s.hideOn) && s.hideOn.length) {
        if (inList(s.hideOn.map(normPathname), p)) return false;
      }

      // sanitize texts
      s.title = safeText(s.title || "AI Suggestion");
      s.desc = safeText(s.desc || "");
      s.cta = safeText(s.cta || "Open →");

      return true;
    })
    .filter(Boolean);
}

/** ✅ Weighted random + avoid repeats */
function pickWeighted(pool, usedSet) {
  if (!pool.length) return null;

  const available = pool.filter((x) => !usedSet.has(x.id));
  const list = available.length ? available : pool;

  if (!available.length) usedSet.clear();

  // Expand by weight (small list => safe)
  const expanded = [];
  for (const item of list) {
    const w = Math.max(1, Number(item.weight || 1));
    for (let i = 0; i < w; i++) expanded.push(item);
  }

  const picked = expanded[Math.floor(Math.random() * expanded.length)];
  usedSet.add(picked.id);
  return picked;
}

export default function AISuggestions() {
  const router = useRouter();
  const pathnameRaw = usePathname();
  const pathname = normPathname(pathnameRaw);

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const [current, setCurrent] = useState(null);
  const [mobile, setMobile] = useState(false);

  // ✅ Countdown (7..1)
  const SHOW_SEC = Math.ceil(SHOW_MS / 1000);
  const [secLeft, setSecLeft] = useState(SHOW_SEC);

  // timers + refs
  const timers = useRef({ start: null, autoClose: null, next: null });
  const cardRef = useRef(null);
  const usedRef = useRef(new Set());

  // ✅ detect mobile
  useEffect(() => {
    const update = () => setMobile(isMobileLike());
    update();
    window.addEventListener?.("resize", update);
    return () => window.removeEventListener?.("resize", update);
  }, []);

  // ✅ pool from data
  const pool = useMemo(() => {
    return buildPoolFromData({ pathname, baseList: aiSuggestions });
  }, [pathname]);

  const clearTimers = () => {
    const t = timers.current;
    if (t.start) clearTimeout(t.start);
    if (t.autoClose) clearTimeout(t.autoClose);
    if (t.next) clearTimeout(t.next);
    timers.current = { start: null, autoClose: null, next: null };
  };

  const closeNow = () => {
    setOpen(false);
    setCurrent(null);
    clearTimeout(timers.current.autoClose);
    scheduleNext();
  };

  const scheduleNext = () => {
    clearTimeout(timers.current.next);
    timers.current.next = setTimeout(() => {
      const nextItem = pickWeighted(pool, usedRef.current);
      if (!nextItem) return;

      setPos(pickPosition(mobile));
      setCurrent(nextItem);
      setOpen(true);

      clearTimeout(timers.current.autoClose);
      timers.current.autoClose = setTimeout(() => closeNow(), SHOW_MS);
    }, NEXT_GAP_MS);
  };

  const startCycle = () => {
    clearTimers();
    timers.current.start = setTimeout(() => {
      const nextItem = pickWeighted(pool, usedRef.current);
      if (!nextItem) return;

      setPos(pickPosition(mobile));
      setCurrent(nextItem);
      setOpen(true);

      timers.current.autoClose = setTimeout(() => closeNow(), SHOW_MS);
    }, START_DELAY_MS);
  };

  // ✅ restart cycle on route change
  useEffect(() => {
    usedRef.current.clear();
    setOpen(false);
    setCurrent(null);
    startCycle();

    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, mobile]);

  // ✅ countdown timer
  useEffect(() => {
    if (!open) return;
    setSecLeft(SHOW_SEC);

    const t = setInterval(() => {
      setSecLeft((p) => (p <= 1 ? 1 : p - 1));
    }, 1000);

    return () => clearInterval(t);
  }, [open, SHOW_SEC]);

  // ✅ outside click + esc close
  useEffect(() => {
    if (!open) return;

    const onDown = (e) => {
      const el = cardRef.current;
      if (!el) return;
      if (el.contains(e.target)) return;
      closeNow();
    };

    const onKey = (e) => {
      if (e.key === "Escape") closeNow();
    };

    document.addEventListener("pointerdown", onDown, true);
    window.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ✅ Run suggestion action
  const runSuggestion = (item) => {
    if (!item) return;

    // close immediately (UI same)
    setOpen(false);
    setCurrent(null);
    clearTimeout(timers.current.autoClose);

    setTimeout(() => {
      // type: section => go to home then scroll (or just scroll if already on home)
      if (item.type === "section") {
        const id = String(item.target || "").replace(/^#/, "");
        if (!id) return;

        const isHome = pathname === "/" || pathname === "/home";

        if (isHome) {
          // smooth scroll
          setTimeout(() => {
            const el = document.getElementById(id);
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 60);
          return;
        }

        // go home with hash; ScrollToHash component can handle, but browser also tries
        router.push(`/#${encodeURIComponent(id)}`);
        return;
      }

      // default: page/route
      const href = String(item.target || "/");
      router.push(href);
    }, 120);

    scheduleNext();
  };

  if (!current) return null;

  const mv = getMotion(mobile);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={[
            "fixed z-[999] w-[min(360px,92vw)] pointer-events-auto",
            pos?.cls ||
              "top-[calc(env(safe-area-inset-top)+88px)] left-1/2 -translate-x-1/2",
          ].join(" ")}
          initial={mv.initial}
          animate={mv.animate}
          exit={mv.exit}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <motion.div
            ref={cardRef}
            className={[
              "relative overflow-hidden rounded-3xl border",
              "border-white/10 bg-black/75 backdrop-blur-xl",
              "shadow-[0_24px_85px_rgba(0,0,0,0.70)]",
            ].join(" ")}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* glow aura */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-12 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.20),transparent_55%)] blur-3xl"
              animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.08, 1] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* top shimmer line */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)]"
              animate={{
                opacity: [0.25, 0.9, 0.25],
                x: ["-40%", "40%", "-40%"],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
                    <span className="text-[#FFD54A] drop-shadow-[0_0_12px_rgba(255,215,0,0.45)]">
                      ✦
                    </span>
                  </span>
                  <div className="leading-tight">
                    <p className="text-xs text-white/55">{current.title}</p>
                    <p className="text-sm font-semibold text-[#F6E7B2]">
                      Quick tip for you
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeNow}
                  className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/75">
                {current.desc}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => runSuggestion(current)}
                  className={[
                    "relative inline-flex items-center justify-center",
                    "rounded-2xl border px-4 py-2.5 text-sm font-semibold",
                    "border-[#FFD54A]/25 bg-[#FFD54A]/10 text-[#F6E7B2]",
                    "hover:bg-[#FFD54A]/16 transition overflow-hidden",
                  ].join(" ")}
                >
                  <span className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 hover:translate-x-[520px] transition duration-700" />
                  <span className="relative">{current.cta}</span>
                </button>

                <span className="text-[11px] text-white/45">
                  Auto close in {secLeft}s
                </span>
              </div>

              {/* progress bar */}
              <motion.div
                aria-hidden
                className="absolute bottom-0 left-0 h-[2px] w-full bg-[#FFD54A]/55"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: SHOW_MS / 1000, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

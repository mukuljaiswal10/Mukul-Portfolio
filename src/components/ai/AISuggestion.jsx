// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { usePathname, useRouter } from "next/navigation";
// import { aiSuggestions } from "@/data/aiSuggestions";

// const SCROLL_EVENT = "mukul:scrollTo";

// // localStorage: avoid repeating same suggestion again & again
// const STORAGE_KEY = "mukul_ai_seen_v1";

// // mobile-first timings
// const INTERVAL_MS = 3800; // every 3-4 sec feel
// const SHOW_MS = 5200; // auto hide after
// const COOLDOWN_AFTER_ACTION = 1200;

// // random entry directions (including corners)
// const DIRECTIONS = [
//   "left",
//   "right",
//   "top",
//   "bottom",
//   "topLeft",
//   "topRight",
//   "bottomLeft",
//   "bottomRight",
// ];

// function isTypingNow() {
//   if (typeof document === "undefined") return false;
//   const el = document.activeElement;
//   if (!el) return false;
//   const tag = el.tagName?.toLowerCase();
//   return tag === "input" || tag === "textarea" || el.isContentEditable;
// }

// function getSeenSet() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     const arr = raw ? JSON.parse(raw) : [];
//     return new Set(Array.isArray(arr) ? arr : []);
//   } catch {
//     return new Set();
//   }
// }

// function saveSeenSet(set) {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
//   } catch {}
// }

// function pickNextSuggestion(pool) {
//   // cycle unique first (seen logic)
//   const seen = getSeenSet();
//   const unseen = pool.filter((s) => !seen.has(s.id));

//   const list = unseen.length ? unseen : pool; // if all seen -> allow again
//   const next = list[Math.floor(Math.random() * list.length)];

//   // mark seen (only when picked)
//   seen.add(next.id);
//   // if all were seen, keep it rolling but don’t grow forever
//   if (!unseen.length) {
//     // reset & keep last one seen so it doesn't instantly repeat
//     const fresh = new Set([next.id]);
//     saveSeenSet(fresh);
//   } else {
//     saveSeenSet(seen);
//   }
//   return next;
// }

// function pickDirectionMobileFirst() {
//   // mobile: corners & top/bottom feel premium
//   const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
//   return dir;
// }

// function motionVariant(dir) {
//   // entry from different angles
//   const base = { opacity: 0, filter: "blur(12px)", scale: 0.98, rotate: 0 };
//   const to = { opacity: 1, filter: "blur(0px)", scale: 1, rotate: 0 };

//   const dist = 70;

//   const map = {
//     left: { ...base, x: -dist, y: 0 },
//     right: { ...base, x: dist, y: 0 },
//     top: { ...base, x: 0, y: -dist },
//     bottom: { ...base, x: 0, y: dist },
//     topLeft: { ...base, x: -dist, y: -dist, rotate: -1.2 },
//     topRight: { ...base, x: dist, y: -dist, rotate: 1.2 },
//     bottomLeft: { ...base, x: -dist, y: dist, rotate: 1.2 },
//     bottomRight: { ...base, x: dist, y: dist, rotate: -1.2 },
//   };

//   return {
//     initial: map[dir] || map.bottom,
//     animate: { ...to, x: 0, y: 0 },
//     exit: { opacity: 0, filter: "blur(10px)", scale: 0.98, y: 12 },
//   };
// }

// function posClass(dir) {
//   // keep inside viewport on mobile
//   // mobile default: bottom-center, but random positions with safe spacing
//   switch (dir) {
//     case "top":
//       return "top-16 left-1/2 -translate-x-1/2";
//     case "bottom":
//       return "bottom-20 left-1/2 -translate-x-1/2";
//     case "left":
//       return "left-3 top-1/2 -translate-y-1/2";
//     case "right":
//       return "right-3 top-1/2 -translate-y-1/2";
//     case "topLeft":
//       return "top-16 left-3";
//     case "topRight":
//       return "top-16 right-3";
//     case "bottomLeft":
//       return "bottom-20 left-3";
//     case "bottomRight":
//       return "bottom-20 right-3";
//     default:
//       return "bottom-20 left-1/2 -translate-x-1/2";
//   }
// }

// export default function AISuggestions({
//   enabled = true,
//   intervalMs = INTERVAL_MS,
//   showMs = SHOW_MS,
// }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [open, setOpen] = useState(false);
//   const [dir, setDir] = useState("bottom");
//   const [item, setItem] = useState(null);

//   const timerRef = useRef(null);
//   const hideRef = useRef(null);
//   const cooldownRef = useRef(false);

//   const pool = useMemo(() => aiSuggestions || [], []);

//   const stopTimers = () => {
//     if (timerRef.current) clearInterval(timerRef.current);
//     if (hideRef.current) clearTimeout(hideRef.current);
//     timerRef.current = null;
//     hideRef.current = null;
//   };

//   const scheduleHide = () => {
//     if (hideRef.current) clearTimeout(hideRef.current);
//     hideRef.current = setTimeout(() => {
//       setOpen(false);
//     }, showMs);
//   };

//   const showOne = () => {
//     if (!enabled) return;
//     if (!pool.length) return;
//     if (cooldownRef.current) return;
//     if (typeof window === "undefined") return;

//     // don’t annoy while typing
//     if (isTypingNow()) return;

//     // reduce motion friendly
//     const reduce = window.matchMedia?.(
//       "(prefers-reduced-motion: reduce)"
//     )?.matches;
//     const nextDir = pickDirectionMobileFirst();

//     const next = pickNextSuggestion(pool);
//     setItem(next);
//     setDir(nextDir);
//     setOpen(true);

//     // subtle haptic on mobile (optional)
//     if (navigator?.vibrate) navigator.vibrate(8);

//     if (!reduce) scheduleHide();
//     else {
//       // reduce motion users: show shorter
//       if (hideRef.current) clearTimeout(hideRef.current);
//       hideRef.current = setTimeout(() => setOpen(false), 2200);
//     }
//   };

//   useEffect(() => {
//     if (!enabled) return;
//     if (typeof window === "undefined") return;

//     // first show (quick)
//     const first = setTimeout(() => showOne(), 900);

//     timerRef.current = setInterval(() => {
//       // if currently open, skip (one at a time)
//       if (open) return;
//       showOne();
//     }, intervalMs);

//     return () => {
//       clearTimeout(first);
//       stopTimers();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [enabled, intervalMs, pool.length, open]);

//   // also re-show after close manually
//   const close = () => {
//     setOpen(false);
//     if (hideRef.current) clearTimeout(hideRef.current);
//   };

//   const runAction = () => {
//     if (!item) return;

//     cooldownRef.current = true;
//     setTimeout(() => (cooldownRef.current = false), COOLDOWN_AFTER_ACTION);

//     close();

//     // SECTION scroll (home)
//     if (item.type === "section") {
//       const id = item.target;

//       // if already on home -> event scroll
//       if (pathname === "/" || pathname?.endsWith("/")) {
//         window.dispatchEvent(new CustomEvent(SCROLL_EVENT, { detail: { id } }));
//         // also update hash for shareable
//         try {
//           window.history.replaceState(null, "", `#${id}`);
//         } catch {}
//         return;
//       }

//       // otherwise go to home with hash; section components already listen to hash
//       router.push(`/#${id}`);
//       return;
//     }

//     // PAGE
//     if (item.type === "page") {
//       router.push(item.target);
//       return;
//     }

//     // TIP (do nothing / or open palette if you want later)
//     // item.target === "palette"
//   };

//   const v = motionVariant(dir);

//   return (
//     <AnimatePresence>
//       {open && item ? (
//         <motion.div
//           key={item.id + dir}
//           className={["fixed z-[999]", posClass(dir)].join(" ")}
//           initial={v.initial}
//           animate={v.animate}
//           exit={v.exit}
//           transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
//         >
//           <div
//             className={[
//               "relative overflow-hidden rounded-3xl",
//               "border border-border/15 bg-background/82 backdrop-blur",
//               "shadow-[0_22px_70px_rgba(0,0,0,0.45)]",
//               "w-[min(92vw,420px)]",
//             ].join(" ")}
//           >
//             {/* premium glow layer */}
//             <div className="pointer-events-none absolute -inset-24 opacity-60 blur-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
//             <div className="pointer-events-none absolute -left-28 top-0 h-full w-28 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60" />

//             <div className="relative p-4">
//               {/* top row */}
//               <div className="flex items-start justify-between gap-3">
//                 <div className="flex items-center gap-2">
//                   <span className="grid h-9 w-9 place-items-center rounded-2xl border border-border/15 bg-foreground/[0.04] text-sm">
//                     {item.icon || "✨"}
//                   </span>
//                   <div className="min-w-0">
//                     <p className="text-sm font-semibold text-foreground truncate">
//                       {item.title}
//                     </p>
//                     <p className="text-xs text-muted/70">AI Suggestion</p>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={close}
//                   className="cursor-pointer rounded-2xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-xs text-foreground/80 hover:bg-foreground/[0.06]"
//                   aria-label="Close suggestion"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <p className="mt-3 text-sm text-foreground/85 leading-relaxed">
//                 {item.desc}
//               </p>

//               <div className="mt-4 flex items-center gap-3">
//                 <button
//                   type="button"
//                   onClick={runAction}
//                   className="cursor-pointer select-none inline-flex flex-1 items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.06] px-4 py-3 text-sm text-foreground/90 hover:bg-foreground/[0.10]"
//                 >
//                   {item.cta || "Open"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     // "next" feels premium
//                     close();
//                     setTimeout(() => {
//                       setOpen(false);
//                       showOne();
//                     }, 240);
//                   }}
//                   className="cursor-pointer select-none inline-flex items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] px-4 py-3 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
//                 >
//                   Next →
//                 </button>
//               </div>
//             </div>

//             {/* progress bar (auto hide) */}
//             <motion.div
//               aria-hidden
//               className="absolute bottom-0 left-0 h-[2px] w-full bg-foreground/35"
//               initial={{ scaleX: 1 }}
//               animate={{ scaleX: 0 }}
//               transition={{ duration: showMs / 1000, ease: "linear" }}
//               style={{ transformOrigin: "left" }}
//             />
//           </div>
//         </motion.div>
//       ) : null}
//     </AnimatePresence>
//   );
// }

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { usePathname, useRouter } from "next/navigation";
// import { aiSuggestions } from "@/data/aiSuggestions";

// const SCROLL_EVENT = "mukul:scrollTo";
// const STORAGE_KEY = "mukul_ai_seen_v1";

// // ✅ Premium timings (mobile-first, non-spammy)
// const BASE_INTERVAL_MS = 9000; // avg 9s
// const JITTER_MS = 2500; // random extra 0-2.5s
// const SHOW_MS = 5200; // visible time
// const FIRST_SHOW_DELAY = 5500; // first show after 5.5s

// const MIN_GAP_AFTER_CLOSE = 8500; // close ke baad min gap
// const MIN_GAP_AFTER_ACTION = 15000; // CTA click ke baad min gap
// const MIN_GAP_BETWEEN_SHOWS = 7000; // safety net

// const COOLDOWN_AFTER_ACTION = 1200; // micro cooldown

// const DIRECTIONS = [
//   "left",
//   "right",
//   "top",
//   "bottom",
//   "topLeft",
//   "topRight",
//   "bottomLeft",
//   "bottomRight",
// ];

// function isTypingNow() {
//   if (typeof document === "undefined") return false;
//   const el = document.activeElement;
//   if (!el) return false;
//   const tag = el.tagName?.toLowerCase();
//   return tag === "input" || tag === "textarea" || el.isContentEditable;
// }

// function getSeenSet() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     const arr = raw ? JSON.parse(raw) : [];
//     return new Set(Array.isArray(arr) ? arr : []);
//   } catch {
//     return new Set();
//   }
// }

// function saveSeenSet(set) {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
//   } catch {}
// }

// function pickNextSuggestion(pool) {
//   const seen = getSeenSet();
//   const unseen = pool.filter((s) => !seen.has(s.id));
//   const list = unseen.length ? unseen : pool;
//   const next = list[Math.floor(Math.random() * list.length)];

//   seen.add(next.id);

//   if (!unseen.length) {
//     // reset so it doesn't grow forever
//     saveSeenSet(new Set([next.id]));
//   } else {
//     saveSeenSet(seen);
//   }
//   return next;
// }

// function pickDirectionMobileFirst() {
//   return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
// }

// function motionVariant(dir) {
//   const base = { opacity: 0, filter: "blur(12px)", scale: 0.98, rotate: 0 };
//   const to = { opacity: 1, filter: "blur(0px)", scale: 1, rotate: 0 };
//   const dist = 70;

//   const map = {
//     left: { ...base, x: -dist, y: 0 },
//     right: { ...base, x: dist, y: 0 },
//     top: { ...base, x: 0, y: -dist },
//     bottom: { ...base, x: 0, y: dist },
//     topLeft: { ...base, x: -dist, y: -dist, rotate: -1.2 },
//     topRight: { ...base, x: dist, y: -dist, rotate: 1.2 },
//     bottomLeft: { ...base, x: -dist, y: dist, rotate: 1.2 },
//     bottomRight: { ...base, x: dist, y: dist, rotate: -1.2 },
//   };

//   return {
//     initial: map[dir] || map.bottom,
//     animate: { ...to, x: 0, y: 0 },
//     exit: { opacity: 0, filter: "blur(10px)", scale: 0.98, y: 12 },
//   };
// }

// function posClass(dir) {
//   switch (dir) {
//     case "top":
//       return "top-16 left-1/2 -translate-x-1/2";
//     case "bottom":
//       return "bottom-20 left-1/2 -translate-x-1/2";
//     case "left":
//       return "left-3 top-1/2 -translate-y-1/2";
//     case "right":
//       return "right-3 top-1/2 -translate-y-1/2";
//     case "topLeft":
//       return "top-16 left-3";
//     case "topRight":
//       return "top-16 right-3";
//     case "bottomLeft":
//       return "bottom-20 left-3";
//     case "bottomRight":
//       return "bottom-20 right-3";
//     default:
//       return "bottom-20 left-1/2 -translate-x-1/2";
//   }
// }

// export default function AISuggestions({ enabled = true, showMs = SHOW_MS }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [open, setOpen] = useState(false);
//   const [dir, setDir] = useState("bottom");
//   const [item, setItem] = useState(null);

//   const pool = useMemo(() => aiSuggestions || [], []);

//   const hideRef = useRef(null);
//   const nextRef = useRef(null);
//   const cooldownRef = useRef(false);

//   // ✅ UX guards
//   const lastShownAt = useRef(0);
//   const lastClosedAt = useRef(0);
//   const lastActionAt = useRef(0);

//   const clearHide = () => {
//     if (hideRef.current) clearTimeout(hideRef.current);
//     hideRef.current = null;
//   };

//   const clearNext = () => {
//     if (nextRef.current) clearTimeout(nextRef.current);
//     nextRef.current = null;
//   };

//   const scheduleHide = () => {
//     clearHide();
//     hideRef.current = setTimeout(() => {
//       setOpen(false);
//       lastClosedAt.current = Date.now(); // auto-close counts as close
//       scheduleNext(MIN_GAP_AFTER_CLOSE + Math.floor(Math.random() * 1200));
//     }, showMs);
//   };

//   const scheduleNext = (ms) => {
//     clearNext();
//     if (!enabled) return;
//     nextRef.current = setTimeout(() => {
//       if (!open) showOne();
//     }, ms);
//   };

//   const showOne = () => {
//     if (!enabled) return;
//     if (!pool.length) return;
//     if (cooldownRef.current) return;
//     if (typeof window === "undefined") return;

//     // don't annoy while typing
//     if (isTypingNow()) return;

//     const now = Date.now();

//     // ✅ hard guards (anti-spam)
//     if (open) return;
//     if (now - lastClosedAt.current < MIN_GAP_AFTER_CLOSE) return;
//     if (now - lastActionAt.current < MIN_GAP_AFTER_ACTION) return;
//     if (now - lastShownAt.current < MIN_GAP_BETWEEN_SHOWS) return;

//     const reduce = window.matchMedia?.(
//       "(prefers-reduced-motion: reduce)"
//     )?.matches;

//     const nextDir = pickDirectionMobileFirst();
//     const next = pickNextSuggestion(pool);

//     setItem(next);
//     setDir(nextDir);
//     setOpen(true);

//     lastShownAt.current = now;

//     // subtle haptic (mobile)
//     if (navigator?.vibrate) navigator.vibrate(6);

//     if (!reduce) scheduleHide();
//     else {
//       clearHide();
//       hideRef.current = setTimeout(() => {
//         setOpen(false);
//         lastClosedAt.current = Date.now();
//         scheduleNext(MIN_GAP_AFTER_CLOSE + 800);
//       }, 2200);
//     }
//   };

//   useEffect(() => {
//     if (!enabled) return;
//     if (typeof window === "undefined") return;

//     // ✅ first show after delay
//     const t = setTimeout(() => showOne(), FIRST_SHOW_DELAY);

//     // ✅ next show loop (not interval spam) -> schedule after each close/action
//     scheduleNext(BASE_INTERVAL_MS + Math.floor(Math.random() * JITTER_MS));

//     return () => {
//       clearTimeout(t);
//       clearHide();
//       clearNext();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [enabled, pool.length]);

//   const close = () => {
//     lastClosedAt.current = Date.now();
//     setOpen(false);
//     clearHide();

//     // schedule next (premium gap)
//     scheduleNext(MIN_GAP_AFTER_CLOSE + Math.floor(Math.random() * 1200));
//   };

//   const runAction = () => {
//     if (!item) return;

//     lastActionAt.current = Date.now();

//     cooldownRef.current = true;
//     setTimeout(() => (cooldownRef.current = false), COOLDOWN_AFTER_ACTION);

//     close();

//     if (item.type === "section") {
//       const id = item.target;

//       // if already on home -> scroll event
//       if (pathname === "/" || pathname?.endsWith("/")) {
//         window.dispatchEvent(new CustomEvent(SCROLL_EVENT, { detail: { id } }));
//         try {
//           window.history.replaceState(null, "", `#${id}`);
//         } catch {}
//         return;
//       }

//       router.push(`/#${id}`);
//       return;
//     }

//     if (item.type === "page") {
//       router.push(item.target);
//       return;
//     }
//   };

//   const v = motionVariant(dir);

//   return (
//     <AnimatePresence>
//       {open && item ? (
//         <motion.div
//           key={item.id + dir}
//           className={["fixed z-[999]", posClass(dir)].join(" ")}
//           initial={v.initial}
//           animate={v.animate}
//           exit={v.exit}
//           transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
//         >
//           <div
//             className={[
//               "relative overflow-hidden rounded-3xl",
//               "border border-border/15 bg-background/82 backdrop-blur",
//               "shadow-[0_22px_70px_rgba(0,0,0,0.45)]",
//               "w-[min(92vw,420px)]",
//             ].join(" ")}
//           >
//             <div className="pointer-events-none absolute -inset-24 opacity-60 blur-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
//             <div className="pointer-events-none absolute -left-28 top-0 h-full w-28 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60" />

//             <div className="relative p-4">
//               <div className="flex items-start justify-between gap-3">
//                 <div className="flex items-center gap-2">
//                   <span className="grid h-9 w-9 place-items-center rounded-2xl border border-border/15 bg-foreground/[0.04] text-sm">
//                     {item.icon || "✨"}
//                   </span>
//                   <div className="min-w-0">
//                     <p className="text-sm font-semibold text-foreground truncate">
//                       {item.title}
//                     </p>
//                     <p className="text-xs text-muted/70">AI Suggestion</p>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={close}
//                   className="cursor-pointer rounded-2xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-xs text-foreground/80 hover:bg-foreground/[0.06]"
//                   aria-label="Close suggestion"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <p className="mt-3 text-sm text-foreground/85 leading-relaxed">
//                 {item.desc}
//               </p>

//               <div className="mt-4 flex items-center gap-3">
//                 <button
//                   type="button"
//                   onClick={runAction}
//                   className="cursor-pointer select-none inline-flex flex-1 items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.06] px-4 py-3 text-sm text-foreground/90 hover:bg-foreground/[0.10]"
//                 >
//                   {item.cta || "Open"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     // ✅ Next: close first, then show after safe delay (no spam)
//                     close();
//                     scheduleNext(1200 + Math.floor(Math.random() * 800));
//                   }}
//                   className="cursor-pointer select-none inline-flex items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] px-4 py-3 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
//                 >
//                   Next →
//                 </button>
//               </div>
//             </div>

//             <motion.div
//               aria-hidden
//               className="absolute bottom-0 left-0 h-[2px] w-full bg-foreground/35"
//               initial={{ scaleX: 1 }}
//               animate={{ scaleX: 0 }}
//               transition={{ duration: showMs / 1000, ease: "linear" }}
//               style={{ transformOrigin: "left" }}
//             />
//           </div>
//         </motion.div>
//       ) : null}
//     </AnimatePresence>
//   );
// }
// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { usePathname, useRouter } from "next/navigation";
// import { aiSuggestions } from "@/data/aiSuggestions";

// const SCROLL_EVENT = "mukul:scrollTo";
// const STORAGE_KEY = "mukul_ai_seen_v1";

// // ✅ Premium timings (mobile-first, non-spammy)
// const BASE_INTERVAL_MS = 9000; // avg 9s
// const JITTER_MS = 2500; // random extra 0-2.5s
// const SHOW_MS = 5200; // visible time
// const FIRST_SHOW_DELAY = 5500; // first show after 5.5s

// const MIN_GAP_AFTER_CLOSE = 8500; // close ke baad min gap
// const MIN_GAP_AFTER_ACTION = 15000; // CTA click ke baad min gap
// const MIN_GAP_BETWEEN_SHOWS = 7000; // safety net

// const COOLDOWN_AFTER_ACTION = 1200; // micro cooldown

// const DIRECTIONS = [
//   "left",
//   "right",
//   "top",
//   "bottom",
//   "topLeft",
//   "topRight",
//   "bottomLeft",
//   "bottomRight",
// ];

// function isTypingNow() {
//   if (typeof document === "undefined") return false;
//   const el = document.activeElement;
//   if (!el) return false;
//   const tag = el.tagName?.toLowerCase();
//   return tag === "input" || tag === "textarea" || el.isContentEditable;
// }

// function getSeenSet() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     const arr = raw ? JSON.parse(raw) : [];
//     return new Set(Array.isArray(arr) ? arr : []);
//   } catch {
//     return new Set();
//   }
// }

// function saveSeenSet(set) {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
//   } catch {}
// }

// function pickNextSuggestion(pool) {
//   const seen = getSeenSet();
//   const unseen = pool.filter((s) => !seen.has(s.id));
//   const list = unseen.length ? unseen : pool;
//   const next = list[Math.floor(Math.random() * list.length)];

//   seen.add(next.id);

//   if (!unseen.length) {
//     saveSeenSet(new Set([next.id]));
//   } else {
//     saveSeenSet(seen);
//   }
//   return next;
// }

// function pickDirectionMobileFirst() {
//   return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
// }

// function motionVariant(dir) {
//   const base = { opacity: 0, filter: "blur(12px)", scale: 0.98, rotate: 0 };
//   const to = { opacity: 1, filter: "blur(0px)", scale: 1, rotate: 0 };
//   const dist = 70;

//   const map = {
//     left: { ...base, x: -dist, y: 0 },
//     right: { ...base, x: dist, y: 0 },
//     top: { ...base, x: 0, y: -dist },
//     bottom: { ...base, x: 0, y: dist },
//     topLeft: { ...base, x: -dist, y: -dist, rotate: -1.2 },
//     topRight: { ...base, x: dist, y: -dist, rotate: 1.2 },
//     bottomLeft: { ...base, x: -dist, y: dist, rotate: 1.2 },
//     bottomRight: { ...base, x: dist, y: dist, rotate: -1.2 },
//   };

//   return {
//     initial: map[dir] || map.bottom,
//     animate: { ...to, x: 0, y: 0 },
//     exit: { opacity: 0, filter: "blur(10px)", scale: 0.98, y: 12 },
//   };
// }

// function posClass(dir) {
//   switch (dir) {
//     case "top":
//       return "top-16 left-1/2 -translate-x-1/2";
//     case "bottom":
//       return "bottom-20 left-1/2 -translate-x-1/2";
//     case "left":
//       return "left-3 top-1/2 -translate-y-1/2";
//     case "right":
//       return "right-3 top-1/2 -translate-y-1/2";
//     case "topLeft":
//       return "top-16 left-3";
//     case "topRight":
//       return "top-16 right-3";
//     case "bottomLeft":
//       return "bottom-20 left-3";
//     case "bottomRight":
//       return "bottom-20 right-3";
//     default:
//       return "bottom-20 left-1/2 -translate-x-1/2";
//   }
// }

// export default function AISuggestions({ enabled = true, showMs = SHOW_MS }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [open, setOpen] = useState(false);
//   const [dir, setDir] = useState("bottom");
//   const [item, setItem] = useState(null);

//   const pool = useMemo(() => aiSuggestions || [], []);

//   const hideRef = useRef(null);
//   const nextRef = useRef(null);
//   const cooldownRef = useRef(false);

//   // ✅ UX guards
//   const lastShownAt = useRef(0);
//   const lastClosedAt = useRef(0);
//   const lastActionAt = useRef(0);

//   const clearHide = () => {
//     if (hideRef.current) clearTimeout(hideRef.current);
//     hideRef.current = null;
//   };

//   const clearNext = () => {
//     if (nextRef.current) clearTimeout(nextRef.current);
//     nextRef.current = null;
//   };

//   const scheduleNext = (ms) => {
//     clearNext();
//     if (!enabled) return;
//     nextRef.current = setTimeout(() => {
//       if (!open) showOne();
//     }, ms);
//   };

//   const scheduleHide = () => {
//     clearHide();
//     hideRef.current = setTimeout(() => {
//       setOpen(false);
//       lastClosedAt.current = Date.now();
//       scheduleNext(MIN_GAP_AFTER_CLOSE + Math.floor(Math.random() * 1200));
//     }, showMs);
//   };

//   const showOne = () => {
//     if (!enabled) return;
//     if (!pool.length) return;
//     if (cooldownRef.current) return;
//     if (typeof window === "undefined") return;

//     if (isTypingNow()) return;

//     const now = Date.now();

//     if (open) return;
//     if (now - lastClosedAt.current < MIN_GAP_AFTER_CLOSE) return;
//     if (now - lastActionAt.current < MIN_GAP_AFTER_ACTION) return;
//     if (now - lastShownAt.current < MIN_GAP_BETWEEN_SHOWS) return;

//     const reduce = window.matchMedia?.(
//       "(prefers-reduced-motion: reduce)"
//     )?.matches;

//     const nextDir = pickDirectionMobileFirst();
//     const next = pickNextSuggestion(pool);

//     setItem(next);
//     setDir(nextDir);
//     setOpen(true);

//     lastShownAt.current = now;

//     if (navigator?.vibrate) navigator.vibrate(6);

//     if (!reduce) scheduleHide();
//     else {
//       clearHide();
//       hideRef.current = setTimeout(() => {
//         setOpen(false);
//         lastClosedAt.current = Date.now();
//         scheduleNext(MIN_GAP_AFTER_CLOSE + 800);
//       }, 2200);
//     }
//   };

//   useEffect(() => {
//     if (!enabled) return;
//     if (typeof window === "undefined") return;

//     const t = setTimeout(() => showOne(), FIRST_SHOW_DELAY);
//     scheduleNext(BASE_INTERVAL_MS + Math.floor(Math.random() * JITTER_MS));

//     return () => {
//       clearTimeout(t);
//       clearHide();
//       clearNext();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [enabled, pool.length]);

//   const close = () => {
//     lastClosedAt.current = Date.now();
//     setOpen(false);
//     clearHide();
//     scheduleNext(MIN_GAP_AFTER_CLOSE + Math.floor(Math.random() * 1200));
//   };

//   // ✅ ESC close support
//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e) => {
//       if (e.key === "Escape") close();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open]);

//   const runAction = () => {
//     if (!item) return;

//     lastActionAt.current = Date.now();

//     cooldownRef.current = true;
//     setTimeout(() => (cooldownRef.current = false), COOLDOWN_AFTER_ACTION);

//     close();

//     if (item.type === "section") {
//       const id = item.target;

//       if (pathname === "/" || pathname?.endsWith("/")) {
//         window.dispatchEvent(new CustomEvent(SCROLL_EVENT, { detail: { id } }));
//         try {
//           window.history.replaceState(null, "", `#${id}`);
//         } catch {}
//         return;
//       }

//       router.push(`/#${id}`);
//       return;
//     }

//     if (item.type === "page") {
//       router.push(item.target);
//       return;
//     }
//   };

//   const v = motionVariant(dir);

//   return (
//     <AnimatePresence>
//       {open && item ? (
//         <>
//           {/* ✅ OVERLAY DIM LAYER (royal focus) */}
//           <motion.div
//             className="fixed inset-0 z-[998]"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.18, ease: "easeOut" }}
//             onClick={close}
//           >
//             <div className="absolute inset-0 bg-black/70" />
//             {/* subtle premium glow center */}
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
//           </motion.div>

//           {/* ✅ SUGGESTION CARD */}
//           <motion.div
//             key={item.id + dir}
//             className={["fixed z-[999]", posClass(dir)].join(" ")}
//             initial={v.initial}
//             animate={v.animate}
//             exit={v.exit}
//             transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
//           >
//             <div
//               className={[
//                 "relative overflow-hidden rounded-3xl",
//                 // ✅ darker premium glass
//                 "border border-white/10 bg-black/85 backdrop-blur-xl",
//                 "shadow-[0_28px_90px_rgba(0,0,0,0.75)]",
//                 "w-[min(92vw,420px)]",
//               ].join(" ")}
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* premium glow layers */}
//               <div className="pointer-events-none absolute -inset-24 opacity-70 blur-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_55%)]" />
//               <div className="pointer-events-none absolute -left-28 top-0 h-full w-28 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-70" />

//               <div className="relative p-4">
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="flex items-center gap-2">
//                     <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-sm text-white/90">
//                       {item.icon || "✨"}
//                     </span>

//                     <div className="min-w-0">
//                       <p className="text-sm font-semibold text-white truncate">
//                         {item.title}
//                       </p>
//                       <p className="text-xs text-white/55">AI Suggestion</p>
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={close}
//                     className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/75 hover:bg-white/[0.08]"
//                     aria-label="Close suggestion"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 <p className="mt-3 text-sm text-white/85 leading-relaxed">
//                   {item.desc}
//                 </p>

//                 <div className="mt-4 flex items-center gap-3">
//                   <button
//                     type="button"
//                     onClick={runAction}
//                     className="cursor-pointer select-none inline-flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm text-white/90 hover:bg-white/[0.12]"
//                   >
//                     {item.cta || "Open"}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       close();
//                       scheduleNext(1200 + Math.floor(Math.random() * 800));
//                     }}
//                     className="cursor-pointer select-none inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/80 hover:bg-white/[0.08]"
//                   >
//                     Next →
//                   </button>
//                 </div>
//               </div>

//               {/* progress bar */}
//               <motion.div
//                 aria-hidden
//                 className="absolute bottom-0 left-0 h-[2px] w-full bg-white/25"
//                 initial={{ scaleX: 1 }}
//                 animate={{ scaleX: 0 }}
//                 transition={{ duration: showMs / 1000, ease: "linear" }}
//                 style={{ transformOrigin: "left" }}
//               />
//             </div>
//           </motion.div>
//         </>
//       ) : null}
//     </AnimatePresence>
//   );
// }

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { usePathname, useRouter } from "next/navigation";
// import { aiSuggestions } from "@/data/aiSuggestions";

// // ✅ GLOBAL ONE-AT-A-TIME LOCK
// import {
//   acquireLock,
//   releaseLock,
//   isLocked,
// } from "@/components/ai/suggestionLock";

// const SCROLL_EVENT = "mukul:scrollTo";
// const STORAGE_KEY = "mukul_ai_seen_v1";

// const LOCK_OWNER = "ai-floating";

// // ✅ Premium timings (mobile-first, non-spammy)
// const BASE_INTERVAL_MS = 9000; // avg 9s
// const JITTER_MS = 2500; // random extra 0-2.5s
// const SHOW_MS = 5200; // visible time
// const FIRST_SHOW_DELAY = 5500; // first show after 5.5s

// const MIN_GAP_AFTER_CLOSE = 8500; // close ke baad min gap
// const MIN_GAP_AFTER_ACTION = 15000; // CTA click ke baad min gap
// const MIN_GAP_BETWEEN_SHOWS = 7000; // safety net

// const COOLDOWN_AFTER_ACTION = 1200; // micro cooldown

// const DIRECTIONS = [
//   "left",
//   "right",
//   "top",
//   "bottom",
//   "topLeft",
//   "topRight",
//   "bottomLeft",
//   "bottomRight",
// ];

// function isTypingNow() {
//   if (typeof document === "undefined") return false;
//   const el = document.activeElement;
//   if (!el) return false;
//   const tag = el.tagName?.toLowerCase();
//   return tag === "input" || tag === "textarea" || el.isContentEditable;
// }

// function getSeenSet() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     const arr = raw ? JSON.parse(raw) : [];
//     return new Set(Array.isArray(arr) ? arr : []);
//   } catch {
//     return new Set();
//   }
// }

// function saveSeenSet(set) {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
//   } catch {}
// }

// function pickNextSuggestion(pool) {
//   const seen = getSeenSet();
//   const unseen = pool.filter((s) => !seen.has(s.id));
//   const list = unseen.length ? unseen : pool;
//   const next = list[Math.floor(Math.random() * list.length)];

//   seen.add(next.id);

//   if (!unseen.length) {
//     saveSeenSet(new Set([next.id]));
//   } else {
//     saveSeenSet(seen);
//   }
//   return next;
// }

// function pickDirectionMobileFirst() {
//   return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
// }

// function motionVariant(dir) {
//   const base = { opacity: 0, filter: "blur(12px)", scale: 0.98, rotate: 0 };
//   const to = { opacity: 1, filter: "blur(0px)", scale: 1, rotate: 0 };
//   const dist = 70;

//   const map = {
//     left: { ...base, x: -dist, y: 0 },
//     right: { ...base, x: dist, y: 0 },
//     top: { ...base, x: 0, y: -dist },
//     bottom: { ...base, x: 0, y: dist },
//     topLeft: { ...base, x: -dist, y: -dist, rotate: -1.2 },
//     topRight: { ...base, x: dist, y: -dist, rotate: 1.2 },
//     bottomLeft: { ...base, x: -dist, y: dist, rotate: 1.2 },
//     bottomRight: { ...base, x: dist, y: dist, rotate: -1.2 },
//   };

//   return {
//     initial: map[dir] || map.bottom,
//     animate: { ...to, x: 0, y: 0 },
//     exit: { opacity: 0, filter: "blur(10px)", scale: 0.98, y: 12 },
//   };
// }

// function posClass(dir) {
//   switch (dir) {
//     case "top":
//       return "top-16 left-1/2 -translate-x-1/2";
//     case "bottom":
//       return "bottom-20 left-1/2 -translate-x-1/2";
//     case "left":
//       return "left-3 top-1/2 -translate-y-1/2";
//     case "right":
//       return "right-3 top-1/2 -translate-y-1/2";
//     case "topLeft":
//       return "top-16 left-3";
//     case "topRight":
//       return "top-16 right-3";
//     case "bottomLeft":
//       return "bottom-20 left-3";
//     case "bottomRight":
//       return "bottom-20 right-3";
//     default:
//       return "bottom-20 left-1/2 -translate-x-1/2";
//   }
// }

// export default function AISuggestions({ enabled = true, showMs = SHOW_MS }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [open, setOpen] = useState(false);
//   const [dir, setDir] = useState("bottom");
//   const [item, setItem] = useState(null);

//   const pool = useMemo(() => aiSuggestions || [], []);

//   const hideRef = useRef(null);
//   const nextRef = useRef(null);
//   const cooldownRef = useRef(false);

//   // ✅ UX guards
//   const lastShownAt = useRef(0);
//   const lastClosedAt = useRef(0);
//   const lastActionAt = useRef(0);

//   const clearHide = () => {
//     if (hideRef.current) clearTimeout(hideRef.current);
//     hideRef.current = null;
//   };

//   const clearNext = () => {
//     if (nextRef.current) clearTimeout(nextRef.current);
//     nextRef.current = null;
//   };

//   const scheduleNext = (ms) => {
//     clearNext();
//     if (!enabled) return;
//     nextRef.current = setTimeout(() => {
//       if (!open) showOne();
//     }, ms);
//   };

//   const scheduleHide = () => {
//     clearHide();
//     hideRef.current = setTimeout(() => {
//       setOpen(false);
//       lastClosedAt.current = Date.now();

//       // ✅ release lock on auto-close
//       releaseLock(LOCK_OWNER);

//       scheduleNext(MIN_GAP_AFTER_CLOSE + Math.floor(Math.random() * 1200));
//     }, showMs);
//   };

//   const showOne = () => {
//     if (!enabled) return;
//     if (!pool.length) return;
//     if (cooldownRef.current) return;
//     if (typeof window === "undefined") return;

//     if (isTypingNow()) return;

//     // ✅ IMPORTANT: if ANY suggestion is already open (top/floating), do nothing
//     if (isLocked()) return;

//     const now = Date.now();

//     if (open) return;
//     if (now - lastClosedAt.current < MIN_GAP_AFTER_CLOSE) return;
//     if (now - lastActionAt.current < MIN_GAP_AFTER_ACTION) return;
//     if (now - lastShownAt.current < MIN_GAP_BETWEEN_SHOWS) return;

//     // ✅ Acquire global lock BEFORE opening
//     const ok = acquireLock(LOCK_OWNER);
//     if (!ok) return;

//     const reduce = window.matchMedia?.(
//       "(prefers-reduced-motion: reduce)"
//     )?.matches;

//     const nextDir = pickDirectionMobileFirst();
//     const next = pickNextSuggestion(pool);

//     setItem(next);
//     setDir(nextDir);
//     setOpen(true);

//     lastShownAt.current = now;

//     if (navigator?.vibrate) navigator.vibrate(6);

//     if (!reduce) scheduleHide();
//     else {
//       clearHide();
//       hideRef.current = setTimeout(() => {
//         setOpen(false);
//         lastClosedAt.current = Date.now();

//         // ✅ release lock on reduce-motion auto-close
//         releaseLock(LOCK_OWNER);

//         scheduleNext(MIN_GAP_AFTER_CLOSE + 800);
//       }, 2200);
//     }
//   };

//   useEffect(() => {
//     if (!enabled) return;
//     if (typeof window === "undefined") return;

//     const t = setTimeout(() => showOne(), FIRST_SHOW_DELAY);
//     scheduleNext(BASE_INTERVAL_MS + Math.floor(Math.random() * JITTER_MS));

//     return () => {
//       clearTimeout(t);
//       clearHide();
//       clearNext();

//       // ✅ safety release on unmount
//       releaseLock(LOCK_OWNER);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [enabled, pool.length]);

//   const close = () => {
//     lastClosedAt.current = Date.now();
//     setOpen(false);
//     clearHide();

//     // ✅ release global lock on manual close
//     releaseLock(LOCK_OWNER);

//     scheduleNext(MIN_GAP_AFTER_CLOSE + Math.floor(Math.random() * 1200));
//   };

//   // ✅ ESC close support
//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e) => {
//       if (e.key === "Escape") close();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open]);

//   const runAction = () => {
//     if (!item) return;

//     lastActionAt.current = Date.now();

//     cooldownRef.current = true;
//     setTimeout(() => (cooldownRef.current = false), COOLDOWN_AFTER_ACTION);

//     close();

//     if (item.type === "section") {
//       const id = item.target;

//       if (pathname === "/" || pathname?.endsWith("/")) {
//         window.dispatchEvent(new CustomEvent(SCROLL_EVENT, { detail: { id } }));
//         try {
//           window.history.replaceState(null, "", `#${id}`);
//         } catch {}
//         return;
//       }

//       router.push(`/#${id}`);
//       return;
//     }

//     if (item.type === "page") {
//       router.push(item.target);
//       return;
//     }
//   };

//   const v = motionVariant(dir);

//   return (
//     <AnimatePresence>
//       {open && item ? (
//         <>
//           {/* ✅ OVERLAY DIM LAYER (royal focus) */}
//           <motion.div
//             className="fixed inset-0 z-[998]"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.18, ease: "easeOut" }}
//             onClick={close}
//           >
//             <div className="absolute inset-0 bg-black/75" />
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
//           </motion.div>

//           {/* ✅ SUGGESTION CARD */}
//           <motion.div
//             key={item.id + dir}
//             className={["fixed z-[999]", posClass(dir)].join(" ")}
//             initial={v.initial}
//             animate={v.animate}
//             exit={v.exit}
//             transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
//           >
//             <div
//               className={[
//                 "relative overflow-hidden rounded-3xl",
//                 "border border-white/10 bg-black/88 backdrop-blur-xl",
//                 "shadow-[0_28px_90px_rgba(0,0,0,0.80)]",
//                 "w-[min(92vw,420px)]",
//               ].join(" ")}
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* premium glow layers */}
//               <div className="pointer-events-none absolute -inset-24 opacity-70 blur-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_55%)]" />
//               <div className="pointer-events-none absolute -left-28 top-0 h-full w-28 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-70" />

//               <div className="relative p-4">
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="flex items-center gap-2">
//                     <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-sm text-white/90">
//                       {item.icon || "✨"}
//                     </span>

//                     <div className="min-w-0">
//                       <p className="text-sm font-semibold text-white truncate">
//                         {item.title}
//                       </p>
//                       <p className="text-xs text-white/55">AI Suggestion</p>
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={close}
//                     className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/75 hover:bg-white/[0.08]"
//                     aria-label="Close suggestion"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 <p className="mt-3 text-sm text-white/85 leading-relaxed">
//                   {item.desc}
//                 </p>

//                 <div className="mt-4 flex items-center gap-3">
//                   <button
//                     type="button"
//                     onClick={runAction}
//                     className="cursor-pointer select-none inline-flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm text-white/90 hover:bg-white/[0.12]"
//                   >
//                     {item.cta || "Open"}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       close();
//                       scheduleNext(1200 + Math.floor(Math.random() * 800));
//                     }}
//                     className="cursor-pointer select-none inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/80 hover:bg-white/[0.08]"
//                   >
//                     Next →
//                   </button>
//                 </div>
//               </div>

//               {/* progress bar */}
//               <motion.div
//                 aria-hidden
//                 className="absolute bottom-0 left-0 h-[2px] w-full bg-white/25"
//                 initial={{ scaleX: 1 }}
//                 animate={{ scaleX: 0 }}
//                 transition={{ duration: showMs / 1000, ease: "linear" }}
//                 style={{ transformOrigin: "left" }}
//               />
//             </div>
//           </motion.div>
//         </>
//       ) : null}
//     </AnimatePresence>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { aiSuggestions } from "@/data/aiSuggestions";

// ✅ GLOBAL ONE-AT-A-TIME LOCK
import {
  acquireLock,
  releaseLock,
  isLocked,
} from "@/components/ai/suggestionLock";

const SCROLL_EVENT = "mukul:scrollTo";
const STORAGE_KEY = "mukul_ai_seen_v1";

// ✅ Premium timings (mobile-first, non-spammy)
const BASE_INTERVAL_MS = 9000;
const JITTER_MS = 2500;
const SHOW_MS = 5200;
const FIRST_SHOW_DELAY = 5500;

const MIN_GAP_AFTER_CLOSE = 8500;
const MIN_GAP_AFTER_ACTION = 15000;
const MIN_GAP_BETWEEN_SHOWS = 7000;

const COOLDOWN_AFTER_ACTION = 1200;

const DIRECTIONS = [
  "left",
  "right",
  "top",
  "bottom",
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight",
];

function isTypingNow() {
  if (typeof document === "undefined") return false;
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
}

function getSeenSet() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveSeenSet(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

function pickNextSuggestion(pool) {
  const seen = getSeenSet();
  const unseen = pool.filter((s) => !seen.has(s.id));
  const list = unseen.length ? unseen : pool;
  const next = list[Math.floor(Math.random() * list.length)];

  seen.add(next.id);
  if (!unseen.length) saveSeenSet(new Set([next.id]));
  else saveSeenSet(seen);

  return next;
}

function pickDirectionMobileFirst() {
  return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
}

function motionVariant(dir) {
  const base = { opacity: 0, filter: "blur(12px)", scale: 0.98, rotate: 0 };
  const to = { opacity: 1, filter: "blur(0px)", scale: 1, rotate: 0 };
  const dist = 70;

  const map = {
    left: { ...base, x: -dist, y: 0 },
    right: { ...base, x: dist, y: 0 },
    top: { ...base, x: 0, y: -dist },
    bottom: { ...base, x: 0, y: dist },
    topLeft: { ...base, x: -dist, y: -dist, rotate: -1.2 },
    topRight: { ...base, x: dist, y: -dist, rotate: 1.2 },
    bottomLeft: { ...base, x: -dist, y: dist, rotate: 1.2 },
    bottomRight: { ...base, x: dist, y: dist, rotate: -1.2 },
  };

  return {
    initial: map[dir] || map.bottom,
    animate: { ...to, x: 0, y: 0 },
    exit: { opacity: 0, filter: "blur(10px)", scale: 0.98, y: 12 },
  };
}

function posClass(dir) {
  switch (dir) {
    case "top":
      return "top-16 left-1/2 -translate-x-1/2";
    case "bottom":
      return "bottom-20 left-1/2 -translate-x-1/2";
    case "left":
      return "left-3 top-1/2 -translate-y-1/2";
    case "right":
      return "right-3 top-1/2 -translate-y-1/2";
    case "topLeft":
      return "top-16 left-3";
    case "topRight":
      return "top-16 right-3";
    case "bottomLeft":
      return "bottom-20 left-3";
    case "bottomRight":
      return "bottom-20 right-3";
    default:
      return "bottom-20 left-1/2 -translate-x-1/2";
  }
}

export default function AISuggestions({ enabled = true, showMs = SHOW_MS }) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [dir, setDir] = useState("bottom");
  const [item, setItem] = useState(null);

  const pool = useMemo(() => aiSuggestions || [], []);

  const hideRef = useRef(null);
  const nextRef = useRef(null);
  const cooldownRef = useRef(false);

  // ✅ UX guards
  const lastShownAt = useRef(0);
  const lastClosedAt = useRef(0);
  const lastActionAt = useRef(0);

  // ✅ lock owner
  const OWNER = "floating-ai";

  const clearHide = () => {
    if (hideRef.current) clearTimeout(hideRef.current);
    hideRef.current = null;
  };

  const clearNext = () => {
    if (nextRef.current) clearTimeout(nextRef.current);
    nextRef.current = null;
  };

  const scheduleNext = (ms) => {
    clearNext();
    if (!enabled) return;
    nextRef.current = setTimeout(() => {
      if (!open) showOne();
    }, ms);
  };

  const scheduleHide = () => {
    clearHide();
    hideRef.current = setTimeout(() => {
      // auto close
      setOpen(false);
      releaseLock(OWNER);
      lastClosedAt.current = Date.now();
      scheduleNext(MIN_GAP_AFTER_CLOSE + Math.floor(Math.random() * 1200));
    }, showMs);
  };

  const showOne = () => {
    if (!enabled) return;
    if (!pool.length) return;
    if (cooldownRef.current) return;
    if (typeof window === "undefined") return;

    if (isTypingNow()) return;

    const now = Date.now();

    // ✅ don't overlap
    if (open) return;
    if (isLocked()) {
      // someone else is showing (top nudge etc.) -> retry later
      scheduleNext(1400 + Math.floor(Math.random() * 900));
      return;
    }

    // ✅ anti-spam guards
    if (now - lastClosedAt.current < MIN_GAP_AFTER_CLOSE) return;
    if (now - lastActionAt.current < MIN_GAP_AFTER_ACTION) return;
    if (now - lastShownAt.current < MIN_GAP_BETWEEN_SHOWS) return;

    // ✅ acquire global lock (TTL a bit more than showMs)
    const got = acquireLock(OWNER, Math.max(showMs + 2500, 9000));
    if (!got) {
      scheduleNext(1400 + Math.floor(Math.random() * 900));
      return;
    }

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

    const nextDir = pickDirectionMobileFirst();
    const next = pickNextSuggestion(pool);

    setItem(next);
    setDir(nextDir);
    setOpen(true);

    lastShownAt.current = now;

    if (navigator?.vibrate) navigator.vibrate(6);

    if (!reduce) scheduleHide();
    else {
      clearHide();
      hideRef.current = setTimeout(() => {
        setOpen(false);
        releaseLock(OWNER);
        lastClosedAt.current = Date.now();
        scheduleNext(MIN_GAP_AFTER_CLOSE + 800);
      }, 2200);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const t = setTimeout(() => showOne(), FIRST_SHOW_DELAY);
    scheduleNext(BASE_INTERVAL_MS + Math.floor(Math.random() * JITTER_MS));

    return () => {
      clearTimeout(t);
      clearHide();
      clearNext();
      releaseLock(OWNER);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, pool.length]);

  const close = () => {
    lastClosedAt.current = Date.now();
    setOpen(false);
    clearHide();
    releaseLock(OWNER);
    scheduleNext(MIN_GAP_AFTER_CLOSE + Math.floor(Math.random() * 1200));
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const runAction = () => {
    if (!item) return;

    lastActionAt.current = Date.now();

    cooldownRef.current = true;
    setTimeout(() => (cooldownRef.current = false), COOLDOWN_AFTER_ACTION);

    close();

    if (item.type === "section") {
      const id = item.target;

      if (pathname === "/" || pathname?.endsWith("/")) {
        window.dispatchEvent(new CustomEvent(SCROLL_EVENT, { detail: { id } }));
        try {
          window.history.replaceState(null, "", `#${id}`);
        } catch {}
        return;
      }

      router.push(`/#${id}`);
      return;
    }

    if (item.type === "page") {
      router.push(item.target);
      return;
    }
  };

  const v = motionVariant(dir);

  return (
    <AnimatePresence>
      {open && item ? (
        <>
          {/* ✅ OVERLAY DIM LAYER */}
          <motion.div
            className="fixed inset-0 z-[998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={close}
          >
            <div className="absolute inset-0 bg-black/75" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
          </motion.div>

          {/* ✅ CARD */}
          <motion.div
            key={item.id + dir}
            className={["fixed z-[999]", posClass(dir)].join(" ")}
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className={[
                "relative overflow-hidden rounded-3xl",
                "border border-white/10 bg-black/88 backdrop-blur-xl",
                "shadow-[0_28px_90px_rgba(0,0,0,0.78)]",
                "w-[min(92vw,420px)]",
              ].join(" ")}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-none absolute -inset-24 opacity-70 blur-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_55%)]" />
              <div className="pointer-events-none absolute -left-28 top-0 h-full w-28 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-70" />

              <div className="relative p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-sm text-white/90">
                      {item.icon || "✨"}
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-white/55">AI Suggestion</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={close}
                    className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/75 hover:bg-white/[0.08]"
                    aria-label="Close suggestion"
                  >
                    ✕
                  </button>
                </div>

                <p className="mt-3 text-sm text-white/85 leading-relaxed">
                  {item.desc}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={runAction}
                    className="cursor-pointer select-none inline-flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm text-white/90 hover:bg-white/[0.12]"
                  >
                    {item.cta || "Open"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      close();
                      scheduleNext(1400 + Math.floor(Math.random() * 900));
                    }}
                    className="cursor-pointer select-none inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/80 hover:bg-white/[0.08]"
                  >
                    Next →
                  </button>
                </div>
              </div>

              <motion.div
                aria-hidden
                className="absolute bottom-0 left-0 h-[2px] w-full bg-white/25"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: showMs / 1000, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

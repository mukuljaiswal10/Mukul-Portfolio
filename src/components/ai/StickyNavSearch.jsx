// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { AnimatePresence, motion } from "framer-motion";

// // ✅ Single source of truth
// import {
//   getSearchActions,
//   filterActions,
//   getPopularSearches,
// } from "@/components/ai/searchActions";

// const STORAGE_RECENTS = "mukul_nav_recent_v1";
// const MAX_RECENTS = 6;

// function loadRecents() {
//   try {
//     const raw = localStorage.getItem(STORAGE_RECENTS);
//     const arr = raw ? JSON.parse(raw) : [];
//     return Array.isArray(arr) ? arr : [];
//   } catch {
//     return [];
//   }
// }

// function saveRecents(ids) {
//   try {
//     localStorage.setItem(
//       STORAGE_RECENTS,
//       JSON.stringify(ids.slice(0, MAX_RECENTS))
//     );
//   } catch {}
// }

// function scrollToId(id) {
//   const el = document.getElementById(id);
//   if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
// }

// export default function StickyNavSearch() {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [open, setOpen] = useState(false);
//   const [q, setQ] = useState("");
//   const [active, setActive] = useState(0);
//   const [recents, setRecents] = useState([]);

//   const normalizeKey = (s = "") => s.trim().toLowerCase();

//   const inputRef = useRef(null);

//   const isHome =
//     pathname === "/" || pathname?.includes("/(site)") || pathname === "/home";

//   // ✅ load recents on mount
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     setRecents(loadRecents());
//   }, []);

//   // ✅ lock body scroll when open
//   useEffect(() => {
//     if (typeof document === "undefined") return;
//     if (!open) return;

//     const prevOverflow = document.documentElement.style.overflow;
//     const prevBodyOverflow = document.body.style.overflow;

//     document.documentElement.style.overflow = "hidden";
//     document.body.style.overflow = "hidden";

//     return () => {
//       document.documentElement.style.overflow = prevOverflow;
//       document.body.style.overflow = prevBodyOverflow;
//     };
//   }, [open]);

//   // ✅ actions
//   const actions = useMemo(() => getSearchActions({ pathname }), [pathname]);

//   // ✅ popular chips
//   const popular = useMemo(() => getPopularSearches({ limit: 10 }), []);

//   // ✅ filtered list
//   const filtered = useMemo(() => {
//     const s = q.trim();
//     const base = s ? filterActions(actions, s) : actions;
//     return base.slice(0, 14);
//   }, [actions, q]);

//   // ✅ recent actions
//   const recentActions = useMemo(() => {
//     if (!recents?.length) return [];
//     const map = new Map(actions.map((a) => [a.id, a]));
//     return recents.map((id) => map.get(id)).filter(Boolean);
//   }, [recents, actions]);

//   const commitRecent = (actionId) => {
//     setRecents((prev) => {
//       const next = [actionId, ...(prev || []).filter((x) => x !== actionId)];
//       saveRecents(next);
//       return next;
//     });
//   };

//   const runItem = (item) => {
//     if (!item) return;

//     commitRecent(item.id);

//     setOpen(false);
//     setQ("");
//     setActive(0);

//     const kind = item.kind || item.type;

//     if (kind === "section") {
//       const id = item.sectionId || item.target;
//       if (!id) return;

//       if (isHome) {
//         setTimeout(() => scrollToId(id), 40);
//         return;
//       }
//       router.push(`/#${id}`);
//       return;
//     }

//     router.push(item.href || item.target || "/");
//   };

//   // ✅ keyboard
//   useEffect(() => {
//     const onKey = (e) => {
//       const isK = e.key?.toLowerCase() === "k";
//       const mod = e.metaKey || e.ctrlKey;

//       if (mod && isK) {
//         e.preventDefault();
//         setOpen((v) => !v);
//         return;
//       }

//       if (!open) return;

//       if (e.key === "Escape") setOpen(false);

//       const list = q.trim()
//         ? filtered
//         : recentActions.length
//         ? recentActions
//         : filtered;

//       if (e.key === "ArrowDown")
//         setActive((x) => Math.min(x + 1, Math.max(list.length - 1, 0)));
//       if (e.key === "ArrowUp") setActive((x) => Math.max(x - 1, 0));

//       if (e.key === "Enter") {
//         const item = list[active];
//         if (!item) return;
//         e.preventDefault();
//         runItem(item);
//       }
//     };

//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [open, filtered, active, q, recentActions]); // eslint-disable-line react-hooks/exhaustive-deps

//   // ✅ focus on open
//   useEffect(() => {
//     if (!open) return;
//     setTimeout(() => inputRef.current?.focus(), 60);
//   }, [open]);

//   const clearSearch = () => {
//     setQ("");
//     setActive(0);
//     setTimeout(() => inputRef.current?.focus(), 30);
//   };

//   // ✅ list used in UI
//   const list = q.trim()
//     ? filtered
//     : recentActions.length
//     ? recentActions
//     : filtered;

//   return (
//     <>
//       {/* ✅ Fixed pill */}
//       <div
//         className={[
//           "fixed z-[92]",
//           "sm:top-[calc(env(safe-area-inset-top)+92px)] sm:right-6",
//           "bottom-[calc(env(safe-area-inset-bottom)+180px)] right-4 sm:bottom-auto",
//         ].join(" ")}
//       >
//         {/* ✅ Pill (NOW: click/tap only; hover removed) */}
//         <button
//           type="button"
//           onClick={() => setOpen(true)}
//           className={[
//             "group relative overflow-hidden rounded-3xl border",
//             "border-white/10 bg-black/70 backdrop-blur-xl",
//             "shadow-[0_18px_55px_rgba(0,0,0,0.55)]",
//             "flex items-center",
//             // ✅ mobile compact
//             "gap-2 px-2.5 py-2",
//             // ✅ desktop roomy
//             "sm:gap-3 sm:px-4 sm:py-3",
//             // ✅ premium interaction
//             "transition active:scale-[0.98]",
//           ].join(" ")}
//           aria-label="Open quick navigate search"
//         >
//           {/* sweep */}
//           <span className="pointer-events-none absolute -left-28 top-0 h-full w-28 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60 translate-x-0 group-hover:translate-x-[520px] transition duration-700" />

//           {/* sparkle icon */}
//           <span className="relative grid h-8 w-8 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] sm:h-9 sm:w-9">
//             <span className="pointer-events-none absolute inset-[-12px] rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.32),transparent_60%)] blur-xl animate-[goldPulse_1.8s_ease-in-out_infinite]" />
//             <span className="text-[16px] text-[#FFD54A] drop-shadow-[0_0_14px_rgba(255,215,0,0.45)] animate-[sparkleTwinkle_1.35s_ease-in-out_infinite] sm:text-[18px]">
//               ✦
//             </span>
//           </span>

//           {/* text (mobile smaller) */}
//           <span className="text-left leading-tight">
//             <span className="block text-[10px] text-white/65 sm:text-xs">
//               Quick Navigate
//             </span>
//             <span className="block text-[13px] font-semibold text-white sm:text-base">
//               Search
//             </span>
//           </span>

//           {/* badge: mobile Tap, desktop Click */}
//           <span className="ml-1 rounded-2xl border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] text-white/80 sm:px-3 sm:text-[11px]">
//             <span className="sm:hidden">Tap</span>
//             <span className="hidden sm:inline">Click</span>
//           </span>

//           {/* shortcut only on desktop */}
//           <span className="ml-2 hidden sm:inline text-xs text-white/40">
//             ⌘K / Ctrl+K
//           </span>
//         </button>
//       </div>

//       {/* ✅ Panel */}
//       <AnimatePresence>
//         {open ? (
//           <motion.div
//             className="fixed inset-0 z-[95] bg-black/55 backdrop-blur-[2px]"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onMouseDown={() => setOpen(false)}
//           >
//             <motion.div
//               initial={{ opacity: 0, y: 10, scale: 0.985 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: 10, scale: 0.985 }}
//               transition={{ type: "spring", stiffness: 420, damping: 32 }}
//               className={[
//                 "mx-auto mt-[8vh] w-[min(720px,92vw)]",
//                 "rounded-3xl border border-white/10",
//                 "bg-black/85 backdrop-blur-xl",
//                 "shadow-[0_28px_90px_rgba(0,0,0,0.75)]",
//               ].join(" ")}
//               onMouseDown={(e) => e.stopPropagation()}
//             >
//               <div className="p-4 sm:p-5">
//                 <div className="flex items-center justify-between gap-3">
//                   <div>
//                     <p className="text-xs text-white/55">Quick Navigate</p>
//                     <p className="text-base font-semibold text-white">
//                       Search anything…
//                     </p>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => setOpen(false)}
//                     className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/75 hover:bg-white/[0.08]"
//                   >
//                     Esc
//                   </button>
//                 </div>

//                 {/* input */}
//                 <div className="relative mt-4">
//                   <input
//                     ref={inputRef}
//                     value={q}
//                     onChange={(e) => {
//                       setQ(e.target.value);
//                       setActive(0);
//                     }}
//                     placeholder="Search: blog, docker, skills, contact…"
//                     className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 pr-11 text-sm text-white outline-none placeholder:text-white/35 focus:bg-white/[0.07]"
//                   />

//                   {q?.length ? (
//                     <button
//                       type="button"
//                       onClick={clearSearch}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]"
//                       aria-label="Clear search"
//                     >
//                       ✕
//                     </button>
//                   ) : null}
//                 </div>

//                 {/* ✅ Popular chips (only when query empty) */}
//                 {!q.trim() && popular?.length ? (
//                   <div className="mt-3">
//                     <div className="mb-2 flex items-center gap-2 text-xs text-white/55">
//                       <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
//                         <span className="text-[#FFD54A]">✦</span> Popular
//                       </span>
//                       <span className="text-white/40">(auto)</span>
//                     </div>

//                     <div className="flex flex-wrap gap-2">
//                       {popular.map((t) => (
//                         <button
//                           key={t}
//                           type="button"
//                           onClick={() => {
//                             setQ(t);
//                             setActive(0);
//                             setTimeout(() => inputRef.current?.focus(), 30);
//                           }}
//                           className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/75 hover:bg-white/[0.07]"
//                         >
//                           {t}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 ) : null}

//                 {/* results (mobile height reduced) */}
//                 <div className="mt-4 max-h-[42vh] overflow-auto pr-1 overscroll-contain sm:max-h-[50vh]">
//                   {/* recents badge */}
//                   {!q.trim() && recentActions.length ? (
//                     <div className="mb-2 flex items-center gap-2 text-xs text-white/55">
//                       <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
//                         <span className="text-[#FFD54A]">✦</span> Recent
//                       </span>
//                       <span className="text-white/40">(auto)</span>
//                     </div>
//                   ) : null}

//                   <div className="space-y-2">
//                     {list.map((a, idx) => (
//                       <button
//                         key={a.id}
//                         onMouseEnter={() => setActive(idx)}
//                         onClick={() => runItem(a)}
//                         className={[
//                           "w-full rounded-2xl border px-4 py-3 text-left transition",
//                           idx === active
//                             ? "border-[#FFD54A]/35 bg-white/[0.08]"
//                             : "border-white/10 bg-transparent hover:bg-white/[0.05]",
//                         ].join(" ")}
//                       >
//                         <div className="flex items-center justify-between gap-3">
//                           <div className="min-w-0">
//                             <p className="truncate text-sm font-medium text-white">
//                               {a.label}
//                             </p>
//                             <p className="truncate text-xs text-white/55">
//                               {a.hint}
//                             </p>
//                           </div>

//                           <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70">
//                             Enter
//                           </span>
//                         </div>
//                       </button>
//                     ))}

//                     {!list.length ? (
//                       <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70">
//                         No results. Try: <b>blog</b>, <b>docker</b>,{" "}
//                         <b>skills</b>
//                       </div>
//                     ) : null}
//                   </div>
//                 </div>

//                 <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/45">
//                   <span>↑ ↓ navigate • Enter open • Esc close</span>
//                   <span>⌘K / Ctrl+K</span>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         ) : null}
//       </AnimatePresence>

//       {/* premium animations */}
//       <style jsx global>{`
//         @keyframes goldPulse {
//           0% {
//             transform: scale(0.95);
//             opacity: 0.65;
//           }
//           50% {
//             transform: scale(1.08);
//             opacity: 0.95;
//           }
//           100% {
//             transform: scale(0.95);
//             opacity: 0.65;
//           }
//         }
//         @keyframes sparkleTwinkle {
//           0% {
//             transform: rotate(0deg) scale(0.98);
//             filter: brightness(1);
//           }
//           50% {
//             transform: rotate(6deg) scale(1.08);
//             filter: brightness(1.35);
//           }
//           100% {
//             transform: rotate(0deg) scale(0.98);
//             filter: brightness(1);
//           }
//         }
//       `}</style>
//     </>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// ✅ Single source of truth
import {
  getSearchActions,
  filterActions,
  getPopularSearches,
} from "@/components/ai/searchActions";

const STORAGE_RECENTS = "mukul_nav_recent_v1";
const MAX_RECENTS = 6;

function loadRecents() {
  try {
    const raw = localStorage.getItem(STORAGE_RECENTS);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveRecents(ids) {
  try {
    localStorage.setItem(
      STORAGE_RECENTS,
      JSON.stringify(ids.slice(0, MAX_RECENTS))
    );
  } catch {}
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function StickyNavSearch() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [notFound, setNotFound] = useState(false); // ✅ added
  const [active, setActive] = useState(0);
  const [recents, setRecents] = useState([]);

  const DIRECT_ROUTES = {
    home: "/",
    Home:"/",
    about: "/about",
    About:"/about",
    projects: "/projects",
    project: "/projects",
    Project:"/projects",
    Projects:"/projects",
    blog: "/blog",
    Blog:"/blog",
    BLOG:"/blog",
    service: "/services",
    services: "/services",
    SERVICES:"/services",
    Services:"/services",
    Service:"/services",
    SERVICES:"/services",
    contact: "/contact",
    CONTACT:"/contact",
    Contact:"/contact",
    skills:"/skills",
    SKILLS:"/skills",
    SkILL:"/skills",
    Skills:"/skills",
  };

  const normalizeKey = (s = "") => s.trim().toLowerCase();

  const inputRef = useRef(null);

  const isHome =
    pathname === "/" || pathname?.includes("/(site)") || pathname === "/home";

  // ✅ load recents on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    setRecents(loadRecents());
  }, []);

  // ✅ lock body scroll when open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!open) return;

    const prevOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [open]);

  // ✅ actions
  const actions = useMemo(() => getSearchActions({ pathname }), [pathname]);

  // ✅ popular chips
  const popular = useMemo(() => getPopularSearches({ limit: 10 }), []);

  // ✅ filtered list
  const filtered = useMemo(() => {
    const s = q.trim();
    const base = s ? filterActions(actions, s) : actions;
    return base.slice(0, 14);
  }, [actions, q]);

  // ✅ recent actions
  const recentActions = useMemo(() => {
    if (!recents?.length) return [];
    const map = new Map(actions.map((a) => [a.id, a]));
    return recents.map((id) => map.get(id)).filter(Boolean);
  }, [recents, actions]);

  const commitRecent = (actionId) => {
    setRecents((prev) => {
      const next = [actionId, ...(prev || []).filter((x) => x !== actionId)];
      saveRecents(next);
      return next;
    });
  };

  const runItem = (item) => {
    if (!item) return;

    commitRecent(item.id);

    setOpen(false);
    setQ("");
    setNotFound(false);
    setActive(0);

    const kind = item.kind || item.type;

    if (kind === "section") {
      const id = item.sectionId || item.target;
      if (!id) return;

      if (isHome) {
        setTimeout(() => scrollToId(id), 40);
        return;
      }
      router.push(`/#${id}`);
      return;
    }

    router.push(item.href || item.target || "/");
  };

  // ✅ keyboard
  useEffect(() => {
    const onKey = (e) => {
      const isK = e.key?.toLowerCase() === "k";
      const mod = e.metaKey || e.ctrlKey;

      if (mod && isK) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      if (!open) return;

      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      const list = q.trim()
        ? filtered
        : recentActions.length
        ? recentActions
        : filtered;

      if (e.key === "ArrowDown")
        setActive((x) => Math.min(x + 1, Math.max(list.length - 1, 0)));
      if (e.key === "ArrowUp") setActive((x) => Math.max(x - 1, 0));

      if (e.key === "Enter") {
        // ✅ direct page open only (home/about/projects/blog/services/contact)
        const typed = normalizeKey(q);

        // agar user ne kuch type kiya hai
        if (typed) {
          const route = DIRECT_ROUTES[typed];

          if (route) {
            e.preventDefault();
            setNotFound(false);

            setOpen(false);
            setQ("");
            setActive(0);

            router.push(route);
            return;
          }

          // ❌ page match nahi mila => kuch open nahi hoga
          e.preventDefault();
          setNotFound(true);
          return;
        }

        // ✅ query empty hai => old behavior (suggestions/recents open)
        const item = list[active];
        if (!item) return;
        e.preventDefault();
        runItem(item);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, active, q, recentActions]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ focus on open
  useEffect(() => {
    if (!open) return;
    setNotFound(false);
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  const clearSearch = () => {
    setQ("");
    setNotFound(false);
    setActive(0);
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  // ✅ list used in UI
  const list = q.trim()
    ? filtered
    : recentActions.length
    ? recentActions
    : filtered;

  return (
    <>
      {/* ✅ Fixed pill */}
      <div
        className={[
          "fixed z-[92]",
          "sm:top-[calc(env(safe-area-inset-top)+92px)] sm:right-6",
          "bottom-[calc(env(safe-area-inset-bottom)+180px)] right-4 sm:bottom-auto",
        ].join(" ")}
      >
        {/* ✅ Pill (NOW: click/tap only; hover removed) */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={[
            "group relative overflow-hidden rounded-3xl border",
            "border-white/10 bg-black/70 backdrop-blur-xl",
            "shadow-[0_18px_55px_rgba(0,0,0,0.55)]",
            "flex items-center",
            // ✅ mobile compact
            "gap-2 px-2.5 py-2",
            // ✅ desktop roomy
            "sm:gap-3 sm:px-4 sm:py-3",
            // ✅ premium interaction
            "transition active:scale-[0.98]",
          ].join(" ")}
          aria-label="Open quick navigate search"
        >
          {/* sweep */}
          <span className="pointer-events-none absolute -left-28 top-0 h-full w-28 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60 translate-x-0 group-hover:translate-x-[520px] transition duration-700" />

          {/* sparkle icon */}
          <span className="relative grid h-8 w-8 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] sm:h-9 sm:w-9">
            <span className="pointer-events-none absolute inset-[-12px] rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.32),transparent_60%)] blur-xl animate-[goldPulse_1.8s_ease-in-out_infinite]" />
            <span className="text-[16px] text-[#FFD54A] drop-shadow-[0_0_14px_rgba(255,215,0,0.45)] animate-[sparkleTwinkle_1.35s_ease-in-out_infinite] sm:text-[18px]">
              ✦
            </span>
          </span>

          {/* text (mobile smaller) */}
          <span className="text-left leading-tight">
            <span className="block text-[10px] text-white/65 sm:text-xs">
              Quick Navigate
            </span>
            <span className="block text-[13px] font-semibold text-white sm:text-base">
              Search
            </span>
          </span>

          {/* badge: mobile Tap, desktop Click */}
          <span className="ml-1 rounded-2xl border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] text-white/80 sm:px-3 sm:text-[11px]">
            <span className="sm:hidden">Tap</span>
            <span className="hidden sm:inline">Click</span>
          </span>

          {/* shortcut only on desktop */}
          <span className="ml-2 hidden sm:inline text-xs text-white/40">
            ⌘K / Ctrl+K
          </span>
        </button>
      </div>

      {/* ✅ Panel */}
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[95] bg-black/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.985 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={[
                "mx-auto mt-[8vh] w-[min(720px,92vw)]",
                "rounded-3xl border border-white/10",
                "bg-black/85 backdrop-blur-xl",
                "shadow-[0_28px_90px_rgba(0,0,0,0.75)]",
              ].join(" ")}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/55">Quick Navigate</p>
                    <p className="text-base font-semibold text-white">
                      Search anything…
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/75 hover:bg-white/[0.08]"
                  >
                    Esc
                  </button>
                </div>

                {/* input */}
                <div className="relative mt-4">
                  <input
                    ref={inputRef}
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      setNotFound(false); // ✅ added
                      setActive(0);
                    }}
                    placeholder="Search: blog, docker, skills, contact…"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 pr-11 text-sm text-white outline-none placeholder:text-white/35 focus:bg-white/[0.07]"
                  />

                  {q?.length ? (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  ) : null}
                </div>

                {/* ✅ Not found message (only when user typed something invalid + pressed Enter) */}
                {notFound ? (
                  <p className="mt-2 text-[12px] text-red-300/80">Not found</p>
                ) : null}

                {/* ✅ Popular chips (only when query empty) */}
                {!q.trim() && popular?.length ? (
                  <div className="mt-3">
                    <div className="mb-2 flex items-center gap-2 text-xs text-white/55">
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                        <span className="text-[#FFD54A]">✦</span> Popular
                      </span>
                      <span className="text-white/40">(auto)</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {popular.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setQ(t);
                            setNotFound(false);
                            setActive(0);
                            setTimeout(() => inputRef.current?.focus(), 30);
                          }}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/75 hover:bg-white/[0.07]"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* results (mobile height reduced) */}
                <div className="mt-4 max-h-[42vh] overflow-auto pr-1 overscroll-contain sm:max-h-[50vh]">
                  {/* recents badge */}
                  {!q.trim() && recentActions.length ? (
                    <div className="mb-2 flex items-center gap-2 text-xs text-white/55">
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                        <span className="text-[#FFD54A]">✦</span> Recent
                      </span>
                      <span className="text-white/40">(auto)</span>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    {list.map((a, idx) => (
                      <button
                        key={a.id}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => runItem(a)}
                        className={[
                          "w-full rounded-2xl border px-4 py-3 text-left transition",
                          idx === active
                            ? "border-[#FFD54A]/35 bg-white/[0.08]"
                            : "border-white/10 bg-transparent hover:bg-white/[0.05]",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {a.label}
                            </p>
                            <p className="truncate text-xs text-white/55">
                              {a.hint}
                            </p>
                          </div>

                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70">
                            Enter
                          </span>
                        </div>
                      </button>
                    ))}

                    {!list.length ? (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70">
                        No results. Try: <b>blog</b>, <b>docker</b>,{" "}
                        <b>skills</b>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/45">
                  <span>↑ ↓ navigate • Enter open • Esc close</span>
                  <span>⌘K / Ctrl+K</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* premium animations */}
      <style jsx global>{`
        @keyframes goldPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.95;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.65;
          }
        }
        @keyframes sparkleTwinkle {
          0% {
            transform: rotate(0deg) scale(0.98);
            filter: brightness(1);
          }
          50% {
            transform: rotate(6deg) scale(1.08);
            filter: brightness(1.35);
          }
          100% {
            transform: rotate(0deg) scale(0.98);
            filter: brightness(1);
          }
        }
      `}</style>
    </>
  );
}

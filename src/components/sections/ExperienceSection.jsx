// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { motion } from "framer-motion";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import LuxuryButton from "@/components/ui/LuxuryButton";

// import { experiences } from "@/data/experience";

// /* -------------------- helper hooks -------------------- */
// function useIsHoverable() {
//   const [hoverable, setHoverable] = useState(false);
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
//     const update = () => setHoverable(!!mq.matches);
//     update();
//     mq.addEventListener?.("change", update);
//     return () => mq.removeEventListener?.("change", update);
//   }, []);
//   return hoverable;
// }

// function usePrefersReducedMotion() {
//   const [reduce, setReduce] = useState(false);
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
//     const update = () => setReduce(!!mq.matches);
//     update();
//     mq.addEventListener?.("change", update);
//     return () => mq.removeEventListener?.("change", update);
//   }, []);
//   return reduce;
// }

// function useIsMobile() {
//   const [mobile, setMobile] = useState(false);
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const mq = window.matchMedia("(max-width: 639px)");
//     const update = () => setMobile(!!mq.matches);
//     update();
//     mq.addEventListener?.("change", update);
//     return () => mq.removeEventListener?.("change", update);
//   }, []);
//   return mobile;
// }

// /* -------------------- tiny UI bits -------------------- */
// function Tag({ children }) {
//   return (
//     <span className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1 text-[11px] text-foreground/80 backdrop-blur">
//       {children}
//     </span>
//   );
// }

// function ActiveShimmerBorder({ on }) {
//   if (!on) return null;
//   return (
//     <div className="pointer-events-none absolute inset-0 rounded-3xl">
//       <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[10px]" />
//       <div className="exp-shimmer-border absolute -inset-[1px] rounded-3xl opacity-80" />
//     </div>
//   );
// }

// function SwipeHint({ dir, faded, reduceMotion }) {
//   const arrow = dir === "left" ? "←" : "→";
//   return (
//     <span
//       className={[
//         "inline-flex items-center gap-1 text-xs text-muted/60 select-none",
//         faded ? "opacity-35" : "opacity-100",
//         "transition-opacity duration-300",
//       ].join(" ")}
//     >
//       <span>Swipe</span>
//       <motion.span
//         aria-hidden
//         className="inline-block"
//         animate={
//           reduceMotion || faded
//             ? {}
//             : dir === "right"
//             ? { x: [0, 3, 0] }
//             : { x: [0, -3, 0] }
//         }
//         transition={
//           reduceMotion || faded
//             ? {}
//             : { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
//         }
//       >
//         {arrow}
//       </motion.span>
//     </span>
//   );
// }

// /* -------------------- Card -------------------- */
// function ExperienceCard({
//   item,
//   index,
//   isHoverable,
//   isActive,
//   isMobile,
//   swipeDir,
//   swipeFaded,
//   reduceMotion,
// }) {
//   const motionProps = useMemo(() => {
//     if (isHoverable) {
//       return {
//         whileHover: { y: -6, scale: 1.01 },
//         transition: { type: "spring", stiffness: 320, damping: 26 },
//       };
//     }
//     return {
//       whileTap: { scale: 0.99 },
//       transition: { type: "spring", stiffness: 420, damping: 32 },
//     };
//   }, [isHoverable]);

//   return (
//     <Reveal delay={0.08 + index * 0.08}>
//       <motion.div {...motionProps} className="group relative">
//         {!isMobile ? (
//           <div className="pointer-events-none absolute left-0 top-6 hidden -translate-x-[10px] sm:block">
//             <div
//               className={[
//                 "relative grid h-5 w-5 place-items-center rounded-full border backdrop-blur",
//                 isActive
//                   ? "border-foreground/55 bg-foreground/[0.14]"
//                   : "border-border/20 bg-background/80",
//               ].join(" ")}
//             >
//               <span
//                 className={[
//                   "h-2 w-2 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.35)]",
//                   isActive ? "bg-foreground/90" : "bg-foreground/45",
//                 ].join(" ")}
//               />
//               {isActive ? (
//                 <span className="exp-ping absolute inset-0 rounded-full border-2 border-foreground/60" />
//               ) : null}
//             </div>
//           </div>
//         ) : null}

//         <Card className="relative overflow-hidden">
//           <div className="relative p-5 md:p-6 sm:pl-14">
//             <ActiveShimmerBorder on={isActive} />

//             <div
//               className={[
//                 "pointer-events-none absolute -inset-16 blur-3xl transition duration-700",
//                 isActive ? "opacity-80" : "opacity-0",
//                 "bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]",
//               ].join(" ")}
//             />
//             <div className="pointer-events-none absolute -inset-16 opacity-0 blur-3xl transition duration-700 group-hover:opacity-70 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
//             <div
//               className={[
//                 "pointer-events-none absolute -left-28 top-0 h-full w-28 rotate-12",
//                 "bg-gradient-to-r from-transparent via-white/10 to-transparent",
//                 "opacity-0 transition duration-700",
//                 "group-hover:opacity-100 group-hover:translate-x-[720px]",
//                 isActive ? "opacity-60 translate-x-[420px]" : "",
//               ].join(" ")}
//             />

//             {isMobile ? (
//               <div className="mb-3 flex items-center gap-2">
//                 <span
//                   className={[
//                     "relative inline-flex h-2.5 w-2.5 items-center justify-center rounded-full",
//                     isActive ? "bg-foreground/90" : "bg-foreground/35",
//                   ].join(" ")}
//                 >
//                   {isActive ? (
//                     <span className="exp-ping-mini absolute inset-[-6px] rounded-full border border-foreground/60" />
//                   ) : null}
//                 </span>

//                 <SwipeHint
//                   dir={swipeDir}
//                   faded={swipeFaded}
//                   reduceMotion={reduceMotion}
//                 />
//               </div>
//             ) : null}

//             <div className="relative flex items-start justify-between gap-4">
//               <div className="min-w-0">
//                 <p className="flex items-center gap-2 text-lg font-semibold text-foreground">
//                   <span
//                     className={[
//                       "grid h-9 w-9 place-items-center rounded-xl border border-border/15 text-sm",
//                       isActive
//                         ? "bg-foreground/[0.06]"
//                         : "bg-foreground/[0.03]",
//                     ].join(" ")}
//                   >
//                     {item.accent || "⭐"}
//                   </span>
//                   <span className="truncate">{item.title}</span>
//                 </p>

//                 <p className="mt-1 text-sm text-muted/70">
//                   {item.company || "—"}
//                 </p>
//               </div>

//               <span
//                 className={[
//                   "shrink-0 rounded-full border border-border/15 px-3 py-1 text-xs backdrop-blur transition",
//                   isActive
//                     ? "bg-foreground/[0.06] text-foreground/90"
//                     : "bg-foreground/[0.03] text-foreground/80",
//                 ].join(" ")}
//               >
//                 {item.period}
//               </span>
//             </div>

//             {item.tags?.length ? (
//               <div className="relative mt-4 flex flex-wrap gap-2">
//                 {item.tags.map((t) => (
//                   <Tag key={t}>{t}</Tag>
//                 ))}
//               </div>
//             ) : null}

//             {item.bullets?.length ? (
//               <ul className="relative mt-4 space-y-2 text-sm text-foreground/80">
//                 {item.bullets.map((b, i) => (
//                   <li key={i} className="flex gap-3">
//                     <span
//                       className={[
//                         "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full transition",
//                         isActive ? "bg-foreground/70" : "bg-foreground/40",
//                       ].join(" ")}
//                     />
//                     <span className="leading-relaxed">{b}</span>
//                   </li>
//                 ))}
//               </ul>
//             ) : null}

//             <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
//           </div>
//         </Card>
//       </motion.div>
//     </Reveal>
//   );
// }

// /**
//  * ✅ UPDATED:
//  * - limit: home pe sirf 1 show
//  * - showViewAll: home pe button
//  * - viewAllHref: /about#experience
//  * - id: section id (default "experience")
//  */
// export default function ExperienceSection({
//   id = "experience",
//   limit,
//   showViewAll = false,
//   viewAllHref = "/about#experience",
// }) {
//   const isHoverable = useIsHoverable();
//   const reduceMotion = usePrefersReducedMotion();
//   const isMobile = useIsMobile();

//   const fullList = experiences || [];
//   const list = typeof limit === "number" ? fullList.slice(0, limit) : fullList;

//   const [activeId, setActiveId] = useState(list?.[0]?.id || null);

//   useEffect(() => {
//     setActiveId(list?.[0]?.id || null);
//   }, [list?.length]);

//   const itemRefs = useRef([]);
//   itemRefs.current = [];
//   const setRef = (el) => {
//     if (el) itemRefs.current.push(el);
//   };

//   const sectionRef = useRef(null);
//   const [sectionVisible, setSectionVisible] = useState(false);
//   const scrollerRef = useRef(null);

//   // ✅ hash -> auto scroll (works for /about#experience)
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const scrollIfMatch = () => {
//       const hash = (window.location.hash || "").replace("#", "");
//       if (!hash || hash !== id) return;

//       const el = document.getElementById(id);
//       if (!el) return;

//       setTimeout(() => {
//         el.scrollIntoView({ behavior: "smooth", block: "start" });
//       }, 80);
//     };

//     scrollIfMatch();
//     window.addEventListener("hashchange", scrollIfMatch);
//     return () => window.removeEventListener("hashchange", scrollIfMatch);
//   }, [id]);

//   // ✅ swipe direction detect (mobile)
//   const [swipeDir, setSwipeDir] = useState("right");
//   const lastScrollLeft = useRef(0);

//   const onMobileScroll = () => {
//     const el = scrollerRef.current;
//     if (!el) return;
//     const cur = el.scrollLeft;
//     if (cur > lastScrollLeft.current + 1) setSwipeDir("right");
//     else if (cur < lastScrollLeft.current - 1) setSwipeDir("left");
//     lastScrollLeft.current = cur;
//   };

//   const activeIndex = useMemo(() => {
//     if (!list?.length) return 0;
//     const i = list.findIndex((x) => x?.id === activeId);
//     return i < 0 ? 0 : i;
//   }, [list, activeId]);

//   const hintDir = useMemo(() => {
//     if (!list?.length) return "right";
//     if (activeIndex <= 0) return "right";
//     if (activeIndex >= list.length - 1) return "left";
//     return swipeDir === "right" ? "left" : "right";
//   }, [activeIndex, list?.length, swipeDir]);

//   const hintFaded = useMemo(() => {
//     if (!list?.length) return true;
//     return activeIndex <= 0 || activeIndex >= list.length - 1;
//   }, [activeIndex, list?.length]);

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const el = sectionRef.current;
//     if (!el) return;

//     const obs = new IntersectionObserver(
//       (entries) => setSectionVisible(!!entries?.[0]?.isIntersecting),
//       { root: null, threshold: 0.12, rootMargin: "160px 0px 160px 0px" }
//     );

//     obs.observe(el);
//     return () => obs.disconnect();
//   }, []);

//   // ✅ Active card highlight on scroll
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (!list?.length) return;
//     if (reduceMotion) return;
//     if (!sectionVisible) return;

//     const els = itemRefs.current.filter(Boolean);
//     if (!els.length) return;

//     let raf = 0;
//     const rootEl = isMobile ? scrollerRef.current : null;

//     const obs = new IntersectionObserver(
//       (entries) => {
//         const visible = entries
//           .filter((e) => e.isIntersecting)
//           .sort(
//             (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0)
//           )[0];

//         if (!visible) return;

//         const expId = visible.target.getAttribute("data-exp-id");
//         if (!expId) return;

//         cancelAnimationFrame(raf);
//         raf = requestAnimationFrame(() => setActiveId(expId));
//       },
//       {
//         root: rootEl || null,
//         rootMargin: isMobile ? "0px -35% 0px -35%" : "-35% 0px -45% 0px",
//         threshold: isMobile
//           ? [0.35, 0.5, 0.65, 0.8]
//           : [0.15, 0.3, 0.45, 0.6, 0.75],
//       }
//     );

//     els.forEach((el) => obs.observe(el));

//     return () => {
//       cancelAnimationFrame(raf);
//       obs.disconnect();
//     };
//   }, [list, reduceMotion, sectionVisible, isMobile]);

//   return (
//     <section id={id} ref={sectionRef} className="py-16 scroll-mt-24">
//       {/* shimmer + ping CSS (needed for active border) */}
//       <style jsx global>{`
//         @keyframes expShimmer {
//           0% {
//             background-position: 0% 50%;
//             opacity: 0.55;
//           }
//           50% {
//             background-position: 100% 50%;
//             opacity: 0.85;
//           }
//           100% {
//             background-position: 0% 50%;
//             opacity: 0.55;
//           }
//         }
//         .exp-shimmer-border {
//           background: linear-gradient(
//             90deg,
//             rgba(255, 255, 255, 0.08),
//             rgba(255, 255, 255, 0.28),
//             rgba(255, 255, 255, 0.08)
//           );
//           background-size: 220% 220%;
//           animation: expShimmer 2.6s ease-in-out infinite;

//           -webkit-mask: linear-gradient(#000 0 0) content-box,
//             linear-gradient(#000 0 0);
//           -webkit-mask-composite: xor;
//           mask-composite: exclude;

//           padding: 1px;
//           border-radius: 1.5rem;
//         }

//         @keyframes expPing {
//           0% {
//             transform: scale(1);
//             opacity: 0.55;
//           }
//           70% {
//             transform: scale(2.15);
//             opacity: 0;
//           }
//           100% {
//             transform: scale(2.15);
//             opacity: 0;
//           }
//         }
//         .exp-ping {
//           animation: expPing 1.25s ease-out infinite;
//           filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.42));
//         }

//         @keyframes expPingMini {
//           0% {
//             transform: scale(1);
//             opacity: 0.55;
//           }
//           70% {
//             transform: scale(2.2);
//             opacity: 0;
//           }
//           100% {
//             transform: scale(2.2);
//             opacity: 0;
//           }
//         }
//         .exp-ping-mini {
//           animation: expPingMini 1.15s ease-out infinite;
//           filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.42));
//         }
//       `}</style>

//       <Container>
//         <Parallax from={16} to={-16}>
//           <Reveal>
//             <SectionHeading
//               eyebrow="Experience"
//               title="Work timeline"
//               desc="A quick overview of what I’ve been building."
//             />
//           </Reveal>
//         </Parallax>

//         <div className="mt-8">
//           {isMobile ? (
//             <div className="-mx-3">
//               <div
//                 ref={scrollerRef}
//                 onScroll={onMobileScroll}
//                 className={[
//                   "flex gap-4 overflow-x-auto px-3 pb-2",
//                   "snap-x snap-mandatory scroll-smooth",
//                   "[scrollbar-width:none] [-ms-overflow-style:none]",
//                 ].join(" ")}
//                 style={{ WebkitOverflowScrolling: "touch" }}
//               >
//                 {list.map((item, idx) => (
//                   <div
//                     key={item.id || idx}
//                     ref={setRef}
//                     data-exp-id={item.id}
//                     className="snap-center shrink-0 w-[88%]"
//                   >
//                     <ExperienceCard
//                       item={item}
//                       index={idx}
//                       isHoverable={false}
//                       isActive={activeId === item.id}
//                       isMobile
//                       swipeDir={hintDir}
//                       swipeFaded={hintFaded}
//                       reduceMotion={reduceMotion}
//                     />
//                   </div>
//                 ))}
//               </div>

//               {list.length > 1 ? (
//                 <div className="mt-3 flex items-center justify-center gap-2">
//                   {list.slice(0, 8).map((it, i) => (
//                     <span
//                       key={it.id || i}
//                       className={[
//                         "h-1.5 w-1.5 rounded-full transition",
//                         activeId === it.id
//                           ? "bg-foreground/80"
//                           : "bg-foreground/25",
//                       ].join(" ")}
//                     />
//                   ))}
//                 </div>
//               ) : null}
//             </div>
//           ) : (
//             <div className="relative sm:pl-10">
//               <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent sm:block" />
//               <div className="space-y-6">
//                 {list.map((item, idx) => (
//                   <div
//                     key={item.id || idx}
//                     ref={setRef}
//                     data-exp-id={item.id}
//                     className="scroll-mt-24"
//                   >
//                     <ExperienceCard
//                       item={item}
//                       index={idx}
//                       isHoverable={isHoverable}
//                       isActive={activeId === item.id}
//                       isMobile={false}
//                       reduceMotion={reduceMotion}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ✅ VIEW ALL BUTTON */}
//         {showViewAll && typeof limit === "number" ? (
//           <div className="mt-8 flex justify-center">
//             <LuxuryButton href={viewAllHref} variant="primary">
//               View all Experience →
//             </LuxuryButton>
//           </div>
//         ) : null}
//       </Container>
//     </section>
//   );
// }

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { motion, useReducedMotion } from "framer-motion";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import LuxuryButton from "@/components/ui/LuxuryButton";

// // ✅ NOTE: yaha apna data import match kar lo (agar tumhare project me path/name different hai)
// // expected shape example (per item):
// // { id, type, title, company, period, stack: ["Next.js"], points: ["..."] }
// import { experiences } from "@/data/experience";

// /** same scroll event used across sections */
// const SCROLL_EVENT = "mukul:scrollTo";

// function isMobileLike() {
//   if (typeof window === "undefined") return false;
//   return window.matchMedia?.("(max-width: 768px)")?.matches;
// }

// function clamp(n, a, b) {
//   return Math.max(a, Math.min(b, n));
// }

// function TechChip({ children }) {
//   return (
//     <span
//       className={[
//         "relative inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs",
//         "border border-white/12 bg-white/[0.03] text-white/75 backdrop-blur",
//         "overflow-hidden",
//       ].join(" ")}
//     >
//       <span
//         aria-hidden
//         className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/15 to-transparent mj-chip-shimmer"
//       />
//       <span className="relative">{children}</span>
//     </span>
//   );
// }

// function ExperienceCard({ item }) {
//   const reduceMotion = useReducedMotion();

//   return (
//     <motion.div
//       className="group relative"
//       animate={
//         reduceMotion ? undefined : { y: [0, -4, 0], rotateZ: [0, 0.2, 0] }
//       }
//       transition={
//         reduceMotion
//           ? undefined
//           : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
//       }
//     >
//       <Card className="relative overflow-hidden">
//         {/* premium border + aura */}
//         <span
//           aria-hidden
//           className="pointer-events-none absolute -inset-[1px] rounded-[24px] border border-white/10"
//         />
//         <motion.span
//           aria-hidden
//           className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.12),transparent_60%)] blur-3xl"
//           animate={reduceMotion ? undefined : { opacity: [0.14, 0.32, 0.14] }}
//           transition={
//             reduceMotion
//               ? undefined
//               : { duration: 3, repeat: Infinity, ease: "easeInOut" }
//           }
//         />
//         {/* top shimmer line */}
//         <motion.span
//           aria-hidden
//           className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)]"
//           animate={
//             reduceMotion
//               ? undefined
//               : { opacity: [0.2, 0.9, 0.2], x: ["-40%", "40%", "-40%"] }
//           }
//           transition={
//             reduceMotion
//               ? undefined
//               : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
//           }
//         />

//         <div className="relative p-5 sm:p-6">
//           <div className="flex items-start justify-between gap-3">
//             <div className="min-w-0">
//               <div className="flex items-center gap-2">
//                 <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
//                   <span className="text-[#FFD54A] drop-shadow-[0_0_16px_rgba(255,215,0,0.45)]">
//                     ⚡
//                   </span>
//                 </span>
//                 <p className="truncate text-base font-semibold text-white/90">
//                   {item?.title || "Experience"}
//                 </p>
//               </div>

//               <p className="mt-1 text-sm text-white/70">
//                 {item?.company || "Company"}{" "}
//                 <span className="text-white/40">•</span> {item?.type || "Role"}
//               </p>
//             </div>

//             <span className="shrink-0 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-white/75">
//               {item?.period || "2023 - Present"}
//             </span>
//           </div>

//           {/* stack chips */}
//           {Array.isArray(item?.stack) && item.stack.length ? (
//             <div className="mt-4 flex flex-wrap gap-2">
//               {item.stack.slice(0, 6).map((t) => (
//                 <TechChip key={t}>{t}</TechChip>
//               ))}
//             </div>
//           ) : null}

//           {/* bullet points */}
//           {Array.isArray(item?.points) && item.points.length ? (
//             <ul className="mt-4 space-y-2 text-sm text-white/75">
//               {item.points.slice(0, 4).map((p, idx) => (
//                 <li key={idx} className="flex gap-3">
//                   <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
//                   <span className="leading-relaxed">{p}</span>
//                 </li>
//               ))}
//             </ul>
//           ) : null}
//         </div>
//       </Card>
//     </motion.div>
//   );
// }

// /**
//  * ✅ Requirements:
//  * - Home mobile: slider (max 3)
//  * - Desktop/Laptop home: 1 card
//  * - View all -> /about#experience (auto scroll)
//  * - Section supports hash + custom event scroll
//  */
// export default function ExperienceSection({
//   id = "experience",
//   limit = 1, // desktop default for home
//   mobileLimit = 3, // ✅ mobile slider max 3
//   showViewAll = true,
//   viewAllHref = "/about#experience",
//   compact = false,
// }) {
//   const sectionRef = useRef(null);

//   const [mobile, setMobile] = useState(false);

//   // slider active dot
//   const trackRef = useRef(null);
//   const [active, setActive] = useState(0);

//   useEffect(() => {
//     const update = () => setMobile(isMobileLike());
//     update();
//     window.addEventListener?.("resize", update);
//     return () => window.removeEventListener?.("resize", update);
//   }, []);

//   // ✅ hash -> auto scroll
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const scrollIfMatch = () => {
//       const hash = (window.location.hash || "").replace("#", "");
//       if (!hash || hash !== id) return;

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

//   // ✅ custom event scroll (AI suggestions / command palette)
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const onScrollTo = (e) => {
//       const targetId = e?.detail?.id;
//       if (!targetId || targetId !== id) return;
//       sectionRef.current?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     };

//     window.addEventListener(SCROLL_EVENT, onScrollTo);
//     return () => window.removeEventListener(SCROLL_EVENT, onScrollTo);
//   }, [id]);

//   const list = Array.isArray(experiences) ? experiences : [];

//   const desktopShown = useMemo(() => {
//     // desktop home: 1
//     return typeof limit === "number" ? list.slice(0, limit) : list;
//   }, [list, limit]);

//   const mobileShown = useMemo(() => {
//     // ✅ mobile slider: max 3
//     return list.slice(0, clamp(mobileLimit, 1, 6));
//   }, [list, mobileLimit]);

//   // ✅ slider dot sync
//   useEffect(() => {
//     if (!mobile) return;
//     const el = trackRef.current;
//     if (!el) return;

//     const onScroll = () => {
//       const children = Array.from(el.querySelectorAll("[data-slide='1']"));
//       if (!children.length) return;

//       const rect = el.getBoundingClientRect();
//       const center = rect.left + rect.width / 2;

//       let best = 0;
//       let bestDist = Number.POSITIVE_INFINITY;

//       children.forEach((ch, i) => {
//         const r = ch.getBoundingClientRect();
//         const c = r.left + r.width / 2;
//         const d = Math.abs(center - c);
//         if (d < bestDist) {
//           bestDist = d;
//           best = i;
//         }
//       });

//       setActive(best);
//     };

//     onScroll();
//     el.addEventListener("scroll", onScroll, { passive: true });
//     return () => el.removeEventListener("scroll", onScroll);
//   }, [mobile, mobileShown.length]);

//   return (
//     <>
//       <section
//         ref={sectionRef}
//         id={id}
//         className={`${compact ? "py-10" : "py-16"} scroll-mt-24`}
//       >
//         <Container>
//           <Parallax from={16} to={-16}>
//             <Reveal>
//               <SectionHeading
//                 eyebrow="Experience"
//                 title="Real-world work experience"
//                 desc="Hands-on delivery with clean UI, smooth animations, and production-ready code."
//               />
//             </Reveal>
//           </Parallax>

//           {/* ✅ MOBILE: Slider (max 3) */}
//           <div className="mt-8 md:hidden">
//             <div className="mb-3 flex items-center justify-between">
//               <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
//                 <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
//                 Swipe →
//               </span>

//               {/* dots */}
//               <div className="flex items-center gap-1.5">
//                 {mobileShown.map((_, i) => (
//                   <span
//                     key={i}
//                     className={[
//                       "h-1.5 rounded-full transition-all",
//                       i === active ? "w-6 bg-[#FFD54A]/70" : "w-2 bg-white/25",
//                     ].join(" ")}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div
//               ref={trackRef}
//               className={[
//                 "mj-scrollbar-none flex gap-4 overflow-x-auto pb-2",
//                 "snap-x snap-mandatory",
//               ].join(" ")}
//             >
//               {mobileShown.map((item) => (
//                 <div
//                   key={item.id || item.title}
//                   data-slide="1"
//                   className="snap-center min-w-[86%] max-w-[86%]"
//                 >
//                   <Reveal>
//                     <ExperienceCard item={item} />
//                   </Reveal>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ✅ DESKTOP/LAPTOP: only 1 card (home) */}
//           <div className="mt-8 hidden md:block">
//             <div className="grid gap-6">
//               {desktopShown.map((item, idx) => (
//                 <Reveal key={item.id || item.title} delay={0.08 + idx * 0.08}>
//                   <ExperienceCard item={item} />
//                 </Reveal>
//               ))}
//             </div>
//           </div>

//           {/* ✅ View all -> About#experience */}
//           {showViewAll ? (
//             <div className="mt-8 flex justify-center">
//               <LuxuryButton href={viewAllHref} variant="primary">
//                 View all Experience →
//               </LuxuryButton>
//             </div>
//           ) : null}
//         </Container>
//       </section>

//       {/* ✅ small utilities */}
//       <style jsx global>{`
//         .mj-scrollbar-none {
//           scrollbar-width: none;
//           -ms-overflow-style: none;
//         }
//         .mj-scrollbar-none::-webkit-scrollbar {
//           display: none;
//         }
//         @keyframes mjChipShimmer {
//           0% {
//             transform: translateX(-220px) rotate(12deg);
//             opacity: 0.25;
//           }
//           45% {
//             opacity: 0.6;
//           }
//           100% {
//             transform: translateX(620px) rotate(12deg);
//             opacity: 0.25;
//           }
//         }
//         .mj-chip-shimmer {
//           animation: mjChipShimmer 3.1s ease-in-out infinite;
//         }
//       `}</style>
//     </>
//   );
// }

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { motion, useReducedMotion } from "framer-motion";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import LuxuryButton from "@/components/ui/LuxuryButton";

// import { experiences } from "@/data/experience";

// const SCROLL_EVENT = "mukul:scrollTo";

// function isMobileLike() {
//   if (typeof window === "undefined") return false;
//   return window.matchMedia?.("(max-width: 768px)")?.matches;
// }

// function clamp(n, a, b) {
//   return Math.max(a, Math.min(b, n));
// }

// function TechChip({ children, i = 0 }) {
//   const reduceMotion = useReducedMotion();

//   return (
//     <motion.span
//       className={[
//         "relative inline-flex items-center rounded-full px-3 py-1 text-xs",
//         "border border-white/12 bg-white/[0.03] text-white/75 backdrop-blur",
//         "overflow-hidden",
//       ].join(" ")}
//       animate={
//         reduceMotion
//           ? undefined
//           : {
//               y: [0, -1.5, 0],
//               opacity: [0.92, 1, 0.92],
//             }
//       }
//       transition={
//         reduceMotion
//           ? undefined
//           : {
//               duration: 2.8,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: i * 0.08,
//             }
//       }
//     >
//       <span
//         aria-hidden
//         className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/15 to-transparent mj-chip-shimmer"
//       />
//       <span className="relative">{children}</span>
//     </motion.span>
//   );
// }

// function ExperienceCard({ item }) {
//   const reduceMotion = useReducedMotion();

//   return (
//     <motion.div
//       className="group relative"
//       animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
//       transition={
//         reduceMotion
//           ? undefined
//           : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
//       }
//     >
//       <Card className="relative overflow-hidden">
//         <span
//           aria-hidden
//           className="pointer-events-none absolute -inset-[1px] rounded-[24px] border border-white/10"
//         />

//         <motion.span
//           aria-hidden
//           className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.12),transparent_60%)] blur-3xl"
//           animate={reduceMotion ? undefined : { opacity: [0.14, 0.32, 0.14] }}
//           transition={
//             reduceMotion
//               ? undefined
//               : { duration: 3, repeat: Infinity, ease: "easeInOut" }
//           }
//         />

//         <motion.span
//           aria-hidden
//           className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)]"
//           animate={
//             reduceMotion
//               ? undefined
//               : { opacity: [0.2, 0.9, 0.2], x: ["-40%", "40%", "-40%"] }
//           }
//           transition={
//             reduceMotion
//               ? undefined
//               : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
//           }
//         />

//         <div className="relative p-5 sm:p-6">
//           <div className="flex items-start justify-between gap-3">
//             <div className="min-w-0">
//               <div className="flex items-center gap-2">
//                 <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
//                   <motion.span
//                     className="text-[#FFD54A] drop-shadow-[0_0_18px_rgba(255,215,0,0.55)]"
//                     animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
//                     transition={
//                       reduceMotion
//                         ? undefined
//                         : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
//                     }
//                   >
//                     ⚡
//                   </motion.span>
//                 </span>

//                 <p className="truncate text-base font-semibold text-white/90">
//                   {item?.title || "Experience"}
//                 </p>
//               </div>

//               <p className="mt-1 text-sm text-white/70">
//                 {item?.company || "Company"}{" "}
//                 <span className="text-white/40">•</span> {item?.type || "Role"}
//               </p>
//             </div>

//             <span className="shrink-0 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-white/75">
//               {item?.period || "2023 - Present"}
//             </span>
//           </div>

//           {Array.isArray(item?.stack) && item.stack.length ? (
//             <div className="mt-4 flex flex-wrap gap-2">
//               {item.stack.slice(0, 8).map((t, i) => (
//                 <TechChip key={t} i={i}>
//                   {t}
//                 </TechChip>
//               ))}
//             </div>
//           ) : null}

//           {Array.isArray(item?.points) && item.points.length ? (
//             <ul className="mt-4 space-y-2 text-sm text-white/75">
//               {item.points.slice(0, 4).map((p, idx) => (
//                 <motion.li
//                   key={idx}
//                   className="flex gap-3"
//                   initial={{ opacity: 0, y: 6 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
//                   transition={{
//                     duration: 0.28,
//                     ease: "easeOut",
//                     delay: idx * 0.05,
//                   }}
//                 >
//                   <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/45" />
//                   <span className="leading-relaxed">{p}</span>
//                 </motion.li>
//               ))}
//             </ul>
//           ) : null}
//         </div>
//       </Card>
//     </motion.div>
//   );
// }

// export default function ExperienceSection({
//   id = "experience",

//   // Home behavior:
//   limit = 1,
//   mobileLimit = 3,
//   showViewAll = true,
//   viewAllHref = "/about#experience",

//   // About behavior:
//   mode = "home", // "home" | "about"

//   compact = false,
// }) {
//   const sectionRef = useRef(null);

//   const [mobile, setMobile] = useState(false);
//   const trackRef = useRef(null);
//   const [active, setActive] = useState(0);

//   useEffect(() => {
//     const update = () => setMobile(isMobileLike());
//     update();
//     window.addEventListener?.("resize", update);
//     return () => window.removeEventListener?.("resize", update);
//   }, []);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const scrollIfMatch = () => {
//       const hash = (window.location.hash || "").replace("#", "");
//       if (!hash || hash !== id) return;

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

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const onScrollTo = (e) => {
//       const targetId = e?.detail?.id;
//       if (!targetId || targetId !== id) return;
//       sectionRef.current?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     };

//     window.addEventListener(SCROLL_EVENT, onScrollTo);
//     return () => window.removeEventListener(SCROLL_EVENT, onScrollTo);
//   }, [id]);

//   const list = Array.isArray(experiences) ? experiences : [];

//   const desktopShown = useMemo(() => {
//     if (mode === "about") return list;
//     return typeof limit === "number" ? list.slice(0, limit) : list;
//   }, [list, limit, mode]);

//   const mobileShown = useMemo(() => {
//     if (mode === "about") return list;
//     return list.slice(0, clamp(mobileLimit, 1, 6));
//   }, [list, mobileLimit, mode]);

//   const shouldShowButton = mode === "home" ? showViewAll : false;

//   useEffect(() => {
//     if (!(mode === "home" && mobile)) return;
//     const el = trackRef.current;
//     if (!el) return;

//     const onScroll = () => {
//       const children = Array.from(el.querySelectorAll("[data-slide='1']"));
//       if (!children.length) return;

//       const rect = el.getBoundingClientRect();
//       const center = rect.left + rect.width / 2;

//       let best = 0;
//       let bestDist = Number.POSITIVE_INFINITY;

//       children.forEach((ch, i) => {
//         const r = ch.getBoundingClientRect();
//         const c = r.left + r.width / 2;
//         const d = Math.abs(center - c);
//         if (d < bestDist) {
//           bestDist = d;
//           best = i;
//         }
//       });

//       setActive(best);
//     };

//     onScroll();
//     el.addEventListener("scroll", onScroll, { passive: true });
//     return () => el.removeEventListener("scroll", onScroll);
//   }, [mobile, mobileShown.length, mode]);

//   return (
//     <>
//       <section
//         ref={sectionRef}
//         id={id}
//         className={`${compact ? "py-10" : "py-16"} scroll-mt-24`}
//       >
//         <Container>
//           <Parallax from={16} to={-16}>
//             <Reveal>
//               <SectionHeading
//                 eyebrow="Experience"
//                 title="Real-world work experience"
//                 desc="Hands-on delivery with clean UI, smooth animations, and production-ready code."
//               />
//             </Reveal>
//           </Parallax>

//           {mode === "home" ? (
//             <>
//               {/* ✅ HOME + MOBILE: add safe side padding + no overlap */}
//               <div className="mt-8 md:hidden">
//                 <div className="px-4">
//                   <div className="mb-4 flex items-center justify-between">
//                     <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
//                       <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
//                       Swipe →
//                     </span>

//                     <div className="flex items-center gap-1.5">
//                       {mobileShown.map((_, i) => (
//                         <span
//                           key={i}
//                           className={[
//                             "h-1.5 rounded-full transition-all",
//                             i === active
//                               ? "w-6 bg-[#FFD54A]/70"
//                               : "w-2 bg-white/25",
//                           ].join(" ")}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div
//                   ref={trackRef}
//                   className={[
//                     "mj-scrollbar-none flex gap-4 overflow-x-auto snap-x snap-mandatory",
//                     "px-4 pt-2 pb-3", // ✅ padding so cards never touch edges + overlap fix
//                     "scroll-px-4", // ✅ better snapping padding
//                   ].join(" ")}
//                 >
//                   {mobileShown.map((item) => (
//                     <div
//                       key={item.id || item.title}
//                       data-slide="1"
//                       className="snap-center min-w-[88%] max-w-[88%]" // ✅ little smaller so edges safe
//                     >
//                       <Reveal>
//                         <ExperienceCard item={item} />
//                       </Reveal>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* HOME desktop: 1 item */}
//               <div className="mt-8 hidden md:block">
//                 <div className="grid gap-6">
//                   {desktopShown.map((item, idx) => (
//                     <Reveal
//                       key={item.id || item.title}
//                       delay={0.08 + idx * 0.08}
//                     >
//                       <ExperienceCard item={item} />
//                     </Reveal>
//                   ))}
//                 </div>
//               </div>
//             </>
//           ) : (
//             /* ✅ ABOUT: stronger padding so mobile never touches edges */
//             // <div className="mt-8 px-4 sm:px-6 md:px-0 grid gap-6 md:grid-cols-2">
//             //   {desktopShown.map((item, idx) => (
//             //     <Reveal key={item.id || item.title} delay={0.06 + idx * 0.06}>
//             //       <ExperienceCard item={item} />
//             //     </Reveal>
//             //   ))}
//             // </div>
//             <div className="mt-8">
//               <div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-8">
//                 <div className="grid gap-6 md:grid-cols-2">
//                   {desktopShown.map((item, idx) => (
//                     <Reveal
//                       key={item.id || item.title}
//                       delay={0.06 + idx * 0.06}
//                     >
//                       <ExperienceCard item={item} />
//                     </Reveal>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {shouldShowButton ? (
//             <div className="mt-8 flex justify-center">
//               <LuxuryButton href={viewAllHref} variant="primary">
//                 View all Experience →
//               </LuxuryButton>
//             </div>
//           ) : null}
//         </Container>
//       </section>

//       <style jsx global>{`
//         .mj-scrollbar-none {
//           scrollbar-width: none;
//           -ms-overflow-style: none;
//         }
//         .mj-scrollbar-none::-webkit-scrollbar {
//           display: none;
//         }
//         @keyframes mjChipShimmer {
//           0% {
//             transform: translateX(-220px) rotate(12deg);
//             opacity: 0.25;
//           }
//           45% {
//             opacity: 0.6;
//           }
//           100% {
//             transform: translateX(620px) rotate(12deg);
//             opacity: 0.25;
//           }
//         }
//         .mj-chip-shimmer {
//           animation: mjChipShimmer 3.1s ease-in-out infinite;
//         }
//       `}</style>
//     </>
//   );
// }

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { motion, useReducedMotion } from "framer-motion";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import LuxuryButton from "@/components/ui/LuxuryButton";

// import { experiences } from "@/data/experience";

// const SCROLL_EVENT = "mukul:scrollTo";

// function isMobileLike() {
//   if (typeof window === "undefined") return false;
//   return window.matchMedia?.("(max-width: 768px)")?.matches;
// }

// function clamp(n, a, b) {
//   return Math.max(a, Math.min(b, n));
// }

// function TechChip({ children, i = 0 }) {
//   const reduceMotion = useReducedMotion();

//   return (
//     <motion.span
//       className={[
//         "relative inline-flex items-center rounded-full px-3 py-1 text-xs",
//         "border border-white/12 bg-white/[0.03] text-white/75 backdrop-blur",
//         "overflow-hidden",
//       ].join(" ")}
//       animate={
//         reduceMotion
//           ? undefined
//           : {
//               y: [0, -1.5, 0],
//               opacity: [0.92, 1, 0.92],
//             }
//       }
//       transition={
//         reduceMotion
//           ? undefined
//           : {
//               duration: 2.8,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: i * 0.08,
//             }
//       }
//     >
//       <span
//         aria-hidden
//         className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/15 to-transparent mj-chip-shimmer"
//       />
//       <span className="relative">{children}</span>
//     </motion.span>
//   );
// }

// function ExperienceCard({ item }) {
//   const reduceMotion = useReducedMotion();

//   return (
//     <motion.div
//       className="group relative"
//       animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
//       transition={
//         reduceMotion
//           ? undefined
//           : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
//       }
//     >
//       <Card className="relative overflow-hidden">
//         <span
//           aria-hidden
//           className="pointer-events-none absolute -inset-[1px] rounded-[24px] border border-white/10"
//         />

//         <motion.span
//           aria-hidden
//           className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.12),transparent_60%)] blur-3xl"
//           animate={reduceMotion ? undefined : { opacity: [0.14, 0.32, 0.14] }}
//           transition={
//             reduceMotion
//               ? undefined
//               : { duration: 3, repeat: Infinity, ease: "easeInOut" }
//           }
//         />

//         <motion.span
//           aria-hidden
//           className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)]"
//           animate={
//             reduceMotion
//               ? undefined
//               : { opacity: [0.2, 0.9, 0.2], x: ["-40%", "40%", "-40%"] }
//           }
//           transition={
//             reduceMotion
//               ? undefined
//               : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
//           }
//         />

//         <div className="relative p-5 sm:p-6">
//           <div className="flex items-start justify-between gap-3">
//             <div className="min-w-0">
//               <div className="flex items-center gap-2">
//                 <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
//                   <motion.span
//                     className="text-[#FFD54A] drop-shadow-[0_0_18px_rgba(255,215,0,0.55)]"
//                     animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
//                     transition={
//                       reduceMotion
//                         ? undefined
//                         : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
//                     }
//                   >
//                     ⚡
//                   </motion.span>
//                 </span>

//                 <p className="truncate text-base font-semibold text-white/90">
//                   {item?.title || "Experience"}
//                 </p>
//               </div>

//               <p className="mt-1 text-sm text-white/70">
//                 {item?.company || "Company"}{" "}
//                 <span className="text-white/40">•</span> {item?.type || "Role"}
//               </p>
//             </div>

//             <span className="shrink-0 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-white/75">
//               {item?.period || "2023 - Present"}
//             </span>
//           </div>

//           {Array.isArray(item?.stack) && item.stack.length ? (
//             <div className="mt-4 flex flex-wrap gap-2">
//               {item.stack.slice(0, 8).map((t, i) => (
//                 <TechChip key={t} i={i}>
//                   {t}
//                 </TechChip>
//               ))}
//             </div>
//           ) : null}

//           {Array.isArray(item?.points) && item.points.length ? (
//             <ul className="mt-4 space-y-2 text-sm text-white/75">
//               {item.points.slice(0, 4).map((p, idx) => (
//                 <motion.li
//                   key={idx}
//                   className="flex gap-3"
//                   initial={{ opacity: 0, y: 6 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
//                   transition={{
//                     duration: 0.28,
//                     ease: "easeOut",
//                     delay: idx * 0.05,
//                   }}
//                 >
//                   <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/45" />
//                   <span className="leading-relaxed">{p}</span>
//                 </motion.li>
//               ))}
//             </ul>
//           ) : null}
//         </div>
//       </Card>
//     </motion.div>
//   );
// }

// export default function ExperienceSection({
//   id = "experience",

//   // Home behavior:
//   limit = 1,
//   mobileLimit = 3,
//   showViewAll = true,
//   viewAllHref = "/about#experience",

//   // About behavior:
//   mode = "home", // "home" | "about"

//   compact = false,
// }) {
//   const sectionRef = useRef(null);

//   const [mobile, setMobile] = useState(false);

//   // sliders
//   const trackHomeRef = useRef(null);
//   const trackAboutRef = useRef(null);

//   const [activeHome, setActiveHome] = useState(0);
//   const [activeAbout, setActiveAbout] = useState(0);

//   useEffect(() => {
//     const update = () => setMobile(isMobileLike());
//     update();
//     window.addEventListener?.("resize", update);
//     return () => window.removeEventListener?.("resize", update);
//   }, []);

//   // hash -> auto scroll
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const scrollIfMatch = () => {
//       const hash = (window.location.hash || "").replace("#", "");
//       if (!hash || hash !== id) return;

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

//   // custom event scroll
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const onScrollTo = (e) => {
//       const targetId = e?.detail?.id;
//       if (!targetId || targetId !== id) return;
//       sectionRef.current?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     };

//     window.addEventListener(SCROLL_EVENT, onScrollTo);
//     return () => window.removeEventListener(SCROLL_EVENT, onScrollTo);
//   }, [id]);

//   const list = Array.isArray(experiences) ? experiences : [];

//   // HOME desktop shown
//   const desktopShown = useMemo(() => {
//     if (mode === "about") return list;
//     return typeof limit === "number" ? list.slice(0, limit) : list;
//   }, [list, limit, mode]);

//   // HOME mobile shown (max 3)
//   const mobileShown = useMemo(() => {
//     if (mode === "about") return list;
//     return list.slice(0, clamp(mobileLimit, 1, 6));
//   }, [list, mobileLimit, mode]);

//   const shouldShowButton = mode === "home" ? showViewAll : false;

//   // slider dot sync helper
//   const bindSliderActive = (ref, setActive) => {
//     const el = ref.current;
//     if (!el) return () => {};

//     const onScroll = () => {
//       const children = Array.from(el.querySelectorAll("[data-slide='1']"));
//       if (!children.length) return;

//       const rect = el.getBoundingClientRect();
//       const center = rect.left + rect.width / 2;

//       let best = 0;
//       let bestDist = Number.POSITIVE_INFINITY;

//       children.forEach((ch, i) => {
//         const r = ch.getBoundingClientRect();
//         const c = r.left + r.width / 2;
//         const d = Math.abs(center - c);
//         if (d < bestDist) {
//           bestDist = d;
//           best = i;
//         }
//       });

//       setActive(best);
//     };

//     onScroll();
//     el.addEventListener("scroll", onScroll, { passive: true });
//     return () => el.removeEventListener("scroll", onScroll);
//   };

//   // HOME slider sync (mobile only)
//   useEffect(() => {
//     if (!(mode === "home" && mobile)) return;
//     return bindSliderActive(trackHomeRef, setActiveHome);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [mode, mobile, mobileShown.length]);

//   // ABOUT slider sync (all screens)
//   useEffect(() => {
//     if (mode !== "about") return;
//     return bindSliderActive(trackAboutRef, setActiveAbout);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [mode, list.length]);

//   return (
//     <>
//       <section
//         ref={sectionRef}
//         id={id}
//         className={`${compact ? "py-10" : "py-16"} scroll-mt-24`}
//       >
//         <Container>
//           <Parallax from={16} to={-16}>
//             <Reveal>
//               <SectionHeading
//                 eyebrow="Experience"
//                 title="Real-world work experience"
//                 desc="Hands-on delivery with clean UI, smooth animations, and production-ready code."
//               />
//             </Reveal>
//           </Parallax>

//           {/* =========================
//               HOME MODE
//           ========================= */}
//           {mode === "home" ? (
//             <>
//               {/* HOME + MOBILE: slider max 3 */}
//               <div className="mt-8 md:hidden">
//                 <div className="mb-3 flex items-center justify-between px-1">
//                   <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
//                     <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
//                     Swipe →
//                   </span>

//                   <div className="flex items-center gap-1.5">
//                     {mobileShown.map((_, i) => (
//                       <span
//                         key={i}
//                         className={[
//                           "h-1.5 rounded-full transition-all",
//                           i === activeHome
//                             ? "w-6 bg-[#FFD54A]/70"
//                             : "w-2 bg-white/25",
//                         ].join(" ")}
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 <div
//                   ref={trackHomeRef}
//                   className="mj-scrollbar-none flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory px-3"
//                 >
//                   {mobileShown.map((item) => (
//                     <div
//                       key={item.id || item.title}
//                       data-slide="1"
//                       className="snap-center min-w-[86%] max-w-[86%]"
//                     >
//                       <Reveal>
//                         <ExperienceCard item={item} />
//                       </Reveal>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* HOME desktop: 1 item */}
//               <div className="mt-8 hidden md:block">
//                 <div className="grid gap-6">
//                   {desktopShown.map((item, idx) => (
//                     <Reveal
//                       key={item.id || item.title}
//                       delay={0.08 + idx * 0.08}
//                     >
//                       <ExperienceCard item={item} />
//                     </Reveal>
//                   ))}
//                 </div>
//               </div>
//             </>
//           ) : (
//             /* =========================
//                 ABOUT MODE (ALL SLIDER)
//             ========================= */
//             <div className="mt-8">
//               {/* top row: swipe + dots + count */}
//               <div className="mb-3 flex items-center justify-between px-1">
//                 <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
//                   <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
//                   Swipe →
//                 </span>

//                 <div className="flex items-center gap-2">
//                   <span className="text-[11px] text-white/50">
//                     {activeAbout + 1}/{list.length}
//                   </span>
//                   <div className="flex items-center gap-1.5">
//                     {list.slice(0, 7).map((_, i) => (
//                       <span
//                         key={i}
//                         className={[
//                           "h-1.5 rounded-full transition-all",
//                           i === activeAbout
//                             ? "w-6 bg-[#FFD54A]/70"
//                             : "w-2 bg-white/25",
//                         ].join(" ")}
//                       />
//                     ))}
//                     {list.length > 7 ? (
//                       <span className="text-[11px] text-white/45">
//                         +{list.length - 7}
//                       </span>
//                     ) : null}
//                   </div>
//                 </div>
//               </div>

//               {/* ABOUT slider (all screens) */}
//               <div
//                 ref={trackAboutRef}
//                 className={[
//                   "mj-scrollbar-none flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory",
//                   "px-3 sm:px-4", // ✅ edge safe (fix touch)
//                 ].join(" ")}
//               >
//                 {list.map((item) => (
//                   <div
//                     key={item.id || item.title}
//                     data-slide="1"
//                     className={[
//                       "snap-center",
//                       // ✅ mobile: one card almost full
//                       "min-w-[88%] max-w-[88%]",
//                       // ✅ desktop: card width fixed with premium feel + peek
//                       "md:min-w-[520px] md:max-w-[520px]",
//                     ].join(" ")}
//                   >
//                     <Reveal>
//                       <ExperienceCard item={item} />
//                     </Reveal>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* View all only on HOME */}
//           {shouldShowButton ? (
//             <div className="mt-8 flex justify-center">
//               <LuxuryButton href={viewAllHref} variant="primary">
//                 View all Experience →
//               </LuxuryButton>
//             </div>
//           ) : null}
//         </Container>
//       </section>

//       <style jsx global>{`
//         .mj-scrollbar-none {
//           scrollbar-width: none;
//           -ms-overflow-style: none;
//         }
//         .mj-scrollbar-none::-webkit-scrollbar {
//           display: none;
//         }
//         @keyframes mjChipShimmer {
//           0% {
//             transform: translateX(-220px) rotate(12deg);
//             opacity: 0.25;
//           }
//           45% {
//             opacity: 0.6;
//           }
//           100% {
//             transform: translateX(620px) rotate(12deg);
//             opacity: 0.25;
//           }
//         }
//         .mj-chip-shimmer {
//           animation: mjChipShimmer 3.1s ease-in-out infinite;
//         }
//       `}</style>
//     </>
//   );
// }

// "use client";

// import { useEffect, useMemo, useRef, useState, useCallback } from "react";
// import { motion, useReducedMotion } from "framer-motion";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import LuxuryButton from "@/components/ui/LuxuryButton";

// import { experiences } from "@/data/experience";

// const SCROLL_EVENT = "mukul:scrollTo";

// function isMobileLike() {
//   if (typeof window === "undefined") return false;
//   return window.matchMedia?.("(max-width: 768px)")?.matches;
// }

// function clamp(n, a, b) {
//   return Math.max(a, Math.min(b, n));
// }

// /** ✅ Desktop mouse-drag + wheel -> horizontal scroll */
// function useDesktopDragAndWheel(ref, enabled = true) {
//   useEffect(() => {
//     if (!enabled) return;
//     const el = ref.current;
//     if (!el) return;

//     let isDown = false;
//     let startX = 0;
//     let startLeft = 0;

//     const onPointerDown = (e) => {
//       // only desktop / mouse-like pointers
//       if (e.pointerType === "touch") return;
//       isDown = true;
//       startX = e.clientX;
//       startLeft = el.scrollLeft;
//       el.setPointerCapture?.(e.pointerId);
//       el.classList.add("mj-grabbing");
//     };

//     const onPointerMove = (e) => {
//       if (!isDown) return;
//       const dx = e.clientX - startX;
//       el.scrollLeft = startLeft - dx;
//     };

//     const end = (e) => {
//       if (!isDown) return;
//       isDown = false;
//       el.classList.remove("mj-grabbing");
//       try {
//         el.releasePointerCapture?.(e.pointerId);
//       } catch {}
//     };

//     const onWheel = (e) => {
//       // desktop: vertical wheel should scroll slider horizontally
//       // (trackpad already gives deltaX, mouse wheel gives deltaY)
//       const isMostlyVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX);
//       if (!isMostlyVertical) return;
//       // prevent page scroll only when pointer is over slider
//       e.preventDefault();
//       el.scrollLeft += e.deltaY;
//     };

//     el.addEventListener("pointerdown", onPointerDown, { passive: true });
//     el.addEventListener("pointermove", onPointerMove, { passive: true });
//     el.addEventListener("pointerup", end, { passive: true });
//     el.addEventListener("pointercancel", end, { passive: true });
//     el.addEventListener("pointerleave", end, { passive: true });

//     // wheel must be non-passive to prevent default
//     el.addEventListener("wheel", onWheel, { passive: false });

//     return () => {
//       el.removeEventListener("pointerdown", onPointerDown);
//       el.removeEventListener("pointermove", onPointerMove);
//       el.removeEventListener("pointerup", end);
//       el.removeEventListener("pointercancel", end);
//       el.removeEventListener("pointerleave", end);
//       el.removeEventListener("wheel", onWheel);
//     };
//   }, [ref, enabled]);
// }

// function TechChip({ children, i = 0 }) {
//   const reduceMotion = useReducedMotion();

//   return (
//     <motion.span
//       className={[
//         "relative inline-flex items-center rounded-full px-3 py-1 text-xs",
//         "border border-white/12 bg-white/[0.03] text-white/75 backdrop-blur",
//         "overflow-hidden",
//       ].join(" ")}
//       animate={
//         reduceMotion ? undefined : { y: [0, -1.5, 0], opacity: [0.92, 1, 0.92] }
//       }
//       transition={
//         reduceMotion
//           ? undefined
//           : {
//               duration: 2.8,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: i * 0.08,
//             }
//       }
//     >
//       <span
//         aria-hidden
//         className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/15 to-transparent mj-chip-shimmer"
//       />
//       <span className="relative">{children}</span>
//     </motion.span>
//   );
// }

// function ExperienceCard({ item }) {
//   const reduceMotion = useReducedMotion();

//   return (
//     <motion.div
//       className="group relative"
//       animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
//       transition={
//         reduceMotion
//           ? undefined
//           : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
//       }
//     >
//       <Card className="relative overflow-hidden">
//         <span
//           aria-hidden
//           className="pointer-events-none absolute -inset-[1px] rounded-[24px] border border-white/10"
//         />

//         <motion.span
//           aria-hidden
//           className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.12),transparent_60%)] blur-3xl"
//           animate={reduceMotion ? undefined : { opacity: [0.14, 0.32, 0.14] }}
//           transition={
//             reduceMotion
//               ? undefined
//               : { duration: 3, repeat: Infinity, ease: "easeInOut" }
//           }
//         />

//         <motion.span
//           aria-hidden
//           className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)]"
//           animate={
//             reduceMotion
//               ? undefined
//               : { opacity: [0.2, 0.9, 0.2], x: ["-40%", "40%", "-40%"] }
//           }
//           transition={
//             reduceMotion
//               ? undefined
//               : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
//           }
//         />

//         <div className="relative p-5 sm:p-6">
//           <div className="flex items-start justify-between gap-3">
//             <div className="min-w-0">
//               <div className="flex items-center gap-2">
//                 <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
//                   <motion.span
//                     className="text-[#FFD54A] drop-shadow-[0_0_18px_rgba(255,215,0,0.55)]"
//                     animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
//                     transition={
//                       reduceMotion
//                         ? undefined
//                         : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
//                     }
//                   >
//                     ⚡
//                   </motion.span>
//                 </span>

//                 <p className="truncate text-base font-semibold text-white/90">
//                   {item?.title || "Experience"}
//                 </p>
//               </div>

//               <p className="mt-1 text-sm text-white/70">
//                 {item?.company || "Company"}{" "}
//                 <span className="text-white/40">•</span> {item?.type || "Role"}
//               </p>
//             </div>

//             <span className="shrink-0 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-white/75">
//               {item?.period || "2023 - Present"}
//             </span>
//           </div>

//           {Array.isArray(item?.stack) && item.stack.length ? (
//             <div className="mt-4 flex flex-wrap gap-2">
//               {item.stack.slice(0, 8).map((t, i) => (
//                 <TechChip key={t} i={i}>
//                   {t}
//                 </TechChip>
//               ))}
//             </div>
//           ) : null}

//           {Array.isArray(item?.points) && item.points.length ? (
//             <ul className="mt-4 space-y-2 text-sm text-white/75">
//               {item.points.slice(0, 4).map((p, idx) => (
//                 <motion.li
//                   key={idx}
//                   className="flex gap-3"
//                   initial={{ opacity: 0, y: 6 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
//                   transition={{
//                     duration: 0.28,
//                     ease: "easeOut",
//                     delay: idx * 0.05,
//                   }}
//                 >
//                   <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/45" />
//                   <span className="leading-relaxed">{p}</span>
//                 </motion.li>
//               ))}
//             </ul>
//           ) : null}
//         </div>
//       </Card>
//     </motion.div>
//   );
// }

// export default function ExperienceSection({
//   id = "experience",

//   // Home
//   limit = 1,
//   mobileLimit = 3,
//   showViewAll = true,
//   viewAllHref = "/about#experience",

//   // About
//   mode = "home", // "home" | "about"

//   compact = false,
// }) {
//   const sectionRef = useRef(null);

//   const [mobile, setMobile] = useState(false);

//   const trackHomeRef = useRef(null);
//   const trackAboutRef = useRef(null);

//   const [activeHome, setActiveHome] = useState(0);
//   const [activeAbout, setActiveAbout] = useState(0);

//   useEffect(() => {
//     const update = () => setMobile(isMobileLike());
//     update();
//     window.addEventListener?.("resize", update);
//     return () => window.removeEventListener?.("resize", update);
//   }, []);

//   // hash scroll
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const scrollIfMatch = () => {
//       const hash = (window.location.hash || "").replace("#", "");
//       if (!hash || hash !== id) return;

//       const el = document.getElementById(id);
//       if (!el) return;

//       setTimeout(
//         () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
//         60
//       );
//     };

//     scrollIfMatch();
//     window.addEventListener("hashchange", scrollIfMatch);
//     return () => window.removeEventListener("hashchange", scrollIfMatch);
//   }, [id]);

//   // custom event scroll
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const onScrollTo = (e) => {
//       const targetId = e?.detail?.id;
//       if (!targetId || targetId !== id) return;
//       sectionRef.current?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     };

//     window.addEventListener(SCROLL_EVENT, onScrollTo);
//     return () => window.removeEventListener(SCROLL_EVENT, onScrollTo);
//   }, [id]);

//   const list = Array.isArray(experiences) ? experiences : [];

//   const desktopShown = useMemo(() => {
//     if (mode === "about") return list;
//     return typeof limit === "number" ? list.slice(0, limit) : list;
//   }, [list, limit, mode]);

//   const mobileShown = useMemo(() => {
//     if (mode === "about") return list;
//     return list.slice(0, clamp(mobileLimit, 1, 6));
//   }, [list, mobileLimit, mode]);

//   const shouldShowButton = mode === "home" ? showViewAll : false;

//   const bindActive = useCallback((ref, setActive) => {
//     const el = ref.current;
//     if (!el) return () => {};

//     const onScroll = () => {
//       const children = Array.from(el.querySelectorAll("[data-slide='1']"));
//       if (!children.length) return;

//       const rect = el.getBoundingClientRect();
//       const center = rect.left + rect.width / 2;

//       let best = 0;
//       let bestDist = Number.POSITIVE_INFINITY;

//       children.forEach((ch, i) => {
//         const r = ch.getBoundingClientRect();
//         const c = r.left + r.width / 2;
//         const d = Math.abs(center - c);
//         if (d < bestDist) {
//           bestDist = d;
//           best = i;
//         }
//       });

//       setActive(best);
//     };

//     onScroll();
//     el.addEventListener("scroll", onScroll, { passive: true });
//     return () => el.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     if (!(mode === "home" && mobile)) return;
//     return bindActive(trackHomeRef, setActiveHome);
//   }, [mode, mobile, mobileShown.length, bindActive]);

//   useEffect(() => {
//     if (mode !== "about") return;
//     return bindActive(trackAboutRef, setActiveAbout);
//   }, [mode, list.length, bindActive]);

//   // ✅ Desktop mouse-drag + wheel for ABOUT slider
//   useDesktopDragAndWheel(trackAboutRef, mode === "about" && !mobile);

//   const scrollByOne = (ref, dir = 1) => {
//     const el = ref.current;
//     if (!el) return;

//     const card = el.querySelector("[data-slide='1']");
//     const gap = 16; // gap-4
//     const w = card ? card.getBoundingClientRect().width : 520;
//     el.scrollBy({ left: dir * (w + gap), behavior: "smooth" });
//   };

//   return (
//     <>
//       <section
//         ref={sectionRef}
//         id={id}
//         className={`${compact ? "py-10" : "py-16"} scroll-mt-24`}
//       >
//         <Container>
//           <Parallax from={16} to={-16}>
//             <Reveal>
//               <SectionHeading
//                 eyebrow="Experience"
//                 title="Real-world work experience"
//                 desc="Hands-on delivery with clean UI, smooth animations, and production-ready code."
//               />
//             </Reveal>
//           </Parallax>

//           {mode === "home" ? (
//             <>
//               {/* HOME mobile slider */}
//               <div className="mt-8 md:hidden">
//                 <div className="mb-3 flex items-center justify-between px-1">
//                   <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
//                     <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
//                     Swipe →
//                   </span>

//                   <div className="flex items-center gap-1.5">
//                     {mobileShown.map((_, i) => (
//                       <span
//                         key={i}
//                         className={[
//                           "h-1.5 rounded-full transition-all",
//                           i === activeHome
//                             ? "w-6 bg-[#FFD54A]/70"
//                             : "w-2 bg-white/25",
//                         ].join(" ")}
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 <div
//                   ref={trackHomeRef}
//                   className="mj-scrollbar-none flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory px-3"
//                 >
//                   {mobileShown.map((item) => (
//                     <div
//                       key={item.id || item.title}
//                       data-slide="1"
//                       className="snap-center min-w-[86%] max-w-[86%]"
//                     >
//                       <Reveal>
//                         <ExperienceCard item={item} />
//                       </Reveal>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* HOME desktop: 1 card */}
//               <div className="mt-8 hidden md:block">
//                 <div className="grid gap-6">
//                   {desktopShown.map((item, idx) => (
//                     <Reveal
//                       key={item.id || item.title}
//                       delay={0.08 + idx * 0.08}
//                     >
//                       <ExperienceCard item={item} />
//                     </Reveal>
//                   ))}
//                 </div>
//               </div>
//             </>
//           ) : (
//             /* ABOUT: ALL slider (mobile + desktop) */
//             <div className="mt-8">
//               <div className="mb-3 flex items-center justify-between px-1">
//                 <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
//                   <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
//                   {mobile ? "Swipe →" : "Drag / Scroll →"}
//                 </span>

//                 <div className="flex items-center gap-2">
//                   <span className="text-[11px] text-white/50">
//                     {activeAbout + 1}/{list.length}
//                   </span>
//                   <div className="flex items-center gap-1.5">
//                     {list.slice(0, 7).map((_, i) => (
//                       <span
//                         key={i}
//                         className={[
//                           "h-1.5 rounded-full transition-all",
//                           i === activeAbout
//                             ? "w-6 bg-[#FFD54A]/70"
//                             : "w-2 bg-white/25",
//                         ].join(" ")}
//                       />
//                     ))}
//                     {list.length > 7 ? (
//                       <span className="text-[11px] text-white/45">
//                         +{list.length - 7}
//                       </span>
//                     ) : null}
//                   </div>
//                 </div>
//               </div>

//               <div className="relative">
//                 {/* ✅ Desktop Prev/Next premium buttons */}
//                 <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden md:flex items-center justify-between">
//                   <button
//                     type="button"
//                     onClick={() => scrollByOne(trackAboutRef, -1)}
//                     className={[
//                       "pointer-events-auto ml-2 grid h-11 w-11 place-items-center rounded-2xl",
//                       "border border-white/12 bg-black/40 backdrop-blur",
//                       "text-white/80 hover:bg-white/[0.06] transition",
//                       "shadow-[0_18px_60px_rgba(0,0,0,0.55)]",
//                     ].join(" ")}
//                     aria-label="Previous"
//                   >
//                     ‹
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => scrollByOne(trackAboutRef, 1)}
//                     className={[
//                       "pointer-events-auto mr-2 grid h-11 w-11 place-items-center rounded-2xl",
//                       "border border-white/12 bg-black/40 backdrop-blur",
//                       "text-white/80 hover:bg-white/[0.06] transition",
//                       "shadow-[0_18px_60px_rgba(0,0,0,0.55)]",
//                     ].join(" ")}
//                     aria-label="Next"
//                   >
//                     ›
//                   </button>
//                 </div>

//                 <div
//                   ref={trackAboutRef}
//                   className={[
//                     "mj-scrollbar-none flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory",
//                     "px-3 sm:px-4",
//                     "cursor-grab select-none",
//                   ].join(" ")}
//                 >
//                   {list.map((item) => (
//                     <div
//                       key={item.id || item.title}
//                       data-slide="1"
//                       className={[
//                         "snap-center",
//                         "min-w-[88%] max-w-[88%]",
//                         "md:min-w-[520px] md:max-w-[520px]",
//                       ].join(" ")}
//                     >
//                       <Reveal>
//                         <ExperienceCard item={item} />
//                       </Reveal>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {shouldShowButton ? (
//             <div className="mt-8 flex justify-center">
//               <LuxuryButton href={viewAllHref} variant="primary">
//                 View all Experience →
//               </LuxuryButton>
//             </div>
//           ) : null}
//         </Container>
//       </section>

//       <style jsx global>{`
//         .mj-scrollbar-none {
//           scrollbar-width: none;
//           -ms-overflow-style: none;
//         }
//         .mj-scrollbar-none::-webkit-scrollbar {
//           display: none;
//         }
//         .mj-grabbing,
//         .mj-grabbing * {
//           cursor: grabbing !important;
//         }

//         @keyframes mjChipShimmer {
//           0% {
//             transform: translateX(-220px) rotate(12deg);
//             opacity: 0.25;
//           }
//           45% {
//             opacity: 0.6;
//           }
//           100% {
//             transform: translateX(620px) rotate(12deg);
//             opacity: 0.25;
//           }
//         }
//         .mj-chip-shimmer {
//           animation: mjChipShimmer 3.1s ease-in-out infinite;
//         }
//       `}</style>
//     </>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import LuxuryButton from "@/components/ui/LuxuryButton";

import { experiences } from "@/data/experience";

const SCROLL_EVENT = "mukul:scrollTo";

function isMobileLike() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(max-width: 768px)")?.matches;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function TechChip({ children, i = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={[
        "relative inline-flex items-center rounded-full px-3 py-1 text-xs",
        "border border-white/12 bg-white/[0.03] text-white/75 backdrop-blur",
        "overflow-hidden",
      ].join(" ")}
      animate={
        reduceMotion ? undefined : { y: [0, -1.5, 0], opacity: [0.92, 1, 0.92] }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.08,
            }
      }
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/15 to-transparent mj-chip-shimmer"
      />
      <span className="relative">{children}</span>
    </motion.span>
  );
}

function ExperienceCard({ item }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="group relative"
      animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <Card className="relative overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-[1px] rounded-[24px] border border-white/10"
        />

        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.12),transparent_60%)] blur-3xl"
          animate={reduceMotion ? undefined : { opacity: [0.14, 0.32, 0.14] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        />

        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)]"
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.2, 0.9, 0.2], x: ["-40%", "40%", "-40%"] }
          }
          transition={
            reduceMotion
              ? undefined
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
        />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <motion.span
                    className="text-[#FFD54A] drop-shadow-[0_0_18px_rgba(255,215,0,0.55)]"
                    animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
                    transition={
                      reduceMotion
                        ? undefined
                        : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                    }
                  >
                    ⚡
                  </motion.span>
                </span>

                <p className="truncate text-base font-semibold text-white/90">
                  {item?.title || "Experience"}
                </p>
              </div>

              <p className="mt-1 text-sm text-white/70">
                {item?.company || "Company"}{" "}
                <span className="text-white/40">•</span> {item?.type || "Role"}
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-white/75">
              {item?.period || "2023 - Present"}
            </span>
          </div>

          {Array.isArray(item?.stack) && item.stack.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.stack.slice(0, 8).map((t, i) => (
                <TechChip key={t} i={i}>
                  {t}
                </TechChip>
              ))}
            </div>
          ) : null}

          {Array.isArray(item?.points) && item.points.length ? (
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {item.points.slice(0, 4).map((p, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/45" />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Card>
    </motion.div>
  );
}

export default function ExperienceSection({
  id = "experience",

  // Home
  limit = 1,
  mobileLimit = 3,
  showViewAll = true,
  viewAllHref = "/about#experience",

  // About
  mode = "home", // "home" | "about"

  compact = false,
}) {
  const sectionRef = useRef(null);

  const [mobile, setMobile] = useState(false);

  const trackHomeRef = useRef(null);
  const trackAboutRef = useRef(null);

  const [activeHome, setActiveHome] = useState(0);
  const [activeAbout, setActiveAbout] = useState(0);

  // ✅ drag state (desktop about)
  const dragging = useRef(false);
  const startX = useRef(0);
  const startLeft = useRef(0);

  useEffect(() => {
    const update = () => setMobile(isMobileLike());
    update();
    window.addEventListener?.("resize", update);
    return () => window.removeEventListener?.("resize", update);
  }, []);

  // hash scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollIfMatch = () => {
      const hash = (window.location.hash || "").replace("#", "");
      if (!hash || hash !== id) return;

      const el = document.getElementById(id);
      if (!el) return;

      setTimeout(
        () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
        60
      );
    };

    scrollIfMatch();
    window.addEventListener("hashchange", scrollIfMatch);
    return () => window.removeEventListener("hashchange", scrollIfMatch);
  }, [id]);

  // custom event scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScrollTo = (e) => {
      const targetId = e?.detail?.id;
      if (!targetId || targetId !== id) return;
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    window.addEventListener(SCROLL_EVENT, onScrollTo);
    return () => window.removeEventListener(SCROLL_EVENT, onScrollTo);
  }, [id]);

  const list = Array.isArray(experiences) ? experiences : [];

  const desktopShown = useMemo(() => {
    if (mode === "about") return list;
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }, [list, limit, mode]);

  const mobileShown = useMemo(() => {
    if (mode === "about") return list;
    return list.slice(0, clamp(mobileLimit, 1, 6));
  }, [list, mobileLimit, mode]);

  const shouldShowButton = mode === "home" ? showViewAll : false;

  const bindActive = useCallback((ref, setActive) => {
    const el = ref.current;
    if (!el) return () => {};

    const onScroll = () => {
      const children = Array.from(el.querySelectorAll("[data-slide='1']"));
      if (!children.length) return;

      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;

      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      children.forEach((ch, i) => {
        const r = ch.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(center - c);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });

      setActive(best);
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!(mode === "home" && mobile)) return;
    return bindActive(trackHomeRef, setActiveHome);
  }, [mode, mobile, mobileShown.length, bindActive]);

  useEffect(() => {
    if (mode !== "about") return;
    return bindActive(trackAboutRef, setActiveAbout);
  }, [mode, list.length, bindActive]);

  const scrollByOne = (ref, dir = 1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("[data-slide='1']");
    const gap = 16;
    const w = card ? card.getBoundingClientRect().width : 520;
    el.scrollBy({ left: dir * (w + gap), behavior: "smooth" });
  };

  // ✅ Desktop drag handlers (ABOUT)
  const onMouseDown = (e) => {
    if (mobile) return;
    const el = trackAboutRef.current;
    if (!el) return;
    dragging.current = true;
    startX.current = e.clientX;
    startLeft.current = el.scrollLeft;
    el.classList.add("mj-grabbing");
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const el = trackAboutRef.current;
    if (!el) return;
    const dx = e.clientX - startX.current;
    el.scrollLeft = startLeft.current - dx;
  };

  const stopDrag = () => {
    dragging.current = false;
    const el = trackAboutRef.current;
    el?.classList.remove("mj-grabbing");
  };

  const onWheelAbout = (e) => {
    if (mobile) return;
    const el = trackAboutRef.current;
    if (!el) return;
    const isMostlyVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX);
    if (!isMostlyVertical) return;
    e.preventDefault();
    el.scrollLeft += e.deltaY;
  };

  return (
    <>
      <section
        ref={sectionRef}
        id={id}
        className={`${compact ? "py-10" : "py-16"} scroll-mt-24`}
      >
        <Container>
          <Parallax from={16} to={-16}>
            <Reveal>
              <SectionHeading
                eyebrow="Experience"
                title="Real-world work experience"
                desc="Hands-on delivery with clean UI, smooth animations, and production-ready code."
              />
            </Reveal>
          </Parallax>

          {mode === "home" ? (
            <>
              {/* HOME mobile slider */}
              <div className="mt-8 md:hidden">
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
                    Swipe →
                  </span>

                  <div className="flex items-center gap-1.5">
                    {mobileShown.map((_, i) => (
                      <span
                        key={i}
                        className={[
                          "h-1.5 rounded-full transition-all",
                          i === activeHome
                            ? "w-6 bg-[#FFD54A]/70"
                            : "w-2 bg-white/25",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                </div>

                <div
                  ref={trackHomeRef}
                  className="mj-scrollbar-none flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory px-3"
                >
                  {mobileShown.map((item) => (
                    <div
                      key={item.id || item.title}
                      data-slide="1"
                      className="snap-center min-w-[86%] max-w-[86%]"
                    >
                      <Reveal>
                        <ExperienceCard item={item} />
                      </Reveal>
                    </div>
                  ))}
                </div>
              </div>

              {/* HOME desktop: 1 card */}
              <div className="mt-8 hidden md:block">
                <div className="grid gap-6">
                  {desktopShown.map((item, idx) => (
                    <Reveal
                      key={item.id || item.title}
                      delay={0.08 + idx * 0.08}
                    >
                      <ExperienceCard item={item} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* ABOUT: ALL slider + desktop buttons */
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
                  {mobile ? "Swipe →" : "Drag / Scroll →"}
                </span>

                <span className="text-[11px] text-white/50">
                  {activeAbout + 1}/{list.length}
                </span>
              </div>

              <div className="relative">
                {/* ✅ Buttons show ONLY desktop */}
                {!mobile ? (
                  <>
                    <button
                      type="button"
                      onClick={() => scrollByOne(trackAboutRef, -1)}
                      className="absolute left-2 top-1/2 z-30 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-black/45 backdrop-blur text-white/80 hover:bg-white/[0.06] transition shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
                      aria-label="Previous"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollByOne(trackAboutRef, 1)}
                      className="absolute right-2 top-1/2 z-30 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-black/45 backdrop-blur text-white/80 hover:bg-white/[0.06] transition shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
                      aria-label="Next"
                    >
                      ›
                    </button>
                  </>
                ) : null}

                <div
                  ref={trackAboutRef}
                  className={[
                    "mj-scrollbar-none flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory",
                    "px-3 sm:px-4",
                    "cursor-grab select-none",
                  ].join(" ")}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={stopDrag}
                  onMouseLeave={stopDrag}
                  onWheel={onWheelAbout}
                >
                  {list.map((item) => (
                    <div
                      key={item.id || item.title}
                      data-slide="1"
                      className="snap-center min-w-[88%] max-w-[88%] md:min-w-[520px] md:max-w-[520px]"
                    >
                      <Reveal>
                        <ExperienceCard item={item} />
                      </Reveal>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {shouldShowButton ? (
            <div className="mt-8 flex justify-center">
              <LuxuryButton href={viewAllHref} variant="primary">
                View all Experience →
              </LuxuryButton>
            </div>
          ) : null}
        </Container>
      </section>

      <style jsx global>{`
        .mj-scrollbar-none {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .mj-scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .mj-grabbing,
        .mj-grabbing * {
          cursor: grabbing !important;
        }
        @keyframes mjChipShimmer {
          0% {
            transform: translateX(-220px) rotate(12deg);
            opacity: 0.25;
          }
          45% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(620px) rotate(12deg);
            opacity: 0.25;
          }
        }
        .mj-chip-shimmer {
          animation: mjChipShimmer 3.1s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

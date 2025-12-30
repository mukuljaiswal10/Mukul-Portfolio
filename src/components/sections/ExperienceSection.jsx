// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import { experience } from "@/data/experience";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";

// export default function ExperienceSection() {
//   return (
//     <section className="py-16">
//       <Container>
//         <Parallax from={14} to={-14}>
//           <Reveal>
//             <SectionHeading
//               eyebrow="Experience"
//               title="Work timeline"
//               desc="A quick overview of what I’ve been building."
//             />
//           </Reveal>
//         </Parallax>

//         <div className="grid gap-6">
//           {experience.map((e, i) => (
//             <Reveal key={e.role + e.company} delay={0.08 + i * 0.08}>
//               <Card>
//                 <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
//                   <div>
//                     <p className="text-lg font-semibold">{e.role}</p>
//                     <p className="text-white/60">{e.company}</p>
//                   </div>
//                   <p className="text-sm text-white/50">{e.period}</p>
//                 </div>

//                 <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/70">
//                   {e.points.map((p, idx) => (
//                     <Reveal key={p} delay={0.12 + i * 0.06 + idx * 0.03}>
//                       <li>{p}</li>
//                     </Reveal>
//                   ))}
//                 </ul>
//               </Card>
//             </Reveal>
//           ))}
//         </div>
//       </Container>
//     </section>
//   );
// }

// "use client";

// import { motion } from "framer-motion";
// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import { experience } from "@/data/experience";

// function Tag({ children }) {
//   return (
//     <span className="rounded-full border border-border/12 bg-foreground/[0.02] px-3 py-1 text-[11px] text-foreground/75">
//       {children}
//     </span>
//   );
// }

// function ExperienceCard({ item, index }) {
//   return (
//     <Reveal delay={0.08 + index * 0.08}>
//       <motion.div
//         whileHover={{ y: -6, scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 260, damping: 22 }}
//         className="relative"
//       >
//         {/* timeline dot (desktop) */}
//         <div className="pointer-events-none absolute left-5 top-8 hidden -translate-x-1/2 sm:block">
//           <div className="relative">
//             <div className="h-3.5 w-3.5 rounded-full border border-border/25 bg-background/60 backdrop-blur" />
//             <motion.div
//               aria-hidden
//               className="absolute -inset-2 rounded-full bg-foreground/20 blur-lg"
//               animate={{ opacity: [0.12, 0.28, 0.12], scale: [1, 1.18, 1] }}
//               transition={{
//                 duration: 2.2,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             />
//           </div>
//         </div>

//         <Card className="group relative overflow-hidden sm:pl-14">
//           {/* premium glow */}
//           <div className="pointer-events-none absolute -inset-16 opacity-0 blur-3xl transition duration-700 group-hover:opacity-70 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />

//           {/* shine sweep */}
//           <div className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition duration-700 group-hover:opacity-100 group-hover:translate-x-[760px]" />

//           {/* top row */}
//           <div className="flex flex-wrap items-start justify-between gap-3">
//             <div>
//               <p className="text-lg font-semibold text-foreground">
//                 {item.role}
//               </p>
//               <p className="mt-1 text-sm text-muted/70">{item.org}</p>
//             </div>

//             <div className="shrink-0 rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1 text-xs text-foreground/80">
//               {item.time}
//             </div>
//           </div>

//           {/* tags */}
//           {item.tags?.length ? (
//             <div className="mt-4 flex flex-wrap gap-2">
//               {item.tags.map((t) => (
//                 <Tag key={t}>{t}</Tag>
//               ))}
//             </div>
//           ) : null}

//           {/* points */}
//           <ul className="mt-5 space-y-2 text-sm text-foreground/80">
//             {(item.points || []).map((p, idx) => (
//               <li key={idx} className="flex gap-2">
//                 <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/45" />
//                 <span>{p}</span>
//               </li>
//             ))}
//           </ul>

//           {/* subtle bottom fade */}
//           <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/35 to-transparent" />
//         </Card>
//       </motion.div>
//     </Reveal>
//   );
// }

// export default function ExperienceSection() {
//   return (
//     <section className="py-16">
//       <Container>
//         <Parallax from={14} to={-14}>
//           <Reveal>
//             <SectionHeading
//               eyebrow="Experience"
//               title="Work timeline"
//               desc="A quick overview of what I’ve been building."
//             />
//           </Reveal>
//         </Parallax>

//         <div className="relative mt-8">
//           {/* timeline line (desktop) */}
//           <div className="pointer-events-none absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-foreground/25 via-foreground/10 to-transparent sm:block" />

//           <div className="space-y-6">
//             {experience.map((item, i) => (
//               <ExperienceCard key={`${item.role}-${i}`} item={item} index={i} />
//             ))}
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// }

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";

// import { experiences } from "@/data/experience";

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

// function Tag({ children }) {
//   return (
//     <span className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1 text-[11px] text-foreground/80 backdrop-blur">
//       {children}
//     </span>
//   );
// }

// function ExperienceCard({ item, index, isHoverable }) {
//   const motionProps = useMemo(() => {
//     if (isHoverable) {
//       // ✅ Desktop premium hover (royal lift + glow)
//       return {
//         whileHover: { y: -6, scale: 1.01 },
//         transition: { type: "spring", stiffness: 320, damping: 26 },
//       };
//     }
//     // ✅ Mobile premium press feel (no hover)
//     return {
//       whileTap: { scale: 0.99 },
//       transition: { type: "spring", stiffness: 420, damping: 32 },
//     };
//   }, [isHoverable]);

//   return (
//     <Reveal delay={0.08 + index * 0.08}>
//       <motion.div {...motionProps} className="group relative">
//         {/* Timeline dot (only on >= sm) */}
//         <div className="pointer-events-none absolute left-0 top-6 hidden h-3 w-3 -translate-x-[7px] rounded-full border border-border/20 bg-background/80 backdrop-blur sm:block" />
//         <div className="pointer-events-none absolute left-0 top-6 hidden h-3 w-3 -translate-x-[7px] rounded-full bg-foreground/30 blur-[10px] sm:block opacity-0 group-hover:opacity-100 transition duration-500" />

//         <Card className="relative overflow-hidden">
//           {/* ✅ This wrapper ensures padding even if Card has no padding */}
//           <div className="relative p-5 md:p-6 sm:pl-14">
//             {/* premium glow */}
//             <div className="pointer-events-none absolute -inset-16 opacity-0 blur-3xl transition duration-700 group-hover:opacity-70 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
//             {/* shine sweep */}
//             <div className="pointer-events-none absolute -left-28 top-0 h-full w-28 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition duration-700 group-hover:opacity-100 group-hover:translate-x-[720px]" />

//             {/* Top row */}
//             <div className="relative flex items-start justify-between gap-4">
//               <div className="min-w-0">
//                 <p className="flex items-center gap-2 text-lg font-semibold text-foreground">
//                   <span className="grid h-8 w-8 place-items-center rounded-xl border border-border/15 bg-foreground/[0.03] text-sm">
//                     {item.accent || "⭐"}
//                   </span>
//                   <span className="truncate">{item.title}</span>
//                 </p>

//                 <p className="mt-1 text-sm text-muted/70">
//                   {item.company || "—"}
//                 </p>
//               </div>

//               <span className="shrink-0 rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1 text-xs text-foreground/80 backdrop-blur">
//                 {item.period}
//               </span>
//             </div>

//             {/* Tags */}
//             {item.tags?.length ? (
//               <div className="relative mt-4 flex flex-wrap gap-2">
//                 {item.tags.map((t) => (
//                   <Tag key={t}>{t}</Tag>
//                 ))}
//               </div>
//             ) : null}

//             {/* Bullets */}
//             {item.bullets?.length ? (
//               <ul className="relative mt-4 space-y-2 text-sm text-foreground/80">
//                 {item.bullets.map((b, i) => (
//                   <li key={i} className="flex gap-3">
//                     <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
//                     <span className="leading-relaxed">{b}</span>
//                   </li>
//                 ))}
//               </ul>
//             ) : null}

//             {/* Bottom micro line */}
//             <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
//           </div>
//         </Card>
//       </motion.div>
//     </Reveal>
//   );
// }

// export default function ExperienceSection() {
//   const isHoverable = useIsHoverable();
//   const list = experiences || [];

//   return (
//     <section className="py-16">
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
//           {/* ✅ Timeline line only on >= sm (mobile clean look) */}
//           <div className="relative sm:pl-10">
//             <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent sm:block" />

//             <div className="space-y-6">
//               {list.map((item, idx) => (
//                 <ExperienceCard
//                   key={item.id || idx}
//                   item={item}
//                   index={idx}
//                   isHoverable={isHoverable}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// }

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { motion } from "framer-motion";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";

// import { experiences } from "@/data/experience";

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

// function Tag({ children }) {
//   return (
//     <span className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1 text-[11px] text-foreground/80 backdrop-blur">
//       {children}
//     </span>
//   );
// }

// function ExperienceCard({ item, index, isHoverable, isActive }) {
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
//         {/* Timeline dot (>= sm) */}
//         <div className="pointer-events-none absolute left-0 top-6 hidden h-3 w-3 -translate-x-[7px] rounded-full border border-border/20 bg-background/80 backdrop-blur sm:block" />

//         <Card className="relative overflow-hidden">
//           {/* Padding wrapper (Card padding safe) */}
//           <div className="relative p-5 md:p-6 sm:pl-14">
//             {/* ✅ ACTIVE glow (auto on scroll) */}
//             <div
//               className={[
//                 "pointer-events-none absolute -inset-16 blur-3xl transition duration-700",
//                 isActive ? "opacity-80" : "opacity-0",
//                 "bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]",
//               ].join(" ")}
//             />

//             {/* Hover glow (desktop) */}
//             <div className="pointer-events-none absolute -inset-16 opacity-0 blur-3xl transition duration-700 group-hover:opacity-70 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />

//             {/* shine sweep */}
//             <div
//               className={[
//                 "pointer-events-none absolute -left-28 top-0 h-full w-28 rotate-12",
//                 "bg-gradient-to-r from-transparent via-white/10 to-transparent",
//                 "opacity-0 transition duration-700",
//                 "group-hover:opacity-100 group-hover:translate-x-[720px]",
//                 isActive ? "opacity-60 translate-x-[420px]" : "",
//               ].join(" ")}
//             />

//             {/* Top row */}
//             <div className="relative flex items-start justify-between gap-4">
//               <div className="min-w-0">
//                 <p className="flex items-center gap-2 text-lg font-semibold text-foreground">
//                   <span
//                     className={[
//                       "grid h-8 w-8 place-items-center rounded-xl border border-border/15 text-sm",
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

//             {/* Tags */}
//             {item.tags?.length ? (
//               <div className="relative mt-4 flex flex-wrap gap-2">
//                 {item.tags.map((t) => (
//                   <Tag key={t}>{t}</Tag>
//                 ))}
//               </div>
//             ) : null}

//             {/* Bullets */}
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

//             {/* Bottom micro line */}
//             <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
//           </div>
//         </Card>
//       </motion.div>
//     </Reveal>
//   );
// }

// export default function ExperienceSection() {
//   const isHoverable = useIsHoverable();
//   const reduceMotion = usePrefersReducedMotion();
//   const list = experiences || [];

//   // ✅ active card id
//   const [activeId, setActiveId] = useState(list?.[0]?.id || null);

//   // ✅ refs for IO
//   const itemRefs = useRef([]);
//   itemRefs.current = [];

//   const setRef = (el) => {
//     if (el) itemRefs.current.push(el);
//   };

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (!list?.length) return;
//     if (reduceMotion) return;

//     const els = itemRefs.current.filter(Boolean);
//     if (!els.length) return;

//     let raf = 0;

//     const obs = new IntersectionObserver(
//       (entries) => {
//         // pick the most visible one near center
//         const visible = entries
//           .filter((e) => e.isIntersecting)
//           .sort(
//             (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0)
//           )[0];

//         if (!visible) return;

//         const id = visible.target.getAttribute("data-exp-id");
//         if (!id) return;

//         cancelAnimationFrame(raf);
//         raf = requestAnimationFrame(() => setActiveId(id));
//       },
//       {
//         // center focus (premium)
//         root: null,
//         rootMargin: "-35% 0px -45% 0px",
//         threshold: [0.15, 0.3, 0.45, 0.6, 0.75],
//       }
//     );

//     els.forEach((el) => obs.observe(el));

//     return () => {
//       cancelAnimationFrame(raf);
//       obs.disconnect();
//     };
//   }, [list, reduceMotion]);

//   return (
//     <section className="py-16">
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
//           <div className="relative sm:pl-10">
//             {/* Timeline line only on >= sm */}
//             <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent sm:block" />

//             <div className="space-y-6">
//               {list.map((item, idx) => (
//                 <div
//                   key={item.id || idx}
//                   ref={setRef}
//                   data-exp-id={item.id}
//                   className="scroll-mt-24"
//                 >
//                   <ExperienceCard
//                     item={item}
//                     index={idx}
//                     isHoverable={isHoverable}
//                     isActive={activeId === item.id}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// }

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { motion } from "framer-motion";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";

// import { experiences } from "@/data/experience";

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

// function Tag({ children }) {
//   return (
//     <span className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1 text-[11px] text-foreground/80 backdrop-blur">
//       {children}
//     </span>
//   );
// }

// /** ✅ Apple-like shimmer border overlay (active only) */
// function ActiveShimmerBorder({ on }) {
//   if (!on) return null;
//   return (
//     <div className="pointer-events-none absolute inset-0 rounded-3xl">
//       {/* glow ring */}
//       <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[10px]" />
//       {/* shimmer border */}
//       <div className="exp-shimmer-border absolute -inset-[1px] rounded-3xl opacity-80" />
//     </div>
//   );
// }

// function ExperienceCard({ item, index, isHoverable, isActive }) {
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
//         {/* ✅ Timeline dot + ping (>= sm) */}
//         <div className="pointer-events-none absolute left-0 top-6 hidden -translate-x-[8px] sm:block">
//           <div
//             className={[
//               "relative grid h-4 w-4 place-items-center rounded-full border backdrop-blur",
//               isActive
//                 ? "border-foreground/35 bg-foreground/10"
//                 : "border-border/20 bg-background/80",
//             ].join(" ")}
//           >
//             <span
//               className={[
//                 "h-1.5 w-1.5 rounded-full",
//                 isActive ? "bg-foreground/80" : "bg-foreground/40",
//               ].join(" ")}
//             />
//             {isActive ? (
//               <span className="exp-ping absolute inset-0 rounded-full border border-foreground/35" />
//             ) : null}
//           </div>
//         </div>

//         <Card className="relative overflow-hidden">
//           <div className="relative p-5 md:p-6 sm:pl-14">
//             {/* ✅ Active border shimmer */}
//             <ActiveShimmerBorder on={isActive} />

//             {/* ✅ ACTIVE glow (auto on scroll) */}
//             <div
//               className={[
//                 "pointer-events-none absolute -inset-16 blur-3xl transition duration-700",
//                 isActive ? "opacity-80" : "opacity-0",
//                 "bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]",
//               ].join(" ")}
//             />

//             {/* Hover glow */}
//             <div className="pointer-events-none absolute -inset-16 opacity-0 blur-3xl transition duration-700 group-hover:opacity-70 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />

//             {/* shine sweep */}
//             <div
//               className={[
//                 "pointer-events-none absolute -left-28 top-0 h-full w-28 rotate-12",
//                 "bg-gradient-to-r from-transparent via-white/10 to-transparent",
//                 "opacity-0 transition duration-700",
//                 "group-hover:opacity-100 group-hover:translate-x-[720px]",
//                 isActive ? "opacity-60 translate-x-[420px]" : "",
//               ].join(" ")}
//             />

//             {/* Top row */}
//             <div className="relative flex items-start justify-between gap-4">
//               <div className="min-w-0">
//                 <p className="flex items-center gap-2 text-lg font-semibold text-foreground">
//                   <span
//                     className={[
//                       "grid h-8 w-8 place-items-center rounded-xl border border-border/15 text-sm",
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

//             {/* Tags */}
//             {item.tags?.length ? (
//               <div className="relative mt-4 flex flex-wrap gap-2">
//                 {item.tags.map((t) => (
//                   <Tag key={t}>{t}</Tag>
//                 ))}
//               </div>
//             ) : null}

//             {/* Bullets */}
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

//             {/* Bottom micro line */}
//             <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
//           </div>
//         </Card>
//       </motion.div>
//     </Reveal>
//   );
// }

// export default function ExperienceSection() {
//   const isHoverable = useIsHoverable();
//   const reduceMotion = usePrefersReducedMotion();
//   const list = experiences || [];

//   const [activeId, setActiveId] = useState(list?.[0]?.id || null);

//   const itemRefs = useRef([]);
//   itemRefs.current = [];
//   const setRef = (el) => {
//     if (el) itemRefs.current.push(el);
//   };

//   // ✅ section visible only (battery friendly)
//   const sectionRef = useRef(null);
//   const [sectionVisible, setSectionVisible] = useState(false);

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

//   // ✅ Active card highlight on scroll (only when section visible)
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (!list?.length) return;
//     if (reduceMotion) return;
//     if (!sectionVisible) return;

//     const els = itemRefs.current.filter(Boolean);
//     if (!els.length) return;

//     let raf = 0;

//     const obs = new IntersectionObserver(
//       (entries) => {
//         const visible = entries
//           .filter((e) => e.isIntersecting)
//           .sort(
//             (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0)
//           )[0];

//         if (!visible) return;

//         const id = visible.target.getAttribute("data-exp-id");
//         if (!id) return;

//         cancelAnimationFrame(raf);
//         raf = requestAnimationFrame(() => setActiveId(id));
//       },
//       {
//         root: null,
//         rootMargin: "-35% 0px -45% 0px",
//         threshold: [0.15, 0.3, 0.45, 0.6, 0.75],
//       }
//     );

//     els.forEach((el) => obs.observe(el));

//     return () => {
//       cancelAnimationFrame(raf);
//       obs.disconnect();
//     };
//   }, [list, reduceMotion, sectionVisible]);

//   return (
//     <section ref={sectionRef} className="py-16">
//       {/* ✅ local CSS (no tailwind config needed) */}
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

//           /* border-only mask */
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
//             opacity: 0.65;
//           }
//           70% {
//             transform: scale(1.9);
//             opacity: 0;
//           }
//           100% {
//             transform: scale(1.9);
//             opacity: 0;
//           }
//         }
//         .exp-ping {
//           animation: expPing 1.35s ease-out infinite;
//           filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.35));
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
//           <div className="relative sm:pl-10">
//             {/* Timeline line only on >= sm */}
//             <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent sm:block" />

//             <div className="space-y-6">
//               {list.map((item, idx) => (
//                 <div
//                   key={item.id || idx}
//                   ref={setRef}
//                   data-exp-id={item.id}
//                   className="scroll-mt-24"
//                 >
//                   <ExperienceCard
//                     item={item}
//                     index={idx}
//                     isHoverable={isHoverable}
//                     isActive={activeId === item.id}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// }

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { motion } from "framer-motion";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";

// import { experiences } from "@/data/experience";

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

// function Tag({ children }) {
//   return (
//     <span className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1 text-[11px] text-foreground/80 backdrop-blur">
//       {children}
//     </span>
//   );
// }

// /** ✅ Apple-like shimmer border overlay (active only) */
// function ActiveShimmerBorder({ on }) {
//   if (!on) return null;
//   return (
//     <div className="pointer-events-none absolute inset-0 rounded-3xl">
//       <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[10px]" />
//       <div className="exp-shimmer-border absolute -inset-[1px] rounded-3xl opacity-80" />
//     </div>
//   );
// }

// function ExperienceCard({ item, index, isHoverable, isActive, isMobile }) {
//   const motionProps = useMemo(() => {
//     if (isHoverable) {
//       return {
//         whileHover: { y: -6, scale: 1.01 },
//         transition: { type: "spring", stiffness: 320, damping: 26 },
//       };
//     }
//     // touch friendly
//     return {
//       whileTap: { scale: 0.99 },
//       transition: { type: "spring", stiffness: 420, damping: 32 },
//     };
//   }, [isHoverable]);

//   return (
//     <Reveal delay={0.08 + index * 0.08}>
//       <motion.div {...motionProps} className="group relative">
//         {/* ✅ bigger + darker ping dot (only desktop timeline) */}
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

//             {/* active glow */}
//             <div
//               className={[
//                 "pointer-events-none absolute -inset-16 blur-3xl transition duration-700",
//                 isActive ? "opacity-80" : "opacity-0",
//                 "bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]",
//               ].join(" ")}
//             />

//             {/* hover glow */}
//             <div className="pointer-events-none absolute -inset-16 opacity-0 blur-3xl transition duration-700 group-hover:opacity-70 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />

//             {/* shine sweep */}
//             <div
//               className={[
//                 "pointer-events-none absolute -left-28 top-0 h-full w-28 rotate-12",
//                 "bg-gradient-to-r from-transparent via-white/10 to-transparent",
//                 "opacity-0 transition duration-700",
//                 "group-hover:opacity-100 group-hover:translate-x-[720px]",
//                 isActive ? "opacity-60 translate-x-[420px]" : "",
//               ].join(" ")}
//             />

//             {/* ✅ mobile mini active indicator (top) */}
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
//                 <span className="text-xs text-muted/60">Swipe →</span>
//               </div>
//             ) : null}

//             {/* top row */}
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

//             {/* tags */}
//             {item.tags?.length ? (
//               <div className="relative mt-4 flex flex-wrap gap-2">
//                 {item.tags.map((t) => (
//                   <Tag key={t}>{t}</Tag>
//                 ))}
//               </div>
//             ) : null}

//             {/* bullets */}
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

//             {/* bottom line */}
//             <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
//           </div>
//         </Card>
//       </motion.div>
//     </Reveal>
//   );
// }

// export default function ExperienceSection() {
//   const isHoverable = useIsHoverable();
//   const reduceMotion = usePrefersReducedMotion();
//   const isMobile = useIsMobile();
//   const list = experiences || [];

//   const [activeId, setActiveId] = useState(list?.[0]?.id || null);

//   // refs
//   const itemRefs = useRef([]);
//   itemRefs.current = [];
//   const setRef = (el) => {
//     if (el) itemRefs.current.push(el);
//   };

//   // ✅ section visible only (battery friendly)
//   const sectionRef = useRef(null);
//   const [sectionVisible, setSectionVisible] = useState(false);

//   // ✅ mobile snap scroller root
//   const scrollerRef = useRef(null);

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

//         const id = visible.target.getAttribute("data-exp-id");
//         if (!id) return;

//         cancelAnimationFrame(raf);
//         raf = requestAnimationFrame(() => setActiveId(id));
//       },
//       {
//         root: rootEl || null,
//         // desktop: center-ish, mobile: snap center visibility
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
//     <section ref={sectionRef} className="py-16">
//       {/* ✅ local CSS */}
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

//         /* ✅ bigger + darker ping */
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

//         /* ✅ mobile mini ping */
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
//           {/* ✅ MOBILE: horizontal swipe + snap (premium) */}
//           {isMobile ? (
//             <div className="-mx-3">
//               <div
//                 ref={scrollerRef}
//                 className={[
//                   "flex gap-4 overflow-x-auto px-3 pb-2",
//                   "snap-x snap-mandatory scroll-smooth",
//                   "[scrollbar-width:none] [-ms-overflow-style:none]",
//                 ].join(" ")}
//                 style={{ WebkitOverflowScrolling: "touch" }}
//               >
//                 {/* hide webkit scrollbar */}
//                 <style jsx>{`
//                   div::-webkit-scrollbar {
//                     display: none;
//                   }
//                 `}</style>

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
//                     />
//                   </div>
//                 ))}
//               </div>

//               {/* tiny helper dots */}
//               <div className="mt-3 flex items-center justify-center gap-2">
//                 {list.slice(0, 8).map((it, i) => (
//                   <span
//                     key={it.id || i}
//                     className={[
//                       "h-1.5 w-1.5 rounded-full transition",
//                       activeId === it.id
//                         ? "bg-foreground/80"
//                         : "bg-foreground/25",
//                     ].join(" ")}
//                   />
//                 ))}
//               </div>
//             </div>
//           ) : (
//             /* ✅ DESKTOP/TABLET: vertical timeline */
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
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </Container>
//     </section>
//   );
// }

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { motion } from "framer-motion";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";

// import { experiences } from "@/data/experience";

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

// function Tag({ children }) {
//   return (
//     <span className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1 text-[11px] text-foreground/80 backdrop-blur">
//       {children}
//     </span>
//   );
// }

// /** ✅ Apple-like shimmer border overlay (active only) */
// function ActiveShimmerBorder({ on }) {
//   if (!on) return null;
//   return (
//     <div className="pointer-events-none absolute inset-0 rounded-3xl">
//       <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[10px]" />
//       <div className="exp-shimmer-border absolute -inset-[1px] rounded-3xl opacity-80" />
//     </div>
//   );
// }

// function ExperienceCard({ item, index, isHoverable, isActive, isMobile }) {
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
//                 <span className="text-xs text-muted/60">Swipe →</span>
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

// export default function ExperienceSection() {
//   const isHoverable = useIsHoverable();
//   const reduceMotion = usePrefersReducedMotion();
//   const isMobile = useIsMobile();
//   const list = experiences || [];

//   const [activeId, setActiveId] = useState(list?.[0]?.id || null);

//   const itemRefs = useRef([]);
//   itemRefs.current = [];
//   const setRef = (el) => {
//     if (el) itemRefs.current.push(el);
//   };

//   const sectionRef = useRef(null);
//   const [sectionVisible, setSectionVisible] = useState(false);

//   const scrollerRef = useRef(null);

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

//         const id = visible.target.getAttribute("data-exp-id");
//         if (!id) return;

//         cancelAnimationFrame(raf);
//         raf = requestAnimationFrame(() => setActiveId(id));
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
//     <section ref={sectionRef} className="py-16">
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
//                     />
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-3 flex items-center justify-center gap-2">
//                 {list.slice(0, 8).map((it, i) => (
//                   <span
//                     key={it.id || i}
//                     className={[
//                       "h-1.5 w-1.5 rounded-full transition",
//                       activeId === it.id
//                         ? "bg-foreground/80"
//                         : "bg-foreground/25",
//                     ].join(" ")}
//                   />
//                 ))}
//               </div>
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
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </Container>
//     </section>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";

import { experiences } from "@/data/experience";

function useIsHoverable() {
  const [hoverable, setHoverable] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHoverable(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return hoverable;
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduce;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setMobile(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return mobile;
}

function Tag({ children }) {
  return (
    <span className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1 text-[11px] text-foreground/80 backdrop-blur">
      {children}
    </span>
  );
}

/** ✅ Apple-like shimmer border overlay (active only) */
function ActiveShimmerBorder({ on }) {
  if (!on) return null;
  return (
    <div className="pointer-events-none absolute inset-0 rounded-3xl">
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[10px]" />
      <div className="exp-shimmer-border absolute -inset-[1px] rounded-3xl opacity-80" />
    </div>
  );
}

/** ✅ Micro-premium swipe hint (fade edges + wiggle arrow) */
function SwipeHint({ text, dir, faded, reduceMotion }) {
  const arrow = dir === "left" ? "←" : "→";

  return (
    <span
      className={[
        "inline-flex items-center gap-1 text-xs text-muted/60 select-none",
        faded ? "opacity-35" : "opacity-100",
        "transition-opacity duration-300",
      ].join(" ")}
    >
      <span>Swipe</span>

      {/* wiggle arrow */}
      <motion.span
        aria-hidden
        className="inline-block"
        animate={
          reduceMotion || faded
            ? {}
            : dir === "right"
            ? { x: [0, 3, 0] }
            : { x: [0, -3, 0] }
        }
        transition={
          reduceMotion || faded
            ? {}
            : { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {arrow}
      </motion.span>
    </span>
  );
}

function ExperienceCard({
  item,
  index,
  isHoverable,
  isActive,
  isMobile,
  swipeText,
  swipeDir,
  swipeFaded,
  reduceMotion,
}) {
  const motionProps = useMemo(() => {
    if (isHoverable) {
      return {
        whileHover: { y: -6, scale: 1.01 },
        transition: { type: "spring", stiffness: 320, damping: 26 },
      };
    }
    return {
      whileTap: { scale: 0.99 },
      transition: { type: "spring", stiffness: 420, damping: 32 },
    };
  }, [isHoverable]);

  return (
    <Reveal delay={0.08 + index * 0.08}>
      <motion.div {...motionProps} className="group relative">
        {/* desktop dot */}
        {!isMobile ? (
          <div className="pointer-events-none absolute left-0 top-6 hidden -translate-x-[10px] sm:block">
            <div
              className={[
                "relative grid h-5 w-5 place-items-center rounded-full border backdrop-blur",
                isActive
                  ? "border-foreground/55 bg-foreground/[0.14]"
                  : "border-border/20 bg-background/80",
              ].join(" ")}
            >
              <span
                className={[
                  "h-2 w-2 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.35)]",
                  isActive ? "bg-foreground/90" : "bg-foreground/45",
                ].join(" ")}
              />
              {isActive ? (
                <span className="exp-ping absolute inset-0 rounded-full border-2 border-foreground/60" />
              ) : null}
            </div>
          </div>
        ) : null}

        <Card className="relative overflow-hidden">
          <div className="relative p-5 md:p-6 sm:pl-14">
            <ActiveShimmerBorder on={isActive} />

            {/* active glow */}
            <div
              className={[
                "pointer-events-none absolute -inset-16 blur-3xl transition duration-700",
                isActive ? "opacity-80" : "opacity-0",
                "bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]",
              ].join(" ")}
            />

            {/* hover glow */}
            <div className="pointer-events-none absolute -inset-16 opacity-0 blur-3xl transition duration-700 group-hover:opacity-70 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />

            {/* shine sweep */}
            <div
              className={[
                "pointer-events-none absolute -left-28 top-0 h-full w-28 rotate-12",
                "bg-gradient-to-r from-transparent via-white/10 to-transparent",
                "opacity-0 transition duration-700",
                "group-hover:opacity-100 group-hover:translate-x-[720px]",
                isActive ? "opacity-60 translate-x-[420px]" : "",
              ].join(" ")}
            />

            {/* ✅ mobile mini indicator */}
            {isMobile ? (
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={[
                    "relative inline-flex h-2.5 w-2.5 items-center justify-center rounded-full",
                    isActive ? "bg-foreground/90" : "bg-foreground/35",
                  ].join(" ")}
                >
                  {isActive ? (
                    <span className="exp-ping-mini absolute inset-[-6px] rounded-full border border-foreground/60" />
                  ) : null}
                </span>

                <SwipeHint
                  text={swipeText}
                  dir={swipeDir}
                  faded={swipeFaded}
                  reduceMotion={reduceMotion}
                />
              </div>
            ) : null}

            {/* top row */}
            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <span
                    className={[
                      "grid h-9 w-9 place-items-center rounded-xl border border-border/15 text-sm",
                      isActive
                        ? "bg-foreground/[0.06]"
                        : "bg-foreground/[0.03]",
                    ].join(" ")}
                  >
                    {item.accent || "⭐"}
                  </span>
                  <span className="truncate">{item.title}</span>
                </p>

                <p className="mt-1 text-sm text-muted/70">
                  {item.company || "—"}
                </p>
              </div>

              <span
                className={[
                  "shrink-0 rounded-full border border-border/15 px-3 py-1 text-xs backdrop-blur transition",
                  isActive
                    ? "bg-foreground/[0.06] text-foreground/90"
                    : "bg-foreground/[0.03] text-foreground/80",
                ].join(" ")}
              >
                {item.period}
              </span>
            </div>

            {/* tags */}
            {item.tags?.length ? (
              <div className="relative mt-4 flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            ) : null}

            {/* bullets */}
            {item.bullets?.length ? (
              <ul className="relative mt-4 space-y-2 text-sm text-foreground/80">
                {item.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className={[
                        "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full transition",
                        isActive ? "bg-foreground/70" : "bg-foreground/40",
                      ].join(" ")}
                    />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </Card>
      </motion.div>
    </Reveal>
  );
}

export default function ExperienceSection() {
  const isHoverable = useIsHoverable();
  const reduceMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const list = experiences || [];

  const [activeId, setActiveId] = useState(list?.[0]?.id || null);

  // refs
  const itemRefs = useRef([]);
  itemRefs.current = [];
  const setRef = (el) => {
    if (el) itemRefs.current.push(el);
  };

  const sectionRef = useRef(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const scrollerRef = useRef(null);

  // ✅ swipe direction detect (mobile)
  const [swipeDir, setSwipeDir] = useState("right"); // "right" | "left"
  const lastScrollLeft = useRef(0);

  const onMobileScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const cur = el.scrollLeft;
    if (cur > lastScrollLeft.current + 1) setSwipeDir("right");
    else if (cur < lastScrollLeft.current - 1) setSwipeDir("left");
    lastScrollLeft.current = cur;
  };

  // ✅ active index
  const activeIndex = useMemo(() => {
    if (!list?.length) return 0;
    const i = list.findIndex((x) => x?.id === activeId);
    return i < 0 ? 0 : i;
  }, [list, activeId]);

  // ✅ hint direction + fade logic
  const hintDir = useMemo(() => {
    if (!list?.length) return "right";
    if (activeIndex <= 0) return "right";
    if (activeIndex >= list.length - 1) return "left";
    // middle: show opposite of the direction user came from
    return swipeDir === "right" ? "left" : "right";
  }, [activeIndex, list?.length, swipeDir]);

  const hintFaded = useMemo(() => {
    // fade when one side not possible (first/last)
    if (!list?.length) return true;
    return activeIndex <= 0 || activeIndex >= list.length - 1;
  }, [activeIndex, list?.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => setSectionVisible(!!entries?.[0]?.isIntersecting),
      { root: null, threshold: 0.12, rootMargin: "160px 0px 160px 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ✅ Active card highlight on scroll (battery friendly)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!list?.length) return;
    if (reduceMotion) return;
    if (!sectionVisible) return;

    const els = itemRefs.current.filter(Boolean);
    if (!els.length) return;

    let raf = 0;
    const rootEl = isMobile ? scrollerRef.current : null;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0)
          )[0];

        if (!visible) return;

        const id = visible.target.getAttribute("data-exp-id");
        if (!id) return;

        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => setActiveId(id));
      },
      {
        root: rootEl || null,
        rootMargin: isMobile ? "0px -35% 0px -35%" : "-35% 0px -45% 0px",
        threshold: isMobile
          ? [0.35, 0.5, 0.65, 0.8]
          : [0.15, 0.3, 0.45, 0.6, 0.75],
      }
    );

    els.forEach((el) => obs.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [list, reduceMotion, sectionVisible, isMobile]);

  return (
    <section ref={sectionRef} className="py-16">
      <style jsx global>{`
        @keyframes expShimmer {
          0% {
            background-position: 0% 50%;
            opacity: 0.55;
          }
          50% {
            background-position: 100% 50%;
            opacity: 0.85;
          }
          100% {
            background-position: 0% 50%;
            opacity: 0.55;
          }
        }
        .exp-shimmer-border {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.08),
            rgba(255, 255, 255, 0.28),
            rgba(255, 255, 255, 0.08)
          );
          background-size: 220% 220%;
          animation: expShimmer 2.6s ease-in-out infinite;

          -webkit-mask: linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;

          padding: 1px;
          border-radius: 1.5rem;
        }

        @keyframes expPing {
          0% {
            transform: scale(1);
            opacity: 0.55;
          }
          70% {
            transform: scale(2.15);
            opacity: 0;
          }
          100% {
            transform: scale(2.15);
            opacity: 0;
          }
        }
        .exp-ping {
          animation: expPing 1.25s ease-out infinite;
          filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.42));
        }

        @keyframes expPingMini {
          0% {
            transform: scale(1);
            opacity: 0.55;
          }
          70% {
            transform: scale(2.2);
            opacity: 0;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        .exp-ping-mini {
          animation: expPingMini 1.15s ease-out infinite;
          filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.42));
        }
      `}</style>

      <Container>
        <Parallax from={16} to={-16}>
          <Reveal>
            <SectionHeading
              eyebrow="Experience"
              title="Work timeline"
              desc="A quick overview of what I’ve been building."
            />
          </Reveal>
        </Parallax>

        <div className="mt-8">
          {isMobile ? (
            <div className="-mx-3">
              <div
                ref={scrollerRef}
                onScroll={onMobileScroll}
                className={[
                  "flex gap-4 overflow-x-auto px-3 pb-2",
                  "snap-x snap-mandatory scroll-smooth",
                  "[scrollbar-width:none] [-ms-overflow-style:none]",
                ].join(" ")}
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {list.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    ref={setRef}
                    data-exp-id={item.id}
                    className="snap-center shrink-0 w-[88%]"
                  >
                    <ExperienceCard
                      item={item}
                      index={idx}
                      isHoverable={false}
                      isActive={activeId === item.id}
                      isMobile
                      swipeText="Swipe"
                      swipeDir={hintDir}
                      swipeFaded={hintFaded}
                      reduceMotion={reduceMotion}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                {list.slice(0, 8).map((it, i) => (
                  <span
                    key={it.id || i}
                    className={[
                      "h-1.5 w-1.5 rounded-full transition",
                      activeId === it.id
                        ? "bg-foreground/80"
                        : "bg-foreground/25",
                    ].join(" ")}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="relative sm:pl-10">
              <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent sm:block" />

              <div className="space-y-6">
                {list.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    ref={setRef}
                    data-exp-id={item.id}
                    className="scroll-mt-24"
                  >
                    <ExperienceCard
                      item={item}
                      index={idx}
                      isHoverable={isHoverable}
                      isActive={activeId === item.id}
                      isMobile={false}
                      reduceMotion={reduceMotion}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

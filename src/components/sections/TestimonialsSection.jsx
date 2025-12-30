// "use client";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import { testimonials } from "@/data/testimonials";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";

// export default function TestimonialsSection() {
//   const autoplay = useMemo(
//     () =>
//       Autoplay({
//         delay: 2600,
//         stopOnInteraction: false,
//         stopOnMouseEnter: true,
//       }),
//     []
//   );

//   const [emblaRef, emblaApi] = useEmblaCarousel(
//     {
//       loop: true,
//       align: "start",
//       dragFree: true, // inertia-like feel
//       containScroll: "trimSnaps",
//     },
//     [autoplay]
//   );

//   const [selected, setSelected] = useState(0);

//   const onSelect = useCallback(() => {
//     if (!emblaApi) return;
//     setSelected(emblaApi.selectedScrollSnap());
//   }, [emblaApi]);

//   useEffect(() => {
//     if (!emblaApi) return;
//     onSelect();
//     emblaApi.on("select", onSelect);
//   }, [emblaApi, onSelect]);

//   return (
//     <section className="py-16">
//       <Container>
//         <Parallax from={12} to={-12}>
//           <Reveal>
//             <SectionHeading
//               eyebrow="Testimonials"
//               title="What clients say"
//               desc="Autoplay slider with drag & inertia feel."
//             />
//           </Reveal>
//         </Parallax>

//         <Reveal delay={0.12}>
//           <div className="relative">
//             <div
//               ref={emblaRef}
//               className="overflow-hidden"
//               onMouseEnter={() => autoplay.stop()}
//               onMouseLeave={() => autoplay.play()}
//             >
//               <div className="flex gap-6">
//                 {testimonials.map((t) => (
//                   <div
//                     key={t.name}
//                     className="min-w-0 flex-[0_0_92%] sm:flex-[0_0_70%] md:flex-[0_0_48%]"
//                   >
//                     <Card className="h-full">
//                       <p className="text-white/80 leading-relaxed">
//                         “{t.text}”
//                       </p>
//                       <div className="mt-5">
//                         <p className="font-semibold">{t.name}</p>
//                         <p className="text-sm text-white/60">{t.role}</p>
//                       </div>
//                     </Card>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-5 flex items-center justify-between">
//               <button
//                 onClick={() => {
//                   autoplay.stop();
//                   emblaApi?.scrollPrev();
//                   autoplay.play();
//                 }}
//                 className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
//               >
//                 ← Prev
//               </button>

//               <div className="flex gap-2">
//                 {testimonials.map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => {
//                       autoplay.stop();
//                       emblaApi?.scrollTo(i);
//                       autoplay.play();
//                     }}
//                     className={`h-2.5 w-2.5 rounded-full transition ${
//                       selected === i
//                         ? "bg-white"
//                         : "bg-white/25 hover:bg-white/40"
//                     }`}
//                     aria-label={`Go to slide ${i + 1}`}
//                   />
//                 ))}
//               </div>

//               <button
//                 onClick={() => {
//                   autoplay.stop();
//                   emblaApi?.scrollNext();
//                   autoplay.play();
//                 }}
//                 className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
//               >
//                 Next →
//               </button>
//             </div>
//           </div>
//         </Reveal>
//       </Container>
//     </section>
//   );
// }

// "use client";

// import Image from "next/image";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { motion } from "framer-motion";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import { testimonials } from "@/data/testimonials";

// function Stars({ value = 5 }) {
//   const v = Math.max(1, Math.min(5, value));
//   return (
//     <div className="flex items-center gap-1">
//       {Array.from({ length: 5 }).map((_, i) => (
//         <span
//           key={i}
//           className={[
//             "text-sm",
//             i < v ? "text-foreground/90" : "text-foreground/25",
//           ].join(" ")}
//         >
//           ★
//         </span>
//       ))}
//     </div>
//   );
// }

// function TestimonialCard({ t }) {
//   return (
//     <div className="group relative h-full overflow-hidden rounded-3xl border border-border/15 bg-foreground/[0.03] p-6 backdrop-blur">
//       {/* premium glow */}
//       <div className="pointer-events-none absolute -inset-12 opacity-0 blur-3xl transition duration-700 group-hover:opacity-70 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />

//       {/* top row: avatar + name + logo */}
//       <div className="flex items-start justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-border/15 bg-foreground/[0.04]">
//             {t.avatar ? (
//               <Image
//                 src={t.avatar}
//                 alt={t.name}
//                 fill
//                 className="object-cover"
//                 sizes="48px"
//               />
//             ) : (
//               <div className="grid h-full w-full place-items-center text-xs font-semibold text-foreground/70">
//                 {t.name?.slice(0, 2)?.toUpperCase() || "CL"}
//               </div>
//             )}
//           </div>

//           <div>
//             <p className="text-sm font-semibold text-foreground">{t.name}</p>
//             <p className="text-xs text-muted/60">
//               {t.role}
//               {t.company ? (
//                 <>
//                   {" "}
//                   <span className="text-muted/50">•</span> {t.company}
//                 </>
//               ) : null}
//             </p>

//             <div className="mt-1">
//               <Stars value={t.rating || 5} />
//             </div>
//           </div>
//         </div>

//         <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-border/15 bg-foreground/[0.04]">
//           {t.companyLogo ? (
//             <Image
//               src={t.companyLogo}
//               alt={`${t.company || "Company"} logo`}
//               fill
//               className="object-contain p-2 opacity-90"
//               sizes="40px"
//             />
//           ) : (
//             <div className="grid h-full w-full place-items-center text-[10px] font-semibold text-foreground/60">
//               LOGO
//             </div>
//           )}
//         </div>
//       </div>

//       {/* quote */}
//       <p className="mt-5 text-sm leading-relaxed text-foreground/85">
//         “{t.quote}”
//       </p>

//       {/* subtle bottom shine */}
//       <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/35 to-transparent" />
//     </div>
//   );
// }

// export default function TestimonialsSection() {
//   const list = testimonials || [];
//   const total = list.length;

//   const [index, setIndex] = useState(0);
//   const timerRef = useRef(null);

//   const go = (dir) => {
//     if (!total) return;
//     setIndex((prev) => {
//       const next = dir === "next" ? prev + 1 : prev - 1;
//       return (next + total) % total;
//     });
//   };

//   const start = () => {
//     stop();
//     timerRef.current = setInterval(() => go("next"), 3800);
//   };
//   const stop = () => {
//     if (timerRef.current) clearInterval(timerRef.current);
//     timerRef.current = null;
//   };

//   useEffect(() => {
//     start();
//     return stop;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [total]);

//   const visibleCount = 2;

//   const visible = useMemo(() => {
//     if (!total) return [];
//     const out = [];
//     for (let k = 0; k < Math.min(visibleCount, total); k++) {
//       out.push(list[(index + k) % total]);
//     }
//     return out;
//   }, [list, total, index]);

//   return (
//     <section className="py-16">
//       <Container>
//         <Parallax from={10} to={-10}>
//           <Reveal>
//             <SectionHeading
//               eyebrow="Testimonials"
//               title="What clients say"
//               desc="Premium feedback with ratings & brand presence."
//             />
//           </Reveal>
//         </Parallax>

//         <div className="mt-8" onMouseEnter={stop} onMouseLeave={start}>
//           <div className="grid gap-6 md:grid-cols-2">
//             {visible.map((t) => (
//               <motion.div
//                 key={t.id}
//                 initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
//                 animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//                 transition={{ duration: 0.25, ease: "easeOut" }}
//               >
//                 <TestimonialCard t={t} />
//               </motion.div>
//             ))}
//           </div>

//           <div className="mt-6 flex items-center justify-between">
//             <button
//               onClick={() => go("prev")}
//               className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
//             >
//               ← Prev
//             </button>

//             <div className="flex items-center gap-2">
//               {Array.from({ length: Math.min(total, 6) }).map((_, i) => (
//                 <button
//                   key={i}
//                   aria-label={`Go to ${i + 1}`}
//                   onClick={() => setIndex(i)}
//                   className={[
//                     "h-2 w-2 rounded-full transition",
//                     i === index
//                       ? "bg-foreground/80"
//                       : "bg-foreground/25 hover:bg-foreground/40",
//                   ].join(" ")}
//                 />
//               ))}
//             </div>

//             <button
//               onClick={() => go("next")}
//               className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
//             >
//               Next →
//             </button>
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// }

// "use client";

// import Image from "next/image";
// import { useEffect, useMemo, useRef, useState } from "react";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import { testimonials } from "@/data/testimonials";

// function Stars({ value = 5 }) {
//   const v = Math.max(1, Math.min(5, value));
//   return (
//     <div className="flex items-center gap-1">
//       {Array.from({ length: 5 }).map((_, i) => (
//         <span
//           key={i}
//           className={[
//             "text-sm",
//             i < v ? "text-foreground/90" : "text-foreground/25",
//           ].join(" ")}
//         >
//           ★
//         </span>
//       ))}
//     </div>
//   );
// }

// function TestimonialCard({ t, onHoverStart, onHoverEnd }) {
//   return (
//     <div
//       onMouseEnter={onHoverStart}
//       onMouseLeave={onHoverEnd}
//       className="group relative h-full overflow-hidden rounded-3xl border border-border/15 bg-foreground/[0.03] p-6 backdrop-blur"
//     >
//       {/* premium glow */}
//       <div className="pointer-events-none absolute -inset-12 opacity-0 blur-3xl transition duration-700 group-hover:opacity-70 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />

//       {/* top row: avatar + name + logo */}
//       <div className="flex items-start justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-border/15 bg-foreground/[0.04]">
//             {t.avatar ? (
//               <Image
//                 src={t.avatar}
//                 alt={t.name}
//                 fill
//                 className="object-cover"
//                 sizes="48px"
//               />
//             ) : (
//               <div className="grid h-full w-full place-items-center text-xs font-semibold text-foreground/70">
//                 {t.name?.slice(0, 2)?.toUpperCase() || "CL"}
//               </div>
//             )}
//           </div>

//           <div>
//             <p className="text-sm font-semibold text-foreground">{t.name}</p>
//             <p className="text-xs text-muted/60">
//               {t.role}
//               {t.company ? (
//                 <>
//                   {" "}
//                   <span className="text-muted/50">•</span> {t.company}
//                 </>
//               ) : null}
//             </p>

//             <div className="mt-1">
//               <Stars value={t.rating || 5} />
//             </div>
//           </div>
//         </div>

//         <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-border/15 bg-foreground/[0.04]">
//           {t.companyLogo ? (
//             <Image
//               src={t.companyLogo}
//               alt={`${t.company || "Company"} logo`}
//               fill
//               className="object-contain p-2 opacity-90"
//               sizes="40px"
//             />
//           ) : (
//             <div className="grid h-full w-full place-items-center text-[10px] font-semibold text-foreground/60">
//               LOGO
//             </div>
//           )}
//         </div>
//       </div>

//       {/* quote */}
//       <p className="mt-5 text-sm leading-relaxed text-foreground/85">
//         “{t.quote}”
//       </p>

//       {/* subtle bottom shine */}
//       <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/35 to-transparent" />
//     </div>
//   );
// }

// export default function TestimonialsSection() {
//   const list = testimonials || [];
//   const total = list.length;

//   const [index, setIndex] = useState(0);
//   const timerRef = useRef(null);
//   const resumeRef = useRef(null);

//   const go = (dir) => {
//     if (!total) return;
//     setIndex((prev) => {
//       const next = dir === "next" ? prev + 1 : prev - 1;
//       return (next + total) % total;
//     });
//   };

//   const start = () => {
//     stop();
//     timerRef.current = setInterval(() => go("next"), 3800);
//   };

//   const stop = () => {
//     if (timerRef.current) clearInterval(timerRef.current);
//     timerRef.current = null;

//     if (resumeRef.current) clearTimeout(resumeRef.current);
//     resumeRef.current = null;
//   };

//   // optional: button click par thoda delay k baad autoplay resume
//   const pauseThenResume = () => {
//     stop();
//     resumeRef.current = setTimeout(() => start(), 2200);
//   };

//   useEffect(() => {
//     start();
//     return stop;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [total]);

//   const visibleCount = 2;

//   const visible = useMemo(() => {
//     if (!total) return [];
//     const out = [];
//     for (let k = 0; k < Math.min(visibleCount, total); k++) {
//       out.push(list[(index + k) % total]);
//     }
//     return out;
//   }, [list, total, index]);

//   return (
//     <section className="py-16">
//       <Container>
//         <Parallax from={10} to={-10}>
//           <Reveal>
//             <SectionHeading
//               eyebrow="Testimonials"
//               title="What clients say"
//               desc="Premium feedback with ratings & brand presence."
//             />
//           </Reveal>
//         </Parallax>

//         {/* ✅ hover/touch pe autoplay stop */}
//         <div
//           className="mt-8"
//           onMouseEnter={stop}
//           onMouseLeave={start}
//           onTouchStart={stop}
//           onTouchEnd={start}
//         >
//           <div className="grid gap-6 md:grid-cols-2">
//             {/* ✅ motion wrapper हटाया => NO fade/blur */}
//             {visible.map((t) => (
//               <div key={t.id}>
//                 <TestimonialCard t={t} onHoverStart={stop} onHoverEnd={start} />
//               </div>
//             ))}
//           </div>

//           <div className="mt-6 flex items-center justify-between">
//             <button
//               onClick={() => {
//                 go("prev");
//                 pauseThenResume();
//               }}
//               className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
//             >
//               ← Prev
//             </button>

//             <div className="flex items-center gap-2">
//               {Array.from({ length: total }).map((_, i) => (
//                 <button
//                   key={i}
//                   aria-label={`Go to ${i + 1}`}
//                   onClick={() => {
//                     setIndex(i);
//                     pauseThenResume();
//                   }}
//                   className={[
//                     "h-2 w-2 rounded-full transition",
//                     i === index
//                       ? "bg-foreground/80"
//                       : "bg-foreground/25 hover:bg-foreground/40",
//                   ].join(" ")}
//                 />
//               ))}
//             </div>

//             <button
//               onClick={() => {
//                 go("next");
//                 pauseThenResume();
//               }}
//               className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
//             >
//               Next →
//             </button>
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// }

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import { testimonials } from "@/data/testimonials";

// // ✅ media query hook (for 1 card on mobile, 2 on desktop)
// function useMediaQuery(query) {
//   const [matches, setMatches] = useState(false);

//   useEffect(() => {
//     const mq = window.matchMedia(query);
//     const update = () => setMatches(!!mq.matches);
//     update();
//     mq.addEventListener?.("change", update);
//     return () => mq.removeEventListener?.("change", update);
//   }, [query]);

//   return matches;
// }

// // ✅ premium avatar helpers
// function stringToHsl(str) {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++)
//     hash = str.charCodeAt(i) + ((hash << 5) - hash);
//   const h = Math.abs(hash) % 360;
//   const s = 58;
//   const l = 34;
//   return `hsl(${h} ${s}% ${l}%)`;
// }

// function initials(name = "Client") {
//   const parts = name.trim().split(/\s+/).slice(0, 2);
//   return parts.map((p) => p[0]?.toUpperCase()).join("") || "CL";
// }

// function companyBadgeText(company) {
//   if (!company) return "CLIENT";
//   // first word + last initial style
//   const parts = company.trim().split(/\s+/);
//   const first = parts[0]?.toUpperCase() || "CO";
//   return first.slice(0, 8);
// }

// function Stars({ value = 5 }) {
//   const v = Math.max(1, Math.min(5, value));
//   return (
//     <div className="flex items-center gap-1">
//       {Array.from({ length: 5 }).map((_, i) => (
//         <span
//           key={i}
//           className={[
//             "text-sm",
//             i < v ? "text-foreground/90" : "text-foreground/25",
//           ].join(" ")}
//         >
//           ★
//         </span>
//       ))}
//     </div>
//   );
// }

// function TestimonialCard({ t }) {
//   const avatarBg = stringToHsl(t?.name || "Client");

//   return (
//     <div className="group relative h-full overflow-hidden rounded-3xl border border-border/15 bg-foreground/[0.03] p-6 backdrop-blur">
//       {/* premium glow on hover */}
//       <div className="pointer-events-none absolute -inset-14 opacity-0 blur-3xl transition duration-700 group-hover:opacity-70 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />

//       {/* top row */}
//       <div className="flex items-start justify-between gap-4">
//         {/* left: avatar + meta */}
//         <div className="flex items-center gap-3">
//           {/* ✅ auto avatar */}
//           <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-border/15 bg-foreground/[0.04]">
//             <div
//               className="absolute inset-0 grid place-items-center"
//               style={{
//                 background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.16), transparent 55%), ${avatarBg}`,
//               }}
//             >
//               <span className="text-xs font-semibold text-white/90">
//                 {initials(t?.name)}
//               </span>
//             </div>
//             <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
//           </div>

//           <div>
//             <p className="text-sm font-semibold text-foreground">{t?.name}</p>
//             <p className="text-xs text-muted/60">
//               {t?.role}
//               {t?.company ? (
//                 <>
//                   {" "}
//                   <span className="text-muted/50">•</span> {t.company}
//                 </>
//               ) : null}
//             </p>

//             <div className="mt-1">
//               <Stars value={t?.rating || 5} />
//             </div>
//           </div>
//         </div>

//         {/* ✅ Company logo placeholder -> mini premium badge */}
//         <div className="relative shrink-0">
//           <span
//             className={[
//               "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px]",
//               "border border-border/15 bg-foreground/[0.04] text-foreground/80",
//               "shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur",
//             ].join(" ")}
//           >
//             <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
//             {companyBadgeText(t?.company)}
//           </span>

//           {/* subtle ring */}
//           <span className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-r from-foreground/25 via-transparent to-foreground/25 opacity-50 blur-[6px]" />
//         </div>
//       </div>

//       {/* quote */}
//       <p className="mt-5 text-sm leading-relaxed text-foreground/85">
//         “{t?.quote}”
//       </p>

//       {/* bottom shine */}
//       <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/35 to-transparent" />
//     </div>
//   );
// }

// export default function TestimonialsSection() {
//   const list = (testimonials || []).map((t, idx) => ({
//     id: t.id || `${t.name || "client"}-${idx}`,
//     ...t,
//   }));

//   const total = list.length;

//   // ✅ 1 card on mobile, 2 cards on md+
//   const isMd = useMediaQuery("(min-width: 768px)");
//   const perPage = isMd ? 2 : 1;

//   // ✅ convert into pages
//   const pages = useMemo(() => {
//     if (!total) return [];
//     const out = [];
//     for (let i = 0; i < total; i += perPage) {
//       out.push(list.slice(i, i + perPage));
//     }
//     return out;
//   }, [list, total, perPage]);

//   const pageCount = pages.length;

//   const [page, setPage] = useState(0);
//   const timerRef = useRef(null);
//   const hoveringRef = useRef(false);

//   const go = (dir) => {
//     if (!pageCount) return;
//     setPage((p) => {
//       const next = dir === "next" ? p + 1 : p - 1;
//       return (next + pageCount) % pageCount;
//     });
//   };

//   const stop = () => {
//     hoveringRef.current = true;
//     if (timerRef.current) clearInterval(timerRef.current);
//     timerRef.current = null;
//   };

//   const start = () => {
//     hoveringRef.current = false;
//     if (timerRef.current || pageCount <= 1) return;
//     timerRef.current = setInterval(() => {
//       // hover/focus me stop rahe
//       if (!hoveringRef.current) go("next");
//     }, 3800);
//   };

//   // ✅ restart autoplay when breakpoint changes or data changes
//   useEffect(() => {
//     stop();
//     setPage(0);
//     start();
//     return stop;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pageCount, perPage]);

//   return (
//     <section className="py-16">
//       <Container>
//         <Parallax from={10} to={-10}>
//           <Reveal>
//             <SectionHeading
//               eyebrow="Testimonials"
//               title="What clients say"
//               desc="Premium feedback with ratings & brand presence."
//             />
//           </Reveal>
//         </Parallax>

//         {/* ✅ Slider wrapper (hover -> stop) */}
//         <div
//           className="mt-8"
//           onMouseEnter={stop}
//           onMouseLeave={start}
//           onFocusCapture={stop}
//           onBlurCapture={start}
//         >
//           <div className="relative overflow-hidden">
//             {/* ✅ Track (NO fade) — only translateX */}
//             <div
//               className="flex transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
//               style={{ transform: `translateX(-${page * 100}%)` }}
//             >
//               {pages.map((group, gi) => (
//                 <div key={gi} className="w-full shrink-0">
//                   <div
//                     className={[
//                       "grid gap-6",
//                       isMd ? "md:grid-cols-2" : "grid-cols-1",
//                     ].join(" ")}
//                   >
//                     {group.map((t) => (
//                       <TestimonialCard key={t.id} t={t} />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* controls */}
//           <div className="mt-6 flex items-center justify-between">
//             <button
//               onClick={() => go("prev")}
//               className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
//             >
//               ← Prev
//             </button>

//             <div className="flex items-center gap-2">
//               {Array.from({ length: Math.min(pageCount, 8) }).map((_, i) => (
//                 <button
//                   key={i}
//                   aria-label={`Go to ${i + 1}`}
//                   onClick={() => setPage(i)}
//                   className={[
//                     "h-2 w-2 rounded-full transition",
//                     i === page
//                       ? "bg-foreground/80"
//                       : "bg-foreground/25 hover:bg-foreground/40",
//                   ].join(" ")}
//                 />
//               ))}
//             </div>

//             <button
//               onClick={() => go("next")}
//               className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
//             >
//               Next →
//             </button>
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import { testimonials } from "@/data/testimonials";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [query]);
  return matches;
}

function useElementWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver((entries) => {
      const cr = entries?.[0]?.contentRect;
      if (cr) setW(cr.width || 0);
    });
    ro.observe(el);
    setW(el.getBoundingClientRect()?.width || 0);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

// ===== premium avatar helpers =====
function stringToHsl(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  const s = 58;
  const l = 34;
  return `hsl(${h} ${s}% ${l}%)`;
}

function initials(name = "Client") {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "CL";
}

function companyBadgeText(company) {
  if (!company) return "CLIENT";
  const parts = company.trim().split(/\s+/);
  const first = (parts[0] || "CO").toUpperCase();
  return first.slice(0, 10);
}

function Stars({ value = 5 }) {
  const v = Math.max(1, Math.min(5, value));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={[
            "text-sm",
            i < v ? "text-foreground/90" : "text-foreground/25",
          ].join(" ")}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({ t }) {
  const avatarBg = stringToHsl(t?.name || "Client");

  return (
    <div className="group relative h-full overflow-hidden rounded-3xl border border-border/15 bg-foreground/[0.03] p-6 backdrop-blur">
      <div className="pointer-events-none absolute -inset-14 opacity-0 blur-3xl transition duration-700 group-hover:opacity-70 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-border/15 bg-foreground/[0.04]">
            <div
              className="absolute inset-0 grid place-items-center"
              style={{
                background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.16), transparent 55%), ${avatarBg}`,
              }}
            >
              <span className="text-xs font-semibold text-white/90">
                {initials(t?.name)}
              </span>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">{t?.name}</p>
            <p className="text-xs text-muted/60">
              {t?.role}
              {t?.company ? (
                <>
                  {" "}
                  <span className="text-muted/50">•</span> {t.company}
                </>
              ) : null}
            </p>

            <div className="mt-1">
              <Stars value={t?.rating || 5} />
            </div>
          </div>
        </div>

        <div className="relative shrink-0">
          <span
            className={[
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px]",
              "border border-border/15 bg-foreground/[0.04] text-foreground/80",
              "shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur",
            ].join(" ")}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
            {companyBadgeText(t?.company)}
          </span>
          <span className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-r from-foreground/25 via-transparent to-foreground/25 opacity-50 blur-[6px]" />
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-foreground/85">
        “{t?.quote}”
      </p>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/35 to-transparent" />
    </div>
  );
}

// ===== rubber-band (iOS-like) =====
function rubberBand(distance, dimension, constant = 0.55) {
  // distance: overscroll px
  // dimension: viewport width (used to scale)
  // constant: resistance
  return (
    (distance * dimension * constant) /
    (dimension + constant * Math.abs(distance))
  );
}

export default function TestimonialsSection() {
  const raw = (testimonials || []).map((t, idx) => ({
    id:
      t.id ||
      `${(t.name || "client").toLowerCase().replace(/\s+/g, "-")}-${idx}`,
    ...t,
  }));

  const total = raw.length;

  const isMd = useMediaQuery("(min-width: 768px)");
  const perPage = isMd ? 2 : 1;

  // group into pages
  const basePages = useMemo(() => {
    if (!total) return [];
    const out = [];
    for (let i = 0; i < total; i += perPage)
      out.push(raw.slice(i, i + perPage));
    return out;
  }, [raw, total, perPage]);

  const baseCount = basePages.length;

  // ✅ infinite feel: clone pages at both ends
  const pages = useMemo(() => {
    if (!baseCount) return [];
    const head = basePages.slice(-2);
    const tail = basePages.slice(0, 2);
    return [...head, ...basePages, ...tail];
  }, [basePages, baseCount]);

  const trackCount = pages.length;

  const [wrapRef, width] = useElementWidth();

  // start at the "real" first page (offset by 2)
  const offset = 2;
  const [index, setIndex] = useState(offset);

  const x = useMotionValue(0);

  // autoplay
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  const stop = () => {
    pausedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const start = () => {
    pausedRef.current = false;
    if (timerRef.current || baseCount <= 1) return;
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) setIndex((v) => v + 1);
    }, 3800);
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseCount]);

  // reset on breakpoint change
  useEffect(() => {
    stop();
    setIndex(offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage]);

  // snap to index when width changes or index changes
  useEffect(() => {
    if (!width) return;
    const target = -index * width;
    animate(x, target, { duration: 0.55, ease: [0.16, 1, 0.3, 1] });
  }, [index, width, x]);

  // after animation ends, if we are in clones, jump (no animation) to real range
  useEffect(() => {
    if (!width || !baseCount) return;

    // real range in track: [offset, offset + baseCount - 1]
    const minReal = offset;
    const maxReal = offset + baseCount - 1;

    // if beyond maxReal -> wrap to minReal
    if (index > maxReal) {
      const next = minReal;
      // jump without animation
      x.set(-next * width);
      setIndex(next);
      return;
    }

    // if before minReal -> wrap to maxReal
    if (index < minReal) {
      const next = maxReal;
      x.set(-next * width);
      setIndex(next);
    }
  }, [index, width, baseCount, x]);

  const go = (dir) => {
    stop();
    setIndex((v) => (dir === "next" ? v + 1 : v - 1));
    setTimeout(() => start(), 900);
  };

  // drag physics
  const swipeThreshold = Math.min(120, width * 0.18 || 80);
  const velocityThreshold = 700;

  return (
    <section className="py-16">
      <Container>
        <Parallax from={10} to={-10}>
          <Reveal>
            <SectionHeading
              eyebrow="Testimonials"
              title="What clients say"
              // desc="Infinite loop • rubber-band edges • follow-finger drag."
            />
          </Reveal>
        </Parallax>

        <div
          className="mt-8"
          onMouseEnter={stop}
          onMouseLeave={start}
          onTouchStart={stop}
          onTouchEnd={start}
          onFocusCapture={stop}
          onBlurCapture={start}
        >
          <div ref={wrapRef} className="relative overflow-hidden">
            <motion.div
              className="flex"
              style={{ x, cursor: "grab" }}
              drag="x"
              dragMomentum={false}
              dragElastic={0.12} // rubber feel
              onDragStart={() => stop()}
              onDrag={(e, info) => {
                // extra rubber at far edges (rare because infinite, but during resize it helps)
                if (!width) return;
                const min = -(trackCount - 1) * width;
                const max = 0;
                const cur = x.get();

                if (cur > max) {
                  x.set(rubberBand(cur - max, width, 0.55));
                } else if (cur < min) {
                  x.set(min + rubberBand(cur - min, width, 0.55));
                }
              }}
              onDragEnd={(e, info) => {
                const offsetX = info.offset.x;
                const vx = info.velocity.x;

                const shouldNext =
                  offsetX < -swipeThreshold || vx < -velocityThreshold;
                const shouldPrev =
                  offsetX > swipeThreshold || vx > velocityThreshold;

                if (shouldNext) setIndex((v) => v + 1);
                else if (shouldPrev) setIndex((v) => v - 1);
                else {
                  // snap back
                  if (width) {
                    animate(x, -index * width, {
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    });
                  }
                }

                setTimeout(() => start(), 900);
              }}
              whileTap={{ cursor: "grabbing" }}
            >
              {pages.map((group, gi) => (
                <div key={gi} className="w-full shrink-0">
                  <div
                    className={[
                      "grid gap-6",
                      isMd ? "md:grid-cols-2" : "grid-cols-1",
                    ].join(" ")}
                  >
                    {group.map((t) => (
                      <TestimonialCard key={`${gi}-${t.id}`} t={t} />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => go("prev")}
              className="cursor-pointer rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
            >
              ← Prev
            </button>

            {/* dots: show only real pages */}
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(baseCount, 8) }).map((_, i) => {
                const realIndex = offset + i;
                const active = index === realIndex;
                return (
                  <button
                    key={i}
                    aria-label={`Go to ${i + 1}`}
                    onClick={() => {
                      stop();
                      setIndex(realIndex);
                      setTimeout(() => start(), 900);
                    }}
                    className={[
                      "h-2 w-2 rounded-full transition",
                      active
                        ? "bg-foreground/80"
                        : "bg-foreground/25 hover:bg-foreground/40",
                    ].join(" ")}
                  />
                );
              })}
            </div>

            <button
              onClick={() => go("next")}
              className="cursor-pointer rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
            >
              Next →
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

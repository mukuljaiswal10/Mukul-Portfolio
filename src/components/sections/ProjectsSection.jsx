// import Image from "next/image";
// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Badge from "@/components/ui/Badge";
// import Button from "@/components/ui/Button";
// import { projects } from "@/data/projects";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import TiltCard from "@/components/ui/TiltCard";
// import { blurDataURL } from "@/lib/blur";

// function ProjectCard({ p, i }) {
//   return (
//     <Reveal delay={0.08 + i * 0.08}>
//       <TiltCard className="flex flex-col">
//         {/* IMAGE */}
//         <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
//           <Image
//             src={p.image || "/images/project-placeholder.jpg"}
//             alt={p.title}
//             fill
//             sizes="(max-width: 768px) 100vw, 50vw"
//             placeholder="blur"
//             blurDataURL={blurDataURL(1200, 675)}
//             className="object-cover transition duration-700 ease-out group-hover:scale-110"
//             priority={i === 0}
//           />

//           {/* cinematic overlay */}
//           <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90" />

//           {/* label */}
//           <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur">
//             {p.tags?.[0] || "Project"}
//           </div>
//         </div>

//         {/* CONTENT */}
//         <div className="mt-5 flex-1">
//           <p className="text-lg font-semibold">{p.title}</p>
//           <p className="mt-2 text-sm text-white/70">{p.description}</p>

//           <div className="mt-4 flex flex-wrap gap-2">
//             {p.tags.map((t, idx) => (
//               <Reveal key={t} delay={0.12 + i * 0.06 + idx * 0.02}>
//                 <Badge>{t}</Badge>
//               </Reveal>
//             ))}
//           </div>
//         </div>

//         <Reveal delay={0.18 + i * 0.06}>
//           <div className="mt-6 flex flex-wrap gap-3">
//             <Button href={`/projects/${p.slug}`} variant="outline">
//               Details
//             </Button>
//             {p.liveUrl ? (
//               <Button href={p.liveUrl} variant="ghost">
//                 Live →
//               </Button>
//             ) : null}
//           </div>
//         </Reveal>
//       </TiltCard>
//     </Reveal>
//   );
// }

// export default function ProjectsSection() {
//   return (
//     <section className="py-16">
//       <Container>
//         <Parallax from={14} to={-14}>
//           <Reveal>
//             <SectionHeading
//               eyebrow="Projects"
//               title="Selected work"
//               desc="A few projects that show my UI and development style."
//             />
//           </Reveal>
//         </Parallax>

//         <div className="grid gap-6 md:grid-cols-2">
//           {projects.slice(0, 4).map((p, i) => (
//             <ProjectCard key={p.slug} p={p} i={i} />
//           ))}
//         </div>

//         <Reveal delay={0.25}>
//           <div className="mt-8">
//             <Button href="/projects">View all projects →</Button>
//           </div>
//         </Reveal>
//       </Container>
//     </section>
//   );
// }

// import Image from "next/image";
// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Badge from "@/components/ui/Badge";
// import Button from "@/components/ui/Button";
// import { projects } from "@/data/projects";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import TiltCard from "@/components/ui/TiltCard";
// import { blurDataURL } from "@/lib/blur";

// function ProjectCard({ p, i }) {
//   return (
//     <Reveal delay={0.08 + i * 0.08}>
//       <TiltCard className="flex flex-col">
//         {/* IMAGE */}
//         <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
//           <Image
//             src={p.image || "/images/project-placeholder.jpg"}
//             alt={p.title}
//             fill
//             sizes="(max-width: 768px) 100vw, 50vw"
//             placeholder="blur"
//             blurDataURL={blurDataURL(1200, 675)}
//             className="object-cover transition duration-700 ease-out group-hover:scale-110"
//             priority={i === 0}
//           />

//           {/* cinematic overlay */}
//           <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90" />

//           {/* label */}
//           <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur">
//             {p.tags?.[0] || "Project"}
//           </div>
//         </div>

//         {/* CONTENT */}
//         <div className="mt-5 flex-1">
//           <p className="text-lg font-semibold">{p.title}</p>
//           <p className="mt-2 text-sm text-white/70">{p.description}</p>

//           <div className="mt-4 flex flex-wrap gap-2">
//             {(p.tags || []).map((t, idx) => (
//               <Reveal key={`${t}-${idx}`} delay={0.12 + i * 0.06 + idx * 0.02}>
//                 <Badge>{t}</Badge>
//               </Reveal>
//             ))}
//           </div>
//         </div>

//         <Reveal delay={0.18 + i * 0.06}>
//           <div className="mt-6 flex flex-wrap gap-3">
//             <Button href={`/projects/${p.slug}`} variant="outline">
//               Details
//             </Button>
//             {p.liveUrl ? (
//               <Button href={p.liveUrl} variant="ghost">
//                 Live →
//               </Button>
//             ) : null}
//           </div>
//         </Reveal>
//       </TiltCard>
//     </Reveal>
//   );
// }

// /**
//  * ✅ Usage
//  * Home: <ProjectsSection limit={2} showViewAll />
//  * Projects page: <ProjectsSection /> (shows all)
//  */
// export default function ProjectsSection({ limit, showViewAll = false }) {
//   const list = typeof limit === "number" ? projects.slice(0, limit) : projects;

//   return (
//     <section className="py-16">
//       <Container>
//         <Parallax from={14} to={-14}>
//           <Reveal>
//             <SectionHeading
//               eyebrow="Projects"
//               title="Selected work"
//               desc="A few projects that show my UI and development style."
//             />
//           </Reveal>
//         </Parallax>

//         <div className="grid gap-6 md:grid-cols-2">
//           {list.map((p, i) => (
//             <ProjectCard key={p.slug} p={p} i={i} />
//           ))}
//         </div>

//         {/* ✅ Home पर ही button दिखे */}
//         {showViewAll ? (
//           <Reveal delay={0.25}>
//             <div className="mt-8">
//               <Button href="/projects">View all projects →</Button>
//             </div>
//           </Reveal>
//         ) : null}
//       </Container>
//     </section>
//   );
// }

// import Image from "next/image";
// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Badge from "@/components/ui/Badge";
// import Button from "@/components/ui/Button";
// import { projects } from "@/data/projects";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import TiltCard from "@/components/ui/TiltCard";
// import { blurDataURL } from "@/lib/blur";

// function ProjectCard({ p, i }) {
//   return (
//     <Reveal delay={0.08 + i * 0.08}>
//       <TiltCard className="flex flex-col">
//         {/* IMAGE */}
//         <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
//           <Image
//             src={p.image || "/images/project-placeholder.jpg"}
//             alt={p.title}
//             fill
//             sizes="(max-width: 768px) 100vw, 50vw"
//             placeholder="blur"
//             blurDataURL={blurDataURL(1200, 675)}
//             className="object-cover transition duration-700 ease-out group-hover:scale-110"
//             priority={i === 0}
//           />

//           {/* cinematic overlay */}
//           <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90" />

//           {/* label */}
//           <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur">
//             {p.tags?.[0] || "Project"}
//           </div>
//         </div>

//         {/* CONTENT */}
//         <div className="mt-5 flex-1">
//           <p className="text-lg font-semibold">{p.title}</p>
//           <p className="mt-2 text-sm text-white/70">{p.description}</p>

//           <div className="mt-4 flex flex-wrap gap-2">
//             {(p.tags || []).map((t, idx) => (
//               <Reveal key={`${t}-${idx}`} delay={0.12 + i * 0.06 + idx * 0.02}>
//                 <Badge>{t}</Badge>
//               </Reveal>
//             ))}
//           </div>
//         </div>

//         <Reveal delay={0.18 + i * 0.06}>
//           <div className="mt-6 flex flex-wrap gap-3">
//             <Button href={`/projects/${p.slug}`} variant="outline">
//               Details
//             </Button>
//             {p.liveUrl ? (
//               <Button href={p.liveUrl} variant="ghost">
//                 Live →
//               </Button>
//             ) : null}
//           </div>
//         </Reveal>
//       </TiltCard>
//     </Reveal>
//   );
// }

// /**
//  * ✅ Usage
//  * Home: <ProjectsSection limit={2} showViewAll />
//  * Projects page: <ProjectsSection /> (shows all)
//  */
// export default function ProjectsSection({ limit, showViewAll = false }) {
//   const isHome = typeof limit === "number";
//   const list = isHome ? projects.slice(0, limit) : projects;

//   // ✅ Smart heading
//   const heading = isHome
//     ? {
//         eyebrow: "Projects",
//         title: "Selected work",
//         desc: "A few projects that show my UI and development style.",
//       }
//     : {
//         eyebrow: "Projects",
//         title: "All projects",
//         desc: "A complete collection of my work—UI, performance and real-world builds.",
//       };

//   return (
//     <section className="py-16">
//       <Container>
//         <Parallax from={14} to={-14}>
//           <Reveal>
//             <SectionHeading
//               eyebrow={heading.eyebrow}
//               title={heading.title}
//               desc={heading.desc}
//             />
//           </Reveal>
//         </Parallax>

//         <div className="grid gap-6 md:grid-cols-2">
//           {list.map((p, i) => (
//             <ProjectCard key={p.slug} p={p} i={i} />
//           ))}
//         </div>

//         {/* ✅ Home पर ही button दिखे */}
//         {showViewAll ? (
//           <Reveal delay={0.25}>
//             <div className="mt-8">
//               <Button href="/projects">View all projects →</Button>
//             </div>
//           </Reveal>
//         ) : null}
//       </Container>
//     </section>
//   );
// }

// "use client";

// import Image from "next/image";
// import { useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Badge from "@/components/ui/Badge";
// import Button from "@/components/ui/Button";
// import { projects } from "@/data/projects";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import TiltCard from "@/components/ui/TiltCard";
// import { blurDataURL } from "@/lib/blur";

// function ProjectCard({ p, i }) {
//   return (
//     <Reveal delay={0.08 + i * 0.08}>
//       <TiltCard className="flex flex-col">
//         {/* IMAGE */}
//         <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
//           <Image
//             src={p.image || "/images/project-placeholder.jpg"}
//             alt={p.title}
//             fill
//             sizes="(max-width: 768px) 100vw, 50vw"
//             placeholder="blur"
//             blurDataURL={blurDataURL(1200, 675)}
//             className="object-cover transition duration-700 ease-out group-hover:scale-110"
//             priority={i === 0}
//           />

//           {/* cinematic overlay */}
//           <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90" />

//           {/* label */}
//           <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur">
//             {p.tags?.[0] || "Project"}
//           </div>
//         </div>

//         {/* CONTENT */}
//         <div className="mt-5 flex-1">
//           <p className="text-lg font-semibold">{p.title}</p>
//           <p className="mt-2 text-sm text-white/70">{p.description}</p>

//           <div className="mt-4 flex flex-wrap gap-2">
//             {(p.tags || []).map((t, idx) => (
//               <Reveal key={`${t}-${idx}`} delay={0.12 + i * 0.06 + idx * 0.02}>
//                 <Badge>{t}</Badge>
//               </Reveal>
//             ))}
//           </div>
//         </div>

//         <Reveal delay={0.18 + i * 0.06}>
//           <div className="mt-6 flex flex-wrap gap-3">
//             <Button href={`/projects/${p.slug}`} variant="outline">
//               Details
//             </Button>
//             {p.liveUrl ? (
//               <Button href={p.liveUrl} variant="ghost">
//                 Live →
//               </Button>
//             ) : null}
//           </div>
//         </Reveal>
//       </TiltCard>
//     </Reveal>
//   );
// }

// function FilterChip({ active, onClick, children }) {
//   return (
//     <button
//       onClick={onClick}
//       className={[
//         "relative shrink-0 rounded-full px-4 py-2 text-sm transition",
//         "border border-border/15 backdrop-blur",
//         active ? "text-foreground" : "text-foreground/75 hover:text-foreground",
//       ].join(" ")}
//     >
//       {/* premium glass base */}
//       <span
//         className={[
//           "absolute inset-0 rounded-full",
//           active ? "bg-foreground/[0.09]" : "bg-foreground/[0.03]",
//         ].join(" ")}
//       />
//       {/* subtle glow ring on active */}
//       {active ? (
//         <span className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[6px]" />
//       ) : null}

//       <span className="relative inline-flex items-center gap-2">
//         <span
//           className={
//             active
//               ? "h-1.5 w-1.5 rounded-full bg-foreground/80"
//               : "h-1.5 w-1.5 rounded-full bg-foreground/45"
//           }
//         />
//         {children}
//       </span>

//       {/* animated underline bar (luxury) */}
//       {active ? (
//         <motion.span
//           layoutId="chip-underline"
//           className="pointer-events-none absolute left-4 right-4 -bottom-[6px] h-[2px] rounded-full bg-foreground/80"
//           transition={{ type: "spring", stiffness: 420, damping: 34 }}
//         />
//       ) : null}
//     </button>
//   );
// }

// /**
//  * ✅ Usage
//  * Home: <ProjectsSection limit={2} showViewAll />
//  * Projects page: <ProjectsSection enableFilters />
//  */
// export default function ProjectsSection({
//   limit,
//   showViewAll = false,
//   enableFilters = false,
// }) {
//   const isHome = typeof limit === "number";

//   const baseList = isHome ? projects.slice(0, limit) : projects;

//   // ✅ Tags => chips
//   const allTags = useMemo(() => {
//     const set = new Set();
//     projects.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
//     return ["All", ...Array.from(set)];
//   }, []);

//   const [activeTag, setActiveTag] = useState("All");

//   const list = useMemo(() => {
//     if (!enableFilters || activeTag === "All") return baseList;
//     return baseList.filter((p) => (p.tags || []).includes(activeTag));
//   }, [baseList, enableFilters, activeTag]);

//   // ✅ Smart heading
//   const heading = isHome
//     ? {
//         eyebrow: "Projects",
//         title: "Selected work",
//         desc: "A few projects that show my UI and development style.",
//       }
//     : {
//         eyebrow: "Projects",
//         title: "All projects",
//         desc: "Browse by stack and explore real builds—UI, performance and scalability.",
//       };

//   return (
//     <section className="py-16">
//       <Container>
//         <Parallax from={14} to={-14}>
//           <Reveal>
//             <SectionHeading
//               eyebrow={heading.eyebrow}
//               title={heading.title}
//               desc={heading.desc}
//             />
//           </Reveal>
//         </Parallax>

//         {/* ✅ Filters only on Projects page */}
//         {enableFilters ? (
//           <div className="mt-6">
//             <div className="relative">
//               {/* fade edges on mobile scroll */}
//               <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
//               <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />

//               <div className="no-scrollbar flex gap-2 overflow-x-auto pb-3">
//                 {allTags.map((t) => (
//                   <FilterChip
//                     key={t}
//                     active={activeTag === t}
//                     onClick={() => setActiveTag(t)}
//                   >
//                     {t}
//                   </FilterChip>
//                 ))}
//               </div>
//             </div>

//             {/* small count (premium) */}
//             <p className="mt-2 text-xs text-muted/60">
//               Showing <span className="text-foreground/85">{list.length}</span>{" "}
//               project{list.length === 1 ? "" : "s"}
//               {activeTag !== "All" ? (
//                 <>
//                   {" "}
//                   in <span className="text-foreground/85">{activeTag}</span>
//                 </>
//               ) : null}
//             </p>
//           </div>
//         ) : null}

//         {/* grid */}
//         <AnimatePresence mode="popLayout">
//           <motion.div
//             key={enableFilters ? activeTag : "grid"}
//             initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
//             animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//             exit={{ opacity: 0, y: -8, filter: "blur(10px)" }}
//             transition={{ duration: 0.25, ease: "easeOut" }}
//             className="mt-8 grid gap-6 md:grid-cols-2"
//           >
//             {list.map((p, i) => (
//               <ProjectCard key={p.slug} p={p} i={i} />
//             ))}
//           </motion.div>
//         </AnimatePresence>

//         {/* ✅ Home पर ही button दिखे */}
//         {showViewAll ? (
//           <Reveal delay={0.25}>
//             <div className="mt-8">
//               <Button href="/projects">View all projects →</Button>
//             </div>
//           </Reveal>
//         ) : null}
//       </Container>
//     </section>
//   );
// }

// "use client";

// import Image from "next/image";
// import { useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Badge from "@/components/ui/Badge";
// import Button from "@/components/ui/Button";
// import { projects } from "@/data/projects";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import TiltCard from "@/components/ui/TiltCard";
// import { blurDataURL } from "@/lib/blur";

// function ProjectCard({ p, i }) {
//   return (
//     <Reveal delay={0.08 + i * 0.08}>
//       <TiltCard className="flex flex-col">
//         {/* IMAGE */}
//         <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
//           <Image
//             src={p.image || "/images/project-placeholder.jpg"}
//             alt={p.title}
//             fill
//             sizes="(max-width: 768px) 100vw, 50vw"
//             placeholder="blur"
//             blurDataURL={blurDataURL(1200, 675)}
//             className="object-cover transition duration-700 ease-out group-hover:scale-110"
//             priority={i === 0}
//           />

//           {/* cinematic overlay */}
//           <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90" />

//           {/* label */}
//           <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur">
//             {p.tags?.[0] || "Project"}
//           </div>
//         </div>

//         {/* CONTENT */}
//         <div className="mt-5 flex-1">
//           <p className="text-lg font-semibold">{p.title}</p>
//           <p className="mt-2 text-sm text-white/70">{p.description}</p>

//           <div className="mt-4 flex flex-wrap gap-2">
//             {(p.tags || []).map((t, idx) => (
//               <Reveal key={`${t}-${idx}`} delay={0.12 + i * 0.06 + idx * 0.02}>
//                 <Badge>{t}</Badge>
//               </Reveal>
//             ))}
//           </div>
//         </div>

//         <Reveal delay={0.18 + i * 0.06}>
//           <div className="mt-6 flex flex-wrap gap-3">
//             <Button href={`/projects/${p.slug}`} variant="outline">
//               Details
//             </Button>
//             {p.liveUrl ? (
//               <Button href={p.liveUrl} variant="ghost">
//                 Live →
//               </Button>
//             ) : null}
//           </div>
//         </Reveal>
//       </TiltCard>
//     </Reveal>
//   );
// }

// function FilterChip({ active, onClick, children }) {
//   return (
//     <button
//       onClick={onClick}
//       className={[
//         "relative shrink-0 rounded-full px-4 py-2 text-sm transition",
//         "border border-border/15 backdrop-blur",
//         active ? "text-foreground" : "text-foreground/75 hover:text-foreground",
//       ].join(" ")}
//     >
//       {/* premium glass base */}
//       <span
//         className={[
//           "absolute inset-0 rounded-full",
//           active ? "bg-foreground/[0.09]" : "bg-foreground/[0.03]",
//         ].join(" ")}
//       />
//       {/* subtle glow ring on active */}
//       {active ? (
//         <span className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[6px]" />
//       ) : null}

//       <span className="relative inline-flex items-center gap-2">
//         <span
//           className={
//             active
//               ? "h-1.5 w-1.5 rounded-full bg-foreground/80"
//               : "h-1.5 w-1.5 rounded-full bg-foreground/45"
//           }
//         />
//         {children}
//       </span>

//       {/* animated underline bar (luxury) */}
//       {active ? (
//         <motion.span
//           layoutId="chip-underline"
//           className="pointer-events-none absolute left-4 right-4 -bottom-[6px] h-[2px] rounded-full bg-foreground/80"
//           transition={{ type: "spring", stiffness: 420, damping: 34 }}
//         />
//       ) : null}
//     </button>
//   );
// }

// /**
//  * ✅ Usage
//  * Home: <ProjectsSection limit={2} showViewAll />
//  * Projects page: <ProjectsSection enableFilters />
//  */
// export default function ProjectsSection({
//   limit,
//   showViewAll = false,
//   enableFilters = false,
// }) {
//   const isHome = typeof limit === "number";

//   const baseList = isHome ? projects.slice(0, limit) : projects;

//   // ✅ Tags => chips
//   const allTags = useMemo(() => {
//     const set = new Set();
//     projects.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
//     return ["All", ...Array.from(set)];
//   }, []);

//   const [activeTag, setActiveTag] = useState("All");

//   const list = useMemo(() => {
//     if (!enableFilters || activeTag === "All") return baseList;
//     return baseList.filter((p) => (p.tags || []).includes(activeTag));
//   }, [baseList, enableFilters, activeTag]);

//   // ✅ Smart heading
//   const heading = isHome
//     ? {
//         eyebrow: "Projects",
//         title: "Selected work",
//         desc: "A few projects that show my UI and development style.",
//       }
//     : {
//         eyebrow: "Projects",
//         title: "All projects",
//         desc: "Browse by stack and explore real builds—UI, performance and scalability.",
//       };

//   return (
//     <section className="py-16">
//       <Container>
//         <Parallax from={14} to={-14}>
//           <Reveal>
//             <SectionHeading
//               eyebrow={heading.eyebrow}
//               title={heading.title}
//               desc={heading.desc}
//             />
//           </Reveal>
//         </Parallax>

//         {/* ✅ Filters only on Projects page */}
//         {enableFilters ? (
//           <div className="mt-6">
//             <div className="relative">
//               {/* fade edges on mobile scroll */}
//               <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
//               <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />

//               <div className="no-scrollbar flex gap-2 overflow-x-auto pb-3">
//                 {allTags.map((t) => (
//                   <FilterChip
//                     key={t}
//                     active={activeTag === t}
//                     onClick={() => setActiveTag(t)}
//                   >
//                     {t}
//                   </FilterChip>
//                 ))}
//               </div>
//             </div>

//             {/* small count (premium) */}
//             <p className="mt-2 text-xs text-muted/60">
//               Showing <span className="text-foreground/85">{list.length}</span>{" "}
//               project{list.length === 1 ? "" : "s"}
//               {activeTag !== "All" ? (
//                 <>
//                   {" "}
//                   in <span className="text-foreground/85">{activeTag}</span>
//                 </>
//               ) : null}
//             </p>
//           </div>
//         ) : null}

//         {/* grid */}
//         <AnimatePresence mode="popLayout">
//           <motion.div
//             key={enableFilters ? activeTag : "grid"}
//             initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
//             animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//             exit={{ opacity: 0, y: -8, filter: "blur(10px)" }}
//             transition={{ duration: 0.25, ease: "easeOut" }}
//             className="mt-8 grid gap-6 md:grid-cols-2"
//           >
//             {list.map((p, i) => (
//               <ProjectCard key={p.slug} p={p} i={i} />
//             ))}
//           </motion.div>
//         </AnimatePresence>

//         {/* ✅ Home पर ही button दिखे */}
//         {showViewAll ? (
//           <Reveal delay={0.25}>
//             <div className="mt-8">
//               <Button href="/projects">View all projects →</Button>
//             </div>
//           </Reveal>
//         ) : null}
//       </Container>
//     </section>
//   );
// }

// "use client";

// import Image from "next/image";
// import { useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Badge from "@/components/ui/Badge";
// import Button from "@/components/ui/Button";
// import { projects } from "@/data/projects";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import TiltCard from "@/components/ui/TiltCard";
// import { blurDataURL } from "@/lib/blur";

// function ProjectCard({ p, i }) {
//   return (
//     <Reveal delay={0.08 + i * 0.08}>
//       <TiltCard className="flex flex-col">
//         {/* IMAGE */}
//         <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
//           <Image
//             src={p.image || "/images/project-placeholder.jpg"}
//             alt={p.title}
//             fill
//             sizes="(max-width: 768px) 100vw, 50vw"
//             placeholder="blur"
//             blurDataURL={blurDataURL(1200, 675)}
//             className="object-cover transition duration-700 ease-out group-hover:scale-110"
//             priority={i === 0}
//           />

//           {/* cinematic overlay */}
//           <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90" />

//           {/* label */}
//           <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur">
//             {p.tags?.[0] || "Project"}
//           </div>
//         </div>

//         {/* CONTENT */}
//         <div className="mt-5 flex-1">
//           <p className="text-lg font-semibold">{p.title}</p>
//           <p className="mt-2 text-sm text-white/70">{p.description}</p>

//           <div className="mt-4 flex flex-wrap gap-2">
//             {(p.tags || []).map((t, idx) => (
//               <Reveal key={`${t}-${idx}`} delay={0.12 + i * 0.06 + idx * 0.02}>
//                 <Badge>{t}</Badge>
//               </Reveal>
//             ))}
//           </div>
//         </div>

//         <Reveal delay={0.18 + i * 0.06}>
//           <div className="mt-6 flex flex-wrap gap-3">
//             <Button href={`/projects/${p.slug}`} variant="outline">
//               Details
//             </Button>
//             {p.liveUrl ? (
//               <Button href={p.liveUrl} variant="ghost">
//                 Live →
//               </Button>
//             ) : null}
//           </div>
//         </Reveal>
//       </TiltCard>
//     </Reveal>
//   );
// }

// function FilterChip({ active, onClick, children }) {
//   return (
//     <button
//       onClick={onClick}
//       className={[
//         "relative shrink-0 rounded-full px-4 py-2 text-sm transition",
//         "border border-border/15 backdrop-blur",
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
//         <span className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[6px]" />
//       ) : null}

//       <span className="relative inline-flex items-center gap-2">
//         <span
//           className={
//             active
//               ? "h-1.5 w-1.5 rounded-full bg-foreground/80"
//               : "h-1.5 w-1.5 rounded-full bg-foreground/45"
//           }
//         />
//         {children}
//       </span>

//       {active ? (
//         <motion.span
//           layoutId="chip-underline"
//           className="pointer-events-none absolute left-4 right-4 -bottom-[6px] h-[2px] rounded-full bg-foreground/80"
//           transition={{ type: "spring", stiffness: 420, damping: 34 }}
//         />
//       ) : null}
//     </button>
//   );
// }

// function SearchBar({ value, onChange, onClear }) {
//   return (
//     <div className="mt-4">
//       <div className="relative">
//         <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/60">
//           🔎
//         </span>

//         <input
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder="Search projects… (title, tech, UI)"
//           className={[
//             "w-full rounded-2xl pl-11 pr-11 py-3 text-sm outline-none transition",
//             "border border-border/12 bg-foreground/[0.03] text-foreground",
//             "placeholder:text-foreground/45",
//             "focus:border-border/25 focus:bg-foreground/[0.05]",
//           ].join(" ")}
//         />

//         {/* clear button */}
//         {value ? (
//           <button
//             onClick={onClear}
//             aria-label="Clear search"
//             className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-border/12 bg-foreground/[0.03] px-2 py-1 text-xs text-foreground/70 hover:bg-foreground/[0.06]"
//           >
//             ✕
//           </button>
//         ) : null}

//         {/* subtle glow */}
//         <span className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-60 blur-xl" />
//       </div>

//       <p className="mt-2 text-xs text-muted/60">
//         Tip: Try searching <span className="text-foreground/80">Next.js</span>,{" "}
//         <span className="text-foreground/80">UI</span>,{" "}
//         <span className="text-foreground/80">Bootstrap</span>
//       </p>
//     </div>
//   );
// }

// /**
//  * ✅ Usage
//  * Home: <ProjectsSection limit={2} showViewAll />
//  * Projects page: <ProjectsSection enableFilters enableSearch />
//  */
// export default function ProjectsSection({
//   limit,
//   showViewAll = false,
//   enableFilters = false,
//   enableSearch = false,
// }) {
//   const isHome = typeof limit === "number";
//   const baseList = isHome ? projects.slice(0, limit) : projects;

//   // ✅ chips list (from ALL projects so future tags auto-add)
//   const allTags = useMemo(() => {
//     const set = new Set();
//     projects.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
//     return ["All", ...Array.from(set)];
//   }, []);

//   const [activeTag, setActiveTag] = useState("All");
//   const [query, setQuery] = useState("");

//   const list = useMemo(() => {
//     let out = baseList;

//     // tag filter
//     if (enableFilters && activeTag !== "All") {
//       out = out.filter((p) => (p.tags || []).includes(activeTag));
//     }

//     // search filter (title + description + tags)
//     if (enableSearch && query.trim()) {
//       const q = query.trim().toLowerCase();
//       out = out.filter((p) => {
//         const t = (p.title || "").toLowerCase();
//         const d = (p.description || "").toLowerCase();
//         const tags = (p.tags || []).join(" ").toLowerCase();
//         return t.includes(q) || d.includes(q) || tags.includes(q);
//       });
//     }

//     return out;
//   }, [baseList, enableFilters, activeTag, enableSearch, query]);

//   const heading = isHome
//     ? {
//         eyebrow: "Projects",
//         title: "Selected work",
//         desc: "A few projects that show my UI and development style.",
//       }
//     : {
//         eyebrow: "Projects",
//         title: "All projects",
//         desc: "Search and filter by stack—explore UI, performance and real builds.",
//       };

//   return (
//     <section className="py-16">
//       <Container>
//         <Parallax from={14} to={-14}>
//           <Reveal>
//             <SectionHeading
//               eyebrow={heading.eyebrow}
//               title={heading.title}
//               desc={heading.desc}
//             />
//           </Reveal>
//         </Parallax>

//         {/* ✅ Filters only on projects page */}
//         {enableFilters ? (
//           <div className="mt-6">
//             <div className="relative">
//               <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
//               <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />

//               <div className="no-scrollbar flex gap-2 overflow-x-auto pb-3">
//                 {allTags.map((t) => (
//                   <FilterChip
//                     key={t}
//                     active={activeTag === t}
//                     onClick={() => setActiveTag(t)}
//                   >
//                     {t}
//                   </FilterChip>
//                 ))}
//               </div>
//             </div>

//             <p className="mt-2 text-xs text-muted/60">
//               Showing <span className="text-foreground/85">{list.length}</span>{" "}
//               project
//               {list.length === 1 ? "" : "s"}
//               {enableFilters && activeTag !== "All" ? (
//                 <>
//                   {" "}
//                   in <span className="text-foreground/85">{activeTag}</span>
//                 </>
//               ) : null}
//               {enableSearch && query.trim() ? (
//                 <>
//                   {" "}
//                   for{" "}
//                   <span className="text-foreground/85">“{query.trim()}”</span>
//                 </>
//               ) : null}
//             </p>
//           </div>
//         ) : null}

//         {/* ✅ Search only on projects page */}
//         {enableSearch ? (
//           <SearchBar
//             value={query}
//             onChange={setQuery}
//             onClear={() => setQuery("")}
//           />
//         ) : null}

//         {/* grid */}
//         <AnimatePresence mode="popLayout">
//           <motion.div
//             key={`${enableFilters ? activeTag : "grid"}|${
//               enableSearch ? query : ""
//             }`}
//             initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
//             animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//             exit={{ opacity: 0, y: -8, filter: "blur(10px)" }}
//             transition={{ duration: 0.25, ease: "easeOut" }}
//             className="mt-8 grid gap-6 md:grid-cols-2"
//           >
//             {list.map((p, i) => (
//               <ProjectCard key={p.slug} p={p} i={i} />
//             ))}
//           </motion.div>
//         </AnimatePresence>

//         {/* ✅ Empty state (premium) */}
//         {list.length === 0 ? (
//           <div className="mt-10 rounded-3xl border border-border/12 bg-foreground/[0.03] p-8 text-center">
//             <p className="text-lg font-semibold text-foreground">
//               No projects found
//             </p>
//             <p className="mt-2 text-sm text-muted/60">
//               Try a different keyword or choose another filter.
//             </p>
//             <div className="mt-5 flex justify-center gap-3">
//               {enableFilters ? (
//                 <button
//                   onClick={() => setActiveTag("All")}
//                   className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
//                 >
//                   Reset filters
//                 </button>
//               ) : null}
//               {enableSearch ? (
//                 <button
//                   onClick={() => setQuery("")}
//                   className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
//                 >
//                   Clear search
//                 </button>
//               ) : null}
//             </div>
//           </div>
//         ) : null}

//         {/* ✅ Home button */}
//         {showViewAll ? (
//           <Reveal delay={0.25}>
//             <div className="mt-8">
//               <Button href="/projects">View all projects →</Button>
//             </div>
//           </Reveal>
//         ) : null}
//       </Container>
//     </section>
//   );
// }

"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { projects } from "@/data/projects";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import TiltCard from "@/components/ui/TiltCard";
import { blurDataURL } from "@/lib/blur";

function ProjectCard({ p, i }) {
  return (
    <Reveal delay={0.08 + i * 0.08}>
      <TiltCard className="flex flex-col">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
          <Image
            src={p.image || "/images/project-placeholder.jpg"}
            alt={p.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={blurDataURL(1200, 675)}
            className="object-cover transition duration-700 ease-out group-hover:scale-110"
            priority={i === 0}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur">
            {p.tags?.[0] || "Project"}
          </div>
        </div>

        <div className="mt-5 flex-1">
          <p className="text-lg font-semibold">{p.title}</p>
          <p className="mt-2 text-sm text-white/70">{p.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(p.tags || []).map((t, idx) => (
              <Reveal key={`${t}-${idx}`} delay={0.12 + i * 0.06 + idx * 0.02}>
                <Badge>{t}</Badge>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.18 + i * 0.06}>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={`/projects/${p.slug}`} variant="outline">
              Details
            </Button>
            {p.liveUrl ? (
              <Button href={p.liveUrl} variant="ghost">
                Live →
              </Button>
            ) : null}
          </div>
        </Reveal>
      </TiltCard>
    </Reveal>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative shrink-0 rounded-full px-4 py-2 text-sm transition",
        "border border-border/15 backdrop-blur",
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
        <span className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[6px]" />
      ) : null}

      <span className="relative inline-flex items-center gap-2">
        <span
          className={
            active
              ? "h-1.5 w-1.5 rounded-full bg-foreground/80"
              : "h-1.5 w-1.5 rounded-full bg-foreground/45"
          }
        />
        {children}
      </span>

      {active ? (
        <motion.span
          layoutId="chip-underline"
          className="pointer-events-none absolute left-4 right-4 -bottom-[6px] h-[2px] rounded-full bg-foreground/80"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      ) : null}
    </button>
  );
}

function SearchBar({ value, onChange, onClear, inputRef }) {
  return (
    <div className="mt-4">
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/60">
          🔎
        </span>

        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search projects… (Press /)"
          className={[
            "w-full rounded-2xl pl-11 pr-16 py-3 text-sm outline-none transition",
            "border border-border/12 bg-foreground/[0.03] text-foreground",
            "placeholder:text-foreground/45",
            "focus:border-border/25 focus:bg-foreground/[0.05]",
          ].join(" ")}
        />

        {value ? (
          <button
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-12 top-1/2 -translate-y-1/2 rounded-xl border border-border/12 bg-foreground/[0.03] px-2 py-1 text-xs text-foreground/70 hover:bg-foreground/[0.06]"
          >
            ✕
          </button>
        ) : null}

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-border/12 bg-foreground/[0.03] px-2 py-1 text-[11px] text-foreground/55">
          /
        </span>

        <span className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-60 blur-xl" />
      </div>

      <p className="mt-2 text-xs text-muted/60">
        Tip: Try <span className="text-foreground/80">Next.js</span>,{" "}
        <span className="text-foreground/80">UI</span>,{" "}
        <span className="text-foreground/80">Bootstrap</span>
      </p>
    </div>
  );
}

/**
 * ✅ Usage
 * Home: <ProjectsSection limit={2} showViewAll />
 * Projects page: <ProjectsSection enableFilters enableSearch syncToUrl enableSlashFocus />
 */
export default function ProjectsSection({
  limit,
  showViewAll = false,
  enableFilters = false,
  enableSearch = false,
  syncToUrl = false,
  enableSlashFocus = false,
}) {
  const isHome = typeof limit === "number";
  const baseList = isHome ? projects.slice(0, limit) : projects;

  // URL helpers
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ✅ chips list (from ALL projects so future tags auto-add)
  const allTags = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    return ["All", ...Array.from(set)];
  }, []);

  // ✅ initial state from URL (only when enabled)
  const initialTag =
    syncToUrl && !isHome ? searchParams.get("tag") || "All" : "All";
  const initialQ = syncToUrl && !isHome ? searchParams.get("q") || "" : "";

  const [activeTag, setActiveTag] = useState(initialTag);
  const [query, setQuery] = useState(initialQ);

  // keep input ref for "/" focus
  const searchRef = useRef(null);

  // ✅ "/" shortcut focus (Vercel style)
  useEffect(() => {
    if (!enableSlashFocus || !enableSearch || isHome) return;

    const onKeyDown = (e) => {
      if (e.key !== "/") return;

      const el = e.target;
      const tag = el?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" || tag === "textarea" || el?.isContentEditable;

      if (isTyping) return;

      e.preventDefault();
      searchRef.current?.focus?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enableSlashFocus, enableSearch, isHome]);

  // ✅ If user uses back/forward and URL changes -> update state
  useEffect(() => {
    if (!syncToUrl || isHome) return;

    const t = searchParams.get("tag") || "All";
    const q = searchParams.get("q") || "";

    setActiveTag((prev) => (prev !== t ? t : prev));
    setQuery((prev) => (prev !== q ? q : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, syncToUrl, isHome]);

  // ✅ Push state -> URL (shareable)
  const lastUrlRef = useRef("");
  useEffect(() => {
    if (!syncToUrl || isHome) return;

    const sp = new URLSearchParams(searchParams.toString());

    // tag
    if (enableFilters && activeTag && activeTag !== "All")
      sp.set("tag", activeTag);
    else sp.delete("tag");

    // query
    const q = enableSearch ? query.trim() : "";
    if (q) sp.set("q", q);
    else sp.delete("q");

    const qs = sp.toString();
    const nextUrl = qs ? `${pathname}?${qs}` : `${pathname}`;

    if (lastUrlRef.current === nextUrl) return;
    lastUrlRef.current = nextUrl;

    router.replace(nextUrl, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    syncToUrl,
    isHome,
    enableFilters,
    enableSearch,
    activeTag,
    query,
    pathname,
    router,
    // do NOT add searchParams here (it loops); we already seed from it above
  ]);

  const list = useMemo(() => {
    let out = baseList;

    if (enableFilters && activeTag !== "All") {
      out = out.filter((p) => (p.tags || []).includes(activeTag));
    }

    if (enableSearch && query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((p) => {
        const t = (p.title || "").toLowerCase();
        const d = (p.description || "").toLowerCase();
        const tags = (p.tags || []).join(" ").toLowerCase();
        return t.includes(q) || d.includes(q) || tags.includes(q);
      });
    }

    return out;
  }, [baseList, enableFilters, activeTag, enableSearch, query]);

  const heading = isHome
    ? {
        eyebrow: "Projects",
        title: "Selected work",
        desc: "A few projects that show my UI and development style.",
      }
    : {
        eyebrow: "Projects",
        title: "All projects",
        desc: "Search and filter by stack—explore UI, performance and real builds.",
      };

  return (
    <section className="py-16">
      <Container>
        <Parallax from={14} to={-14}>
          <Reveal>
            <SectionHeading
              eyebrow={heading.eyebrow}
              title={heading.title}
              desc={heading.desc}
            />
          </Reveal>
        </Parallax>

        {enableFilters ? (
          <div className="mt-6">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />

              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-3">
                {allTags.map((t) => (
                  <FilterChip
                    key={t}
                    active={activeTag === t}
                    onClick={() => setActiveTag(t)}
                  >
                    {t}
                  </FilterChip>
                ))}
              </div>
            </div>

            <p className="mt-2 text-xs text-muted/60">
              Showing <span className="text-foreground/85">{list.length}</span>{" "}
              project
              {list.length === 1 ? "" : "s"}
              {activeTag !== "All" ? (
                <>
                  {" "}
                  in <span className="text-foreground/85">{activeTag}</span>
                </>
              ) : null}
              {enableSearch && query.trim() ? (
                <>
                  {" "}
                  for{" "}
                  <span className="text-foreground/85">“{query.trim()}”</span>
                </>
              ) : null}
            </p>
          </div>
        ) : null}

        {enableSearch ? (
          <SearchBar
            value={query}
            onChange={setQuery}
            onClear={() => setQuery("")}
            inputRef={searchRef}
          />
        ) : null}

        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${enableFilters ? activeTag : "grid"}|${
              enableSearch ? query : ""
            }`}
            initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(10px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-8 grid gap-6 md:grid-cols-2"
          >
            {list.map((p, i) => (
              <ProjectCard key={p.slug} p={p} i={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {list.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border/12 bg-foreground/[0.03] p-8 text-center">
            <p className="text-lg font-semibold text-foreground">
              No projects found
            </p>
            <p className="mt-2 text-sm text-muted/60">
              Try a different keyword or choose another filter.
            </p>

            <div className="mt-5 flex justify-center gap-3">
              {enableFilters ? (
                <button
                  onClick={() => setActiveTag("All")}
                  className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
                >
                  Reset filters
                </button>
              ) : null}
              {enableSearch ? (
                <button
                  onClick={() => setQuery("")}
                  className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
                >
                  Clear search
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {showViewAll ? (
          <Reveal delay={0.25}>
            <div className="mt-8">
              <Button href="/projects">View all projects →</Button>
            </div>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}

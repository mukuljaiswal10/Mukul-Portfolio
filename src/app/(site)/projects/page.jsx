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
//         active
//           ? "text-foreground"
//           : "text-foreground/75 hover:text-foreground",
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
//         <span className={active ? "h-1.5 w-1.5 rounded-full bg-foreground/80" : "h-1.5 w-1.5 rounded-full bg-foreground/45"} />
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

import ProjectsSection from "@/components/sections/ProjectsSection";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import Container from "@/components/ui/Container";
export default function ProjectsPage() {
  return (
    <>
      <Container className="py-10">
        <Parallax from={10} to={-10}>
          <Reveal>
            <Breadcrumbs items={[{ label: "Projects" }]} />
            <h1 className="text-3xl font-bold md:text-4xl">Projects</h1>
            <p className="mt-2 max-w-2xl text-white/70">
            That's projects that show my UI and development style.
            </p>
          </Reveal>
        </Parallax>
      </Container>
      <ProjectsSection enableFilters enableSearch syncToUrl enableSlashFocus />
    </>
  );
}

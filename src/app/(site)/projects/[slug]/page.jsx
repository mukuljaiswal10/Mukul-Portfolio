// import Image from "next/image";
// import Link from "next/link";
// import { notFound } from "next/navigation";

// import Container from "@/components/ui/Container";
// import Badge from "@/components/ui/Badge";
// import Button from "@/components/ui/Button";
// import TiltCard from "@/components/ui/TiltCard";
// import Reveal from "@/components/ui/Reveal";

// import { projects } from "@/data/projects";
// import { projectDetails } from "@/data/projectDetails";

// import ProjectFeedbackWidget from "@/components/projects/ProjectFeedbackWidget";

// function normalizeSlug(s) {
//   return String(s || "")
//     .trim()
//     .toLowerCase()
//     .replace(/%20/g, "-")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-")
//     .replace(/^-|-$|,/g, "");
// }

// function findProjectRobust(paramsSlug) {
//   const raw = String(paramsSlug || "");
//   const decoded = (() => {
//     try {
//       return decodeURIComponent(raw);
//     } catch {
//       return raw;
//     }
//   })();

//   const wanted = normalizeSlug(decoded);

//   return (
//     projects.find((p) => normalizeSlug(p.slug) === wanted) ||
//     projects.find((p) => normalizeSlug(p.slug) === normalizeSlug(raw)) ||
//     null
//   );
// }

// export function generateStaticParams() {
//   return projects.map((p) => ({ slug: p.slug }));
// }

// export default async function ProjectDetailPage({ params }) {
//   // ✅ Next.js 16: params can be Promise
//   const resolvedParams = await params;
//   const project = findProjectRobust(resolvedParams?.slug);

//   if (!project) return notFound();

//   const idx = projects.findIndex((p) => p.slug === project.slug);
//   const prev = idx > 0 ? projects[idx - 1] : null;
//   const next = idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null;

//   const details =
//     projectDetails?.[project.slug] ||
//     projectDetails?.[normalizeSlug(project.slug)] ||
//     null;

//   const heroLine =
//     details?.heroLine ||
//     "A premium build — clean UI, fast UX, and polished interactions.";

//   const whatIBuilt = details?.whatIBuilt || [
//     "Clean layout + component structure",
//     "Responsive UI with modern spacing & typography",
//     "Performance-first approach with reusable patterns",
//   ];

//   const whyItMatters = details?.whyItMatters || [
//     "Better UX improves trust and engagement",
//     "Reusable components make future updates faster",
//     "Clear structure improves scalability and maintenance",
//   ];

//   const techStack =
//     Array.isArray(project.tags) && project.tags.length ? project.tags : [];

//   const stats = Array.isArray(project.stats) ? project.stats : [];

//   const isWip = !!project.wip;
//   const isResponsive = project.responsive !== false; // default true

//   return (
//     <main className="overflow-x-hidden">
//       <Container className="py-10 md:py-12">
//         {/* ✅ Breadcrumbs (NO double Home) */}
//         <nav className="mb-5 text-sm text-white/60">
//           <Link href="/" className="hover:text-white">
//             Home
//           </Link>
//           <span className="mx-2">/</span>
//           <Link href="/projects" className="hover:text-white">
//             Projects
//           </Link>
//           <span className="mx-2">/</span>
//           <span className="text-white/85">{project.title}</span>
//         </nav>

//         {/* =========================
//             ✅ MOBILE ORDER (STRICT)
//             Heading → Preview → What I built → Why it matters → Tech stack → Stats → Feedback → Next/Prev
//            ========================= */}

//         {/* HERO + PREVIEW (desktop me split) */}
//         <div className="grid gap-6 lg:grid-cols-12">
//           {/* HERO (mobile first) */}
//           <div className="lg:col-span-7 min-w-0">
//             <Reveal>
//               <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
//                 <div className="flex flex-wrap gap-2">
//                   {techStack.slice(0, 6).map((t) => (
//                     <Badge key={t}>{t}</Badge>
//                   ))}
//                 </div>

//                 <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#E7C97A] md:text-5xl">
//                   {project.title}
//                 </h1>
//                 <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">
//                   {heroLine}
//                 </p>

//                 <div className="mt-4 flex flex-wrap items-center gap-2">
//                   <Badge>
//                     {isWip
//                       ? project.wipLabel || "Work in progress"
//                       : "Completed"}
//                   </Badge>
//                   <Badge>
//                     {isResponsive
//                       ? "Fully responsive"
//                       : project.responsiveLabel || "Desktop-first"}
//                   </Badge>
//                   {project.liveUrl ? <Badge>Live available</Badge> : null}
//                 </div>

//                 <div className="mt-6 flex flex-wrap gap-3">
//                   {project.liveUrl ? (
//                     <Button asChild variant="gold">
//                       <a
//                         href={project.liveUrl}
//                         target="_blank"
//                         rel="noreferrer"
//                       >
//                         Live Demo
//                       </a>
//                     </Button>
//                   ) : (
//                     <Button variant="ghost" disabled>
//                       Live Demo
//                     </Button>
//                   )}

//                   {project.githubUrl ? (
//                     <Button asChild variant="ghost">
//                       <a
//                         href={project.githubUrl}
//                         target="_blank"
//                         rel="noreferrer"
//                       >
//                         GitHub
//                       </a>
//                     </Button>
//                   ) : null}

//                   <Button asChild variant="ghost">
//                     <Link href="/projects">← Back</Link>
//                   </Button>
//                 </div>
//               </div>
//             </Reveal>
//           </div>

//           {/* PREVIEW (mobile me HERO ke baad, desktop me right) */}
//           <div className="lg:col-span-5 min-w-0">
//             <Reveal>
//               <TiltCard className="h-full">
//                 <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
//                   <div className="mb-3 flex items-center justify-between">
//                     <h3 className="text-base font-semibold text-white">
//                       Preview
//                     </h3>
//                     <Badge>{isWip ? "In progress" : "Complete"}</Badge>
//                   </div>

//                   <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20">
//                     <Image
//                       src={project.image}
//                       alt={project.title}
//                       width={1200}
//                       height={800}
//                       className="h-auto w-full object-cover"
//                       priority
//                     />
//                   </div>

//                   <div className="mt-4 grid gap-3">
//                     {project.liveUrl ? (
//                       <Button asChild variant="gold" className="w-full">
//                         <a
//                           href={project.liveUrl}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           Open Live
//                         </a>
//                       </Button>
//                     ) : (
//                       <Button variant="ghost" className="w-full" disabled>
//                         Live not available
//                       </Button>
//                     )}

//                     {project.githubUrl ? (
//                       <Button asChild variant="ghost" className="w-full">
//                         <a
//                           href={project.githubUrl}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           Open GitHub
//                         </a>
//                       </Button>
//                     ) : null}
//                   </div>

//                   <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
//                     <div className="font-semibold text-white/85">
//                       Quick info
//                     </div>
//                     <div className="mt-2 space-y-1">
//                       <div>Slug: {project.slug}</div>
//                       <div>Type: Website / App</div>
//                       <div>Status: {isWip ? "In progress" : "Completed"}</div>
//                       <div>
//                         Responsive:{" "}
//                         {isResponsive ? "Yes" : "No (Desktop-first)"}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </TiltCard>
//             </Reveal>
//           </div>

//           {/* WHAT I BUILT */}
//           <div className="lg:col-span-12 min-w-0">
//             <Reveal>
//               <TiltCard>
//                 <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
//                   <h3 className="text-lg font-semibold text-white">
//                     What I built
//                   </h3>
//                   <ul className="mt-3 space-y-2 text-sm text-white/75 md:text-base">
//                     {whatIBuilt.map((x, i) => (
//                       <li key={i} className="flex gap-2">
//                         <span className="mt-1 text-[#E7C97A]">•</span>
//                         <span>{x}</span>
//                       </li>
//                     ))}
//                   </ul>

//                   <h3 className="mt-6 text-lg font-semibold text-white">
//                     Why it matters
//                   </h3>
//                   <ul className="mt-3 space-y-2 text-sm text-white/75 md:text-base">
//                     {whyItMatters.map((x, i) => (
//                       <li key={i} className="flex gap-2">
//                         <span className="mt-1 text-[#E7C97A]">•</span>
//                         <span>{x}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </TiltCard>
//             </Reveal>
//           </div>

//           {/* TECH STACK + STATUS */}
//           <div className="lg:col-span-12 min-w-0">
//             <Reveal>
//               <TiltCard>
//                 <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
//                   <h3 className="text-lg font-semibold text-white">
//                     Tech Stack
//                   </h3>

//                   <div className="mt-3 flex flex-wrap gap-2">
//                     {techStack.map((t) => (
//                       <Badge key={t}>{t}</Badge>
//                     ))}
//                   </div>

//                   <div className="mt-6 grid gap-4 md:grid-cols-2">
//                     <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//                       <div className="text-sm font-semibold text-white">
//                         Device support
//                       </div>
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         <Badge>Mobile</Badge>
//                         <Badge>Desktop</Badge>
//                         <Badge>Tablet</Badge>
//                       </div>
//                       <div className="mt-2 text-sm text-white/70">
//                         {isResponsive
//                           ? "Works smoothly across mobile, tablet, and desktop screens."
//                           : project.responsiveDesc ||
//                             "This build is optimized for laptop/desktop workflows."}
//                       </div>
//                     </div>

//                     <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//                       <div className="text-sm font-semibold text-white">
//                         Project status
//                       </div>
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         <Badge>{isWip ? "In progress" : "Complete"}</Badge>
//                         <Badge>
//                           {project.liveUrl ? "Live available" : "Live soon"}
//                         </Badge>
//                       </div>
//                       <div className="mt-2 text-sm text-white/70">
//                         {isWip
//                           ? project.wipNote ||
//                             "Currently building — final polish in progress."
//                           : "Delivered with premium UI polish + clean structure."}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </TiltCard>
//             </Reveal>
//           </div>

//           {/* ✅ PROJECT STATS (ALL PAGES) */}
//           <div className="lg:col-span-12 min-w-0">
//             <Reveal>
//               <TiltCard>
//                 <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
//                   <h3 className="text-lg font-semibold text-white">
//                     Project stats
//                   </h3>

//                   <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                     {(stats.length
//                       ? stats
//                       : [
//                           { label: "Performance", value: 90, suffix: "/100" },
//                           { label: "Pages", value: 6, suffix: "+" },
//                           { label: "Delivery", value: 10, suffix: " days" },
//                         ]
//                     ).map((s, i) => (
//                       <div
//                         key={i}
//                         className="rounded-2xl border border-white/10 bg-white/5 p-5"
//                       >
//                         <div className="text-sm text-white/70">{s.label}</div>
//                         <div className="mt-2 text-4xl font-extrabold text-white">
//                           {s.value}
//                           <span className="ml-1 text-lg font-semibold text-white/70">
//                             {s.suffix || ""}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </TiltCard>
//             </Reveal>
//           </div>

//           {/* ✅ FEEDBACK (slug pass = per-project save) */}
//           <div className="lg:col-span-12 min-w-0">
//             <ProjectFeedbackWidget slug={project.slug} />
//           </div>

//           {/* NEXT / PREV */}
//           {/* <div className="lg:col-span-12 min-w-0">
//             <Reveal>
//               <div className="mt-6 grid gap-4 md:grid-cols-2">
//                 <TiltCard>
//                   <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
//                     <div className="text-sm text-white/60">Previous</div>
//                     {prev ? (
//                       <Link
//                         href={`/projects/${prev.slug}`}
//                         className="mt-2 block text-lg font-semibold text-white hover:text-[#E7C97A]"
//                       >
//                         ← {prev.title}
//                       </Link>
//                     ) : (
//                       <div className="mt-2 text-white/60">
//                         No previous project
//                       </div>
//                     )}
//                   </div>
//                 </TiltCard>

//                 <TiltCard>
//                   <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-right">
//                     <div className="text-sm text-white/60">Next</div>
//                     {next ? (
//                       <Link
//                         href={`/projects/${next.slug}`}
//                         className="mt-2 block text-lg font-semibold text-white hover:text-[#E7C97A]"
//                       >
//                         {next.title} →
//                       </Link>
//                     ) : (
//                       <div className="mt-2 text-white/60">No next project</div>
//                     )}
//                   </div>
//                 </TiltCard>
//               </div>
//             </Reveal>
//           </div> */}

//         </div>
//       </Container>
//     </main>
//   );
// }

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import TiltCard from "@/components/ui/TiltCard";
import Reveal from "@/components/ui/Reveal";

import { projects } from "@/data/projects";
import { projectDetails } from "@/data/projectDetails";

import ProjectFeedbackWidget from "@/components/projects/ProjectFeedbackWidget";

function normalizeSlug(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/%20/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$|,/g, "");
}

function findProjectRobust(paramsSlug) {
  const raw = String(paramsSlug || "");
  const decoded = (() => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();

  const wanted = normalizeSlug(decoded);

  return (
    projects.find((p) => normalizeSlug(p.slug) === wanted) ||
    projects.find((p) => normalizeSlug(p.slug) === normalizeSlug(raw)) ||
    null
  );
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/* =========================
   NEXT / PREV (Responsive Cards)
   ========================= */
function NextPrevCard({ dir = "next", project }) {
  const isPrev = dir === "prev";

  const title =
    project?.title || (isPrev ? "No previous project" : "No next project");

  const desc =
    project?.shortDesc ||
    project?.description ||
    project?.excerpt ||
    "Open this project to see full details, highlights, and tech stack.";

  const imgSrc =
    project?.image ||
    project?.cover ||
    project?.previewImage ||
    "/images/placeholder.png"; // agar placeholder nahi hai to public/images/placeholder.png add kar lena

  const CardInner = (
    <div
      className="
        w-full min-w-0 overflow-hidden rounded-3xl
        border border-white/10 bg-white/[0.03]
        transition duration-300
        hover:bg-white/[0.05] hover:border-white/20
      "
    >
      {/* TOP IMAGE */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={imgSrc}
          alt={project?.title || "Project"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-white/85 backdrop-blur">
          {isPrev ? "Previous" : "Next"}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-white/70">
            {isPrev ? "← Previous project" : "Next project →"}
          </p>
          <span className="text-xs text-white/40">
            {project?.tags?.[0] ? `#${project.tags[0]}` : ""}
          </span>
        </div>

        <h3 className="mt-2 text-lg sm:text-xl font-semibold text-white leading-snug break-words">
          {title}
        </h3>

        <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-white/65 break-words">
          {desc}
        </p>
      </div>
    </div>
  );

  // FULL CARD CLICKABLE
  if (project?.slug) {
    return (
      <Link
        href={`/projects/${project.slug}`}
        className="
          block w-full min-w-0
          focus:outline-none focus:ring-2 focus:ring-white/20
        "
      >
        {CardInner}
      </Link>
    );
  }

  return CardInner;
}

export default async function ProjectDetailPage({ params }) {
  // ✅ Next.js 16: params can be Promise
  const resolvedParams = await params;
  const project = findProjectRobust(resolvedParams?.slug);

  if (!project) return notFound();

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null;

  const details =
    projectDetails?.[project.slug] ||
    projectDetails?.[normalizeSlug(project.slug)] ||
    null;

  const heroLine =
    details?.heroLine ||
    "A premium build — clean UI, fast UX, and polished interactions.";

  const whatIBuilt = details?.whatIBuilt || [
    "Clean layout + component structure",
    "Responsive UI with modern spacing & typography",
    "Performance-first approach with reusable patterns",
  ];

  const whyItMatters = details?.whyItMatters || [
    "Better UX improves trust and engagement",
    "Reusable components make future updates faster",
    "Clear structure improves scalability and maintenance",
  ];

  const techStack =
    Array.isArray(project.tags) && project.tags.length ? project.tags : [];

  const stats = Array.isArray(project.stats) ? project.stats : [];

  const isWip = !!project.wip;
  const isResponsive = project.responsive !== false; // default true

  return (
    <main className="overflow-x-hidden">
      <Container className="py-10 md:py-12">
        {/* ✅ Breadcrumbs (NO double Home) */}
        <nav className="mb-5 text-sm text-white/60">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/projects" className="hover:text-white">
            Projects
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/85">{project.title}</span>
        </nav>

        {/* =========================
            ✅ MOBILE ORDER (STRICT)
            Heading → Preview → What I built → Why it matters → Tech stack → Stats → Feedback → Next/Prev
           ========================= */}

        <div className="grid gap-6 lg:grid-cols-12">
          {/* HERO */}
          <div className="lg:col-span-7 min-w-0">
            <Reveal>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
                <div className="flex flex-wrap gap-2">
                  {techStack.slice(0, 6).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#E7C97A] md:text-5xl">
                  {project.title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">
                  {heroLine}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge>
                    {isWip
                      ? project.wipLabel || "Work in progress"
                      : "Completed"}
                  </Badge>
                  <Badge>
                    {isResponsive
                      ? "Fully responsive"
                      : project.responsiveLabel || "Desktop-first"}
                  </Badge>
                  {project.liveUrl ? <Badge>Live available</Badge> : null}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {project.liveUrl ? (
                    <Button asChild variant="gold">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Live Demo
                      </a>
                    </Button>
                  ) : (
                    <Button variant="ghost" disabled>
                      Live Demo
                    </Button>
                  )}

                  {project.githubUrl ? (
                    <Button asChild variant="ghost">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                      </a>
                    </Button>
                  ) : null}

                  <Button asChild variant="ghost">
                    <Link href="/projects">← Back</Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* PREVIEW */}
          <div className="lg:col-span-5 min-w-0">
            <Reveal>
              <TiltCard className="h-full">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white">
                      Preview
                    </h3>
                    <Badge>{isWip ? "In progress" : "Complete"}</Badge>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={1200}
                      height={800}
                      className="h-auto w-full object-cover"
                      priority
                    />
                  </div>

                  <div className="mt-4 grid gap-3">
                    {project.liveUrl ? (
                      <Button asChild variant="gold" className="w-full">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open Live
                        </a>
                      </Button>
                    ) : (
                      <Button variant="ghost" className="w-full" disabled>
                        Live not available
                      </Button>
                    )}

                    {project.githubUrl ? (
                      <Button asChild variant="ghost" className="w-full">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open GitHub
                        </a>
                      </Button>
                    ) : null}
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                    <div className="font-semibold text-white/85">
                      Quick info
                    </div>
                    <div className="mt-2 space-y-1">
                      <div>Slug: {project.slug}</div>
                      <div>Type: Website / App</div>
                      <div>Status: {isWip ? "In progress" : "Completed"}</div>
                      <div>
                        Responsive:{" "}
                        {isResponsive ? "Yes" : "No (Desktop-first)"}
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>

          {/* WHAT I BUILT */}
          <div className="lg:col-span-12 min-w-0">
            <Reveal>
              <TiltCard>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
                  <h3 className="text-lg font-semibold text-white">
                    What I built
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-white/75 md:text-base">
                    {whatIBuilt.map((x, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1 text-[#E7C97A]">•</span>
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-6 text-lg font-semibold text-white">
                    Why it matters
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-white/75 md:text-base">
                    {whyItMatters.map((x, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1 text-[#E7C97A]">•</span>
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          </div>

          {/* TECH STACK + STATUS */}
          <div className="lg:col-span-12 min-w-0">
            <Reveal>
              <TiltCard>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
                  <h3 className="text-lg font-semibold text-white">
                    Tech Stack
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {techStack.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm font-semibold text-white">
                        Device support
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge>Mobile</Badge>
                        <Badge>Desktop</Badge>
                        <Badge>Tablet</Badge>
                      </div>
                      <div className="mt-2 text-sm text-white/70">
                        {isResponsive
                          ? "Works smoothly across mobile, tablet, and desktop screens."
                          : project.responsiveDesc ||
                            "This build is optimized for laptop/desktop workflows."}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm font-semibold text-white">
                        Project status
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge>{isWip ? "In progress" : "Complete"}</Badge>
                        <Badge>
                          {project.liveUrl ? "Live available" : "Live soon"}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-white/70">
                        {isWip
                          ? project.wipNote ||
                            "Currently building — final polish in progress."
                          : "Delivered with premium UI polish + clean structure."}
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>

          {/* PROJECT STATS */}
          <div className="lg:col-span-12 min-w-0">
            <Reveal>
              <TiltCard>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
                  <h3 className="text-lg font-semibold text-white">
                    Project stats
                  </h3>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(stats.length
                      ? stats
                      : [
                          { label: "Performance", value: 90, suffix: "/100" },
                          { label: "Pages", value: 6, suffix: "+" },
                          { label: "Delivery", value: 10, suffix: " days" },
                        ]
                    ).map((s, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5"
                      >
                        <div className="text-sm text-white/70">{s.label}</div>
                        <div className="mt-2 text-4xl font-extrabold text-white">
                          {s.value}
                          <span className="ml-1 text-lg font-semibold text-white/70">
                            {s.suffix || ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>

          {/* FEEDBACK */}
          <div className="lg:col-span-12 min-w-0">
            <ProjectFeedbackWidget slug={project.slug} />
          </div>

          {/* ✅ NEW NEXT / PREV (FIXED RESPONSIVE) */}
          {/* <div className="lg:col-span-12 min-w-0">
            <Reveal>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <TiltCard>
                    <NextPrevCard dir="prev" project={prev} />
                  </TiltCard>
                </div>

                <div className="min-w-0">
                  <TiltCard>
                    <NextPrevCard dir="next" project={next} />
                  </TiltCard>
                </div>
              </div>
            </Reveal>
          </div> */}
          {/* NEXT / PREV (image top + full clickable, hide if null) */}
          {prev || next ? (
            <div className="lg:col-span-12 min-w-0">
              <Reveal>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {/* PREVIOUS */}
                  {prev ? (
                    <TiltCard className="h-full">
                      <Link
                        href={`/projects/${prev.slug}`}
                        className="group block h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:bg-white/[0.07]"
                      >
                        {/* IMAGE */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/20">
                          <Image
                            src={prev.image}
                            alt={prev.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                          {/* Badge */}
                          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
                            ← Previous
                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="p-5">
                          <div className="text-sm text-white/60">
                            Previous project
                          </div>

                          <div className="mt-1 text-xl font-extrabold tracking-tight text-[#E7C97A]">
                            {prev.title}
                          </div>

                          <p className="mt-2 text-sm leading-relaxed text-white/70">
                            {projectDetails?.[prev.slug]?.heroLine ||
                              "Open this project to see full details, highlights, and tech stack."}
                          </p>

                          {/* Footer hint */}
                          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white">
                            Open project{" "}
                            <span className="transition group-hover:-translate-x-1">
                              →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </TiltCard>
                  ) : (
                    <div className="hidden md:block" />
                  )}

                  {/* NEXT */}
                  {next ? (
                    <TiltCard className="h-full">
                      <Link
                        href={`/projects/${next.slug}`}
                        className="group block h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:bg-white/[0.07]"
                      >
                        {/* IMAGE */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/20">
                          <Image
                            src={next.image}
                            alt={next.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                          {/* Badge */}
                          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
                            Next →
                          </div>

                          {/* Tech tag (optional look like screenshot) */}
                          {Array.isArray(next.tags) && next.tags.length ? (
                            <div className="absolute right-4 bottom-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur">
                              #{next.tags[0]}
                            </div>
                          ) : null}
                        </div>

                        {/* CONTENT */}
                        <div className="p-5">
                          <div className="text-sm text-white/60">
                            Next project →
                          </div>

                          <div className="mt-1 text-xl font-extrabold tracking-tight text-[#E7C97A]">
                            {next.title}
                          </div>

                          <p className="mt-2 text-sm leading-relaxed text-white/70">
                            {projectDetails?.[next.slug]?.heroLine ||
                              "A modern build with clean UI, responsive layout and smooth interactions."}
                          </p>
                        </div>
                      </Link>
                    </TiltCard>
                  ) : null}
                </div>
              </Reveal>
            </div>
          ) : null}
        </div>
      </Container>
    </main>
  );
}

// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import Badge from "@/components/ui/Badge";
// import { skills } from "@/data/skills";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";

// export default function SkillsSection() {
//   return (
//     <section className="py-16">
//       <Container>
//         <Parallax from={16} to={-16}>
//           <Reveal>
//             <SectionHeading
//               eyebrow="Skills"
//               title="Stack I use to build modern websites"
//               desc="I prefer simple, reliable tools that ship fast."
//             />
//           </Reveal>
//         </Parallax>

//         <div className="grid gap-6 md:grid-cols-2">
//           {skills.map((group, i) => (
//             <Reveal key={group.title} delay={0.08 + i * 0.08}>
//               <Card>
//                 <p className="text-lg font-semibold">{group.title}</p>
//                 <div className="mt-4 flex flex-wrap gap-2">
//                   {group.items.map((it, idx) => (
//                     <Reveal key={it} delay={0.12 + i * 0.06 + idx * 0.02}>
//                       <Badge>{it}</Badge>
//                     </Reveal>
//                   ))}
//                 </div>
//               </Card>
//             </Reveal>
//           ))}
//         </div>
//       </Container>
//     </section>
//   );
// }

"use client";

import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import { skillGroups } from "@/data/skills";

function SkillPill({ name, tag }) {
  return (
    <Magnetic className="relative">
      <div
        className="
          group relative overflow-hidden rounded-2xl
          border border-border/10 bg-foreground/[0.03]
          px-4 py-3 transition
          hover:border-border/25 hover:bg-foreground/[0.06]
        "
      >
        {/* glow */}
        <div className="pointer-events-none absolute -inset-24 opacity-0 transition duration-500 group-hover:opacity-100">
          <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/12 blur-3xl" />
        </div>

        <div className="relative flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <p className="mt-0.5 text-xs text-muted/70">{tag}</p>
          </div>

          <span className="h-2.5 w-2.5 rounded-full bg-foreground/60 opacity-70" />
        </div>

        {/* premium bottom shine line */}
        <span className="pointer-events-none absolute inset-x-6 bottom-2 h-px opacity-60">
          <span className="glow-line block h-px w-full" />
        </span>
      </div>
    </Magnetic>
  );
}

function GroupCard({ title, subtitle, items }) {
  return (
    <div
      className="
        relative overflow-hidden rounded-3xl
        border border-border/10 bg-foreground/[0.02]
        p-6
      "
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-16 left-10 h-40 w-40 rounded-full bg-foreground/10 blur-3xl" />
        <div className="absolute -bottom-16 right-10 h-40 w-40 rounded-full bg-foreground/10 blur-3xl" />
      </div>

      <div className="relative">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted/70">{subtitle}</p>
          </div>

          <span className="rounded-full border border-border/10 bg-foreground/[0.03] px-3 py-1 text-xs text-muted/70">
            {items.length} Skills
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((s) => (
            <SkillPill key={s.name} name={s.name} tag={s.tag} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  return (
    <section id="skills" className="relative py-16 md:py-20">
      <Container>
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-sm text-muted/70">Skills</p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              MERN + Modern Dev Stack
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-4 text-muted/70">
              Full-stack development with clean UI, strong backend logic, secure
              APIs, and modern tooling.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {skillGroups.map((g, i) => (
            <Reveal key={g.title} delay={0.14 + i * 0.05}>
              <GroupCard {...g} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

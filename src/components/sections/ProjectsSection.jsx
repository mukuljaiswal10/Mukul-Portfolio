import Image from "next/image";
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
        {/* IMAGE */}
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

          {/* cinematic overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90" />

          {/* label */}
          <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur">
            {p.tags?.[0] || "Project"}
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-5 flex-1">
          <p className="text-lg font-semibold">{p.title}</p>
          <p className="mt-2 text-sm text-white/70">{p.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {p.tags.map((t, idx) => (
              <Reveal key={t} delay={0.12 + i * 0.06 + idx * 0.02}>
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

export default function ProjectsSection() {
  return (
    <section className="py-16">
      <Container>
        <Parallax from={14} to={-14}>
          <Reveal>
            <SectionHeading
              eyebrow="Projects"
              title="Selected work"
              desc="A few projects that show my UI and development style."
            />
          </Reveal>
        </Parallax>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.slice(0, 4).map((p, i) => (
            <ProjectCard key={p.slug} p={p} i={i} />
          ))}
        </div>

        <Reveal delay={0.25}>
          <div className="mt-8">
            <Button href="/projects">View all projects →</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

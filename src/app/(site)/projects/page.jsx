import Image from "next/image";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { projects } from "@/data/projects";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import TiltCard from "@/components/ui/TiltCard";
import { blurDataURL } from "@/lib/blur";

export default function ProjectsPage() {
  return (
    <Container className="py-10">
      <Parallax from={10} to={-10}>
        <Reveal>
          <Breadcrumbs items={[{ label: "Projects" }]} />
          <h1 className="text-3xl font-bold md:text-4xl">Projects</h1>
          <p className="mt-2 max-w-2xl text-white/70">
            Some of my selected work. Click “Details” to see highlights.
          </p>
        </Reveal>
      </Parallax>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={0.08 + i * 0.08}>
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
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90" />
              </div>

              <div className="mt-5 flex-1">
                <p className="text-lg font-semibold">{p.title}</p>
                <p className="mt-2 text-sm text-white/70">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              </div>

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
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}

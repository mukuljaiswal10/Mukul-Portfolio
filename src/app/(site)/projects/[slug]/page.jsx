import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import TiltCard from "@/components/ui/TiltCard";

import ProjectStats from "@/components/projects/ProjectStats";
import { blurDataURL } from "@/lib/blur";
import { projects } from "@/data/projects";

export function generateMetadata({ params }) {
  const p = projects.find((x) => x.slug === params.slug);
  if (!p) return { title: "Project not found" };
  return {
    title: `${p.title} | Projects`,
    description: p.description,
  };
}

export default function ProjectDetails({ params }) {
  const idx = projects.findIndex((x) => x.slug === params.slug);
  if (idx === -1) return notFound();

  const p = projects[idx];
  const prev = projects[idx - 1] || null;
  const next = projects[idx + 1] || null;

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src={p.image || "/images/project-placeholder.jpg"}
            alt={p.title}
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={blurDataURL(1600, 900)}
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/65 to-black" />
        </div>

        <Container className="relative py-10 md:py-14">
          <Parallax from={10} to={-10}>
            <Reveal>
              <Breadcrumbs
                items={[
                  { label: "Projects", href: "/projects" },
                  { label: p.title },
                ]}
              />

              <div className="mt-4 max-w-3xl">
                <div className="flex flex-wrap gap-2">
                  {(p.tags || []).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>

                <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                  {p.title}
                </h1>

                <p className="mt-3 text-white/75">{p.description}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {p.liveUrl ? (
                    <Button href={p.liveUrl}>Live Demo</Button>
                  ) : null}

                  {p.githubUrl ? (
                    <Button href={p.githubUrl} variant="outline">
                      GitHub
                    </Button>
                  ) : (
                    <Button href="/contact" variant="outline">
                      Request Code / Details
                    </Button>
                  )}

                  <Button href="/projects" variant="ghost">
                    ← Back
                  </Button>
                </div>
              </div>
            </Reveal>
          </Parallax>

          {/* ANIMATED STATS */}
          <ProjectStats
            stats={
              p.stats?.length
                ? p.stats
                : [
                    { label: "Performance", value: 90, suffix: "/100" },
                    { label: "Sections", value: 8, suffix: "+" },
                    { label: "Delivery", value: 7, suffix: " days" },
                  ]
            }
          />
        </Container>
      </section>

      {/* CONTENT */}
      <Container className="py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left */}
          <div className="md:col-span-2">
            <Reveal>
              <Card>
                <p className="text-lg font-semibold">Highlights</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/70">
                  {(p.highlights || []).map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </Card>
            </Reveal>

            <Reveal delay={0.12}>
              <Card className="mt-6">
                <p className="text-lg font-semibold">Tech Stack</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(p.tags || []).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <p className="mt-4 text-sm text-white/70">
                  Want this layout for your site? I can adapt this into any
                  niche (portfolio, agency, business, etc.).
                </p>
              </Card>
            </Reveal>
          </div>

          {/* Right */}
          <div>
            <Reveal delay={0.08}>
              <TiltCard>
                <p className="text-lg font-semibold">Preview</p>
                <div className="mt-4 relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                  <Image
                    src={p.image || "/images/project-placeholder.jpg"}
                    alt={`${p.title} preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={blurDataURL(1200, 750)}
                    className="object-cover transition duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90" />
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  {p.liveUrl ? (
                    <Button href={p.liveUrl}>Open Live</Button>
                  ) : null}
                  {p.githubUrl ? (
                    <Button href={p.githubUrl} variant="outline">
                      Open GitHub
                    </Button>
                  ) : (
                    <Button href="/contact" variant="outline">
                      Contact for code
                    </Button>
                  )}
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>

        {/* NEXT / PREV NAV */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {prev ? (
            <Reveal>
              <Link href={`/projects/${prev.slug}`} className="block">
                <TiltCard className="p-5">
                  <p className="text-sm text-white/60">← Previous</p>
                  <p className="mt-1 text-lg font-semibold">{prev.title}</p>
                  <p className="mt-2 text-sm text-white/70 line-clamp-2">
                    {prev.description}
                  </p>
                </TiltCard>
              </Link>
            </Reveal>
          ) : (
            <div />
          )}

          {next ? (
            <Reveal delay={0.08}>
              <Link href={`/projects/${next.slug}`} className="block">
                <TiltCard className="p-5">
                  <p className="text-sm text-white/60 text-right">Next →</p>
                  <p className="mt-1 text-lg font-semibold text-right">
                    {next.title}
                  </p>
                  <p className="mt-2 text-sm text-white/70 line-clamp-2 text-right">
                    {next.description}
                  </p>
                </TiltCard>
              </Link>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </>
  );
}

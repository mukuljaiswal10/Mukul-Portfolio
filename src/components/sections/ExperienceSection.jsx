import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/ui/Card";
import { experience } from "@/data/experience";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";

export default function ExperienceSection() {
  return (
    <section className="py-16">
      <Container>
        <Parallax from={14} to={-14}>
          <Reveal>
            <SectionHeading
              eyebrow="Experience"
              title="Work timeline"
              desc="A quick overview of what I’ve been building."
            />
          </Reveal>
        </Parallax>

        <div className="grid gap-6">
          {experience.map((e, i) => (
            <Reveal key={e.role + e.company} delay={0.08 + i * 0.08}>
              <Card>
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold">{e.role}</p>
                    <p className="text-white/60">{e.company}</p>
                  </div>
                  <p className="text-sm text-white/50">{e.period}</p>
                </div>

                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/70">
                  {e.points.map((p, idx) => (
                    <Reveal key={p} delay={0.12 + i * 0.06 + idx * 0.03}>
                      <li>{p}</li>
                    </Reveal>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

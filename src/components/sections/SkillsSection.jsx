import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { skills } from "@/data/skills";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";

export default function SkillsSection() {
  return (
    <section className="py-16">
      <Container>
        <Parallax from={16} to={-16}>
          <Reveal>
            <SectionHeading
              eyebrow="Skills"
              title="Stack I use to build modern websites"
              desc="I prefer simple, reliable tools that ship fast."
            />
          </Reveal>
        </Parallax>

        <div className="grid gap-6 md:grid-cols-2">
          {skills.map((group, i) => (
            <Reveal key={group.title} delay={0.08 + i * 0.08}>
              <Card>
                <p className="text-lg font-semibold">{group.title}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((it, idx) => (
                    <Reveal key={it} delay={0.12 + i * 0.06 + idx * 0.02}>
                      <Badge>{it}</Badge>
                    </Reveal>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

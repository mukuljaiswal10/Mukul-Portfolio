import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/shared/SectionHeading";
import Badge from "@/components/ui/Badge";
import ContactSection from "@/components/sections/ContactSection";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";

const services = [
  {
    title: "Portfolio / Business Website",
    desc: "Modern, responsive website with clean UI and fast load time.",
    tags: ["Next.js", "Tailwind", "SEO"],
  },
  {
    title: "Landing Page (Lead focused)",
    desc: "High-converting landing pages with clear CTA and sections.",
    tags: ["UI/UX", "Responsive", "Performance"],
  },
  {
    title: "WordPress Development",
    desc: "Customizations, speed optimization and clean sections.",
    tags: ["WordPress", "Elementor", "Optimization"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Container className="py-10">
        <Parallax from={10} to={-10}>
          <Reveal>
            <Breadcrumbs items={[{ label: "Services" }]} />
            <h1 className="text-3xl font-bold md:text-4xl">Services</h1>
            <p className="mt-2 max-w-2xl text-white/70">
              What I can build for you.
            </p>
          </Reveal>
        </Parallax>
      </Container>

      <section className="py-10">
        <Container>
          <Parallax from={10} to={-10}>
            <Reveal>
              <SectionHeading
                eyebrow="Offerings"
                title="What I deliver"
                desc="Professional UI, clean code, and performance-first approach."
              />
            </Reveal>
          </Parallax>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={0.08 + i * 0.08}>
                <Card>
                  <p className="text-lg font-semibold">{s.title}</p>
                  <p className="mt-2 text-sm text-white/70">{s.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <ContactSection />
    </>
  );
}

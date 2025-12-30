import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import LuxuryButton from "../ui/LuxuryButton";

export default function AboutSection() {
  return (
    <section className="py-16">
      <Container>
        <Parallax from={18} to={-18}>
          <Reveal>
            <SectionHeading
              eyebrow="About"
              title="I’m a developer focused on clean UI + real performance."
              desc="I build portfolio sites, landing pages and business websites with modern stacks."
            />
          </Reveal>
        </Parallax>

        <div className="grid gap-6 md:grid-cols-3">
          <Reveal delay={0.08} className="md:col-span-2">
            <Card className="h-full">
              <p className="text-white/80">
                I work with Next.js / React and Tailwind for modern frontends,
                plus WordPress for client-friendly content management. My focus
                is shipping production-ready work: responsive, fast, and clean
                code.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {/* <Button href="/about" variant="outline">
                  Read More
                </Button> */}
                <LuxuryButton href="/about" variant="primary">Read More</LuxuryButton>
                {/* <Button href="/resume/Mukul-Jaiswal-Resume.pdf" variant="ghost">
                  Download Resume →
                </Button> */}
                <LuxuryButton href="/resume/Mukul-Jaiswal-Resume.pdf" variant="outline">Download Resume →</LuxuryButton>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.16}>
            <Card className="h-full">
              <p className="text-sm font-semibold text-white/70">Quick Info</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>📍 India</li>
                <li>⚡ Next.js + Tailwind</li>
                <li>🧩 WordPress Customization</li>
                <li>🚀 Speed Optimization</li>
              </ul>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";

export default function AboutPage() {
  return (
    <>
      <Container className="py-10">
        <Parallax from={10} to={-10}>
          <Reveal>
            <Breadcrumbs items={[{ label: "About" }]} />
            <h1 className="text-3xl font-bold md:text-4xl">About</h1>
            <p className="mt-2 max-w-2xl text-white/70">
              I’m Mukul Jaiswal. I build responsive and fast websites with
              modern stacks.
            </p>
          </Reveal>
        </Parallax>
      </Container>

      <AboutSection />
      <SkillsSection />
      <ExperienceSection id="experience"/>
    </>
  );
}

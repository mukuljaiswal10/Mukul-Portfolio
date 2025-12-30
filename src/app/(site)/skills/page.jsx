// import SkillsSection from "@/components/sections/SkillsSection";

// export default function SkillsPage() {
//   return <SkillsSection showViewAll={false} />;
// }

import Container from "@/components/ui/Container";
import SkillsSection from "@/components/sections/SkillsSection";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";

export default function SkillsPage() {
  return (
    <>
      {/* Top heading like About page */}
      <section className="pt-10 pb-6">
        <Container className="py-10">
          <Parallax from={10} to={-10}>
            <Reveal>
              <Breadcrumbs items={[{ label: "Skills" }]} />
              <h1 className="text-3xl font-bold md:text-4xl">Skills</h1>
              <p className="mt-2 max-w-2xl text-white/70">
                My core stack, tooling, and the UI systems I use to ship
                production-ready work.
              </p>
            </Reveal>
          </Parallax>
        </Container>
      </section>

      {/* Full skills list */}
      <SkillsSection />
    </>
  );
}

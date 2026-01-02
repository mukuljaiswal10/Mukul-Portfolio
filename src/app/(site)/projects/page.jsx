import ProjectsSection from "@/components/sections/ProjectsSection";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import Container from "@/components/ui/Container";
export default function ProjectsPage() {
  return (
    <>
      <Container className="py-10">
        <Parallax from={10} to={-10}>
          <Reveal>
            <Breadcrumbs items={[{ label: "Projects" }]} />
            <h1 className="text-3xl font-bold md:text-4xl">Projects</h1>
            {/* <p className="mt-2 max-w-2xl text-white/70">
            That's projects that show my UI and development style.
            </p> */}
          </Reveal>
        </Parallax>
      </Container>
      <ProjectsSection enableFilters enableSearch syncToUrl enableSlashFocus />
    </>
  );
}

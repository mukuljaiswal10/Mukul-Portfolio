import Hero from "@/components/sections/Hero";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import FaqSection from "@/components/sections/FaqSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <SkillsSection limit={2} showViewAll/>
      <ProjectsSection limit={2} showViewAll/>
      <TestimonialsSection />
      <FaqSection/>
      <ContactSection />
    </>
  );
}

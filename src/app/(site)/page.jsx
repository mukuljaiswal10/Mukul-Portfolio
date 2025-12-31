import Hero from "@/components/sections/Hero";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import FaqSection from "@/components/sections/FaqSection";
import SmartHomeUX from "@/components/ai/SmartHomeUX";
import ExperienceSection from "@/components/sections/ExperienceSection";
import BlogPreviewSection from "@/components/sections/BlogPreviewSection";
export default function HomePage() {
  return (
    <>
      <SmartHomeUX />
      <Hero id="home" />
      <AboutSection id="about" />
      <SkillsSection limit={2} showViewAll id="skills" />
      <ProjectsSection limit={2} showViewAll id="projects" />
      <BlogPreviewSection id="blog-preview"/>
      <ExperienceSection limit={1} id="experience" showViewAll viewAllHref="/about#experience"/>
      <TestimonialsSection id="testimonials" />
      <FaqSection id="faq" />
      <ContactSection id="contact" />
    </>
  );
}

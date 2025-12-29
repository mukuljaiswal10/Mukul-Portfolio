import Container from "@/components/ui/Container";
import SocialLinks from "@/components/shared/SocialLinks";

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <Container className="py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-white/70">
              © {new Date().getFullYear()} Mukul Jaiswal. All rights reserved.
            </p>
            <p className="mt-1 text-sm text-white/50">
              Built with Next.js + Tailwind
            </p>
          </div>
          <SocialLinks />
        </div>
      </Container>
    </footer>
  );
}

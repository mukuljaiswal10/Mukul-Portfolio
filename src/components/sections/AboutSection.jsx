"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import LuxuryButton from "../ui/LuxuryButton";
import ResumeGateButton from "@/components/resume/ResumeGateButton";

export default function AboutSection({ id = "about" }) {
  const pathname = usePathname();
  const isAboutPage = pathname === "/about";

  const [open, setOpen] = useState(false);
  const detailsRef = useRef(null);

  const toggle = () => setOpen((v) => !v);

  // ✅ open होने पर smooth scroll (premium)
  useEffect(() => {
    if (!isAboutPage) return;
    if (!open) return;
    const t = setTimeout(() => {
      detailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 80);
    return () => clearTimeout(t);
  }, [open, isAboutPage]);

  return (
    <section id={id} className="py-16">
      <Container>
        <Parallax from={18} to={-18}>
          <Reveal>
            <SectionHeading
              // eyebrow="About"
              title="I’m a Developer Focused On Clean UI + Real Performance."
              desc="I Build Portfolio sites, E-commerce Website, API Development, Landing pages, Business websites, etc with modern stacks."
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

              {/* ✅ About page only: Expandable long description (same card) */}
              {isAboutPage ? (
                <div ref={detailsRef} className="mt-5">
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="relative mt-2 rounded-2xl border border-border/12 bg-foreground/[0.02] p-4">
                          {/* subtle glow */}
                          <div className="pointer-events-none absolute -inset-14 opacity-50 blur-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_55%)]" />

                          <div className="relative">
                            <p className="text-sm leading-relaxed text-white/80">
                              I build premium, high-performance websites and web
                              apps with a sharp eye for UI and scalability. I
                              focus on clean component architecture, reusable
                              design systems, and fast loading experiences.
                            </p>

                            <ul className="mt-4 space-y-2 text-sm text-white/70">
                              <li>
                                ✅ Mobile-first responsive UI (all devices)
                              </li>
                              <li>✅ SEO + Core Web Vitals optimization</li>
                              <li>✅ API integration + scalable structure</li>
                              <li>✅ Clean code, maintainable components</li>
                              <li>✅ Deployments: Vercel + production ready</li>
                            </ul>

                            <p className="mt-4 text-sm text-white/70">
                              If you want a premium look + smooth UX, I can help
                              you build it end-to-end.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {/* collapsed hint (premium) */}
                  {!open ? (
                    <div className="mt-4 rounded-2xl border border-border/10 bg-foreground/[0.02] px-4 py-3 text-xs text-white/60">
                      Tip: Click{" "}
                      <span className="text-white/80">Read More</span> to expand
                      my full story.
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                {/* ✅ Home: redirect | ✅ About: toggle expand */}
                {isAboutPage ? (
                  <LuxuryButton
                    variant="primary"
                    type="button"
                    onClick={toggle}
                    aria-expanded={open}
                    className="cursor-pointer select-none"
                  >
                    {open ? "Read Less" : "Read More"}
                  </LuxuryButton>
                ) : (
                  <LuxuryButton href="/about" variant="primary">
                    Read More
                  </LuxuryButton>
                )}

                <ResumeGateButton
                  variant="outline"
                  className="cursor-pointer select-none"
                >
                  Download Resume →
                </ResumeGateButton>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.16}>
            <Card className="h-full">
              <p className="text-sm font-semibold text-white/70">Quick Info</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>📍 India</li>
                <li>⚡ FullStack (MERN)</li>
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

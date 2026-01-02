"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import HeroPortrait from "@/components/sections/HeroPortrait";
import { motion } from "framer-motion";
import ShimmerText from "@/components/ui/ShimmerText";
import Text3D from "@/components/ui/Text3D";
import StatCard from "@/components/ui/StatCard";
import LuxuryButton from "@/components/ui/LuxuryButton";

export default function Hero({ id = "home" }) {
  const [mounted, setMounted] = useState(false);

  // ✅ mount gate (fix hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ hash -> auto scroll (/#home)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollIfMatch = () => {
      const hash = (window.location.hash || "").replace("#", "");
      if (!hash) return;
      if (hash !== id) return;

      const el = document.getElementById(id);
      if (!el) return;

      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    };

    scrollIfMatch();
    window.addEventListener("hashchange", scrollIfMatch);
    return () => window.removeEventListener("hashchange", scrollIfMatch);
  }, [id]);

  const goldStyle = {
    "--mj-gold": "180deg,#FFE7A3 0%,#E9C86A 45%,#B8892E 100%",
  };

  return (
    <section id={id} className="relative overflow-hidden scroll-mt-24">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-foreground/10 blur-3xl" />
      </div>

      <Container className="relative py-14 md:py-20 lg:py-24">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          {/* ✅ BEFORE MOUNT (static) -> no hydration mismatch */}
          {!mounted ? (
            <>
              {/* LEFT */}
              <div className="max-w-2xl">
                <Badge>Full Stack • WordPress</Badge>

                <h1
                  style={goldStyle}
                  className={[
                    "relative mt-4 max-w-[22ch] text-4xl font-bold leading-[1.06] tracking-tight md:text-6xl",
                    "text-transparent bg-clip-text bg-[linear-gradient(var(--mj-gold))]",
                  ].join(" ")}
                >
                  Hi, I’m Mukul — I build fast, modern websites.
                </h1>

                <p className="mt-5 text-muted/70 md:text-lg">
                  “I build premium, high-performance web apps with a sharp eye
                  for UI and scalability—powered by React/Next.js, Tailwind,
                  Node/Express & MongoDB. 🚀✨”
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <LuxuryButton href="/projects" variant="primary">
                    View Projects
                  </LuxuryButton>
                  <LuxuryButton href="/contact" variant="outline">
                    Contact Me
                  </LuxuryButton>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <StatCard value="10+" label="Projects" />
                  <StatCard value="10+" label="Performance" />
                  <StatCard value="Responsive" label="All devices" />
                </div>
              </div>

              {/* RIGHT */}
              <div className="lg:justify-self-end lg:mr-2 xl:mr-4">
                <HeroPortrait src="/images/hero-portrait.jpg" />
              </div>
            </>
          ) : (
            <>
              {/* ✅ AFTER MOUNT (full premium animations) */}
              {/* LEFT */}
              <Parallax from={18} to={-18}>
                <div className="max-w-2xl">
                  <Reveal>
                    <Badge>Full Stack • WordPress</Badge>
                  </Reveal>

                  <motion.h1
                    style={goldStyle}
                    className={[
                      "relative mt-4 max-w-[22ch] text-4xl font-bold leading-[1.06] tracking-tight md:text-6xl",
                      "text-transparent bg-clip-text bg-[linear-gradient(var(--mj-gold))]",
                      "[&_*]:!text-transparent [&_*]:!bg-clip-text [&_*]:!bg-[linear-gradient(var(--mj-gold))]",
                    ].join(" ")}
                    initial={{ opacity: 0, y: 22, filter: "blur(16px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* soft glow behind heading (only after mount) */}
                    <motion.span
                      aria-hidden
                      className="pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 rounded-full bg-white/10 blur-3xl"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 0.55, scale: 1 }}
                      transition={{
                        duration: 0.9,
                        ease: "easeOut",
                        delay: 0.05,
                      }}
                    />
                    Hi, I’m Mukul — I build{" "}
                    <Text3D className="glow-underline">fast</Text3D>,{" "}
                    <Text3D>
                      <ShimmerText text="modern" />{" "}
                      <ShimmerText text="websites." />
                    </Text3D>
                  </motion.h1>

                  <Reveal delay={0.14}>
                    <p className="mt-5 text-muted/70 md:text-lg">
                      “I build premium, high-performance web apps with a sharp
                      eye for UI and scalability—powered by React/Next.js,
                      Tailwind, Node/Express & MongoDB. 🚀✨”
                    </p>
                  </Reveal>

                  <Reveal delay={0.2}>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <LuxuryButton href="/projects" variant="primary">
                        View Projects
                      </LuxuryButton>
                      <LuxuryButton href="/contact" variant="outline">
                        Contact Me
                      </LuxuryButton>
                    </div>
                  </Reveal>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3 items-center">
                    <StatCard value="10+" label="Projects" />
                    <h2 className="text-white rounded-2xl border border-border/12 bg-foreground/[0.03] p-4 shadow-[0_16px_50px_rgba(0,0,0,0.25)]">Fast Performance</h2>
                    <h2 className="text-white rounded-2xl border border-border/12 bg-foreground/[0.03] p-4 shadow-[0_16px_50px_rgba(0,0,0,0.25)]">Responsive <br/>All Devices</h2>
                  </div>
                </div>
              </Parallax>

              {/* RIGHT (portrait) */}
              <Parallax from={14} to={-14}>
                <div className="lg:justify-self-end lg:mr-2 xl:mr-4">
                  <Reveal delay={0.12}>
                    <HeroPortrait src="/images/hero-portrait.jpg" />
                  </Reveal>
                </div>
              </Parallax>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

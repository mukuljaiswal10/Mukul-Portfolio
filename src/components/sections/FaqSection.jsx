"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { faqs } from "@/data/faqs";
import LuxuryButton from "../ui/LuxuryButton";

function Chevron({ open }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function FaqItem({ i, q, a, open, onToggle }) {
  const contentId = `faq-content-${i}`;
  return (
    <div className="group rounded-2xl border border-border/10 bg-foreground/[0.03]">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={contentId}
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground sm:text-base">
            {q}
          </p>
          <p className="mt-1 text-xs text-muted/70 sm:text-sm">
            Click to {open ? "collapse" : "expand"}
          </p>
        </div>

        <span className="shrink-0 rounded-xl border border-border/10 bg-foreground/[0.04] p-2 text-foreground/80">
          <Chevron open={open} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 sm:px-5 sm:pb-5">
              <div className="h-px w-full bg-border/10" />
              <p className="mt-3 text-sm leading-relaxed text-muted/80">{a}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * ✅ UPDATED:
 * - id prop added (default "faq")
 * - hash "#faq" आते ही auto smooth scroll
 */
export default function FaqSection({ id = "faq" }) {
  const [openIndex, setOpenIndex] = useState(0);
  const items = useMemo(() => faqs, []);

  // ✅ hash -> auto scroll
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

  return (
    <section
      id={id}
      className="relative scroll-mt-24 overflow-hidden py-16 md:py-20"
    >
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-foreground/10 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* left heading */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-border/12 bg-foreground/[0.03] px-3 py-1 text-xs text-foreground/80">
                FAQs
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
                Quick answers
              </p>
            </Reveal>

            {/* ✅ FIX: single premium color for whole heading */}
            <Reveal delay={0.08}>
              <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl text-[color:var(--gold)]">
                Questions? I’ve got you.
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-4 max-w-prose text-sm text-muted/70 md:text-base">
                Client queries mostly same hoti hain — timeline, pricing,
                revisions, deployment, maintenance. Yahan quick answers mil
                jayenge.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-6 rounded-2xl border border-border/10 bg-foreground/[0.03] p-4">
                <p className="text-sm font-semibold text-foreground">
                  Still have a custom requirement?
                </p>
                <p className="mt-1 text-sm text-muted/70">
                  Ping me — I’ll suggest the best plan for your scope.
                </p>

                <div className="mt-3 flex flex-wrap gap-3">
                  <LuxuryButton href="/contact" variant="primary">
                    Contact Me
                  </LuxuryButton>

                  <LuxuryButton href="/services" variant="outline">
                    View Services
                  </LuxuryButton>
                </div>
              </div>
            </Reveal>
          </div>

          {/* right accordion */}
          <div className="lg:col-span-7">
            <div className="grid gap-3 sm:gap-4">
              {items.map((item, i) => (
                <Reveal key={item.q} delay={0.08 + i * 0.04}>
                  <FaqItem
                    i={i}
                    q={item.q}
                    a={item.a}
                    open={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

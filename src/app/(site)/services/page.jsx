// src/app/(site)/services/page.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import LuxuryButton from "@/components/ui/LuxuryButton";
import SectionHeading from "@/components/shared/SectionHeading";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

import {
  serviceOfferings,
  servicePackages,
  serviceProcess,
  serviceFaq,
} from "@/data/services";

function GoldBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/75 backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-[#FFD54A]/70" />
      {children}
    </span>
  );
}

function PremiumButton({ children, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative inline-flex items-center justify-center",
        "rounded-2xl border px-4 py-2.5 text-sm font-semibold",
        "border-[#FFD54A]/25 bg-[#FFD54A]/10 text-[#F6E7B2]",
        "hover:bg-[#FFD54A]/16 transition overflow-hidden",
        "active:scale-[0.99]",
        className,
      ].join(" ")}
    >
      <span className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 hover:translate-x-[520px] transition duration-700" />
      <span className="relative">{children}</span>
    </button>
  );
}

function OfferingCard({ item }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="group relative h-full"
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <Card className="relative h-full overflow-hidden">
        {/* premium aura */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.12),transparent_60%)] blur-3xl"
          animate={reduce ? undefined : { opacity: [0.1, 0.28, 0.1] }}
          transition={
            reduce
              ? undefined
              : { duration: 3.1, repeat: Infinity, ease: "easeInOut" }
          }
        />
        {/* shimmer line */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)]"
          animate={
            reduce
              ? undefined
              : { opacity: [0.2, 0.9, 0.2], x: ["-40%", "40%", "-40%"] }
          }
          transition={
            reduce
              ? undefined
              : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
          }
        />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-base font-semibold text-white/90">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {item.desc}
              </p>
            </div>

            <span className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70">
              Premium
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((t, i) => (
              <span
                key={t}
                className="relative inline-flex items-center rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-xs text-white/70 backdrop-blur"
              >
                {t}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/15 to-transparent mj-chip-shimmer"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              </span>
            ))}
          </div>

          <p className="mt-4 text-xs text-[#F6E7B2]/80">✦ {item.highlight}</p>
        </div>
      </Card>
    </motion.div>
  );
}

function PackageCard({ p }) {
  const reduce = useReducedMotion();

  const href = useMemo(() => {
    const qp = new URLSearchParams({
      intent: "pricing",
      package: p.id,
      from: "services",
    });
    return `/contact?${qp.toString()}`;
  }, [p.id]);

  return (
    <Card
      className={[
        "relative overflow-hidden",
        p.featured ? "ring-1 ring-[#FFD54A]/25" : "",
      ].join(" ")}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.14),transparent_60%)] blur-3xl"
        animate={reduce ? undefined : { opacity: [0.1, 0.28, 0.1] }}
        transition={
          reduce
            ? undefined
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <div className="relative p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-white/90">{p.name}</p>
            <p className="mt-1 text-sm text-white/60">{p.for}</p>
          </div>

          {p.featured ? (
            <span className="rounded-full border border-[#FFD54A]/25 bg-[#FFD54A]/10 px-3 py-1 text-xs font-semibold text-[#F6E7B2]">
              Recommended
            </span>
          ) : (
            <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
              Package
            </span>
          )}
        </div>

        {/* Price locked */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-white/55">Pricing</p>
          <p className="mt-1 text-2xl font-bold text-white/90 blur-[4px] select-none">
            ₹XX,XXX
          </p>
          <p className="mt-1 text-xs text-white/55">
            Unlock pricing via contact (scope-based quote).
          </p>
        </div>

        <ul className="mt-5 space-y-2 text-sm text-white/75">
          {p.points.map((x, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/45" />
              <span className="leading-relaxed">{x}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <LuxuryButton
            href={href}
            variant={p.featured ? "primary" : "outline"}
          >
            {p.ctaLabel}
          </LuxuryButton>
        </div>
      </div>
    </Card>
  );
}

function ProcessStep({ s }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-bold text-[#F6E7B2]">
            {s.step}
          </span>
          <div className="min-w-0">
            <p className="text-base font-semibold text-white/90">{s.title}</p>
            <p className="mt-1 text-sm text-white/70">{s.desc}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FaqItem({ q, a }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="p-5">
        <p className="text-sm font-semibold text-white/90">{q}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{a}</p>
      </div>
    </Card>
  );
}

/** ✅ Compare Packages Drawer/Modal */
function ComparePackagesModal({ open, onClose }) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);

    // lock scroll (premium)
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open, onClose]);

  const ctaHref = (id) => {
    const qp = new URLSearchParams({
      intent: "pricing",
      package: id,
      from: "services-compare",
    });
    return `/contact?${qp.toString()}`;
  };

  // ✅ Tick/Cross comparison (auto from points text)
  const COMPARE_ROWS = [
    {
      label: "Mobile-first / Responsive",
      match: ["responsive", "mobile-first", "mobile first"],
    },
    {
      label: "Premium UI / Luxury styling",
      match: ["ui", "luxury", "premium"],
    },
    { label: "SEO basics", match: ["seo"] },
    {
      label: "Performance optimization",
      match: ["performance", "speed", "lighthouse"],
    },
    { label: "CMS / Admin", match: ["cms", "admin", "wordpress"] },
    {
      label: "Deployment / SSL / Domain",
      match: ["deploy", "deployment", "ssl", "domain"],
    },
    { label: "Revisions included", match: ["revision", "revisions"] },
    { label: "Support / Handover", match: ["support", "handover", "bug"] },
  ];

  const hasFeature = (pkg, matchArr) => {
    const hay = [pkg?.name, pkg?.for, ...(pkg?.points || [])]
      .join(" ")
      .toLowerCase();

    return matchArr.some((m) => hay.includes(String(m).toLowerCase()));
  };

  const body = (
    <AnimatePresence>
      {open ? (
        <>
          {/* overlay */}
          <motion.div
            className="fixed inset-0 z-[2147483000] bg-black/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* sheet/modal */}
          <motion.div
            className={[
              "fixed z-[2147483001]",
              // ✅ mobile: inset with side padding so edge touch na ho
              "left-3 right-3 bottom-3",
              "md:left-1/2 md:top-1/2 md:bottom-auto md:right-auto md:-translate-x-1/2 md:-translate-y-1/2",
              "w-auto md:w-[min(980px,92vw)]",
            ].join(" ")}
            initial={
              reduce
                ? { opacity: 1 }
                : { opacity: 0, y: 28, scale: 0.985, filter: "blur(10px)" }
            }
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
            }
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 22, scale: 0.985, filter: "blur(10px)" }
            }
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.75)] overflow-hidden">
              {/* header */}
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 md:px-6">
                <div className="min-w-0">
                  <p className="text-sm text-white/55">Packages</p>
                  <p className="truncate text-base font-semibold text-[#F6E7B2]">
                    Compare packages (scope-based pricing)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* body */}
              <div className="max-h-[78vh] overflow-auto p-4 md:p-6">
                {/* NOTE */}
                <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-white/70">
                    Pricing blur isliye hai kyunki scope ke hisaab se change
                    hota hai. Package choose karo → Contact me prefill ke saath
                    open ho jayega.
                  </p>
                </div>

                {/* ✅ Tick/Cross table */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white/85">
                      Feature comparison
                    </p>
                    <p className="text-xs text-white/55 mt-1">
                      (auto detected from package points)
                    </p>
                  </div>

                  {/* mobile scroll table */}
                  <div className="overflow-x-auto mj-scrollbar-none">
                    <table className="min-w-[760px] w-full text-left">
                      <thead className="sticky top-0 z-10 bg-black/70 backdrop-blur border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3 text-xs font-semibold text-white/70">
                            Feature
                          </th>
                          {servicePackages.map((p) => (
                            <th key={p.id} className="px-4 py-3">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-white/80">
                                  {p.name}
                                </span>
                                {p.featured ? (
                                  <span className="rounded-full border border-[#FFD54A]/25 bg-[#FFD54A]/10 px-2 py-0.5 text-[10px] font-semibold text-[#F6E7B2]">
                                    Recommended
                                  </span>
                                ) : null}
                              </div>
                              <div className="mt-1 text-[11px] text-white/50">
                                {p.for}
                              </div>
                              <div className="mt-2">
                                <LuxuryButton
                                  href={ctaHref(p.id)}
                                  variant={p.featured ? "primary" : "outline"}
                                >
                                  Unlock price →
                                </LuxuryButton>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {COMPARE_ROWS.map((row, idx) => (
                          <tr
                            key={row.label}
                            className={idx % 2 === 0 ? "bg-white/[0.02]" : ""}
                          >
                            <td className="px-4 py-3 text-sm text-white/75">
                              {row.label}
                            </td>

                            {servicePackages.map((p) => {
                              const ok = hasFeature(p, row.match);
                              return (
                                <td
                                  key={p.id + row.label}
                                  className="px-4 py-3"
                                >
                                  <span
                                    className={[
                                      "inline-flex items-center justify-center",
                                      "h-8 w-10 rounded-xl border text-sm font-bold",
                                      ok
                                        ? "border-[#FFD54A]/25 bg-[#FFD54A]/10 text-[#F6E7B2]"
                                        : "border-white/10 bg-white/[0.03] text-white/45",
                                    ].join(" ")}
                                  >
                                    {ok ? "✓" : "✕"}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* footer CTA */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <LuxuryButton
                    href="/contact?intent=pricing&from=services-compare"
                    variant="primary"
                  >
                    Get exact quote →
                  </LuxuryButton>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/75 hover:bg-white/[0.06]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            {/* same shimmer keyframes used elsewhere */}
            <style jsx global>{`
              .mj-scrollbar-none {
                scrollbar-width: none;
                -ms-overflow-style: none;
              }
              .mj-scrollbar-none::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );

  // ✅ Portal fix: transformed parent se clipping issue khatam
  if (!mounted) return null;
  return createPortal(body, document.body);
}

export default function ServicesPage() {
  const [compareOpen, setCompareOpen] = useState(false);

  // ✅ mobile offerings slider dots
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      const cards = Array.from(el.querySelectorAll("[data-slide='1']"));
      if (!cards.length) return;

      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;

      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      cards.forEach((ch, i) => {
        const r = ch.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(center - c);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });

      setActive(best);
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />
          <div className="absolute -bottom-28 right-0 h-96 w-96 rounded-full bg-foreground/10 blur-3xl" />
        </div>

        <Container className="relative py-12 md:py-16">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/60">
            <Breadcrumbs items={[{ label: "Services" }]} />
            {/* <h1 className="text-3xl font-bold md:text-4xl">Services</h1>
            <p className="mt-2 max-w-2xl text-white/70">
              What I can build for you — luxury UI, clean code, and
              performance-first approach.
            </p> */}
          </div>

          <Parallax from={14} to={-14}>
            <Reveal>
              <h1
                className={[
                  "text-4xl font-bold tracking-tight md:text-6xl",
                  "text-transparent bg-clip-text",
                  "bg-[linear-gradient(180deg,#FFE7A3_0%,#E9C86A_45%,#B8892E_100%)]",
                ].join(" ")}
              >
                Services
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-white/70 md:text-lg">
                What I can build for you — luxury UI, clean code, and
                performance-first approach.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <GoldBadge>Scope-based pricing</GoldBadge>
                <GoldBadge>Mobile-first</GoldBadge>
                <GoldBadge>Premium UI</GoldBadge>
                <GoldBadge>Fast delivery</GoldBadge>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <LuxuryButton
                  href="/contact?intent=services&from=services"
                  variant="primary"
                >
                  Discuss your project →
                </LuxuryButton>
                <LuxuryButton href="/projects" variant="outline">
                  View Projects →
                </LuxuryButton>
              </div>
            </Reveal>
          </Parallax>
        </Container>
      </section>

      {/* OFFERINGS */}
      <section className="py-14 md:py-16">
        <Container>
          <Parallax from={14} to={-14}>
            <Reveal>
              <SectionHeading
                eyebrow="Offerings"
                title="What I deliver"
                desc="Professional UI, clean code, and premium UX — built to scale."
              />
            </Reveal>
          </Parallax>

          {/* ✅ MOBILE: slider (less scroll + premium) */}
          <div className="mt-8 md:hidden">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
                Swipe →
              </span>

              <div className="flex items-center gap-1.5">
                {serviceOfferings.map((_, i) => (
                  <span
                    key={i}
                    className={[
                      "h-1.5 rounded-full transition-all",
                      i === active ? "w-6 bg-[#FFD54A]/70" : "w-2 bg-white/25",
                    ].join(" ")}
                  />
                ))}
              </div>
            </div>

            <div
              ref={trackRef}
              className="mj-scrollbar-none flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
            >
              {serviceOfferings.map((item, idx) => (
                <div
                  key={item.id}
                  data-slide="1"
                  className="snap-center min-w-[88%] max-w-[88%]"
                >
                  <Reveal delay={0.03 + idx * 0.03}>
                    <OfferingCard item={item} />
                  </Reveal>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ DESKTOP/TABLET: grid */}
          <div className="mt-8 hidden md:grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceOfferings.map((item, idx) => (
              <Reveal key={item.id} delay={0.05 + idx * 0.03}>
                <OfferingCard item={item} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* PACKAGES */}
      <section className="py-14 md:py-16">
        <Container>
          <Parallax from={14} to={-14}>
            <Reveal>
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <SectionHeading
                  eyebrow="Packages"
                  title="Pricing (unlock via contact)"
                  desc="Pricing varies by scope. Click to unlock the best quote for your requirement."
                />

                <div className="flex gap-2">
                  <PremiumButton onClick={() => setCompareOpen(true)}>
                    Compare packages →
                  </PremiumButton>
                </div>
              </div>
            </Reveal>
          </Parallax>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {servicePackages.map((p, idx) => (
              <Reveal key={p.id} delay={0.06 + idx * 0.06}>
                <PackageCard p={p} />
              </Reveal>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <LuxuryButton
              href="/contact?intent=pricing&from=services"
              variant="primary"
            >
              Unlock pricing via contact →
            </LuxuryButton>
          </div>
        </Container>
      </section>

      {/* PROCESS */}
      <section className="py-14 md:py-16">
        <Container>
          <Parallax from={14} to={-14}>
            <Reveal>
              <SectionHeading
                eyebrow="Process"
                title="How I work"
                desc="Simple, transparent, and premium delivery pipeline."
              />
            </Reveal>
          </Parallax>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {serviceProcess.map((s, idx) => (
              <Reveal key={s.step} delay={0.05 + idx * 0.05}>
                <ProcessStep s={s} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-14 md:py-16">
        <Container>
          <Parallax from={14} to={-14}>
            <Reveal>
              <SectionHeading
                eyebrow="FAQ"
                title="Quick answers"
                desc="Common questions — short and clear."
              />
            </Reveal>
          </Parallax>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {serviceFaq.map((f, idx) => (
              <Reveal key={f.q} delay={0.05 + idx * 0.05}>
                <FaqItem q={f.q} a={f.a} />
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <LuxuryButton
              href="/contact?intent=services&from=services"
              variant="primary"
            >
              Contact for exact quote →
            </LuxuryButton>
          </div>
        </Container>
      </section>

      {/* ✅ Compare Modal */}
      <ComparePackagesModal
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
      />

      {/* chip + scrollbar animation */}
      <style jsx global>{`
        @keyframes mjChipShimmer {
          0% {
            transform: translateX(-220px) rotate(12deg);
            opacity: 0.18;
          }
          45% {
            opacity: 0.55;
          }
          100% {
            transform: translateX(620px) rotate(12deg);
            opacity: 0.18;
          }
        }
        .mj-chip-shimmer {
          animation: mjChipShimmer 3.1s ease-in-out infinite;
        }
        .mj-scrollbar-none {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .mj-scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}

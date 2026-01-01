"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import LuxuryButton from "@/components/ui/LuxuryButton";

import { experiences } from "@/data/experience";

const SCROLL_EVENT = "mukul:scrollTo";

function isMobileLike() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(max-width: 768px)")?.matches;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function TechChip({ children, i = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={[
        "relative inline-flex items-center rounded-full px-3 py-1 text-xs",
        "border border-white/12 bg-white/[0.03] text-white/75 backdrop-blur",
        "overflow-hidden",
      ].join(" ")}
      animate={
        reduceMotion ? undefined : { y: [0, -1.5, 0], opacity: [0.92, 1, 0.92] }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.08,
            }
      }
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/15 to-transparent mj-chip-shimmer"
      />
      <span className="relative">{children}</span>
    </motion.span>
  );
}

function ExperienceCard({ item }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="group relative"
      animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <Card className="relative overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-[1px] rounded-[24px] border border-white/10"
        />

        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.12),transparent_60%)] blur-3xl"
          animate={reduceMotion ? undefined : { opacity: [0.14, 0.32, 0.14] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        />

        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)]"
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.2, 0.9, 0.2], x: ["-40%", "40%", "-40%"] }
          }
          transition={
            reduceMotion
              ? undefined
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
        />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <motion.span
                    className="text-[#FFD54A] drop-shadow-[0_0_18px_rgba(255,215,0,0.55)]"
                    animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
                    transition={
                      reduceMotion
                        ? undefined
                        : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                    }
                  >
                    ⚡
                  </motion.span>
                </span>

                <p className="truncate text-base font-semibold text-white/90">
                  {item?.title || "Experience"}
                </p>
              </div>

              <p className="mt-1 text-sm text-white/70">
                {item?.company || "Company"}{" "}
                <span className="text-white/40">•</span> {item?.type || "Role"}
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-white/75">
              {item?.period || "2023 - Present"}
            </span>
          </div>

          {Array.isArray(item?.stack) && item.stack.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.stack.slice(0, 8).map((t, i) => (
                <TechChip key={t} i={i}>
                  {t}
                </TechChip>
              ))}
            </div>
          ) : null}

          {Array.isArray(item?.points) && item.points.length ? (
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {item.points.slice(0, 4).map((p, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/45" />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Card>
    </motion.div>
  );
}

export default function ExperienceSection({
  id = "experience",

  // Home
  limit = 1,
  mobileLimit = 3,
  showViewAll = true,
  viewAllHref = "/about#experience",

  // About
  mode = "home", // "home" | "about"

  compact = false,
}) {
  const sectionRef = useRef(null);

  const [mobile, setMobile] = useState(false);

  const trackHomeRef = useRef(null);
  const trackAboutRef = useRef(null);

  const [activeHome, setActiveHome] = useState(0);
  const [activeAbout, setActiveAbout] = useState(0);

  // ✅ drag state (desktop about)
  const dragging = useRef(false);
  const startX = useRef(0);
  const startLeft = useRef(0);

  useEffect(() => {
    const update = () => setMobile(isMobileLike());
    update();
    window.addEventListener?.("resize", update);
    return () => window.removeEventListener?.("resize", update);
  }, []);

  // hash scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollIfMatch = () => {
      const hash = (window.location.hash || "").replace("#", "");
      if (!hash || hash !== id) return;

      const el = document.getElementById(id);
      if (!el) return;

      setTimeout(
        () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
        60
      );
    };

    scrollIfMatch();
    window.addEventListener("hashchange", scrollIfMatch);
    return () => window.removeEventListener("hashchange", scrollIfMatch);
  }, [id]);

  // custom event scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScrollTo = (e) => {
      const targetId = e?.detail?.id;
      if (!targetId || targetId !== id) return;
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    window.addEventListener(SCROLL_EVENT, onScrollTo);
    return () => window.removeEventListener(SCROLL_EVENT, onScrollTo);
  }, [id]);

  const list = Array.isArray(experiences) ? experiences : [];

  const desktopShown = useMemo(() => {
    if (mode === "about") return list;
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }, [list, limit, mode]);

  const mobileShown = useMemo(() => {
    if (mode === "about") return list;
    return list.slice(0, clamp(mobileLimit, 1, 6));
  }, [list, mobileLimit, mode]);

  const shouldShowButton = mode === "home" ? showViewAll : false;

  const bindActive = useCallback((ref, setActive) => {
    const el = ref.current;
    if (!el) return () => {};

    const onScroll = () => {
      const children = Array.from(el.querySelectorAll("[data-slide='1']"));
      if (!children.length) return;

      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;

      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      children.forEach((ch, i) => {
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

  useEffect(() => {
    if (!(mode === "home" && mobile)) return;
    return bindActive(trackHomeRef, setActiveHome);
  }, [mode, mobile, mobileShown.length, bindActive]);

  useEffect(() => {
    if (mode !== "about") return;
    return bindActive(trackAboutRef, setActiveAbout);
  }, [mode, list.length, bindActive]);

  const scrollByOne = (ref, dir = 1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("[data-slide='1']");
    const gap = 16;
    const w = card ? card.getBoundingClientRect().width : 520;
    el.scrollBy({ left: dir * (w + gap), behavior: "smooth" });
  };

  // ✅ Desktop drag handlers (ABOUT)
  const onMouseDown = (e) => {
    if (mobile) return;
    const el = trackAboutRef.current;
    if (!el) return;
    dragging.current = true;
    startX.current = e.clientX;
    startLeft.current = el.scrollLeft;
    el.classList.add("mj-grabbing");
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const el = trackAboutRef.current;
    if (!el) return;
    const dx = e.clientX - startX.current;
    el.scrollLeft = startLeft.current - dx;
  };

  const stopDrag = () => {
    dragging.current = false;
    const el = trackAboutRef.current;
    el?.classList.remove("mj-grabbing");
  };

  const onWheelAbout = (e) => {
    if (mobile) return;
    const el = trackAboutRef.current;
    if (!el) return;
    const isMostlyVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX);
    if (!isMostlyVertical) return;
    e.preventDefault();
    el.scrollLeft += e.deltaY;
  };

  return (
    <>
      <section
        ref={sectionRef}
        id={id}
        className={`${compact ? "py-10" : "py-16"} scroll-mt-24`}
      >
        <Container>
          <Parallax from={16} to={-16}>
            <Reveal>
              <SectionHeading
                eyebrow="Experience"
                title="Real-world work experience"
                desc="Hands-on delivery with clean UI, smooth animations, and production-ready code."
              />
            </Reveal>
          </Parallax>

          {mode === "home" ? (
            <>
              {/* HOME mobile slider */}
              <div className="mt-8 md:hidden">
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
                    Swipe →
                  </span>

                  <div className="flex items-center gap-1.5">
                    {mobileShown.map((_, i) => (
                      <span
                        key={i}
                        className={[
                          "h-1.5 rounded-full transition-all",
                          i === activeHome
                            ? "w-6 bg-[#FFD54A]/70"
                            : "w-2 bg-white/25",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                </div>

                <div
                  ref={trackHomeRef}
                  className="mj-scrollbar-none flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory px-3"
                >
                  {mobileShown.map((item) => (
                    <div
                      key={item.id || item.title}
                      data-slide="1"
                      className="snap-center min-w-[86%] max-w-[86%]"
                    >
                      <Reveal>
                        <ExperienceCard item={item} />
                      </Reveal>
                    </div>
                  ))}
                </div>
              </div>

              {/* HOME desktop: 1 card */}
              <div className="mt-8 hidden md:block">
                <div className="grid gap-6">
                  {desktopShown.map((item, idx) => (
                    <Reveal
                      key={item.id || item.title}
                      delay={0.08 + idx * 0.08}
                    >
                      <ExperienceCard item={item} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* ABOUT: ALL slider + desktop buttons */
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
                  {mobile ? "Swipe →" : "Drag / Scroll →"}
                </span>

                <span className="text-[11px] text-white/50">
                  {activeAbout + 1}/{list.length}
                </span>
              </div>

              <div className="relative">
                {/* ✅ Buttons show ONLY desktop */}
                {!mobile ? (
                  <>
                    <button
                      type="button"
                      onClick={() => scrollByOne(trackAboutRef, -1)}
                      className="absolute left-2 top-1/2 z-30 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-black/45 backdrop-blur text-white/80 hover:bg-white/[0.06] transition shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
                      aria-label="Previous"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollByOne(trackAboutRef, 1)}
                      className="absolute right-2 top-1/2 z-30 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-black/45 backdrop-blur text-white/80 hover:bg-white/[0.06] transition shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
                      aria-label="Next"
                    >
                      ›
                    </button>
                  </>
                ) : null}

                <div
                  ref={trackAboutRef}
                  className={[
                    "mj-scrollbar-none flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory",
                    "px-3 sm:px-4",
                    "cursor-grab select-none",
                  ].join(" ")}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={stopDrag}
                  onMouseLeave={stopDrag}
                  onWheel={onWheelAbout}
                >
                  {list.map((item) => (
                    <div
                      key={item.id || item.title}
                      data-slide="1"
                      className="snap-center min-w-[88%] max-w-[88%] md:min-w-[520px] md:max-w-[520px]"
                    >
                      <Reveal>
                        <ExperienceCard item={item} />
                      </Reveal>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {shouldShowButton ? (
            <div className="mt-8 flex justify-center">
              <LuxuryButton href={viewAllHref} variant="primary">
                View all Experience →
              </LuxuryButton>
            </div>
          ) : null}
        </Container>
      </section>

      <style jsx global>{`
        .mj-scrollbar-none {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .mj-scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .mj-grabbing,
        .mj-grabbing * {
          cursor: grabbing !important;
        }
        @keyframes mjChipShimmer {
          0% {
            transform: translateX(-220px) rotate(12deg);
            opacity: 0.25;
          }
          45% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(620px) rotate(12deg);
            opacity: 0.25;
          }
        }
        .mj-chip-shimmer {
          animation: mjChipShimmer 3.1s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}


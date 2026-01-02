"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import { testimonials } from "@/data/testimonials";

/** ✅ Same pattern (AI suggestions / command palette) */
const SCROLL_EVENT = "mukul:scrollTo";
export function broadcastScrollTo(id) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SCROLL_EVENT, { detail: { id } }));
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [query]);
  return matches;
}

function useElementWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver((entries) => {
      const cr = entries?.[0]?.contentRect;
      if (cr) setW(cr.width || 0);
    });
    ro.observe(el);
    setW(el.getBoundingClientRect()?.width || 0);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

// ===== premium avatar helpers =====
function stringToHsl(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  const s = 58;
  const l = 34;
  return `hsl(${h} ${s}% ${l}%)`;
}

function initials(name = "Client") {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "CL";
}

function companyBadgeText(company) {
  if (!company) return "CLIENT";
  const parts = company.trim().split(/\s+/);
  const first = (parts[0] || "CO").toUpperCase();
  return first.slice(0, 10);
}

function Stars({ value = 5 }) {
  const v = Math.max(1, Math.min(5, value));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={[
            "text-sm",
            i < v ? "text-foreground/90" : "text-foreground/25",
          ].join(" ")}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({ t }) {
  const avatarBg = stringToHsl(t?.name || "Client");

  return (
    <div className="group relative h-full overflow-hidden rounded-3xl border border-border/15 bg-foreground/[0.03] p-6 backdrop-blur">
      <div className="pointer-events-none absolute -inset-14 opacity-0 blur-3xl transition duration-700 group-hover:opacity-70 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-border/15 bg-foreground/[0.04]">
            <div
              className="absolute inset-0 grid place-items-center"
              style={{
                background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.16), transparent 55%), ${avatarBg}`,
              }}
            >
              <span className="text-xs font-semibold text-white/90">
                {initials(t?.name)}
              </span>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">{t?.name}</p>
            <p className="text-xs text-muted/60">
              {t?.role}
              {t?.company ? (
                <>
                  {" "}
                  <span className="text-muted/50">•</span> {t.company}
                </>
              ) : null}
            </p>

            <div className="mt-1">
              <Stars value={t?.rating || 5} />
            </div>
          </div>
        </div>

        <div className="relative shrink-0">
          <span
            className={[
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px]",
              "border border-border/15 bg-foreground/[0.04] text-foreground/80",
              "shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur",
            ].join(" ")}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
            {companyBadgeText(t?.company)}
          </span>
          <span className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-r from-foreground/25 via-transparent to-foreground/25 opacity-50 blur-[6px]" />
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-foreground/85">
        “{t?.quote}”
      </p>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/35 to-transparent" />
    </div>
  );
}

// ===== rubber-band (iOS-like) =====
function rubberBand(distance, dimension, constant = 0.55) {
  return (
    (distance * dimension * constant) /
    (dimension + constant * Math.abs(distance))
  );
}

/**
 * ✅ props:
 * - sectionId: default "testimonials" (AI suggestions / palette / hash)
 */
export default function TestimonialsSection({ sectionId = "testimonials" }) {
  const sectionRef = useRef(null);

  // ✅ hash (#testimonials) -> scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash?.replace("#", "");
    if (!hash || hash !== sectionId) return;

    const t = setTimeout(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);

    return () => clearTimeout(t);
  }, [sectionId]);

  // ✅ custom event -> scroll (AI suggestions / command palette)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScrollTo = (e) => {
      const id = e?.detail?.id;
      if (!id || id !== sectionId) return;
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    window.addEventListener(SCROLL_EVENT, onScrollTo);
    return () => window.removeEventListener(SCROLL_EVENT, onScrollTo);
  }, [sectionId]);

  const raw = (testimonials || []).map((t, idx) => ({
    id:
      t.id ||
      `${(t.name || "client").toLowerCase().replace(/\s+/g, "-")}-${idx}`,
    ...t,
  }));

  const total = raw.length;

  const isMd = useMediaQuery("(min-width: 768px)");
  const perPage = isMd ? 2 : 1;

  // group into pages
  const basePages = useMemo(() => {
    if (!total) return [];
    const out = [];
    for (let i = 0; i < total; i += perPage)
      out.push(raw.slice(i, i + perPage));
    return out;
  }, [raw, total, perPage]);

  const baseCount = basePages.length;

  // ✅ infinite feel: clone pages at both ends
  const pages = useMemo(() => {
    if (!baseCount) return [];
    const head = basePages.slice(-2);
    const tail = basePages.slice(0, 2);
    return [...head, ...basePages, ...tail];
  }, [basePages, baseCount]);

  const trackCount = pages.length;

  const [wrapRef, width] = useElementWidth();

  // start at the "real" first page (offset by 2)
  const offset = 2;
  const [index, setIndex] = useState(offset);

  const x = useMotionValue(0);

  // autoplay
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  const stop = () => {
    pausedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const start = () => {
    pausedRef.current = false;
    if (timerRef.current || baseCount <= 1) return;
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) setIndex((v) => v + 1);
    }, 3800);
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseCount]);

  // reset on breakpoint change
  useEffect(() => {
    stop();
    setIndex(offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage]);

  // snap to index when width changes or index changes
  useEffect(() => {
    if (!width) return;
    const target = -index * width;
    animate(x, target, { duration: 0.55, ease: [0.16, 1, 0.3, 1] });
  }, [index, width, x]);

  // after animation ends, if we are in clones, jump (no animation) to real range
  useEffect(() => {
    if (!width || !baseCount) return;

    const minReal = offset;
    const maxReal = offset + baseCount - 1;

    if (index > maxReal) {
      const next = minReal;
      x.set(-next * width);
      setIndex(next);
      return;
    }

    if (index < minReal) {
      const next = maxReal;
      x.set(-next * width);
      setIndex(next);
    }
  }, [index, width, baseCount, x]);

  const go = (dir) => {
    stop();
    setIndex((v) => (dir === "next" ? v + 1 : v - 1));
    setTimeout(() => start(), 900);
  };

  // drag physics
  const swipeThreshold = Math.min(120, width * 0.18 || 80);
  const velocityThreshold = 700;

  return (
    <section ref={sectionRef} id={sectionId} className="py-16 scroll-mt-24">
      <Container>
        <Parallax from={10} to={-10}>
          <Reveal>
            <SectionHeading
              eyebrow="Testimonials"
              title="What clients say"
              // desc="Infinite loop • rubber-band edges • follow-finger drag."
            />
          </Reveal>
        </Parallax>

        <div
          className="mt-8"
          onMouseEnter={stop}
          onMouseLeave={start}
          onTouchStart={stop}
          onTouchEnd={start}
          onFocusCapture={stop}
          onBlurCapture={start}
        >
          <div ref={wrapRef} className="relative overflow-hidden">
            <motion.div
              className="flex"
              style={{ x, cursor: "grab" }}
              drag="x"
              dragMomentum={false}
              dragElastic={0.12}
              onDragStart={() => stop()}
              onDrag={(e, info) => {
                if (!width) return;
                const min = -(trackCount - 1) * width;
                const max = 0;
                const cur = x.get();

                if (cur > max) {
                  x.set(rubberBand(cur - max, width, 0.55));
                } else if (cur < min) {
                  x.set(min + rubberBand(cur - min, width, 0.55));
                }
              }}
              onDragEnd={(e, info) => {
                const offsetX = info.offset.x;
                const vx = info.velocity.x;

                const shouldNext =
                  offsetX < -swipeThreshold || vx < -velocityThreshold;
                const shouldPrev =
                  offsetX > swipeThreshold || vx > velocityThreshold;

                if (shouldNext) setIndex((v) => v + 1);
                else if (shouldPrev) setIndex((v) => v - 1);
                else {
                  if (width) {
                    animate(x, -index * width, {
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    });
                  }
                }

                setTimeout(() => start(), 900);
              }}
              whileTap={{ cursor: "grabbing" }}
            >
              {pages.map((group, gi) => (
                <div key={gi} className="w-full shrink-0">
                  <div
                    className={[
                      "grid gap-6",
                      isMd ? "md:grid-cols-2" : "grid-cols-1",
                    ].join(" ")}
                  >
                    {group.map((t) => (
                      <TestimonialCard key={`${gi}-${t.id}`} t={t} />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => go("prev")}
              className="cursor-pointer rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
            >
              ← Prev
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(baseCount, 8) }).map((_, i) => {
                const realIndex = offset + i;
                const active = index === realIndex;
                return (
                  <button
                    key={i}
                    aria-label={`Go to ${i + 1}`}
                    onClick={() => {
                      stop();
                      setIndex(realIndex);
                      setTimeout(() => start(), 900);
                    }}
                    className={[
                      "h-2 w-2 rounded-full transition",
                      active
                        ? "bg-foreground/80"
                        : "bg-foreground/25 hover:bg-foreground/40",
                    ].join(" ")}
                  />
                );
              })}
            </div>

            <button
              onClick={() => go("next")}
              className="cursor-pointer rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
            >
              Next →
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

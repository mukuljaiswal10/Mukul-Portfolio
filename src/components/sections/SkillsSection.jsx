"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useInView,
} from "framer-motion";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import LuxuryButton from "@/components/ui/LuxuryButton";

import { skills } from "@/data/skills";

/** ✅ Same pattern like ProjectsSection (CustomEvent for scroll) */
const SCROLL_EVENT = "mukul:scrollTo";
export function broadcastScrollTo(id) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SCROLL_EVENT, { detail: { id } }));
}

function isMobileLike() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(max-width: 640px)")?.matches;
}

/** ✅ Count up (starts when badge comes into view) */
function CountUp({ to = 0, duration = 0.9 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px", once: true });

  const mv = useMotionValue(0);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const unsub = mv.on("change", (v) => setVal(Math.round(v)));
    return () => unsub?.();
  }, [mv]);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls?.stop?.();
  }, [inView, mv, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}
    </span>
  );
}

/** ✅ Premium chip (continuous shimmer + dot pulse + 3D tilt + ripple + tiny haptic) */
function SkillPill({ name, desc }) {
  const cardRef = useRef(null);
  const [ripple, setRipple] = useState(null);

  // motion values for premium tilt
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);

  const rX = useSpring(mvY, { stiffness: 260, damping: 26 }); // rotateX
  const rY = useSpring(mvX, { stiffness: 260, damping: 26 }); // rotateY

  // a tiny depth effect
  const tz = useTransform(mvY, [-8, 8], [2, 6]);

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    if (isMobileLike()) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const dx = px - 0.5;
    const dy = py - 0.5;

    mvX.set(dx * 10);
    mvY.set(-dy * 8);
  };

  const onLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  const onDown = (e) => {
    const el = cardRef.current;
    if (!el) return;

    if (isMobileLike() && navigator?.vibrate) navigator.vibrate(8);

    const rect = el.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
    const y = e.clientY ? e.clientY - rect.top : rect.height / 2;

    setRipple({ x, y, id: Date.now() });
    setTimeout(() => setRipple(null), 520);
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerDown={onDown}
      whileTap={{ scale: 0.985 }}
      style={{
        rotateX: rX,
        rotateY: rY,
        transformStyle: "preserve-3d",
      }}
      className={[
        "group relative overflow-hidden rounded-2xl border border-white/10",
        "bg-white/[0.03] px-4 py-3",
        "shadow-[0_16px_55px_rgba(0,0,0,0.28)]",
        "select-none",
      ].join(" ")}
    >
      {/* continuous shimmer sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 mj-chip-shimmer"
      />

      {/* inner border */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[1px] rounded-[14px] border border-white/10"
      />

      {/* ✅ FIX: subtle hover glow (no multiline className) */}
      <span
        aria-hidden
        className={[
          "pointer-events-none absolute -inset-10 opacity-0 blur-3xl transition duration-700 group-hover:opacity-70",
          "bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.14),transparent_60%)]",
        ].join(" ")}
      />

      {/* click ripple */}
      {ripple ? (
        <motion.span
          key={ripple.id}
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-white/20"
          initial={{
            opacity: 0.55,
            width: 0,
            height: 0,
            left: ripple.x,
            top: ripple.y,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            opacity: 0,
            width: 520,
            height: 520,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ) : null}

      <motion.div
        style={{ translateZ: tz }}
        className="relative flex items-start justify-between gap-3"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground/90">
            {name}
          </p>
          <p className="mt-0.5 text-xs text-muted/70">{desc}</p>
        </div>

        {/* glowing dot */}
        <span className="relative mt-1 grid h-2.5 w-2.5 place-items-center">
          <span className="absolute inset-0 rounded-full bg-[#FFD54A]/35 blur-[6px] mj-dot" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD54A]/70" />
        </span>
      </motion.div>
    </motion.div>
  );
}

function SkillGroupCard({ g }) {
  const count = g.items?.length || 0;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 360, damping: 26 }}
      className={[
        "group relative overflow-hidden rounded-3xl border border-white/10",
        "bg-white/[0.03] backdrop-blur-xl",
        "shadow-[0_22px_85px_rgba(0,0,0,0.55)]",
      ].join(" ")}
    >
      {/* glow aura */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-12 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.16),transparent_55%)] blur-3xl"
        animate={{ opacity: [0.18, 0.45, 0.18], scale: [1, 1.06, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* top shimmer line */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.75),transparent)]"
        animate={{ opacity: [0.2, 0.9, 0.2], x: ["-40%", "40%", "-40%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* premium border sheen on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 transition duration-700 group-hover:opacity-100 group-hover:translate-x-[680px]"
      />

      <div className="relative p-5 sm:p-6">
        {/* HEADER live scanning glow area */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-[#FFD54A]/18 to-transparent blur-[1px]"
            animate={{ x: [0, 520, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ✅ FIX: subtle inner glow (no multiline className) */}
          <span
            aria-hidden
            className={[
              "pointer-events-none absolute -inset-10 opacity-60 blur-3xl",
              "bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.12),transparent_60%)]",
            ].join(" ")}
          />

          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-lg font-semibold text-foreground/90">
                {g.title}
              </p>
              <p className="mt-1 text-sm text-muted/70">{g.subtitle}</p>
            </div>

            <span className="shrink-0 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-foreground/85">
              <CountUp to={count} duration={0.9} /> Skills
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {g.items?.map((s) => (
            <SkillPill key={s.name} name={s.name} desc={s.desc} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function SkillsSection({
  limit,
  showViewAll = false,
  compact = false,
  sectionId = "skills",
}) {
  const sectionRef = useRef(null);

  // hash based auto-scroll
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

  // custom event scroll
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

  const list = useMemo(() => (Array.isArray(skills) ? skills : []), []);
  const shown = typeof limit === "number" ? list.slice(0, limit) : list;

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className={`${
        compact ? "py-10" : "py-16"
      } scroll-mt-24 relative overflow-hidden`}
    >
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-foreground/10 blur-3xl" />
      </div>

      <Container className="relative">
        <Parallax from={16} to={-16}>
          <Reveal>
            <SectionHeading
              title="MERN + Modern Dev Stack"
              desc="Full-stack development with clean UI, strong backend logic, secure APIs, and modern tooling."
            />
          </Reveal>
        </Parallax>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {shown.map((g, idx) => (
            <Reveal key={g.id} delay={0.08 + idx * 0.08} className="group">
              <SkillGroupCard g={g} />
            </Reveal>
          ))}
        </div>

        {showViewAll ? (
          <div className="mt-8 flex justify-center">
            <LuxuryButton
              href="/skills"
              variant="primary"
              className="cursor-pointer"
            >
              View all Skills →
            </LuxuryButton>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

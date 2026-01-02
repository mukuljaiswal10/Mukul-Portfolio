"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer:fine)");
    const update = () => setFine(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return fine;
}

function MagneticChip({ children, className = "", delay = 0 }) {
  const finePointer = useFinePointer();
  const ref = useRef(null);

  const x = useSpring(useMotionValue(0), { stiffness: 240, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 240, damping: 18 });

  const onMove = (e) => {
    if (!finePointer) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);

    x.set(dx * 0.18);
    y.set(dy * 0.18);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        x,
        y,
        textShadow: "0 2px 14px rgba(0,0,0,0.9)",
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={
        "select-none pointer-events-auto inline-flex items-center gap-2 rounded-full " +
        "border border-white/25 ring-1 ring-white/10 " +
        "bg-black/55 sm:bg-black/65 " +
        "px-3 py-1 text-xs font-semibold text-white/95 " +
        "backdrop-blur-md " +
        "shadow-[0_14px_36px_rgba(0,0,0,0.70)] " +
        "transition-all duration-200 " +
        "hover:bg-black/75 hover:border-white/35 hover:ring-white/15 " +
        "hover:shadow-[0_20px_60px_rgba(0,0,0,0.85)] " +
        className
      }
      initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      whileHover={finePointer ? { scale: 1.05 } : undefined}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.55)]" />
      {children}
    </motion.div>
  );
}

export default function HeroPortrait({
  src = "/images/hero-portrait.jpg",
  name = "Mukul Jaiswal",
  role = "Full Stack • WordPress",
}) {
  const finePointer = useFinePointer();
  const [imgOk, setImgOk] = useState(true);

  // ✅ tilt only on desktop (SSR safe)
  const [canTilt, setCanTilt] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setCanTilt(finePointer && mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [finePointer]);

  const cardRef = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 220, damping: 20 });
  const sy = useSpring(my, { stiffness: 220, damping: 20 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-10, 10]);

  const onCardMove = (e) => {
    if (!canTilt) return;
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px);
    my.set(py);
  };

  const onCardLeave = () => {
    mx.set(0);
    my.set(0);
  };

  // ✅ Chips layout (mobile-first: keep fewer + clean spacing)
  const chips = [
    {
      label: "Next.js",
      pos: "left-2 top-10",
      float: { y: [0, -10, 0], duration: 3.6 },
      delay: 0.08,
      show: "block",
    },
    {
      label: "React",
      pos: "right-2 top-16",
      float: { y: [0, 12, 0], duration: 4.1 },
      delay: 0.14,
      show: "block",
    },
    {
      label: "Tailwind",
      pos: "left-6 -bottom-4",
      float: { y: [0, -10, 0], duration: 4.6 },
      delay: 0.2,
      show: "block",
    },
    {
      label: "WordPress",
      pos: "right-10 -bottom-6",
      float: { y: [0, 10, 0], duration: 4.9 },
      delay: 0.26,
      show: "block",
    },

    {
      label: "JavaScript",
      pos: "left-10 top-3",
      float: { y: [0, -8, 0], duration: 4.4 },
      delay: 0.32,
      show: "hidden md:block",
    },
    {
      label: "Node.js",
      pos: "right-16 top-4",
      float: { y: [0, 9, 0], duration: 4.8 },
      delay: 0.38,
      show: "hidden md:block",
    },
    {
      label: "Express",
      pos: "left-0 top-1/2 -translate-y-1/2",
      float: { y: [0, -10, 0], duration: 5.2 },
      delay: 0.44,
      show: "hidden md:block",
    },
    {
      label: "MongoDB",
      pos: "right-0 top-1/2 -translate-y-1/2",
      float: { y: [0, 10, 0], duration: 5.6 },
      delay: 0.5,
      show: "hidden md:block",
    },
    {
      label: "GitHub",
      pos: "left-12 -top-4",
      float: { y: [0, -9, 0], duration: 5.0 },
      delay: 0.56,
      show: "hidden lg:block",
    },
    {
      label: "Bootstrap",
      pos: "right-12 -top-5",
      float: { y: [0, 10, 0], duration: 5.4 },
      delay: 0.62,
      show: "hidden lg:block",
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[520px]">
      {/* soft glow behind */}
      <motion.div
        className="pointer-events-none absolute -inset-10 rounded-full bg-foreground/10 blur-3xl"
        animate={{ scale: [1, 1.06, 1], opacity: [0.22, 0.42, 0.22] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* chips */}
      {chips.map((c, i) => (
        <motion.div
          key={c.label}
          className={`absolute z-20 ${c.pos} ${c.show}`}
          animate={{ y: c.float.y }}
          transition={{
            duration: c.float.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-black/40 blur-xl" />
          <MagneticChip delay={c.delay + i * 0.02}>{c.label}</MagneticChip>
        </motion.div>
      ))}

      {/* gradient frame */}
      <div className="relative rounded-[28px] p-[1px] bg-gradient-to-br from-foreground/25 via-transparent to-foreground/10">
        <motion.div
          ref={cardRef}
          onMouseMove={onCardMove}
          onMouseLeave={onCardLeave}
          style={
            canTilt
              ? { rotateX, rotateY, transformStyle: "preserve-3d" }
              : undefined
          }
          className="group rounded-[28px] border border-border/10 bg-foreground/[0.03] p-3 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          {/* image area */}
          <div
            className="relative overflow-hidden rounded-[22px] border border-border/10"
            style={canTilt ? { transform: "translateZ(18px)" } : undefined}
          >
            <div className="relative aspect-[4/5] w-full">
              {imgOk ? (
                <Image
                  src={src}
                  alt="Portrait"
                  fill
                  sizes="(max-width: 768px) 90vw, 460px"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                  priority
                  onError={() => setImgOk(false)}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-foreground/10 via-transparent to-foreground/5">
                  <div className="text-center">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-border/15 bg-foreground/[0.04]">
                      <span className="text-xl font-bold text-foreground">
                        MJ
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted/70">
                      Add your photo later
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* vignette + gradient for premium */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.10),rgba(0,0,0,0.55))]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent" />

            {/* shine sweep */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-[60%] top-0 h-full w-[60%] rotate-12 bg-gradient-to-r from-transparent via-foreground/12 to-transparent opacity-0 blur-sm transition duration-700 group-hover:translate-x-[210%] group-hover:opacity-100" />
            </div>
          </div>

          {/* info bar */}
          <div
            className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-border/10 bg-foreground/[0.03] px-4 py-3"
            style={canTilt ? { transform: "translateZ(12px)" } : undefined}
          >
            <div>
              <p className="text-sm font-semibold text-foreground">{name}</p>
              <p className="text-xs text-muted/70">{role}</p>
            </div>
            <span className="rounded-full border border-border/15 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/80">
              Available
            </span>
          </div>
        </motion.div>
      </div>

      {/* tiny dots */}
      <motion.span
        className="pointer-events-none absolute -left-2 top-40 h-2.5 w-2.5 rounded-full bg-foreground/30"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="pointer-events-none absolute -right-2 top-44 h-2 w-2 rounded-full bg-foreground/25"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

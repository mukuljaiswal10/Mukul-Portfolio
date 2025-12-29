"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
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

    // magnetic strength
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
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={
        "select-none pointer-events-auto inline-flex items-center gap-2 rounded-full border border-border/12 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/80 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.18)] " +
        className
      }
      initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      whileHover={finePointer ? { scale: 1.03 } : undefined}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
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

  // ✅ tilt only on desktop (fine pointer + large screens)
  const [canTilt, setCanTilt] = useState(false);
  useEffect(() => {
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

  return (
    <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[520px]">
      {/* soft glow behind */}
      <motion.div
        className="pointer-events-none absolute -inset-10 rounded-full bg-foreground/10 blur-3xl"
        animate={{ scale: [1, 1.06, 1], opacity: [0.22, 0.42, 0.22] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* floating chips */}
      <motion.div
        className="absolute -left-2 top-10 z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <MagneticChip delay={0.1}>Next.js</MagneticChip>
      </motion.div>

      <motion.div
        className="absolute -right-2 top-16 z-10"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 4.1, repeat: Infinity, ease: "easeInOut" }}
      >
        <MagneticChip delay={0.18}>React</MagneticChip>
      </motion.div>

      <motion.div
        className="absolute left-6 -bottom-4 z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <MagneticChip delay={0.26}>Tailwind</MagneticChip>
      </motion.div>

      <motion.div
        className="absolute right-10 -bottom-6 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4.9, repeat: Infinity, ease: "easeInOut" }}
      >
        <MagneticChip delay={0.34}>WordPress</MagneticChip>
      </motion.div>

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

            {/* bottom gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

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

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function CountUp({
  to = 0,
  duration = 900,
  start = 0,
  prefix = "",
  suffix = "",
  className = "",
  repeat = false, // ✅ NEW: true => re-trigger on every re-enter
}) {
  const [value, setValue] = useState(start);
  const ref = useRef(null);

  const rafRef = useRef(null);
  const startedRef = useRef(false);

  const target = useMemo(() => {
    const n = Number(to);
    return Number.isFinite(n) ? n : 0;
  }, [to]);

  useEffect(() => {
    if (!ref.current) return;

    // reduced motion respect
    const mq =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    const reduceMotion = !!mq?.matches;

    const stopAnim = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    const startAnim = () => {
      if (reduceMotion) {
        setValue(target);
        return;
      }

      // prevent double-start while already running/in view
      if (startedRef.current) return;
      startedRef.current = true;

      stopAnim();
      setValue(start);

      const t0 = performance.now();
      const from = Number.isFinite(Number(start)) ? Number(start) : 0;

      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        const next = Math.round(from + (target - from) * eased);
        setValue(next);

        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;

        if (e.isIntersecting) {
          // ✅ when enter
          startAnim();
        } else if (repeat) {
          // ✅ when leave => allow next enter to start again
          stopAnim();
          startedRef.current = false;
          setValue(start);
        }
      },
      { threshold: 0.35 }
    );

    io.observe(ref.current);

    return () => {
      io.disconnect();
      stopAnim();
    };
  }, [target, duration, start, repeat]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

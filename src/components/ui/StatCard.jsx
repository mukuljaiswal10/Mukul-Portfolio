"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function parseTarget(val) {
  const raw = String(val ?? "").trim();
  const num = parseInt(raw.replace(/[^\d]/g, ""), 10);
  const suffix = raw.replace(String(num), "").trim(); // "+" etc
  return {
    target: Number.isFinite(num) ? num : 0,
    suffix: suffix || "",
  };
}

export default function StatCard({
  value = "10+",
  label = "Projects",
  className = "",
  duration = 900, // ms for 0->target
  hold = 3000, // ms wait after complete
  startFrom = 0,
}) {
  const { target, suffix } = useMemo(() => parseTarget(value), [value]);

  const [count, setCount] = useState(startFrom);

  const rafRef = useRef(null);
  const holdTimerRef = useRef(null);
  const runningRef = useRef(false);

  const clearAll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = null;

    runningRef.current = false;
  };

  const animateToTarget = () => {
    clearAll();
    runningRef.current = true;

    const start = performance.now();
    const from = startFrom;
    const to = target;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);

      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);

      const next = Math.round(from + (to - from) * eased);
      setCount(next);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // reached
      setCount(to);

      // hold 3s, then restart
      holdTimerRef.current = setTimeout(() => {
        setCount(from);
        // small frame gap then start again
        rafRef.current = requestAnimationFrame(() => animateToTarget());
      }, hold);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    // restart when target/value changes
    animateToTarget();
    return () => clearAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, hold]);

  return (
    <div
      className={[
        "rounded-2xl border border-border/12 bg-foreground/[0.03] p-4",
        "shadow-[0_16px_50px_rgba(0,0,0,0.25)]",
        className,
      ].join(" ")}
    >
      <div className="text-2xl font-bold text-foreground">
        {count}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-muted/70">{label}</div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue } from "framer-motion";

export default function CountUp({
  value = 0,
  duration = 1.1,
  decimals = 0,
  suffix = "",
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const unsub = mv.on("change", (latest) => {
      el.textContent = `${Number(latest).toFixed(decimals)}${suffix}`;
    });

    return () => unsub();
  }, [mv, decimals, suffix]);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, mv, value, duration]);

  return <span ref={ref} className={className} />;
}

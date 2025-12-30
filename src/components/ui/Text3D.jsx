"use client";
import { useEffect, useRef } from "react";

export default function Text3D({ children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Only desktop / fine pointer
    const mq = window.matchMedia("(pointer:fine) and (min-width: 768px)");
    if (!mq.matches) return;

    let raf = 0;

    const setVars = (x, y) => {
      el.style.setProperty("--mx", x.toFixed(2));
      el.style.setProperty("--my", y.toFixed(2));
      el.style.setProperty("--rx", (-y * 6).toFixed(2));
      el.style.setProperty("--ry", (x * 8).toFixed(2));
    };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      const cy = (e.clientY - r.top) / r.height - 0.5;

      const x = cx * 2; // -1..1
      const y = cy * 2;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVars(x * 10, y * 8));
    };

    const reset = () => setVars(0, 0);

    reset();
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span ref={ref} className={`hero3d ${className}`}>
      <span className="hero3d__base">{children}</span>
      <span aria-hidden className="hero3d__depth">
        {children}
      </span>
      <span aria-hidden className="hero3d__glow">
        {children}
      </span>
    </span>
  );
}

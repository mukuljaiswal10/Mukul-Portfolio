"use client";

import { useEffect, useRef } from "react";

export default function Magnetic({
  children,
  strength = 0.18, // movement strength
  rotate = 2.2, // rotate deg
  className = "",
}) {
  const ref = useRef(null);
  const raf = useRef(null);
  const enabled = useRef(true);

  useEffect(() => {
    // desktop only (no touch)
    const mq = window.matchMedia("(hover:hover) and (pointer:fine)");
    enabled.current = mq.matches;

    const onChange = () => {
      enabled.current = mq.matches;
      // reset when switching
      if (ref.current)
        ref.current.style.transform = "translate3d(0,0,0) rotate(0deg)";
    };

    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const handleMove = (e) => {
    if (!enabled.current || !ref.current) return;

    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    const dx = x * strength;
    const dy = y * strength;

    const rx = (-y / rect.height) * rotate;
    const ry = (x / rect.width) * rotate;

    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  };

  const handleLeave = () => {
    if (!ref.current) return;
    cancelAnimationFrame(raf.current);
    ref.current.style.transform =
      "translate3d(0,0,0) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        transition: "transform 220ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}

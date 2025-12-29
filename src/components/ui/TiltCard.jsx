"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function TiltCard({
  children,
  className = "",
  maxTilt = 10,
  scale = 1.02,
}) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  function onMove(e) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // px
    const y = e.clientY - rect.top; // px

    const px = x / rect.width; // 0..1
    const py = y / rect.height; // 0..1

    const rotY = (px - 0.5) * (maxTilt * 2);
    const rotX = (0.5 - py) * (maxTilt * 2);

    setStyle({
      transform: `perspective(900px) rotateX(${rotX.toFixed(
        2
      )}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scale})`,
      // for radial glow position
      ["--x"]: `${x}px`,
      ["--y"]: `${y}px`,
    });
  }

  function onLeave() {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
      ["--x"]: "50%",
      ["--y"]: "50%",
    });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-transform duration-200 will-change-transform",
        "border-border/10 bg-foreground/[0.03] hover:border-border/20 hover:bg-foreground/[0.05]",
        "hover:border-white/20 hover:bg-white/[0.05]",
        className
      )}
    >
      {/* soft glow following cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--x) var(--y), rgba(255,255,255,0.18), transparent 45%)",
        }}
      />

      {/* shine sweep */}
      <div className="pointer-events-none absolute -inset-y-6 -left-1/2 w-1/3 -translate-x-[140%] rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition duration-700 group-hover:translate-x-[240%]" />

      <div className="relative">{children}</div>
    </div>
  );
}

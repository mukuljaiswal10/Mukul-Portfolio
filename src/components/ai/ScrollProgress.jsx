"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const val = max > 0 ? (window.scrollY / max) * 100 : 0;
      setP(Math.max(0, Math.min(100, val)));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[80] h-[2px] w-full">
      <div
        className="h-full rounded-r-full bg-foreground/80"
        style={{ width: `${p}%` }}
      />
      {/* subtle glow */}
      <div
        className="h-full -translate-y-[2px] bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.25),transparent_70%)] opacity-70"
        style={{ width: `${Math.min(100, p + 10)}%` }}
      />
    </div>
  );
}

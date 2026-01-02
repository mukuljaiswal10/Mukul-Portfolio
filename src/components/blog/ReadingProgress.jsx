"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
      const height = (doc.scrollHeight || 1) - (doc.clientHeight || 1);
      const val =
        height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0;
      setP(val);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[80] h-[2px] w-full bg-transparent">
      <div
        className="h-full bg-[#E7C266]"
        style={{
          width: `${p}%`,
          boxShadow: "0 0 18px rgba(231,194,102,0.55)",
        }}
      />
    </div>
  );
}

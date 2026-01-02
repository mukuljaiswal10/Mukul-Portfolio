"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-25 right-4 z-50 rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white/90 backdrop-blur hover:bg-white/[0.08] active:scale-[0.99]"
      aria-label="Scroll to top"
    >
      ↑ Top
    </button>
  );
}

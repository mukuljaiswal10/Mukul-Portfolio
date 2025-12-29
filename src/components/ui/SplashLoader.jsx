"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SplashLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Hide when page fully loaded, with a safe fallback (so it never gets stuck)
    const done = () => setShow(false);

    if (document.readyState === "complete") {
      const t = setTimeout(done, 250);
      return () => clearTimeout(t);
    }

    window.addEventListener("load", done);

    const fallback = setTimeout(done, 1200); // max splash duration
    return () => {
      window.removeEventListener("load", done);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-[9999] grid place-items-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* Premium loader */}
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border border-white/15" />
              <div className="absolute inset-0 rounded-full border-t-white/80 border-r-white/10 border-b-white/10 border-l-white/10 animate-spin" />
              <div className="absolute inset-2 rounded-full border border-white/10" />
              <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 animate-pulse" />
            </div>

            <div className="text-center">
              <p className="text-sm text-white/80">Loading</p>
              <p className="text-xs text-white/40">Please wait...</p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

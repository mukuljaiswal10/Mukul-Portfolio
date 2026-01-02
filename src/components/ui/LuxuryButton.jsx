"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function makeParticles(count = 12) {
  return Array.from({ length: count }).map((_, i) => {
    const a = Math.random() * Math.PI * 2;
    const d = 26 + Math.random() * 22;
    return {
      id: `${Date.now()}-${i}`,
      x: Math.cos(a) * d,
      y: Math.sin(a) * d,
      s: 0.7 + Math.random() * 0.9,
      delay: Math.random() * 0.06,
    };
  });
}

export default function LuxuryButton({
  href,
  children,
  variant = "primary", // "primary" | "outline"
  className = "",
  ...props
}) {
  const [burst, setBurst] = useState(null);

  useEffect(() => {
    if (!burst) return;
    const t = setTimeout(() => setBurst(null), 520);
    return () => clearTimeout(t);
  }, [burst]);

  const isPrimary = variant === "primary";
  const Comp = href ? Link : "button";

  // ✅ global premium button system (from globals.css)
  const skin = isPrimary ? "btn btn-primary" : "btn btn-outline";

  // ✅ keep your luxury layout/anim classes (no bg/text here)
  const base =
    "group relative inline-flex items-center justify-center overflow-hidden " +
    "rounded-2xl select-none will-change-transform " +
    "focus-visible:outline-none";

  return (
    <motion.div
      className={`inline-block ${className}`}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      onHoverStart={() => setBurst(makeParticles(14))}
    >
      <Comp
        href={href}
        {...props}
        className={`${skin} ${base}`}
        {...(href
          ? { target: props.target, rel: props.rel }
          : { type: props.type || "button" })}
      >
        {/* soft glow ring */}
        <span
          aria-hidden
          className={[
            "pointer-events-none absolute -inset-8 opacity-0 blur-2xl transition duration-500",
            "group-hover:opacity-70",
            isPrimary
              ? "bg-[radial-gradient(circle_at_30%_20%,rgba(233,200,106,0.18),transparent_60%)]"
              : "bg-[radial-gradient(circle_at_30%_20%,rgba(233,200,106,0.12),transparent_60%)]",
          ].join(" ")}
        />

        {/* royal shine sweep */}
        <span
          aria-hidden
          className={[
            "pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12",
            "bg-gradient-to-r from-transparent via-white/15 to-transparent",
            "opacity-0 transition duration-700",
            "group-hover:opacity-100 group-hover:translate-x-[520px]",
          ].join(" ")}
        />

        {/* inner inset border (luxury) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[1px] rounded-[18px] border border-white/10"
        />

        {/* 💥 “Bomb burst” particles */}
        <AnimatePresence>
          {burst ? (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* center flash */}
              <motion.span
                className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"
                initial={{ scale: 0.6, opacity: 0.0 }}
                animate={{ scale: [0.6, 2.2, 0.2], opacity: [0, 0.55, 0] }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />

              {burst.map((p) => (
                <motion.span
                  key={p.id}
                  className={[
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                    "h-1.5 w-1.5 rounded-full",
                    // ✅ particles visible on both variants
                    isPrimary ? "bg-black/60" : "bg-[#FFE7A3]/70",
                  ].join(" ")}
                  initial={{ x: 0, y: 0, opacity: 0.8, scale: 1 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    opacity: 0,
                    scale: p.s,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: p.delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.25))",
                  }}
                />
              ))}
            </motion.span>
          ) : null}
        </AnimatePresence>

        {/* text */}
        <span className="relative z-10">{children}</span>
      </Comp>
    </motion.div>
  );
}

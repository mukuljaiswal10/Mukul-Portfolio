"use client";
import { motion } from "framer-motion";

export default function ShimmerText({ text, className = "" }) {
  return (
    <span className={`relative inline-block ${className}`}>
      {/* base text */}
      <span className="relative z-[1]">{text}</span>

      {/* shimmer overlay */}
      <motion.span
        aria-hidden
        className="
          pointer-events-none absolute inset-0 z-[2] select-none
          text-transparent
          bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.95),transparent)]
          bg-[length:260%_100%]
          [background-clip:text] [-webkit-background-clip:text]
          mix-blend-screen
        "
        initial={{ backgroundPosition: "200% 0" }}
        animate={{ backgroundPosition: "-200% 0" }}
        transition={{
          duration: 1.4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1.0,
        }}
      >
        {text}
      </motion.span>
    </span>
  );
}

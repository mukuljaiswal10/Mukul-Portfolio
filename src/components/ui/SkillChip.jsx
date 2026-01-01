"use client";

import { motion } from "framer-motion";

export default function SkillChip({ title, subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={[
        "group relative overflow-hidden rounded-2xl border border-white/10",
        "bg-white/[0.03] px-4 py-3",
        "shadow-[0_16px_55px_rgba(0,0,0,0.28)]",
      ].join(" ")}
    >
      {/* subtle shimmer sweep (continuous) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 mj-shimmer"
      />

      {/* premium inner border */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[1px] rounded-[14px] border border-white/10"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground/90">{title}</p>
          <p className="mt-0.5 text-xs text-muted/70">{subtitle}</p>
        </div>

        {/* glowing dot */}
        <span className="relative mt-1 grid h-2.5 w-2.5 place-items-center">
          <span className="absolute inset-0 rounded-full bg-[#FFD54A]/35 blur-[6px] mj-dot" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD54A]/70" />
        </span>
      </div>

      {/* local keyframes */}
      <style jsx>{`
        .mj-shimmer {
          animation: mj_shimmer 2.8s linear infinite;
        }
        .mj-dot {
          animation: mj_pulse 1.7s ease-in-out infinite;
        }
        @keyframes mj_shimmer {
          0% {
            transform: translateX(0) rotate(12deg);
            opacity: 0.35;
          }
          100% {
            transform: translateX(520px) rotate(12deg);
            opacity: 0.55;
          }
        }
        @keyframes mj_pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.95;
          }
        }
      `}</style>
    </motion.div>
  );
}

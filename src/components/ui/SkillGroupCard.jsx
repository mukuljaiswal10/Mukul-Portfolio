"use client";

import { motion } from "framer-motion";
import SkillChip from "@/components/ui/SkillChip";

export default function SkillGroupCard({ title, subtitle, badge, items = [] }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 360, damping: 26 }}
      className={[
        "group relative overflow-hidden rounded-3xl border border-white/10",
        "bg-white/[0.03] backdrop-blur-xl",
        "shadow-[0_22px_85px_rgba(0,0,0,0.55)]",
      ].join(" ")}
    >
      {/* glow aura */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-12 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.16),transparent_55%)] blur-3xl"
        animate={{ opacity: [0.18, 0.45, 0.18], scale: [1, 1.06, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* top shimmer line */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.75),transparent)]"
        animate={{ opacity: [0.2, 0.9, 0.2], x: ["-40%", "40%", "-40%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground/90">{title}</p>
            <p className="mt-1 text-xs text-muted/70">{subtitle}</p>
          </div>

          {badge ? (
            <span className="shrink-0 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-foreground/80">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {items.map((it) => (
            <SkillChip key={it.title} title={it.title} subtitle={it.subtitle} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

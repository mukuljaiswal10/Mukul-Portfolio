"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "@/components/ui/CountUp";

function parseValue(v) {
  if (typeof v === "number") return { num: v, suffix: "" };
  if (typeof v !== "string") return { text: String(v ?? "") };

  // "10+" , "95/100" => number part + suffix
  const m = v.trim().match(/^(\d+)(.*)$/);
  if (!m) return { text: v };
  return { num: Number(m[1]), suffix: (m[2] || "").trim() };
}

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [breakpoint]);

  return isMobile;
}

export default function StatCard({ value, label }) {
  const parsed = parseValue(value);
  const isMobile = useIsMobile(640);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className={[
        "group relative overflow-hidden rounded-2xl",
        "border border-border/15 bg-foreground/[0.03] p-4 backdrop-blur",
      ].join(" ")}
    >
      {/* premium glow */}
      <div className="pointer-events-none absolute -inset-14 opacity-0 blur-3xl transition duration-700 group-hover:opacity-70 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
      {/* shine sweep */}
      <div className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition duration-700 group-hover:opacity-100 group-hover:translate-x-[520px]" />

      <p className="relative text-xl font-bold text-foreground">
        {"num" in parsed ? (
          <CountUp
            to={parsed.num}
            duration={950}
            suffix={parsed.suffix || ""}
            repeat={isMobile} // ✅ mobile repeat only
          />
        ) : (
          parsed.text
        )}
      </p>

      <p className="relative text-sm text-muted/70">{label}</p>
    </motion.div>
  );
}

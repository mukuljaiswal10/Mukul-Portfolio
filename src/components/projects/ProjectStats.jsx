"use client";

import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";

export default function ProjectStats({ stats = [] }) {
  if (!stats?.length) return null;

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-3">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={0.08 + i * 0.08}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-2xl font-bold">
              <CountUp value={s.value} suffix={s.suffix || ""} />
            </div>
            <div className="mt-1 text-sm text-white/60">{s.label}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

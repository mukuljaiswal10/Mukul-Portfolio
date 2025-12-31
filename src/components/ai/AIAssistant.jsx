"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildAIState, isDismissed, setDismissed } from "@/lib/ai/aiEngine";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function runAction(action) {
  if (!action) return;

  if (action.scrollTo) return scrollToId(action.scrollTo);

  if (action.href) {
    // external
    if (action.href.startsWith("http")) {
      window.open(action.href, "_blank", "noopener,noreferrer");
      return;
    }
    window.location.href = action.href;
    return;
  }
}

export default function AIAssistant({
  currentSection,
  pathname,
  onOpenPalette,
}) {
  const [hidden, setHidden] = useState(false);
  const [tick, setTick] = useState(0);

  // rotate suggestion every few seconds (alive feel)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = setInterval(() => setTick((x) => x + 1), 8500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setHidden(isDismissed());
  }, []);

  const ai = useMemo(() => {
    return buildAIState({ currentSection, pathname, tick });
  }, [currentSection, pathname, tick]);

  const suggestion = ai?.suggestion;

  // swipe hint: show right when not at last/first? Here we keep premium neutral
  const hint = ai?.micro;

  return (
    <AnimatePresence>
      {!hidden ? (
        <motion.div
          className="fixed bottom-4 right-4 z-[85] w-[92vw] max-w-[420px] sm:w-[380px]"
          initial={{ y: 22, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 22, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-border/15 bg-background/80 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur">
            {/* glow */}
            <div className="pointer-events-none absolute -inset-16 opacity-70 blur-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />

            {/* top row */}
            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] text-foreground/60">
                  {ai?.dayVibe} • Smart suggestion
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-foreground">
                  {suggestion?.title || "Explore the site"}
                </p>
                <p className="mt-1 text-xs text-foreground/70">
                  {suggestion?.subtitle || hint}
                </p>
              </div>

              <button
                onClick={() => {
                  setHidden(true);
                  setDismissed(true);
                }}
                className="shrink-0 rounded-full border border-border/15 bg-foreground/[0.03] px-2 py-1 text-xs text-foreground/70 hover:bg-foreground/[0.06]"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>

            {/* actions */}
            <div className="relative mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => runAction(suggestion?.primary)}
                className="rounded-2xl border border-border/15 bg-foreground/[0.08] px-4 py-2 text-sm text-foreground hover:bg-foreground/[0.10] active:scale-[0.99] transition"
              >
                {suggestion?.primary?.label || "Open"}
              </button>

              <button
                onClick={() => runAction(suggestion?.secondary)}
                className="rounded-2xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/85 hover:bg-foreground/[0.06] active:scale-[0.99] transition"
              >
                {suggestion?.secondary?.label || "Scroll"}
              </button>

              <button
                onClick={onOpenPalette}
                className="ml-auto rounded-2xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-sm text-foreground/85 hover:bg-foreground/[0.06] active:scale-[0.99] transition"
                title="Ctrl/⌘ + K"
              >
                ⌘K
              </button>
            </div>

            <p className="relative mt-3 text-[11px] text-foreground/55">
              {hint}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

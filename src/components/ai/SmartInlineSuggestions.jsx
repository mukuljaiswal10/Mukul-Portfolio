"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { SECTION_NUDGES } from "@/components/ai/aiNudges";
import {
  acquireLock,
  releaseLock,
  isLocked,
} from "@/components/ai/suggestionLock";

const SECTION_IDS = [
  "home",
  "about",
  "skills",
  "projects",
  "testimonials",
  "faq",
  "contact",
];

const FIRST_SHOW_DELAY = 3800;
const AUTO_HIDE_MS = 5200;

const MIN_GAP_AFTER_CLOSE = 9000;
const MIN_GAP_BETWEEN_SHOWS = 7500;
const MIN_GAP_PER_SECTION = 12000;

const LOCK_OWNER = "inline-top";

function pickRandom(arr, avoidTitle) {
  if (!arr?.length) return null;
  const filtered = avoidTitle ? arr.filter((x) => x.title !== avoidTitle) : arr;
  return filtered[Math.floor(Math.random() * filtered.length)] || arr[0];
}

function isTypingNow() {
  if (typeof document === "undefined") return false;
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
}

export default function SmartInlineSuggestions() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(null);

  const lastSectionRef = useRef(null);
  const lastTitleRef = useRef(null);

  const hideTimerRef = useRef(null);
  const firstTimerRef = useRef(null);

  const lastShownAtRef = useRef(0);
  const lastClosedAtRef = useRef(0);
  const lastSectionShownAtRef = useRef({});

  const isHome =
    pathname === "/" || pathname?.includes("/(site)") || pathname === "/home";

  const action = useMemo(() => {
    return (cta) => {
      if (!cta) return;

      if (cta.action === "palette") {
        window.dispatchEvent(new CustomEvent("open-command-palette"));
        return;
      }

      if (cta.action === "goto") {
        const id = cta.target;
        if (!id) return;

        if (!isHome) {
          router.push(`/#${id}`);
          return;
        }

        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (cta.action === "page") {
        if (cta.href) router.push(cta.href);
      }
    };
  }, [router, isHome]);

  const hardClose = () => {
    setOpen(false);
    lastClosedAtRef.current = Date.now();
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = null;
    releaseLock(LOCK_OWNER);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const show = (sectionId) => {
      if (!sectionId) return;
      if (isTypingNow()) return;

      // ✅ IMPORTANT: if ANY suggestion is already open -> do nothing
      if (isLocked()) return;

      const now = Date.now();

      if (open) return;
      if (now - lastClosedAtRef.current < MIN_GAP_AFTER_CLOSE) return;
      if (now - lastShownAtRef.current < MIN_GAP_BETWEEN_SHOWS) return;

      const lastForThis = lastSectionShownAtRef.current?.[sectionId] || 0;
      if (now - lastForThis < MIN_GAP_PER_SECTION) return;

      // ✅ acquire global lock BEFORE opening
      const ok = acquireLock(LOCK_OWNER);
      if (!ok) return;

      const pool = SECTION_NUDGES[sectionId] || SECTION_NUDGES.home;
      const next = pickRandom(pool, lastTitleRef.current);
      if (!next) {
        releaseLock(LOCK_OWNER);
        return;
      }

      lastTitleRef.current = next.title;
      lastSectionRef.current = sectionId;

      setNudge(next);
      setOpen(true);

      lastShownAtRef.current = now;
      lastSectionShownAtRef.current = {
        ...lastSectionShownAtRef.current,
        [sectionId]: now,
      };

      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setOpen(false);
        lastClosedAtRef.current = Date.now();
        releaseLock(LOCK_OWNER);
      }, AUTO_HIDE_MS);
    };

    // observers
    const observers = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          const e = entries?.[0];
          if (!e?.isIntersecting) return;
          if (lastSectionRef.current === id) return;
          show(id);
        },
        { threshold: 0.45, root: null, rootMargin: "-10% 0px -55% 0px" }
      );

      obs.observe(el);
      observers.push(obs);
    });

    // first nudge after 3-4s (but ONLY if lock free)
    if (firstTimerRef.current) clearTimeout(firstTimerRef.current);
    firstTimerRef.current = setTimeout(() => show("home"), FIRST_SHOW_DELAY);

    // if some other component releases lock, we don't auto-open instantly here.
    // (your existing timing logic already handles it via scroll/sections)

    return () => {
      observers.forEach((o) => o.disconnect());
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (firstTimerRef.current) clearTimeout(firstTimerRef.current);
      hideTimerRef.current = null;
      firstTimerRef.current = null;

      // safety: if unmount while open
      releaseLock(LOCK_OWNER);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, open]);

  return (
    <div className="pointer-events-none fixed left-1/2 top-[calc(env(safe-area-inset-top)+12px)] z-[80] -translate-x-1/2 px-3">
      <AnimatePresence>
        {open && nudge ? (
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, scale: 0.985, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="pointer-events-auto w-[min(520px,92vw)] rounded-2xl border border-border/25 bg-background/65 backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,0.45)]"
          >
            <div className="relative p-4 sm:p-5">
              <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 opacity-60" />

              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-foreground/60">
                    Smart suggestion
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {nudge.title}
                  </p>
                  <p className="mt-1 text-sm text-foreground/75">
                    {nudge.desc}
                  </p>
                </div>

                <button
                  onClick={hardClose}
                  className="shrink-0 rounded-xl border border-border/25 bg-foreground/[0.04] px-3 py-2 text-xs text-foreground/80 hover:bg-foreground/[0.06]"
                >
                  Close
                </button>
              </div>

              <div className="relative mt-4 flex flex-wrap items-center gap-2">
                {nudge.cta ? (
                  <button
                    onClick={() => {
                      hardClose();
                      action(nudge.cta);
                    }}
                    className="rounded-xl border border-border/25 bg-foreground/[0.06] px-4 py-2 text-sm text-foreground hover:bg-foreground/[0.08]"
                  >
                    {nudge.cta.label}
                  </button>
                ) : null}

                <button
                  onClick={() => {
                    hardClose();
                    window.dispatchEvent(
                      new CustomEvent("open-command-palette")
                    );
                  }}
                  className="rounded-xl border border-border/25 bg-transparent px-4 py-2 text-sm text-foreground/85 hover:bg-foreground/[0.04]"
                >
                  ⌘K / Ctrl+K
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

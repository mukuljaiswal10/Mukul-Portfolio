"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
  filterActions,
  getSearchActions,
  getPopularSearches,
} from "@/components/ai/searchActions";

/** ✅ Body scroll lock while modal is open */
function useLockBodyScroll(locked) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!locked) return;

    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevBodyPaddingRight;
    };
  }, [locked]);
}

export default function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  useLockBodyScroll(open);

  // ✅ auto actions (pages + sections + blog posts)
  const actions = useMemo(() => getSearchActions({ pathname }), [pathname]);

  const filtered = useMemo(() => {
    return filterActions(actions, q);
  }, [actions, q]);

  // ✅ popular chips (auto sync from blog tags/category + base)
  const popular = useMemo(() => getPopularSearches({ limit: 10 }), []);

  const close = () => {
    setOpen(false);
    setQ("");
    setActive(0);
  };

  const runSelected = (idx) => {
    const item = filtered[idx];
    if (!item) return;
    close();
    setTimeout(() => {
      // ✅ Prefer href navigation (pages/sections)
      const href =
        item?.href ||
        item?.action?.href ||
        item?.action?.target ||
        item?.target ||
        item?.to;

      if (href) {
        router.push(href);
        return;
      }

      // ✅ If action is a function (fallback)
      if (typeof item?.action === "function") {
        item.action({ router, pathname });
      }
    }, 10);
  };

  // keyboard controls + global open event
  useEffect(() => {
    const onKey = (e) => {
      const isK = e.key?.toLowerCase() === "k";
      const mod = e.metaKey || e.ctrlKey;

      if (mod && isK) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      if (!open) return;

      if (e.key === "Escape") close();
      if (e.key === "ArrowDown")
        setActive((x) => Math.min(x + 1, Math.max(filtered.length - 1, 0)));
      if (e.key === "ArrowUp") setActive((x) => Math.max(x - 1, 0));
      if (e.key === "Enter") runSelected(active);
    };

    const onOpen = () => setOpen(true);

    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filtered, active]);

  // focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  // reset active when filter changes
  useEffect(() => {
    setActive(0);
  }, [q]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-[2px]"
          onMouseDown={close}
        >
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="mx-auto mt-[12vh] w-[min(780px,92vw)] rounded-2xl border border-border/25 bg-background/85 backdrop-blur-xl shadow-[0_22px_70px_rgba(0,0,0,0.45)]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-foreground/60">Quick Navigate</p>
                  <p className="text-base font-semibold">Search anything…</p>
                </div>
                <div className="text-xs text-foreground/60">Esc to close</div>
              </div>

              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search: blog, docker, skills, contact…"
                className="mt-4 w-full rounded-xl border border-border/25 bg-foreground/[0.04] px-4 py-3 text-sm text-foreground outline-none placeholder:text-foreground/45 focus:bg-foreground/[0.06]"
              />

              {/* ✅ popular quick chips (auto sync) */}
              {!q?.trim() ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {popular.map((x) => (
                    <button
                      key={x}
                      type="button"
                      onClick={() => {
                        setQ(x);
                        setTimeout(() => inputRef.current?.focus(), 0);
                      }}
                      className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1.5 text-[11px] text-foreground/70 hover:bg-foreground/[0.06]"
                    >
                      {x}
                    </button>
                  ))}
                </div>
              ) : null}

              {/* ✅ IMPORTANT: scroll only inside palette */}
              <div className="mt-4 max-h-[48vh] overflow-y-auto overscroll-contain pr-1">
                <div className="space-y-2">
                  {filtered.slice(0, 30).map((a, idx) => (
                    <button
                      key={a.id}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => runSelected(idx)}
                      className={[
                        "w-full rounded-xl border px-4 py-3 text-left transition",
                        idx === active
                          ? "border-foreground/30 bg-foreground/[0.08]"
                          : "border-border/20 bg-transparent hover:bg-foreground/[0.05]",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {a.label}
                          </p>
                          <p className="truncate text-xs text-foreground/60">
                            {a.hint}
                          </p>
                        </div>
                        <span className="rounded-full border border-border/25 bg-foreground/[0.04] px-3 py-1 text-[11px] text-foreground/70">
                          Enter
                        </span>
                      </div>
                    </button>
                  ))}

                  {!filtered.length ? (
                    <div className="rounded-xl border border-border/20 bg-foreground/[0.03] p-4 text-sm text-foreground/70">
                      No results. Try: <b>blog</b>, <b>docker</b>, <b>skills</b>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-foreground/55">
                <span>↑ ↓ navigate • Enter open</span>
                <span>⌘K / Ctrl+K toggle</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

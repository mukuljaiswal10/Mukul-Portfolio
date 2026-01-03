"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import {
  getSearchActions,
  filterActions,
  getPopularSearches,
} from "@/components/ai/searchActions";

const STORAGE_RECENTS = "mukul_nav_recent_v1";
const MAX_RECENTS = 6;

const IDX_CACHE_KEY = "mukul_search_index_cache_v1";
const IDX_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

function cn(...a) {
  return a.filter(Boolean).join(" ");
}

function loadRecents() {
  try {
    const raw = localStorage.getItem(STORAGE_RECENTS);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveRecents(ids) {
  try {
    localStorage.setItem(
      STORAGE_RECENTS,
      JSON.stringify(ids.slice(0, MAX_RECENTS))
    );
  } catch {}
}

function loadIndexCache() {
  try {
    const raw = localStorage.getItem(IDX_CACHE_KEY);
    const data = raw ? JSON.parse(raw) : null;
    if (!data?.ts || Date.now() - data.ts > IDX_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function saveIndexCache(payload) {
  try {
    localStorage.setItem(
      IDX_CACHE_KEY,
      JSON.stringify({ ts: Date.now(), ...payload })
    );
  } catch {}
}

function highlightParts(text, q) {
  const s = String(text ?? "");
  const query = String(q ?? "")
    .trim()
    .toLowerCase();
  if (!query) return { before: s, match: null, after: "" };

  // tokens: "tailwind css" => ["tailwind","css"]
  const tokens = query.split(/\s+/).filter(Boolean);
  const lower = s.toLowerCase();

  // best match choose: earliest index, and same index pe longer token
  let bestIdx = -1;
  let bestToken = "";

  for (const t of tokens) {
    const idx = lower.indexOf(t);
    if (idx === -1) continue;

    if (
      bestIdx === -1 ||
      idx < bestIdx ||
      (idx === bestIdx && t.length > bestToken.length)
    ) {
      bestIdx = idx;
      bestToken = t;
    }
  }

  // fallback: full query as single match
  if (bestIdx === -1) {
    const idx2 = lower.indexOf(query);
    if (idx2 === -1) return { before: s, match: null, after: "" };
    bestIdx = idx2;
    bestToken = query;
  }

  return {
    before: s.slice(0, bestIdx),
    match: s.slice(bestIdx, bestIdx + bestToken.length),
    after: s.slice(bestIdx + bestToken.length),
  };
}

function highlightNode(text, q) {
  const { before, match, after } = highlightParts(text, q);
  if (!match) return <>{text}</>;

  return (
    <>
      {before}
      <span className="text-[#FFD54A] drop-shadow-[0_0_10px_rgba(255,215,0,0.35)]">
        {match}
      </span>
      {after}
    </>
  );
}

export default function StickyNavSearch() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [recents, setRecents] = useState([]);

  // ✅ dynamic actions from API
  const [dynActions, setDynActions] = useState([]);
  const [dynChips, setDynChips] = useState([]);

  // small message when user presses enter on no results
  const [noHitMsg, setNoHitMsg] = useState("");

  const inputRef = useRef(null);

  const isHome =
    pathname === "/" || pathname?.includes("/(site)") || pathname === "/home";

  // ✅ load recents on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    setRecents(loadRecents());
  }, []);

  // ✅ fetch dynamic index once (cached)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cached = loadIndexCache();
    if (cached?.items?.length) {
      setDynActions(cached.items);
      setDynChips(cached.popularChips || []);
    }

    const ac = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/search-index", { signal: ac.signal });
        const data = await res.json().catch(() => null);
        if (!data?.ok) return;

        const items = Array.isArray(data.items) ? data.items : [];
        const chips = Array.isArray(data.popularChips) ? data.popularChips : [];

        setDynActions(items);
        setDynChips(chips);

        saveIndexCache({ items, popularChips: chips });
      } catch {
        // ignore (offline etc)
      }
    })();

    return () => ac.abort();
  }, []);

  // ✅ lock body scroll when open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!open) return;

    const prevOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [open]);

  // ✅ base actions + dynamic actions
  const { actions } = useMemo(() => {
    const res = getSearchActions({ pathname });

    // ✅ backward compatible: agar old version array return kare to bhi chale
    const baseActions = Array.isArray(res) ? res : res?.actions || [];

    const dyn = dynActions || [];

    // de-dupe by id
    const map = new Map();
    [...baseActions, ...dyn].forEach((a) => {
      if (!a?.id) return;
      map.set(a.id, a);
    });

    return {
      actions: [...map.values()],
    };
  }, [pathname, dynActions]);

  // ✅ chips
  const popular = useMemo(() => {
    const apiChips = dynChips?.length ? dynChips : [];
    if (apiChips.length) return apiChips.slice(0, 10);
    return getPopularSearches({ limit: 10 });
  }, [dynChips]);

  // ✅ filtered list (fuzzy + sorted)
  const filtered = useMemo(() => {
    const s = q.trim();
    const base = s ? filterActions(actions, s) : actions;
    return base.slice(0, 14);
  }, [actions, q]);

  // ✅ recent actions
  const recentActions = useMemo(() => {
    if (!recents?.length) return [];
    const map = new Map(actions.map((a) => [a.id, a]));
    return recents.map((id) => map.get(id)).filter(Boolean);
  }, [recents, actions]);

  const commitRecent = (actionId) => {
    setRecents((prev) => {
      const next = [actionId, ...(prev || []).filter((x) => x !== actionId)];
      saveRecents(next);
      return next;
    });
  };

  // ✅ run item (navigation + section scroll)
  const runItem = (item) => {
    if (!item) return;

    commitRecent(item.id);

    setOpen(false);
    setQ("");
    setActive(0);
    setNoHitMsg("");

    const href = item.href || item.target || "/";
    const kind = item.kind || item.type || "";

    // ✅ if section -> handle scroll
    if (kind === "section") {
      const hash = href.includes("#") ? href.split("#")[1] : "";
      if (!hash) {
        router.push(href);
        return;
      }

      // ✅ if already on home => scroll
      if (isHome) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
        return;
      }

      // ✅ go to home with hash
      router.push(`/#${hash}`);
      return;
    }

    router.push(href);
  };

  // ✅ keyboard (FIXED: CAPTURE mode so it wins against other Ctrl+K handlers)
  useEffect(() => {
    const onKey = (e) => {
      const isK = e.key?.toLowerCase() === "k";
      const mod = e.metaKey || e.ctrlKey;

      // ✅ Ctrl+K toggle (stop other components from hijacking)
      if (mod && isK) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
        setOpen((v) => !v);
        return;
      }

      if (!open) return;

      // ✅ When modal open, stop other listeners (Enter/Arrows/Esc)
      if (
        e.key === "Escape" ||
        e.key === "Enter" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowUp"
      ) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
      }

      if (e.key === "Escape") {
        setOpen(false);
        setNoHitMsg("");
        return;
      }

      const list = q.trim()
        ? filtered
        : recentActions.length
        ? recentActions
        : filtered;

      if (e.key === "ArrowDown") {
        setActive((x) => Math.min(x + 1, Math.max(list.length - 1, 0)));
        return;
      }
      if (e.key === "ArrowUp") {
        setActive((x) => Math.max(x - 1, 0));
        return;
      }

      if (e.key === "Enter") {
        // ✅ If user typed something but list empty -> don't navigate
        if (q.trim() && !list.length) {
          setNoHitMsg("Not found. Try a different keyword.");
          return;
        }

        const item = list[active];
        if (!item) return;
        runItem(item);
      }
    };

    // ✅ capture=true (IMPORTANT)
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, filtered, active, q, recentActions]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ focus on open
  useEffect(() => {
    if (!open) return;
    setNoHitMsg("");
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  const clearSearch = () => {
    setQ("");
    setActive(0);
    setNoHitMsg("");
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  const list = q.trim()
    ? filtered
    : recentActions.length
    ? recentActions
    : filtered;

  return (
    <>
      {/* ✅ Fixed pill */}
      <div
        className={[
          "fixed z-[92]",
          "sm:top-[calc(env(safe-area-inset-top)+92px)] sm:right-6",
          "bottom-[calc(env(safe-area-inset-bottom)+180px)] right-4 sm:bottom-auto",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={[
            "group relative overflow-hidden rounded-3xl border",
            "border-white/10 bg-black/70 backdrop-blur-xl",
            "shadow-[0_18px_55px_rgba(0,0,0,0.55)]",
            "flex items-center",
            "gap-2 px-2.5 py-2",
            "sm:gap-3 sm:px-4 sm:py-3",
            "transition active:scale-[0.98]",
          ].join(" ")}
          aria-label="Open quick navigate search"
        >
          <span className="pointer-events-none absolute -left-28 top-0 h-full w-28 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60 translate-x-0 group-hover:translate-x-[520px] transition duration-700" />

          <span className="relative grid h-8 w-8 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] sm:h-9 sm:w-9">
            <span className="pointer-events-none absolute inset-[-12px] rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.32),transparent_60%)] blur-xl animate-[goldPulse_1.8s_ease-in-out_infinite]" />
            <span className="text-[16px] text-[#FFD54A] drop-shadow-[0_0_14px_rgba(255,215,0,0.45)] animate-[sparkleTwinkle_1.35s_ease-in-out_infinite] sm:text-[18px]">
              ✦
            </span>
          </span>

          <span className="text-left leading-tight">
            <span className="block text-[10px] text-white/65 sm:text-xs">
              Quick Navigate
            </span>
            <span className="block text-[13px] font-semibold text-white sm:text-base">
              Search
            </span>
          </span>

          <span className="ml-1 rounded-2xl border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] text-white/80 sm:px-3 sm:text-[11px]">
            <span className="sm:hidden">Tap</span>
            <span className="hidden sm:inline">Click</span>
          </span>

          <span className="ml-2 hidden sm:inline text-xs text-white/40">
            ⌘K / Ctrl+K
          </span>
        </button>
      </div>

      {/* ✅ Panel */}
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[95] bg-black/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.985 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={[
                "mx-auto mt-[8vh] w-[min(720px,92vw)]",
                "rounded-3xl border border-white/10",
                "bg-black/85 backdrop-blur-xl",
                "shadow-[0_28px_90px_rgba(0,0,0,0.75)]",
              ].join(" ")}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/55">Quick Navigate</p>
                    <p className="text-base font-semibold text-white">
                      Search anything…
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/75 hover:bg-white/[0.08]"
                  >
                    Esc
                  </button>
                </div>

                {/* input */}
                <div className="relative mt-4">
                  <input
                    ref={inputRef}
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      setActive(0);
                      setNoHitMsg("");
                    }}
                    placeholder="Search: blog, docker, skills, contact…"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 pr-11 text-sm text-white outline-none placeholder:text-white/35 focus:bg-white/[0.07]"
                  />

                  {q?.length ? (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  ) : null}
                </div>

                {/* Popular chips (only when query empty) */}
                {!q.trim() && popular?.length ? (
                  <div className="mt-3">
                    <div className="mb-2 flex items-center gap-2 text-xs text-white/55">
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                        <span className="text-[#FFD54A]">✦</span> Popular
                      </span>
                      <span className="text-white/40">(auto)</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {popular.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setQ(t);
                            setActive(0);
                            setNoHitMsg("");
                            setTimeout(() => inputRef.current?.focus(), 30);
                          }}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/75 hover:bg-white/[0.07]"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* results */}
                <div className="mt-4 max-h-[42vh] overflow-auto pr-1 overscroll-contain sm:max-h-[50vh]">
                  {!q.trim() && recentActions.length ? (
                    <div className="mb-2 flex items-center gap-2 text-xs text-white/55">
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                        <span className="text-[#FFD54A]">✦</span> Recent
                      </span>
                      <span className="text-white/40">(auto)</span>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    {list.map((a, idx) => (
                      <button
                        key={a.id}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => runItem(a)}
                        className={[
                          "w-full rounded-2xl border px-4 py-3 text-left transition",
                          idx === active
                            ? "border-[#FFD54A]/35 bg-white/[0.08]"
                            : "border-white/10 bg-transparent hover:bg-white/[0.05]",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {highlightNode(a.label, q)}
                            </p>
                            <p className="truncate text-xs text-white/55">
                              {highlightNode(a.hint, q)}
                            </p>
                          </div>

                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70">
                            Enter
                          </span>
                        </div>
                      </button>
                    ))}

                    {!list.length ? (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70">
                        No results. Try: <b>blog</b>, <b>docker</b>,{" "}
                        <b>skills</b>
                      </div>
                    ) : null}

                    {noHitMsg ? (
                      <div className="rounded-2xl border border-[#FFD54A]/20 bg-[#FFD54A]/10 p-3 text-sm text-[#F6E7B2]">
                        {noHitMsg}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/45">
                  <span>↑ ↓ navigate • Enter open • Esc close</span>
                  <span>⌘K / Ctrl+K</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes goldPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.95;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.65;
          }
        }
        @keyframes sparkleTwinkle {
          0% {
            transform: rotate(0deg) scale(0.98);
            filter: brightness(1);
          }
          50% {
            transform: rotate(6deg) scale(1.08);
            filter: brightness(1.35);
          }
          100% {
            transform: rotate(0deg) scale(0.98);
            filter: brightness(1);
          }
        }
      `}</style>
    </>
  );
}

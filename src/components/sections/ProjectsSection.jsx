"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { projects } from "@/data/projects";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import TiltCard from "@/components/ui/TiltCard";
import { blurDataURL } from "@/lib/blur";
import LuxuryButton from "../ui/LuxuryButton";
import { normalizeTags } from "@/lib/tags"; // ✅ NEW (tag-aware search)

/* ---------------- helpers ---------------- */

// ✅ robust slug normalizer (url-safe + data-safe)
function slugKey(s) {
  return decodeURIComponent(String(s || ""))
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** ✅ Same pattern like ContactSection (CustomEvent for scroll) */
const SCROLL_EVENT = "mukul:scrollTo";
export function broadcastScrollTo(id) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SCROLL_EVENT, { detail: { id } }));
}

/** ✅ WIP detector (data-driven) */
function isWipProject(p) {
  return Boolean(
    p?.wip === true ||
      p?.isWip === true ||
      String(p?.status || "").toLowerCase() === "wip" ||
      String(p?.stage || "").toLowerCase() === "wip"
  );
}

/** ✅ Desktop-only / Not responsive detector (data-driven) */
function isDesktopOnlyProject(p) {
  const mode = String(p?.responsiveMode || "").toLowerCase();
  const status = String(p?.status || "").toLowerCase();
  const stage = String(p?.stage || "").toLowerCase();

  return Boolean(
    p?.responsive === false ||
      p?.isResponsive === false ||
      p?.desktopOnly === true ||
      mode === "desktop" ||
      mode === "desktop-only" ||
      status.includes("desktop") ||
      stage.includes("desktop")
  );
}

/** ✅ Premium WIP overlay (UI only, pointer-events none) */
function WipOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-black/35" />

      <motion.div
        aria-hidden
        className="absolute -left-40 top-0 h-full w-40 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60"
        animate={{ x: [0, 720, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={{ opacity: 0.75 }}
        animate={{ opacity: [0.45, 0.85, 0.45] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute left-6 top-6 text-[#FFD54A] drop-shadow-[0_0_12px_rgba(255,215,0,0.55)]">
          ✦
        </span>
        <span className="absolute right-10 top-10 text-[#FFD54A] drop-shadow-[0_0_12px_rgba(255,215,0,0.55)]">
          ✦
        </span>
        <span className="absolute left-10 bottom-10 text-[#FFD54A] drop-shadow-[0_0_12px_rgba(255,215,0,0.55)]">
          ✦
        </span>
      </motion.div>

      <motion.div
        className="absolute right-3 top-3"
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#FFD54A]/25 bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-[#F6E7B2] backdrop-blur">
          <span className="mr-1 text-[#FFD54A]">⚡</span> Work in progress
          <span className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-70" />
        </div>
      </motion.div>

      <div className="absolute inset-0 grid place-items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.26, ease: "easeOut" }}
          className="w-full max-w-[320px] rounded-3xl border border-white/10 bg-black/55 p-4 text-center backdrop-blur-xl"
        >
          <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.06]">
            <span className="text-[#FFD54A] drop-shadow-[0_0_14px_rgba(255,215,0,0.45)]">
              ✦
            </span>
          </div>
          <p className="text-sm font-semibold text-white">
            This project is under development
          </p>
          <p className="mt-1 text-xs text-white/70">
            Premium build in progress — details will be updated soon.
          </p>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className="absolute -inset-[1px] rounded-xl bg-[radial-gradient(circle,rgba(255,215,0,0.22),transparent_58%)] blur-xl"
        animate={{ opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function DesktopOnlyOverlay({ label }) {
  const text = String(label || "").trim() || "Desktop-First";
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_30%,transparent_65%)] opacity-70" />
      <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(135deg,transparent_0px,transparent_10px,rgba(255,255,255,0.06)_10px,rgba(255,255,255,0.06)_11px)]" />

      <motion.div
        aria-hidden
        className="absolute -left-32 top-0 h-full w-32 rotate-12 bg-gradient-to-r from-transparent via-white/14 to-transparent opacity-55"
        animate={{ x: [0, 760] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-3 top-3"
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-white/85 backdrop-blur">
          <span className="mr-1">🖥️</span> {text}
          <span className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-70" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-3 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 6, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="rounded-2xl border border-white/10 bg-black/45 px-3 py-1 text-[11px] text-white/75 backdrop-blur">
          Best experience on laptop/desktop
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute -inset-[1px] rounded-xl bg-[radial-gradient(circle,rgba(125,211,252,0.18),transparent_58%)] blur-xl"
        animate={{ opacity: [0.18, 0.42, 0.18] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function ProjectCard({ p, i }) {
  const isWip = isWipProject(p);
  const isDesktopOnly = isDesktopOnlyProject(p);

  const desktopLabel =
    p?.responsiveLabel ||
    p?.desktopLabel ||
    (p?.responsive === false ? "Desktop-First" : "");

  return (
    <Reveal delay={0.08 + i * 0.08}>
      <TiltCard className="flex flex-col">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
          <Image
            src={p.image || "/images/project-placeholder.jpg"}
            alt={p.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={blurDataURL(1200, 675)}
            className="object-cover transition duration-700 ease-out group-hover:scale-110"
            priority={i === 0}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur">
            {p.tags?.[0] || "Project"}
          </div>

          {isDesktopOnly ? <DesktopOnlyOverlay label={desktopLabel} /> : null}
          {isWip ? <WipOverlay /> : null}
        </div>

        <div className="mt-5 flex-1">
          <p className="text-lg font-semibold">{p.title}</p>
          <p className="mt-2 text-sm text-white/70">{p.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(p.tags || []).map((t, idx) => (
              <Reveal key={`${t}-${idx}`} delay={0.12 + i * 0.06 + idx * 0.02}>
                <Badge>{t}</Badge>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.18 + i * 0.06}>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              href={`/projects/${encodeURIComponent(slugKey(p.slug))}`}
              variant="outline"
            >
              Details
            </Button>
            {p.liveUrl ? (
              <Button href={p.liveUrl} variant="ghost">
                Live →
              </Button>
            ) : null}
          </div>
        </Reveal>
      </TiltCard>
    </Reveal>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative shrink-0 rounded-full px-4 py-2 text-sm transition",
        "border border-border/15 backdrop-blur",
        active ? "text-foreground" : "text-foreground/75 hover:text-foreground",
      ].join(" ")}
      type="button"
    >
      <span
        className={[
          "absolute inset-0 rounded-full",
          active ? "bg-foreground/[0.09]" : "bg-foreground/[0.03]",
        ].join(" ")}
      />
      {active ? (
        <span className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[6px]" />
      ) : null}

      <span className="relative inline-flex items-center gap-2">
        <span
          className={
            active
              ? "h-1.5 w-1.5 rounded-full bg-foreground/80"
              : "h-1.5 w-1.5 rounded-full bg-foreground/45"
          }
        />
        {children}
      </span>

      {active ? (
        <motion.span
          layoutId="chip-underline"
          className="pointer-events-none absolute left-4 right-4 -bottom-[6px] h-[2px] rounded-full bg-foreground/80"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      ) : null}
    </button>
  );
}

function SearchBar({ value, onChange, onClear, inputRef }) {
  return (
    <div className="mt-4">
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/60">
          🔎
        </span>

        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search projects… (Press /)"
          className={[
            "w-full rounded-2xl pl-11 pr-16 py-3 text-sm outline-none transition",
            "border border-border/12 bg-foreground/[0.03] text-foreground",
            "placeholder:text-foreground/45",
            "focus:border-border/25 focus:bg-foreground/[0.05]",
          ].join(" ")}
        />

        {value ? (
          <button
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-12 top-1/2 -translate-y-1/2 rounded-xl border border-border/12 bg-foreground/[0.03] px-2 py-1 text-xs text-foreground/70 hover:bg-foreground/[0.06]"
            type="button"
          >
            ✕
          </button>
        ) : null}

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-border/12 bg-foreground/[0.03] px-2 py-1 text-[11px] text-foreground/55">
          /
        </span>

        <span className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-60 blur-xl" />
      </div>

      <p className="mt-2 text-xs text-muted/60">
        Tip: Try <span className="text-foreground/80">Next.js</span>,{" "}
        <span className="text-foreground/80">UI</span>,{" "}
        <span className="text-foreground/80">Bootstrap</span>
      </p>
    </div>
  );
}

/* --------- Search helpers (NEW) --------- */

function normText(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tagKey(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;

  const m = a.length;
  const n = b.length;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function fuzzyTokenMatch(token, candidate) {
  if (!token || !candidate) return false;
  if (token === candidate) return true;

  // prefix match (good for "tailwind" -> "tailwind css")
  if (
    token.length >= 3 &&
    (candidate.startsWith(token) || token.startsWith(candidate))
  ) {
    return true;
  }

  const max = token.length <= 4 ? 1 : 2; // small typos allowed
  return levenshtein(token, candidate) <= max;
}

/**
 * ✅ Try interpret whole query as a canonical tag (CSS, Tailwind CSS, Next.js etc)
 * Only treat it as tag-search if it exists in known tags list.
 */
function queryAsKnownTag(q, knownTagSet) {
  const guess = normalizeTags([q])[0]; // might return "Admin Panel" too
  if (!guess) return null;
  return knownTagSet.has(guess) ? guess : null;
}

export default function ProjectsSection({
  limit,
  showViewAll = false,
  enableFilters = false,
  enableSearch = false,
  syncToUrl = false,
  enableSlashFocus = false,
  sectionId = "projects",
}) {
  const isHome = typeof limit === "number";
  const baseList = isHome ? projects.slice(0, limit) : projects;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /** ✅ section ref for scroll */
  const sectionRef = useRef(null);

  /** ✅ 1) hash based auto-scroll ( /#projects ) */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash?.replace("#", "");
    if (!hash || hash !== sectionId) return;

    const t = setTimeout(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);

    return () => clearTimeout(t);
  }, [sectionId]);

  /** ✅ 2) custom event scroll (command palette / AI suggestions) */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScrollTo = (e) => {
      const id = e?.detail?.id;
      if (!id || id !== sectionId) return;
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    window.addEventListener(SCROLL_EVENT, onScrollTo);
    return () => window.removeEventListener(SCROLL_EVENT, onScrollTo);
  }, [sectionId]);

  // ✅ all chips (from ALL projects)
  const allTags = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    return ["All", ...Array.from(set)];
  }, []);

  // ✅ known tags set for tag-aware search
  const knownTagSet = useMemo(() => {
    const s = new Set();
    allTags.forEach((t) => {
      if (t && t !== "All") s.add(t);
    });
    return s;
  }, [allTags]);

  // ✅ URL initial state (supports tags=HTML,CSS OR legacy tag=CSS)
  const initialTags = useMemo(() => {
    if (!syncToUrl || isHome) return [];
    const multi = searchParams.get("tags");
    if (multi) {
      return multi
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }
    const single = searchParams.get("tag");
    return single && single !== "All" ? [single] : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncToUrl, isHome]);

  const initialQ = syncToUrl && !isHome ? searchParams.get("q") || "" : "";

  // ✅ MULTI chips (empty = All)
  const [activeTags, setActiveTags] = useState(initialTags);
  const [query, setQuery] = useState(initialQ);

  const searchRef = useRef(null);

  // ✅ allow "/" focus
  useEffect(() => {
    if (!enableSlashFocus || !enableSearch || isHome) return;

    const onKeyDown = (e) => {
      if (e.key !== "/") return;

      const el = e.target;
      const tag = el?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" || tag === "textarea" || el?.isContentEditable;

      if (isTyping) return;

      e.preventDefault();
      searchRef.current?.focus?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enableSlashFocus, enableSearch, isHome]);

  // ✅ when typing in search, reset chips to All (as you asked)
  useEffect(() => {
    if (!enableSearch || isHome) return;
    if (query.trim()) {
      setActiveTags([]); // All
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // ✅ sync from URL
  useEffect(() => {
    if (!syncToUrl || isHome) return;

    const q = searchParams.get("q") || "";

    const multi = searchParams.get("tags");
    const nextTags = multi
      ? multi
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
      : (() => {
          const single = searchParams.get("tag");
          return single && single !== "All" ? [single] : [];
        })();

    setQuery((prev) => (prev !== q ? q : prev));
    setActiveTags((prev) => {
      const same =
        prev.length === nextTags.length &&
        prev.every((t) => nextTags.includes(t));
      return same ? prev : nextTags;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, syncToUrl, isHome]);

  // ✅ sync to URL
  const lastUrlRef = useRef("");
  useEffect(() => {
    if (!syncToUrl || isHome) return;

    const sp = new URLSearchParams(searchParams.toString());

    // tags
    if (enableFilters && activeTags.length > 0)
      sp.set("tags", activeTags.join(","));
    else sp.delete("tags");

    // legacy cleanup
    sp.delete("tag");

    // query
    const q = enableSearch ? query.trim() : "";
    if (q) sp.set("q", q);
    else sp.delete("q");

    const qs = sp.toString();
    const nextUrl = qs ? `${pathname}?${qs}` : `${pathname}`;

    if (lastUrlRef.current === nextUrl) return;
    lastUrlRef.current = nextUrl;

    router.replace(nextUrl, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    syncToUrl,
    isHome,
    enableFilters,
    enableSearch,
    activeTags,
    query,
    pathname,
    router,
  ]);

  // ✅ chip scroll: drag + wheel
  // const chipDrag = useRef(null);
  // function onChipPointerDown(e) {
  //   const el = e.currentTarget;
  //   chipDrag.current = {
  //     id: e.pointerId,
  //     startX: e.clientX,
  //     startScroll: el.scrollLeft,
  //   };
  //   try {
  //     el.setPointerCapture(e.pointerId);
  //   } catch {}
  // }
  // function onChipPointerMove(e) {
  //   if (!chipDrag.current || chipDrag.current.id !== e.pointerId) return;
  //   const el = e.currentTarget;
  //   const dx = e.clientX - chipDrag.current.startX;
  //   el.scrollLeft = chipDrag.current.startScroll - dx;
  // }
  // function onChipPointerUp(e) {
  //   if (!chipDrag.current || chipDrag.current.id !== e.pointerId) return;
  //   chipDrag.current = null;
  // }
  // function onChipWheel(e) {
  //   // vertical wheel => horizontal scroll for chips
  //   if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
  //     e.currentTarget.scrollLeft += e.deltaY;
  //   }
  // }

  // ✅ chip scroll: drag + wheel (FIXED: click works + drag works)
  const chipDragRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  const ignoreChipClickRef = useRef(false);

  function onChipPointerDown(e) {
    const el = e.currentTarget;

    // only left click for mouse
    if (e.pointerType === "mouse" && e.button !== 0) return;

    chipDragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };

    try {
      el.setPointerCapture(e.pointerId);
    } catch {}
  }

  function onChipPointerMove(e) {
    const s = chipDragRef.current;
    if (!s.active || s.pointerId !== e.pointerId) return;

    const el = e.currentTarget;
    const dx = e.clientX - s.startX;

    // threshold (tap vs drag)
    if (!s.moved && Math.abs(dx) > 6) {
      s.moved = true;
      ignoreChipClickRef.current = true; // drag हुआ => click ignore
    }

    if (s.moved) {
      el.scrollLeft = s.startScroll - dx;
    }
  }

  function onChipPointerUp(e) {
    const s = chipDragRef.current;
    if (!s.active || s.pointerId !== e.pointerId) return;

    chipDragRef.current = {
      active: false,
      pointerId: null,
      startX: 0,
      startScroll: 0,
      moved: false,
    };

    // next tick में clicks re-enable
    setTimeout(() => {
      ignoreChipClickRef.current = false;
    }, 0);
  }

  function onChipWheel(e) {
    // vertical wheel => horizontal scroll
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  }

  // ✅ toggle multi-tags
  // function toggleTag(t) {
  //   if (t === "All") {
  //     setActiveTags([]);
  //     return;
  //   }
  //   setActiveTags((prev) => {
  //     const has = prev.includes(t);
  //     if (has) return prev.filter((x) => x !== t);
  //     return [...prev, t];
  //   });
  // }

  function toggleTag(t) {
    // ✅ अगर drag हुआ है तो chip click ignore
    if (ignoreChipClickRef.current) return;

    if (t === "All") {
      setActiveTags([]);
      return;
    }

    setActiveTags((prev) => {
      const has = prev.includes(t);
      if (has) return prev.filter((x) => x !== t);
      return [...prev, t];
    });
  }

  // ✅ FILTER LIST
  const list = useMemo(() => {
    let out = baseList;

    // 1) Multi chip filter (AND)
    if (enableFilters && activeTags.length > 0) {
      out = out.filter((p) =>
        activeTags.every((t) => (p.tags || []).includes(t))
      );
    }

    // 2) Search
    if (enableSearch) {
      const raw = query.trim();
      if (!raw) return out;

      // avoid weird matches for 1-letter searches like "x" matching "Next.js"
      // BUT allow if it's a known tag (like "UI")
      const tagHit = queryAsKnownTag(raw, knownTagSet);
      if (!tagHit && raw.length < 2) return out;

      // ✅ if query looks like a known tech tag, do TAG-ONLY match (prevents CSS matching Tailwind CSS)
      if (tagHit) {
        return out.filter((p) => (p.tags || []).includes(tagHit));
      }

      const qNorm = normText(raw);
      const tokens = qNorm.split(" ").filter((t) => t.length >= 2);
      if (tokens.length === 0) return out;

      return out.filter((p) => {
        const title = normText(p.title || "");
        const desc = normText(p.description || "");
        const hay = `${title} ${desc}`.trim();

        const pTagKeys = (p.tags || []).map((t) => tagKey(t));

        // AND across tokens (more accurate)
        return tokens.every((tok) => {
          // title/desc contains token
          if (hay.includes(tok)) return true;

          // fuzzy tag match (typos + tailwindcss / nextjs)
          for (const k of pTagKeys) {
            if (fuzzyTokenMatch(tok, k)) return true;
          }

          return false;
        });
      });
    }

    return out;
  }, [baseList, enableFilters, activeTags, enableSearch, query, knownTagSet]);

  const heading = isHome
    ? {
        eyebrow: "Projects",
        title: "Selected work",
        desc: "A few projects that show my UI and development style.",
      }
    : {
        title: "All projects",
        desc: "Search and filter by stack—explore UI, performance and real builds.",
      };

  return (
    <section ref={sectionRef} id={sectionId} className="py-16 scroll-mt-24">
      <Container>
        <Parallax from={14} to={-14}>
          <Reveal>
            <SectionHeading
              eyebrow={heading.eyebrow}
              title={heading.title}
              desc={heading.desc}
            />
          </Reveal>
        </Parallax>

        {enableFilters ? (
          <div className="mt-6">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />

              <div
                className="no-scrollbar flex gap-2 overflow-x-auto pb-3"
                onPointerDown={onChipPointerDown}
                onPointerMove={onChipPointerMove}
                onPointerUp={onChipPointerUp}
                onPointerCancel={onChipPointerUp}
                onWheel={onChipWheel}
              >
                {allTags.map((t) => {
                  const active =
                    t === "All"
                      ? activeTags.length === 0
                      : activeTags.includes(t);
                  return (
                    <FilterChip
                      key={t}
                      active={active}
                      onClick={() => toggleTag(t)}
                    >
                      {t}
                    </FilterChip>
                  );
                })}
              </div>
            </div>

            <p className="mt-2 text-xs text-muted/60">
              Showing <span className="text-foreground/85">{list.length}</span>{" "}
              project
              {list.length === 1 ? "" : "s"}
              {activeTags.length > 0 ? (
                <>
                  {" "}
                  in{" "}
                  <span className="text-foreground/85">
                    {activeTags.join(", ")}
                  </span>
                </>
              ) : null}
              {enableSearch && query.trim() ? (
                <>
                  {" "}
                  for{" "}
                  <span className="text-foreground/85">“{query.trim()}”</span>
                </>
              ) : null}
            </p>
          </div>
        ) : null}

        {enableSearch ? (
          <SearchBar
            value={query}
            onChange={setQuery}
            onClear={() => setQuery("")}
            inputRef={searchRef}
          />
        ) : null}

        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${enableFilters ? activeTags.join("|") || "all" : "grid"}|${
              enableSearch ? query : ""
            }`}
            initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(10px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-8 grid gap-6 md:grid-cols-2"
          >
            {list.map((p, i) => (
              <ProjectCard key={p.slug} p={p} i={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {list.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border/12 bg-foreground/[0.03] p-8 text-center">
            <p className="text-lg font-semibold text-foreground">
              No projects found
            </p>
            <p className="mt-2 text-sm text-muted/60">
              Try a different keyword or choose another filter.
            </p>

            <div className="mt-5 flex justify-center gap-3">
              {enableFilters ? (
                <button
                  onClick={() => setActiveTags([])}
                  className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
                  type="button"
                >
                  Reset filters
                </button>
              ) : null}
              {enableSearch ? (
                <button
                  onClick={() => setQuery("")}
                  className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
                  type="button"
                >
                  Clear search
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {showViewAll ? (
          <Reveal delay={0.25}>
            <div className="mt-8">
              <LuxuryButton href="/projects" variant="primary">
                View all projects →
              </LuxuryButton>
            </div>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}

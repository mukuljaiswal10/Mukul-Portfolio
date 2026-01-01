"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { getSearchActions, runAction } from "@/components/ai/searchActions";
import { getAllPosts } from "@/lib/blog";

/**
 * ✅ Requirements covered:
 * - All pages (home + blog list + blog detail + others)
 * - Start after START_DELAY_MS
 * - 1 suggestion at a time, SHOW_MS show, close => next after NEXT_GAP_MS
 * - Close by ✕ OR outside click (no overlay, scroll works)
 * - Premium floating AI-like UI + random positions (mobile first)
 */

const START_DELAY_MS = 5000; // ✅ 4s -> 6s (yahi change hota hai)
const SHOW_MS = 7000;
const NEXT_GAP_MS = 80000;

function isMobileLike() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(max-width: 640px)")?.matches;
}

function safeText(s = "") {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Random premium positions (not sticky). */
function pickPosition(isMobile) {
  const mobile = [
    { key: "tm", cls: "top-16 left-1/2 -translate-x-1/2" },
    { key: "tr", cls: "top-16 right-4" },
    { key: "tl", cls: "top-16 left-4" },
    { key: "mm", cls: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" },
    { key: "mr", cls: "top-1/2 right-4 -translate-y-1/2" },
    { key: "ml", cls: "top-1/2 left-4 -translate-y-1/2" },
    { key: "br", cls: "bottom-24 right-4" },
    { key: "bl", cls: "bottom-24 left-4" },
  ];

  const desktop = [
    { key: "tr", cls: "top-24 right-8" },
    { key: "tl", cls: "top-24 left-8" },
    { key: "mr", cls: "top-1/2 right-10 -translate-y-1/2" },
    { key: "ml", cls: "top-1/2 left-10 -translate-y-1/2" },
    { key: "br", cls: "bottom-16 right-10" },
    { key: "bl", cls: "bottom-16 left-10" },
    { key: "tm", cls: "top-24 left-1/2 -translate-x-1/2" },
  ];

  const list = isMobile ? mobile : desktop;

  const weights = list.map((p) => {
    if (!isMobile) return 1;
    if (p.key === "br" || p.key === "bl") return 0.35;
    if (p.key === "mm") return 1.2;
    return 1;
  });

  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[0];
}

/** Build context-aware suggestions from searchActions + blog data */
function buildSuggestions({ pathname, actions, posts }) {
  const isHome =
    pathname === "/" || pathname?.includes("/(site)") || pathname === "/home";
  const isBlogList = pathname === "/blog";
  const isBlogDetail = pathname?.startsWith("/blog/") && pathname !== "/blog";

  const sec = (id) =>
    actions.find((a) => a.kind === "section" && a.sectionId === id);
  const route = (href) =>
    actions.find((a) => a.kind === "route" && a.href === href);
  const anyBlog = actions.filter((a) => String(a.id || "").startsWith("blog:"));

  const latestBlogActions = (() => {
    try {
      const list = (posts || [])
        .slice()
        .sort((a, b) => {
          const da = new Date(a.date || a.publishedAt || 0).getTime();
          const db = new Date(b.date || b.publishedAt || 0).getTime();
          return db - da;
        })
        .slice(0, 2)
        .map((p) => actions.find((x) => x.id === `blog:${p.slug}`))
        .filter(Boolean);
      if (list.length) return list;
    } catch {}
    return anyBlog.slice(0, 2);
  })();

  const base = [
    {
      id: "sug:projects",
      title: "AI Suggestion",
      desc: "See premium work samples — open Projects.",
      cta: "Open Projects →",
      action: route("/projects"),
    },
    {
      id: "sug:skills",
      title: "AI Suggestion",
      desc: "Want tech stack? Check Skills page.",
      cta: "Open Skills →",
      action: route("/skills"),
    },
    {
      id: "sug:contact",
      title: "AI Suggestion",
      desc: "Have a project? Ping me in Contact.",
      cta: "Contact Me →",
      action: route("/contact"),
    },
  ].filter((x) => x.action);

  const home = [
    {
      id: "sug:home:blogSection",
      title: "AI Suggestion",
      desc: "Latest articles? Jump to Blog section on Home.",
      cta: "Go to Blog section →",
      action: sec("blog") || sec("blog-preview"), // ✅ safe (tumhare id me blog-preview bhi hai)
    },
    {
      id: "sug:home:projectsSection",
      title: "AI Suggestion",
      desc: "Scroll directly to Projects section.",
      cta: "Go to Projects section →",
      action: sec("projects"),
    },
    {
      id: "sug:home:contactSection",
      title: "AI Suggestion",
      desc: "Need a quick quote? Jump to Contact section.",
      cta: "Go to Contact section →",
      action: sec("contact"),
    },
  ].filter((x) => x.action);

  const blogList = [
    {
      id: "sug:blog:list:latest1",
      title: "AI Suggestion",
      desc: latestBlogActions?.[0]?.label
        ? `Read: ${latestBlogActions[0].label.replace("Blog:", "").trim()}`
        : "Read the latest blog post.",
      cta: "Open latest →",
      action: latestBlogActions?.[0],
    },
    {
      id: "sug:blog:list:latest2",
      title: "AI Suggestion",
      desc: latestBlogActions?.[1]?.label
        ? `Also try: ${latestBlogActions[1].label.replace("Blog:", "").trim()}`
        : "Explore one more post.",
      cta: "Open →",
      action: latestBlogActions?.[1],
    },
    {
      id: "sug:blog:list:contact",
      title: "AI Suggestion",
      desc: "Want the same UI for your site? Let’s talk.",
      cta: "Contact →",
      action: route("/contact"),
    },
  ].filter((x) => x.action);

  const blogDetail = (() => {
    const slug = pathname.split("/blog/")[1]?.split("?")[0]?.split("#")[0];
    let next = null;
    let prev = null;

    try {
      const sorted = (posts || [])
        .slice()
        .sort(
          (a, b) =>
            new Date(b.date || b.publishedAt || 0) -
            new Date(a.date || b.publishedAt || 0)
        );

      const idx = sorted.findIndex((p) => p.slug === slug);
      if (idx >= 0) {
        next = sorted[idx + 1];
        prev = sorted[idx - 1];
      }
    } catch {}

    const nextAction = next
      ? actions.find((a) => a.id === `blog:${next.slug}`)
      : null;

    return [
      {
        id: "sug:blog:detail:back",
        title: "AI Suggestion",
        desc: "Back to all blogs.",
        cta: "Open Blog →",
        action: route("/blog"),
      },
      {
        id: "sug:blog:detail:next",
        title: "AI Suggestion",
        desc: next
          ? `Next read: ${safeText(next.title)}`
          : "Explore another post.",
        cta: "Open next →",
        action: nextAction || anyBlog.find((a) => a.id !== `blog:${slug}`),
      },
      {
        id: "sug:blog:detail:contact",
        title: "AI Suggestion",
        desc: "Need help implementing this? Message me.",
        cta: "Contact →",
        action: route("/contact"),
      },
    ].filter((x) => x.action);
  })();

  if (isHome) return [...home, ...base];
  if (isBlogList) return [...blogList, ...base];
  if (isBlogDetail) return [...blogDetail, ...base];

  return [...base, ...home.filter((x) => x.action)];
}

export default function AISuggestions() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const [current, setCurrent] = useState(null);

  const [mobile, setMobile] = useState(false);

  // ✅ countdown state (7 -> 0)
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(SHOW_MS / 1000));
  const countdownRef = useRef(null);

  const timers = useRef({ start: null, autoClose: null, next: null });
  const cardRef = useRef(null);
  const usedRef = useRef(new Set());

  useEffect(() => {
    const update = () => setMobile(isMobileLike());
    update();
    window.addEventListener?.("resize", update);
    return () => window.removeEventListener?.("resize", update);
  }, []);

  const actions = useMemo(
    () => getSearchActions?.({ pathname }) || [],
    [pathname]
  );

  const posts = useMemo(() => {
    try {
      return getAllPosts?.() || [];
    } catch {
      return [];
    }
  }, []);

  const pool = useMemo(() => {
    const list = buildSuggestions({ pathname, actions, posts });
    return list.filter(Boolean);
  }, [pathname, actions, posts]);

  const clearTimers = () => {
    const t = timers.current;
    if (t.start) clearTimeout(t.start);
    if (t.autoClose) clearTimeout(t.autoClose);
    if (t.next) clearTimeout(t.next);
    timers.current = { start: null, autoClose: null, next: null };
  };

  const stopCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = null;
  };

  const startCountdown = () => {
    stopCountdown();
    const total = Math.ceil(SHOW_MS / 1000);
    setSecondsLeft(total);
    let left = total;

    countdownRef.current = setInterval(() => {
      left -= 1;
      setSecondsLeft(Math.max(left, 0));
      if (left <= 0) stopCountdown();
    }, 1000);
  };

  const pickNext = () => {
    if (!pool.length) return null;

    const available = pool.filter((x) => !usedRef.current.has(x.id));
    const list = available.length ? available : pool;

    if (!available.length) usedRef.current.clear();

    const item = list[Math.floor(Math.random() * list.length)];
    usedRef.current.add(item.id);
    return item;
  };

  const openWith = (item) => {
    setPos(pickPosition(mobile));
    setCurrent(item);
    setOpen(true);
    startCountdown();
    clearTimeout(timers.current.autoClose);
    timers.current.autoClose = setTimeout(() => closeNow("auto"), SHOW_MS);
  };

  const closeNow = () => {
    setOpen(false);
    setCurrent(null);
    stopCountdown();
    clearTimeout(timers.current.autoClose);

    clearTimeout(timers.current.next);
    timers.current.next = setTimeout(() => {
      const nextItem = pickNext();
      if (!nextItem) return;
      openWith(nextItem);
    }, NEXT_GAP_MS);
  };

  const startCycle = () => {
    clearTimers();
    stopCountdown();
    timers.current.start = setTimeout(() => {
      const item = pickNext();
      if (!item) return;
      openWith(item);
    }, START_DELAY_MS);
  };

  useEffect(() => {
    usedRef.current.clear();
    setOpen(false);
    setCurrent(null);
    stopCountdown();
    startCycle();
    return () => {
      clearTimers();
      stopCountdown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, mobile]);

  useEffect(() => {
    if (!open) return;

    const onDown = (e) => {
      const el = cardRef.current;
      if (!el) return;
      if (el.contains(e.target)) return;
      closeNow();
    };

    const onKey = (e) => {
      if (e.key === "Escape") closeNow();
    };

    document.addEventListener("pointerdown", onDown, true);
    window.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onCTAClick = () => {
    if (!current?.action) return;

    // close first (strict no overlap)
    setOpen(false);
    setCurrent(null);
    stopCountdown();
    clearTimeout(timers.current.autoClose);

    setTimeout(() => {
      runAction(current.action, { router, pathname });
    }, 120);

    clearTimeout(timers.current.next);
    timers.current.next = setTimeout(() => {
      const nextItem = pickNext();
      if (!nextItem) return;
      openWith(nextItem);
    }, NEXT_GAP_MS);
  };

  if (!current) return null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={[
            "fixed z-[999] w-[min(360px,92vw)] pointer-events-auto",
            pos?.cls || "top-16 right-4",
          ].join(" ")}
          initial={{ opacity: 0, y: 14, scale: 0.98, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 10, scale: 0.985, filter: "blur(10px)" }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <motion.div
            ref={cardRef}
            className={[
              "relative overflow-hidden rounded-3xl border",
              "border-white/10 bg-black/75 backdrop-blur-xl",
              "shadow-[0_24px_85px_rgba(0,0,0,0.70)]",
            ].join(" ")}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* glow aura */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-12 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.20),transparent_55%)] blur-3xl"
              animate={{ opacity: [0.25, 0.6, 0.25], scale: [1, 1.1, 1] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* top shimmer line */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)]"
              animate={{
                opacity: [0.25, 0.9, 0.25],
                x: ["-40%", "40%", "-40%"],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* ✅ BIG glowing sparkle */}
                  <span className="relative grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
                    <motion.span
                      aria-hidden
                      className="pointer-events-none absolute inset-[-14px] rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.35),transparent_60%)] blur-xl"
                      animate={{
                        opacity: [0.35, 0.85, 0.35],
                        scale: [0.96, 1.08, 0.96],
                      }}
                      transition={{
                        duration: 1.9,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.span
                      className="text-[22px] text-[#FFD54A] drop-shadow-[0_0_18px_rgba(255,215,0,0.55)]"
                      animate={{ rotate: [0, 8, 0], scale: [1, 1.08, 1] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      ✦
                    </motion.span>
                  </span>

                  <div className="leading-tight">
                    <p className="text-xs text-white/55">{current.title}</p>
                    <p className="text-sm font-semibold text-[#F6E7B2]">
                      Quick tip for you
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeNow}
                  className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/75">
                {current.desc}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onCTAClick}
                  className={[
                    "relative inline-flex items-center justify-center",
                    "rounded-2xl border px-4 py-2.5 text-sm font-semibold",
                    "border-[#FFD54A]/25 bg-[#FFD54A]/10 text-[#F6E7B2]",
                    "hover:bg-[#FFD54A]/16 transition overflow-hidden",
                  ].join(" ")}
                >
                  <span className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 hover:translate-x-[520px] transition duration-700" />
                  <span className="relative">{current.cta}</span>
                </button>

                {/* ✅ countdown */}
                <span className="text-[11px] text-white/45">
                  Auto close in {secondsLeft}s
                </span>
              </div>

              {/* progress bar (7s) */}
              <motion.div
                aria-hidden
                className="absolute bottom-0 left-0 h-[2px] w-full bg-[#FFD54A]/55"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: SHOW_MS / 1000, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

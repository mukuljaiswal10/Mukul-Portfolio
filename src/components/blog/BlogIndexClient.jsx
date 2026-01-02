"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BlogCard from "./BlogCard";
import BlogFeaturedCard from "./BlogFeaturedCard";

const SORTS = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "readtime", label: "Read time" },
];

function uniq(arr) {
  return Array.from(new Set(arr));
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export default function BlogIndexClient({ posts = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // URL params (shareable)
  const initialQ = sp.get("q") || "";
  const initialTag = sp.get("tag") || "All";
  const initialSort = sp.get("sort") || "newest";

  const [q, setQ] = useState(initialQ);
  const [tag, setTag] = useState(initialTag);
  const [sort, setSort] = useState(initialSort);

  // Load more
  const PAGE_SIZE = 6;
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Skeleton simulation (premium feel)
  const [loading, setLoading] = useState(false);
  const loadTimer = useRef(null);

  // Recent searches
  const [recent, setRecent] = useState([]);

  // Featured post
  const featured = useMemo(
    () => posts.find((p) => p.featured) || null,
    [posts]
  );

  // Tags
  const tags = useMemo(() => {
    const all = posts.flatMap((p) => p.tags || []);
    return ["All", ...uniq(all)];
  }, [posts]);

  // Update URL (without full reload)
  const syncUrl = (next = {}) => {
    const params = new URLSearchParams(sp.toString());

    if ("q" in next) {
      const v = String(next.q || "").trim();
      v ? params.set("q", v) : params.delete("q");
    }
    if ("tag" in next) {
      const v = String(next.tag || "");
      v && v !== "All" ? params.set("tag", v) : params.delete("tag");
    }
    if ("sort" in next) {
      const v = String(next.sort || "newest");
      v && v !== "newest" ? params.set("sort", v) : params.delete("sort");
    }

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : `${pathname}`, { scroll: false });
  };

  // Recent storage load
  useEffect(() => {
    const raw = localStorage.getItem("blog_recent_searches");
    const data = safeParse(raw, []);
    setRecent(Array.isArray(data) ? data.slice(0, 8) : []);
  }, []);

  const saveRecent = (text) => {
    const s = String(text || "").trim();
    if (!s) return;
    const next = [s, ...recent.filter((x) => x !== s)].slice(0, 8);
    setRecent(next);
    localStorage.setItem("blog_recent_searches", JSON.stringify(next));
  };

  // Filtering + Sorting
  const filteredSorted = useMemo(() => {
    let list = [...posts];

    if (tag && tag !== "All") {
      list = list.filter(
        (p) => (p.tags || []).includes(tag) || p.category === tag
      );
    }

    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter((p) => {
        const hay = `${p.title} ${p.excerpt} ${(p.tags || []).join(" ")} ${
          p.category
        }`.toLowerCase();
        return hay.includes(s);
      });
    }

    if (sort === "oldest")
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sort === "readtime")
      list.sort((a, b) => (a.readTime || 0) - (b.readTime || 0));
    else list.sort((a, b) => new Date(b.date) - new Date(a.date));

    return list;
  }, [posts, q, tag, sort]);

  // skeleton animation on filter change
  useEffect(() => {
    setVisible(PAGE_SIZE);
    setLoading(true);

    if (loadTimer.current) clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => setLoading(false), 280);

    return () => {
      if (loadTimer.current) clearTimeout(loadTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, tag, sort]);

  // sticky bar shadow based on scroll
  const [stickShadow, setStickShadow] = useState(false);
  useEffect(() => {
    const onScroll = () => setStickShadow((window.scrollY || 0) > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // UI handlers
  const onClear = () => {
    setQ("");
    syncUrl({ q: "" });
  };

  const onApplyRecent = (txt) => {
    setQ(txt);
    syncUrl({ q: txt });
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    saveRecent(q);
  };

  return (
    <div className="mt-10">
      {/* Sticky Filter/Search bar (mobile-first) */}
      <div
        className={[
          // ✅ change 1: make wrapper relative (for cover strip)
          "sticky top-16 z-20 relative -mx-3 px-3 pb-3",
          // ✅ scroll pe bg solid/dark ho jaaye
          stickShadow
            ? "bg-black/90 backdrop-blur-xl"
            : "bg-background/55 backdrop-blur-xl",
          stickShadow
            ? "border-b border-border/12 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            : "border-b border-transparent",
        ].join(" ")}
      >
        {/* ✅ change 2: cover strip to stop content showing when Navbar hides */}
        <div
          aria-hidden
          className={[
            "pointer-events-none absolute left-0 right-0 -top-16 h-16",
            stickShadow
              ? "bg-black/90 backdrop-blur-xl"
              : "bg-background/55 backdrop-blur-xl",
          ].join(" ")}
        />

        <div className="rounded-2xl border border-border/15 bg-foreground/[0.03] p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <form onSubmit={onSearchSubmit} className="w-full sm:flex-1">
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => {
                    const v = e.target.value;
                    setQ(v);
                    syncUrl({ q: v });
                  }}
                  placeholder="Search: MERN, WordPress, JWT, MongoDB…"
                  className="w-full rounded-xl border border-border/15 bg-black/30 px-4 py-3 pr-12 text-sm text-foreground outline-none placeholder:text-foreground/45 focus:border-[#E7C266]/35 focus:bg-black/40"
                />

                {/* Clear (X) */}
                {q?.trim() ? (
                  <button
                    type="button"
                    onClick={onClear}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-border/15 bg-foreground/[0.05] px-2.5 py-1.5 text-xs text-foreground/75 hover:bg-foreground/[0.08]"
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            </form>

            {/* Sort */}
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <p className="text-xs text-foreground/55 sm:hidden">Sort</p>
              <div className="flex gap-2">
                {SORTS.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => {
                      setSort(s.key);
                      syncUrl({ sort: s.key });
                    }}
                    className={[
                      "rounded-full border px-3 py-2 text-xs transition",
                      sort === s.key
                        ? "border-[#E7C266]/35 bg-[#E7C266]/[0.10] text-[#E7C266]"
                        : "border-border/15 bg-foreground/[0.03] text-foreground/70 hover:bg-foreground/[0.06]",
                    ].join(" ")}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tag pills (mobile horizontal scroll) */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none]">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTag(t);
                  syncUrl({ tag: t });
                }}
                className={[
                  "shrink-0 rounded-full border px-3 py-2 text-xs transition",
                  tag === t
                    ? "border-[#E7C266]/35 bg-[#E7C266]/[0.10] text-[#E7C266]"
                    : "border-border/15 bg-foreground/[0.03] text-foreground/70 hover:bg-foreground/[0.06]",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Recent searches */}
          {recent?.length ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-foreground/50">Recent:</span>
              {recent.slice(0, 6).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onApplyRecent(r)}
                  className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1.5 text-[11px] text-foreground/70 hover:bg-foreground/[0.06]"
                >
                  {r}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setRecent([]);
                  localStorage.removeItem("blog_recent_searches");
                }}
                className="rounded-full border border-border/15 bg-foreground/[0.02] px-3 py-1.5 text-[11px] text-foreground/50 hover:bg-foreground/[0.05]"
              >
                Clear
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Featured */}
      {featured ? (
        <div className="mt-8">
          <p className="mb-3 text-sm text-foreground/65">Featured</p>
          <BlogFeaturedCard post={featured} />
        </div>
      ) : null}

      {/* Grid */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-foreground/65">
            {filteredSorted.length} article
            {filteredSorted.length === 1 ? "" : "s"}
          </p>

          {q || (tag && tag !== "All") || (sort && sort !== "newest") ? (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setTag("All");
                setSort("newest");
                syncUrl({ q: "", tag: "All", sort: "newest" });
              }}
              className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1.5 text-xs text-foreground/70 hover:bg-foreground/[0.06]"
            >
              Reset
            </button>
          ) : null}
        </div>

        {/* Empty */}
        {!loading && filteredSorted.length === 0 ? (
          <div className="rounded-2xl border border-border/15 bg-foreground/[0.03] p-6">
            <p className="text-base font-semibold text-foreground">
              No results
            </p>
            <p className="mt-1 text-sm text-foreground/70">
              Try a different keyword or select another tag.
            </p>
          </div>
        ) : null}

        {/* Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[260px] rounded-2xl border border-border/12 bg-foreground/[0.02] p-4"
              >
                <div className="h-5 w-24 rounded bg-foreground/[0.08]" />
                <div className="mt-4 h-6 w-3/4 rounded bg-foreground/[0.08]" />
                <div className="mt-2 h-4 w-full rounded bg-foreground/[0.06]" />
                <div className="mt-2 h-4 w-5/6 rounded bg-foreground/[0.06]" />
                <div className="mt-6 flex gap-2">
                  <div className="h-7 w-16 rounded-full bg-foreground/[0.06]" />
                  <div className="h-7 w-20 rounded-full bg-foreground/[0.06]" />
                  <div className="h-7 w-14 rounded-full bg-foreground/[0.06]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSorted.slice(0, visible).map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>

            {/* Load more */}
            {visible < filteredSorted.length ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="rounded-full border border-[#E7C266]/30 bg-[#E7C266]/[0.08] px-6 py-3 text-sm text-[#E7C266] hover:bg-[#E7C266]/[0.12]"
                >
                  Load more
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

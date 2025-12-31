// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import BlogCard from "./BlogCard";
// import FeaturedPost from "./FeaturedPost";
// import { filterPosts, getAllCategories, getAllTags } from "@/lib/blog";

// function cn(...a) {
//   return a.filter(Boolean).join(" ");
// }

// export default function BlogIndexClient({ posts }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const sp = useSearchParams();

//   // URL -> state (shareable links)
//   const [q, setQ] = useState(sp.get("q") || "");
//   const [cat, setCat] = useState(sp.get("cat") || "All");
//   const [tag, setTag] = useState(sp.get("tag") || "All");
//   const [sort, setSort] = useState(sp.get("sort") || "newest");
//   const [page, setPage] = useState(Number(sp.get("page") || 1));

//   const categories = useMemo(
//     () => ["All", ...getAllCategories(posts)],
//     [posts]
//   );
//   const tags = useMemo(() => ["All", ...getAllTags(posts)], [posts]);

//   // Filtered
//   const filtered = useMemo(() => {
//     return filterPosts(posts, { q, cat, tag, sort });
//   }, [posts, q, cat, tag, sort]);

//   // Featured (always from original list)
//   const featured = useMemo(() => posts.find((p) => p.featured), [posts]);

//   // Pagination
//   const perPage = 6;
//   const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
//   const safePage = Math.min(Math.max(page, 1), totalPages);
//   const slice = filtered.slice((safePage - 1) * perPage, safePage * perPage);

//   // Sync URL when state changes
//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (q.trim()) params.set("q", q.trim());
//     if (cat !== "All") params.set("cat", cat);
//     if (tag !== "All") params.set("tag", tag);
//     if (sort !== "newest") params.set("sort", sort);
//     if (safePage !== 1) params.set("page", String(safePage));
//     const qs = params.toString();
//     router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [q, cat, tag, sort, safePage]);

//   // Reset page on filter changes
//   useEffect(() => setPage(1), [q, cat, tag, sort]);

//   const showClear = q.trim().length > 0;

//   return (
//     <div className="mt-8">
//       {/* SEARCH + FILTER BAR (mobile-first) */}
//       <div className="rounded-3xl border border-border/15 bg-background/30 p-4 backdrop-blur-xl sm:p-5">
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//           {/* Search */}
//           <div className="relative flex-1">
//             <input
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//               placeholder="Search: MERN, WordPress, JWT, MongoDB…"
//               className={cn(
//                 "w-full rounded-2xl border border-border/20 bg-foreground/[0.03]",
//                 "px-4 py-3 pr-11 text-sm text-foreground outline-none",
//                 "placeholder:text-foreground/45 focus:bg-foreground/[0.05]"
//               )}
//             />
//             {/* Clear X */}
//             {showClear ? (
//               <button
//                 onClick={() => setQ("")}
//                 aria-label="Clear search"
//                 className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border/20 bg-foreground/[0.04] px-2.5 py-1.5 text-xs text-foreground/70 hover:bg-foreground/[0.07]"
//               >
//                 ✕
//               </button>
//             ) : null}
//           </div>

//           {/* Sort */}
//           <div className="flex items-center gap-2">
//             <span className="text-xs text-foreground/55">Sort</span>
//             <select
//               value={sort}
//               onChange={(e) => setSort(e.target.value)}
//               className="rounded-2xl border border-border/20 bg-foreground/[0.03] px-3 py-2 text-sm text-foreground/80 outline-none"
//             >
//               <option value="newest">Newest</option>
//               <option value="oldest">Oldest</option>
//               <option value="read">Read time</option>
//             </select>
//           </div>
//         </div>

//         {/* Category chips */}
//         <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none]">
//           {categories.map((c) => {
//             const active = c === cat;
//             return (
//               <button
//                 key={c}
//                 onClick={() => setCat(c)}
//                 className={cn(
//                   "shrink-0 rounded-full border px-4 py-2 text-xs transition",
//                   active
//                     ? "border-[#E7C266]/40 bg-[#E7C266]/10 text-[#F2D487]"
//                     : "border-border/18 bg-foreground/[0.03] text-foreground/70 hover:bg-foreground/[0.06]"
//                 )}
//               >
//                 {c}
//               </button>
//             );
//           })}
//         </div>

//         {/* Tag chips */}
//         <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none]">
//           {tags.map((t) => {
//             const active = t === tag;
//             return (
//               <button
//                 key={t}
//                 onClick={() => setTag(t)}
//                 className={cn(
//                   "shrink-0 rounded-full border px-4 py-2 text-xs transition",
//                   active
//                     ? "border-[#E7C266]/35 bg-[#E7C266]/10 text-[#F2D487]"
//                     : "border-border/18 bg-foreground/[0.03] text-foreground/70 hover:bg-foreground/[0.06]"
//                 )}
//               >
//                 {t}
//               </button>
//             );
//           })}
//         </div>

//         <div className="mt-3 flex items-center justify-between gap-2 text-xs text-foreground/55">
//           <span>
//             Showing <b className="text-foreground/80">{filtered.length}</b>{" "}
//             results
//           </span>
//           <button
//             onClick={() => {
//               setQ("");
//               setCat("All");
//               setTag("All");
//               setSort("newest");
//               setPage(1);
//             }}
//             className="rounded-full border border-border/18 bg-foreground/[0.03] px-3 py-1.5 hover:bg-foreground/[0.06]"
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       {/* Featured */}
//       <div className="mt-6">
//         <p className="mb-3 text-xs uppercase tracking-widest text-foreground/55">
//           Featured
//         </p>
//         <FeaturedPost post={featured} />
//       </div>

//       {/* Grid */}
//       <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {slice.map((p) => (
//           <BlogCard key={p.slug} post={p} />
//         ))}
//       </div>

//       {/* Empty */}
//       {!slice.length ? (
//         <div className="mt-8 rounded-3xl border border-border/15 bg-background/30 p-6 text-sm text-foreground/70 backdrop-blur-xl">
//           No posts found. Try different keywords or reset filters.
//         </div>
//       ) : null}

//       {/* Pagination */}
//       {totalPages > 1 ? (
//         <div className="mt-8 flex items-center justify-center gap-2">
//           <button
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             className="rounded-full border border-border/18 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/75 hover:bg-foreground/[0.06]"
//           >
//             Prev
//           </button>

//           <span className="px-3 text-sm text-foreground/60">
//             Page <b className="text-foreground/80">{safePage}</b> / {totalPages}
//           </span>

//           <button
//             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//             className="rounded-full border border-border/18 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/75 hover:bg-foreground/[0.06]"
//           >
//             Next
//           </button>
//         </div>
//       ) : null}

//       {/* Newsletter CTA (premium block) */}
//       <div className="mt-10 rounded-[32px] border border-border/15 bg-background/30 p-6 backdrop-blur-xl sm:p-8">
//         <div className="pointer-events-none absolute inset-0 opacity-0" />
//         <h3 className="text-xl font-semibold text-foreground">
//           Want more production-ready guides?
//         </h3>
//         <p className="mt-2 max-w-2xl text-sm text-foreground/70">
//           Quick checklists, real project patterns, and scalable workflows for
//           MERN + WordPress.
//         </p>

//         <div className="mt-4 flex flex-col gap-3 sm:flex-row">
//           <input
//             placeholder="Your email"
//             className="w-full flex-1 rounded-2xl border border-border/20 bg-foreground/[0.03] px-4 py-3 text-sm text-foreground outline-none placeholder:text-foreground/45"
//           />
//           <button className="rounded-2xl border border-[#E7C266]/35 bg-[#E7C266]/10 px-5 py-3 text-sm font-semibold text-[#F2D487] hover:bg-[#E7C266]/15">
//             Subscribe
//           </button>
//         </div>

//         <p className="mt-2 text-xs text-foreground/50">
//           No spam. Premium dev content only.
//         </p>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import Link from "next/link";

// function clsx(...a) {
//   return a.filter(Boolean).join(" ");
// }

// function uniq(arr) {
//   return Array.from(new Set(arr.filter(Boolean)));
// }

// function toKebab(s = "") {
//   return s.toLowerCase().trim().replace(/\s+/g, "-");
// }

// export default function BlogIndexClient({ posts = [] }) {
//   // ✅ client-only UI state
//   const [q, setQ] = useState("");
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [activeTag, setActiveTag] = useState("All");
//   const [sort, setSort] = useState("newest");
//   const [limit, setLimit] = useState(9);

//   // ✅ recent searches (localStorage)
//   const [recent, setRecent] = useState([]);
//   const mounted = useRef(false);

//   useEffect(() => {
//     mounted.current = true;
//     try {
//       const saved = JSON.parse(localStorage.getItem("blog_recent") || "[]");
//       if (Array.isArray(saved)) setRecent(saved.slice(0, 7));
//     } catch {}
//     return () => {
//       mounted.current = false;
//     };
//   }, []);

//   const categories = useMemo(() => {
//     const list = posts.map((p) => p.category || "General");
//     return ["All", ...uniq(list)];
//   }, [posts]);

//   const allTags = useMemo(() => {
//     const t = posts.flatMap((p) => p.tags || []);
//     return ["All", ...uniq(t)];
//   }, [posts]);

//   const featured = useMemo(() => {
//     // ✅ pick first featured, else newest
//     const f = posts.find((p) => p.featured);
//     if (f) return f;
//     return [...posts].sort(
//       (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
//     )[0];
//   }, [posts]);

//   const filtered = useMemo(() => {
//     const s = q.trim().toLowerCase();

//     let list = [...posts];

//     if (activeCategory !== "All") {
//       list = list.filter((p) => (p.category || "General") === activeCategory);
//     }

//     if (activeTag !== "All") {
//       list = list.filter((p) => (p.tags || []).includes(activeTag));
//     }

//     if (s) {
//       list = list.filter((p) => {
//         const hay = `${p.title} ${p.excerpt} ${(p.tags || []).join(" ")} ${
//           p.category || ""
//         }`.toLowerCase();
//         return hay.includes(s);
//       });
//     }

//     if (sort === "newest") {
//       list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
//     } else if (sort === "oldest") {
//       list.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
//     } else if (sort === "readtime") {
//       list.sort((a, b) => (b.readTime || 0) - (a.readTime || 0));
//     }

//     return list;
//   }, [posts, q, activeCategory, activeTag, sort]);

//   const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit]);

//   const saveRecent = (value) => {
//     const v = value.trim();
//     if (!v) return;
//     const next = [v, ...recent.filter((x) => x !== v)].slice(0, 7);
//     setRecent(next);
//     try {
//       localStorage.setItem("blog_recent", JSON.stringify(next));
//     } catch {}
//   };

//   const onSubmitSearch = (e) => {
//     e.preventDefault();
//     saveRecent(q);
//   };

//   const clearSearch = () => {
//     setQ("");
//   };

//   return (
//     <div className="mt-10">
//       {/* ✅ premium filter/search bar */}
//       <div
//         className={clsx(
//           "rounded-2xl border border-border/15",
//           "bg-foreground/[0.03] backdrop-blur-xl",
//           "p-4 sm:p-5"
//         )}
//       >
//         <form onSubmit={onSubmitSearch} className="flex flex-col gap-3">
//           <div className="relative">
//             <input
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//               placeholder="Search: MERN, WordPress, JWT, MongoDB…"
//               className={clsx(
//                 "w-full rounded-2xl border border-border/15",
//                 "bg-black/20 px-4 py-3 pr-11 text-sm",
//                 "text-foreground outline-none",
//                 "placeholder:text-foreground/45",
//                 "focus:border-[#E7C266]/35 focus:bg-black/30"
//               )}
//             />

//             {/* ✅ clear (X) button only when typed */}
//             {q?.length ? (
//               <button
//                 type="button"
//                 onClick={clearSearch}
//                 aria-label="Clear search"
//                 className={clsx(
//                   "absolute right-2 top-1/2 -translate-y-1/2",
//                   "rounded-xl border border-border/15 bg-foreground/[0.04]",
//                   "px-3 py-2 text-xs text-foreground/75 hover:bg-foreground/[0.08]"
//                 )}
//               >
//                 ✕
//               </button>
//             ) : null}
//           </div>

//           {/* quick chips */}
//           <div className="flex flex-wrap gap-2">
//             {["All", "MERN", "Next.js", "WordPress", "AI"].map((chip) => (
//               <button
//                 key={chip}
//                 type="button"
//                 onClick={() => {
//                   if (chip === "All") {
//                     setActiveCategory("All");
//                     setActiveTag("All");
//                   } else {
//                     setActiveCategory(chip === "Next.js" ? "Next.js" : "All");
//                     setActiveTag(chip);
//                   }
//                   setLimit(9);
//                 }}
//                 className={clsx(
//                   "rounded-full border px-3 py-1 text-xs transition",
//                   "border-border/15 bg-foreground/[0.03] text-foreground/70",
//                   "hover:bg-foreground/[0.06]"
//                 )}
//               >
//                 {chip}
//               </button>
//             ))}
//           </div>

//           {/* category + tag + sort */}
//           <div className="grid gap-3 sm:grid-cols-3">
//             <div className="flex flex-col gap-1">
//               <span className="text-[11px] text-foreground/55">Category</span>
//               <select
//                 value={activeCategory}
//                 onChange={(e) => {
//                   setActiveCategory(e.target.value);
//                   setLimit(9);
//                 }}
//                 className="rounded-xl border border-border/15 bg-black/20 px-3 py-2 text-sm text-foreground/85 outline-none"
//               >
//                 {categories.map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex flex-col gap-1">
//               <span className="text-[11px] text-foreground/55">Tag</span>
//               <select
//                 value={activeTag}
//                 onChange={(e) => {
//                   setActiveTag(e.target.value);
//                   setLimit(9);
//                 }}
//                 className="rounded-xl border border-border/15 bg-black/20 px-3 py-2 text-sm text-foreground/85 outline-none"
//               >
//                 {allTags.map((t) => (
//                   <option key={t} value={t}>
//                     {t}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex flex-col gap-1">
//               <span className="text-[11px] text-foreground/55">Sort</span>
//               <select
//                 value={sort}
//                 onChange={(e) => setSort(e.target.value)}
//                 className="rounded-xl border border-border/15 bg-black/20 px-3 py-2 text-sm text-foreground/85 outline-none"
//               >
//                 <option value="newest">Newest</option>
//                 <option value="oldest">Oldest</option>
//                 <option value="readtime">Longest read</option>
//               </select>
//             </div>
//           </div>

//           {/* ✅ recent searches */}
//           {recent?.length ? (
//             <div className="mt-1">
//               <p className="text-[11px] text-foreground/55">Recent searches</p>
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {recent.map((r) => (
//                   <button
//                     key={r}
//                     type="button"
//                     onClick={() => setQ(r)}
//                     className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1 text-xs text-foreground/70 hover:bg-foreground/[0.06]"
//                   >
//                     {r}
//                   </button>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setRecent([]);
//                     try {
//                       localStorage.removeItem("blog_recent");
//                     } catch {}
//                   }}
//                   className="rounded-full border border-border/15 bg-foreground/[0.02] px-3 py-1 text-xs text-foreground/55 hover:bg-foreground/[0.05]"
//                 >
//                   Clear
//                 </button>
//               </div>
//             </div>
//           ) : null}
//         </form>
//       </div>

//       {/* ✅ Featured */}
//       {featured ? (
//         <div className="mt-8">
//           <p className="text-xs text-foreground/60">Featured</p>

//           <Link
//             href={`/blog/${featured.slug}`}
//             className={clsx(
//               "group mt-3 block rounded-2xl border border-[#E7C266]/25",
//               "bg-gradient-to-br from-[#E7C266]/10 via-foreground/[0.03] to-transparent",
//               "p-5 sm:p-6",
//               "shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
//             )}
//           >
//             <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/65">
//               <span className="rounded-full border border-border/20 bg-black/20 px-3 py-1">
//                 {featured.category || "General"}
//               </span>
//               <span>{featured.date || ""}</span>
//               <span>•</span>
//               <span>{featured.readTime || 7} min read</span>
//             </div>

//             <h2 className="mt-3 text-2xl font-semibold text-foreground group-hover:text-[#E7C266] transition">
//               {featured.title}
//             </h2>
//             <p className="mt-2 max-w-3xl text-sm text-foreground/70">
//               {featured.excerpt}
//             </p>

//             <span className="mt-4 inline-flex items-center gap-2 text-sm text-[#E7C266]">
//               Read featured{" "}
//               <span className="transition group-hover:translate-x-1">→</span>
//             </span>
//           </Link>
//         </div>
//       ) : null}

//       {/* ✅ Grid */}
//       <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//         {visible.map((p) => (
//           <Link
//             key={p.slug}
//             href={`/blog/${p.slug}`}
//             className={clsx(
//               "group rounded-2xl border border-border/15",
//               "bg-foreground/[0.03] backdrop-blur-xl",
//               "p-5 transition",
//               "hover:border-[#E7C266]/25 hover:bg-foreground/[0.05]"
//             )}
//           >
//             <div className="flex items-center justify-between gap-2">
//               <span className="rounded-full border border-border/20 bg-black/20 px-3 py-1 text-xs text-foreground/70">
//                 {p.category || "General"}
//               </span>
//               <span className="text-xs text-foreground/55">
//                 {p.date || ""} • {p.readTime || 6} min
//               </span>
//             </div>

//             <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-[#E7C266] transition">
//               {p.title}
//             </h3>
//             <p className="mt-2 text-sm text-foreground/70">{p.excerpt}</p>

//             {/* tags */}
//             {p.tags?.length ? (
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {p.tags.slice(0, 3).map((t) => (
//                   <span
//                     key={t}
//                     className="rounded-full border border-border/15 bg-black/15 px-3 py-1 text-[11px] text-foreground/65"
//                   >
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             ) : null}

//             <div className="mt-5 text-sm text-[#E7C266]">
//               Read article{" "}
//               <span className="inline-block transition group-hover:translate-x-1">
//                 →
//               </span>
//             </div>
//           </Link>
//         ))}
//       </div>

//       {/* ✅ empty state */}
//       {!filtered.length ? (
//         <div className="mt-8 rounded-2xl border border-border/15 bg-foreground/[0.03] p-5 text-sm text-foreground/70">
//           No results. Try: <b>MERN</b>, <b>WordPress</b>, <b>Next.js</b>
//         </div>
//       ) : null}

//       {/* ✅ Load more */}
//       {filtered.length > visible.length ? (
//         <div className="mt-8 flex justify-center">
//           <button
//             onClick={() => setLimit((x) => x + 6)}
//             className="rounded-2xl border border-[#E7C266]/25 bg-[#E7C266]/10 px-5 py-3 text-sm text-[#E7C266] hover:bg-[#E7C266]/15 transition"
//           >
//             Load more
//           </button>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import Link from "next/link";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import BlogCard from "./BlogCard";
// import BlogFeaturedCard from "./BlogFeaturedCard";

// const SORTS = [
//   { key: "newest", label: "Newest" },
//   { key: "oldest", label: "Oldest" },
//   { key: "readtime", label: "Read time" },
// ];

// function uniq(arr) {
//   return Array.from(new Set(arr));
// }

// function safeParse(json, fallback) {
//   try {
//     return JSON.parse(json);
//   } catch {
//     return fallback;
//   }
// }

// export default function BlogIndexClient({ posts = [] }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const sp = useSearchParams();

//   // URL params (shareable)
//   const initialQ = sp.get("q") || "";
//   const initialTag = sp.get("tag") || "All";
//   const initialSort = sp.get("sort") || "newest";

//   const [q, setQ] = useState(initialQ);
//   const [tag, setTag] = useState(initialTag);
//   const [sort, setSort] = useState(initialSort);

//   // Load more
//   const PAGE_SIZE = 6;
//   const [visible, setVisible] = useState(PAGE_SIZE);

//   // Skeleton simulation (premium feel)
//   const [loading, setLoading] = useState(false);
//   const loadTimer = useRef(null);

//   // Recent searches
//   const [recent, setRecent] = useState([]);

//   // Featured post
//   const featured = useMemo(
//     () => posts.find((p) => p.featured) || null,
//     [posts]
//   );

//   // Tags
//   const tags = useMemo(() => {
//     const all = posts.flatMap((p) => p.tags || []);
//     return ["All", ...uniq(all)];
//   }, [posts]);

//   // Update URL (without full reload)
//   const syncUrl = (next = {}) => {
//     const params = new URLSearchParams(sp.toString());

//     if ("q" in next) {
//       const v = String(next.q || "").trim();
//       v ? params.set("q", v) : params.delete("q");
//     }
//     if ("tag" in next) {
//       const v = String(next.tag || "");
//       v && v !== "All" ? params.set("tag", v) : params.delete("tag");
//     }
//     if ("sort" in next) {
//       const v = String(next.sort || "newest");
//       v && v !== "newest" ? params.set("sort", v) : params.delete("sort");
//     }

//     router.replace(`${pathname}?${params.toString()}`, { scroll: false });
//   };

//   // Recent storage load
//   useEffect(() => {
//     const raw = localStorage.getItem("blog_recent_searches");
//     const data = safeParse(raw, []);
//     setRecent(Array.isArray(data) ? data.slice(0, 8) : []);
//   }, []);

//   const saveRecent = (text) => {
//     const s = String(text || "").trim();
//     if (!s) return;
//     const next = [s, ...recent.filter((x) => x !== s)].slice(0, 8);
//     setRecent(next);
//     localStorage.setItem("blog_recent_searches", JSON.stringify(next));
//   };

//   // Filtering + Sorting
//   const filteredSorted = useMemo(() => {
//     let list = [...posts];

//     if (tag && tag !== "All") {
//       list = list.filter(
//         (p) => (p.tags || []).includes(tag) || p.category === tag
//       );
//     }

//     const s = q.trim().toLowerCase();
//     if (s) {
//       list = list.filter((p) => {
//         const hay = `${p.title} ${p.excerpt} ${(p.tags || []).join(" ")} ${
//           p.category
//         }`.toLowerCase();
//         return hay.includes(s);
//       });
//     }

//     if (sort === "oldest")
//       list.sort((a, b) => new Date(a.date) - new Date(b.date));
//     else if (sort === "readtime")
//       list.sort((a, b) => (a.readTime || 0) - (b.readTime || 0));
//     else list.sort((a, b) => new Date(b.date) - new Date(a.date));

//     return list;
//   }, [posts, q, tag, sort]);

//   // skeleton animation on filter change
//   useEffect(() => {
//     setVisible(PAGE_SIZE);
//     setLoading(true);

//     if (loadTimer.current) clearTimeout(loadTimer.current);
//     loadTimer.current = setTimeout(() => setLoading(false), 280);

//     return () => {
//       if (loadTimer.current) clearTimeout(loadTimer.current);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [q, tag, sort]);

//   // sticky bar shadow based on scroll
//   const [stickShadow, setStickShadow] = useState(false);
//   useEffect(() => {
//     const onScroll = () => setStickShadow((window.scrollY || 0) > 10);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     onScroll();
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   // UI handlers
//   const onClear = () => {
//     setQ("");
//     syncUrl({ q: "" });
//   };

//   const onApplyRecent = (txt) => {
//     setQ(txt);
//     syncUrl({ q: txt });
//   };

//   const onSearchSubmit = (e) => {
//     e.preventDefault();
//     saveRecent(q);
//   };

//   return (
//     <div className="mt-10">
//       {/* Sticky Filter/Search bar (mobile-first) */}
//       <div
//         className={[
//           "sticky top-16 z-20 -mx-3 px-3 pb-3",
//           // ✅ scroll pe bg solid/dark ho jaaye
//           stickShadow
//             ? "bg-black/90 backdrop-blur-xl"
//             : "bg-background/55 backdrop-blur-xl",
//           stickShadow
//             ? "border-b border-border/12 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
//             : "border-b border-transparent",
//         ].join(" ")}
//       >
//         <div className="rounded-2xl border border-border/15 bg-foreground/[0.03] p-3 sm:p-4">
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             {/* Search */}
//             <form onSubmit={onSearchSubmit} className="w-full sm:flex-1">
//               <div className="relative">
//                 <input
//                   value={q}
//                   onChange={(e) => {
//                     const v = e.target.value;
//                     setQ(v);
//                     syncUrl({ q: v });
//                   }}
//                   placeholder="Search: MERN, WordPress, JWT, MongoDB…"
//                   className="w-full rounded-xl border border-border/15 bg-black/30 px-4 py-3 pr-12 text-sm text-foreground outline-none placeholder:text-foreground/45 focus:border-[#E7C266]/35 focus:bg-black/40"
//                 />

//                 {/* Clear (X) */}
//                 {q?.trim() ? (
//                   <button
//                     type="button"
//                     onClick={onClear}
//                     aria-label="Clear search"
//                     className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-border/15 bg-foreground/[0.05] px-2.5 py-1.5 text-xs text-foreground/75 hover:bg-foreground/[0.08]"
//                   >
//                     ✕
//                   </button>
//                 ) : null}
//               </div>
//             </form>

//             {/* Sort */}
//             <div className="flex items-center justify-between gap-2 sm:justify-end">
//               <p className="text-xs text-foreground/55 sm:hidden">Sort</p>
//               <div className="flex gap-2">
//                 {SORTS.map((s) => (
//                   <button
//                     key={s.key}
//                     type="button"
//                     onClick={() => {
//                       setSort(s.key);
//                       syncUrl({ sort: s.key });
//                     }}
//                     className={[
//                       "rounded-full border px-3 py-2 text-xs transition",
//                       sort === s.key
//                         ? "border-[#E7C266]/35 bg-[#E7C266]/[0.10] text-[#E7C266]"
//                         : "border-border/15 bg-foreground/[0.03] text-foreground/70 hover:bg-foreground/[0.06]",
//                     ].join(" ")}
//                   >
//                     {s.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Tag pills (mobile horizontal scroll) */}
//           <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none]">
//             {tags.map((t) => (
//               <button
//                 key={t}
//                 type="button"
//                 onClick={() => {
//                   setTag(t);
//                   syncUrl({ tag: t });
//                 }}
//                 className={[
//                   "shrink-0 rounded-full border px-3 py-2 text-xs transition",
//                   tag === t
//                     ? "border-[#E7C266]/35 bg-[#E7C266]/[0.10] text-[#E7C266]"
//                     : "border-border/15 bg-foreground/[0.03] text-foreground/70 hover:bg-foreground/[0.06]",
//                 ].join(" ")}
//               >
//                 {t}
//               </button>
//             ))}
//           </div>

//           {/* Recent searches */}
//           {recent?.length ? (
//             <div className="mt-3 flex flex-wrap items-center gap-2">
//               <span className="text-[11px] text-foreground/50">Recent:</span>
//               {recent.slice(0, 6).map((r) => (
//                 <button
//                   key={r}
//                   type="button"
//                   onClick={() => onApplyRecent(r)}
//                   className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1.5 text-[11px] text-foreground/70 hover:bg-foreground/[0.06]"
//                 >
//                   {r}
//                 </button>
//               ))}
//               <button
//                 type="button"
//                 onClick={() => {
//                   setRecent([]);
//                   localStorage.removeItem("blog_recent_searches");
//                 }}
//                 className="rounded-full border border-border/15 bg-foreground/[0.02] px-3 py-1.5 text-[11px] text-foreground/50 hover:bg-foreground/[0.05]"
//               >
//                 Clear
//               </button>
//             </div>
//           ) : null}
//         </div>
//       </div>

//       {/* Featured */}
//       {featured ? (
//         <div className="mt-8">
//           <p className="mb-3 text-sm text-foreground/65">Featured</p>
//           <BlogFeaturedCard post={featured} />
//         </div>
//       ) : null}

//       {/* Grid */}
//       <div className="mt-8">
//         <div className="mb-3 flex items-center justify-between">
//           <p className="text-sm text-foreground/65">
//             {filteredSorted.length} article
//             {filteredSorted.length === 1 ? "" : "s"}
//           </p>

//           {q || (tag && tag !== "All") || (sort && sort !== "newest") ? (
//             <button
//               type="button"
//               onClick={() => {
//                 setQ("");
//                 setTag("All");
//                 setSort("newest");
//                 syncUrl({ q: "", tag: "All", sort: "newest" });
//               }}
//               className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1.5 text-xs text-foreground/70 hover:bg-foreground/[0.06]"
//             >
//               Reset
//             </button>
//           ) : null}
//         </div>

//         {/* Empty */}
//         {!loading && filteredSorted.length === 0 ? (
//           <div className="rounded-2xl border border-border/15 bg-foreground/[0.03] p-6">
//             <p className="text-base font-semibold text-foreground">
//               No results
//             </p>
//             <p className="mt-1 text-sm text-foreground/70">
//               Try a different keyword or select another tag.
//             </p>
//           </div>
//         ) : null}

//         {/* Skeleton */}
//         {loading ? (
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="h-[260px] rounded-2xl border border-border/12 bg-foreground/[0.02] p-4"
//               >
//                 <div className="h-5 w-24 rounded bg-foreground/[0.08]" />
//                 <div className="mt-4 h-6 w-3/4 rounded bg-foreground/[0.08]" />
//                 <div className="mt-2 h-4 w-full rounded bg-foreground/[0.06]" />
//                 <div className="mt-2 h-4 w-5/6 rounded bg-foreground/[0.06]" />
//                 <div className="mt-6 flex gap-2">
//                   <div className="h-7 w-16 rounded-full bg-foreground/[0.06]" />
//                   <div className="h-7 w-20 rounded-full bg-foreground/[0.06]" />
//                   <div className="h-7 w-14 rounded-full bg-foreground/[0.06]" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {filteredSorted.slice(0, visible).map((p) => (
//                 <BlogCard key={p.slug} post={p} />
//               ))}
//             </div>

//             {/* Load more */}
//             {visible < filteredSorted.length ? (
//               <div className="mt-8 flex justify-center">
//                 <button
//                   type="button"
//                   onClick={() => setVisible((v) => v + PAGE_SIZE)}
//                   className="rounded-full border border-[#E7C266]/30 bg-[#E7C266]/[0.08] px-6 py-3 text-sm text-[#E7C266] hover:bg-[#E7C266]/[0.12]"
//                 >
//                   Load more
//                 </button>
//               </div>
//             ) : null}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

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

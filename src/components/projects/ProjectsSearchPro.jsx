// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// // your existing chip button component (same UI)
// function FilterChip({ active, onClick, children, disabled }) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={[
//         "relative shrink-0 rounded-full px-4 py-2 text-sm transition",
//         "border border-border/15 backdrop-blur",
//         disabled ? "opacity-50 cursor-not-allowed" : "",
//         active ? "text-foreground" : "text-foreground/75 hover:text-foreground",
//       ].join(" ")}
//       type="button"
//     >
//       <span
//         className={[
//           "absolute inset-0 rounded-full",
//           active ? "bg-foreground/[0.09]" : "bg-foreground/[0.03]",
//         ].join(" ")}
//       />
//       {active ? (
//         <span className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[6px]" />
//       ) : null}

//       <span className="relative inline-flex items-center gap-2">
//         <span
//           className={
//             active
//               ? "h-1.5 w-1.5 rounded-full bg-foreground/80"
//               : "h-1.5 w-1.5 rounded-full bg-foreground/45"
//           }
//         />
//         {children}
//       </span>

//       {active ? (
//         <motion.span
//           layoutId="chip-underline"
//           className="pointer-events-none absolute left-4 right-4 -bottom-[6px] h-[2px] rounded-full bg-foreground/80"
//           transition={{ type: "spring", stiffness: 420, damping: 34 }}
//         />
//       ) : null}
//     </button>
//   );
// }

// export default function ProjectsSearchPro({
//   enableFilters = true,
//   enableSearch = true,
//   syncToUrl = true,
//   onResults, // (results) => void
// }) {
//   const [query, setQuery] = useState("");
//   const [activeTags, setActiveTags] = useState([]); // empty => All
//   const [facets, setFacets] = useState({ tags: ["All"] });
//   const [resultsCount, setResultsCount] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [suggestOpen, setSuggestOpen] = useState(false);
//   const [suggestIndex, setSuggestIndex] = useState(0);

//   const inputRef = useRef(null);

//   const searchActive = enableSearch && query.trim().length > 0;

//   // ✅ drag-scroll chips (works with click)
//   const chipDragRef = useRef({
//     active: false,
//     pointerId: null,
//     startX: 0,
//     startScroll: 0,
//     moved: false,
//   });
//   const ignoreClickRef = useRef(false);

//   function onChipPointerDown(e) {
//     const el = e.currentTarget;
//     if (e.pointerType === "mouse" && e.button !== 0) return;

//     chipDragRef.current = {
//       active: true,
//       pointerId: e.pointerId,
//       startX: e.clientX,
//       startScroll: el.scrollLeft,
//       moved: false,
//     };

//     try {
//       el.setPointerCapture(e.pointerId);
//     } catch {}
//   }

//   function onChipPointerMove(e) {
//     const s = chipDragRef.current;
//     if (!s.active || s.pointerId !== e.pointerId) return;

//     const el = e.currentTarget;
//     const dx = e.clientX - s.startX;

//     if (!s.moved && Math.abs(dx) > 6) {
//       s.moved = true;
//       ignoreClickRef.current = true;
//     }
//     if (s.moved) el.scrollLeft = s.startScroll - dx;
//   }

//   function onChipPointerUp(e) {
//     const s = chipDragRef.current;
//     if (!s.active || s.pointerId !== e.pointerId) return;

//     chipDragRef.current = {
//       active: false,
//       pointerId: null,
//       startX: 0,
//       startScroll: 0,
//       moved: false,
//     };
//     setTimeout(() => {
//       ignoreClickRef.current = false;
//     }, 0);
//   }

//   function onChipWheel(e) {
//     if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
//       e.currentTarget.scrollLeft += e.deltaY;
//     }
//   }

//   function toggleTag(t) {
//     if (ignoreClickRef.current) return;

//     if (t === "All") {
//       setActiveTags([]);
//       return;
//     }

//     setActiveTags((prev) => {
//       const has = prev.includes(t);
//       if (has) return prev.filter((x) => x !== t);
//       return [...prev, t];
//     });
//   }

//   // ✅ requirement: typing in search => chips reset to All
//   useEffect(() => {
//     if (!enableSearch) return;
//     if (query.trim()) setActiveTags([]);
//   }, [query, enableSearch]);

//   // ✅ fetch from backend (debounced)
//   useEffect(() => {
//     if (!enableSearch && !enableFilters) return;

//     let alive = true;
//     const t = setTimeout(async () => {
//       setLoading(true);
//       try {
//         const q = query.trim();
//         const tags = activeTags.length ? activeTags.join(",") : "";
//         const url = `/api/projects/search?q=${encodeURIComponent(
//           q
//         )}&tags=${encodeURIComponent(tags)}&limit=50`;

//         const res = await fetch(url, { cache: "no-store" });
//         const json = await res.json();

//         if (!alive) return;

//         if (json?.ok) {
//           setFacets(json.facets || { tags: ["All"] });
//           setResultsCount(
//             Array.isArray(json.results) ? json.results.length : 0
//           );
//           onResults?.(json.results || []);
//         } else {
//           setResultsCount(0);
//           onResults?.([]);
//         }
//       } catch {
//         if (!alive) return;
//         setResultsCount(0);
//         onResults?.([]);
//       } finally {
//         if (alive) setLoading(false);
//       }
//     }, 180); // debounce

//     return () => {
//       alive = false;
//       clearTimeout(t);
//     };
//   }, [query, activeTags, enableSearch, enableFilters, onResults]);

//   // ✅ suggestions from facets + current query (simple, pro feel)
//   const suggestions = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     const tags = (facets.tags || []).filter((t) => t && t !== "All");
//     if (!q) return tags.slice(0, 8);
//     return tags.filter((t) => t.toLowerCase().includes(q)).slice(0, 8);
//   }, [query, facets]);

//   function onKeyDown(e) {
//     if (!suggestions.length) return;

//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setSuggestOpen(true);
//       setSuggestIndex((i) => Math.min(i + 1, suggestions.length - 1));
//     }
//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setSuggestOpen(true);
//       setSuggestIndex((i) => Math.max(i - 1, 0));
//     }
//     if (e.key === "Enter" && suggestOpen) {
//       e.preventDefault();
//       const pick = suggestions[suggestIndex];
//       if (pick) setQuery(pick); // selecting suggestion fills query
//       setSuggestOpen(false);
//     }
//     if (e.key === "Escape") {
//       setSuggestOpen(false);
//     }
//   }

//   return (
//     <div className="mt-6">
//       {/* ---- chips ---- */}
//       {enableFilters ? (
//         <div className="relative">
//           <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
//           <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />

//           <div
//             className={[
//               "no-scrollbar flex gap-2 overflow-x-auto pb-3",
//               searchActive ? "opacity-60" : "",
//             ].join(" ")}
//             onPointerDown={onChipPointerDown}
//             onPointerMove={onChipPointerMove}
//             onPointerUp={onChipPointerUp}
//             onPointerCancel={onChipPointerUp}
//             onWheel={onChipWheel}
//           >
//             {(facets.tags || ["All"]).map((t) => {
//               const active =
//                 t === "All" ? activeTags.length === 0 : activeTags.includes(t);
//               return (
//                 <FilterChip
//                   key={t}
//                   active={active}
//                   disabled={searchActive} // ✅ search active => chips disabled look + no click
//                   onClick={() => {
//                     if (searchActive) return;
//                     toggleTag(t);
//                   }}
//                 >
//                   {t}
//                 </FilterChip>
//               );
//             })}
//           </div>
//         </div>
//       ) : null}

//       {/* ---- search input ---- */}
//       {enableSearch ? (
//         <div className="mt-2">
//           <div className="relative">
//             <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/60">
//               🔎
//             </span>

//             <input
//               ref={inputRef}
//               value={query}
//               onChange={(e) => {
//                 setQuery(e.target.value);
//                 setSuggestOpen(true);
//                 setSuggestIndex(0);
//               }}
//               onKeyDown={onKeyDown}
//               onFocus={() => setSuggestOpen(true)}
//               onBlur={() => setTimeout(() => setSuggestOpen(false), 120)}
//               placeholder="Search projects… (e.g. Next.js, Tailwind, MERN)"
//               className={[
//                 "w-full rounded-2xl pl-11 pr-16 py-3 text-sm outline-none transition",
//                 "border border-border/12 bg-foreground/[0.03] text-foreground",
//                 "placeholder:text-foreground/45",
//                 "focus:border-border/25 focus:bg-foreground/[0.05]",
//               ].join(" ")}
//             />

//             {query ? (
//               <button
//                 onClick={() => setQuery("")}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-border/12 bg-foreground/[0.03] px-2 py-1 text-xs text-foreground/70 hover:bg-foreground/[0.06]"
//                 type="button"
//               >
//                 ✕
//               </button>
//             ) : null}

//             {/* suggestions dropdown */}
//             <AnimatePresence>
//               {suggestOpen && suggestions.length ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
//                   animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//                   exit={{ opacity: 0, y: 6, filter: "blur(6px)" }}
//                   transition={{ duration: 0.18 }}
//                   className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border/12 bg-background/85 backdrop-blur-xl"
//                 >
//                   {suggestions.map((s, idx) => (
//                     <button
//                       key={s}
//                       type="button"
//                       onMouseDown={(e) => e.preventDefault()}
//                       onClick={() => {
//                         setQuery(s);
//                         setSuggestOpen(false);
//                       }}
//                       className={[
//                         "flex w-full items-center justify-between px-4 py-3 text-left text-sm",
//                         idx === suggestIndex
//                           ? "bg-foreground/[0.06]"
//                           : "hover:bg-foreground/[0.04]",
//                       ].join(" ")}
//                     >
//                       <span>{s}</span>
//                       <span className="text-xs text-foreground/50">↵</span>
//                     </button>
//                   ))}
//                 </motion.div>
//               ) : null}
//             </AnimatePresence>

//             <span className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-60 blur-xl" />
//           </div>

//           <div className="mt-2 flex items-center justify-between text-xs text-muted/60">
//             <span>
//               {loading
//                 ? "Searching…"
//                 : resultsCount !== null
//                 ? `Found ${resultsCount} projects`
//                 : " "}
//             </span>
//             {searchActive ? (
//               <span className="text-foreground/70">
//                 chips disabled while searching
//               </span>
//             ) : null}
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// // your existing chip button component (same UI)
// function FilterChip({ active, onClick, children, disabled }) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={[
//         "relative shrink-0 rounded-full px-4 py-2 text-sm transition",
//         "border border-border/15 backdrop-blur",
//         disabled ? "opacity-50 cursor-not-allowed" : "",
//         active ? "text-foreground" : "text-foreground/75 hover:text-foreground",
//       ].join(" ")}
//       type="button"
//     >
//       <span
//         className={[
//           "absolute inset-0 rounded-full",
//           active ? "bg-foreground/[0.09]" : "bg-foreground/[0.03]",
//         ].join(" ")}
//       />
//       {active ? (
//         <span className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[6px]" />
//       ) : null}

//       <span className="relative inline-flex items-center gap-2">
//         <span
//           className={
//             active
//               ? "h-1.5 w-1.5 rounded-full bg-foreground/80"
//               : "h-1.5 w-1.5 rounded-full bg-foreground/45"
//           }
//         />
//         {children}
//       </span>

//       {active ? (
//         <motion.span
//           layoutId="chip-underline"
//           className="pointer-events-none absolute left-4 right-4 -bottom-[6px] h-[2px] rounded-full bg-foreground/80"
//           transition={{ type: "spring", stiffness: 420, damping: 34 }}
//         />
//       ) : null}
//     </button>
//   );
// }

// const EXTRA_CHIPS = ["MERN", "Node.js", "Express.js", "MongoDB"];

// export default function ProjectsSearchPro({
//   enableFilters = true,
//   enableSearch = true,
//   syncToUrl = true,
//   enableSlashFocus = false, // optional
//   syncTagsToUrl = false, // ✅ default off (so refresh -> All)
//   onResults, // (results) => void
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const [query, setQuery] = useState("");
//   const [activeTags, setActiveTags] = useState([]); // empty => All
//   const [facets, setFacets] = useState({ tags: ["All"], suggestions: [] });
//   const [resultsCount, setResultsCount] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [suggestOpen, setSuggestOpen] = useState(false);
//   const [suggestIndex, setSuggestIndex] = useState(0);

//   const inputRef = useRef(null);

//   const searchActive = enableSearch && query.trim().length > 0;

//   /* ---------------- URL sync (q + optional tags) ---------------- */

//   // init from URL (only q by default, tags optional)
//   useEffect(() => {
//     if (!syncToUrl) return;

//     const q = searchParams.get("q") || "";
//     setQuery((prev) => (prev !== q ? q : prev));

//     if (syncTagsToUrl) {
//       const tagsStr = searchParams.get("tags") || "";
//       const tags = tagsStr
//         .split(",")
//         .map((x) => x.trim())
//         .filter(Boolean);
//       // ✅ if no q and you want refresh -> All, keep All unless tags sync is enabled explicitly
//       setActiveTags(tags);
//     } else {
//       // ✅ always All on refresh (your requirement)
//       setActiveTags([]);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [syncToUrl, syncTagsToUrl]);

//   // push to URL (q always, tags optional)
//   const lastUrlRef = useRef("");
//   useEffect(() => {
//     if (!syncToUrl) return;

//     const sp = new URLSearchParams(searchParams.toString());

//     const q = enableSearch ? query.trim() : "";
//     if (q) sp.set("q", q);
//     else sp.delete("q");

//     if (syncTagsToUrl && enableFilters) {
//       if (activeTags.length) sp.set("tags", activeTags.join(","));
//       else sp.delete("tags");
//     } else {
//       sp.delete("tags");
//     }

//     const next = sp.toString() ? `${pathname}?${sp.toString()}` : pathname;
//     if (lastUrlRef.current === next) return;
//     lastUrlRef.current = next;

//     router.replace(next, { scroll: false });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     syncToUrl,
//     syncTagsToUrl,
//     enableSearch,
//     enableFilters,
//     query,
//     activeTags,
//     pathname,
//     router,
//   ]);

//   /* ---------------- Slash focus ---------------- */

//   useEffect(() => {
//     if (!enableSlashFocus || !enableSearch) return;

//     const onKeyDown = (e) => {
//       if (e.key !== "/") return;

//       const el = e.target;
//       const tag = el?.tagName?.toLowerCase();
//       const isTyping =
//         tag === "input" || tag === "textarea" || el?.isContentEditable;
//       if (isTyping) return;

//       e.preventDefault();
//       inputRef.current?.focus?.();
//       setSuggestOpen(true);
//     };

//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [enableSlashFocus, enableSearch]);

//   /* ---------------- Chips drag scroll ---------------- */

//   const chipDragRef = useRef({
//     active: false,
//     pointerId: null,
//     startX: 0,
//     startScroll: 0,
//     moved: false,
//   });
//   const ignoreClickRef = useRef(false);

//   function onChipPointerDown(e) {
//     const el = e.currentTarget;
//     if (e.pointerType === "mouse" && e.button !== 0) return;

//     ignoreClickRef.current = false;

//     chipDragRef.current = {
//       active: true,
//       pointerId: e.pointerId,
//       startX: e.clientX,
//       startScroll: el.scrollLeft,
//       moved: false,
//     };

//     // capture only ok
//     try {
//       el.setPointerCapture(e.pointerId);
//     } catch {}
//   }

//   function onChipPointerMove(e) {
//     const s = chipDragRef.current;
//     if (!s.active || s.pointerId !== e.pointerId) return;

//     const el = e.currentTarget;
//     const dx = e.clientX - s.startX;

//     if (!s.moved && Math.abs(dx) > 6) {
//       s.moved = true;
//       ignoreClickRef.current = true;
//     }

//     if (s.moved) el.scrollLeft = s.startScroll - dx;
//   }

//   function onChipPointerUp(e) {
//     const s = chipDragRef.current;
//     if (!s.active || s.pointerId !== e.pointerId) return;

//     chipDragRef.current = {
//       active: false,
//       pointerId: null,
//       startX: 0,
//       startScroll: 0,
//       moved: false,
//     };

//     setTimeout(() => {
//       ignoreClickRef.current = false;
//     }, 0);
//   }

//   function onChipWheel(e) {
//     if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
//       e.currentTarget.scrollLeft += e.deltaY;
//     }
//   }

//   function toggleTag(t) {
//     if (ignoreClickRef.current) return;

//     if (t === "All") {
//       setActiveTags([]);
//       return;
//     }

//     setActiveTags((prev) => {
//       const has = prev.includes(t);
//       if (has) return prev.filter((x) => x !== t);
//       return [...prev, t];
//     });
//   }

//   // ✅ requirement: typing in search => chips reset to All (and All should NOT look selected)
//   useEffect(() => {
//     if (!enableSearch) return;
//     if (query.trim()) setActiveTags([]);
//   }, [query, enableSearch]);

//   /* ---------------- Backend fetch (debounced + abort) ---------------- */

//   useEffect(() => {
//     if (!enableSearch && !enableFilters) return;

//     const controller = new AbortController();
//     const t = setTimeout(async () => {
//       setLoading(true);
//       try {
//         const q = query.trim();
//         const tags = activeTags.length ? activeTags.join(",") : "";

//         const url = `/api/projects/search?q=${encodeURIComponent(
//           q
//         )}&tags=${encodeURIComponent(tags)}&limit=50`;

//         const res = await fetch(url, {
//           cache: "no-store",
//           signal: controller.signal,
//         });

//         const json = await res.json();

//         if (json?.ok) {
//           // ✅ merge EXTRA chips into facets.tags (always visible)
//           const baseTags = Array.isArray(json?.facets?.tags)
//             ? json.facets.tags
//             : ["All"];
//           const merged = new Set(baseTags.filter(Boolean));
//           EXTRA_CHIPS.forEach((x) => merged.add(x));
//           const finalTags = [
//             "All",
//             ...Array.from(merged).filter((x) => x !== "All"),
//           ];

//           setFacets({
//             tags: finalTags,
//             suggestions: Array.isArray(json?.suggestions)
//               ? json.suggestions
//               : [],
//           });

//           const count = Array.isArray(json.results) ? json.results.length : 0;
//           setResultsCount(count);
//           onResults?.(json.results || []);
//         } else {
//           setResultsCount(0);
//           onResults?.([]);
//         }
//       } catch (e) {
//         if (e?.name === "AbortError") return;
//         setResultsCount(0);
//         onResults?.([]);
//       } finally {
//         setLoading(false);
//       }
//     }, 180);

//     return () => {
//       controller.abort();
//       clearTimeout(t);
//     };
//   }, [query, activeTags, enableSearch, enableFilters, onResults]);

//   /* ---------------- Suggestions (tags + API suggestions) ---------------- */

//   const suggestions = useMemo(() => {
//     const q = query.trim().toLowerCase();

//     const tagList = (facets.tags || []).filter((t) => t && t !== "All");
//     const apiSug = (facets.suggestions || []).filter(Boolean);

//     // merge unique (prefer tags first)
//     const merged = [];
//     const seen = new Set();
//     for (const x of [...tagList, ...apiSug]) {
//       const k = String(x).toLowerCase();
//       if (seen.has(k)) continue;
//       seen.add(k);
//       merged.push(x);
//     }

//     if (!q) return merged.slice(0, 8);
//     return merged
//       .filter((t) => String(t).toLowerCase().includes(q))
//       .slice(0, 8);
//   }, [query, facets]);

//   function onKeyDown(e) {
//     if (!suggestions.length) return;

//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setSuggestOpen(true);
//       setSuggestIndex((i) => Math.min(i + 1, suggestions.length - 1));
//     }
//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setSuggestOpen(true);
//       setSuggestIndex((i) => Math.max(i - 1, 0));
//     }
//     if (e.key === "Enter" && suggestOpen) {
//       e.preventDefault();
//       const pick = suggestions[suggestIndex];
//       if (pick) setQuery(String(pick));
//       setSuggestOpen(false);
//     }
//     if (e.key === "Escape") {
//       setSuggestOpen(false);
//     }
//   }

//   return (
//     <div className="mt-6">
//       {/* ---- chips ---- */}
//       {enableFilters ? (
//         <div className="relative">
//           <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
//           <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />

//           <div
//             className={[
//               "no-scrollbar flex gap-2 overflow-x-auto pb-3",
//               searchActive ? "opacity-60" : "",
//             ].join(" ")}
//             onPointerDown={onChipPointerDown}
//             onPointerMove={onChipPointerMove}
//             onPointerUp={onChipPointerUp}
//             onPointerCancel={onChipPointerUp}
//             onWheel={onChipWheel}
//           >
//             {(facets.tags || ["All"]).map((t) => {
//               // ✅ search active => "All" should not look selected
//               const active =
//                 t === "All"
//                   ? !searchActive && activeTags.length === 0
//                   : activeTags.includes(t);

//               return (
//                 <FilterChip
//                   key={t}
//                   active={active}
//                   disabled={searchActive} // ✅ disabled look while searching
//                   onClick={() => {
//                     if (searchActive) return;
//                     toggleTag(t);
//                   }}
//                 >
//                   {t}
//                 </FilterChip>
//               );
//             })}
//           </div>
//         </div>
//       ) : null}

//       {/* ---- search input ---- */}
//       {enableSearch ? (
//         <div className="mt-2">
//           <div className="relative">
//             <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/60">
//               🔎
//             </span>

//             <input
//               ref={inputRef}
//               value={query}
//               onChange={(e) => {
//                 setQuery(e.target.value);
//                 setSuggestOpen(true);
//                 setSuggestIndex(0);
//               }}
//               onKeyDown={onKeyDown}
//               onFocus={() => setSuggestOpen(true)}
//               onBlur={() => setTimeout(() => setSuggestOpen(false), 120)}
//               placeholder="Search projects… (e.g. Next.js, Tailwind, MERN)"
//               className={[
//                 "w-full rounded-2xl pl-11 pr-16 py-3 text-sm outline-none transition",
//                 "border border-border/12 bg-foreground/[0.03] text-foreground",
//                 "placeholder:text-foreground/45",
//                 "focus:border-border/25 focus:bg-foreground/[0.05]",
//               ].join(" ")}
//             />

//             {query ? (
//               <button
//                 onClick={() => {
//                   setQuery("");
//                   setSuggestOpen(false);
//                   setSuggestIndex(0);
//                   // ✅ on clear => All state remains (chips enabled again)
//                   inputRef.current?.focus?.();
//                 }}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-border/12 bg-foreground/[0.03] px-2 py-1 text-xs text-foreground/70 hover:bg-foreground/[0.06]"
//                 type="button"
//               >
//                 ✕
//               </button>
//             ) : null}

//             {/* suggestions dropdown */}
//             <AnimatePresence>
//               {suggestOpen && suggestions.length ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
//                   animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//                   exit={{ opacity: 0, y: 6, filter: "blur(6px)" }}
//                   transition={{ duration: 0.18 }}
//                   className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border/12 bg-background/85 backdrop-blur-xl"
//                 >
//                   {suggestions.map((s, idx) => (
//                     <button
//                       key={`${s}-${idx}`}
//                       type="button"
//                       onMouseDown={(e) => e.preventDefault()}
//                       onClick={() => {
//                         setQuery(String(s));
//                         setSuggestOpen(false);
//                       }}
//                       className={[
//                         "flex w-full items-center justify-between px-4 py-3 text-left text-sm",
//                         idx === suggestIndex
//                           ? "bg-foreground/[0.06]"
//                           : "hover:bg-foreground/[0.04]",
//                       ].join(" ")}
//                     >
//                       <span>{s}</span>
//                       <span className="text-xs text-foreground/50">↵</span>
//                     </button>
//                   ))}
//                 </motion.div>
//               ) : null}
//             </AnimatePresence>

//             <span className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-60 blur-xl" />
//           </div>

//           <div className="mt-2 flex items-center justify-between text-xs text-muted/60">
//             <span>
//               {loading
//                 ? "Searching…"
//                 : resultsCount !== null
//                 ? `Found ${resultsCount} projects`
//                 : " "}
//             </span>
//             {searchActive ? (
//               <span className="text-foreground/70">
//                 chips disabled while searching
//               </span>
//             ) : null}
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

"use client";

import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- UI: Chip ---------------- */
function FilterChip({ active, onClick, children, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "relative shrink-0 rounded-full px-4 py-2 text-sm transition",
        "border border-border/15 backdrop-blur",
        disabled ? "opacity-55 cursor-not-allowed" : "",
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

/* ---------------- main ---------------- */
const ProjectsSearchPro = forwardRef(function ProjectsSearchPro(
  {
    enableFilters = true,
    enableSearch = true,
    syncToUrl = true,
    onResults, // (results) => void
  },
  ref
) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]); // empty => All
  const [facets, setFacets] = useState({ tags: ["All"] });
  const [resultsCount, setResultsCount] = useState(null);

  const [loading, setLoading] = useState(false);

  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestIndex, setSuggestIndex] = useState(0);

  const inputRef = useRef(null);

  const searchActive = enableSearch && query.trim().length > 0;
  const chipsDisabled = searchActive; // ✅ your UX: searching => chips disabled (scroll ok)

  /* ---------- expose methods to parent (for empty state buttons) ---------- */
  useImperativeHandle(ref, () => ({
    clearFilters() {
      setActiveTags([]);
    },
    clearSearch() {
      setQuery("");
      setSuggestOpen(false);
      setSuggestIndex(0);
    },
    resetAll() {
      setActiveTags([]);
      setQuery("");
      setSuggestOpen(false);
      setSuggestIndex(0);
    },
    focusSearch() {
      inputRef.current?.focus?.();
    },
  }));

  /* ---------- URL sync (safe, client-only) ---------- */
  useEffect(() => {
    if (!syncToUrl) return;
    if (typeof window === "undefined") return;

    const sp = new URLSearchParams(window.location.search);
    const q = sp.get("q") || "";

    // ✅ refresh/open without q => always All
    if (!q.trim()) {
      setQuery("");
      setActiveTags([]);
      return;
    }

    const tagsStr = sp.get("tags") || "";
    const tags = tagsStr
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    setQuery(q);
    setActiveTags(tags);
  }, [syncToUrl]);

  useEffect(() => {
    if (!syncToUrl) return;
    if (typeof window === "undefined") return;

    const sp = new URLSearchParams(window.location.search);

    const q = enableSearch ? query.trim() : "";
    if (q) sp.set("q", q);
    else sp.delete("q");

    if (enableFilters && activeTags.length > 0)
      sp.set("tags", activeTags.join(","));
    else sp.delete("tags");

    const qs = sp.toString();
    const nextUrl = qs
      ? `${window.location.pathname}?${qs}`
      : window.location.pathname;

    window.history.replaceState(null, "", nextUrl);
  }, [syncToUrl, enableSearch, enableFilters, query, activeTags]);

  /* ---------- typing in search => chips reset to All ---------- */
  useEffect(() => {
    if (!enableSearch) return;
    if (query.trim()) setActiveTags([]); // ✅ requirement
  }, [query, enableSearch]);

  /* ---------- Chip drag scroll (FIXED: click + drag both work) ---------- */
  const chipDragRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startScroll: 0,
    moved: false,
    captured: false,
  });

  const ignoreChipClickRef = useRef(false);

  function onChipPointerDown(e) {
    const el = e.currentTarget;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    ignoreChipClickRef.current = false;

    chipDragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
      captured: false,
    };
  }

  function onChipPointerMove(e) {
    const s = chipDragRef.current;
    if (!s.active || s.pointerId !== e.pointerId) return;

    const el = e.currentTarget;
    const dx = e.clientX - s.startX;

    // threshold: tap vs drag
    if (!s.moved && Math.abs(dx) > 6) {
      s.moved = true;
      ignoreChipClickRef.current = true;

      // capture ONLY after drag begins (so normal click doesn't break)
      if (!s.captured) {
        try {
          el.setPointerCapture(e.pointerId);
          s.captured = true;
        } catch {}
      }
    }

    if (s.moved) {
      e.preventDefault?.();
      el.scrollLeft = s.startScroll - dx;
    }
  }

  function onChipPointerUp(e) {
    const s = chipDragRef.current;
    if (!s.active || s.pointerId !== e.pointerId) return;

    const el = e.currentTarget;
    if (s.captured) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}
    }

    chipDragRef.current = {
      active: false,
      pointerId: null,
      startX: 0,
      startScroll: 0,
      moved: false,
      captured: false,
    };

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

  /* ---------- multi chip select ---------- */
  function toggleTag(t) {
    if (ignoreChipClickRef.current) return;
    if (chipsDisabled) return; // ✅ searching => no chip clicks

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

  /* ---------- backend fetch (debounced) ---------- */
  useEffect(() => {
    if (!enableSearch && !enableFilters) return;

    let alive = true;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const q = enableSearch ? query.trim() : "";
        const tags =
          enableFilters && activeTags.length ? activeTags.join(",") : "";

        const url = `/api/projects/search?q=${encodeURIComponent(
          q
        )}&tags=${encodeURIComponent(tags)}&limit=50`;

        const res = await fetch(url, { cache: "no-store" });
        const json = await res.json();

        if (!alive) return;

        if (json?.ok) {
          setFacets(json.facets || { tags: ["All"] });
          const resultsArr = Array.isArray(json.results) ? json.results : [];
          setResultsCount(resultsArr.length);
          onResults?.(resultsArr);
        } else {
          setResultsCount(0);
          onResults?.([]);
        }
      } catch {
        if (!alive) return;
        setResultsCount(0);
        onResults?.([]);
      } finally {
        if (alive) setLoading(false);
      }
    }, 180);

    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [query, activeTags, enableSearch, enableFilters, onResults]);

  /* ---------- suggestions ---------- */
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tags = (facets.tags || []).filter((t) => t && t !== "All");
    if (!q) return tags.slice(0, 8);
    return tags.filter((t) => t.toLowerCase().includes(q)).slice(0, 8);
  }, [query, facets]);

  function onKeyDown(e) {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSuggestOpen(true);
      setSuggestIndex((i) => Math.min(i + 1, suggestions.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSuggestOpen(true);
      setSuggestIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && suggestOpen) {
      e.preventDefault();
      const pick = suggestions[suggestIndex];
      if (pick) setQuery(pick);
      setSuggestOpen(false);
    }
    if (e.key === "Escape") {
      setSuggestOpen(false);
    }
  }

  return (
    <div className="mt-6">
      {/* ---- chips ---- */}
      {enableFilters ? (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />

          <div
            className={[
              "no-scrollbar flex gap-2 overflow-x-auto pb-3",
              chipsDisabled ? "opacity-60" : "",
            ].join(" ")}
            onPointerDown={onChipPointerDown}
            onPointerMove={onChipPointerMove}
            onPointerUp={onChipPointerUp}
            onPointerCancel={onChipPointerUp}
            onWheel={onChipWheel}
            // ✅ if drag happened, kill click at container level too
            onClickCapture={(e) => {
              if (ignoreChipClickRef.current) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            aria-disabled={chipsDisabled ? "true" : "false"}
          >
            {(facets.tags || ["All"]).map((t) => {
              // ✅ All should NOT look selected while searching
              const active =
                t === "All"
                  ? !searchActive && activeTags.length === 0
                  : activeTags.includes(t);

              return (
                <FilterChip
                  key={t}
                  active={active}
                  disabled={chipsDisabled}
                  onClick={() => toggleTag(t)}
                >
                  {t}
                </FilterChip>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* ---- search input ---- */}
      {enableSearch ? (
        <div className="mt-2">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/60">
              🔎
            </span>

            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSuggestOpen(true);
                setSuggestIndex(0);
              }}
              onKeyDown={onKeyDown}
              onFocus={() => setSuggestOpen(true)}
              onBlur={() => setTimeout(() => setSuggestOpen(false), 120)}
              placeholder="Search projects… (e.g. Next.js, Tailwind, MERN)"
              className={[
                "w-full rounded-2xl pl-11 pr-16 py-3 text-sm outline-none transition",
                "border border-border/12 bg-foreground/[0.03] text-foreground",
                "placeholder:text-foreground/45",
                "focus:border-border/25 focus:bg-foreground/[0.05]",
              ].join(" ")}
            />

            {query ? (
              <button
                onClick={() => {
                  setQuery("");
                  setSuggestOpen(false);
                  setSuggestIndex(0);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-border/12 bg-foreground/[0.03] px-2 py-1 text-xs text-foreground/70 hover:bg-foreground/[0.06]"
                type="button"
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : null}

            {/* suggestions dropdown */}
            <AnimatePresence>
              {suggestOpen && suggestions.length ? (
                <motion.div
                  initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                  transition={{ duration: 0.18 }}
                  className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border/12 bg-background/85 backdrop-blur-xl"
                >
                  {suggestions.map((s, idx) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setQuery(s);
                        setSuggestOpen(false);
                      }}
                      className={[
                        "flex w-full items-center justify-between px-4 py-3 text-left text-sm",
                        idx === suggestIndex
                          ? "bg-foreground/[0.06]"
                          : "hover:bg-foreground/[0.04]",
                      ].join(" ")}
                    >
                      <span>{s}</span>
                      <span className="text-xs text-foreground/50">↵</span>
                    </button>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <span className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-60 blur-xl" />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-muted/60">
            <span>
              {loading
                ? "Searching…"
                : resultsCount !== null
                ? `Found ${resultsCount} projects`
                : " "}
            </span>
            {chipsDisabled ? (
              <span className="text-foreground/70">
                chips disabled while searching
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
});

export default ProjectsSearchPro;

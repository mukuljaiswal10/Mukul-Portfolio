// // src/components/ai/searchActions.js
// import { getAllPosts } from "@/lib/blog";

// export const RECENT_KEY = "mukul_search_recent_v1";

// // You can tweak these anytime
// const HOME_SECTIONS = [
//     { id: "home", label: "Home" },
//     { id: "about", label: "About" },
//     { id: "skills", label: "Skills" },
//     { id: "projects", label: "Projects" },
//     { id: "experience", label: "Experience / Timeline" },
//     { id: "testimonials", label: "Testimonials" },
//     { id: "faq", label: "FAQ" },
//     { id: "contact", label: "Contact" },
// ];

// const PAGES = [
//     { href: "/", label: "Home" },
//     { href: "/about", label: "About" },
//     { href: "/skills", label: "Skills" },
//     { href: "/projects", label: "Projects" },
//     { href: "/blog", label: "Blog" },
//     { href: "/contact", label: "Contact" },
// ];

// function uniq(arr) {
//     return Array.from(new Set(arr.filter(Boolean)));
// }

// export function getPopularSearches() {
//     // derived from posts + some hand-picked power queries
//     const posts = getAllPosts();
//     const tags = uniq(posts.flatMap((p) => p.tags || [])).slice(0, 10);
//     const cats = uniq(posts.map((p) => p.category)).slice(0, 6);

//     const manual = [
//         "MERN architecture",
//         "JWT auth",
//         "MongoDB indexing",
//         "Next.js performance",
//         "WordPress security",
//         "ACF best practices",
//         "Docker Nginx deploy",
//     ];

//     return uniq([...manual, ...cats, ...tags]).slice(0, 12);
// }

// /**
//  * ✅ One source of truth for actions
//  * type:
//  * - section: href "/#skills" or "/about#experience"
//  * - page: "/blog"
//  * - blog: "/blog/slug"
//  */
// export function getSearchActions() {
//     const actions = [];

//     // Home sections
//     for (const s of HOME_SECTIONS) {
//         actions.push({
//             id: `section:${s.id}`,
//             type: "section",
//             label: `Section: ${s.label}`,
//             hint: `/#${s.id}`,
//             keywords: `${s.label} section ${s.id} timeline experience projects skills contact faq testimonial`,
//             href: `/#${s.id}`,
//             sectionId: s.id,
//         });
//     }

//     // Pages
//     for (const p of PAGES) {
//         actions.push({
//             id: `page:${p.href}`,
//             type: "page",
//             label: `Open: ${p.label}`,
//             hint: p.href,
//             keywords: `${p.label} page`,
//             href: p.href,
//         });
//     }

//     // Blog posts
//     const posts = getAllPosts();
//     for (const post of posts) {
//         actions.push({
//             id: `blog:${post.slug}`,
//             type: "blog",
//             label: `Blog: ${post.title}`,
//             hint: `/blog/${post.slug}`,
//             keywords: `${post.title} ${post.category} ${(post.tags || []).join(" ")} blog article post`,
//             href: `/blog/${post.slug}`,
//             meta: {
//                 category: post.category,
//                 readTime: post.readTime,
//                 date: post.date,
//             },
//         });
//     }

//     return actions;
// }

// export function filterActions(actions, q) {
//     const s = String(q || "").trim().toLowerCase();
//     if (!s) return actions;
//     return actions.filter((a) => {
//         const hay = `${a.label} ${a.hint} ${a.keywords}`.toLowerCase();
//         return hay.includes(s);
//     });
// }

// export function runAction(action, { router, pathname } = {}) {
//     if (!action?.href) return;

//     // if same page + hash => direct scroll (best UX)
//     if (action.type === "section" && typeof window !== "undefined") {
//         const [path, hash] = action.href.split("#");
//         const targetId = hash || action.sectionId;

//         // normalize current path
//         const cur = pathname || window.location.pathname;

//         // if already on same path => scroll directly
//         if (!path || path === cur) {
//             const el = document.getElementById(targetId);
//             if (el) {
//                 el.scrollIntoView({ behavior: "smooth", block: "start" });
//                 try {
//                     window.history.replaceState(null, "", `#${targetId}`);
//                 } catch { }
//                 return;
//             }
//         }
//     }

//     // fallback route navigation (ScrollToHash will handle scroll after route)
//     router?.push?.(action.href);
// }

// export function loadRecent() {
//     try {
//         const raw = localStorage.getItem(RECENT_KEY);
//         const arr = raw ? JSON.parse(raw) : [];
//         return Array.isArray(arr) ? arr.slice(0, 10) : [];
//     } catch {
//         return [];
//     }
// }

// export function saveRecent(query) {
//     try {
//         const s = String(query || "").trim();
//         if (!s) return;

//         const cur = loadRecent();
//         const next = [s, ...cur.filter((x) => x !== s)].slice(0, 10);
//         localStorage.setItem(RECENT_KEY, JSON.stringify(next));
//     } catch { }
// }












// src/components/ai/searchActions.js
// "use client";

// import { getAllPosts } from "@/lib/blog";

// /**
//  * One single source of truth:
//  * - Sections (home)
//  * - Pages (routes)
//  * - Blog posts (auto from lib/blog.js)
//  *
//  * Each action shape:
//  * { id, label, hint, keywords, kind, href, sectionId }
//  */

// const HOME_SECTIONS = [
//     { id: "home", label: "Home", keywords: "home hero top landing" },
//     { id: "about", label: "About", keywords: "about intro profile" },
//     { id: "skills", label: "Skills", keywords: "skills stack tech" },
//     { id: "projects", label: "Projects", keywords: "projects work portfolio" },
//     { id: "testimonials", label: "Testimonials", keywords: "reviews clients feedback" },
//     { id: "faq", label: "FAQ", keywords: "faq questions doubts" },
//     { id: "contact", label: "Contact", keywords: "contact hire message call whatsapp" },
// ];

// const PAGES = [
//     { href: "/", label: "Open: Home", keywords: "home index" },
//     { href: "/blog", label: "Open: Blog", keywords: "blog articles posts" },
//     { href: "/projects", label: "Open: Projects page", keywords: "projects page all" },
//     { href: "/skills", label: "Open: Skills page", keywords: "skills page all" },
//     { href: "/services", label: "Open: Services", keywords: "services pricing work" },
//     { href: "/contact", label: "Open: Contact", keywords: "contact hire" },
// ];

// /** Optional: you can show these chips anywhere (palette or sticky search) */
// export const POPULAR_SEARCHES = [
//     "MERN",
//     "WordPress",
//     "Docker",
//     "Nginx",
//     "Security",
//     "ACF",
//     "CPT",
//     "Architecture",
// ];

// function scrollToId(id) {
//     const el = document.getElementById(id);
//     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
// }

// function toText(s = "") {
//     return String(s || "").replace(/\s+/g, " ").trim();
// }

// function blogActions() {
//     const posts = getAllPosts();
//     return posts.map((p) => ({
//         id: `blog:${p.slug}`,
//         label: `Blog: ${toText(p.title)}`,
//         hint: `/blog/${p.slug}`,
//         keywords: toText(
//             `${p.title} ${p.excerpt} ${(p.tags || []).join(" ")} ${p.category || ""}`
//         ),
//         kind: "route",
//         href: `/blog/${p.slug}`,
//     }));
// }

// function sectionActions() {
//     return HOME_SECTIONS.map((s) => ({
//         id: `sec:${s.id}`,
//         label: `Go: ${s.label} section`,
//         hint: `#${s.id}`,
//         keywords: s.keywords,
//         kind: "section",
//         sectionId: s.id,
//     }));
// }

// function pageActions() {
//     return PAGES.map((p) => ({
//         id: `page:${p.href}`,
//         label: p.label,
//         hint: p.href,
//         keywords: p.keywords,
//         kind: "route",
//         href: p.href,
//     }));
// }

// export function getSearchActions({ pathname } = {}) {
//     // pathname currently not used for building list, but kept for future needs
//     return [...pageActions(), ...sectionActions(), ...blogActions()];
// }

// /** Simple scoring so better matches show on top */
// function scoreAction(action, q) {
//     const s = q.toLowerCase();
//     const label = (action.label || "").toLowerCase();
//     const hint = (action.hint || "").toLowerCase();
//     const keys = (action.keywords || "").toLowerCase();
//     const hay = `${label} ${hint} ${keys}`;

//     let score = 0;

//     if (label.startsWith(s)) score += 60;
//     if (hint.startsWith(s)) score += 30;
//     if (hay.includes(s)) score += 15;

//     // bonus for word-boundary match
//     if (new RegExp(`\\b${s}`, "i").test(hay)) score += 10;

//     // slight preference: pages/sections above posts (UX)
//     if (action.id?.startsWith("page:")) score += 4;
//     if (action.id?.startsWith("sec:")) score += 3;

//     return score;
// }

// export function filterActions(actions, query) {
//     const q = String(query || "").trim();
//     if (!q) return actions;

//     const list = actions
//         .map((a) => ({ a, score: scoreAction(a, q) }))
//         .filter((x) => x.score > 0)
//         .sort((x, y) => y.score - x.score)
//         .map((x) => x.a);

//     return list;
// }

// export function runAction(action, { router, pathname } = {}) {
//     if (!action) return;

//     const isHome = pathname === "/";

//     if (action.kind === "section") {
//         const id = action.sectionId || "home";
//         if (isHome) {
//             scrollToId(id);
//             return;
//         }
//         // not on home -> go home with hash
//         router?.push(`/#${id}`);
//         return;
//     }

//     if (action.kind === "route") {
//         router?.push(action.href || "/");
//         return;
//     }
// }


























// "use client";

// import { getAllPosts } from "@/lib/blog";

// /**
//  * One single source of truth:
//  * - Sections (home)
//  * - Pages (routes)
//  * - Blog posts (auto from lib/blog.js)
//  *
//  * Each action shape:
//  * { id, label, hint, keywords, kind, href, sectionId }
//  */

// const HOME_SECTIONS = [
//     { id: "home", label: "Home", keywords: "home hero top landing" },
//     { id: "about", label: "About", keywords: "about intro profile" },
//     { id: "skills", label: "Skills", keywords: "skills stack tech" },
//     { id: "projects", label: "Projects", keywords: "projects work portfolio" },
//     {
//         id: "testimonials",
//         label: "Testimonials",
//         keywords: "reviews clients feedback",
//     },
//     { id: "faq", label: "FAQ", keywords: "faq questions doubts" },
//     {
//         id: "contact",
//         label: "Contact",
//         keywords: "contact hire message call whatsapp",
//     },
// ];

// const PAGES = [
//     { href: "/", label: "Open: Home", keywords: "home index" },
//     { href: "/blog", label: "Open: Blog", keywords: "blog articles posts" },
//     { href: "/projects", label: "Open: Projects page", keywords: "projects page all" },
//     { href: "/skills", label: "Open: Skills page", keywords: "skills page all" },
//     { href: "/services", label: "Open: Services", keywords: "services pricing work" },
//     { href: "/contact", label: "Open: Contact", keywords: "contact hire" },
// ];

// /** Optional: you can show these chips anywhere (palette or sticky search) */
// export const POPULAR_SEARCHES = [
//     "MERN",
//     "WordPress",
//     "Docker",
//     "Nginx",
//     "Security",
//     "ACF",
//     "CPT",
//     "Architecture",
// ];

// function scrollToId(id) {
//     const el = document.getElementById(id);
//     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
// }

// function toText(s = "") {
//     return String(s || "").replace(/\s+/g, " ").trim();
// }

// /** ✅ Blog -> actions auto generate */
// function blogActions() {
//     const posts = getAllPosts();
//     return posts.map((p) => ({
//         id: `blog:${p.slug}`,
//         label: `Blog: ${toText(p.title)}`,
//         hint: `/blog/${p.slug}`,
//         keywords: toText(
//             `${p.title} ${p.excerpt} ${(p.tags || []).join(" ")} ${p.category || ""}`
//         ),
//         kind: "route",
//         href: `/blog/${p.slug}`,
//     }));
// }

// /** ✅ Home sections -> actions */
// function sectionActions() {
//     return HOME_SECTIONS.map((s) => ({
//         id: `sec:${s.id}`,
//         label: `Go: ${s.label} section`,
//         hint: `#${s.id}`,
//         keywords: s.keywords,
//         kind: "section",
//         sectionId: s.id,
//     }));
// }

// /** ✅ Pages -> actions */
// function pageActions() {
//     return PAGES.map((p) => ({
//         id: `page:${p.href}`,
//         label: p.label,
//         hint: p.href,
//         keywords: p.keywords,
//         kind: "route",
//         href: p.href,
//     }));
// }

// export function getSearchActions({ pathname } = {}) {
//     // pathname currently not used for building list, but kept for future needs
//     return [...pageActions(), ...sectionActions(), ...blogActions()];
// }

// /** ✅ Popular searches auto-sync (base + blog tags/category) */
// export function getPopularSearches({ limit = 10 } = {}) {
//     // curated stable base
//     const base = [
//         ...POPULAR_SEARCHES,
//         "Deployment",
//         "Scalability",
//         "Clean Code",
//         "JWT",
//         "MongoDB",
//     ];

//     // auto from blog
//     let auto = [];
//     try {
//         const posts = getAllPosts?.() || [];
//         const freq = new Map();

//         for (const p of posts) {
//             for (const t of p.tags || []) {
//                 const key = toText(t);
//                 if (!key) continue;
//                 freq.set(key, (freq.get(key) || 0) + 1);
//             }
//             if (p.category) {
//                 const c = toText(p.category);
//                 if (c) freq.set(c, (freq.get(c) || 0) + 1);
//             }
//         }

//         auto = [...freq.entries()]
//             .sort((a, b) => b[1] - a[1])
//             .map(([k]) => k);
//     } catch {
//         auto = [];
//     }

//     // merge unique + limit
//     const seen = new Set();
//     const out = [];
//     for (const term of [...base, ...auto]) {
//         const v = toText(term);
//         if (!v) continue;
//         const key = v.toLowerCase();
//         if (seen.has(key)) continue;
//         seen.add(key);
//         out.push(v);
//         if (out.length >= limit) break;
//     }
//     return out;
// }

// /** Simple scoring so better matches show on top */
// function scoreAction(action, q) {
//     const s = q.toLowerCase();
//     const label = (action.label || "").toLowerCase();
//     const hint = (action.hint || "").toLowerCase();
//     const keys = (action.keywords || "").toLowerCase();
//     const hay = `${label} ${hint} ${keys}`;

//     let score = 0;

//     if (label.startsWith(s)) score += 60;
//     if (hint.startsWith(s)) score += 30;
//     if (hay.includes(s)) score += 15;

//     // bonus for word-boundary match
//     if (new RegExp(`\\b${s}`, "i").test(hay)) score += 10;

//     // slight preference: pages/sections above posts (UX)
//     if (action.id?.startsWith("page:")) score += 4;
//     if (action.id?.startsWith("sec:")) score += 3;

//     return score;
// }

// export function filterActions(actions, query) {
//     const q = String(query || "").trim();
//     if (!q) return actions;

//     return actions
//         .map((a) => ({ a, score: scoreAction(a, q) }))
//         .filter((x) => x.score > 0)
//         .sort((x, y) => y.score - x.score)
//         .map((x) => x.a);
// }

// export function runAction(action, { router, pathname } = {}) {
//     if (!action) return;

//     const isHome = pathname === "/";

//     if (action.kind === "section") {
//         const id = action.sectionId || "home";
//         if (isHome) {
//             scrollToId(id);
//             return;
//         }
//         router?.push(`/#${id}`);
//         return;
//     }

//     if (action.kind === "route") {
//         router?.push(action.href || "/");
//     }
// }


























// "use client";

// import { getAllPosts } from "@/lib/blog";

// /**
//  * One single source of truth:
//  * - Sections (home)
//  * - Pages (routes)
//  * - Blog posts (auto from lib/blog.js)
//  *
//  * Each action shape:
//  * { id, label, hint, keywords, kind, href, sectionId }
//  */

// const HOME_SECTIONS = [
//     { id: "home", label: "Home", keywords: "home hero top landing" },
//     { id: "about", label: "About", keywords: "about intro profile" },
//     { id: "skills", label: "Skills", keywords: "skills stack tech" },
//     { id: "projects", label: "Projects", keywords: "projects work portfolio" },
//     {
//         id: "testimonials",
//         label: "Testimonials",
//         keywords: "reviews clients feedback",
//     },
//     { id: "faq", label: "FAQ", keywords: "faq questions doubts" },
//     {
//         id: "contact",
//         label: "Contact",
//         keywords: "contact hire message call whatsapp",
//     },
// ];

// const PAGES = [
//     { href: "/", label: "Open: Home", keywords: "home index" },
//     { href: "/blog", label: "Open: Blog", keywords: "blog articles posts" },
//     {
//         href: "/projects",
//         label: "Open: Projects page",
//         keywords: "projects page all",
//     },
//     { href: "/skills", label: "Open: Skills page", keywords: "skills page all" },
//     {
//         href: "/services",
//         label: "Open: Services",
//         keywords: "services pricing work",
//     },
//     { href: "/contact", label: "Open: Contact", keywords: "contact hire" },
// ];

// /** Optional: curated base chips (stable + premium) */
// export const POPULAR_SEARCHES = [
//     "MERN",
//     "WordPress",
//     "Docker",
//     "Nginx",
//     "Security",
//     "ACF",
//     "CPT",
//     "Architecture",
// ];

// function scrollToId(id) {
//     const el = document.getElementById(id);
//     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
// }

// function toText(s = "") {
//     return String(s || "").replace(/\s+/g, " ").trim();
// }

// function escapeRegExp(str = "") {
//     return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// }

// /** ✅ Blog -> actions auto generate */
// function blogActions() {
//     const posts = getAllPosts();
//     return posts.map((p) => ({
//         id: `blog:${p.slug}`,
//         label: `Blog: ${toText(p.title)}`,
//         hint: `/blog/${p.slug}`,
//         keywords: toText(
//             `${p.title} ${p.excerpt} ${(p.tags || []).join(" ")} ${p.category || ""}`
//         ),
//         kind: "route",
//         href: `/blog/${p.slug}`,
//     }));
// }

// /** ✅ Home sections -> actions */
// function sectionActions() {
//     return HOME_SECTIONS.map((s) => ({
//         id: `sec:${s.id}`,
//         label: `Go: ${s.label} section`,
//         hint: `#${s.id}`,
//         keywords: s.keywords,
//         kind: "section",
//         sectionId: s.id,
//     }));
// }

// /** ✅ Pages -> actions */
// function pageActions() {
//     return PAGES.map((p) => ({
//         id: `page:${p.href}`,
//         label: p.label,
//         hint: p.href,
//         keywords: p.keywords,
//         kind: "route",
//         href: p.href,
//     }));
// }

// export function getSearchActions({ pathname } = {}) {
//     // pathname currently not used, kept for future
//     return [...pageActions(), ...sectionActions(), ...blogActions()];
// }

// /** ✅ Popular searches auto-sync (base + blog tags/category) */
// export function getPopularSearches({ limit = 10 } = {}) {
//     // curated stable base
//     const base = [
//         ...POPULAR_SEARCHES,
//         "Deployment",
//         "Scalability",
//         "Clean Code",
//         "JWT",
//         "MongoDB",
//     ];

//     // auto from blog: tags + category (frequency based)
//     let auto = [];
//     try {
//         const posts = getAllPosts() || [];
//         const freq = new Map();

//         for (const p of posts) {
//             for (const t of p.tags || []) {
//                 const key = toText(t);
//                 if (!key) continue;
//                 freq.set(key, (freq.get(key) || 0) + 1);
//             }

//             if (p.category) {
//                 const c = toText(p.category);
//                 if (c) freq.set(c, (freq.get(c) || 0) + 1);
//             }
//         }

//         auto = [...freq.entries()]
//             .sort((a, b) => b[1] - a[1])
//             .map(([k]) => k);
//     } catch {
//         auto = [];
//     }

//     // merge unique + limit
//     const seen = new Set();
//     const out = [];
//     for (const term of [...base, ...auto]) {
//         const v = toText(term);
//         if (!v) continue;
//         const key = v.toLowerCase();
//         if (seen.has(key)) continue;
//         seen.add(key);
//         out.push(v);
//         if (out.length >= limit) break;
//     }

//     return out;
// }

// /** Simple scoring so better matches show on top */
// function scoreAction(action, q) {
//     const s = String(q || "").toLowerCase();
//     const label = (action.label || "").toLowerCase();
//     const hint = (action.hint || "").toLowerCase();
//     const keys = (action.keywords || "").toLowerCase();
//     const hay = `${label} ${hint} ${keys}`;

//     let score = 0;

//     if (label.startsWith(s)) score += 60;
//     if (hint.startsWith(s)) score += 30;
//     if (hay.includes(s)) score += 15;

//     // ✅ safe word-boundary match
//     const safe = escapeRegExp(s);
//     if (safe && new RegExp(`\\b${safe}`, "i").test(hay)) score += 10;

//     // slight preference: pages/sections above posts (UX)
//     if (action.id?.startsWith("page:")) score += 4;
//     if (action.id?.startsWith("sec:")) score += 3;

//     return score;
// }

// export function filterActions(actions, query) {
//     const q = String(query || "").trim();
//     if (!q) return actions;

//     return actions
//         .map((a) => ({ a, score: scoreAction(a, q) }))
//         .filter((x) => x.score > 0)
//         .sort((x, y) => y.score - x.score)
//         .map((x) => x.a);
// }

// export function runAction(action, { router, pathname } = {}) {
//     if (!action) return;

//     const isHome = pathname === "/";

//     if (action.kind === "section") {
//         const id = action.sectionId || "home";
//         if (isHome) {
//             scrollToId(id);
//             return;
//         }
//         router?.push(`/#${id}`);
//         return;
//     }

//     if (action.kind === "route") {
//         router?.push(action.href || "/");
//     }
// }





























"use client";

import { getAllPosts } from "@/lib/blog";

/**
 * Single source of truth:
 * - Sections (home)
 * - Pages (routes)
 * - Blog posts (auto from lib/blog.js)
 *
 * Action shape:
 * { id, label, hint, keywords, kind, href, sectionId }
 */

const HOME_SECTIONS = [
    { id: "home", label: "Home", keywords: "home hero top landing" },
    { id: "about", label: "About", keywords: "about intro profile" },
    { id: "skills", label: "Skills", keywords: "skills stack tech" },
    { id: "projects", label: "Projects", keywords: "projects work portfolio" },
    { id: "blog-preview", label: "Blogs", keywords: "blog blogs articles posts latest preview home section" },
    { id: "testimonials", label: "Testimonials", keywords: "reviews clients feedback" },
    { id: "faq", label: "FAQ", keywords: "faq questions doubts" },
    { id: "contact", label: "Contact", keywords: "contact hire message call whatsapp" },
];

const PAGES = [
    { href: "/", label: "Open: Home", keywords: "home index" },
    { href: "/blog", label: "Open: Blog", keywords: "blog articles posts" },
    { href: "/projects", label: "Open: Projects page", keywords: "projects page all" },
    { href: "/skills", label: "Open: Skills page", keywords: "skills page all" },
    { href: "/services", label: "Open: Services", keywords: "services pricing work" },
    { href: "/contact", label: "Open: Contact", keywords: "contact hire" },
];

// ✅ curated base chips
export const POPULAR_SEARCHES = [
    "MERN",
    "WordPress",
    "Docker",
    "Nginx",
    "Security",
    "ACF",
    "CPT",
    "Architecture",
];

function toText(s = "") {
    return String(s || "").replace(/\s+/g, " ").trim();
}

function escapeRegExp(str = "") {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** ✅ Blog -> actions auto generate */
function blogActions() {
    const posts = getAllPosts();
    return posts.map((p) => ({
        id: `blog:${p.slug}`,
        label: `Blog: ${toText(p.title)}`,
        hint: `/blog/${p.slug}`,
        keywords: toText(
            `${p.title} ${p.excerpt} ${(p.tags || []).join(" ")} ${p.category || ""}`
        ),
        kind: "route",
        href: `/blog/${p.slug}`,
    }));
}

/** ✅ Home sections -> actions */
function sectionActions() {
    return HOME_SECTIONS.map((s) => ({
        id: `sec:${s.id}`,
        label: `Go: ${s.label} section`,
        hint: `#${s.id}`,
        keywords: s.keywords,
        kind: "section",
        sectionId: s.id,
    }));
}

/** ✅ Pages -> actions */
function pageActions() {
    return PAGES.map((p) => ({
        id: `page:${p.href}`,
        label: p.label,
        hint: p.href,
        keywords: p.keywords,
        kind: "route",
        href: p.href,
    }));
}

export function getSearchActions() {
    return [...pageActions(), ...sectionActions(), ...blogActions()];
}

/** ✅ Popular searches auto-sync (base + blog tags/category) */
export function getPopularSearches({ limit = 10 } = {}) {
    const base = [
        ...POPULAR_SEARCHES,
        "Deployment",
        "Scalability",
        "Clean Code",
        "JWT",
        "MongoDB",
    ];

    let auto = [];
    try {
        const posts = getAllPosts() || [];
        const freq = new Map();

        for (const p of posts) {
            for (const t of p.tags || []) {
                const key = toText(t);
                if (!key) continue;
                freq.set(key, (freq.get(key) || 0) + 1);
            }
            if (p.category) {
                const c = toText(p.category);
                if (c) freq.set(c, (freq.get(c) || 0) + 1);
            }
        }

        auto = [...freq.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([k]) => k);
    } catch {
        auto = [];
    }

    const seen = new Set();
    const out = [];
    for (const term of [...base, ...auto]) {
        const v = toText(term);
        if (!v) continue;
        const k = v.toLowerCase();
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(v);
        if (out.length >= limit) break;
    }
    return out;
}

/** ✅ scoring */
function scoreAction(action, q) {
    const s = String(q || "").toLowerCase();
    const label = (action.label || "").toLowerCase();
    const hint = (action.hint || "").toLowerCase();
    const keys = (action.keywords || "").toLowerCase();
    const hay = `${label} ${hint} ${keys}`;

    let score = 0;

    if (label.startsWith(s)) score += 60;
    if (hint.startsWith(s)) score += 30;
    if (hay.includes(s)) score += 15;

    const safe = escapeRegExp(s);
    if (safe && new RegExp(`\\b${safe}`, "i").test(hay)) score += 10;

    if (action.id?.startsWith("page:")) score += 4;
    if (action.id?.startsWith("sec:")) score += 3;

    return score;
}

export function filterActions(actions, query) {
    const q = String(query || "").trim();
    if (!q) return actions;

    return actions
        .map((a) => ({ a, score: scoreAction(a, q) }))
        .filter((x) => x.score > 0)
        .sort((x, y) => y.score - x.score)
        .map((x) => x.a);
}

export function runAction(action, { router, pathname } = {}) {
    if (!action) return;

    const isHome = pathname === "/";

    if (action.kind === "section") {
        const id = action.sectionId || "home";
        if (isHome) {
            scrollToId(id);
            return;
        }
        router?.push(`/#${id}`);
        return;
    }

    if (action.kind === "route") {
        router?.push(action.href || "/");
    }
}
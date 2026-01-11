// // export const runtime = "nodejs";
// // export const dynamic = "force-dynamic";

// // import { NextResponse } from "next/server";
// // import { searchProjects } from "@/lib/projectSearch";

// // function parseTagsParam(v) {
// //     const s = String(v || "").trim();
// //     if (!s) return [];
// //     return s.split(",").map((x) => x.trim()).filter(Boolean);
// // }

// // export async function GET(req) {
// //     try {
// //         const { searchParams } = new URL(req.url);

// //         const q = searchParams.get("q") || "";
// //         const tags = parseTagsParam(searchParams.get("tags"));
// //         const limit = Number(searchParams.get("limit") || "50");

// //         const data = searchProjects({ q, tags, limit });

// //         return NextResponse.json({ ok: true, ...data });
// //     } catch (e) {
// //         console.error("search api error:", e);
// //         return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
// //     }
// // }





// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// import { NextResponse } from "next/server";
// import { projects } from "@/data/projects";
// import { normalizeTags } from "@/lib/tags";

// const EXTRA_CHIPS = ["MERN", "Node.js", "Express.js", "MongoDB"];

// function normText(s) {
//     return String(s || "")
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, " ")
//         .replace(/\s+/g, " ")
//         .trim();
// }

// function levenshtein(a, b) {
//     if (a === b) return 0;
//     if (!a) return b.length;
//     if (!b) return a.length;

//     const m = a.length;
//     const n = b.length;
//     const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

//     for (let i = 0; i <= m; i++) dp[i][0] = i;
//     for (let j = 0; j <= n; j++) dp[0][j] = j;

//     for (let i = 1; i <= m; i++) {
//         for (let j = 1; j <= n; j++) {
//             const cost = a[i - 1] === b[j - 1] ? 0 : 1;
//             dp[i][j] = Math.min(
//                 dp[i - 1][j] + 1,
//                 dp[i][j - 1] + 1,
//                 dp[i - 1][j - 1] + cost
//             );
//         }
//     }
//     return dp[m][n];
// }

// function fuzzyTokenMatch(token, candidate) {
//     if (!token || !candidate) return false;
//     if (token === candidate) return true;

//     if (
//         token.length >= 3 &&
//         (candidate.startsWith(token) || token.startsWith(candidate))
//     ) {
//         return true;
//     }

//     const max = token.length <= 4 ? 1 : 2;
//     return levenshtein(token, candidate) <= max;
// }

// function queryAsKnownTag(q, knownTagSet) {
//     const guess = normalizeTags([q])[0];
//     if (!guess) return null;
//     return knownTagSet.has(guess) ? guess : null;
// }

// // Optional: MERN meaning (safe default mapping)
// function expandSpecialTag(tag) {
//     const t = String(tag || "").toLowerCase();
//     if (t === "mern") return ["MongoDB", "Express.js", "React.js", "Node.js"];
//     if (t === "node.js" || t === "nodejs") return ["Node.js"];
//     if (t === "express.js" || t === "express") return ["Express.js"];
//     if (t === "mongodb") return ["MongoDB"];
//     return [tag];
// }

// export async function GET(req) {
//     try {
//         const { searchParams } = new URL(req.url);

//         const qRaw = String(searchParams.get("q") || "").trim();
//         const limit = Math.min(Number(searchParams.get("limit") || 50) || 50, 100);

//         const tagsRaw = String(searchParams.get("tags") || "").trim();
//         const selectedTags = tagsRaw
//             ? tagsRaw
//                 .split(",")
//                 .map((x) => x.trim())
//                 .filter(Boolean)
//             : [];

//         // facets tags
//         const tagSet = new Set();
//         for (const p of projects) {
//             for (const t of p.tags || []) tagSet.add(t);
//         }
//         EXTRA_CHIPS.forEach((x) => tagSet.add(x));

//         const knownTagSet = new Set(Array.from(tagSet));

//         let out = projects;

//         // 1) tags filter (AND) - supports MERN mapping if user clicked special chip
//         if (selectedTags.length) {
//             const expanded = selectedTags.flatMap(expandSpecialTag);

//             out = out.filter((p) => {
//                 const ptags = p.tags || [];
//                 // AND: every selected tag must be satisfied (or any of expanded? -> keep strict)
//                 return expanded.every((t) => ptags.includes(t) || ptags.includes(normalizeTags([t])[0]));
//             });
//         }

//         // 2) search
//         if (qRaw) {
//             const tagHit = queryAsKnownTag(qRaw, knownTagSet);

//             // unknown single letter => 0 results
//             if (!tagHit && qRaw.length < 2) {
//                 return NextResponse.json({
//                     ok: true,
//                     results: [],
//                     facets: { tags: ["All", ...Array.from(tagSet).sort()] },
//                     suggestions: [],
//                 });
//             }

//             // if query matches a known tag => TAG ONLY match
//             if (tagHit) {
//                 out = out.filter((p) => (p.tags || []).includes(tagHit));
//             } else {
//                 const qNorm = normText(qRaw);
//                 const tokens = qNorm.split(" ").filter((t) => t.length >= 2);

//                 if (tokens.length === 0) {
//                     out = [];
//                 } else {
//                     out = out.filter((p) => {
//                         const title = normText(p.title || "");
//                         const desc = normText(p.description || "");
//                         const hay = `${title} ${desc}`.trim();

//                         const pTagKeys = (p.tags || []).map((t) => normText(t));

//                         return tokens.every((tok) => {
//                             if (hay.includes(tok)) return true;

//                             for (const k of pTagKeys) {
//                                 if (fuzzyTokenMatch(tok, k)) return true;
//                             }
//                             return false;
//                         });
//                     });
//                 }
//             }
//         }

//         // suggestions (tags + top titles)
//         const titleSug = out
//             .slice(0, 12)
//             .map((p) => p.title)
//             .filter(Boolean);

//         const tagsFacet = ["All", ...Array.from(tagSet).filter((x) => x !== "All")];

//         return NextResponse.json({
//             ok: true,
//             results: out.slice(0, limit),
//             facets: { tags: tagsFacet },
//             suggestions: titleSug,
//         });
//     } catch (e) {
//         console.error(e);
//         return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
//     }
// }







// import { NextResponse } from "next/server";
// import { projects } from "@/data/projects";
// import { normalizeTags } from "@/lib/tags";

// // ✅ always fresh results (no caching surprises)
// export const dynamic = "force-dynamic";

// /* ---------------- utils ---------------- */

// const EXTRA_CHIPS = ["MERN", "Node.js", "Express.js", "MongoDB"];

// function clampInt(v, min, max, fallback) {
//     const n = Number.parseInt(String(v ?? ""), 10);
//     if (Number.isNaN(n)) return fallback;
//     return Math.max(min, Math.min(max, n));
// }

// function normText(s) {
//     return String(s || "")
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, " ")
//         .replace(/\s+/g, " ")
//         .trim();
// }

// function tagKey(s) {
//     return normText(s);
// }

// function levenshtein(a, b) {
//     if (a === b) return 0;
//     if (!a) return b.length;
//     if (!b) return a.length;

//     const m = a.length;
//     const n = b.length;
//     const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

//     for (let i = 0; i <= m; i++) dp[i][0] = i;
//     for (let j = 0; j <= n; j++) dp[0][j] = j;

//     for (let i = 1; i <= m; i++) {
//         for (let j = 1; j <= n; j++) {
//             const cost = a[i - 1] === b[j - 1] ? 0 : 1;
//             dp[i][j] = Math.min(
//                 dp[i - 1][j] + 1,
//                 dp[i][j - 1] + 1,
//                 dp[i - 1][j - 1] + cost
//             );
//         }
//     }
//     return dp[m][n];
// }

// function fuzzyTokenMatch(token, candidate) {
//     if (!token || !candidate) return false;
//     if (token === candidate) return true;

//     // prefix match: "tailwind" -> "tailwind css" , "next" -> "next js"
//     if (
//         token.length >= 3 &&
//         (candidate.startsWith(token) || token.startsWith(candidate))
//     ) {
//         return true;
//     }

//     // typo tolerance
//     const max = token.length <= 4 ? 1 : 2;
//     return levenshtein(token, candidate) <= max;
// }

// /**
//  * ✅ Query ko known tag treat karo ONLY if actually tags list me present ho
//  * So "css" won't accidentally match "tailwind css" unless user typed that exact tag.
//  */
// function queryAsKnownTag(q, knownTagSet) {
//     const guess = normalizeTags([q])[0]; // uses your canonical tag rules
//     if (!guess) return null;
//     return knownTagSet.has(guess) ? guess : null;
// }

// /* ---------------- handler ---------------- */

// export async function GET(req) {
//     try {
//         const { searchParams } = new URL(req.url);

//         const qRaw = (searchParams.get("q") || "").trim();
//         const tagsRaw = (searchParams.get("tags") || "").trim();
//         const limit = clampInt(searchParams.get("limit"), 1, 200, 50);

//         // tags[] (multi select)
//         const selectedTags = tagsRaw
//             ? tagsRaw
//                 .split(",")
//                 .map((t) => t.trim())
//                 .filter(Boolean)
//             : [];

//         // ✅ all tags + frequencies (for better ordering in chips/suggestions)
//         const freq = new Map();
//         for (const p of projects) {
//             for (const t of p.tags || []) {
//                 freq.set(t, (freq.get(t) || 0) + 1);
//             }
//         }
//         for (const t of EXTRA_CHIPS) {
//             if (!freq.has(t)) freq.set(t, 0);
//         }

//         // ✅ facets.tags as strings (component compatible)
//         const facetTags = ["All"]
//             .concat(
//                 Array.from(freq.keys()).sort((a, b) => {
//                     const fa = freq.get(a) || 0;
//                     const fb = freq.get(b) || 0;
//                     if (fb !== fa) return fb - fa; // frequency desc
//                     return String(a).localeCompare(String(b));
//                 })
//             )
//             // remove duplicates just in case
//             .filter((v, i, arr) => arr.indexOf(v) === i);

//         const knownTagSet = new Set(facetTags.filter((t) => t && t !== "All"));

//         // ✅ base list
//         let out = projects;

//         // 1) Chip filter (AND)
//         if (selectedTags.length > 0) {
//             out = out.filter((p) =>
//                 selectedTags.every((t) => (p.tags || []).includes(t))
//             );
//         }

//         // 2) Search
//         if (qRaw) {
//             const tagHit = queryAsKnownTag(qRaw, knownTagSet);

//             // ✅ random 1-letter / nonsense => ZERO results (your requirement)
//             if (!tagHit && qRaw.length < 2) {
//                 return NextResponse.json(
//                     {
//                         ok: true,
//                         results: [],
//                         facets: { tags: facetTags },
//                         meta: { q: qRaw, tags: selectedTags, reason: "short_query" },
//                     },
//                     { status: 200 }
//                 );
//             }

//             // ✅ if query is known tag => TAG-ONLY (prevents CSS matching Tailwind CSS)
//             if (tagHit) {
//                 out = out.filter((p) => (p.tags || []).includes(tagHit));
//             } else {
//                 const qNorm = normText(qRaw);
//                 const tokens = qNorm.split(" ").filter((t) => t.length >= 2);

//                 // ✅ no valid tokens => ZERO results
//                 if (tokens.length === 0) {
//                     return NextResponse.json(
//                         {
//                             ok: true,
//                             results: [],
//                             facets: { tags: facetTags },
//                             meta: { q: qRaw, tags: selectedTags, reason: "no_tokens" },
//                         },
//                         { status: 200 }
//                     );
//                 }

//                 out = out.filter((p) => {
//                     const title = normText(p.title || "");
//                     const desc = normText(p.description || "");
//                     const hay = `${title} ${desc}`.trim();
//                     const pTagKeys = (p.tags || []).map(tagKey);

//                     // ✅ AND across tokens (pro accuracy)
//                     return tokens.every((tok) => {
//                         // title/desc contains token
//                         if (hay.includes(tok)) return true;

//                         // fuzzy tag match
//                         for (const k of pTagKeys) {
//                             if (fuzzyTokenMatch(tok, k)) return true;
//                         }

//                         return false;
//                     });
//                 });
//             }
//         }

//         // ✅ stable sort: best relevance-ish
//         // (tag-only hits naturally filter; otherwise small boost if query in title)
//         if (qRaw && out.length > 1) {
//             const qn = normText(qRaw);
//             out = out
//                 .map((p) => {
//                     const title = normText(p.title || "");
//                     let score = 0;
//                     if (qn && title.includes(qn)) score += 5;
//                     return { p, score };
//                 })
//                 .sort((a, b) => b.score - a.score)
//                 .map((x) => x.p);
//         }

//         // ✅ limit
//         const results = out.slice(0, limit);

//         return NextResponse.json(
//             {
//                 ok: true,
//                 results,
//                 facets: { tags: facetTags },
//                 meta: {
//                     q: qRaw,
//                     tags: selectedTags,
//                     total: out.length,
//                     returned: results.length,
//                     limit,
//                 },
//             },
//             { status: 200 }
//         );
//     } catch (e) {
//         return NextResponse.json(
//             { ok: false, results: [], facets: { tags: ["All"] } },
//             { status: 200 }
//         );
//     }
// }













import { NextResponse } from "next/server";
import { projects, normalizeSlug } from "@/data/projects";
import { normalizeTags } from "@/lib/tags";

// ✅ always fresh results
export const dynamic = "force-dynamic";

/* ------------------ EXTRA chips (always show) ------------------ */
const EXTRA_CHIPS = ["MERN", "Node.js", "Express.js", "MongoDB"];

/* ------------------ utils ------------------ */
function clampInt(v, min, max, fallback) {
    const n = Number.parseInt(String(v ?? ""), 10);
    if (Number.isNaN(n)) return fallback;
    return Math.max(min, Math.min(max, n));
}

function normText(s) {
    return String(s || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function tagKey(s) {
    return normText(s);
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

    // prefix match (good for "tailwind" -> "tailwind css", "next" -> "next js")
    if (
        token.length >= 3 &&
        (candidate.startsWith(token) || token.startsWith(candidate))
    ) {
        return true;
    }

    const max = token.length <= 4 ? 1 : 2;
    return levenshtein(token, candidate) <= max;
}

/** flatten all strings from a nested object (projectDetail etc) */
function collectStringsDeep(node, out, depth = 0) {
    if (!node || depth > 6) return;
    if (typeof node === "string") {
        const t = node.trim();
        if (t) out.push(t);
        return;
    }
    if (typeof node === "number" || typeof node === "boolean") return;

    if (Array.isArray(node)) {
        for (const item of node) collectStringsDeep(item, out, depth + 1);
        return;
    }

    if (typeof node === "object") {
        for (const k of Object.keys(node)) {
            collectStringsDeep(node[k], out, depth + 1);
        }
    }
}

/** try reading projectDetail.js in a "safe" way */
function loadProjectDetailMap() {
    try {
        // eslint-disable-next-line import/no-unresolved
        // (This file exists in your repo: src/data/projectDetail.js)
        // We import dynamically so build stays safe even if structure changes.
        // NOTE: In Next route, dynamic import is allowed.
        return import("@/data/projectDetails").then((mod) => {
            const candidates = [
                mod.projectDetailsBySlug,
                mod.projectDetails,
                mod.projectDetailMap,
                mod.projectDetail,
                mod.default,
            ].filter(Boolean);

            let data = candidates[0] ?? null;

            // if nothing found, maybe module itself is object map
            if (!data && mod && typeof mod === "object") data = mod;

            const map = {};

            // map form: { slug: {...} }
            if (data && !Array.isArray(data) && typeof data === "object") {
                for (const [k, v] of Object.entries(data)) {
                    const key = normalizeSlug(k);
                    map[key] = v;
                }
                return map;
            }

            // array form: [{slug, ...}, ...]
            if (Array.isArray(data)) {
                for (const item of data) {
                    const s = normalizeSlug(item?.slug || item?.id || item?.title || "");
                    if (s) map[s] = item;
                }
                return map;
            }

            return {};
        });
    } catch {
        return Promise.resolve({});
    }
}

/** ✅ Query ko known tag treat karo ONLY if actually list me present ho */
function queryAsKnownTag(q, knownTagSet) {
    const variants = [
        q,
        q.replace(/[-_]+/g, " "),
        q.replace(/([a-z])([A-Z])/g, "$1 $2"),
        q.replace(/css$/i, " css"),
        q.replace(/js$/i, " js"),
    ];

    for (const v of variants) {
        const guess = normalizeTags([v])[0];
        if (guess && knownTagSet.has(guess)) return guess;
    }
    return null;
}

/** expand query into smart tokens (tailwindcss => tailwind + css) */
function buildQueryTokens(raw) {
    const base = normText(raw);
    if (!base) return [];

    // collapse forms too
    const compact = base.replace(/\s+/g, "");
    const add = [];

    // common combos
    if (compact.includes("tailwindcss")) add.push("tailwind", "css");
    if (compact.includes("nextjs")) add.push("next", "js");
    if (compact.includes("reactjs")) add.push("react", "js");
    if (compact === "js") add.push("javascript");

    const tokens = base.split(" ").filter((t) => t.length >= 2);
    for (const t of add) tokens.push(t);

    // unique
    return Array.from(new Set(tokens));
}

/* ------------------ handler ------------------ */
export async function GET(req) {
    const t0 = Date.now();
    try {
        const { searchParams } = new URL(req.url);

        const qRaw = (searchParams.get("q") || "").trim();
        const tagsRaw = (searchParams.get("tags") || "").trim();
        const limit = clampInt(searchParams.get("limit"), 1, 200, 50);

        // ✅ selected tags (canonical)
        let selectedTags = tagsRaw
            ? tagsRaw
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [];

        selectedTags = normalizeTags(selectedTags);

        /* ---------- facets (tags + counts) ---------- */
        const tagCounts = new Map();
        for (const p of projects) {
            for (const t of p.tags || []) {
                tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
            }
        }
        // ensure extras exist
        for (const t of EXTRA_CHIPS) {
            if (!tagCounts.has(t)) tagCounts.set(t, 0);
        }

        // sort tags by count desc, then alpha
        const facetTags = ["All"].concat(
            Array.from(tagCounts.keys()).sort((a, b) => {
                const fa = tagCounts.get(a) || 0;
                const fb = tagCounts.get(b) || 0;
                if (fb !== fa) return fb - fa;
                return String(a).localeCompare(String(b));
            })
        );

        const knownTagSet = new Set(facetTags.filter((t) => t && t !== "All"));

        // keep only valid known tags
        selectedTags = selectedTags.filter((t) => knownTagSet.has(t));

        /* ---------- load detail index (projectDetail.js) ---------- */
        const detailMap = await loadProjectDetailMap();

        // pre-index each project (small data, safe)
        const indexed = projects.map((p) => {
            const detail = detailMap[normalizeSlug(p.slug)] || null;

            const texts = [];
            if (detail) collectStringsDeep(detail, texts);

            const titleN = normText(p.title || "");
            const descN = normText(p.description || "");
            const detailN = normText(texts.join(" "));
            const tagKeys = (p.tags || []).map(tagKey);

            return {
                p,
                idx: {
                    titleN,
                    descN,
                    detailN,
                    tagKeys,
                },
            };
        });

        /* ---------- 1) chip filter (AND) ---------- */
        let pool = indexed;

        if (selectedTags.length > 0) {
            pool = pool.filter(({ p }) =>
                selectedTags.every((t) => (p.tags || []).includes(t))
            );
        }

        /* ---------- 2) search ---------- */
        let results = pool;

        if (qRaw) {
            const tagHit = queryAsKnownTag(qRaw, knownTagSet);

            // ✅ random 1-letter / nonsense => 0
            if (!tagHit && qRaw.length < 2) {
                return NextResponse.json(
                    {
                        ok: true,
                        results: [],
                        facets: {
                            tags: facetTags,
                            tagCounts: Object.fromEntries(tagCounts),
                        },
                        suggestions: { tags: [], projects: [] },
                        meta: { q: qRaw, tags: selectedTags, reason: "short_query" },
                        timingMs: Date.now() - t0,
                    },
                    { status: 200 }
                );
            }

            // ✅ if query is a known tag => TAG-ONLY (CSS != Tailwind CSS)
            if (tagHit) {
                results = results.filter(({ p }) => (p.tags || []).includes(tagHit));
            } else {
                const tokens = buildQueryTokens(qRaw);
                if (!tokens.length) {
                    return NextResponse.json(
                        {
                            ok: true,
                            results: [],
                            facets: {
                                tags: facetTags,
                                tagCounts: Object.fromEntries(tagCounts),
                            },
                            suggestions: { tags: [], projects: [] },
                            meta: { q: qRaw, tags: selectedTags, reason: "no_tokens" },
                            timingMs: Date.now() - t0,
                        },
                        { status: 200 }
                    );
                }

                results = results
                    .map(({ p, idx }) => {
                        // scoring (pro-level)
                        let score = 0;

                        for (const tok of tokens) {
                            const inTitle = idx.titleN.includes(tok);
                            const inDesc = idx.descN.includes(tok);
                            const inDetail = idx.detailN.includes(tok);

                            if (inTitle) score += 8;
                            else if (inDesc) score += 4;
                            else if (inDetail) score += 2;

                            // fuzzy tags boost
                            for (const k of idx.tagKeys) {
                                if (fuzzyTokenMatch(tok, k)) {
                                    score += 6;
                                    break;
                                }
                            }
                        }

                        return { p, score, idx };
                    })
                    // strict AND: every token must match somewhere (title/desc/detail/tags)
                    .filter(({ idx }) => {
                        const hay = `${idx.titleN} ${idx.descN} ${idx.detailN}`.trim();
                        return buildQueryTokens(qRaw).every((tok) => {
                            if (hay.includes(tok)) return true;
                            for (const k of idx.tagKeys) {
                                if (fuzzyTokenMatch(tok, k)) return true;
                            }
                            return false;
                        });
                    })
                    .sort((a, b) => b.score - a.score);
            }
        }

        const picked = results.slice(0, limit).map((r) => r.p);

        /* ---------- suggestions (backend-driven) ---------- */
        // tags suggestions: match query (contains or fuzzy)
        const suggestTags = (() => {
            const base = facetTags.filter((t) => t && t !== "All");
            if (!qRaw) return base.slice(0, 8);

            const qn = normText(qRaw);
            const toks = buildQueryTokens(qRaw);

            return base
                .map((t) => {
                    const k = tagKey(t);
                    let s = 0;
                    if (k.includes(qn)) s += 10;
                    for (const tok of toks) {
                        if (k.includes(tok)) s += 6;
                        if (fuzzyTokenMatch(tok, k)) s += 4;
                    }
                    // popularity boost
                    s += Math.min(3, (tagCounts.get(t) || 0) / 3);
                    return { t, s };
                })
                .filter((x) => x.s > 0)
                .sort((a, b) => b.s - a.s)
                .slice(0, 8)
                .map((x) => x.t);
        })();

        // project title suggestions (optional future UI)
        const suggestProjects = (() => {
            if (!qRaw) return [];
            const qn = normText(qRaw);
            return projects
                .map((p) => {
                    const tn = normText(p.title || "");
                    let s = 0;
                    if (tn.includes(qn)) s += 10;
                    return { title: p.title, slug: p.slug, s };
                })
                .filter((x) => x.s > 0)
                .sort((a, b) => b.s - a.s)
                .slice(0, 6)
                .map((x) => x.title);
        })();

        return NextResponse.json(
            {
                ok: true,
                results: picked,
                facets: {
                    tags: facetTags,
                    tagCounts: Object.fromEntries(tagCounts),
                },
                suggestions: {
                    tags: suggestTags,
                    projects: suggestProjects,
                },
                meta: {
                    q: qRaw,
                    tags: selectedTags,
                    total: results.length,
                    returned: picked.length,
                    limit,
                },
                timingMs: Date.now() - t0,
            },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            {
                ok: false,
                results: [],
                facets: { tags: ["All"], tagCounts: {} },
                suggestions: { tags: [], projects: [] },
                timingMs: Date.now() - t0,
            },
            { status: 200 }
        );
    }
}
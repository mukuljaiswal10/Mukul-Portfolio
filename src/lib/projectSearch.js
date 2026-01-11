import { projects } from "@/data/projects";
import { projectDetails } from "@/data/projectDetails"; // ⚠️ if your export name differs, adjust
import { normalizeTags } from "@/lib/tags";

/* ---------- normalize helpers ---------- */
function normText(s) {
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

function fuzzyTokenMatch(tok, candidate) {
    if (!tok || !candidate) return false;
    if (tok === candidate) return true;

    if (tok.length >= 3 && (candidate.startsWith(tok) || tok.startsWith(candidate))) return true;

    const max = tok.length <= 4 ? 1 : 2;
    return levenshtein(tok, candidate) <= max;
}

/* ---------- build dynamic searchable index ---------- */
function buildDetailMap() {
    // projectDetail.js me slug key map बना लो (future-proof)
    const map = new Map();
    const arr = Array.isArray(projectDetails) ? projectDetails : [];
    for (const d of arr) {
        const slug = String(d?.slug || "").trim();
        if (slug) map.set(slug, d);
    }
    return map;
}

export function getAllTagsFacet() {
    const set = new Set();
    projects.forEach((p) => {
        const tags = normalizeTags(p.tags || []);
        tags.forEach((t) => set.add(t));
    });

    // ✅ add professional tags always (if you want fixed chips)
    ["MERN", "Node.js", "Express.js", "MongoDB"].forEach((t) => set.add(t));

    return ["All", ...Array.from(set)];
}

/**
 * ✅ Main backend search
 * - q: search text
 * - tags: array of selected tags (AND)
 */
export function searchProjects({ q = "", tags = [], limit = 50 }) {
    const detailMap = buildDetailMap();

    const query = String(q || "").trim();
    const qNorm = normText(query);
    const tokens = qNorm ? qNorm.split(" ").filter(Boolean) : [];

    const activeTags = (Array.isArray(tags) ? tags : [])
        .map((t) => String(t || "").trim())
        .filter(Boolean);

    const normalizedActiveTags = normalizeTags(activeTags);
    const hasTagFilter = normalizedActiveTags.length > 0;

    const out = [];
    for (const p of projects) {
        const pTags = normalizeTags(p.tags || []);
        const pTagKeys = pTags.map(normText);

        // ✅ tag filter (AND)
        if (hasTagFilter) {
            const ok = normalizedActiveTags.every((t) => pTags.includes(t));
            if (!ok) continue;
        }

        // ✅ query empty => include (after tag filter)
        if (!tokens.length) {
            out.push({ score: 1, p });
            continue;
        }

        // ✅ combine more searchable text (detail data too)
        const d = detailMap.get(p.slug);
        const extra =
            normText(d?.overview) +
            " " +
            normText(d?.problem) +
            " " +
            normText(d?.solution) +
            " " +
            normText((d?.features || []).join(" ")) +
            " " +
            normText((d?.stack || []).join(" "));

        const title = normText(p.title);
        const desc = normText(p.description);
        const hay = `${title} ${desc} ${extra}`.trim();

        // ✅ strict: if token doesn't match anywhere => reject
        let score = 0;
        let matchedAll = true;

        for (const tok of tokens) {
            let matched = false;

            // exact / substring in text
            if (hay.includes(tok)) {
                matched = true;
                score += title.includes(tok) ? 40 : 18;
            }

            // tag fuzzy match (typo + tailwindcss / nextjs)
            if (!matched) {
                for (const tk of pTagKeys) {
                    if (tk === tok) {
                        matched = true;
                        score += 55; // exact tag
                        break;
                    }
                    if (fuzzyTokenMatch(tok, tk)) {
                        matched = true;
                        score += 26;
                        break;
                    }
                }
            }

            if (!matched) {
                matchedAll = false;
                break;
            }
        }

        if (!matchedAll) continue;

        // bonus if query matches multiple tags
        score += Math.min(20, pTags.length);

        out.push({ score, p });
    }

    out.sort((a, b) => b.score - a.score);

    const results = out.slice(0, Math.max(1, Number(limit) || 50)).map((x) => x.p);

    return {
        results,
        facets: {
            tags: getAllTagsFacet(),
        },
    };
}
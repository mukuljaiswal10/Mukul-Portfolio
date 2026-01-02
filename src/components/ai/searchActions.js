// src/components/ai/searchActions.js
import { SEARCH_MANIFEST } from "@/components/ai/searchManifest";

/* ---------------- utils ---------------- */
const MAX_RESULTS_DEFAULT = 14;

const normalize = (s = "") =>
    String(s || "")
        .trim()
        .toLowerCase()
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9\s./#-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const tokenize = (s = "") => normalize(s).split(" ").filter(Boolean);

function escapeRegExp(str) {
    return String(str || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Levenshtein distance with early exit (cap)
 * cap=2 means we allow small typos only
 */
function levenshteinCap(a, b, cap = 2) {
    a = String(a || "");
    b = String(b || "");
    if (a === b) return 0;
    if (!a || !b) return Math.max(a.length, b.length);

    const la = a.length;
    const lb = b.length;
    if (Math.abs(la - lb) > cap) return cap + 1;

    let prev = Array(lb + 1).fill(0);
    let cur = Array(lb + 1).fill(0);

    for (let j = 0; j <= lb; j++) prev[j] = j;

    for (let i = 1; i <= la; i++) {
        cur[0] = i;
        let rowMin = cur[0];

        const ca = a.charCodeAt(i - 1);

        for (let j = 1; j <= lb; j++) {
            const cb = b.charCodeAt(j - 1);
            const cost = ca === cb ? 0 : 1;

            cur[j] = Math.min(
                prev[j] + 1, // delete
                cur[j - 1] + 1, // insert
                prev[j - 1] + cost // replace
            );

            rowMin = Math.min(rowMin, cur[j]);
        }

        if (rowMin > cap) return cap + 1;

        const tmp = prev;
        prev = cur;
        cur = tmp;
    }

    return prev[lb];
}

/* ---------------- manifest -> actions ---------------- */
function buildActions() {
    const m = SEARCH_MANIFEST || {};

    const pages = (m.pages || []).map((p) => ({
        id: `page:${p.id}`,
        kind: "page",
        label: p.label,
        hint: p.href,
        href: p.href,
        keywords: Array.isArray(p.keywords) ? p.keywords : [],
        tags: [],
        boost: 1.0,
    }));

    const sections = (m.sections || []).map((s) => ({
        id: `section:${s.id}`,
        kind: "section",
        label: `Go: ${s.label}`,
        hint: s.href,
        href: s.href,
        keywords: Array.isArray(s.keywords) ? s.keywords : [],
        tags: [],
        boost: 0.9,
    }));

    const projects = (m.projects || []).map((p) => ({
        id: `project:${p.id}`,
        kind: "project",
        label: p.label,
        hint: p.hint || "Project",
        href: p.href,
        keywords: Array.isArray(p.keywords) ? p.keywords : [],
        // ✅ normalize tags so "Tailwind" === "tailwind"
        tags: (Array.isArray(p.tags) ? p.tags : []).map((t) => normalize(t)).filter(Boolean),
        boost: 1.35,
    }));

    const blogs = (m.blogs || []).map((b) => ({
        id: `blog:${b.id}`,
        kind: "blog",
        label: b.label,
        hint: b.hint || "Blog",
        href: b.href,
        keywords: Array.isArray(b.keywords) ? b.keywords : [],
        tags: (Array.isArray(b.tags) ? b.tags : []).map((t) => normalize(t)).filter(Boolean),
        boost: 1.15,
    }));

    // tags are NOT navigation items by default; we use them for boosting
    const tags = (m.tags || []).map((t) => normalize(t)).filter(Boolean);

    return { actions: [...pages, ...sections, ...projects, ...blogs], tags };
}

/* ---------------- scoring ---------------- */
function calcScore(qTokens, item) {
    const label = String(item?.label || "");
    const hint = String(item?.hint || "");
    const href = String(item?.href || "");

    const labelN = normalize(label);
    const hintN = normalize(hint);
    const hrefN = normalize(href);

    const itemTags = (Array.isArray(item?.tags) ? item.tags : []).map(normalize).filter(Boolean);
    const itemKeywords = (Array.isArray(item?.keywords) ? item.keywords : []).map(normalize).filter(Boolean);

    const tagsText = itemTags.join(" ");
    const keysText = itemKeywords.join(" ");
    const hay = `${labelN} ${hintN} ${hrefN} ${tagsText} ${keysText}`;

    const q = qTokens.join(" ");
    if (!q) return 0;

    // ✅ exact label match (Furniture -> top)
    if (labelN === q) return 1000 * (item?.boost || 1);

    // exact href match
    if (hrefN === q) return 900 * (item?.boost || 1);

    // startsWith label
    if (labelN.startsWith(q)) return 650 * (item?.boost || 1);

    let score = 0;

    for (const qt of qTokens) {
        if (!qt) continue;

        // strong signals
        if (labelN.includes(qt)) score += 90;
        else if (tagsText.includes(qt)) score += 80; // ✅ tags match strong
        else if (keysText.includes(qt)) score += 60; // ✅ keywords match
        else if (hay.includes(qt)) score += 25;

        // fuzzy on label words
        const words = labelN.split(" ").filter(Boolean);
        for (const w of words) {
            const dist = levenshteinCap(qt, w, 2);
            if (dist <= 1) score += 10;
        }
    }

    score *= item?.boost || 1;

    if (item?.kind === "page") score *= 1.05;

    return score;
}

/* ---------------- highlight ---------------- */
/**
 * ✅ exported helper for StickyNavSearch highlightNode()
 * returns { before, match, after }
 */
export function highlightParts(text, query) {
    const raw = String(text || "");
    const qTokens = tokenize(query || "").filter((t) => t.length >= 2);
    if (!qTokens.length) return { before: raw, match: "", after: "" };

    const low = raw.toLowerCase();

    // pick first token that exists in text
    for (const tok of qTokens) {
        const idx = low.indexOf(tok);
        if (idx !== -1) {
            return {
                before: raw.slice(0, idx),
                match: raw.slice(idx, idx + tok.length),
                after: raw.slice(idx + tok.length),
            };
        }
    }

    return { before: raw, match: "", after: "" };
}

// optional: list highlight (if you want later)
function getHighlightPartsArray(label, qTokens) {
    const raw = String(label || "");
    const tokens = [...new Set(qTokens.filter((t) => t.length >= 2))];
    if (!tokens.length) return [{ text: raw, hit: false }];

    let ranges = [];
    const low = raw.toLowerCase();

    for (const t of tokens) {
        const re = new RegExp(escapeRegExp(t), "ig");
        let m;
        while ((m = re.exec(low))) {
            ranges.push([m.index, m.index + m[0].length]);
        }
    }

    if (!ranges.length) return [{ text: raw, hit: false }];

    ranges.sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const r of ranges) {
        if (!merged.length || r[0] > merged[merged.length - 1][1]) merged.push(r);
        else merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], r[1]);
    }

    const parts = [];
    let last = 0;
    for (const [s, e] of merged) {
        if (s > last) parts.push({ text: raw.slice(last, s), hit: false });
        parts.push({ text: raw.slice(s, e), hit: true });
        last = e;
    }
    if (last < raw.length) parts.push({ text: raw.slice(last), hit: false });

    return parts;
}

/* ---------------- public API ---------------- */

export function getSearchActions() {
    const { actions, tags } = buildActions();
    return { actions, tags };
}

/**
 * ✅ filterActions:
 * - safe input (array/object)
 * - tags/keywords included in scoring
 * - tagHit boosting (tailwind typed => all items having tailwind tag boost)
 */
export function filterActions(actionsInput, query, tagsInput = [], { limit = MAX_RESULTS_DEFAULT } = {}) {
    // ✅ actions ko hamesha array banao
    const list = Array.isArray(actionsInput)
        ? actionsInput
        : Array.isArray(actionsInput?.actions)
            ? actionsInput.actions
            : Array.isArray(actionsInput?.items)
                ? actionsInput.items
                : [];

    const q = normalize(query || "");
    const qTokens = tokenize(q);

    // ✅ tag pool normalize
    const fallbackTags = (SEARCH_MANIFEST?.tags || []).map((t) => normalize(t)).filter(Boolean);
    const knownTags = (Array.isArray(tagsInput) ? tagsInput : []).map((t) => normalize(t)).filter(Boolean);
    const tagPool = knownTags.length ? knownTags : fallbackTags;

    if (!qTokens.length) {
        return list.slice(0, limit).map((a) => ({ ...a, _score: 0, _hl: null }));
    }

    // ✅ tagHit once (exact or 1 typo)
    let tagHit = null;
    for (const t of tagPool) {
        if (t === q) { tagHit = t; break; }
        if (levenshteinCap(q, t, 2) <= 1) { tagHit = t; break; }
    }

    const scored = list
        .map((item) => {
            let score = calcScore(qTokens, item);

            // ✅ if query is a known tag, boost related items strongly
            if (tagHit && (item?.tags || []).map(normalize).includes(tagHit)) {
                score += 180;
            }

            // small intent bonus
            if (tagHit && (item?.kind === "project" || item?.kind === "blog")) score += 20;

            const hl = getHighlightPartsArray(item?.label || "", qTokens);
            return { ...item, _score: score, _hl: hl };
        })
        .filter((x) => x._score > 0)
        .sort((a, b) => b._score - a._score)
        .slice(0, limit);

    return scored;
}

export function getPopularSearches({ limit = 10 } = {}) {
    const tags = (SEARCH_MANIFEST?.tags || []).map((t) => String(t || "").trim()).filter(Boolean);
    return tags.slice(0, limit);
}
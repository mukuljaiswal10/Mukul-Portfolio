import { MICRO_TECH_LINES, SMART_SUGGESTIONS } from "./aiCopy";

const LS_VISITED = "mukul_ai_visited_sections_v1";
const LS_DISMISSED = "mukul_ai_dismissed_v1";

function safeParse(json, fallback) {
    try {
        return JSON.parse(json);
    } catch {
        return fallback;
    }
}

export function getVisitedMap() {
    if (typeof window === "undefined") return {};
    const raw = window.localStorage.getItem(LS_VISITED);
    return raw ? safeParse(raw, {}) : {};
}

export function markVisited(sectionId) {
    if (typeof window === "undefined") return;
    if (!sectionId) return;
    const map = getVisitedMap();
    map[sectionId] = Date.now();
    window.localStorage.setItem(LS_VISITED, JSON.stringify(map));
}

export function isDismissed() {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(LS_DISMISSED) === "1";
}

export function setDismissed(v) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LS_DISMISSED, v ? "1" : "0");
}

function pickWeighted(items) {
    // items: [{weight}]
    const total = items.reduce((s, x) => s + (x.weight || 1), 0);
    const r = Math.random() * (total || 1);
    let acc = 0;
    for (const it of items) {
        acc += it.weight || 1;
        if (r <= acc) return it;
    }
    return items[0];
}

function nowHour() {
    if (typeof window === "undefined") return 12;
    return new Date().getHours();
}

export function buildAIState({ currentSection, pathname }) {
    const visited = getVisitedMap();
    const hour = nowHour();

    // nice “day vibe” labels
    const dayVibe =
        hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    const micro = MICRO_TECH_LINES[Math.floor(Math.random() * MICRO_TECH_LINES.length)];

    // For safety: if section unknown, fallback “home”
    const section = currentSection || "home";

    // Suggestions for current section
    const inSection = SMART_SUGGESTIONS.filter((s) => s.section === section);

    // Boost suggestions that lead user to unvisited sections
    const unvisitedBoosted = inSection.map((s) => {
        const wantsScroll = s?.secondary?.scrollTo || s?.primary?.scrollTo;
        const wantsHref = s?.primary?.href || s?.secondary?.href;

        let boost = 0;

        if (wantsScroll && !visited[wantsScroll]) boost += 4;
        if (wantsHref && typeof wantsHref === "string") {
            // if user never visited projects/skills/contact in this session, add a little
            if (wantsHref.startsWith("/projects") && !visited["projects"]) boost += 4;
            if (wantsHref.startsWith("/skills") && !visited["skills"]) boost += 4;
            if (wantsHref.startsWith("/contact") && !visited["contact"]) boost += 4;
        }

        return { ...s, weight: (s.weight || 1) + boost };
    });

    const picked = pickWeighted(unvisitedBoosted.length ? unvisitedBoosted : SMART_SUGGESTIONS);

    return {
        dayVibe,
        micro,
        suggestion: picked,
        section,
        pathname,
    };
}
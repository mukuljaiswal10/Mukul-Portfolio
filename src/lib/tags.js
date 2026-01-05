// // src/lib/tags.js

// const TAG_ALIASES = {
//     // React / Next
//     reactjs: "React",
//     "react.js": "React",
//     react: "React",

//     nextjs: "Next.js",
//     "next.js": "Next.js",
//     "next js": "Next.js",

//     // Tailwind
//     tailwindcss: "Tailwind",
//     "tailwind-css": "Tailwind",
//     "tailwind css": "Tailwind",
//     tailwind: "Tailwind",

//     // JS
//     javascript: "JavaScript",
//     js: "JavaScript",

//     // jQuery
//     jquery: "jQuery",
//     "j query": "jQuery",

//     // Core
//     bootstrap: "Bootstrap",
//     css: "CSS",
//     html: "HTML",

//     // UI/UX
//     ui: "UI",
//     ux: "UX",
//     "ui/ux": "UI/UX",
//     "ui ux": "UI/UX",

//     // Carousels / libs
//     "owl carousel": "Owl Carousel",
//     owlcarousel: "Owl Carousel",
//     "owl-carousel": "Owl Carousel",
//     carousel: "Carousel",

//     // Backend (optional future)
//     node: "Node.js",
//     nodejs: "Node.js",
//     "node.js": "Node.js",
//     express: "Express",
//     "express js": "Express",
//     "express.js": "Express",
//     mongodb: "MongoDB",
//     mongo: "MongoDB",
//     "mongo db": "MongoDB",

//     // Platforms
//     github: "GitHub",
//     "github api": "GitHub",
// };

// export function normalizeTag(tag) {
//     if (!tag) return "";
//     const raw = String(tag).trim();

//     // make key for alias matching
//     const key = raw
//         .toLowerCase()
//         .replace(/\s+/g, " ")
//         .replace(/_/g, "-")
//         .replace(/\./g, "."); // keep dot forms like node.js

//     return TAG_ALIASES[key] || raw;
// }

// export function normalizeTags(tags = []) {
//     const out = [];
//     const seen = new Set();

//     for (const t of tags) {
//         const nt = normalizeTag(t);
//         if (!nt) continue;

//         const k = nt.toLowerCase();
//         if (!seen.has(k)) {
//             seen.add(k);
//             out.push(nt);
//         }
//     }

//     return out;
// }









// src/lib/tags.js

/**
 * normalizeTags(tags[])
 * - Makes tags consistent (case / hyphen / space / dot)
 * - Adds smart aliases (js -> JavaScript, tailwind-css -> Tailwind CSS)
 * - Optional: auto-add MERN when stack matches
 */

function cleanKey(input) {
    return String(input || "")
        .trim()
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[._]/g, " ")
        .replace(/[-/]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// ✅ Main aliases map (key -> canonical label)
const TAG_ALIASES = new Map([
    // core
    ["html", "HTML"],
    ["html5", "HTML"],
    ["css", "CSS"],
    ["css3", "CSS"],
    ["javascript", "JavaScript"],
    ["java script", "JavaScript"],
    ["js", "JavaScript"],
    ["jquery", "jQuery"],
    ["j query", "jQuery"],

    // frameworks/libs
    ["bootstrap", "Bootstrap"],
    ["tailwind", "Tailwind CSS"],
    ["tailwind css", "Tailwind CSS"],
    ["tailwindcss", "Tailwind CSS"],
    ["tailwind-css", "Tailwind CSS"],

    ["react", "React.js"],
    ["react js", "React.js"],
    ["reactjs", "React.js"],
    ["react.js", "React.js"],

    ["next", "Next.js"],
    ["next js", "Next.js"],
    ["nextjs", "Next.js"],
    ["next.js", "Next.js"],

    // backend
    ["node", "Node.js"],
    ["node js", "Node.js"],
    ["nodejs", "Node.js"],
    ["node.js", "Node.js"],

    ["express", "Express.js"],
    ["express js", "Express.js"],
    ["expressjs", "Express.js"],
    ["express.js", "Express.js"],

    ["mongodb", "MongoDB"],
    ["mongo db", "MongoDB"],
    ["mongo", "MongoDB"],

    // design
    ["figma", "Figma"],

    // stacks
    ["mern", "MERN"],
]);

// ✅ Optional: keep a nice, predictable display order (not mandatory)
const ORDER = [
    "MERN",
    "Next.js",
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Tailwind CSS",
    "Bootstrap",
    "JavaScript",
    "jQuery",
    "HTML",
    "CSS",
    "Figma",
];

function canonicalize(tag) {
    const key = cleanKey(tag);

    // direct alias
    if (TAG_ALIASES.has(key)) return TAG_ALIASES.get(key);

    // fallback: Title-ish (still stable)
    // e.g. "api" -> "Api" (but try to keep user's tag meaningful)
    const pretty = String(tag || "").trim();
    if (!pretty) return null;
    return pretty
        .replace(/\s+/g, " ")
        .split(" ")
        .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
        .join(" ");
}

function sortTags(tags) {
    const idx = new Map(ORDER.map((t, i) => [t, i]));
    return [...tags].sort((a, b) => {
        const ai = idx.has(a) ? idx.get(a) : 9999;
        const bi = idx.has(b) ? idx.get(b) : 9999;
        if (ai !== bi) return ai - bi;
        return a.localeCompare(b);
    });
}

export function normalizeTags(inputTags = []) {
    const out = [];

    for (const t of inputTags || []) {
        const canon = canonicalize(t);
        if (!canon) continue;
        if (!out.includes(canon)) out.push(canon);
    }

    // ✅ Auto-add MERN if full stack present
    const hasReact = out.includes("React.js");
    const hasNode = out.includes("Node.js");
    const hasExpress = out.includes("Express.js");
    const hasMongo = out.includes("MongoDB");

    if (hasReact && hasNode && hasExpress && hasMongo && !out.includes("MERN")) {
        out.unshift("MERN");
    }

    return sortTags(out);
}
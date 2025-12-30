// src/lib/tags.js

const TAG_ALIASES = {
    // React / Next
    reactjs: "React",
    "react.js": "React",
    react: "React",

    nextjs: "Next.js",
    "next.js": "Next.js",
    "next js": "Next.js",

    // Tailwind
    tailwindcss: "Tailwind",
    "tailwind-css": "Tailwind",
    "tailwind css": "Tailwind",
    tailwind: "Tailwind",

    // JS
    javascript: "JavaScript",
    js: "JavaScript",

    // jQuery
    jquery: "jQuery",
    "j query": "jQuery",

    // Core
    bootstrap: "Bootstrap",
    css: "CSS",
    html: "HTML",

    // UI/UX
    ui: "UI",
    ux: "UX",
    "ui/ux": "UI/UX",
    "ui ux": "UI/UX",

    // Carousels / libs
    "owl carousel": "Owl Carousel",
    owlcarousel: "Owl Carousel",
    "owl-carousel": "Owl Carousel",
    carousel: "Carousel",

    // Backend (optional future)
    node: "Node.js",
    nodejs: "Node.js",
    "node.js": "Node.js",
    express: "Express",
    "express js": "Express",
    "express.js": "Express",
    mongodb: "MongoDB",
    mongo: "MongoDB",
    "mongo db": "MongoDB",

    // Platforms
    github: "GitHub",
    "github api": "GitHub",
};

export function normalizeTag(tag) {
    if (!tag) return "";
    const raw = String(tag).trim();

    // make key for alias matching
    const key = raw
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/_/g, "-")
        .replace(/\./g, "."); // keep dot forms like node.js

    return TAG_ALIASES[key] || raw;
}

export function normalizeTags(tags = []) {
    const out = [];
    const seen = new Set();

    for (const t of tags) {
        const nt = normalizeTag(t);
        if (!nt) continue;

        const k = nt.toLowerCase();
        if (!seen.has(k)) {
            seen.add(k);
            out.push(nt);
        }
    }

    return out;
}
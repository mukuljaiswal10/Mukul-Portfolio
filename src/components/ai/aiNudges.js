export const SECTION_NUDGES = {
    home: [
        {
            title: "Quick jump?",
            desc: "Press ⌘K / Ctrl+K to open command palette.",
            cta: { label: "Open palette", action: "palette" },
        },
        {
            title: "Want real builds?",
            desc: "Jump to Projects — real UI + performance work.",
            cta: { label: "Go Projects", action: "goto", target: "projects" },
        },
    ],

    about: [
        {
            title: "Pro tip",
            desc: "Skills section me tech breakdown + stacks visible hain.",
            cta: { label: "Go Skills", action: "goto", target: "skills" },
        },
    ],

    skills: [
        {
            title: "Skill deep dive",
            desc: "⌘K → ‘Skills page’ search karo to full list open ho jayega.",
            cta: { label: "Open Skills page", action: "page", href: "/skills" },
        },
    ],

    projects: [
        {
            title: "Project details",
            desc: "Kisi project pe click karo — same luxury UI detail page open hoga.",
            cta: { label: "See all projects", action: "page", href: "/projects" },
        },
    ],

    testimonials: [
        {
            title: "Trust signal",
            desc: "Real client feedback — swipe/next for more.",
            cta: { label: "Contact now", action: "goto", target: "contact" },
        },
    ],

    faq: [
        {
            title: "Quick answers",
            desc: "Pricing / timeline / scope — yahin clear ho jata hai.",
            cta: { label: "Ask a question", action: "goto", target: "contact" },
        },
    ],

    contact: [
        {
            title: "Let’s build it",
            desc: "Send details — I reply fast.",
            cta: { label: "Send message", action: "goto", target: "contact" },
        },
    ],
};
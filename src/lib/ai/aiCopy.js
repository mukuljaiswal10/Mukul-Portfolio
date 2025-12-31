export const SECTION_META = {
    home: {
        label: "Home",
        desc: "Intro + quick actions",
    },
    about: {
        label: "About",
        desc: "Story + resume",
    },
    skills: {
        label: "Skills",
        desc: "Tech stack",
    },
    projects: {
        label: "Projects",
        desc: "Selected work",
    },
    testimonials: {
        label: "Testimonials",
        desc: "Client feedback",
    },
    faq: {
        label: "FAQs",
        desc: "Quick answers",
    },
    contact: {
        label: "Contact",
        desc: "Message + WhatsApp",
    },
};

/**
 * You can edit these anytime — future me data add karoge to UI auto.
 */
export const SMART_SUGGESTIONS = [
    // HOME
    {
        id: "home_projects",
        section: "home",
        title: "Want proof? Jump to Projects",
        subtitle: "See real builds + UI quality",
        primary: { label: "View Projects", href: "/projects" },
        secondary: { label: "Scroll to Projects", scrollTo: "projects" },
        weight: 10,
    },
    {
        id: "home_contact",
        section: "home",
        title: "Have a project in mind?",
        subtitle: "Send a quick message — reply fast",
        primary: { label: "Contact", href: "/contact" },
        secondary: { label: "Scroll to Contact", scrollTo: "contact" },
        weight: 8,
    },

    // ABOUT
    {
        id: "about_resume",
        section: "about",
        title: "Download Resume",
        subtitle: "Quick overview — skills + work",
        primary: { label: "Download", href: "/resume/Mukul-Jaiswal-Resume.pdf" },
        secondary: { label: "View Skills", scrollTo: "skills" },
        weight: 12,
    },
    {
        id: "about_projects",
        section: "about",
        title: "See my work style",
        subtitle: "Premium UI + clean structure",
        primary: { label: "Projects", href: "/projects" },
        secondary: { label: "Scroll to Projects", scrollTo: "projects" },
        weight: 9,
    },

    // SKILLS
    {
        id: "skills_full",
        section: "skills",
        title: "Explore full Skills page",
        subtitle: "Stack breakdown — frontend / backend / tools",
        primary: { label: "View All Skills", href: "/skills" },
        secondary: { label: "View Projects", href: "/projects" },
        weight: 11,
    },

    // PROJECTS
    {
        id: "projects_detail",
        section: "projects",
        title: "Open any project details",
        subtitle: "Case-study layout — premium look",
        primary: { label: "All Projects", href: "/projects" },
        secondary: { label: "Contact Me", href: "/contact" },
        weight: 10,
    },

    // TESTIMONIALS
    {
        id: "testimonials_trust",
        section: "testimonials",
        title: "Social proof matters",
        subtitle: "Client words → real confidence",
        primary: { label: "Next Reviews", scrollTo: "testimonials" },
        secondary: { label: "FAQs", scrollTo: "faq" },
        weight: 7,
    },

    // FAQ
    {
        id: "faq_clear",
        section: "faq",
        title: "Quick answers in 10 sec",
        subtitle: "Timeline • pricing • scope",
        primary: { label: "Ask a question", href: "/contact" },
        secondary: { label: "Go Contact", scrollTo: "contact" },
        weight: 8,
    },

    // CONTACT
    {
        id: "contact_send",
        section: "contact",
        title: "Ready when you are",
        subtitle: "Send message — I’ll respond fast",
        primary: { label: "Send Message", scrollTo: "contact" },
        secondary: { label: "WhatsApp", href: "https://wa.me/919919371299" },
        weight: 12,
    },
];

export const MICRO_TECH_LINES = [
    "Tip: press Ctrl/⌘ + K for quick actions.",
    "Micro-UX: your scroll path is tracked (locally) for smarter suggestions.",
    "Performance-first: suggestions run only when section is visible.",
    "Navigation hint: jump to Projects for proof of work.",
    "Pro tip: Skills → Projects → Contact flow converts best.",
];
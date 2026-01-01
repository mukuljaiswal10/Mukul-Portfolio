// src/data/services.js

export const serviceOfferings = [
    {
        id: "portfolio",
        title: "Portfolio / Business Website",
        desc: "Modern, responsive website with premium UI, fast load, and clean structure.",
        tags: ["Next.js", "Tailwind", "SEO", "Performance"],
        highlight: "Best for personal brand & agencies",
    },
    {
        id: "landing",
        title: "Landing Page (Lead focused)",
        desc: "High-converting landing pages with strong CTA blocks, trust sections, and smooth scroll UX.",
        tags: ["UI/UX", "Responsive", "CTA", "Conversion"],
        highlight: "Best for ads & campaigns",
    },
    {
        id: "wp-dev",
        title: "WordPress Development",
        desc: "WordPress sites with clean sections, speed optimization, Elementor/ACF support.",
        tags: ["WordPress", "Elementor", "ACF", "Optimization"],
        highlight: "Best for quick editable sites",
    },
    {
        id: "ecom",
        title: "E-commerce Website",
        desc: "Product listing, filtering UI, cart-ready architecture, scalable frontend.",
        tags: ["Store UI", "Filters", "Scalable", "Mobile-first"],
        highlight: "Best for selling online",
    },
    {
        id: "dashboard",
        title: "Admin Dashboard UI",
        desc: "Professional dashboard UI with charts-ready layout, tables, filters, and forms.",
        tags: ["React", "Tables", "Forms", "UX"],
        highlight: "Best for admin panels",
    },
    {
        id: "api",
        title: "API Integration",
        desc: "Frontend integration with REST APIs, loading states, error handling, and caching approach.",
        tags: ["REST", "Auth", "State", "Best Practices"],
        highlight: "Best for dynamic apps",
    },
    {
        id: "performance",
        title: "Performance & Core Web Vitals",
        desc: "Improve speed, CLS, LCP & best practices with clean structure + optimization.",
        tags: ["Speed", "CWV", "Image Opt", "Best Practices"],
        highlight: "Best for boosting SEO",
    },
    {
        id: "seo",
        title: "SEO-ready Structure",
        desc: "SEO-friendly headings, metadata, schema-ready structure, and clean page hierarchy.",
        tags: ["SEO", "Meta", "Structure", "Schema-ready"],
        highlight: "Best for ranking & growth",
    },
    {
        id: "maintenance",
        title: "Maintenance & Support",
        desc: "Bug fixes, UI upgrades, new sections, performance monitoring & small improvements.",
        tags: ["Support", "Fixes", "Enhancements", "Updates"],
        highlight: "Best for long-term stability",
    },
];

export const servicePackages = [
    {
        id: "starter",
        name: "Starter",
        for: "Single page / small website",
        points: [
            "Premium UI sections",
            "Mobile-first responsive",
            "Basic SEO structure",
            "Fast loading setup",
        ],
        ctaLabel: "Get Starter pricing →",
    },
    {
        id: "pro",
        name: "Pro",
        for: "Business / multi-page",
        points: [
            "Multiple pages + smooth UX",
            "Better components + animations",
            "Performance optimization",
            "Lead-focused structure",
        ],
        ctaLabel: "Get Pro pricing →",
        featured: true,
    },
    {
        id: "elite",
        name: "Elite",
        for: "High-end / custom build",
        points: [
            "Custom luxury UI system",
            "Advanced sections + micro-animations",
            "Scalable architecture",
            "Priority support",
        ],
        ctaLabel: "Get Elite pricing →",
    },
];

export const serviceProcess = [
    {
        step: "01",
        title: "Discovery",
        desc: "Requirements + references + goals (speed, design, conversion).",
    },
    {
        step: "02",
        title: "Design & UI",
        desc: "Luxury UI layout + responsive structure + animations.",
    },
    {
        step: "03",
        title: "Build & Integrate",
        desc: "Clean code + reusable components + API integration (if needed).",
    },
    {
        step: "04",
        title: "Launch & Support",
        desc: "Final polish + performance + support & upgrades.",
    },
];

export const serviceFaq = [
    {
        q: "Pricing direct kyun nahi show kar rahe?",
        a: "Project scope (pages, features, deadline) ke hisaab se pricing vary hoti hai. Contact karoge to exact quote mil jayega.",
    },
    {
        q: "Delivery time kitna hota hai?",
        a: "Normally 3–10 days (scope par depend). Urgent requirements me fast delivery possible.",
    },
    {
        q: "Aap redesign / UI upgrade karte ho?",
        a: "Haan. Existing website ko premium UI + better UX + performance me upgrade kar sakta hoon.",
    },
    {
        q: "Maintenance ka option hai?",
        a: "Haan. Monthly/one-time support, bug fixes, UI upgrades, and performance improvements available.",
    },
];
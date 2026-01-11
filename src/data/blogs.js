// src/data/blogs.js

export const blogs = [
    {
        slug: "mern-stack-architecture-production-ready",
        title: "Production-Ready MERN Architecture: Folder Structure, Patterns & Scaling",
        category: "MERN",
        tags: ["MERN", "Architecture", "Node.js", "MongoDB", "Scaling"],
        date: "2025-01-10",
        readTime: "10 min read",
        featured: true,
        summary:
            "A practical blueprint to structure a MERN codebase like a professional—clean layers, reusable modules, and scalability patterns.",
        coverAccent: "amber",
        author: { name: "Mukul Jaiswal", role: "Full Stack & WordPress Developer" },
        blocks: [
            { type: "p", text: "When a MERN project grows, the first thing that breaks is structure. In this guide, I’ll show you a scalable folder architecture and patterns that keep velocity high and bugs low." },
            { type: "h2", text: "The clean layering model" },
            { type: "p", text: "Think in layers: routes → controllers → services → repositories. Each layer has a single job. This makes features easier to extend and test." },
            { type: "ul", items: ["Routes: HTTP interface", "Controllers: request/response orchestration", "Services: business logic", "Repositories: data access (Mongo)"] },
            { type: "h2", text: "Suggested folder structure" },
            {
                type: "code", lang: "bash", code: `src/
  modules/
    auth/
      auth.routes.js
      auth.controller.js
      auth.service.js
      auth.repo.js
      auth.validation.js
  common/
    middleware/
    utils/
  config/
  server.js` },
            { type: "h2", text: "Scaling rules you should follow" },
            { type: "ul", items: ["No DB calls inside controllers", "Validate all inputs at the edge", "Keep shared helpers inside common/", "Make modules independent and portable"] },
            { type: "quote", text: "A clean architecture isn’t about being fancy—it’s about shipping faster without fear." },
        ],
    },

    {
        slug: "wordpress-security-hardening-checklist",
        title: "WordPress Security Hardening Checklist (No Fear, Just Process)",
        category: "WordPress",
        tags: ["WordPress", "Security", "Hardening"],
        date: "2025-03-15",
        readTime: "6 min read",
        featured: false,
        summary:
            "A clean and realistic security checklist—updates, permissions, login protection, backups, and monitoring.",
        coverAccent: "amber",
        author: { name: "Mukul Jaiswal", role: "Full Stack & WordPress Developer" },
        blocks: [
            { type: "p", text: "Most WordPress hacks happen due to weak admin, outdated plugins, and no backups. Fix these basics first." },
            { type: "h2", text: "Core checklist" },
            { type: "ul", items: ["Keep core + plugins updated", "Use strong admin username + 2FA", "Limit login attempts", "Disable file editing in wp-admin", "Daily backups + monitoring"] },
            { type: "h2", text: "One powerful wp-config change" },
            { type: "code", lang: "php", code: `define('DISALLOW_FILE_EDIT', true);` },
        ],
    },

    {
        slug: "deploy-mern-docker-nginx",
        title: "Deploy MERN with Docker + Nginx: A Clean Production Setup",
        category: "MERN",
        tags: ["Docker", "Nginx", "Deployment", "MERN"],
        date: "2025-03-08",
        readTime: "11 min read",
        featured: false,
        summary:
            "A real production-friendly deployment strategy for MERN apps—secure, cache-friendly, and easy to maintain.",
        coverAccent: "indigo",
        author: { name: "Mukul Jaiswal", role: "Full Stack & WordPress Developer" },
        blocks: [
            { type: "p", text: "Local works. Production breaks. Docker + Nginx gives you repeatability, security and consistent performance." },
            { type: "h2", text: "What you’ll deploy" },
            { type: "ul", items: ["Client (Next/React)", "API (Node/Express)", "MongoDB", "Nginx reverse proxy + caching"] },
            { type: "h2", text: "Nginx benefit" },
            { type: "p", text: "Nginx terminates SSL, routes traffic, and can cache static assets. Your Node server stays focused on API." },
        ],
    },


    {
        slug: "cpt-acf-workflow-wordpress",
        title: "Custom Post Type (CPT) Setup Like a Pro: WordPress + ACF Best Workflow",
        category: "WordPress",
        tags: ["WordPress", "CPT", "ACF", "Development"],
        date: "2025-03-01",
        readTime: "7 min read",
        featured: false,
        summary:
            "Build scalable WordPress sites using CPT + ACF with clean templates, reusable components, and maintainable code.",
        coverAccent: "rose",
        author: { name: "Mukul Jaiswal", role: "Full Stack & WordPress Developer" },
        blocks: [
            { type: "p", text: "CPT + ACF is a powerful combo for real business sites. The key is structuring templates and fields the right way." },
            { type: "h2", text: "What to create" },
            { type: "ul", items: ["CPT: Services / Portfolio / Testimonials", "Taxonomy: Service category", "ACF groups: Hero, CTA, FAQ blocks"] },
            { type: "h2", text: "Template strategy" },
            { type: "p", text: "Keep templates minimal and push repeated UI into partials/components. This makes future redesigns easy." },
        ],
    },

    // {
    //     slug: "nextjs-portfolio-performance-checklist",
    //     title: "Next.js Portfolio Performance Checklist (Lighthouse 90+)",
    //     category: "Next.js",
    //     tags: ["Next.js", "Performance", "SEO"],
    //     date: "2025-02-12",
    //     readTime: "6 min read",
    //     featured: false,
    //     summary:
    //         "Simple changes that dramatically improve your portfolio’s speed and UX—without ruining design.",
    //     coverAccent: "emerald",
    //     author: { name: "Mukul Jaiswal", role: "Full Stack & WordPress Developer" },
    //     blocks: [
    //         { type: "p", text: "Premium UI is good, but a premium website must feel fast. Here’s a small checklist that makes your Next.js portfolio smoother." },
    //         { type: "h2", text: "Top wins" },
    //         { type: "ul", items: ["Use next/image for all images", "Avoid heavy client components on initial fold", "Prefer CSS over JS for small animations", "Lazy load below-the-fold sections", "Use route segment caching wisely"] },
    //         { type: "h2", text: "Common mistake" },
    //         { type: "p", text: "Do not compute random UI layout on server + client mismatch. Keep deterministic UI on first render." },
    //     ],
    // },
];

export const blogCategories = [
    "All",
    "MERN",
    "Next.js",
    "WordPress",
];
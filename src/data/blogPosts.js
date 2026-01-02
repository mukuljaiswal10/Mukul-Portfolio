// src/data/blogPosts.js
export const blogPosts = [
    {
        slug: "production-ready-mern-architecture",
        title: "Production-Ready MERN Architecture: Folder Structure, Patterns & Scaling",
        excerpt:
            "A practical blueprint to structure a MERN codebase like a professional—clean layers, reusable modules, and scalability patterns.",
        category: "MERN",
        tags: ["Architecture", "Patterns", "MongoDB", "Node.js"],
        date: "2025-01-10",
        readMins: 10,
        featured: true,
        cover: { tone: "gold" },
        content: [
            { type: "p", text: "A scalable MERN app is not “just folders”—it’s boundaries, ownership, and consistent patterns." },
            { type: "h2", id: "why-structure", text: "Why folder structure matters" },
            { type: "p", text: "When your app grows, clarity beats cleverness. A clean structure improves onboarding, debugging, and shipping speed." },
            {
                type: "callout",
                tone: "gold",
                title: "Rule of thumb",
                text: "Feature ownership + shared utilities + clear layers = production-ready codebase.",
            },
            { type: "h2", id: "recommended-structure", text: "Recommended structure" },
            {
                type: "code",
                lang: "txt",
                code: `src/
  app/            # routes (Next.js)
  features/       # domain modules (auth, blog, payments)
  components/     # shared UI
  lib/            # helpers, services
  server/         # db, models, services
  styles/         # globals`,
            },
            { type: "h2", id: "scaling-patterns", text: "Scaling patterns" },
            {
                type: "ul",
                items: [
                    "Keep business logic close to features",
                    "Use thin route handlers/controllers",
                    "Prefer composable services (not mega utils)",
                    "Add validation at boundaries (Zod/Joi)",
                ],
            },
            { type: "quote", text: "Architecture is the art of making the right thing easy." },
            { type: "h2", id: "final-checklist", text: "Final checklist" },
            {
                type: "ul",
                items: [
                    "✅ One feature = one owner folder",
                    "✅ Shared UI stays reusable",
                    "✅ Database access centralized",
                    "✅ Logging & error handling consistent",
                ],
            },
        ],
    },

    {
        slug: "wordpress-security-hardening-checklist",
        title: "WordPress Security Hardening Checklist (No Fear, Just Process)",
        excerpt:
            "A clean and realistic security checklist—updates, permissions, login protection, backups, and monitoring.",
        category: "WordPress",
        tags: ["Security", "Hardening", "Checklist"],
        date: "2025-03-15",
        readMins: 6,
        featured: false,
        cover: { tone: "blue" },
        content: [
            { type: "p", text: "Security doesn’t need panic. It needs a repeatable process." },
            { type: "h2", id: "core-basics", text: "Core basics" },
            { type: "ul", items: ["Update WP core + plugins", "Remove unused themes/plugins", "Use strong admin roles"] },
            { type: "h2", id: "login", text: "Login protection" },
            { type: "ul", items: ["Limit login attempts", "2FA for admins", "Change default login URL (optional)"] },
            { type: "h2", id: "backups", text: "Backups & monitoring" },
            { type: "ul", items: ["Daily backups", "Uptime monitoring", "Security scans weekly"] },
            { type: "callout", tone: "glass", title: "Pro tip", text: "Security plugins are helpers. The real protection is process + updates." },
        ],
    },

    {
        slug: "deploy-mern-docker-nginx",
        title: "Deploy MERN with Docker + Nginx: A Clean Production Setup",
        excerpt:
            "A real production-friendly deployment strategy for MERN apps—secure, cache-friendly, and easy to maintain.",
        category: "MERN",
        tags: ["Docker", "Nginx", "Deployment"],
        date: "2025-03-08",
        readMins: 11,
        featured: false,
        cover: { tone: "green" },
        content: [
            { type: "p", text: "Docker gives repeatability. Nginx gives control. Together: production confidence." },
            { type: "h2", id: "compose", text: "Docker Compose baseline" },
            {
                type: "code",
                lang: "yaml",
                code: `services:
  web:
    build: .
    ports: ["3000:3000"]
  api:
    build: ./api
    ports: ["5000:5000"]`,
            },
            { type: "h2", id: "nginx", text: "Nginx reverse proxy" },
            { type: "ul", items: ["TLS with Let’s Encrypt", "Gzip/Brotli", "Caching static assets"] },
            { type: "callout", tone: "gold", title: "Ship fast", text: "Keep config minimal, version-controlled, and reproducible." },
        ],
    },

    {
        slug: "cpt-acf-workflow-wordpress",
        title: "Custom Post Type (CPT) Setup Like a Pro: WordPress + ACF Best Workflow",
        excerpt:
            "Build scalable WordPress sites using CPT + ACF with clean templates, reusable components, and maintainable code.",
        category: "WordPress",
        tags: ["CPT", "ACF", "Workflow"],
        date: "2025-03-01",
        readMins: 7,
        featured: false,
        cover: { tone: "purple" },
        content: [
            { type: "p", text: "CPT + ACF is the fastest way to build structured content sites without chaos." },
            { type: "h2", id: "strategy", text: "Strategy" },
            { type: "ul", items: ["Define content model first", "ACF field groups per CPT", "Template parts for UI"] },
            { type: "h2", id: "naming", text: "Naming conventions" },
            { type: "callout", tone: "glass", title: "Naming tip", text: "Use consistent prefixes and avoid overly generic slugs." },
        ],
    },

    {
        slug: "nextjs-performance-checklist",
        title: "Next.js Performance Checklist: Ship Fast Pages Without Overthinking",
        excerpt:
            "Practical performance wins: images, caching, routing, hydration, and bundle hygiene—quick wins + long-term habits.",
        category: "Next.js",
        tags: ["Performance", "Caching", "Bundle"],
        date: "2025-02-12",
        readMins: 8,
        featured: false,
        cover: { tone: "gold" },
        content: [
            { type: "p", text: "Performance is a product feature. These are the checks I do before shipping." },
            { type: "ul", items: ["Optimize images", "Avoid unnecessary client components", "Memoize expensive UI", "Use route-level caching wisely"] },
            { type: "h2", id: "hydration", text: "Hydration pitfalls" },
            { type: "p", text: "Avoid Date.now()/Math.random() in SSR output, and keep DOM consistent across server/client." },
        ],
    },

    {
        slug: "jwt-auth-mern-best-practices",
        title: "JWT Auth in MERN: Best Practices (Access/Refresh) Without Security Drama",
        excerpt:
            "A clean authentication flow with refresh tokens, HttpOnly cookies, and rotation strategy—simple, secure, scalable.",
        category: "MERN",
        tags: ["JWT", "Auth", "Security"],
        date: "2025-02-02",
        readMins: 9,
        featured: false,
        cover: { tone: "blue" },
        content: [
            { type: "p", text: "JWT is safe when you manage storage, rotation, and invalidation correctly." },
            { type: "h2", id: "flow", text: "Recommended flow" },
            { type: "ul", items: ["Access token short-lived", "Refresh token in HttpOnly cookie", "Rotate refresh token on use"] },
            { type: "callout", tone: "gold", title: "Important", text: "Never store refresh tokens in localStorage." },
        ],
    },
];








// src/lib/blog.js

function slugify(str = "") {
    return String(str)
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function extractHeadingsFromHtml(html = "") {
    // Extract h2/h3 headings with id. If id missing, it will generate.
    const headings = [];
    const re = /<(h2|h3)([^>]*)>(.*?)<\/\1>/gi;

    let match;
    while ((match = re.exec(html)) !== null) {
        const tag = match[1];
        const attrs = match[2] || "";
        const inner = match[3] || "";

        const text = inner
            .replace(/<[^>]*>/g, "")
            .replace(/\s+/g, " ")
            .trim();

        if (!text) continue;

        const idMatch = attrs.match(/id=["']([^"']+)["']/i);
        const id = idMatch?.[1] || slugify(text);

        headings.push({
            id,
            text,
            level: tag === "h2" ? 2 : 3,
        });
    }

    return headings;
}

function readTimeFromContent(html = "") {
    const text = String(html).replace(/<[^>]*>/g, " ");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(3, Math.round(words / 180));
    return mins;
}

/**
 * Dummy real-like posts.
 * Later you can replace this with CMS/API without changing UI logic.
 */
const POSTS = [
    {
        title: "Production-Ready MERN Architecture: Folder Structure, Patterns & Scaling",
        slug: "production-ready-mern-architecture",
        category: "MERN",
        tags: ["MERN", "Architecture", "Scalability", "Clean Code"],
        date: "2025-01-10",
        featured: true,
        excerpt:
            "A practical blueprint to structure a MERN codebase like a professional—clean layers, reusable modules, and scalability patterns.",
        coverStyle:
            "bg-[radial-gradient(900px_circle_at_20%_20%,rgba(231,194,102,0.22),transparent_45%),radial-gradient(700px_circle_at_85%_35%,rgba(255,255,255,0.08),transparent_55%)]",
        contentHtml: `
      <p class="lead">If you want your MERN project to feel <b>enterprise-grade</b>, your architecture must be predictable. This guide gives you a production folder structure + patterns that scale.</p>

      <h2 id="goal">What we are building</h2>
      <p>We’re aiming for: clear boundaries, easy testing, and fast iteration. The goal is to keep controllers thin and move logic into services.</p>

      <h2 id="folder-structure">Suggested folder structure</h2>
      <pre><code>src/
  config/
  modules/
    users/
      user.model.js
      user.controller.js
      user.service.js
      user.routes.js
      user.validation.js
    auth/
    payments/
  shared/
    middleware/
    utils/
    constants/
  app.js
  server.js</code></pre>

      <h3 id="why-modules">Why module-based structure</h3>
      <p>It makes ownership and reusability clear. Each module carries model/controller/service/routes.</p>

      <h2 id="patterns">Patterns that prevent tech-debt</h2>
      <ul>
        <li><b>DTO + Validation</b> in module layer</li>
        <li><b>Service layer</b> for business rules</li>
        <li><b>Repository layer</b> only when needed</li>
        <li><b>Central error handler</b></li>
      </ul>

      <h2 id="deployment">Deployment checklist</h2>
      <ul>
        <li>dotenv + strict config</li>
        <li>rate limit + helmet</li>
        <li>logs + request id</li>
        <li>health checks</li>
      </ul>

      <h2 id="final-notes">Final notes</h2>
      <p>Start with the structure above and keep it consistent across modules. Consistency is scalability.</p>
    `,
    },

    {
        title: "WordPress Security Hardening Checklist (No Fear, Just Process)",
        slug: "wordpress-security-hardening-checklist",
        category: "WordPress",
        tags: ["WordPress", "Security", "Hardening"],
        date: "2025-03-15",
        excerpt:
            "A clean and realistic security checklist—updates, permissions, login protection, backups, and monitoring.",
        coverStyle:
            "bg-[radial-gradient(900px_circle_at_15%_20%,rgba(99,102,241,0.18),transparent_45%),radial-gradient(700px_circle_at_85%_35%,rgba(231,194,102,0.14),transparent_55%)]",
        contentHtml: `
      <p class="lead">Security is boring until it’s expensive. This checklist keeps you safe without over-engineering.</p>

      <h2 id="quick-wins">Quick wins (15 minutes)</h2>
      <ul>
        <li>Enable auto-updates for minor releases</li>
        <li>Remove unused plugins/themes</li>
        <li>Use strong admin username (not admin)</li>
      </ul>

      <h2 id="login-protection">Login protection</h2>
      <ul>
        <li>Limit login attempts</li>
        <li>2FA for admin/editor</li>
        <li>reCAPTCHA / Turnstile</li>
      </ul>

      <h3 id="roles">Roles & permissions</h3>
      <p>Never give admin by default. Use editor/author roles properly.</p>

      <h2 id="backups">Backup strategy</h2>
      <ul>
        <li>Daily DB backups</li>
        <li>Weekly full backups</li>
        <li>Offsite storage</li>
      </ul>

      <h2 id="monitoring">Monitoring</h2>
      <p>Uptime monitoring + basic alerting. Catch problems before clients do.</p>
    `,
    },

    {
        title: "Deploy MERN with Docker + Nginx: A Clean Production Setup",
        slug: "deploy-mern-with-docker-nginx",
        category: "MERN",
        tags: ["Docker", "Nginx", "Deployment", "MERN"],
        date: "2025-03-08",
        excerpt:
            "A real production-friendly deployment strategy for MERN apps—secure, cache-friendly, and easy to maintain.",
        coverStyle:
            "bg-[radial-gradient(900px_circle_at_15%_20%,rgba(34,197,94,0.16),transparent_45%),radial-gradient(700px_circle_at_85%_35%,rgba(231,194,102,0.13),transparent_55%)]",
        contentHtml: `
      <p class="lead">If you deploy MERN manually every time, you will break production eventually. Docker + Nginx gives you repeatability.</p>

      <h2 id="compose">Docker compose structure</h2>
      <pre><code>services:
  api:
    build: ./api
  web:
    build: ./web
  nginx:
    image: nginx:stable</code></pre>

      <h2 id="nginx">Nginx basics</h2>
      <p>Use Nginx as reverse proxy + caching for static assets. Terminate SSL here.</p>

      <h2 id="env">Environment & secrets</h2>
      <p>Never commit secrets. Use env files and production secret managers.</p>
    `,
    },

    {
        title: "Custom Post Type (CPT) Setup Like a Pro: WordPress + ACF Best Workflow",
        slug: "custom-post-type-cpt-setup-like-a-pro",
        category: "WordPress",
        tags: ["WordPress", "CPT", "ACF"],
        date: "2025-03-01",
        excerpt:
            "Build scalable WordPress sites using CPT + ACF with clean templates, reusable components, and maintainable code.",
        coverStyle:
            "bg-[radial-gradient(900px_circle_at_15%_20%,rgba(231,194,102,0.18),transparent_45%),radial-gradient(700px_circle_at_85%_35%,rgba(244,114,182,0.10),transparent_55%)]",
        contentHtml: `
      <p class="lead">CPT + ACF is the fastest path to professional WordPress builds—when you keep structure clean.</p>

      <h2 id="register-cpt">Registering CPT</h2>
      <p>You can register CPT via code or plugins. Code is best for version control.</p>

      <h2 id="acf-fields">ACF fields strategy</h2>
      <ul>
        <li>Field groups per template</li>
        <li>Reusable blocks</li>
        <li>Naming conventions</li>
      </ul>

      <h2 id="templates">Templates</h2>
      <p>Keep template minimal. Put logic in helpers. Render data cleanly.</p>
    `,
    },
];

function normalizePost(p) {
    const readTime = p.readTime || readTimeFromContent(p.contentHtml);
    return {
        ...p,
        readTime,
        headings: extractHeadingsFromHtml(p.contentHtml),
    };
}

export function getAllPosts() {
    // newest first by default
    return POSTS
        .map(normalizePost)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
    const s = String(slug || "").trim();
    const post = POSTS.find((p) => p.slug === s);
    return post ? normalizePost(post) : null;
}

export function getAdjacentPosts(slug) {
    const all = getAllPosts(); // sorted newest->oldest
    const idx = all.findIndex((p) => p.slug === slug);
    if (idx < 0) return { prev: null, next: null };

    // next = newer, prev = older (UX preference: “Next” -> next read which is older)
    const newer = idx > 0 ? all[idx - 1] : null;
    const older = idx < all.length - 1 ? all[idx + 1] : null;

    return {
        next: older ? pickNav(older) : null,
        prev: newer ? pickNav(newer) : null,
    };
}

function pickNav(p) {
    return {
        slug: p.slug,
        title: p.title,
        category: p.category,
        date: p.date,
        readTime: p.readTime,
    };
}

export function getRelatedPosts(slug, { limit = 3 } = {}) {
    const base = getPostBySlug(slug);
    if (!base) return [];

    const all = getAllPosts().filter((p) => p.slug !== slug);

    const baseTags = new Set(base.tags || []);
    const scored = all
        .map((p) => {
            const tags = p.tags || [];
            let score = 0;
            for (const t of tags) if (baseTags.has(t)) score += 2;
            if (p.category === base.category) score += 2;
            // slight boost for newer
            score += Math.max(0, 1 - (Date.now() - new Date(p.date).getTime()) / (1000 * 60 * 60 * 24 * 365));
            return { p, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((x) => pickNav(x.p));

    return scored;
}
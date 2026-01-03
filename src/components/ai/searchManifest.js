export const SEARCH_MANIFEST = {
    /* ---------------------------------------------
     ✅ PAGES (Routes)
     - href = actual route (must exist)
     - id = unique key (slug)
     - label = user ko visible title
     - keywords = search help words
    ---------------------------------------------- */
    pages: [
        { id: "home", label: "Home", href: "/", keywords: ["landing", "start"] },
        { id: "about", label: "About", href: "/about", keywords: ["me", "bio"] },
        { id: "projects", label: "Projects", href: "/projects", keywords: ["work", "portfolio"] },
        { id: "blog", label: "Blog", href: "/blog", keywords: ["posts", "articles"] },
        { id: "services", label: "Services", href: "/services", keywords: ["service", "offerings"] },

        // ✅ Added Skills Page
        { id: "skills", label: "Skills", href: "/skills", keywords: ["tech", "stack", "skills", "frontend", "backend", "tools", "ui", "design"] },

        { id: "contact", label: "Contact", href: "/contact", keywords: ["hire", "email", "whatsapp"] },
        {
            id: "resume",                 // unique slug
            label: "Resume",              // UI me show hoga
            href: "/about",              // route must exist in app/
            keywords: ["cv", "download"]  // optional search helpers
        },
    ],

    /* ---------------------------------------------
     ✅ SECTIONS (Home page anchors)
     - href must be like "/#section-id"
     - id should match your home page section id (without #)
     - label is what user sees
    ---------------------------------------------- */
    sections: [
        // ✅ Added Skills Section (Home page)
        { id: "skills", label: "Skills section", href: "/#skills", keywords: ["stack", "tech"] },

        { id: "blog-preview", label: "Blogs section", href: "/#blog-preview", keywords: ["articles"] },
        { id: "contact-section", label: "Contact section", href: "/#contact", keywords: ["hire", "form"] },
        { id: "faq-section", label: "FAQ section", href: "/#faq", keywords: ["questions", "answers"] },
        {
            id: "testimonials",                   // home section ka id (without #)
            label: "Testimonials section",        // suggestion me show
            href: "/#testimonials",               // MUST be "/#id"
            keywords: ["reviews", "clients"]      // optional
        },
        {
            id: "resume",                 // unique slug
            label: "Resume",              // UI me show hoga
            href: "/#about",              // route must exist in app/
            keywords: ["cv", "download"]  // optional search helpers
        },
    ],

    /* ---------------------------------------------
     ✅ TAGS / CHIPS (Central tag list)
     - UI chips + tag matching boost
     - Here you can use TitleCase (nice for UI)
     - IMPORTANT: Search logic normalize karke compare karta hai,
       so "Tailwind" (here) & "tailwind" (project tags) dono match ho jayenge.
    ---------------------------------------------- */
    tags: [
        "Next.js",
        "React",
        "Tailwind",
        "WordPress",
        "Node.js",
        "Docker",
        "Nginx",
        "Security",
        "ACF",
        "CPT",
        "Deployment",
        "Architecture",
        "Scalability",
        "TypeScript",
    ],

    /* ---------------------------------------------
     ✅ PROJECTS
     - id unique
     - href MUST be real project route
     - label visible in suggestion
     - hint small label like "Project"
     - tags MUST be lowercase recommended (search normalize anyway)
     - keywords help discoverability
    ---------------------------------------------- */
    projects: [
        {
            id: "furniture",
            label: "Furniture",
            // ❗ IMPORTANT: Tumhare screenshot me "/projects/" tha => page not found
            // ✅ Agar Furniture ka single page hai to "/projects/furniture" rakho
            href: "/projects/furniture",
            hint: "Project",
            tags: ["tailwind", "next.js", "react", "javascript","css"],
            keywords: ["ecommerce", "ui", "catalog"],
        },
        {
            id: "portfolio-v2",
            label: "Portfolio V2",
            href: "/projects/portfolio-v2",
            hint: "Project",
            tags: ["next.js", "tailwind","css"],
            keywords: ["portfolio", "personal site"],
        },
    ],

    /* ---------------------------------------------
     ✅ BLOGS
     - id unique
     - href real blog route
     - tags + keywords search help
    ---------------------------------------------- */
    blogs: [
        {
            id: "deploy-mern-docker-nginx",
            label: "Deploy MERN with Docker + Nginx",
            href: "/blog/deploy-mern-with-docker-nginx",
            hint: "Blog",
            tags: ["docker", "nginx", "deployment"],
            keywords: ["production", "server", "reverse proxy"],
        },
        {
            id: "wp-security-hardening",
            label: "WordPress Security Hardening Checklist",
            href: "/blog/wordpress-security-hardening-checklist",
            hint: "Blog",
            tags: ["wordpress", "security"],
            keywords: ["hardening", "plugin", "risk"],
        },
    ],
};
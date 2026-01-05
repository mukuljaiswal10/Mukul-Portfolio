import { normalizeTags } from "@/lib/tags";

/**
 * ✅ Slug normalizer (safe + consistent)
 * - "Ecommerce Admin Panel" -> "ecommerce-admin-panel"
 * - "ecommerce--admin--panel" -> "ecommerce-admin-panel"
 */
export function normalizeSlug(input) {
    return String(input || "")
        .trim()
        .toLowerCase()
        .replace(/%20/g, "-")
        .replace(/\s+/g, "-")
        .replace(/_+/g, "-")
        .replace(/-+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/^-|-$/g, "");
}

/**
 * ✅ Raw projects (your data)
 * NOTE:
 * - slug MUST be unique
 * - wip=true => "In progress"
 * - responsive=false => desktop-first indicator
 */
const rawProjects = [
    {
        slug: "portfolio",
        title: "Portfolio Website",
        description: "A modern portfolio built with Next.js App Router and Tailwind CSS.",

        tags: ["Next.js", "Tailwind", "UI"],

        image: "/images/p1.png",
        liveUrl: "https://mukul-portfolio-coral.vercel.app/",
        githubUrl: "https://github.com/mukuljaiswal10/Mukul-Portfolio",
        stats: [
            { label: "Performance", value: 95, suffix: "/100" },
            { label: "Pages", value: 6, suffix: "+" },
            { label: "Delivery", value: 7, suffix: " days" },
        ],
    },

    {
        slug: "furniture-ecommerce",
        title: "Furniture e-Commerce Website",
        description:
            "A modern eCommerce website built using Next.js and Tailwind CSS. Fully responsive UI, mega menu, mobile navigation, smooth animations and clean component structure.",

        tags: ["Next.js", "TailwindCSS"],

        image: "/images/p2.png",
        liveUrl: "https://furniture-e-commerce-app-two.vercel.app/",
        githubUrl: "https://github.com/mukuljaiswal10/Furniture-eCommerce-App",
        stats: [
            { label: "Performance", value: 94, suffix: "/100" },
            { label: "Pages", value: 12, suffix: "+" },
            { label: "Delivery", value: 18, suffix: " days" },
        ],
        wip: true,
        wipLabel: "Work in progress",
        wipNote: "Currently building — final polish in progress.",
    },

    {
        slug: "ecommerce-admin-panel",
        title: "E-commerce Admin Panel",
        description:
            "React.js Admin Panel focused on product, category, order, and user management. Desktop-first workflow oriented UI.",

        tags: ["React.js", "Tailwind"],

        image: "/images/p13.png",
        liveUrl: "https://admin-panel-rho-taupe-80.vercel.app/",
        githubUrl: "https://github.com/mukuljaiswal10/Admin-Panel",
        stats: [
            { label: "Performance", value: 92, suffix: "/100" },
            { label: "Modules", value: 8, suffix: "+" },
            { label: "Delivery", value: 14, suffix: " days" },
        ],
        wip: true,
        wipLabel: "Work in progress",
        wipNote: "Desktop-first admin — mobile UI not priority right now.",
        responsive: false,
        responsiveLabel: "Desktop-First (Admin Panel)",
        responsiveDesc:
            "Optimized for laptop/desktop workflows. Mobile UI is intentionally not the primary target.",
    },

    {
        slug: "spotify-website",
        title: "Spotify Homepage Clone",
        description:
            "Responsive Spotify Clone using HTML, CSS & Media Queries. Pixel-close UI with clean layout and responsive behavior.",

        tags: ["HTML", "CSS", "Javascript"],

        image: "/images/p12.png",
        liveUrl: "https://spotifie-homepage.vercel.app/",
        githubUrl: "https://github.com/mukuljaiswal10/spotifie-homepage",
        stats: [
            { label: "Responsive", value: "Yes", suffix: "" },
            { label: "Sections", value: 10, suffix: "+" },
            { label: "Delivery", value: 4, suffix: " days" },
        ],
    },

    {
        slug: "meta-newsroom-website",
        title: "Meta Newsroom Homepage Clone",
        description:
            "Responsive clone of Facebook Newsroom using HTML5 and CSS3 with media queries and clean structure.",

        tags: ["HTML", "CSS"],

        image: "/images/p10.png",
        liveUrl: "https://project-7-facebook-meta-newsroom-re.vercel.app/",
        githubUrl:
            "https://github.com/mukuljaiswal10/Project-7-Facebook-Meta-Newsroom-Responsive-Clone",
        stats: [
            { label: "Responsive", value: "Yes", suffix: "" },
            { label: "Sections", value: 9, suffix: "+" },
            { label: "Delivery", value: 3, suffix: " days" },
        ],
    },

    {
        slug: "smart-city",
        title: "Smart Homepage Clone",
        description:
            "Smart City homepage clone using Bootstrap + jQuery. Smooth animations, modern UI and mobile-friendly layout.",

        tags: ["Bootstrap", "Javascript", "JQuery", "Css"],

        image: "/images/p3.png",
        liveUrl: "https://smart-city-home-page-clone-using-bo.vercel.app/",
        githubUrl:
            "https://github.com/mukuljaiswal10/Smart-City-HomePage-Clone-Using-Bootstrap-jQuery",
        stats: [
            { label: "Components", value: 15, suffix: "+" },
            { label: "Carousel", value: "Yes", suffix: "" },
            { label: "Delivery", value: 5, suffix: " days" },
        ],
    },

    {
        slug: "blinkit",
        title: "Blinkit Homepage Website",
        description:
            "Responsive Blinkit homepage clone using HTML, CSS, Bootstrap, jQuery & Owl Carousel with engaging UI interactions.",

        tags: ["Bootstrap", "Javascript", "JQuery", "CSS"],

        image: "/images/p4.png",
        liveUrl: "https://blinkit-homepage-clone-using-bootst.vercel.app/",
        githubUrl:
            "https://github.com/mukuljaiswal10/Blinkit-Homepage-Clone-Using-Bootstrap-Jquery",
        stats: [
            { label: "UI Blocks", value: 12, suffix: "+" },
            { label: "Carousel", value: "Yes", suffix: "" },
            { label: "Delivery", value: 4, suffix: " days" },
        ],
    },

    {
        slug: "solachey",
        title: "Solachey Homepage Clone",
        description:
            "Modern responsive front-end clone built using Bootstrap with clean UI and mobile-friendly experience.",

        tags: ["Bootstrap", "CSS","Javascript"],

        image: "/images/p5.png",
        liveUrl: "https://solachey-website-using-bootstrap.vercel.app/",
        githubUrl: "https://github.com/mukuljaiswal10/Solachey-Website-Using-Bootstrap",
        stats: [
            { label: "Responsive", value: "Yes", suffix: "" },
            { label: "Sections", value: 8, suffix: "+" },
            { label: "Delivery", value: 3, suffix: " days" },
        ],
    },

    {
        slug: "gobooktours",
        title: "Gobooktours Homepage Clone",
        description:
            "Fully responsive homepage with smooth animations and interactive UI. Clean, scalable code with hover effects.",

        tags: ["HTML", "CSS"],

        image: "/images/p6.png",
        liveUrl: "https://project-gobooktours-homepage-clone.vercel.app/",
        githubUrl: "https://github.com/mukuljaiswal10/Project-Gobooktours-Homepage-Clone",
        stats: [
            { label: "Animations", value: "Yes", suffix: "" },
            { label: "Sections", value: 9, suffix: "+" },
            { label: "Delivery", value: 4, suffix: " days" },
        ],
    },

    {
        slug: "packshit",
        title: "Packshift Homepage Clone",
        description:
            "Responsive site built with HTML & CSS featuring background images, flexbox layout and smooth UI details.",

        tags: ["HTML", "CSS"],

        image: "/images/p9.png",
        liveUrl: "https://packshifts-clone-responsive-site.vercel.app/",
        githubUrl: "https://github.com/mukuljaiswal10/Packshifts-Clone-Responsive-Site",
        stats: [
            { label: "Layout", value: "Flexbox", suffix: "" },
            { label: "Sections", value: 10, suffix: "+" },
            { label: "Delivery", value: 3, suffix: " days" },
        ],
    },

    {
        slug: "shaadi",
        title: "Shadi.com Homepage Clone",
        description:
            "Pixel-close Shaadi.com clone with fixed header, sticky nav, hover states, and clean spacing/typography.",

        tags: ["HTML", "CSS"],

        image: "/images/p11.png",
        liveUrl: "https://shaadi-homepage.vercel.app/",
        githubUrl: "https://github.com/mukuljaiswal10/shaadi-homepage",
        stats: [
            { label: "Sticky Nav", value: "Yes", suffix: "" },
            { label: "Sections", value: 11, suffix: "+" },
            { label: "Delivery", value: 4, suffix: " days" },
        ],
    },

    {
        slug: "one-page",
        title: "Single Page Website",
        description:
            "Responsive one-page website with smooth scroll navigation, flex layout, hover effects and clean structure.",

        tags: ["HTML", "CSS"],

        image: "/images/p8.png",
        liveUrl: "https://project-4-one-page-website.vercel.app/",
        githubUrl: "https://github.com/mukuljaiswal10/Project-4-One-Page-Website",
        stats: [
            { label: "Navigation", value: "Smooth scroll", suffix: "" },
            { label: "Sections", value: 6, suffix: "+" },
            { label: "Delivery", value: 2, suffix: " days" },
        ],
    },

    {
        slug: "converting-figma-to-html-landing-page",
        title: "Converting Figma Design To HTML Landing-Page",
        description:
            "Converted Figma design into a functional HTML & CSS landing page with pixel-perfect accuracy and clean UI.",

        tags: ["Figma", "CSS"],

        image: "/images/p7.png",
        liveUrl: "https://project-06-converting-figma-design.vercel.app/",
        githubUrl:
            "https://github.com/mukuljaiswal10/Project-06-Converting-Figma-Design-To-HTML-Landing-Page",
        stats: [
            { label: "Accuracy", value: "Pixel-close", suffix: "" },
            { label: "Sections", value: 7, suffix: "+" },
            { label: "Delivery", value: 3, suffix: " days" },
        ],
    },
];

export const projects = rawProjects.map((p) => {
    const slug = normalizeSlug(p.slug || p.title);

    const isWip = Boolean(p.wip);
    const isResponsive = p.responsive !== false;

    return {
        ...p,
        slug,
        tags: normalizeTags(p.tags || []),

        // ✅ Standardized status fields
        status: isWip ? "In progress" : "Completed",
        statusBadge: isWip ? (p.wipLabel || "In progress") : "Complete",

        // ✅ Device support
        responsive: isResponsive,
        responsiveBadge: isResponsive ? "Fully responsive" : (p.responsiveLabel || "Desktop-first"),
        responsiveDesc:
            p.responsiveDesc ||
            (isResponsive
                ? "Works smoothly across mobile, tablet, and desktop screens."
                : "Optimized for laptop/desktop workflows. Mobile UI is not priority."),
    };
});

/**
 * ✅ Always use this to find project
 */
export function getProjectBySlug(slugOrAny) {
    const n = normalizeSlug(slugOrAny);

    // 1) direct match
    let found = projects.find((p) => normalizeSlug(p.slug) === n);
    if (found) return found;

    // 2) sometimes user comes with title-like slug
    found = projects.find((p) => normalizeSlug(p.title) === n);
    if (found) return found;

    // 3) last fallback: includes
    found = projects.find((p) => normalizeSlug(p.slug).includes(n) || n.includes(normalizeSlug(p.slug)));
    return found || null;
}
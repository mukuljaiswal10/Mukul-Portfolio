import { normalizeTags } from "@/lib/tags";

export const projects = [
    {
        slug: "portfolio",
        title: "Portfolio Website",
        description:
            "A modern portfolio built with Next.js App Router and Tailwind CSS.",
        tags: ["Next.js", "Tailwind", "UI"],
        image: "/images/p1.png",
        liveUrl: "https://mukul-portfolio-coral.vercel.app/",
        githubUrl: "https://github.com/mukuljaiswal10/Mukul-Portfolio",
        highlights: [
            "Responsive layout (mobile to desktop)",
            "Reusable components",
            "SEO friendly structure",
        ],
        stats: [
            { label: "Performance", value: 95, suffix: "/100" },
            { label: "Pages", value: 6, suffix: "+" },
            { label: "Delivery", value: 7, suffix: " days" },
        ],
    },
    {
        slug: "furniture-eCommerce",
        title: "Furniture e-Commerce Website",
        description:
            "A modern eCommerce website built using Next.js (React framework) and Tailwind CSS. It features a fully responsive UI, desktop mega menu, mobile slide navigation, smooth animations, and clean component structure—focused on performance, scalability, and real-world UX. 🚀🛒✨",
        tags: ["Next.js", "React.js", "Tailwind-CSS"],
        image: "/images/p2.png",
        liveUrl: "https://furniture-e-commerce-app-two.vercel.app/",
        githubUrl: "https://github.com/mukuljaiswal10/Furniture-eCommerce-App",
        highlights: [
            "Responsive layout (mobile to desktop)",
            "Reusable components",
            "SEO friendly structure",
        ],
        stats: [
            { label: "Performance", value: 95, suffix: "/100" },
            { label: "Pages", value: 6, suffix: "+" },
            { label: "Delivery", value: 7, suffix: " days" },
        ],
    },
    {
        slug: "smart-city",
        title: "Smart City Website",
        description:
            "✨ Smart City Website Homepage Clone I’ve created a fully responsive and modern Smart City homepage clone using Bootstrap and jQuery 🚀. It includes smooth animations, a clean UI, mobile-friendly design, and an interactive user experience 📱💻. A perfect blend of speed, style, and smart functionality! 🌆🔥",
        tags: ["Bootstrap", "Javascript", "JQuery"],
        image: "/images/p3.png",
        liveUrl: "https://smart-city-home-page-clone-using-bo.vercel.app/",
        githubUrl:
            "https://github.com/mukuljaiswal10/Smart-City-HomePage-Clone-Using-Bootstrap-jQuery",
        highlights: [
            "Responsive layout (mobile to desktop)",
            "Reusable components",
            "SEO friendly structure",
        ],
        stats: [
            { label: "Performance", value: 95, suffix: "/100" },
            { label: "Pages", value: 6, suffix: "+" },
            { label: "Delivery", value: 7, suffix: " days" },
        ],
    },
    {
        slug: "blinkit",
        title: "Blinkit-Website",
        description:
            "⚡ A responsive Blinkit homepage clone built with 💻 HTML, 🎨 CSS, 🧩 Bootstrap, 💫 jQuery & 🦉 Owl Carousel. Features an attractive, user-friendly design with smooth animations & modern layout — showcasing front-end 💡 creativity & UI/UX skills",
        tags: ["Bootstrap", "Javascript", "JQuery", "CSS"],
        image: "/images/p4.png",
        liveUrl: "https://blinkit-homepage-clone-using-bootst.vercel.app/",
        githubUrl:
            "https://github.com/mukuljaiswal10/Blinkit-Homepage-Clone-Using-Bootstrap-Jquery",
        highlights: [
            "Responsive layout (mobile to desktop)",
            "Reusable components",
            "SEO friendly structure",
        ],
        stats: [
            { label: "Performance", value: 95, suffix: "/100" },
            { label: "Pages", value: 6, suffix: "+" },
            { label: "Delivery", value: 7, suffix: " days" },
        ],
    },
].map((p) => ({
    ...p,
    tags: normalizeTags(p.tags),
}));
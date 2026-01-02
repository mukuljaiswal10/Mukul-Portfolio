// src/app/api/search-index/route.js
import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

// ✅ OPTIONAL: agar tumhare paas projects source hai, import change kar lena
// import { getAllProjects } from "@/lib/projects";

function norm(s = "") {
    return String(s).toLowerCase().trim();
}

export async function GET() {
    // --- BLOG ---
    let posts = [];
    try {
        posts = (await getAllPosts?.()) || [];
    } catch {
        posts = [];
    }

    const blogItems = posts.map((p) => {
        const slug = p?.slug || p?.path || "";
        const title = p?.title || p?.name || "Blog";
        const tags = (p?.tags || p?.tag || []).flat().filter(Boolean);

        return {
            id: `blog_${slug || title}`,
            kind: "blog",
            label: `Blog: ${title}`,
            hint: slug ? `/blog/${slug}` : "/blog",
            href: slug ? `/blog/${slug}` : "/blog",
            keywords: [title, slug, ...tags].filter(Boolean),
            priority: 60,
        };
    });

    // tags from blogs -> chips + direct open
    const tagSet = new Set();
    posts.forEach((p) => {
        (p?.tags || []).forEach((t) => tagSet.add(norm(t)));
    });

    const tagItems = [...tagSet]
        .filter(Boolean)
        .slice(0, 60)
        .map((t) => ({
            id: `tag_${t}`,
            kind: "tag",
            label: `Tag: ${t}`,
            hint: `/blog?tag=${t}`,
            href: `/blog?tag=${t}`,
            keywords: [t, `tag ${t}`],
            priority: 40,
        }));

    // --- PROJECTS (optional) ---
    let projects = [];
    try {
        // projects = (await getAllProjects?.()) || [];
        projects = []; // abhi empty, later connect
    } catch {
        projects = [];
    }

    const projectItems = projects.map((pr) => {
        const slug = pr?.slug || pr?.id || pr?.name || "";
        const title = pr?.title || pr?.name || "Project";
        const tags = (pr?.tags || []).flat().filter(Boolean);

        return {
            id: `project_${slug || title}`,
            kind: "project",
            label: `Project: ${title}`,
            hint: slug ? `/projects/${slug}` : "/projects",
            href: slug ? `/projects/${slug}` : "/projects",
            keywords: [title, slug, ...tags].filter(Boolean),
            priority: 80, // project higher priority
        };
    });

    // chips suggestion list (top tags + some defaults)
    const popularChips = [
        "MERN",
        "WordPress",
        "Docker",
        "Nginx",
        "Security",
        "ACF",
        "CPT",
        "Architecture",
        "Deployment",
        ...[...tagSet].slice(0, 10),
    ].filter(Boolean);

    const items = [...projectItems, ...blogItems, ...tagItems];

    return NextResponse.json(
        { ok: true, items, popularChips, updatedAt: Date.now() },
        { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } }
    );
}
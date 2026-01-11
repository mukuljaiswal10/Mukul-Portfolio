// src/lib/blogData.js

import { blogPosts } from "@/data/blogPosts";

/**
 * Default fallback values (change once, apply everywhere)
 */
export const DEFAULT_AUTHOR = {
    name: "Mukul Jaiswal",
    role: "Full-Stack & WordPress Developer",
};

// Make sure this file exists in: public/blog/default-og.jpg
export const DEFAULT_COVER_IMAGE = "/blog/default-og.jpg";

/**
 * Normalize a single post:
 * - excerpt fallback
 * - updated fallback to date
 * - author fallback to DEFAULT_AUTHOR
 * - coverImage fallback to DEFAULT_COVER_IMAGE
 * - readMins fallback (if missing)
 */
export function normalizePost(post) {
    return {
        ...post,
        excerpt: post.excerpt || post.description || "",
        updated: post.updated || post.date,
        author: post.author || DEFAULT_AUTHOR,
        coverImage: post.coverImage || DEFAULT_COVER_IMAGE,
        readMins: post.readMins ?? post.readingMinutes ?? 3,
        tags: Array.isArray(post.tags) ? post.tags : [],
        category: post.category || "Blog",
    };
}

/**
 * Get all normalized posts
 */
export function getAllPosts() {
    return blogPosts.map(normalizePost);
}

/**
 * Get one post by slug (normalized)
 */
export function getPostBySlug(slug) {
    const post = blogPosts.find((p) => p.slug === slug);
    return post ? normalizePost(post) : null;
}

/**
 * Prev/Next (by date: newest first)
 */
export function getPrevNext(slug) {
    const posts = getAllPosts().sort((a, b) => +new Date(b.date) - +new Date(a.date));
    const idx = posts.findIndex((p) => p.slug === slug);
    return {
        prev: idx < posts.length - 1 ? posts[idx + 1] : null,
        next: idx > 0 ? posts[idx - 1] : null,
    };
}

/**
 * Related posts (by tag overlap)
 */
export function getRelatedPosts(slug, limit = 3) {
    const posts = getAllPosts();
    const current = posts.find((p) => p.slug === slug);
    if (!current) return [];

    const tagSet = new Set((current.tags || []).map((t) => String(t).toLowerCase()));

    return posts
        .filter((p) => p.slug !== slug)
        .map((p) => {
            const score = (p.tags || []).reduce(
                (acc, t) => acc + (tagSet.has(String(t).toLowerCase()) ? 1 : 0),
                0
            );
            return { p, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((x) => x.p);
}
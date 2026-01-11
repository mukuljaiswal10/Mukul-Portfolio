"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import TableOfContents from "./TableOfContents";
import ShareBar from "./ShareBar";
import ReadingProgress from "./ReadingProgress";
import RelatedPosts from "./RelatedPosts";
import NextPrevNav from "./NextPrevNav";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
// ✅ New feature components
import LikeButton from "./LikeButton";
import AuthorCard from "./AuthorCard";
import NewsletterForm from "./NewsletterForm";
import Comments from "./Comments";
import CodeCopyEnhancer from "./CodeCopyEnhancer";

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

export default function BlogPostClient({
  post,
  toc = [],
  related = [],
  adjacent,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const fullUrl = useMemo(() => {
    if (!mounted) return "";
    return window.location.href;
  }, [mounted]);

  const readTime = post?.readTime ?? post?.readMins ?? 3;
  const updated = post?.updated ? formatDate(post.updated) : null;

  const crumbs = [
    { label: "Blog", href: "/blog" },
    // { label: post.title },
  ];

  return (
    <div className="relative">
      {/* reading progress */}
      <ReadingProgress />

      <div className="mb-4">
        <Breadcrumbs items={crumbs} />
      </div>

      {/* ✅ add copy buttons to code blocks */}
      <CodeCopyEnhancer />

      {/* top meta */}
      <div className="relative overflow-hidden rounded-3xl border border-border/12 bg-foreground/[0.02] p-6 sm:p-8">
        <div
          className={[
            "pointer-events-none absolute inset-0",
            post.coverStyle || "",
          ].join(" ")}
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/70">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E7C266]/25 bg-[#E7C266]/[0.08] px-3 py-1 text-[#E7C266]">
              {post.category}
            </span>

            <span>{formatDate(post.date)}</span>
            <span>•</span>
            <span>{readTime} min read</span>

            {updated ? (
              <>
                <span>•</span>
                <span>Updated {updated}</span>
              </>
            ) : null}
          </div>

          <h1 className="mt-4 text-3xl font-semibold leading-tight text-[#E7C266] sm:text-5xl">
            {post.title}
          </h1>

          <p className="mt-3 max-w-3xl text-sm text-foreground/75 sm:text-base">
            {post.excerpt}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(post.tags || []).map((t) => (
              <span
                key={t}
                className="rounded-full border border-border/15 bg-black/25 px-3 py-1 text-[11px] text-foreground/75"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/blog"
              className="rounded-full border border-border/15 bg-foreground/[0.03] px-5 py-2.5 text-sm text-foreground/75 hover:bg-foreground/[0.06]"
            >
              ← Back to Blog
            </Link>

            {/* Share buttons */}
            <ShareBar title={post.title} url={fullUrl} />

            {/* ✅ Like button */}
            <LikeButton slug={post.slug} />
          </div>
        </div>
      </div>

      {/* content + toc */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <TableOfContents toc={toc} />
        </aside>

        <article className="lg:col-span-8">
          <div className="rounded-3xl border border-border/12 bg-foreground/[0.02] p-6 sm:p-8">
            <div
              className={[
                "prose prose-invert max-w-none",
                "prose-headings:text-foreground prose-p:text-foreground/80 prose-li:text-foreground/75",
                "prose-a:text-[#E7C266] prose-a:no-underline hover:prose-a:underline",
                "prose-pre:bg-black/40 prose-pre:border prose-pre:border-border/15 prose-code:text-foreground",
              ].join(" ")}
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          </div>

          {/* ✅ Author card + CTA */}
          <div className="mt-10">
            <AuthorCard author={post.author} />
          </div>

          {/* ✅ Newsletter */}
          <div className="mt-10">
            <NewsletterForm />
          </div>

          <div className="mt-10">
            <NextPrevNav adjacent={adjacent} />
          </div>

          <div className="mt-8">
            <RelatedPosts related={related} />
          </div>

          {/* ✅ Comments */}
          <div className="mt-12">
            <Comments key={post.slug} slug={post.slug} />
          </div>
        </article>
      </div>
    </div>
  );
}

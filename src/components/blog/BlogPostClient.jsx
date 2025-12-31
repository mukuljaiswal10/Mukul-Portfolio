"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import TableOfContents from "./TableOfContents";
import ShareBar from "./ShareBar";
import ReadingProgress from "./ReadingProgress";
import RelatedPosts from "./RelatedPosts";
import NextPrevNav from "./NextPrevNav";

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

  return (
    <div className="relative">
      {/* reading progress */}
      <ReadingProgress />

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
            <span>{post.readTime} min read</span>
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

            <ShareBar title={post.title} url={fullUrl} />
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

          <div className="mt-6">
            <NextPrevNav adjacent={adjacent} />
          </div>

          <div className="mt-8">
            <RelatedPosts related={related} />
          </div>
        </article>
      </div>
    </div>
  );
}


"use client";

import { useMemo } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import SectionHeading from "@/components/shared/SectionHeading";
import LuxuryButton from "@/components/ui/LuxuryButton";
import { getAllPosts } from "@/lib/blog";

function toText(s = "") {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim();
}

function getTop2Posts() {
  const posts = getAllPosts?.() || [];

  // date sorting safe (agar date nahi hai to as-is)
  const sorted = [...posts].sort((a, b) => {
    const da = a?.date ? new Date(a.date).getTime() : 0;
    const db = b?.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });

  return sorted.slice(0, 2);
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1 text-[11px] text-foreground/80">
      {children}
    </span>
  );
}

function BlogCard({ post }) {
  const title = toText(post?.title);
  const excerpt = toText(post?.excerpt || post?.description || "");
  const slug = post?.slug;
  const href = slug ? `/blog/${slug}` : "/blog";
  const tags = (post?.tags || []).slice(0, 3);

  return (
    <Card className="group h-full overflow-hidden">
      <div className="flex h-full flex-col">
        {/* top mini header */}
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/12 bg-foreground/[0.03] px-3 py-1 text-xs text-foreground/80">
            Blog
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
            Read
          </span>

          {post?.date ? (
            <span className="text-xs text-muted/60">{post.date}</span>
          ) : (
            <span className="text-xs text-muted/60">Latest</span>
          )}
        </div>

        {/* title */}
        <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">
          {title || "Untitled post"}
        </h3>

        {/* excerpt */}
        <p className="mt-2 line-clamp-3 text-sm text-muted/70">
          {excerpt || "Practical notes, checklists & real-world patterns."}
        </p>

        {/* tags */}
        {tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        ) : null}

        {/* actions */}
        <div className="mt-5 flex items-center gap-3">
          <Link
            href={href}
            className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-xs text-foreground/85 transition hover:bg-foreground/[0.06]"
          >
            Read →
          </Link>

          <span className="text-xs text-muted/60">
            {post?.category ? `• ${post.category}` : ""}
          </span>
        </div>

        {/* subtle hover glow */}
        <span
          aria-hidden
          className="pointer-events-none mt-auto block h-px w-full bg-gradient-to-r from-transparent via-foreground/25 to-transparent opacity-0 transition duration-500 group-hover:opacity-100"
        />
      </div>
    </Card>
  );
}

export default function BlogPreviewSection({ id = "blog-preview" }) {
  const topPosts = useMemo(() => getTop2Posts(), []);

  return (
    <section id={id} className="relative scroll-mt-24 py-16 md:py-20">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-foreground/10 blur-3xl" />
      </div>

      <Container className="relative">
        <Parallax from={10} to={-10}>
          <Reveal>
            <SectionHeading
              eyebrow="Blogs"
              title="Latest articles & checklists"
              desc="Practical notes for Next.js, MERN, WordPress, deployment & performance."
            />
          </Reveal>
        </Parallax>

        {/* cards */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {topPosts?.length ? (
            topPosts.map((p) => (
              <Reveal key={p.slug || p.title} delay={0.08}>
                <BlogCard post={p} />
              </Reveal>
            ))
          ) : (
            <Reveal delay={0.08}>
              <Card className="md:col-span-2">
                <p className="text-sm text-muted/70">
                  No posts found. Add a few blog posts in your blog data, then
                  this section will auto-show.
                </p>
              </Card>
            </Reveal>
          )}
        </div>

        {/* button */}
        <Reveal delay={0.18}>
          <div className="mt-7">
            <LuxuryButton href="/blog" variant="outline">
              View all blogs →
            </LuxuryButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

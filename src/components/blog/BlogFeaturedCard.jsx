// src/components/blog/BlogFeaturedCard.jsx
import Link from "next/link";

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

export default function BlogFeaturedCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="relative block overflow-hidden rounded-3xl border border-border/12 bg-foreground/[0.02] p-6 hover:border-[#E7C266]/25 transition"
    >
      <div
        className={["absolute inset-0 opacity-100", post.coverStyle || ""].join(
          " "
        )}
      />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/70">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/15 bg-black/25 px-3 py-1">
            {post.category}
          </span>
          <span>{formatDate(post.date)}</span>
          <span>•</span>
          <span>{post.readTime} min read</span>
        </div>

        <h2 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
          {post.title}
        </h2>

        <p className="mt-2 max-w-3xl text-sm text-foreground/75 sm:text-base">
          {post.excerpt}
        </p>

        <div className="mt-4 text-sm text-[#E7C266]">
          Read featured{" "}
          <span className="inline-block transition group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

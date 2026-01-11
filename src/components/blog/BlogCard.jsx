// src/components/blog/BlogCard.jsx
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

export default function BlogCard({ post }) {
  return (
    <Link
     href={`/blog/${encodeURIComponent(post.slug)}`}
      className={[
        "group relative overflow-hidden rounded-2xl border border-border/12 bg-foreground/[0.02]",
        "hover:border-[#E7C266]/25 hover:bg-foreground/[0.03]",
        "transition",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition",
          post.coverStyle || "",
        ].join(" ")}
      />
      <div className="relative p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/15 bg-black/25 px-3 py-1 text-[11px] text-foreground/75">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E7C266]" />
            {post.category}
          </span>

          <span className="text-[11px] text-foreground/60">
            {formatDate(post.date)} • {post.readTime} min read
          </span>
        </div>

        <h3 className="mt-4 line-clamp-2 text-lg font-semibold text-foreground">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm text-foreground/70">
          {post.excerpt}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(post.tags || []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1 text-[11px] text-foreground/70"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 text-sm text-[#E7C266]">
          Read article{" "}
          <span className="inline-block transition group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

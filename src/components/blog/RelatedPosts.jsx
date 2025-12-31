import Link from "next/link";

export default function RelatedPosts({ related = [] }) {
  if (!related?.length) return null;

  return (
    <div className="rounded-3xl border border-border/12 bg-foreground/[0.02] p-6">
      <p className="text-sm font-semibold text-foreground">Related articles</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {related.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="rounded-2xl border border-border/12 bg-foreground/[0.02] p-4 hover:border-[#E7C266]/20 hover:bg-foreground/[0.03] transition"
          >
            <p className="text-xs text-foreground/55">{p.category}</p>
            <p className="mt-2 line-clamp-2 text-sm font-semibold text-foreground">
              {p.title}
            </p>
            <p className="mt-2 text-xs text-foreground/60">
              {p.readTime} min read
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

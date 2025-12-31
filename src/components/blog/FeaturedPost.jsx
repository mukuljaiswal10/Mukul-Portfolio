import Link from "next/link";

export default function FeaturedPost({ post }) {
  if (!post) return null;

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-border/15 bg-background/35 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#E7C266]/25 via-transparent to-transparent" />
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60">
          <span className="rounded-full border border-border/20 bg-foreground/[0.03] px-3 py-1 text-foreground/80">
            {post.category}
          </span>
          <span>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
            {"  •  "}
            {post.readMins} min read
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
          {post.title}
        </h2>

        <p className="mt-3 max-w-3xl text-sm text-foreground/70 sm:text-base">
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#E7C266] hover:text-[#F2D487]"
        >
          Read featured <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

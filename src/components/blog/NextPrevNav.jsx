import Link from "next/link";

function Item({ label, p }) {
  if (!p) return null;
  return (
    <Link
      href={`/blog/${p.slug}`}
      className="rounded-2xl border border-border/12 bg-foreground/[0.02] p-4 hover:border-[#E7C266]/20 hover:bg-foreground/[0.03] transition"
    >
      <p className="text-xs text-foreground/55">{label}</p>
      <p className="mt-2 line-clamp-2 text-sm font-semibold text-foreground">
        {p.title}
      </p>
      <p className="mt-2 text-xs text-foreground/60">
        {p.category} • {p.readTime} min
      </p>
    </Link>
  );
}

export default function NextPrevNav({ adjacent }) {
  const prev = adjacent?.prev || null;
  const next = adjacent?.next || null;

  if (!prev && !next) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Item label="← Previous" p={prev} />
      <Item label="Next →" p={next} />
    </div>
  );
}

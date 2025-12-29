import Link from "next/link";

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="mb-6 text-sm text-white/60">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-white">
            Home
          </Link>
        </li>
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className="text-white/30">/</span>
            {it.href ? (
              <Link href={it.href} className="hover:text-white">
                {it.label}
              </Link>
            ) : (
              <span className="text-white/80">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

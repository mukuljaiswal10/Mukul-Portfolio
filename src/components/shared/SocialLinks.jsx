import Link from "next/link";

const socials = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
];

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-3">
      {socials.map((s) => (
        <Link
          key={s.label}
          href={s.href}
          target="_blank"
          className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
        >
          {s.label}
        </Link>
      ))}
    </div>
  );
}

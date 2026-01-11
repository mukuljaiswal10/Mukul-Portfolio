import Image from "next/image";
import Link from "next/link";

export default function AuthorCard({ author }) {
  const name = author?.name || "Mukul Jaiswal";
  const role = author?.role || "Full-stack & WordPress Developer";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/12 p-5 sm:flex-row sm:items-center">
      <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#E7C266]/25 bg-[#E7C266]/10">
        <Image
          src="/profile/mukul.jpg"
          alt={name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex-1">
        <p className="font-medium text-white/90">{name}</p>
        <p className="text-sm text-white/70">{role}</p>
      </div>

      <Link
        href="/contact"
        className="inline-flex justify-center rounded-xl border border-white/15 px-4 py-2 hover:border-white/30"
      >
        Hire Me
      </Link>
    </div>
  );
}

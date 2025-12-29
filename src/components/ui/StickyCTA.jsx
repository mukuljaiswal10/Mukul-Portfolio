"use client";

import Link from "next/link";

export default function StickyCTA() {
  return (
    <div className="fixed bottom-3 left-0 right-0 z-50 px-3 md:hidden">
      <div className="mx-auto flex max-w-6xl gap-2 rounded-2xl border border-white/10 bg-black/70 p-2 backdrop-blur">
        <Link
          href="/contact"
          className="flex-1 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-black active:scale-[0.99]"
        >
          Contact
        </Link>

        <a
          href="https://wa.me/91XXXXXXXXXX"
          target="_blank"
          className="flex-1 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-center text-sm font-semibold text-white active:scale-[0.99]"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}

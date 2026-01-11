"use client";

import { useEffect, useMemo, useState } from "react";

export default function LikeButton({ slug }) {
  if (!slug) return null;
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  const key = useMemo(() => `liked:${slug}`, [slug]);

  useEffect(() => {
    if (!slug) return;

    // total likes
    fetch(`/api/likes/${slug}`)
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? 0))
      .catch(() => {});

    // per-device liked flag
    try {
      setLiked(localStorage.getItem(key) === "1");
    } catch {}
  }, [slug, key]);

  const likeOnce = async () => {
    if (liked || loading) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/likes/${slug}`, { method: "POST" });
      const d = await res.json();

      setCount(d.count ?? count + 1);
      setLiked(true);

      try {
        localStorage.setItem(key, "1");
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={likeOnce}
      disabled={liked || loading}
      className={[
        "group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm",
        "border border-white/15 bg-black/20 text-white/85",
        "hover:border-white/30 hover:bg-black/30 transition",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-[#E7C266]/35",
      ].join(" ")}
      title={liked ? "You already liked" : "Like this post"}
    >
      <span
        className={[
          "inline-flex h-7 w-7 items-center justify-center rounded-full",
          "border border-white/15 bg-black/25 transition",
          liked ? "text-[#E7C266]" : "text-white/80 group-hover:text-[#E7C266]",
        ].join(" ")}
      >
        {liked ? "✓" : "👍"}
      </span>

      <span className="font-medium tracking-wide">
        {liked ? "Liked" : loading ? "Liking..." : "Like"}
      </span>

      <span className="ml-1 inline-flex items-center rounded-full border border-white/15 bg-black/25 px-2 py-0.5 text-[12px] text-white/75">
        {count}
      </span>
    </button>
  );
}

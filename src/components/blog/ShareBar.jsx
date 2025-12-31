"use client";

import { useState } from "react";

export default function ShareBar({ title = "", url = "" }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const openShare = (type) => {
    if (!url) return;
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(title);

    if (type === "wa")
      window.open(
        `https://wa.me/?text=${t}%20${u}`,
        "_blank",
        "noopener,noreferrer"
      );
    if (type === "li")
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
        "_blank",
        "noopener,noreferrer"
      );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onCopy}
        className="rounded-full border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/75 hover:bg-foreground/[0.06]"
      >
        {copied ? "Copied ✓" : "Copy link"}
      </button>

      <button
        onClick={() => openShare("wa")}
        className="rounded-full border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/75 hover:bg-foreground/[0.06]"
      >
        WhatsApp
      </button>

      <button
        onClick={() => openShare("li")}
        className="rounded-full border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/75 hover:bg-foreground/[0.06]"
      >
        LinkedIn
      </button>
    </div>
  );
}

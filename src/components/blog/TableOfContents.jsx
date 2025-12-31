"use client";

export default function TableOfContents({ toc = [] }) {
  const has = Array.isArray(toc) && toc.length > 0;

  const onJump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="rounded-3xl border border-border/12 bg-foreground/[0.02] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">On this page</p>
        <span className="text-[11px] text-foreground/55">TOC</span>
      </div>

      {!has ? (
        <p className="mt-3 text-sm text-foreground/65">
          No headings found. Add <b>&lt;h2&gt;</b> or <b>&lt;h3&gt;</b> in
          content.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {toc.map((h) => (
            <button
              key={h.id}
              onClick={() => onJump(h.id)}
              className={[
                "w-full rounded-xl border border-border/12 bg-foreground/[0.02] px-3 py-2 text-left text-sm text-foreground/75",
                "hover:bg-foreground/[0.05] transition",
                h.level === 3 ? "ml-4" : "",
              ].join(" ")}
            >
              {h.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PostContent({ blocks }) {
  return (
    <div className="prose prose-invert max-w-none prose-p:text-foreground/75 prose-li:text-foreground/75">
      {(blocks || []).map((b, i) => {
        if (b.type === "h2")
          return (
            <h2 key={b.id || i} id={b.id} className="scroll-mt-28">
              {b.text}
            </h2>
          );
        if (b.type === "h3")
          return (
            <h3 key={b.id || i} id={b.id} className="scroll-mt-28">
              {b.text}
            </h3>
          );
        if (b.type === "p") return <p key={i}>{b.text}</p>;
        if (b.type === "ul")
          return (
            <ul key={i}>
              {(b.items || []).map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          );
        if (b.type === "quote")
          return (
            <blockquote key={i} className="border-l-2 border-[#E7C266]/40">
              {b.text}
            </blockquote>
          );
        if (b.type === "code")
          return (
            <pre
              key={i}
              className="rounded-2xl border border-border/15 bg-black/40 p-4"
            >
              <code>{b.code}</code>
            </pre>
          );
        if (b.type === "callout") {
          const gold =
            b.tone === "gold"
              ? "border-[#E7C266]/35 bg-[#E7C266]/10"
              : "border-border/15 bg-foreground/[0.03]";
          return (
            <div key={i} className={`not-prose rounded-2xl border p-4 ${gold}`}>
              <p className="text-sm font-semibold text-foreground">{b.title}</p>
              <p className="mt-1 text-sm text-foreground/70">{b.text}</p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

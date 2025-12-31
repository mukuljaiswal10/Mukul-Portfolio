// // src/components/blog/BlogCard.jsx
// import Link from "next/link";

// function Tag({ children }) {
//   return (
//     <span className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1 text-[11px] text-foreground/75 backdrop-blur">
//       {children}
//     </span>
//   );
// }

// export default function BlogCard({ post }) {
//   return (
//     <article className="group relative overflow-hidden rounded-3xl border border-border/15 bg-foreground/[0.02] backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,0.35)] transition">
//       {/* cover */}
//       <div
//         className={[
//           "h-40 w-full border-b border-border/10",
//           post?.cover?.className || "bg-foreground/[0.03]",
//         ].join(" ")}
//       />

//       <div className="p-5">
//         <div className="flex items-center gap-3 text-xs text-foreground/65">
//           <span className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1">
//             {post.category}
//           </span>
//           <span>
//             {new Date(post.date).toLocaleDateString("en-US", {
//               month: "short",
//               day: "2-digit",
//               year: "numeric",
//             })}
//           </span>
//           <span>•</span>
//           <span>{post.readTime}</span>
//         </div>

//         <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">
//           {post.title}
//         </h3>

//         <p className="mt-2 line-clamp-3 text-sm text-foreground/70">
//           {post.excerpt}
//         </p>

//         {/* tags */}
//         {post.tags?.length ? (
//           <div className="mt-4 flex flex-wrap gap-2">
//             {post.tags.slice(0, 3).map((t) => (
//               <Tag key={t}>{t}</Tag>
//             ))}
//           </div>
//         ) : null}

//         {/* ✅ Read button: IMPORTANT */}
//         <div className="mt-5">
//           <Link
//             href={`/blog/${post.slug}`}
//             className="inline-flex items-center gap-2 text-sm font-medium text-[rgba(255,215,128,0.95)] hover:text-[rgba(255,235,170,1)] transition"
//           >
//             Read article{" "}
//             <span className="transition group-hover:translate-x-1">→</span>
//           </Link>
//         </div>
//       </div>

//       {/* shine */}
//       <div className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition duration-700 group-hover:opacity-100 group-hover:translate-x-[520px]" />
//     </article>
//   );
// }

// import Link from "next/link";

// const toneMap = {
//   gold: "from-[#E7C266]/25 via-transparent to-transparent",
//   blue: "from-sky-400/15 via-transparent to-transparent",
//   green: "from-emerald-400/15 via-transparent to-transparent",
//   purple: "from-violet-400/15 via-transparent to-transparent",
// };

// export default function BlogCard({ post }) {
//   const tone = post?.cover?.tone || "gold";

//   return (
//     <article className="group relative overflow-hidden rounded-3xl border border-border/15 bg-background/40 backdrop-blur-xl">
//       {/* soft premium glow */}
//       <div
//         className={[
//           "pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100",
//           "bg-gradient-to-br",
//           toneMap[tone] || toneMap.gold,
//         ].join(" ")}
//       />

//       <div className="relative p-5 sm:p-6">
//         <div className="flex items-center justify-between gap-3">
//           <span className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-foreground/[0.03] px-3 py-1 text-xs text-foreground/80">
//             <span className="h-1.5 w-1.5 rounded-full bg-[#E7C266]/90" />
//             {post.category}
//           </span>

//           <span className="text-xs text-foreground/55">
//             {new Date(post.date).toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "short",
//               day: "2-digit",
//             })}
//             {"  •  "}
//             {post.readMins} min read
//           </span>
//         </div>

//         <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">
//           {post.title}
//         </h3>

//         <p className="mt-2 line-clamp-3 text-sm text-foreground/70">
//           {post.excerpt}
//         </p>

//         <div className="mt-4 flex flex-wrap gap-2">
//           {(post.tags || []).slice(0, 3).map((t) => (
//             <span
//               key={t}
//               className="rounded-full border border-border/18 bg-foreground/[0.03] px-3 py-1 text-[11px] text-foreground/70"
//             >
//               {t}
//             </span>
//           ))}
//         </div>

//         <Link
//           href={`/blog/${post.slug}`}
//           className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#E7C266] hover:text-[#F2D487]"
//         >
//           Read article <span aria-hidden>→</span>
//         </Link>
//       </div>
//     </article>
//   );
// }

// src/components/blog/BlogCard.jsx
import Link from "next/link";

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

export default function BlogCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={[
        "group relative overflow-hidden rounded-2xl border border-border/12 bg-foreground/[0.02]",
        "hover:border-[#E7C266]/25 hover:bg-foreground/[0.03]",
        "transition",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition",
          post.coverStyle || "",
        ].join(" ")}
      />
      <div className="relative p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/15 bg-black/25 px-3 py-1 text-[11px] text-foreground/75">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E7C266]" />
            {post.category}
          </span>

          <span className="text-[11px] text-foreground/60">
            {formatDate(post.date)} • {post.readTime} min read
          </span>
        </div>

        <h3 className="mt-4 line-clamp-2 text-lg font-semibold text-foreground">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm text-foreground/70">
          {post.excerpt}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(post.tags || []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-border/15 bg-foreground/[0.03] px-3 py-1 text-[11px] text-foreground/70"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 text-sm text-[#E7C266]">
          Read article{" "}
          <span className="inline-block transition group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

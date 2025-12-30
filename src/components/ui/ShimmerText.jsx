// "use client";

// import { useMemo } from "react";

// export default function ShimmerText({ text = "" }) {
//   // stable delays (random-like but fixed on every render)
//   const delays = useMemo(() => {
//     const arr = [];
//     for (let i = 0; i < text.length; i++) {
//       // deterministic pseudo-random delay based on index + char code
//       const code = text.charCodeAt(i) || 0;
//       const v = (i * 37 + code * 13) % 120; // 0..119
//       arr.push((v / 100).toFixed(2)); // 0.00..1.19s
//     }
//     return arr;
//   }, [text]);

//   return (
//     <span className="shimmer-word" aria-label={text}>
//       {text.split("").map((ch, i) => {
//         if (ch === " ") return <span key={i}>&nbsp;</span>;
//         return (
//           <span
//             key={i}
//             className="shimmer-letter"
//             style={{ ["--d"]: `${delays[i]}s` }}
//           >
//             {ch}
//           </span>
//         );
//       })}
//     </span>
//   );
// }

"use client";
import { motion } from "framer-motion";

export default function ShimmerText({ text, className = "" }) {
  return (
    <span className={`relative inline-block ${className}`}>
      {/* base text */}
      <span className="relative z-[1]">{text}</span>

      {/* shimmer overlay */}
      <motion.span
        aria-hidden
        className="
          pointer-events-none absolute inset-0 z-[2] select-none
          text-transparent
          bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.95),transparent)]
          bg-[length:260%_100%]
          [background-clip:text] [-webkit-background-clip:text]
          mix-blend-screen
        "
        initial={{ backgroundPosition: "200% 0" }}
        animate={{ backgroundPosition: "-200% 0" }}
        transition={{
          duration: 1.4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1.0,
        }}
      >
        {text}
      </motion.span>
    </span>
  );
}

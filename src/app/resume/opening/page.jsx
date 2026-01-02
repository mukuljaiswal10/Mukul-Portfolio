// // ✅ FILE: src/app/resume/opening/page.jsx
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// function useReducedMotion() {
//   const [reduce, setReduce] = useState(false);
//   useEffect(() => {
//     const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
//     const onChange = () => setReduce(!!mq.matches);
//     onChange();
//     mq.addEventListener?.("change", onChange);
//     return () => mq.removeEventListener?.("change", onChange);
//   }, []);
//   return reduce;
// }

// function Sparkles({ count = 12, reduceMotion = false }) {
//   const items = useMemo(() => {
//     return Array.from({ length: count }).map((_, i) => ({
//       id: i,
//       x: (Math.random() - 0.5) * 280,
//       y: (Math.random() - 0.5) * 220,
//       s: 0.7 + Math.random() * 1.1,
//       d: Math.random() * 0.35,
//     }));
//   }, [count]);

//   if (reduceMotion) return null;

//   return (
//     <div className="pointer-events-none absolute inset-0">
//       {items.map((p) => (
//         <motion.span
//           key={p.id}
//           className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFE7A3]/70"
//           initial={{ opacity: 0, x: 0, y: 0, scale: 0.7 }}
//           animate={{
//             opacity: [0, 0.9, 0],
//             x: p.x,
//             y: p.y,
//             scale: p.s,
//           }}
//           transition={{
//             duration: 1.35,
//             delay: p.d,
//             repeat: Infinity,
//             repeatDelay: 0.35,
//             ease: [0.16, 1, 0.3, 1],
//           }}
//           style={{
//             filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.45))",
//           }}
//         />
//       ))}
//     </div>
//   );
// }

// function OrbRing({ reduceMotion }) {
//   return (
//     <motion.div
//       className="absolute inset-0 grid place-items-center"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.35, ease: "easeOut" }}
//     >
//       {/* outer ring */}
//       <motion.div
//         aria-hidden
//         className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-full"
//         animate={
//           reduceMotion
//             ? {}
//             : {
//                 rotate: 360,
//               }
//         }
//         transition={
//           reduceMotion
//             ? {}
//             : { duration: 7.5, repeat: Infinity, ease: "linear" }
//         }
//       >
//         <div className="absolute inset-0 rounded-full border border-white/10" />

//         <div
//           className="absolute -inset-[22px] rounded-full blur-3xl opacity-70"
//           style={{
//             background:
//               "conic-gradient(from 120deg, rgba(255,215,90,0.0), rgba(255,215,90,0.35), rgba(255,215,90,0.0), rgba(255,215,90,0.22), rgba(255,215,90,0.0))",
//           }}
//         />

//         {/* orbit dots */}
//         {!reduceMotion ? (
//           <>
//             <motion.span
//               className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#FFD54A]"
//               animate={{ scale: [1, 1.45, 1], opacity: [0.7, 1, 0.7] }}
//               transition={{
//                 duration: 1.6,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//               style={{
//                 filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.45))",
//               }}
//             />
//             <motion.span
//               className="absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/70"
//               animate={{ opacity: [0.2, 0.9, 0.2] }}
//               transition={{
//                 duration: 1.2,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//                 delay: 0.3,
//               }}
//             />
//             <motion.span
//               className="absolute left-5 bottom-10 h-1.5 w-1.5 rounded-full bg-white/60"
//               animate={{ opacity: [0.2, 0.85, 0.2] }}
//               transition={{
//                 duration: 1.4,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//                 delay: 0.55,
//               }}
//             />
//           </>
//         ) : null}
//       </motion.div>

//       {/* center orb */}
//       <motion.div
//         className="absolute grid place-items-center"
//         animate={
//           reduceMotion
//             ? {}
//             : {
//                 scale: [1, 1.03, 1],
//               }
//         }
//         transition={
//           reduceMotion
//             ? {}
//             : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
//         }
//       >
//         <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur">
//           <div
//             className="absolute -inset-10 rounded-[28px] blur-3xl opacity-70"
//             style={{
//               background:
//                 "radial-gradient(circle at 30% 20%, rgba(255,215,90,0.28), transparent 60%)",
//             }}
//           />
//           <div className="absolute inset-[1px] rounded-[14px] border border-white/10" />

//           <motion.div
//             className="absolute inset-0 grid place-items-center"
//             initial={{ opacity: 0, y: 6, filter: "blur(8px)" }}
//             animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//             transition={{ duration: 0.35, ease: "easeOut" }}
//           >
//             <span className="text-2xl sm:text-3xl">📄</span>
//           </motion.div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// export default function ResumeOpeningPage() {
//   const reduceMotion = useReducedMotion();

//   // ✅ little "status" message loop
//   const messages = useMemo(
//     () => [
//       "Preparing secure link…",
//       "Verifying access…",
//       "Almost there…",
//       "Opening resume…",
//     ],
//     []
//   );
//   const [idx, setIdx] = useState(0);

//   useEffect(() => {
//     if (reduceMotion) return;
//     const t = setInterval(() => {
//       setIdx((p) => (p + 1) % messages.length);
//     }, 900);
//     return () => clearInterval(t);
//   }, [messages.length, reduceMotion]);

//   return (
//     <div className="min-h-[100svh] bg-[#07080B] text-white">
//       {/* background */}
//       <div className="pointer-events-none fixed inset-0">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,215,90,0.12),transparent_60%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(120,180,255,0.08),transparent_60%)]" />
//         <motion.div
//           aria-hidden
//           className="absolute -inset-40 opacity-40 blur-3xl"
//           style={{
//             background:
//               "conic-gradient(from 180deg, rgba(255,215,90,0.08), rgba(255,255,255,0.02), rgba(120,180,255,0.06), rgba(255,215,90,0.08))",
//           }}
//           animate={reduceMotion ? {} : { rotate: 360 }}
//           transition={
//             reduceMotion
//               ? {}
//               : { duration: 18, repeat: Infinity, ease: "linear" }
//           }
//         />
//       </div>

//       {/* content */}
//       <div className="relative mx-auto flex min-h-[100svh] max-w-3xl items-center justify-center px-5">
//         <div className="w-full">
//           {/* glass card */}
//           <motion.div
//             initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(12px)" }}
//             animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
//             transition={{ duration: 0.28, ease: "easeOut" }}
//             className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035] p-6 sm:p-8 backdrop-blur"
//             style={{
//               boxShadow: "0 35px 120px rgba(0,0,0,0.72)",
//             }}
//           >
//             {/* top luxury line */}
//             <div className="absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)] opacity-80" />

//             {/* hero */}
//             <div className="relative">
//               <div className="relative h-56 sm:h-64">
//                 <Sparkles count={14} reduceMotion={reduceMotion} />
//                 <OrbRing reduceMotion={reduceMotion} />
//               </div>

//               <div className="mt-4 text-center">
//                 <p className="text-xs text-white/55">AI-secured access</p>

//                 <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
//                   Opening Resume
//                   <span className="text-[#FFD54A]">…</span>
//                 </h1>

//                 <AnimatePresence mode="wait">
//                   <motion.p
//                     key={idx}
//                     initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
//                     animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//                     exit={{ opacity: 0, y: -6, filter: "blur(8px)" }}
//                     transition={{ duration: 0.22, ease: "easeOut" }}
//                     className="mt-2 text-sm text-white/70"
//                   >
//                     {messages[idx]}
//                   </motion.p>
//                 </AnimatePresence>

//                 {/* progress bar */}
//                 <div className="mt-5">
//                   <div className="relative h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.03]">
//                     <motion.div
//                       className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-[#FFD54A]/70"
//                       animate={reduceMotion ? {} : { x: ["-40%", "260%"] }}
//                       transition={
//                         reduceMotion
//                           ? {}
//                           : {
//                               duration: 1.25,
//                               repeat: Infinity,
//                               ease: "easeInOut",
//                             }
//                       }
//                       style={{
//                         filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.35))",
//                       }}
//                     />
//                   </div>

//                   <p className="mt-2 text-[11px] text-white/50">
//                     If nothing happens, go back and allow popups for this site.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* footer note */}
//             <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
//               <span className="text-xs text-white/70">
//                 Tip: You can close this tab after resume opens.
//               </span>
//               <span className="text-xs text-white/55">
//                 Secure link • auto-expire
//               </span>
//             </div>
//           </motion.div>

//           {/* bottom tiny brand */}
//           <p className="mt-4 text-center text-[11px] text-white/35">
//             Mukul • Premium Resume Gate
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// ✅ FILE: src/app/resume/opening/page.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduce(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduce;
}

function Sparkles({ count = 12, reduceMotion = false }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 280,
        y: (Math.random() - 0.5) * 220,
        s: 0.7 + Math.random() * 1.1,
        d: Math.random() * 0.35,
      })),
    [count]
  );

  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0">
      {items.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFE7A3]/70"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.7 }}
          animate={{
            opacity: [0, 0.9, 0],
            x: p.x,
            y: p.y,
            scale: p.s,
          }}
          transition={{
            duration: 1.35,
            delay: p.d,
            repeat: Infinity,
            repeatDelay: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.45))",
          }}
        />
      ))}
    </div>
  );
}

function OrbRing({ reduceMotion }) {
  return (
    <motion.div
      className="absolute inset-0 grid place-items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        aria-hidden
        className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-full"
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={
          reduceMotion
            ? {}
            : { duration: 7.5, repeat: Infinity, ease: "linear" }
        }
      >
        <div className="absolute inset-0 rounded-full border border-white/10" />

        <div
          className="absolute -inset-[22px] rounded-full blur-3xl opacity-70"
          style={{
            background:
              "conic-gradient(from 120deg, rgba(255,215,90,0.0), rgba(255,215,90,0.35), rgba(255,215,90,0.0), rgba(255,215,90,0.22), rgba(255,215,90,0.0))",
          }}
        />

        {!reduceMotion ? (
          <>
            <motion.span
              className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#FFD54A]"
              animate={{ scale: [1, 1.45, 1], opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.45))",
              }}
            />
            <motion.span
              className="absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/70"
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
            <motion.span
              className="absolute left-5 bottom-10 h-1.5 w-1.5 rounded-full bg-white/60"
              animate={{ opacity: [0.2, 0.85, 0.2] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.55,
              }}
            />
          </>
        ) : null}
      </motion.div>

      <motion.div
        className="absolute grid place-items-center"
        animate={reduceMotion ? {} : { scale: [1, 1.03, 1] }}
        transition={
          reduceMotion
            ? {}
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur">
          <div
            className="absolute -inset-10 rounded-[28px] blur-3xl opacity-70"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(255,215,90,0.28), transparent 60%)",
            }}
          />
          <div className="absolute inset-[1px] rounded-[14px] border border-white/10" />
          <motion.div
            className="absolute inset-0 grid place-items-center"
            initial={{ opacity: 0, y: 6, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <span className="text-2xl sm:text-3xl">📄</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LuxuryMiniButton({ children, onClick, variant = "ghost" }) {
  const skin =
    variant === "primary"
      ? "border-[#FFD54A]/25 bg-[#FFD54A]/15 text-[#FFE7A3] hover:bg-[#FFD54A]/20"
      : "border-white/12 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={[
        "relative inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm",
        "border backdrop-blur select-none overflow-hidden",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD54A]/35",
        skin,
      ].join(" ")}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition duration-500 group-hover:opacity-70"
      />
      <span className="relative">{children}</span>
    </motion.button>
  );
}

export default function ResumeOpeningPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const messages = useMemo(
    () => [
      "Preparing secure link…",
      "Verifying access…",
      "Almost there…",
      "Opening resume…",
    ],
    []
  );
  const [idx, setIdx] = useState(0);

  // ✅ auto-close controller
  const openedAtRef = useRef(Date.now());
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % messages.length), 900);
    return () => clearInterval(t);
  }, [messages.length, reduceMotion]);

  // ✅ Give 1.2s then enable "Close tab" button
  useEffect(() => {
    const t = setTimeout(() => setCanClose(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // ✅ AUTO-CLOSE: tries to close this tab after a short delay
  // Note: window.close works reliably only if this tab was opened via window.open()
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        // Try to close if allowed (opened by script)
        window.close();
      } catch {}
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  const onBack = () => {
    // ✅ If user navigated here directly (not popup), go back safely
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const onCloseTab = () => {
    try {
      window.close();
    } catch {}
    // fallback if browser blocked close
    if (!document.hidden) onBack();
  };

  // ✅ tiny helper: show how long stayed (optional, luxury)
  const seconds = Math.max(
    0,
    Math.round((Date.now() - openedAtRef.current) / 1000)
  );

  return (
    <div className="min-h-[100svh] bg-[#07080B] text-white">
      {/* background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,215,90,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(120,180,255,0.08),transparent_60%)]" />
        <motion.div
          aria-hidden
          className="absolute -inset-40 opacity-40 blur-3xl"
          style={{
            background:
              "conic-gradient(from 180deg, rgba(255,215,90,0.08), rgba(255,255,255,0.02), rgba(120,180,255,0.06), rgba(255,215,90,0.08))",
          }}
          animate={reduceMotion ? {} : { rotate: 360 }}
          transition={
            reduceMotion
              ? {}
              : { duration: 18, repeat: Infinity, ease: "linear" }
          }
        />
      </div>

      {/* content */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-3xl items-center justify-center px-5">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035] p-6 sm:p-8 backdrop-blur"
            style={{ boxShadow: "0 35px 120px rgba(0,0,0,0.72)" }}
          >
            <div className="absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.85),transparent)] opacity-80" />

            {/* header actions */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-white/55">AI-secured access</span>
              <div className="flex items-center gap-2">
                <LuxuryMiniButton onClick={onBack} variant="ghost">
                  ← Back
                </LuxuryMiniButton>
                <LuxuryMiniButton onClick={onCloseTab} variant="primary">
                  ✕ Close
                </LuxuryMiniButton>
              </div>
            </div>

            {/* hero */}
            <div className="relative mt-2">
              <div className="relative h-56 sm:h-64">
                <Sparkles count={14} reduceMotion={reduceMotion} />
                <OrbRing reduceMotion={reduceMotion} />
              </div>

              <div className="mt-4 text-center">
                <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
                  Opening Resume<span className="text-[#FFD54A]">…</span>
                </h1>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6, filter: "blur(8px)" }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="mt-2 text-sm text-white/70"
                  >
                    {messages[idx]}
                  </motion.p>
                </AnimatePresence>

                {/* progress bar */}
                <div className="mt-5">
                  <div className="relative h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.03]">
                    <motion.div
                      className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-[#FFD54A]/70"
                      animate={reduceMotion ? {} : { x: ["-40%", "260%"] }}
                      transition={
                        reduceMotion
                          ? {}
                          : {
                              duration: 1.25,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                      }
                      style={{
                        filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.35))",
                      }}
                    />
                  </div>

                  <p className="mt-2 text-[11px] text-white/50">
                    If resume doesn’t open: allow popups → then try again.
                  </p>
                </div>

                {/* auto close hint */}
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left">
                  <p className="text-xs text-white/70">
                    This tab will try to auto-close after resume opens.
                  </p>
                  <p className="mt-1 text-[11px] text-white/50">
                    If browser blocks auto-close, press{" "}
                    <span className="text-white/70">Close</span> above.
                    <span className="ml-2 text-white/35">•</span>
                    <span className="ml-2 text-white/45">
                      Active: {seconds}s
                    </span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <LuxuryMiniButton onClick={onBack} variant="ghost">
                      Cancel / Back
                    </LuxuryMiniButton>

                    <LuxuryMiniButton onClick={onCloseTab} variant="primary">
                      {canClose ? "Close this tab" : "Close (ready soon…)"}
                    </LuxuryMiniButton>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <p className="mt-4 text-center text-[11px] text-white/35">
            Mukul • Premium Resume Gate
          </p>
        </div>
      </div>
    </div>
  );
}

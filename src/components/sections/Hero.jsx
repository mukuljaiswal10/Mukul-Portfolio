// "use client";
// import Container from "@/components/ui/Container";
// import Button from "@/components/ui/Button";
// import Badge from "@/components/ui/Badge";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import HeroPortrait from "@/components/sections/HeroPortrait";
// import { motion } from "framer-motion";
// import ShimmerText from "@/components/ui/ShimmerText";

// export default function Hero() {
//   const TITLE = "Hi, I’m Mukul — I build fast modern websites.";
//   return (
//     <section className="relative overflow-hidden">
//       {/* background */}
//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />
//         <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-foreground/10 blur-3xl" />
//       </div>

//       <Container className="relative py-14 md:py-20 lg:py-24">
//         <div className="grid items-center gap-6 md:gap-8 lg:grid-cols-2 lg:gap-10">
//           {/* LEFT */}
//           <Parallax from={18} to={-18}>
//             <div className="max-w-2xl">
//               <Reveal>
//                 <Badge>Full Stack • WordPress</Badge>
//               </Reveal>

//               <motion.h1
//                 className="mt-4 max-w-[22ch] text-4xl font-bold leading-[1.06] tracking-tight md:text-6xl"
//                 initial={{ opacity: 0, y: 26, filter: "blur(18px)" }}
//                 animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//                 transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
//               >
//                 <span className="relative inline-block">
//                   {/* Base text */}
//                   <span className="block text-white">{TITLE}</span>

//                   {/* Shimmer overlay text */}
//                   <motion.span
//                     aria-hidden
//                     className="
//                               pointer-events-none absolute inset-0 select-none
//                               text-transparent
//                               bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.95),transparent)]
//                               bg-[length:220%_100%]
//                               [background-clip:text] [-webkit-background-clip:text]
//                               mix-blend-screen opacity-80
//       "
//                     initial={{ backgroundPosition: "220% 0" }}
//                     animate={{ backgroundPosition: "-220% 0" }}
//                     transition={{
//                       duration: 1.15,
//                       ease: "easeOut",
//                       delay: 0.35,
//                     }}
//                   >
//                     Hi, I’m Mukul — I build{" "}
//                     <span className="glow-underline">fast</span> modern
//                     websites.
//                   </motion.span>

//                   {/* Soft glow behind text (premium) */}
//                   <motion.span
//                     aria-hidden
//                     className="pointer-events-none absolute -inset-x-10 -inset-y-6 -z-10 rounded-full bg-white/10 blur-3xl"
//                     initial={{ opacity: 0, scale: 0.98 }}
//                     animate={{ opacity: 0.55, scale: 1 }}
//                     transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
//                   />
//                 </span>
//               </motion.h1>

//               <Reveal delay={0.14}>
//                 <p className="mt-5 text-muted/70 md:text-lg">
//                   Clean UI, responsive layouts, and performance-focused
//                   development using Next.js, React and Tailwind.
//                 </p>
//               </Reveal>
//               <Reveal delay={0.2}>
//                 <div className="mt-8 flex flex-wrap gap-3">
//                   <Button href="/projects">View Projects</Button>
//                   <Button href="/contact" variant="outline">
//                     Contact Me
//                   </Button>
//                 </div>
//               </Reveal>
//               <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
//                 {[
//                   { k: "10+", v: "Projects" },
//                   { k: "Fast", v: "Performance" },
//                   { k: "Responsive", v: "All devices" },
//                 ].map((s, i) => (
//                   <Reveal key={s.v} delay={0.25 + i * 0.08}>
//                     <div className="rounded-2xl border border-border/10 bg-foreground/[0.03] p-4">
//                       <p className="text-xl font-bold text-foreground">{s.k}</p>
//                       <p className="text-sm text-muted/70">{s.v}</p>
//                     </div>
//                   </Reveal>
//                 ))}
//               </div>
//             </div>
//           </Parallax>

//           {/* RIGHT (portrait) */}
//           <Parallax from={14} to={-14}>
//             <div className="lg:justify-self-end lg:mr-2 xl:mr-4">
//               <Reveal delay={0.12}>
//                 {/* placeholder for now */}
//                 <HeroPortrait src="/images/hero-portrait.jpg" />
//               </Reveal>
//             </div>
//           </Parallax>
//         </div>
//       </Container>
//     </section>
//   );
// }

// "use client";

// import Container from "@/components/ui/Container";
// // import Button from "@/components/ui/Button";
// import Badge from "@/components/ui/Badge";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import HeroPortrait from "@/components/sections/HeroPortrait";
// import { motion } from "framer-motion";
// import ShimmerText from "@/components/ui/ShimmerText";
// import Text3D from "@/components/ui/Text3D";
// import StatCard from "@/components/ui/StatCard";
// import LuxuryButton from "@/components/ui/LuxuryButton";

// export default function Hero() {
//   return (
//     <section className="relative overflow-hidden">
//       {/* background */}
//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />
//         <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-foreground/10 blur-3xl" />
//       </div>

//       <Container className="relative py-14 md:py-20 lg:py-24">
//         <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
//           {/* LEFT */}
//           <Parallax from={18} to={-18}>
//             <div className="max-w-2xl">
//               <Reveal>
//                 <Badge>Full Stack • WordPress</Badge>
//               </Reveal>
//               {/* Premium heading reveal + shimmer + glow underline */}
//               <motion.h1
//                 className="relative mt-4 max-w-[22ch] text-4xl font-bold leading-[1.06] tracking-tight md:text-6xl"
//                 initial={{ opacity: 0, y: 22, filter: "blur(16px)" }}
//                 animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//                 transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
//               >
//                 {/* soft glow behind heading */}
//                 <motion.span
//                   aria-hidden
//                   className="pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 rounded-full bg-white/10 blur-3xl"
//                   initial={{ opacity: 0, scale: 0.98 }}
//                   animate={{ opacity: 0.55, scale: 1 }}
//                   transition={{ duration: 0.9, ease: "easeOut", delay: 0.05 }}
//                 />
//                 Hi, I’m Mukul — I build{" "}
//                 <Text3D className="glow-underline">fast</Text3D>,{" "}
//                 <Text3D>
//                   <ShimmerText text="modern" /> <ShimmerText text="websites." />
//                 </Text3D>
//               </motion.h1>
//               <Reveal delay={0.14}>
//                 <p className="mt-5 text-muted/70 md:text-lg">
//                   “I build premium, high-performance web apps with a sharp eye
//                   for UI and scalability—powered by React/Next.js, Tailwind,
//                   Node/Express & MongoDB. 🚀✨”
//                 </p>
//               </Reveal>
//               <Reveal delay={0.2}>
//                 <div className="mt-8 flex flex-wrap gap-3">
//                   {/* <Button href="/projects">View Projects</Button>
//                   <Button href="/contact" variant="outline">
//                     Contact Me
//                   </Button> */}
//                   <LuxuryButton href="/projects" variant="primary">
//                     View Projects
//                   </LuxuryButton>
//                   <LuxuryButton href="/contact" variant="outline">
//                     Contact Me
//                   </LuxuryButton>
//                 </div>
//               </Reveal>
//               {/* 3 box */}
//               <div className="mt-8 grid gap-4 sm:grid-cols-3">
//                 <StatCard value="10+" label="Projects" />
//                 <StatCard value="Fast" label="Performance" />
//                 <StatCard value="Responsive" label="All devices" />
//               </div>
//               {/* end */}
//             </div>
//           </Parallax>

//           {/* RIGHT (portrait) */}
//           <Parallax from={14} to={-14}>
//             <div className="lg:justify-self-end lg:mr-2 xl:mr-4">
//               <Reveal delay={0.12}>
//                 <HeroPortrait src="/images/hero-portrait.jpg" />
//               </Reveal>
//             </div>
//           </Parallax>
//         </div>
//       </Container>
//     </section>
//   );
// }

// "use client";

// import { useEffect } from "react";
// import Container from "@/components/ui/Container";
// import Badge from "@/components/ui/Badge";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";
// import HeroPortrait from "@/components/sections/HeroPortrait";
// import { motion } from "framer-motion";
// import ShimmerText from "@/components/ui/ShimmerText";
// import Text3D from "@/components/ui/Text3D";
// import StatCard from "@/components/ui/StatCard";
// import LuxuryButton from "@/components/ui/LuxuryButton";

// export default function Hero({ id = "home" }) {
//   // ✅ hash -> auto scroll (/#home)
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const scrollIfMatch = () => {
//       const hash = (window.location.hash || "").replace("#", "");
//       if (!hash) return;
//       if (hash !== id) return;

//       const el = document.getElementById(id);
//       if (!el) return;

//       setTimeout(() => {
//         el.scrollIntoView({ behavior: "smooth", block: "start" });
//       }, 60);
//     };

//     scrollIfMatch();
//     window.addEventListener("hashchange", scrollIfMatch);
//     return () => window.removeEventListener("hashchange", scrollIfMatch);
//   }, [id]);

//   return (
//     <section id={id} className="relative overflow-hidden scroll-mt-24">
//       {/* background */}
//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />
//         <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-foreground/10 blur-3xl" />
//       </div>

//       <Container className="relative py-14 md:py-20 lg:py-24">
//         <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
//           {/* LEFT */}
//           <Parallax from={18} to={-18}>
//             <div className="max-w-2xl">
//               <Reveal>
//                 <Badge>Full Stack • WordPress</Badge>
//               </Reveal>

//               {/* Premium heading reveal + shimmer + glow underline */}
//               <motion.h1
//                 className="relative mt-4 max-w-[22ch] text-4xl font-bold leading-[1.06] tracking-tight md:text-6xl"
//                 initial={{ opacity: 0, y: 22, filter: "blur(16px)" }}
//                 animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//                 transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
//               >
//                 {/* soft glow behind heading */}
//                 <motion.span
//                   aria-hidden
//                   className="pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 rounded-full bg-white/10 blur-3xl"
//                   initial={{ opacity: 0, scale: 0.98 }}
//                   animate={{ opacity: 0.55, scale: 1 }}
//                   transition={{ duration: 0.9, ease: "easeOut", delay: 0.05 }}
//                 />
//                 Hi, I’m Mukul — I build{" "}
//                 <Text3D className="glow-underline">fast</Text3D>,{" "}
//                 <Text3D>
//                   <ShimmerText text="modern" /> <ShimmerText text="websites." />
//                 </Text3D>
//               </motion.h1>

//               <Reveal delay={0.14}>
//                 <p className="mt-5 text-muted/70 md:text-lg">
//                   “I build premium, high-performance web apps with a sharp eye
//                   for UI and scalability—powered by React/Next.js, Tailwind,
//                   Node/Express & MongoDB. 🚀✨”
//                 </p>
//               </Reveal>

//               <Reveal delay={0.2}>
//                 <div className="mt-8 flex flex-wrap gap-3">
//                   <LuxuryButton href="/projects" variant="primary">
//                     View Projects
//                   </LuxuryButton>
//                   <LuxuryButton href="/contact" variant="outline">
//                     Contact Me
//                   </LuxuryButton>
//                 </div>
//               </Reveal>

//               {/* 3 box */}
//               <div className="mt-8 grid gap-4 sm:grid-cols-3">
//                 <StatCard value="10+" label="Projects" />
//                 <StatCard value="Fast" label="Performance" />
//                 <StatCard value="Responsive" label="All devices" />
//               </div>
//             </div>
//           </Parallax>

//           {/* RIGHT (portrait) */}
//           <Parallax from={14} to={-14}>
//             <div className="lg:justify-self-end lg:mr-2 xl:mr-4">
//               <Reveal delay={0.12}>
//                 <HeroPortrait src="/images/hero-portrait.jpg" />
//               </Reveal>
//             </div>
//           </Parallax>
//         </div>
//       </Container>
//     </section>
//   );
// }

"use client";

import { useEffect } from "react";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import HeroPortrait from "@/components/sections/HeroPortrait";
import { motion } from "framer-motion";
import ShimmerText from "@/components/ui/ShimmerText";
import Text3D from "@/components/ui/Text3D";
import StatCard from "@/components/ui/StatCard";
import LuxuryButton from "@/components/ui/LuxuryButton";

export default function Hero({ id = "home" }) {
  // ✅ hash -> auto scroll (/#home)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollIfMatch = () => {
      const hash = (window.location.hash || "").replace("#", "");
      if (!hash) return;
      if (hash !== id) return;

      const el = document.getElementById(id);
      if (!el) return;

      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    };

    scrollIfMatch();
    window.addEventListener("hashchange", scrollIfMatch);
    return () => window.removeEventListener("hashchange", scrollIfMatch);
  }, [id]);

  return (
    <section id={id} className="relative overflow-hidden scroll-mt-24">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-foreground/10 blur-3xl" />
      </div>

      <Container className="relative py-14 md:py-20 lg:py-24">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          {/* LEFT */}
          <Parallax from={18} to={-18}>
            <div className="max-w-2xl">
              <Reveal>
                <Badge>Full Stack • WordPress</Badge>
              </Reveal>

              {/* ✅ Premium heading: ALL text same gold (no white mixing) */}
              <motion.h1
                style={{
                  // one single gradient source (used on h1 + all children)
                  "--mj-gold": "180deg,#FFE7A3 0%,#E9C86A 45%,#B8892E 100%",
                }}
                className={[
                  "relative mt-4 max-w-[22ch] text-4xl font-bold leading-[1.06] tracking-tight md:text-6xl",
                  // h1 itself gold
                  "text-transparent bg-clip-text bg-[linear-gradient(var(--mj-gold))]",
                  // ✅ force all nested spans/components (Text3D/ShimmerText) also gold
                  "[&_*]:!text-transparent [&_*]:!bg-clip-text [&_*]:!bg-[linear-gradient(var(--mj-gold))]",
                ].join(" ")}
                initial={{ opacity: 0, y: 22, filter: "blur(16px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* soft glow behind heading */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 rounded-full bg-white/10 blur-3xl"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 0.55, scale: 1 }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.05 }}
                />
                Hi, I’m Mukul — I build{" "}
                <Text3D className="glow-underline">fast</Text3D>,{" "}
                <Text3D>
                  <ShimmerText text="modern" /> <ShimmerText text="websites." />
                </Text3D>
              </motion.h1>

              <Reveal delay={0.14}>
                <p className="mt-5 text-muted/70 md:text-lg">
                  “I build premium, high-performance web apps with a sharp eye
                  for UI and scalability—powered by React/Next.js, Tailwind,
                  Node/Express & MongoDB. 🚀✨”
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <LuxuryButton href="/projects" variant="primary">
                    View Projects
                  </LuxuryButton>
                  <LuxuryButton href="/contact" variant="outline">
                    Contact Me
                  </LuxuryButton>
                </div>
              </Reveal>

              {/* 3 box */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <StatCard value="10+" label="Projects" />
                <StatCard value="Fast" label="Performance" />
                <StatCard value="Responsive" label="All devices" />
              </div>
            </div>
          </Parallax>

          {/* RIGHT (portrait) */}
          <Parallax from={14} to={-14}>
            <div className="lg:justify-self-end lg:mr-2 xl:mr-4">
              <Reveal delay={0.12}>
                <HeroPortrait src="/images/hero-portrait.jpg" />
              </Reveal>
            </div>
          </Parallax>
        </div>
      </Container>
    </section>
  );
}

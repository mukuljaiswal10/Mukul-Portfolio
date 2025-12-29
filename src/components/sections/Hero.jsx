// import Container from "@/components/ui/Container";
// import Button from "@/components/ui/Button";
// import Badge from "@/components/ui/Badge";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";

// export default function Hero() {
//   return (
//     <section className="relative overflow-hidden">
//       <div className="pointer-events-none absolute inset-0 opacity-60">
//         <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
//         <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
//       </div>

//       <Container className="relative py-16 md:py-24">
//         <Parallax from={28} to={-28}>
//           <div className="max-w-3xl">
//             <Reveal>
//               <Badge>Full Stack • WordPress</Badge>
//             </Reveal>

//             <Reveal delay={0.08}>
//               <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
//                 Hi, I’m Mukul — I build fast, modern websites.
//               </h1>
//             </Reveal>

//             <Reveal delay={0.14}>
//               <p className="mt-5 text-white/70">
//                 Clean UI, responsive layouts, and performance-focused
//                 development using Next.js, React and Tailwind.
//               </p>
//             </Reveal>

//             <Reveal delay={0.2}>
//               <div className="mt-8 flex flex-wrap gap-3">
//                 <Button href="/projects">View Projects</Button>
//                 <Button href="/contact" variant="outline">
//                   Contact Me
//                 </Button>
//               </div>
//             </Reveal>

//             <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
//               {[
//                 { k: "10+", v: "Projects" },
//                 { k: "Fast", v: "Performance" },
//                 { k: "Responsive", v: "All devices" },
//               ].map((s, i) => (
//                 <Reveal key={s.v} delay={0.25 + i * 0.08}>
//                   <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
//                     <p className="text-xl font-bold">{s.k}</p>
//                     <p className="text-sm text-white/60">{s.v}</p>
//                   </div>
//                 </Reveal>
//               ))}
//             </div>
//           </div>
//         </Parallax>
//       </Container>
//     </section>
//   );
// }

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import HeroPortrait from "@/components/sections/HeroPortrait";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-foreground/10 blur-3xl" />
      </div>

      <Container className="relative py-14 md:py-20 lg:py-24">
        <div className="grid items-center gap-6 md:gap-8 lg:grid-cols-2 lg:gap-10">
          {/* LEFT */}
          <Parallax from={18} to={-18}>
            <div className="max-w-2xl">
              <Reveal>
                <Badge>Full Stack • WordPress</Badge>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="mt-4 max-w-[20ch] text-4xl font-bold leading-[1.08] tracking-tight md:max-w-[22ch] md:text-6xl">
                  Hi, I’m Mukul — I build{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-foreground">fast</span>
                    {/* underline */}
                    <span className="absolute -bottom-1 left-0 right-0 h-[10px] rounded-full bg-gradient-to-r from-foreground/10 via-foreground/35 to-foreground/10 blur-[0.5px]" />
                    {/* glow */}
                    <span className="pointer-events-none absolute -inset-2 -z-0 rounded-full bg-foreground/10 blur-xl opacity-60" />
                  </span>{" "}
                  <span className="whitespace-nowrap">modern websites</span>.
                </h1>
              </Reveal>

              <Reveal delay={0.14}>
                <p className="mt-5 text-muted/70 md:text-lg">
                  Clean UI, responsive layouts, and performance-focused
                  development using Next.js, React and Tailwind.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="/projects">View Projects</Button>
                  <Button href="/contact" variant="outline">
                    Contact Me
                  </Button>
                </div>
              </Reveal>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { k: "10+", v: "Projects" },
                  { k: "Fast", v: "Performance" },
                  { k: "Responsive", v: "All devices" },
                ].map((s, i) => (
                  <Reveal key={s.v} delay={0.25 + i * 0.08}>
                    <div className="rounded-2xl border border-border/10 bg-foreground/[0.03] p-4">
                      <p className="text-xl font-bold text-foreground">{s.k}</p>
                      <p className="text-sm text-muted/70">{s.v}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Parallax>

          {/* RIGHT (portrait) */}
          <Parallax from={14} to={-14}>
            <div className="lg:justify-self-end lg:mr-2 xl:mr-4">
              <Reveal delay={0.12}>
                {/* placeholder for now */}
                <HeroPortrait src="/images/hero-portrait.jpg" />
              </Reveal>
            </div>
          </Parallax>
        </div>
      </Container>
    </section>
  );
}

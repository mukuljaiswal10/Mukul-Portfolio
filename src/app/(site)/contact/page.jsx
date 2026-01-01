// import Container from "@/components/ui/Container";
// import Breadcrumbs from "@/components/shared/Breadcrumbs";
// import ContactSection from "@/components/sections/ContactSection";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";

// export default function ContactPage() {
//   return (
//     <>
//       <Container className="py-10">
//         <Parallax from={10} to={-10}>
//           <Reveal>
//             <Breadcrumbs items={[{ label: "Contact" }]} />
//             <h1 className="text-3xl font-bold md:text-4xl">Contact</h1>
//             {/* <p className="mt-2 max-w-2xl text-white/70">
//               Tell me about your project. I’ll reply soon.
//             </p> */}
//           </Reveal>
//         </Parallax>
//       </Container>

//       <ContactSection />
//     </>
//   );
// }

// import ContactPageClient from "@/components/contact/ContactPageClient";

// export const metadata = {
//   title: "Contact — Mukul",
//   description:
//     "Contact Mukul for premium web development, UI, Next.js and WordPress.",
// };

// export default function ContactPage() {
//   return <ContactPageClient />;
// }

import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import ContactPageClient from "@/components/contact/ContactPageClient";



export default function ContactPage() {
  return (
    <>
      {/* ✅ Header stays premium with Reveal + Parallax */}
      <Container className="py-10">
        <Parallax from={10} to={-10}>
          <Reveal>
            <Breadcrumbs items={[{ label: "Contact" }]} />
            <h1 className="text-3xl font-bold md:text-4xl">Contact</h1>
            {/* <p className="mt-2 max-w-2xl text-white/70">
              Tell me about your project. I’ll reply soon.
            </p> */}
          </Reveal>
        </Parallax>
      </Container>

      {/* ✅ Full premium + working contact UI */}
      <ContactPageClient/>
    </>
  );
}

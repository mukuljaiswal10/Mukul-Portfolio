import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyCTA from "@/components/ui/StickyCTA";
import ScrollToTop from "@/components/ui/ScrollToTop";
import SplashLoader from "@/components/ui/SplashLoader";
import CommandPalette from "@/components/ai/CommandPalette";
import ScrollToHash from "@/components/ai/ScrollToHash";
import AISuggestions from "@/components/ai/AISuggestion";
import StickyNavSearchShell from "@/components/ai/StickyNavSearchShell";

export const metadata = {
  title: "Mukul Jaiswal | Portfolio",
  description: "Full Stack & WordPress Developer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressContentEditableWarning>
      {/* ✅ body: bg black रहेगा, but text force white नहीं करेंगे */}
      <body className="min-h-screen bg-black antialiased">
        {/* ✅ global helpers */}
        <ScrollToHash />
        <CommandPalette />

        {/* ✅ app shell */}
        <SplashLoader />
        <Navbar />

        {/* ✅ client-only wrapper */}
        <StickyNavSearchShell />

        {/* ✅ PROSE PREMIUM applied globally for page content */}
        <main className="pt-16 prose-premium">{children}</main>

        <Footer />

        {/* ✅ extras */}
        <StickyCTA
          whatsappNumber="919919371299"
          email="mukuljaiswal282@gmail.com"
          defaultMessage="Hi Mukul, I want to build a premium website. Please share details."
          showCall={false}
        />
        <ScrollToTop />

        {/* ✅ AI suggestion toast (kept at end) */}
        <AISuggestions />
      </body>
    </html>
  );
}















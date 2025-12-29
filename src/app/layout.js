import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyCTA from "@/components/ui/StickyCTA";
import ScrollToTop from "@/components/ui/ScrollToTop";
import SplashLoader from "@/components/ui/SplashLoader";

export const metadata = {
  title: "Mukul Jaiswal | Portfolio",
  description: "Full Stack & WordPress Developer Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
          <SplashLoader />
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />

          {/* extras */}
          <StickyCTA />
          <ScrollToTop />
      </body>
    </html>
  );
}
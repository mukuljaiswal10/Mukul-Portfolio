
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { navLinks } from "@/data/navLinks";
import { motion, AnimatePresence } from "framer-motion";

function AnimatedHamburger({ open }) {
  return (
    <div className="relative h-5 w-6">
      {/* top */}
      <motion.span
        className="absolute left-0 top-[2px] block h-0.5 w-6 bg-foreground/80"
        animate={
          open
            ? { top: "50%", rotate: 45, opacity: 1 }
            : { top: "2px", rotate: 0, opacity: 1 }
        }
        transition={{ duration: 0.22, ease: "easeInOut" }}
      />
      {/* middle */}
      <motion.span
        className="absolute left-0 top-[9px] block h-0.5 w-6 bg-foreground/80"
        animate={open ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
      />
      {/* bottom */}
      <motion.span
        className="absolute left-0 top-[16px] block h-0.5 w-6 bg-foreground/80"
        animate={
          open
            ? { top: "50%", rotate: -45, opacity: 1 }
            : { top: "16px", rotate: 0, opacity: 1 }
        }
        transition={{ duration: 0.22, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Scroll effects
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const rafRef = useRef(null);

  // route change pe auto-close
  useEffect(() => setOpen(false), [pathname]);

  // drawer open hone par body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  // Navbar bg intensity + hide on scroll down / show on scroll up
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY || 0;

        // bg intensity
        setScrolled(y > 12);

        const lastY = lastYRef.current;
        const delta = y - lastY;

        // small tolerance to avoid jitter
        if (Math.abs(delta) > 6) {
          const goingDown = delta > 0;
          const goingUp = delta < 0;

          // Hide only after some scroll (professional)
          if (goingDown && y > 120) setHidden(true);
          if (goingUp) setHidden(false);

          lastYRef.current = y;
        }

        rafRef.current = null;
      });
    };

    lastYRef.current = window.scrollY || 0;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const panelVariants = useMemo(
    () => ({
      hidden: { x: "-100%", opacity: 0, scale: 0.985, filter: "blur(10px)" }, // open from left
      show: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
      exit: { x: "110%", opacity: 0, scale: 0.98, filter: "blur(12px)" }, // close to RIGHT ✅
    }),
    []
  );

  const overlayVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: { opacity: 1 },
      exit: { opacity: 0 },
    }),
    []
  );

  const listVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.08 },
      },
      exit: {
        opacity: 0,
        transition: { staggerChildren: 0.03, staggerDirection: -1 },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, x: -14, y: 6, filter: "blur(8px)" },
      show: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
      exit: { opacity: 0, x: 18, filter: "blur(8px)" },
    }),
    []
  );

  // hide header only when menu closed
  const headerY = hidden && !open ? -80 : 0;

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        scrolled
          ? "border-b border-border/10 bg-background/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.22)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
          : "border-b border-transparent bg-background/55 backdrop-blur-md"
      }`}
      animate={{ y: headerY }}
      transition={{ duration: 0.26, ease: "easeInOut" }}
    >
      <Container className="flex h-16 items-center justify-between">
        {/* ✅ LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logos/logo4.png"
            alt="Mukul.dev"
            width={500}
            height={150}
            priority
            className="h-8 w-auto md:h-9 lg:h-10"
          />
          {/* <span className="sr-only">Mukul.dev</span> */}
        </Link>

        {/* Desktop nav + animated underline */}
        <nav className="relative hidden items-center gap-6 md:flex">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative py-2 text-sm transition ${
                  active
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {l.label}
                {active ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Button href="/contact">Hire Me</Button>
          </div>

          {/* Mobile theme toggle */}
          <div className="md:hidden"></div>

          {/* Mobile hamburger -> X */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-xl border border-border/15 bg-foreground/[0.03] p-2 text-foreground hover:bg-foreground/[0.06] md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatedHamburger open={open} />
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open ? (
          <>
            {/* overlay */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              onClick={() => setOpen(false)}
            />

            {/* panel */}
            <motion.aside
              className="fixed left-0 top-0 z-[70] h-dvh w-[82%] max-w-sm border-r border-border/12 bg-background/95 backdrop-blur md:hidden"
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              drag="x"
              dragDirectionLock
              dragConstraints={{ left: 0, right: 320 }}
              dragElastic={0.18}
              onDragEnd={(e, info) => {
                const shouldClose =
                  info.offset.x > 120 || info.velocity.x > 800;
                if (shouldClose) setOpen(false);
              }}
            >
              <div className="flex h-16 items-center justify-between border-b border-border/10 px-4">
                <motion.p
                  initial={{ opacity: 0, x: -10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="font-semibold text-foreground"
                >
                  Menu <span className="text-muted/60">•</span>
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, x: 10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="rounded-xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
                  onClick={() => setOpen(false)}
                >
                  Close ✕
                </motion.button>
              </div>

              <div className="p-3">
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col"
                >
                  {navLinks.map((l) => {
                    const active = pathname === l.href;
                    return (
                      <motion.div key={l.href} variants={itemVariants}>
                        <Link
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className={`block rounded-xl px-4 py-3 text-sm transition ${
                            active
                              ? "bg-foreground/[0.06] text-foreground"
                              : "text-foreground/80 hover:bg-foreground/[0.05]"
                          }`}
                        >
                          {l.label}
                        </Link>
                      </motion.div>
                    );
                  })}

                  <motion.div variants={itemVariants}>
                    <Button href="/contact" className="mt-3 w-full">
                      Hire Me
                    </Button>
                  </motion.div>

                  <motion.p
                    variants={itemVariants}
                    className="mt-3 text-xs text-muted/60"
                  >
                    Tip: Swipe right to close →
                  </motion.p>
                </motion.div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

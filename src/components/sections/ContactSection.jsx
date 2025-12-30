// "use client";

// import { useState } from "react";
// import Container from "@/components/ui/Container";
// import SectionHeading from "@/components/shared/SectionHeading";
// import Card from "@/components/ui/Card";
// import Input from "@/components/ui/Input";
// import Textarea from "@/components/ui/Textarea";
// import Button from "@/components/ui/Button";
// import Reveal from "@/components/ui/Reveal";
// import Parallax from "@/components/ui/Parallax";

// export default function ContactSection({ compact = false }) {
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState(null);

//   async function onSubmit(e) {
//     e.preventDefault();
//     setStatus(null);
//     setLoading(true);

//     const form = new FormData(e.currentTarget);
//     const payload = {
//       name: form.get("name"),
//       email: form.get("email"),
//       message: form.get("message"),
//     };

//     try {
//       const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.error || "Failed");
//       setStatus({ ok: true, msg: "Message sent ✅" });
//       e.currentTarget.reset();
//     } catch (err) {
//       setStatus({ ok: false, msg: err.message || "Something went wrong" });
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <section className={compact ? "py-10" : "py-16"}>
//       <Container>
//         <Parallax from={12} to={-12}>
//           <Reveal>
//             <SectionHeading
//               eyebrow="Contact"
//               title="Let’s build something together"
//               desc="Send a message and I’ll get back to you."
//             />
//           </Reveal>
//         </Parallax>

//         <div className="grid gap-6 md:grid-cols-2">
//           <Reveal delay={0.12}>
//             <Card className="h-full">
//               <p className="text-white/80">
//                 Prefer WhatsApp / Call? You can add your details here later.
//               </p>
//               <ul className="mt-4 space-y-2 text-sm text-white/70">
//                 <li>📧 Email: mukuljaiswal282@gmail.com</li>
//                 <li>📱 WhatsApp: +919919371299</li>
//                 <li>⏱ Response: within 24 hours</li>
//               </ul>
//             </Card>
//           </Reveal>

//           <Reveal delay={0.18}>
//             <Card className="h-full">
//               <form onSubmit={onSubmit} className="space-y-4">
//                 <Reveal delay={0.02}>
//                   <Input name="name" placeholder="Your name" required />
//                 </Reveal>
//                 <Reveal delay={0.05}>
//                   <Input
//                     name="email"
//                     type="email"
//                     placeholder="Your email"
//                     required
//                   />
//                 </Reveal>
//                 <Reveal delay={0.08}>
//                   <Textarea
//                     name="message"
//                     placeholder="Your message"
//                     required
//                   />
//                 </Reveal>

//                 <Reveal delay={0.12}>
//                   <Button type="submit" disabled={loading} className="w-full">
//                     {loading ? "Sending..." : "Send Message"}
//                   </Button>
//                 </Reveal>

//                 {status ? (
//                   <p
//                     className={`text-sm ${
//                       status.ok ? "text-green-400" : "text-red-400"
//                     }`}
//                   >
//                     {status.msg}
//                   </p>
//                 ) : null}
//               </form>
//             </Card>
//           </Reveal>
//         </div>
//       </Container>
//     </section>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm transition",
        "border border-border/15 backdrop-blur select-none",
        active ? "text-foreground" : "text-foreground/75 hover:text-foreground",
      ].join(" ")}
    >
      <span
        className={[
          "absolute inset-0 rounded-full",
          active ? "bg-foreground/[0.09]" : "bg-foreground/[0.03]",
        ].join(" ")}
      />
      {active ? (
        <span className="pointer-events-none absolute -inset-[1px] rounded-full bg-gradient-to-r from-foreground/35 via-foreground/10 to-foreground/35 opacity-70 blur-[7px]" />
      ) : null}
      <span
        className={[
          "relative h-1.5 w-1.5 rounded-full",
          active ? "bg-foreground/80" : "bg-foreground/40",
        ].join(" ")}
      />
      <span className="relative">{children}</span>
    </button>
  );
}

function Toast({ toast }) {
  if (!toast?.text) return null;

  const isOk = toast.type === "success";
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[999] -translate-x-1/2">
      <div
        className={[
          "rounded-2xl border border-border/15 bg-background/80 px-4 py-2 text-sm backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
          isOk ? "text-green-300" : "text-red-300",
        ].join(" ")}
      >
        {toast.text}
      </div>
    </div>
  );
}

function ConfettiBurst({ fire }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  if (!fire || reduceMotion) return null;

  const pieces = Array.from({ length: 18 }).map((_, i) => {
    const x = (Math.random() - 0.5) * 260;
    const y = -120 - Math.random() * 160;
    const r = (Math.random() - 0.5) * 520;
    const d = Math.random() * 0.12;
    const s = 0.9 + Math.random() * 0.6;
    return { id: i, x, y, r, d, s };
  });

  return (
    <div className="pointer-events-none fixed bottom-14 left-1/2 z-[998] -translate-x-1/2">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute h-2 w-1.5 rounded-full bg-foreground/80"
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: p.x,
            y: p.y,
            rotate: p.r,
            scale: p.s,
          }}
          transition={{
            duration: 0.9,
            delay: p.d,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.35))",
          }}
        />
      ))}
    </div>
  );
}

function StickyWhatsApp({ href, onClick, isMobile }) {
  if (!isMobile) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] pb-[max(env(safe-area-inset-bottom),0px)] md:hidden">
      <div className="mx-auto max-w-6xl px-3 pb-3">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className="relative flex items-center justify-between gap-3 rounded-2xl border border-border/15 bg-background/80 px-4 py-3 text-sm text-foreground/90 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.38)]"
        >
          {/* subtle pulse */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-[10px] rounded-2xl bg-gradient-to-r from-foreground/20 via-transparent to-foreground/20 blur-2xl"
            animate={{ opacity: [0.12, 0.22, 0.12], scale: [1, 1.06, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="relative flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-border/15 bg-foreground/[0.04]">
              💬
            </span>
            <span className="leading-tight">
              <span className="block font-semibold">Quick WhatsApp</span>
              <span className="block text-xs text-muted/70">
                Fast reply • 24h
              </span>
            </span>
          </span>

          <span className="relative rounded-xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-xs">
            Open →
          </span>
        </a>
      </div>
    </div>
  );
}

export default function ContactSection({ compact = false }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const [topic, setTopic] = useState("webapp");
  const [n, setN] = useState("");
  const [e, setE] = useState("");
  const [m, setM] = useState("");

  const [toast, setToast] = useState(null);
  const [confetti, setConfetti] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // ✅ button sent state + ripple
  const [sent, setSent] = useState(false);
  const [ripple, setRipple] = useState(null);
  const btnRef = useRef(null);

  const EMAIL = "mukuljaiswal282@gmail.com";
  const WHATSAPP = "+919919371299";
  const whatsappDigits = WHATSAPP.replace(/\D/g, "");

  const topics = useMemo(
    () => [
      { id: "portfolio", label: "Portfolio", emoji: "✨" },
      { id: "webapp", label: "Web App", emoji: "⚡" },
      { id: "landing", label: "Landing Page", emoji: "🚀" },
      { id: "uifix", label: "UI Fix / Redesign", emoji: "🎨" },
      { id: "other", label: "Other", emoji: "💬" },
    ],
    []
  );

  const activeTopic = topics.find((t) => t.id === topic) || topics[1];

  const buildMessage = () => {
    const lines = [];
    lines.push(`Hi Mukul 👋`);
    lines.push(`I saw your portfolio and want to discuss a project.`);
    lines.push("");
    lines.push(`Topic: ${activeTopic.emoji} ${activeTopic.label}`);
    if (n?.trim()) lines.push(`Name: ${n.trim()}`);
    if (e?.trim()) lines.push(`Email: ${e.trim()}`);
    if (m?.trim()) {
      lines.push("");
      lines.push("Message:");
      lines.push(m.trim());
    }
    lines.push("");
    lines.push("Thanks!");
    return lines.join("\n");
  };

  const whatsappUrl = useMemo(() => {
    return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
      buildMessage()
    )}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatsappDigits, topic, n, e, m]);

  const mailUrl = useMemo(() => {
    const subject = `Project Inquiry — ${activeTopic.label}`;
    const body = buildMessage();
    return `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EMAIL, topic, n, e, m]);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 1600);
  };

  const fireConfetti = () => {
    setConfetti(false);
    requestAnimationFrame(() => setConfetti(true));
    setTimeout(() => setConfetti(false), 1100);
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("success", "Copied ✅");
    } catch {
      showToast("error", "Copy failed ❌");
    }
  };

  const triggerRipple = (evt) => {
    const el = btnRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = evt?.clientX ? evt.clientX - rect.left : rect.width / 2;
    const y = evt?.clientY ? evt.clientY - rect.top : rect.height / 2;
    setRipple({ x, y, id: Date.now() });
    setTimeout(() => setRipple(null), 520);
  };

  async function onSubmit(evn) {
    evn.preventDefault();
    setStatus(null);
    setLoading(true);
    setSent(false);

    const form = new FormData(evn.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      message: `Topic: ${activeTopic.label}\n\n${form.get("message")}`,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");

      setStatus({ ok: true, msg: "Message sent ✅" });
      showToast("success", "Sent! I’ll reply soon ✨");
      fireConfetti();

      // ✅ sent state
      setSent(true);
      setTimeout(() => setSent(false), 1600);

      evn.currentTarget.reset();
      setN("");
      setE("");
      setM("");
    } catch (err) {
      setStatus({ ok: false, msg: err.message || "Something went wrong" });
      showToast("error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toast toast={toast} />
      <ConfettiBurst fire={confetti} />

      {/* ✅ Sticky WhatsApp CTA only on mobile */}
      <StickyWhatsApp
        href={whatsappUrl}
        isMobile={isMobile}
        onClick={() => showToast("success", "Opening WhatsApp…")}
      />

      <section className={compact ? "py-10" : "py-16"}>
        <Container>
          <Parallax from={12} to={-12}>
            <Reveal>
              <SectionHeading
                eyebrow="Contact"
                title="Let’s build something together"
                desc="Send a message and I’ll get back to you."
              />
            </Reveal>
          </Parallax>

          <div className="grid gap-6 md:grid-cols-2">
            {/* LEFT */}
            <Reveal delay={0.12}>
              <Card className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-white/80">
                    Prefer WhatsApp or Email? Quick contact below:
                  </p>

                  <span className="shrink-0 rounded-full border border-border/15 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/80">
                    Reply &lt; 24h
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-muted/60">Project type</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {topics.map((t) => (
                      <Chip
                        key={t.id}
                        active={topic === t.id}
                        onClick={() => setTopic(t.id)}
                      >
                        {t.emoji} {t.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-white/75">
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/12 bg-foreground/[0.03] px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs text-muted/60">Email</p>
                      <a
                        href={mailUrl}
                        className="block truncate text-white/85 underline decoration-white/15 underline-offset-4 transition hover:text-white hover:decoration-white/45"
                      >
                        {EMAIL}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(EMAIL)}
                      className="rounded-xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-xs text-foreground/85 hover:bg-foreground/[0.06]"
                    >
                      Copy
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/12 bg-foreground/[0.03] px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs text-muted/60">WhatsApp</p>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate text-white/85 underline decoration-white/15 underline-offset-4 transition hover:text-white hover:decoration-white/45"
                      >
                        {WHATSAPP}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(WHATSAPP)}
                      className="rounded-xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-xs text-foreground/85 hover:bg-foreground/[0.06]"
                    >
                      Copy
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative inline-flex items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] px-5 py-3 text-sm text-foreground/90 backdrop-blur transition hover:bg-foreground/[0.06]"
                    >
                      {/* pulse glow */}
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute -inset-[10px] rounded-2xl bg-gradient-to-r from-foreground/25 via-transparent to-foreground/25 blur-2xl"
                        animate={{
                          opacity: isMobile
                            ? [0.12, 0.22, 0.12]
                            : [0.18, 0.38, 0.18],
                          scale: [1, 1.08, 1],
                        }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <span className="relative">WhatsApp now →</span>
                    </a>

                    <a
                      href={mailUrl}
                      className="relative inline-flex items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] px-5 py-3 text-sm text-foreground/90 backdrop-blur transition hover:bg-foreground/[0.06]"
                    >
                      Email now →
                    </a>
                  </div>

                  {/* <p className="text-xs text-muted/60">
                    Tip: Form fill करते ही WhatsApp/Email message auto-premium
                    बनता है ✅
                  </p> */}
                </div>
              </Card>
            </Reveal>

            {/* RIGHT */}
            <Reveal delay={0.18}>
              <Card className="h-full">
                <form onSubmit={onSubmit} className="space-y-4">
                  <Reveal delay={0.02}>
                    <Input
                      name="name"
                      placeholder="Your name"
                      required
                      onChange={(ev) => setN(ev.target.value)}
                    />
                  </Reveal>

                  <Reveal delay={0.05}>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your email"
                      required
                      onChange={(ev) => setE(ev.target.value)}
                    />
                  </Reveal>

                  <Reveal delay={0.08}>
                    <Textarea
                      name="message"
                      placeholder="Your message"
                      required
                      onChange={(ev) => setM(ev.target.value)}
                    />
                  </Reveal>

                  {/* ✅ Button ripple + Sent tick */}
                  <Reveal delay={0.12}>
                    <div className="relative">
                      <motion.div
                        ref={btnRef}
                        onPointerDown={triggerRipple}
                        className="relative"
                      >
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full relative overflow-hidden"
                        >
                          <span className="relative z-10">
                            {loading
                              ? "Sending..."
                              : sent
                              ? "Sent ✓"
                              : "Send Message"}
                          </span>

                          {/* ripple */}
                          <AnimatePresence>
                            {ripple ? (
                              <motion.span
                                key={ripple.id}
                                className="pointer-events-none absolute rounded-full bg-foreground/20"
                                initial={{
                                  opacity: 0.6,
                                  width: 0,
                                  height: 0,
                                  left: ripple.x,
                                  top: ripple.y,
                                  translateX: "-50%",
                                  translateY: "-50%",
                                }}
                                animate={{
                                  opacity: 0,
                                  width: 520,
                                  height: 520,
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                              />
                            ) : null}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </div>
                  </Reveal>

                  {status ? (
                    <p
                      className={`text-sm ${
                        status.ok ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {status.msg}
                    </p>
                  ) : null}
                </form>
              </Card>
            </Reveal>
          </div>

          {/* ✅ spacing so sticky bar doesn't cover content on mobile */}
          <div className="h-20 md:hidden" />
        </Container>
      </section>
    </>
  );
}

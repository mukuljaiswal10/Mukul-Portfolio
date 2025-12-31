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

/** ✅ Draft sync */
const STORAGE_KEY = "mukul_contact_draft";
function broadcastDraft(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  window.dispatchEvent(new CustomEvent("mukul:contactDraft", { detail: next }));
}

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

/** ✅ Premium Toast (Animated + progress + mobile safe) */
function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast?.text ? (
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="pointer-events-none fixed left-1/2 z-[999] -translate-x-1/2 bottom-24 md:bottom-6"
        >
          <div
            className={[
              "relative overflow-hidden rounded-2xl border border-border/15",
              "bg-background/80 px-4 py-3 backdrop-blur",
              "shadow-[0_20px_60px_rgba(0,0,0,0.40)]",
              toast.type === "success" ? "text-green-200" : "text-red-200",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <span className="mt-[2px] grid h-7 w-7 place-items-center rounded-xl border border-border/15 bg-foreground/[0.04] text-sm">
                {toast.type === "success" ? "✓" : "!"}
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground/90">
                  {toast.text}
                </p>
                {toast.sub ? (
                  <p className="mt-0.5 text-xs text-muted/70">{toast.sub}</p>
                ) : null}
              </div>
            </div>

            {/* progress bar */}
            <motion.div
              aria-hidden
              className="absolute bottom-0 left-0 h-[2px] w-full bg-foreground/30"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{
                duration: (toast.ms || 1400) / 1000,
                ease: "linear",
              }}
              style={{ transformOrigin: "left" }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
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

function StickyWhatsApp({ href, onClick, isMobile, tick }) {
  if (!isMobile) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] pb-[max(env(safe-area-inset-bottom),0px)] md:hidden">
      <div className="mx-auto max-w-6xl px-3 pb-3">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className="relative flex items-center justify-between gap-3 rounded-2xl border border-border/15 bg-background/80 px-4 py-3 text-sm text-foreground/90 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.38)] overflow-hidden"
        >
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

          <AnimatePresence>
            {tick ? (
              <motion.span
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0 grid place-items-center bg-background/55 backdrop-blur"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-border/15 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/85">
                  Opened <span aria-hidden>✓</span>
                </span>
              </motion.span>
            ) : null}
          </AnimatePresence>
        </a>
      </div>
    </div>
  );
}

/**
 * ✅ UPDATED:
 * - id prop added (default "contact")
 * - hash "#contact" आते ही auto scroll
 * - scroll-mt for navbar offset
 */
export default function ContactSection({ id = "contact", compact = false }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const [topic, setTopic] = useState("webapp");

  /** ✅ Draft (controlled) */
  const [draft, setDraft] = useState({ name: "", email: "", message: "" });

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

  // ✅ hash -> auto scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollIfMatch = () => {
      const hash = (window.location.hash || "").replace("#", "");
      if (!hash) return;
      if (hash !== id) return;

      const el = document.getElementById(id);
      if (!el) return;

      // small delay for layout ready
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    };

    scrollIfMatch();
    window.addEventListener("hashchange", scrollIfMatch);
    return () => window.removeEventListener("hashchange", scrollIfMatch);
  }, [id]);

  // ✅ load from localStorage once + listen broadcasts
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setDraft({
          name: parsed?.name || "",
          email: parsed?.email || "",
          message: parsed?.message || "",
        });
      }
    } catch {}

    const onDraft = (e) => {
      const d = e?.detail || {};
      setDraft({
        name: d?.name || "",
        email: d?.email || "",
        message: d?.message || "",
      });
    };
    window.addEventListener("mukul:contactDraft", onDraft);
    return () => window.removeEventListener("mukul:contactDraft", onDraft);
  }, []);

  const setDraftField = (key, value) => {
    setDraft((prev) => {
      const next = { ...prev, [key]: value };
      if (typeof window !== "undefined") broadcastDraft(next);
      return next;
    });
  };

  // ✅ submit button states
  const [sent, setSent] = useState(false);
  const [ripple, setRipple] = useState(null);
  const btnRef = useRef(null);

  // ✅ WhatsApp tick + haptic
  const [waTick, setWaTick] = useState(false);

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
    if (draft.name?.trim()) lines.push(`Name: ${draft.name.trim()}`);
    if (draft.email?.trim()) lines.push(`Email: ${draft.email.trim()}`);
    if (draft.message?.trim()) {
      lines.push("");
      lines.push("Message:");
      lines.push(draft.message.trim());
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
  }, [whatsappDigits, topic, draft]);

  const mailUrl = useMemo(() => {
    const subject = `Project Inquiry — ${activeTopic.label}`;
    const body = buildMessage();
    return `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EMAIL, topic, draft]);

  /** ✅ Premium toast helper */
  const showToast = (type, text, sub, ms = 1400) => {
    setToast({ type, text, sub, ms });
    setTimeout(() => setToast(null), ms);
  };

  const fireConfetti = () => {
    setConfetti(false);
    requestAnimationFrame(() => setConfetti(true));
    setTimeout(() => setConfetti(false), 1100);
  };

  /** ✅ Copy with label (Email/WhatsApp) */
  const copy = async (text, label = "Text") => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(
        "success",
        `${label} copied`,
        "You can paste it anywhere ✨",
        1400
      );
    } catch {
      showToast("error", "Copy failed", "Please try again.", 1600);
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

  const onWhatsAppClick = () => {
    if (navigator?.vibrate) navigator.vibrate(12);
    setWaTick(true);
    setTimeout(() => setWaTick(false), 900);
    showToast(
      "success",
      "Opening WhatsApp…",
      "Sending your pre-filled message",
      1200
    );
  };

  const onEmailClick = () => {
    if (navigator?.vibrate) navigator.vibrate(8);
    showToast("success", "Opening Email…", "Draft is ready ✉️", 1200);
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
      showToast("success", "Sent!", "I’ll reply soon ✨", 1400);
      fireConfetti();

      setSent(true);
      setTimeout(() => setSent(false), 1600);

      evn.currentTarget.reset();

      // ✅ clear draft (also storage)
      setDraft({ name: "", email: "", message: "" });
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      try {
        broadcastDraft({ name: "", email: "", message: "" });
      } catch {}
    } catch (err) {
      setStatus({ ok: false, msg: err.message || "Something went wrong" });
      showToast("error", "Failed", err.message || "Something went wrong", 1600);
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
        onClick={onWhatsAppClick}
        tick={waTick}
      />

      {/* ✅ NOTE: id + scroll-mt for navbar offset */}
      <section
        id={id}
        className={`${compact ? "py-10" : "py-16"} scroll-mt-24`}
      >
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
                  {/* Email row */}
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/12 bg-foreground/[0.03] px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs text-muted/60">Email</p>
                      <a
                        href={mailUrl}
                        onClick={onEmailClick}
                        className="block truncate text-white/85 underline decoration-white/15 underline-offset-4 transition hover:text-white hover:decoration-white/45"
                      >
                        {EMAIL}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(EMAIL, "Email")}
                      className=" cursor-pointer rounded-xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-xs text-foreground/85 hover:bg-foreground/[0.06]"
                    >
                      Copy
                    </button>
                  </div>

                  {/* WhatsApp row */}
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/12 bg-foreground/[0.03] px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs text-muted/60">WhatsApp</p>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onWhatsAppClick}
                        className="block truncate text-white/85 underline decoration-white/15 underline-offset-4 transition hover:text-white hover:decoration-white/45"
                      >
                        {WHATSAPP}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(WHATSAPP, "WhatsApp")}
                      className="cursor-pointer rounded-xl border border-border/15 bg-foreground/[0.03] px-3 py-2 text-xs text-foreground/85 hover:bg-foreground/[0.06]"
                    >
                      Copy
                    </button>
                  </div>

                  {/* CTA buttons */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onWhatsAppClick}
                      className="relative inline-flex items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] px-5 py-3 text-sm text-foreground/90 backdrop-blur transition hover:bg-foreground/[0.06] overflow-hidden"
                    >
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
                      onClick={onEmailClick}
                      className="relative inline-flex items-center justify-center rounded-2xl border border-border/15 bg-foreground/[0.03] px-5 py-3 text-sm text-foreground/90 backdrop-blur transition hover:bg-foreground/[0.06]"
                    >
                      Email now →
                    </a>
                  </div>
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
                      value={draft.name}
                      onChange={(ev) => setDraftField("name", ev.target.value)}
                    />
                  </Reveal>

                  <Reveal delay={0.05}>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your email"
                      required
                      value={draft.email}
                      onChange={(ev) => setDraftField("email", ev.target.value)}
                    />
                  </Reveal>

                  <Reveal delay={0.08}>
                    <Textarea
                      name="message"
                      placeholder="Your message"
                      required
                      value={draft.message}
                      onChange={(ev) =>
                        setDraftField("message", ev.target.value)
                      }
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
                          className="w-full relative overflow-hidden cursor-pointer"
                        >
                          <span className="relative z-10">
                            {loading
                              ? "Sending..."
                              : sent
                              ? "Sent ✓"
                              : "Send Message"}
                          </span>

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

          {/* ✅ spacing so sticky bar doesn't cover */}
          <div className="h-20 md:hidden" />
        </Container>
      </section>
    </>
  );
}

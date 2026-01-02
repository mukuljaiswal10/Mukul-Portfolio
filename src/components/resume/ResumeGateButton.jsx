"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import LuxuryButton from "@/components/ui/LuxuryButton";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const onlyDigits = (v) => String(v || "").replace(/\D/g, "");

export default function ResumeGateButton({
  children = "Download Resume →",
  variant = "outline",
  className = "",
  purpose = "Resume Access",
  source = "resume-gate",
}) {
  const ridRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("form"); // form | thanks | error
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: purpose, // optional
    consent: true,
    website: "", // honeypot
  });

  // ✅ portal mount
  useEffect(() => setMounted(true), []);

  // ✅ body scroll lock + ESC close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape" && !loading) setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, loading]);

  const errors = useMemo(() => {
    const e = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = onlyDigits(form.phone);

    if (name.length < 2) e.name = "Enter at least 2 characters.";
    if (!EMAIL_RE.test(email)) e.email = "Enter a valid email.";
    if (phone.length !== 10) e.phone = "Enter a valid 10-digit mobile number.";
    if (!form.consent) e.consent = "Consent is required.";
    return e;
  }, [form]);

  const canSubmit = useMemo(() => {
    return (
      !loading &&
      !form.website && // honeypot must stay empty
      form.consent &&
      Object.keys(errors).length === 0
    );
  }, [loading, form.website, form.consent, errors]);

  const resetModal = () => {
    setStep("form");
    setMsg("");
    setLoading(false);
    setForm({
      name: "",
      email: "",
      phone: "",
      purpose: purpose,
      consent: true,
      website: "",
    });
  };

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!canSubmit) {
      setMsg("Please fix the highlighted fields.");
      return;
    }

    // ✅ unique request id (per click)
    const rid = (
      globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`
    )
      .toString()
      .replaceAll(".", "");
    ridRef.current = rid;

    // ✅ user gesture: open opening page tab (NOT about:blank)
    const resumeTab = window.open(`/resume/opening?rid=${rid}`, "_blank"); // ✅ keep max compatible

    setLoading(true);

    try {
      const res = await fetch("/api/resume/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: String(form.phone).replace(/\D/g, ""),
          purpose: (form.purpose || purpose).trim(),
          source,
          website: form.website,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        setStep("error");
        setMsg(data?.message || "Something went wrong. Try again.");
        setLoading(false);
        if (resumeTab && !resumeTab.closed) resumeTab.close();
        return;
      }

      setStep("thanks");

      // ✅ build absolute url
      const url = data?.resumeUrl; // like "/api/resume/download?token=..."
      const fullUrl = url ? `${window.location.origin}${url}` : null;

      if (!fullUrl) {
        setStep("error");
        setMsg("Resume link missing. Please try again.");
        setLoading(false);
        if (resumeTab && !resumeTab.closed) resumeTab.close();
        return;
      }

      // ✅ IMPORTANT: opening page will read this and redirect itself after 5s
      // Save BOTH keys for compatibility (some opening code reads url, some reads fullUrl)
      const payload = {
        url: fullUrl,
        fullUrl: fullUrl,
        createdAt: Date.now(),
        delayMs: 5000, // ✅ your requirement
      };

      // localStorage.setItem(`resume_gate:${rid}`, JSON.stringify({fullUrl, createdAt: Date.now(),delayMs:5000}));
      localStorage.setItem(`resume_gate:${rid}`, JSON.stringify(payload));

      // ✅ Best: send instantly to opening tab (no polling wait)
      try {
        resumeTab?.postMessage(
          { type: "RESUME_READY", rid, url: fullUrl, delayMs: 5000 },
          window.location.origin
        );
      } catch (err) {}

      // ✅ Popup blocked fallback: open in same tab after 5s
      if (!resumeTab) {
        setMsg("Popup blocked. Please allow popups/downloads for this site.");
        setTimeout(() => {
          window.location.href = fullUrl;
        }, 5000);
      }

      // ✅ close modal quickly so it never flashes again
      setTimeout(() => setOpen(false), 150);

      setLoading(false);

      // ✅ reset form later
      setTimeout(() => resetModal(), 6500);
    } catch (err) {
      setStep("error");
      setMsg("Network error. Please try again.");
      setLoading(false);
    }
  }

  const Modal = (
    <div
      className="fixed inset-0 z-[999999] isolate"
      role="dialog"
      aria-modal="true"
      aria-label="Access Resume"
    >
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={() => (!loading ? setOpen(false) : null)}
        className="absolute inset-0 bg-black/70 backdrop-blur-[3px]"
      />

      {/* Center wrapper */}
      <div className="relative grid min-h-[100dvh] place-items-center p-4 sm:p-6">
        {/* Panel */}
        <div className="relative w-full max-w-[560px] overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-b from-[#0d0d12] to-[#060609] shadow-2xl ring-1 ring-white/10">
          {/* Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-24 opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 25% 15%, rgba(233,200,106,0.22), transparent 55%)",
            }}
          />

          {/* Header */}
          <div className="relative flex items-start justify-between gap-4 p-5 sm:p-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Secure Resume Gateway
              </div>

              <h3 className="mt-3 text-xl font-semibold text-white">
                {step === "thanks" ? "Thanks! ✅" : "Access Resume"}
              </h3>
              <p className="mt-1 text-sm text-white/70">
                {step === "thanks"
                  ? "Opening page will show ~5 seconds, then resume opens."
                  : "Fill details to view the resume."}
              </p>
            </div>

            <button
              onClick={() => (!loading ? setOpen(false) : null)}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Body (scrollable if needed) */}
          <div className="relative px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="max-h-[70dvh] overflow-y-auto pr-1">
              {/* FORM */}
              {step === "form" ? (
                <form onSubmit={onSubmit} className="space-y-3">
                  {/* honeypot */}
                  <input
                    value={form.website}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, website: e.target.value }))
                    }
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  <Field
                    label="Full Name *"
                    placeholder="Your name"
                    value={form.name}
                    error={errors.name}
                    onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                    autoComplete="name"
                  />

                  <Field
                    label="Email *"
                    placeholder="you@email.com"
                    value={form.email}
                    error={errors.email}
                    onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                    autoComplete="email"
                  />

                  {/* Phone */}
                  <div>
                    <label className="text-xs text-white/70">
                      Phone (10 digits) *
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => {
                        const digits = onlyDigits(e.target.value).slice(0, 10);
                        setForm((p) => ({ ...p, phone: digits }));
                      }}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      className={[
                        "mt-1 w-full rounded-2xl border bg-white/5 px-4 py-3 text-white outline-none",
                        "focus:border-white/30",
                        errors.phone ? "border-red-400/45" : "border-white/10",
                      ].join(" ")}
                      placeholder="10 digit mobile number"
                      autoComplete="tel"
                    />
                    <div className="mt-1 flex items-center justify-between text-[11px] text-white/55">
                      <span>Only numbers allowed</span>
                      <span>{onlyDigits(form.phone).length}/10</span>
                    </div>
                    {errors.phone ? (
                      <p className="mt-1 text-xs text-red-300">
                        {errors.phone}
                      </p>
                    ) : null}
                  </div>

                  <Field
                    label="Purpose (optional)"
                    placeholder="Resume Access"
                    value={form.purpose}
                    error={null}
                    onChange={(v) => setForm((p) => ({ ...p, purpose: v }))}
                  />

                  {/* Consent */}
                  <label className="flex items-start gap-2 text-xs text-white/70">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, consent: e.target.checked }))
                      }
                      className="mt-0.5"
                    />
                    I agree to share my details for contact regarding
                    opportunities.
                  </label>
                  {errors.consent ? (
                    <p className="text-xs text-red-300">{errors.consent}</p>
                  ) : null}

                  {msg ? <p className="text-sm text-red-300">{msg}</p> : null}

                  <LuxuryButton
                    as="button"
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={!canSubmit}
                  >
                    {loading ? "Submitting..." : "Submit & View Resume"}
                  </LuxuryButton>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] text-white/60">
                    🔒 Privacy-first: Details saved securely. <br />⏳ Secure
                    link is time-limited.
                  </div>
                </form>
              ) : null}

              {/* THANKS */}
              {step === "thanks" ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  ✅ Details received. Opening in ~5 seconds…
                  <div className="mt-2 text-xs text-white/60">
                    Tip: If it doesn’t open, allow popups/downloads for this
                    site.
                  </div>
                </div>
              ) : null}

              {/* ERROR */}
              {step === "error" ? (
                <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
                  {msg || "Something went wrong."}
                  <div className="mt-3 flex gap-2">
                    <LuxuryButton
                      as="button"
                      variant="outline"
                      onClick={() => {
                        setStep("form");
                        setMsg("");
                      }}
                    >
                      Try Again
                    </LuxuryButton>
                    <LuxuryButton
                      as="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </LuxuryButton>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Trigger */}
      <LuxuryButton
        as="button"
        variant={variant}
        className={className}
        onClick={() => {
          setOpen(true);
          setStep("form");
          setMsg("");
        }}
      >
        {children}
      </LuxuryButton>

      {/* ✅ PORTAL => no overlap, true center */}
      {mounted && open ? createPortal(Modal, document.body) : null}
    </>
  );
}

function Field({ label, value, onChange, placeholder, error, autoComplete }) {
  return (
    <div>
      <label className="text-xs text-white/70">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "mt-1 w-full rounded-2xl border bg-white/5 px-4 py-3 text-white outline-none",
          "focus:border-white/30",
          error ? "border-red-400/45" : "border-white/10",
        ].join(" ")}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}

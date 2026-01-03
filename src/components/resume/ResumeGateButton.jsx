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

  // ✅ UPDATED: step now includes otp
  const [step, setStep] = useState("form"); // form | otp | thanks | error
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: purpose,
    consent: true,
    website: "",
  });

  const [otp, setOtp] = useState("");
  const [resendLeft, setResendLeft] = useState(0);

  useEffect(() => setMounted(true), []);

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

  useEffect(() => {
    if (!open) return;
    if (resendLeft <= 0) return;
    const t = setInterval(() => setResendLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [open, resendLeft]);

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
      !form.website &&
      form.consent &&
      Object.keys(errors).length === 0
    );
  }, [loading, form.website, form.consent, errors]);

  const resetModal = () => {
    setStep("form");
    setMsg("");
    setLoading(false);
    setOtp("");
    setResendLeft(0);
    setForm({
      name: "",
      email: "",
      phone: "",
      purpose: purpose,
      consent: true,
      website: "",
    });
    ridRef.current = null;
  };

  async function sendOtp({ rid, email }) {
    const res = await fetch("/api/resume/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rid, email }),
    });
    const data = await res.json().catch(() => ({}));
    return { res, data };
  }

  async function verifyOtp({ rid, email, otp }) {
    const res = await fetch("/api/resume/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rid, email, otp }),
    });
    const data = await res.json().catch(() => ({}));
    return { res, data };
  }

  function handoffToOpening({ rid, fullUrl, resumeTab }) {
    const payload = {
      url: fullUrl,
      fullUrl: fullUrl,
      createdAt: Date.now(),
      delayMs: 5000,
    };

    try {
      localStorage.setItem(`resume_gate:${rid}`, JSON.stringify(payload));
    } catch {}

    try {
      resumeTab?.postMessage(
        { type: "RESUME_READY", rid, url: fullUrl, delayMs: 5000 },
        window.location.origin
      );
    } catch {}
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!canSubmit) {
      setMsg("Please fix the highlighted fields.");
      return;
    }

    const rid = (
      globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`
    )
      .toString()
      .replaceAll(".", "");
    ridRef.current = rid;

    setLoading(true);

    try {
      const { res, data } = await sendOtp({
        rid,
        email: form.email.trim(),
      });

      if (!res.ok || !data?.ok) {
        setStep("error");
        setMsg(data?.message || "Failed to send OTP. Try again.");
        setLoading(false);
        return;
      }

      setStep("otp");
      setMsg("OTP sent to your email. Please enter it below.");
      setOtp("");
      setResendLeft(30);
      setLoading(false);
    } catch (err) {
      setStep("error");
      setMsg("Network error while sending OTP. Please try again.");
      setLoading(false);
    }
  }

  async function onVerifyOtp(e) {
    e.preventDefault();
    setMsg("");

    const rid = ridRef.current;
    const email = form.email.trim();
    const code = String(otp || "")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (!rid) {
      setStep("error");
      setMsg("Session missing. Please try again.");
      return;
    }

    if (code.length !== 4) {
      setMsg("Please enter a valid 4-digit OTP.");
      return;
    }

    const resumeTab = window.open(`/resume/opening?rid=${rid}`, "_blank");

    setLoading(true);

    try {
      const { res: vRes, data: vData } = await verifyOtp({
        rid,
        email,
        otp: code,
      });

      if (!vRes.ok || !vData?.ok) {
        setLoading(false);

        if (resumeTab && !resumeTab.closed) resumeTab.close();

        setOpen(false);
        setTimeout(() => resetModal(), 250);

        const reason = encodeURIComponent(vData?.message || "otp_invalid");
        window.location.href = `/resume/otp-failed?reason=${reason}`;
        return;
      }

      const leadRes = await fetch("/api/resume/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rid,
          name: form.name.trim(),
          email,
          phone: String(form.phone).replace(/\D/g, ""),
          purpose: (form.purpose || purpose).trim(),
          source,
          website: form.website,
        }),
      });

      const leadData = await leadRes.json().catch(() => ({}));

      if (!leadRes.ok || !leadData?.ok) {
        setStep("error");
        setMsg(leadData?.message || "Something went wrong. Try again.");
        setLoading(false);
        if (resumeTab && !resumeTab.closed) resumeTab.close();
        return;
      }

      const url = leadData?.resumeUrl;
      const fullUrl = url ? `${window.location.origin}${url}` : null;

      if (!fullUrl) {
        setStep("error");
        setMsg("Resume link missing. Please try again.");
        setLoading(false);
        if (resumeTab && !resumeTab.closed) resumeTab.close();
        return;
      }

      handoffToOpening({ rid, fullUrl, resumeTab });

      if (!resumeTab) {
        setMsg("Popup blocked. Please allow popups/downloads for this site.");
        setTimeout(() => {
          window.location.href = fullUrl;
        }, 5000);
      }

      setStep("thanks");
      setTimeout(() => setOpen(false), 150);

      setLoading(false);
      setTimeout(() => resetModal(), 6500);
    } catch (err) {
      setStep("error");
      setMsg("Network error. Please try again.");
      setLoading(false);
    }
  }

  async function onResendOtp() {
    if (loading) return;
    if (resendLeft > 0) return;

    const rid = ridRef.current;
    const email = form.email.trim();

    if (!rid || !EMAIL_RE.test(email)) {
      setMsg("Email missing. Please go back and try again.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const { res, data } = await sendOtp({ rid, email });
      if (!res.ok || !data?.ok) {
        setMsg(data?.message || "Failed to resend OTP. Try again.");
        setLoading(false);
        return;
      }
      setMsg("OTP resent. Please check your email.");
      setResendLeft(30);
      setLoading(false);
    } catch {
      setMsg("Network error while resending OTP.");
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
      <button
        aria-label="Close"
        onClick={() => (!loading ? setOpen(false) : null)}
        className="absolute inset-0 bg-black/70 backdrop-blur-[3px]"
      />

      {/* ✅ UPDATED: no scroll, fit height */}
      <div className="relative grid h-[100dvh] place-items-center p-3 sm:p-5">
        {/* ✅ UPDATED: max height + flex column */}
        <div className="relative w-full max-w-[560px] max-h-[92dvh] flex flex-col overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-b from-[#0d0d12] to-[#060609] shadow-2xl ring-1 ring-white/10">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-24 opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 25% 15%, rgba(233,200,106,0.22), transparent 55%)",
            }}
          />

          {/* ✅ Slightly tighter on mobile */}
          <div className="relative flex items-start justify-between gap-4 p-4 sm:p-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Secure Resume Gateway
              </div>

              <h3 className="mt-2 sm:mt-3 text-xl font-semibold text-white">
                {step === "thanks"
                  ? "Thanks! ✅"
                  : step === "otp"
                  ? "Verify OTP"
                  : "Access Resume"}
              </h3>
              <p className="mt-1 text-sm text-white/70">
                {step === "thanks"
                  ? "Opening page will show ~5 seconds, then resume opens."
                  : step === "otp"
                  ? "Enter the 4-digit code sent to your email."
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

          {/* ✅ UPDATED: padding reduced + no internal scroll */}
          <div className="relative px-4 pb-4 sm:px-6 sm:pb-5 flex-1">
          {/* <div className="relative px-4 pb-[calc(18px+env(safe-area-inset-bottom))] sm:px-6 sm:pb-6 flex-1"> */}
            <div className="pr-0">
              {step === "form" ? (
                <form onSubmit={onSubmit} className="space-y-2 sm:space-y-3">
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
                        "mt-1 w-full rounded-2xl border bg-white/5 px-4 py-2.5 sm:py-3 text-white outline-none",
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

                  {/* <Field
                    label="Purpose (optional)"
                    placeholder="Resume Access"
                    value={form.purpose}
                    error={null}
                    onChange={(v) => setForm((p) => ({ ...p, purpose: v }))}
                  /> */}

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
                    className="w-full mb-2"
                    disabled={!canSubmit}
                  >
                    {loading ? "Sending OTP..." : "Submit & Get OTP"}
                  </LuxuryButton>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5 sm:p-3 text-[11px] text-white/60">
                    🔒 Privacy-first: Details saved securely. <br />⏳ Secure
                    link is time-limited.
                  </div>
                </form>
              ) : null}

              {step === "otp" ? (
                <form onSubmit={onVerifyOtp} className="space-y-2 sm:space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5 sm:p-3 text-[11px] text-white/70">
                    OTP sent to:{" "}
                    <span className="text-white">{form.email.trim()}</span>
                  </div>

                  <div>
                    <label className="text-xs text-white/70">
                      Enter 4-digit OTP *
                    </label>
                    <input
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          String(e.target.value).replace(/\D/g, "").slice(0, 4)
                        )
                      }
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      className={[
                        "mt-1 w-full rounded-2xl border bg-white/5 px-4 py-2.5 sm:py-3 text-white outline-none tracking-[0.35em] text-center",
                        "focus:border-white/30",
                      ].join(" ")}
                      placeholder="••••"
                      autoComplete="one-time-code"
                    />
                    <div className="mt-1 flex items-center justify-between text-[11px] text-white/55">
                      <span>Only numbers allowed</span>
                      <span>{String(otp || "").length}/4</span>
                    </div>
                  </div>

                  {msg ? <p className="text-sm text-red-300">{msg}</p> : null}

                  <LuxuryButton
                    as="button"
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={loading || String(otp || "").length !== 4}
                  >
                    {loading ? "Verifying..." : "Verify OTP & Open Resume"}
                  </LuxuryButton>

                  <div className="flex items-center justify-between gap-2">
                    <LuxuryButton
                      as="button"
                      variant="outline"
                      type="button"
                      onClick={() => {
                        if (loading) return;
                        setStep("form");
                        setMsg("");
                        setOtp("");
                      }}
                    >
                      Back
                    </LuxuryButton>

                    <LuxuryButton
                      as="button"
                      variant="outline"
                      type="button"
                      onClick={onResendOtp}
                      disabled={loading || resendLeft > 0}
                    >
                      {resendLeft > 0
                        ? `Resend in ${resendLeft}s`
                        : "Resend OTP"}
                    </LuxuryButton>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5 sm:p-3 text-[11px] text-white/60">
                    ✅ OTP is valid for a short time. Please verify to continue.
                  </div>
                </form>
              ) : null}

              {step === "thanks" ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 text-sm text-white/80">
                  ✅ Verified. Opening in ~5 seconds…
                  <div className="mt-2 text-xs text-white/60">
                    Tip: If it doesn’t open, allow popups/downloads for this
                    site.
                  </div>
                </div>
              ) : null}

              {step === "error" ? (
                <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-3 sm:p-4 text-sm text-red-200">
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
      <LuxuryButton
        as="button"
        variant={variant}
        className={className}
        onClick={() => {
          setOpen(true);
          setStep("form");
          setMsg("");
          setOtp("");
        }}
      >
        {children}
      </LuxuryButton>

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
          "mt-1 w-full rounded-2xl border bg-white/5 px-4 py-2.5 sm:py-3 text-white outline-none",
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

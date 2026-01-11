"use client";

import { useEffect, useMemo, useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  // type: idle | success | info | error
  const [loading, setLoading] = useState(false);

  const emailValid = useMemo(() => {
    const v = email.trim().toLowerCase();
    return v.includes("@") && v.length >= 6;
  }, [email]);

  useEffect(() => {
    if (status.type !== "idle") {
      const t = setTimeout(
        () => setStatus({ type: "idle", message: "" }),
        5000
      );
      return () => clearTimeout(t);
    }
  }, [status.type]);

  const submit = async (e) => {
    e.preventDefault();
    if (!emailValid || loading) return;

    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          type: "error",
          message: data?.message || "Something went wrong. Please try again.",
        });
      } else {
        if (data?.isNew) {
          setStatus({
            type: "success",
            message:
              "✅ You’re subscribed! You’ll get notified whenever a new blog goes live.",
          });
          setEmail("");
        } else {
          setStatus({
            type: "info",
            message: "✅ You’re already subscribed with this email.",
          });
        }
      }
    } catch {
      setStatus({
        type: "error",
        message: "Network issue. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const badgeClass =
    status.type === "success"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
      : status.type === "info"
      ? "border-[#E7C266]/30 bg-[#E7C266]/10 text-[#E7C266]"
      : status.type === "error"
      ? "border-red-400/30 bg-red-400/10 text-red-300"
      : "border-white/10 bg-white/5 text-white/70";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/12 bg-foreground/[0.02] p-6 sm:p-8">
      {/* soft premium glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#E7C266]/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-foreground/55">
              Newsletter
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-[#E7C266]">
              Get new blog updates
            </h3>
            <p className="mt-2 max-w-xl text-sm text-foreground/70">
              Subscribe once — and you’ll be notified whenever I publish a new
              blog post.
            </p>
          </div>

          <span className="rounded-full border border-border/15 bg-black/20 px-3 py-1 text-xs text-foreground/70">
            No spam • Unsubscribe anytime
          </span>
        </div>

        <form onSubmit={submit} className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="group relative flex-1">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={[
                  "w-full rounded-2xl border border-border/15 bg-black/25 px-4 py-3",
                  "text-[16px] sm:text-sm text-foreground/90 placeholder:text-foreground/40",
                  "outline-none transition",
                  "focus:border-[#E7C266]/40 focus:bg-black/30",
                ].join(" ")}
                inputMode="email"
                autoComplete="email"
              />

              {/* subtle underline glow */}
              <div className="pointer-events-none absolute inset-x-4 -bottom-1 h-px bg-transparent group-focus-within:bg-[#E7C266]/30 transition" />
            </div>

            <button
              type="submit"
              disabled={!emailValid || loading}
              className={[
                "relative overflow-hidden rounded-2xl px-5 py-3 text-sm font-medium","border border-[#E7C266]/25 bg-[#E7C266]/[0.10] text-[#E7C266]",
                "hover:bg-[#E7C266]/[0.16] hover:border-[#E7C266]/40 transition",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "sm:min-w-[170px]",
              ].join(" ")}
            >
              <span className="relative">
                {loading ? "Subscribing..." : "Subscribe"}
              </span>

              {/* button shimmer */}
              <span className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition">
                <span className="absolute -left-24 top-0 h-full w-24 rotate-12 bg-white/10 blur-md animate-[mj_shine_1.2s_ease-in-out_infinite]" />
              </span>
            </button>
          </div>

          {/* status message */}
          {status.message ? (
            <div
              className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${badgeClass}`}
            >
              {status.message}
            </div>
          ) : (
            <div className="mt-4 text-xs text-foreground/55">
              Tip: Add your primary email so you never miss updates.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

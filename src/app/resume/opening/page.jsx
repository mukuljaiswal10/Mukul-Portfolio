
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LuxuryButton from "@/components/ui/LuxuryButton";

export default function ResumeOpeningPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const rid = sp.get("rid");

  const [status, setStatus] = useState("waiting"); // waiting | ready | missing
  const [payload, setPayload] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(5);

  const key = useMemo(() => (rid ? `resume_gate:${rid}` : null), [rid]);

  const redirectedRef = useRef(false);
  const startedCountdownRef = useRef(false);

  const resolveUrlFromData = (data) => {
    const u = data?.fullUrl || data?.url || null;
    return typeof u === "string" && u.length > 5 ? u : null;
  };

  const armCountdown = (data) => {
    const url = resolveUrlFromData(data);
    if (!url) return;

    if (redirectedRef.current) return;

    const delayMs = Number(data?.delayMs || 5000);
    const secs = Math.max(1, Math.ceil(delayMs / 1000));

    setPayload({ ...data, fullUrl: url }); // normalize
    setSecondsLeft(secs);
    setStatus("ready");
  };

  // ✅ OPTION A: FULL SCREEN LOCK (no scroll + no outside clicks)
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  // ✅ SCREEN LOCK (no scroll / no accidental gestures / no context menu)
  useEffect(() => {
    const prevent = (e) => e.preventDefault();

    const onKey = (e) => {
      // allow Escape only (optional)
      if (e.key === "Escape") return;
      e.preventDefault();
    };

    document.addEventListener("touchmove", prevent, { passive: false });
    document.addEventListener("wheel", prevent, { passive: false });
    document.addEventListener("contextmenu", prevent);
    window.addEventListener("keydown", onKey, { passive: false });

    return () => {
      document.removeEventListener("touchmove", prevent);
      document.removeEventListener("wheel", prevent);
      document.removeEventListener("contextmenu", prevent);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // ✅ FAST PATH: opener -> postMessage (best reliability)
  useEffect(() => {
    if (!rid) return;

    const onMsg = (e) => {
      if (e.origin !== window.location.origin) return;
      const d = e.data;
      if (!d || d.type !== "RESUME_READY") return;
      if (d.rid && d.rid !== rid) return;

      const data = {
        createdAt: Date.now(),
        delayMs: Number(d.delayMs || 5000),
        fullUrl: d.url,
      };

      try {
        if (key) localStorage.setItem(key, JSON.stringify(data));
      } catch {}

      armCountdown(data);
    };

    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [rid, key]);

  // ✅ Poll localStorage (fallback)
  useEffect(() => {
    if (!key) {
      setStatus("missing");
      return;
    }

    setStatus("waiting");

    let t;
    const startedAt = Date.now();

    const poll = () => {
      try {
        const raw = localStorage.getItem(key);

        // max 6s wait
        if (!raw) {
          if (Date.now() - startedAt > 6000) {
            setStatus("missing");
            return;
          }
          t = setTimeout(poll, 200);
          return;
        }

        const data = JSON.parse(raw);

        // expire after 2 minutes
        const age = Date.now() - (data?.createdAt || 0);
        if (age > 2 * 60 * 1000) {
          localStorage.removeItem(key);
          setStatus("missing");
          return;
        }

        armCountdown(data);
      } catch {
        setStatus("missing");
      }
    };

    poll();
    return () => clearTimeout(t);
  }, [key]);

  // ✅ Countdown + redirect (NO status toggling, so interval never gets cleared)
  useEffect(() => {
    if (status !== "ready") return;
    if (!payload?.fullUrl) return;
    if (redirectedRef.current) return;
    if (startedCountdownRef.current) return;

    startedCountdownRef.current = true;

    let s = Math.max(1, Number(secondsLeft || 5));

    const interval = setInterval(() => {
      s -= 1;
      setSecondsLeft(s);

      if (s <= 0) {
        clearInterval(interval);

        try {
          if (key) localStorage.removeItem(key);
        } catch {}

        redirectedRef.current = true;

        // ✅ open resume in THIS tab
        window.location.replace(payload.fullUrl);
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, payload?.fullUrl, key]);

  const onCancel = () => {
    try {
      if (key) localStorage.removeItem(key);
    } catch {}

    window.close();
    router.push("/");
  };

  return (
    // ✅ IMPORTANT: fixed overlay + highest z-index => navbar/menu behind becomes unclickable
    <main className="fixed inset-0 z-[2147483647] min-h-[100dvh] bg-[#07070b] px-4 py-10 sm:px-6">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 20% 15%, rgba(233,200,106,0.18), transparent 55%), radial-gradient(circle at 80% 25%, rgba(255,255,255,0.06), transparent 60%), radial-gradient(circle at 50% 90%, rgba(233,200,106,0.10), transparent 60%)",
        }}
      />

      {/* Center */}
      <div className="mx-auto grid min-h-[calc(100dvh-5rem)] max-w-3xl place-items-center">
        <div className="relative w-full overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-b from-[#0d0d12] to-[#060609] p-5 shadow-2xl ring-1 ring-white/10 sm:p-7">
          {/* Animated border glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-[2px] rounded-[26px] opacity-60 blur-xl"
            style={{
              background:
                "conic-gradient(from 180deg, rgba(233,200,106,0.00), rgba(233,200,106,0.22), rgba(255,255,255,0.10), rgba(233,200,106,0.00))",
              animation: "spinGlow 6s linear infinite",
            }}
          />

          {/* Header */}
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Secure Resume Gateway
              </div>

              <h1 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                Opening your resume…
              </h1>
              <p className="mt-1 text-sm text-white/70">
                We’re verifying details and generating a time-limited secure
                link.
              </p>
            </div>

            <LuxuryButton
              as="button"
              variant="outline"
              className="shrink-0"
              onClick={onCancel}
            >
              Cancel / Back
            </LuxuryButton>
          </div>

          {/* Progress */}
          <div className="relative mt-6">
            <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
              <div className="h-full w-full shimmer" />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-white/60">
              <span>
                {status === "missing"
                  ? "Waiting for confirmation…"
                  : `Opening in ${secondsLeft}s…`}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                Privacy-first • Time-limited link
              </span>
            </div>
          </div>

          {/* Checklist */}
          <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
            <CheckRow text="Spam protection enabled" />
            <CheckRow text="Email format validated" />
            <CheckRow text="Phone verification rules applied" />
            <CheckRow text="Secure download link generated" />
          </div>

          {/* Tip */}
          <div className="relative mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            ✅ Tip: If resume doesn’t open, allow popups/downloads for this
            site.
          </div>

          {/* Footer note */}
          <p className="relative mt-4 text-[11px] text-white/45">
            This tab will automatically continue to your resume.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spinGlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .shimmer {
          width: 100%;
          background: linear-gradient(
            90deg,
            rgba(233, 200, 106, 0.05) 0%,
            rgba(233, 200, 106, 0.35) 35%,
            rgba(255, 255, 255, 0.1) 55%,
            rgba(233, 200, 106, 0.05) 100%
          );
          animation: shimmerMove 1.2s ease-in-out infinite;
        }
        @keyframes shimmerMove {
          0% {
            transform: translateX(-60%);
            opacity: 0.5;
          }
          50% {
            transform: translateX(0%);
            opacity: 1;
          }
          100% {
            transform: translateX(60%);
            opacity: 0.5;
          }
        }
      `}</style>
    </main>
  );
}

function CheckRow({ text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
          ✓
        </span>
        <span className="leading-snug">{text}</span>
      </div>
    </div>
  );
}

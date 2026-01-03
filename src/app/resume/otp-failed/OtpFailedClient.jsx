"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OtpFailedClient() {
  const sp = useSearchParams();
  const reason = useMemo(() => sp.get("reason") || "invalid", [sp]);

  const title =
    reason === "missing_rid" ? "Session not found" : "OTP verification failed";
  const desc =
    reason === "missing_rid"
      ? "We couldn't validate your session. Please try again."
      : "The OTP you entered is incorrect or expired. Please request a new OTP.";

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-400/15 border border-rose-400/25 flex items-center justify-center">
            <span className="text-rose-300 text-lg">!</span>
          </div>
          <div>
            <p className="text-lg sm:text-xl font-semibold">{title}</p>
            <p className="text-white/60 text-sm">{desc}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/"
            className="w-full rounded-xl bg-white text-zinc-950 font-semibold py-3 text-center hover:opacity-90 transition"
          >
            Go back & try again
          </Link>

          <p className="text-xs text-white/50 text-center">
            Tip: Request a fresh OTP and enter it within time.
          </p>
        </div>
      </div>
    </div>
  );
}

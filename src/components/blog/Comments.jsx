"use client";

import { useEffect, useMemo, useState } from "react";

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function initials(name) {
  const n = String(name || "").trim();
  if (!n) return "U";
  const parts = n.split(" ").filter(Boolean);
  const a = parts[0]?.[0] || "U";
  const b = parts[1]?.[0] || "";
  return (a + b).toUpperCase();
}

export default function Comments({ slug }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState({ type: "idle", message: "" }); // idle|success|info|error
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const canSubmit = useMemo(() => {
    return name.trim().length >= 2 && message.trim().length >= 2 && !loading;
  }, [name, message, loading]);

  const load = async () => {
    if (!slug) return;
    setLoadingList(true);
    try {
      const res = await fetch(`/api/comments/${slug}`, { cache: "no-store" });
      const data = await res.json();
      setComments(Array.isArray(data.comments) ? data.comments : []);
    } catch {
      // ignore
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    // slug change = reset UI state + load correct comments
    setComments([]);
    setStatus({ type: "idle", message: "" });
    if (slug) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (status.type !== "idle") {
      const t = setTimeout(
        () => setStatus({ type: "idle", message: "" }),
        4500
      );
      return () => clearTimeout(t);
    }
  }, [status.type]);

  const submit = async (e) => {
    e.preventDefault();
    if (!slug) return;

    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const res = await fetch(`/api/comments/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          type: "error",
          message: data?.message || "Something went wrong.",
        });
      } else {
        setStatus({
          type: "success",
          message: "✅ Comment posted successfully!",
        });
        setName("");
        setEmail("");
        setMessage("");
        await load();
      }
    } catch {
      setStatus({ type: "error", message: "Network issue. Please try again." });
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

  if (!slug) {
    return (
      <div className="rounded-3xl border border-border/12 bg-foreground/[0.02] p-6 sm:p-8">
        <p className="text-sm text-foreground/70">
          Comments unavailable (missing slug).
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/12 bg-foreground/[0.02] p-6 sm:p-8">
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#E7C266]/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-foreground/55">
              Comments
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-[#E7C266]">
              Leave a comment
            </h3>
            <p className="mt-2 max-w-xl text-sm text-foreground/70">
              Your email is optional and will not be shown publicly.
            </p>
          </div>

          <span className="rounded-full border border-border/15 bg-black/20 px-3 py-1 text-xs text-foreground/70">
            Be respectful • No spam
          </span>
        </div>

        {/* form */}
        <form onSubmit={submit} className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-2xl border border-border/15 bg-black/25 px-4 py-3 text-[16px] sm:text-sm text-foreground/90 placeholder:text-foreground/40 outline-none transition focus:border-[#E7C266]/40 focus:bg-black/30"
              placeholder="Your name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />

            <input
              className="rounded-2xl border border-border/15 bg-black/25 px-4 py-3 text-[16px] sm:text-sm text-foreground/90 placeholder:text-foreground/40 outline-none transition focus:border-[#E7C266]/40 focus:bg-black/30"
              placeholder="Your email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputMode="email"
              autoComplete="email"
            />
          </div>

          <textarea
            className="mt-3 min-h-[120px] w-full rounded-2xl border border-border/15 bg-black/25 px-4 py-3 text-[16px] sm:text-sm text-foreground/90 placeholder:text-foreground/40 outline-none transition focus:border-[#E7C266]/40 focus:bg-black/30"
            placeholder="Write your comment*"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-2xl border border-[#E7C266]/25 bg-[#E7C266]/[0.10] px-5 py-3 text-sm font-medium text-[#E7C266] hover:bg-[#E7C266]/[0.16] hover:border-[#E7C266]/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>

            <p className="text-xs text-foreground/55">
              Posting as{" "}
              <span className="text-foreground/80">{name || "Guest"}</span>
            </p>
          </div>

          {status.message ? (
            <div
              className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${badgeClass}`}
            >
              {status.message}
            </div>
          ) : null}
        </form>

        {/* list */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground/80">
              {loadingList ? "Loading..." : `All comments (${comments.length})`}
            </p>
          </div>

          {comments.length === 0 ? (
            <div className="rounded-2xl border border-border/12 bg-black/20 p-5 text-sm text-foreground/70">
              No comments yet. Be the first one ✨
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-border/12 bg-black/20 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl border border-[#E7C266]/25 bg-[#E7C266]/10 flex items-center justify-center text-sm font-semibold text-[#E7C266]">
                        {initials(c.name)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground/90">
                          {c.name}
                        </p>
                        <p className="text-xs text-foreground/55">
                          {formatTime(c.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 whitespace-pre-line text-sm text-foreground/80 leading-relaxed">
                    {c.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* tiny footer */}
        <div className="mt-6 text-xs text-foreground/45">
          Tip: New comments also send a notification to the site owner.
        </div>
      </div>
    </div>
  );
}

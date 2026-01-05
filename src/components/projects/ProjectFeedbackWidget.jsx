"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function normalizeSlug(slug) {
  return String(slug || "")
    .trim()
    .toLowerCase()
    .replace(/%20/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ✅ persisted key
function keyV2(slug) {
  return `mukul:project-feedback:v2:${normalizeSlug(slug) || "unknown"}`;
}
// ✅ legacy
function keyV1(slug) {
  return `mukul:pfw:v1:${normalizeSlug(slug) || "unknown"}`;
}
// ✅ draft key (unsaved changes)
function draftKey(slug) {
  return `mukul:project-feedback:draft:v2:${normalizeSlug(slug) || "unknown"}`;
}

function nowStamp() {
  return new Date().toLocaleString();
}

function PortalModal({ open, title, desc, badge, onClose, actions }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* overlay */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* modal box */}
          <motion.div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-zinc-950/95 p-4 sm:p-5 shadow-2xl"
            initial={{ y: 18, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* sparkle/glow */}
            <div className="pointer-events-none absolute -inset-24 opacity-70">
              <div className="absolute left-10 top-16 h-64 w-64 rounded-full bg-[#d9c38a]/25 blur-3xl" />
              <div className="absolute right-10 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9c38a]/15 blur-3xl" />
            </div>

            {/* shimmer line */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-40 top-0 h-full w-40 rotate-12 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-60"
              animate={{ x: [0, 740, 0] }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition"
              aria-label="Close"
            >
              ✕
            </button>

            {badge ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                ✨ {badge}
              </div>
            ) : (
              <div className="text-xs text-white/60">Saved</div>
            )}

            <div className="mt-2 text-xl font-semibold text-white">{title}</div>

            {desc ? (
              <div className="mt-2 text-sm leading-relaxed text-white/70">
                {desc}
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              {actions ? (
                actions
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Close
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

async function postFeedback(payload) {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.ok) {
    const msg = json?.error || `http_${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return json;
}

export default function ProjectFeedbackWidget({ slug }) {
  const storageKey = useMemo(() => keyV2(slug), [slug]);
  const storageKeyOld = useMemo(() => keyV1(slug), [slug]);
  const draftStorageKey = useMemo(() => draftKey(slug), [slug]);

  // ✅ IMPORTANT: user-action tracking (page open/refresh pe modal auto-open band)
  const userInteractedRef = useRef(false);
  const netModalShownRef = useRef(false);
  const firstLoadDoneRef = useRef(false);

  // ✅ persisted states (SAVED)
  const [savedLiked, setSavedLiked] = useState(false);
  const [savedRating, setSavedRating] = useState(0);
  const [savedName, setSavedName] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  const [savedFeedbackText, setSavedFeedbackText] = useState("");

  const [savedAt, setSavedAt] = useState("");

  // ✅ draft states (UNSAVED)
  const [likedDraft, setLikedDraft] = useState(false);
  const [ratingDraft, setRatingDraft] = useState(0);
  const [nameDraft, setNameDraft] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [feedbackDraft, setFeedbackDraft] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    title: "",
    desc: "",
    badge: "",
    actions: null,
  });

  function closeModal() {
    setModal({ open: false, title: "", desc: "", badge: "", actions: null });
  }

  function getDefaultSaved() {
    return {
      liked: false,
      rating: 0,
      name: "",
      email: "",
      feedbackText: "",
      savedAt: "",
    };
  }

  function readPersisted() {
    const raw = localStorage.getItem(storageKey);
    if (raw) return safeJsonParse(raw, getDefaultSaved());

    // migrate old key if exists
    const old = localStorage.getItem(storageKeyOld);
    if (old) {
      const data = safeJsonParse(old, getDefaultSaved());
      localStorage.setItem(storageKey, JSON.stringify(data));
      return data;
    }
    return getDefaultSaved();
  }

  function persistSaved(next) {
    const isEmpty =
      !next.liked &&
      !next.rating &&
      !String(next.name || "").trim() &&
      !String(next.email || "").trim() &&
      !String(next.feedbackText || "").trim();

    if (isEmpty) {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(storageKeyOld);
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function readDraft() {
    const raw = localStorage.getItem(draftStorageKey);
    if (!raw) return null;
    return safeJsonParse(raw, null);
  }

  function persistDraft(nextDraft) {
    const isEmpty =
      !nextDraft ||
      (!nextDraft.likedDraft &&
        !nextDraft.ratingDraft &&
        !String(nextDraft.nameDraft || "").trim() &&
        !String(nextDraft.emailDraft || "").trim() &&
        !String(nextDraft.feedbackDraft || "").trim());

    if (isEmpty) {
      localStorage.removeItem(draftStorageKey);
      return;
    }
    localStorage.setItem(draftStorageKey, JSON.stringify(nextDraft));
  }

  // ✅ Fetch server state silently on load (NO modal on page open/refresh)
  async function loadFromServer({ silent = true } = {}) {
    try {
      // "view" action for fetch (you already have it in API)
      const json = await postFeedback({
        scope: "project",
        slug: normalizeSlug(slug),
        action: "view",
      });

      const s = json?.state || {};
      const nextSaved = {
        liked: Boolean(s.liked),
        rating: Number(s.rating || 0),
        name: String(s.name || ""),
        email: String(s.email || ""),
        feedbackText: String(s.message || ""),
        savedAt: nowStamp(),
      };

      // update saved
      setSavedLiked(nextSaved.liked);
      setSavedRating(nextSaved.rating);
      setSavedName(nextSaved.name);
      setSavedEmail(nextSaved.email);
      setSavedFeedbackText(nextSaved.feedbackText);
      setSavedAt(nextSaved.savedAt);

      persistSaved(nextSaved);

      // if draft not exists, mirror saved
      const d = readDraft();
      if (!d) {
        setLikedDraft(nextSaved.liked);
        setRatingDraft(nextSaved.rating);
        setNameDraft(nextSaved.name);
        setEmailDraft(nextSaved.email);
        setFeedbackDraft(nextSaved.feedbackText);
      }
    } catch (e) {
      // ✅ Fix #1: page open/refresh pe kabhi modal nahi aayega
      if (silent) return;

      // ✅ user ne action kiya tabhi show
      if (!userInteractedRef.current) return;

      if (netModalShownRef.current) return;
      netModalShownRef.current = true;

      setModal({
        open: true,
        title: "Could not load feedback",
        desc: "Server not reachable or API error. Please try again.",
        badge: "Network",
        actions: null,
      });
    }
  }

  // ✅ load local first, then server merge
  useEffect(() => {
    const p = readPersisted();

    const l = Boolean(p.liked);
    const r = Number(p.rating || 0);
    const n = String(p.name || "");
    const e = String(p.email || "");
    const f = String(p.feedbackText || "");

    setSavedLiked(l);
    setSavedRating(r);
    setSavedName(n);
    setSavedEmail(e);
    setSavedFeedbackText(f);

    setSavedAt(String(p.savedAt || ""));

    // draft: if exists use it else mirror saved
    const d = readDraft();
    if (d) {
      setLikedDraft(Boolean(d.likedDraft));
      setRatingDraft(Number(d.ratingDraft || 0));
      setNameDraft(String(d.nameDraft || ""));
      setEmailDraft(String(d.emailDraft || ""));
      setFeedbackDraft(String(d.feedbackDraft || ""));
    } else {
      setLikedDraft(l);
      setRatingDraft(r);
      setNameDraft(n);
      setEmailDraft(e);
      setFeedbackDraft(f);
    }

    // fetch server silently (no modal on open)
    loadFromServer({ silent: true }).finally(() => {
      firstLoadDoneRef.current = true;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // ✅ auto-save draft (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      persistDraft({
        likedDraft,
        ratingDraft,
        nameDraft,
        emailDraft,
        feedbackDraft,
      });
    }, 220);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    likedDraft,
    ratingDraft,
    nameDraft,
    emailDraft,
    feedbackDraft,
    draftStorageKey,
  ]);

  // ✅ star toggle: same star click => clear
  function onStarClick(n) {
    userInteractedRef.current = true;
    setRatingDraft((prev) => (prev === n ? 0 : n));
  }

  async function copyLink() {
    userInteractedRef.current = true;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setModal({
        open: true,
        title: "Link copied",
        desc: "You can share this project link anywhere.",
        badge: "Copied successfully",
        actions: null,
      });
    } catch {
      setModal({
        open: true,
        title: "Copy failed",
        desc: "Clipboard blocked. Please copy manually from address bar.",
        badge: "Clipboard blocked",
        actions: null,
      });
    }
  }

  function openConfirm({ title, desc, onConfirm, confirmText = "Confirm" }) {
    setModal({
      open: true,
      title,
      desc,
      badge: "Confirm",
      actions: (
        <>
          <button
            type="button"
            onClick={closeModal}
            className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto rounded-2xl bg-red-500/90 px-4 py-2 text-sm font-semibold text-white hover:opacity-95 transition"
          >
            {confirmText}
          </button>
        </>
      ),
    });
  }

  // ✅ Like is DRAFT now (server call only on Submit)
  function onToggleLikeDraft() {
    userInteractedRef.current = true;
    setLikedDraft((prev) => !prev);
  }

  // ✅ Single SUBMIT (one form)
  async function submitAll() {
    userInteractedRef.current = true;

    const anyProvided =
      likedDraft ||
      ratingDraft > 0 ||
      String(nameDraft || "").trim() ||
      String(emailDraft || "").trim() ||
      String(feedbackDraft || "").trim();

    // ✅ Fix #3: empty submit block (premium modal)
    if (!anyProvided) {
      setModal({
        open: true,
        title: "Add at least one thing ✨",
        desc: "You can Like, give a Rating, or write a short feedback — any one is enough.",
        badge: "Action required",
        actions: null,
      });
      return;
    }

    const likedChanged = likedDraft !== savedLiked;
    const ratingChanged =
      ratingDraft !== savedRating ||
      String(nameDraft || "") !== String(savedName || "") ||
      String(emailDraft || "") !== String(savedEmail || "");
    const feedbackChanged =
      String(feedbackDraft || "") !== String(savedFeedbackText || "");

    const anyChanges = likedChanged || ratingChanged || feedbackChanged;

    if (!anyChanges) {
      setModal({
        open: true,
        title: "Nothing new to update",
        desc: "Your latest feedback is already saved. Change something, then press Submit.",
        badge: "No changes",
        actions: null,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const nSlug = normalizeSlug(slug);
      let anySuccess = false;

      // 1) Like/unlike if changed
      if (likedChanged) {
        await postFeedback({
          scope: "project",
          slug: nSlug,
          action: likedDraft ? "like" : "unlike",
        });
        anySuccess = true;
      }

      // 2) Rating + name/email (we store name/email through rating_set)
      // If user provided name/email but rating=0, we'll still call rating_set with rating=null
      const hasNameEmail =
        String(nameDraft || "").trim() || String(emailDraft || "").trim();

      if (ratingChanged) {
        if (ratingDraft > 0 || hasNameEmail) {
          await postFeedback({
            scope: "project",
            slug: nSlug,
            action: "rating_set",
            rating: ratingDraft > 0 ? ratingDraft : null,
            name: String(nameDraft || "").trim() || null,
            email: String(emailDraft || "").trim() || null,
          });
        } else if (savedRating > 0 || savedName || savedEmail) {
          await postFeedback({
            scope: "project",
            slug: nSlug,
            action: "rating_clear",
          });
        }
        anySuccess = true;
      }

      // 3) Feedback message
      if (feedbackChanged) {
        const msg = String(feedbackDraft || "").trim();
        if (msg) {
          await postFeedback({
            scope: "project",
            slug: nSlug,
            action: "feedback_set",
            message: msg,
          });
        } else if (String(savedFeedbackText || "").trim()) {
          await postFeedback({
            scope: "project",
            slug: nSlug,
            action: "feedback_clear",
          });
        }
        anySuccess = true;
      }

      // ✅ refresh local saved from server to guarantee persist (Fix #2)
      if (anySuccess) {
        await loadFromServer({ silent: true });

        // Also persist saved snapshot locally (for immediate refresh)
        const nextSaved = {
          liked: likedDraft,
          rating: ratingDraft,
          name: String(nameDraft || ""),
          email: String(emailDraft || ""),
          feedbackText: String(feedbackDraft || ""),
          savedAt: nowStamp(),
        };
        // update saved state optimistically
        setSavedLiked(Boolean(nextSaved.liked));
        setSavedRating(Number(nextSaved.rating || 0));
        setSavedName(String(nextSaved.name || ""));
        setSavedEmail(String(nextSaved.email || ""));
        setSavedFeedbackText(String(nextSaved.feedbackText || ""));
        setSavedAt(nextSaved.savedAt);
        persistSaved(nextSaved);

        // keep draft synced to saved
        persistDraft({
          likedDraft,
          ratingDraft,
          nameDraft,
          emailDraft,
          feedbackDraft,
        });

        setModal({
          open: true,
          title: "Saved successfully ✨",
          desc: "Your feedback is saved for this project. You can update it anytime.",
          badge: "Saved",
          actions: null,
        });
      }
    } catch (e) {
      // show network modal only when user clicked submit (true here)
      setModal({
        open: true,
        title: "Could not save",
        desc: "Network/API error. Please try again once.",
        badge: "Network",
        actions: null,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resetAllNow() {
    userInteractedRef.current = true;
    setIsSubmitting(true);

    try {
      await postFeedback({
        scope: "project",
        slug: normalizeSlug(slug),
        action: "reset_all",
      });

      localStorage.removeItem(storageKey);
      localStorage.removeItem(storageKeyOld);
      localStorage.removeItem(draftStorageKey);

      // saved
      setSavedLiked(false);
      setSavedRating(0);
      setSavedName("");
      setSavedEmail("");
      setSavedFeedbackText("");
      setSavedAt("");

      // draft
      setLikedDraft(false);
      setRatingDraft(0);
      setNameDraft("");
      setEmailDraft("");
      setFeedbackDraft("");

      setModal({
        open: true,
        title: "Reset done ✅",
        desc: "Everything is cleared for this project. You can submit again anytime.",
        badge: "Fresh state",
        actions: null,
      });
    } catch (e) {
      setModal({
        open: true,
        title: "Reset failed",
        desc: "Server/API error. Please try again.",
        badge: "Network",
        actions: null,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function revertDraftToSaved() {
    userInteractedRef.current = true;

    setLikedDraft(savedLiked);
    setRatingDraft(savedRating);
    setNameDraft(savedName);
    setEmailDraft(savedEmail);
    setFeedbackDraft(savedFeedbackText);

    setModal({
      open: true,
      title: "Reverted to saved",
      desc: "Your unsaved changes were rolled back to the last saved feedback.",
      badge: "Reverted",
      actions: null,
    });
  }

  // ✅ saved flags
  const hasAnythingSaved =
    Boolean(savedLiked) ||
    savedRating > 0 ||
    Boolean(String(savedName || "").trim()) ||
    Boolean(String(savedEmail || "").trim()) ||
    Boolean(String(savedFeedbackText || "").trim());

  // ✅ dirty detection
  const anyDraftDirty =
    likedDraft !== savedLiked ||
    ratingDraft !== savedRating ||
    String(nameDraft || "") !== String(savedName || "") ||
    String(emailDraft || "") !== String(savedEmail || "") ||
    String(feedbackDraft || "") !== String(savedFeedbackText || "");

  const mainBtnText = hasAnythingSaved ? "Update feedback" : "Send feedback";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-6 relative overflow-hidden">
      {/* subtle glow */}
      <div className="pointer-events-none absolute -inset-24 opacity-40">
        <div className="absolute left-8 top-12 h-56 w-56 rounded-full bg-[#d9c38a]/15 blur-3xl" />
        <div className="absolute right-10 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xl font-semibold text-white">
              Project Feedback
            </div>

            {anyDraftDirty ? (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-yellow-300/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-200"
                title="You have unsaved changes"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-300 shadow-[0_0_14px_rgba(217,195,138,0.45)]" />
                Unsaved changes
              </motion.span>
            ) : null}
          </div>

          <div className="mt-1 text-sm text-white/70">
            Like, rate, and send feedback — all optional (but submit needs at
            least one).
          </div>

          {hasAnythingSaved ? (
            <div className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
              ✅ Already saved for this project
              {savedLiked ? ` • Liked` : ""}
              {savedRating ? ` • ${savedRating}/5 rated` : ""}
              {String(savedFeedbackText || "").trim()
                ? ` • Feedback saved`
                : ""}
              {savedAt ? (
                <div className="mt-1 text-xs text-white/50">
                  Last update: {savedAt}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:shrink-0">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              🔗 Copy Link
            </button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={onToggleLikeDraft}
              className={[
                "w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                likedDraft
                  ? "border-red-400/30 bg-red-500/15 text-red-200 hover:bg-red-500/20"
                  : "border-white/10 bg-white/5 text-white hover:bg-white/10",
              ].join(" ")}
            >
              {likedDraft ? "❤️ Liked" : "♡ Like"}
            </motion.button>
          </div>

          {hasAnythingSaved ? (
            <button
              type="button"
              onClick={() =>
                openConfirm({
                  title: "Reset everything?",
                  desc: "This will remove Like, Rating, Name/Email and Feedback for this project.",
                  onConfirm: resetAllNow,
                  confirmText: "Reset",
                })
              }
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 transition"
            >
              🧨 Reset all
            </button>
          ) : null}
        </div>
      </div>

      {/* ✅ Single Form Body */}
      <div className="relative mt-5 grid gap-4 md:grid-cols-2">
        {/* Left: Rating + Identity */}
        <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-white">Rating</div>
            <div className="text-sm text-white/60">
              {ratingDraft ? `${ratingDraft}/5` : "—"}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((n) => {
              const active = ratingDraft >= n;
              return (
                <motion.button
                  key={n}
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onStarClick(n)}
                  aria-label={`Rate ${n} star`}
                  className={[
                    "h-12 w-full rounded-2xl border grid place-items-center transition",
                    active
                      ? "border-yellow-300/25 bg-yellow-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "text-2xl transition duration-200",
                      active
                        ? "text-yellow-300 drop-shadow-[0_0_12px_rgba(217,195,138,0.45)]"
                        : "text-white/35",
                    ].join(" ")}
                  >
                    ★
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={nameDraft}
              onChange={(e) => {
                userInteractedRef.current = true;
                setNameDraft(e.target.value);
              }}
              placeholder="Name (optional)"
              className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-[16px] sm:text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
            />
            <input
              value={emailDraft}
              onChange={(e) => {
                userInteractedRef.current = true;
                setEmailDraft(e.target.value);
              }}
              placeholder="Email (optional)"
              className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-[16px] sm:text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
            />
          </div>

          <div className="mt-3 text-xs text-white/50">
            Tip: You can submit with only rating, or only name/email, etc.
          </div>
        </div>

        {/* Right: Feedback */}
        <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
          <div className="text-sm font-semibold text-white">Feedback</div>
          <div className="mt-1 text-sm text-white/60">
            Suggest improvements / bugs / UI ideas.
          </div>

          <textarea
            value={feedbackDraft}
            onChange={(e) => {
              userInteractedRef.current = true;
              setFeedbackDraft(e.target.value);
            }}
            placeholder="Write your feedback..."
            className="mt-3 h-32 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[16px] sm:text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
          />

          <div className="mt-2 text-xs text-white/50">
            Draft auto-saves locally. Submit to save to DB + email notification.
          </div>
        </div>
      </div>

      {/* ✅ Single Submit Row */}
      <div className="relative mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <motion.button
          type="button"
          whileTap={{ scale: 0.99 }}
          disabled={isSubmitting}
          onClick={submitAll}
          className={[
            "w-full sm:w-auto rounded-2xl bg-[#d9c38a] px-5 py-3 text-sm font-semibold text-black hover:opacity-95 transition",
            isSubmitting ? "opacity-60 cursor-not-allowed" : "",
          ].join(" ")}
        >
          {isSubmitting ? "Saving..." : mainBtnText}
        </motion.button>

        {anyDraftDirty ? (
          <button
            type="button"
            onClick={revertDraftToSaved}
            className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            Revert to saved
          </button>
        ) : null}

        <div className="text-xs text-white/50 sm:ml-auto sm:text-right">
          {hasAnythingSaved
            ? "Saved state persists on refresh/next day ✅"
            : "Not saved yet"}
        </div>
      </div>

      {/* MODAL */}
      <PortalModal
        open={modal.open}
        title={modal.title}
        desc={modal.desc}
        badge={modal.badge}
        actions={modal.actions}
        onClose={closeModal}
      />
    </div>
  );
}

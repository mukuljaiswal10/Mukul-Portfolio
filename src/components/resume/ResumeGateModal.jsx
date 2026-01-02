"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ResumeGateModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/resume/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          purpose: "Resume Access",
          source: "resume-modal",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");

      // ✅ token will come in Step-6
      // for now, demo token:
      const token = "demo";

      window.open(`/api/resume/file?token=${token}`, "_blank");
      onClose?.();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[999] grid place-items-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0E14] p-5 text-white"
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Access Resume</h3>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-sm text-white/70">
              Resume dekhne se pehle apni details fill karo.
            </p>

            <form onSubmit={submit} className="mt-4 space-y-3">
              <input
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
              <input
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
              />
              <input
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                required
              />

              <button
                disabled={loading}
                className="w-full rounded-xl bg-[#FFD54A]/90 text-black font-semibold py-2 hover:bg-[#FFD54A]"
              >
                {loading ? "Submitting..." : "Submit & View Resume"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

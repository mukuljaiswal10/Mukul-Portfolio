// "use client";

// import { useMemo, useState, useEffect } from "react";
// import LuxuryButton from "@/components/ui/LuxuryButton";

// export default function ResumeGateButton({
//   children = "Download Resume →",
//   variant = "outline",
//   className = "",
//   purpose = "Resume Access",
//   source = "resume-gate",
// }) {
//   const [open, setOpen] = useState(false);
//   const [step, setStep] = useState("form"); // form | thanks | error
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     consent: true,
//     website: "", // honeypot (hidden)
//   });

//   // ✅ modal open => body scroll lock (mobile friendly)
//   useEffect(() => {
//     if (!open) return;
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prev || "";
//     };
//   }, [open]);

//   const canSubmit = useMemo(() => {
//     const nameOk = form.name.trim().length >= 2;
//     const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
//     const phoneOk = String(form.phone).replace(/\D/g, "").length >= 10;
//     return nameOk && emailOk && phoneOk && form.consent && !loading;
//   }, [form, loading]);

//   async function onSubmit(e) {
//     e.preventDefault();
//     if (!canSubmit) return;

//     /**
//      * ✅ IMPORTANT FIX (about:blank issue)
//      * - DO NOT use "noopener,noreferrer" in window.open features on some mobile browsers,
//      *   because it can return a null/invalid handle while still opening a new tab,
//      *   which causes fallback navigation AND leaves an extra blank tab.
//      * - Instead: open normally, then set opener = null for safety.
//      */
//     const resumeTab = window.open("/resume/opening", "_blank");
//     if (resumeTab) {
//       try {
//         resumeTab.opener = null;
//       } catch {}
//     }

//     setLoading(true);
//     setMsg("");

//     try {
//       const res = await fetch("/api/resume/lead", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: form.name.trim(),
//           email: form.email.trim(),
//           phone: form.phone.trim(),
//           purpose,
//           source,
//           website: form.website, // honeypot
//         }),
//       });

//       const data = await res.json().catch(() => ({}));

//       if (!res.ok || !data?.ok) {
//         setStep("error");
//         setMsg(data?.message || "Something went wrong. Try again.");
//         setLoading(false);

//         // popup opened but fail => close it
//         if (resumeTab && !resumeTab.closed) resumeTab.close();
//         return;
//       }

//       setStep("thanks");

//       const delay = Number(data?.openDelayMs || 1000);
//       const url = data?.resumeUrl;

//       // ✅ absolute url better (support absolute too)
//       const fullUrl = url
//         ? url.startsWith("http")
//           ? url
//           : `${window.location.origin}${url}`
//         : null;

//       setTimeout(() => {
//         if (!fullUrl) return;

//         // ✅ Redirect the already-opened tab (no extra about:blank)
//         if (resumeTab && !resumeTab.closed) {
//           try {
//             resumeTab.location.replace(fullUrl);
//           } catch {
//             // if some browser blocks access, just try opening directly
//             const w = window.open(fullUrl, "_blank");
//             if (!w) window.location.assign(fullUrl);
//           }
//         } else {
//           // popup blocked => try open, else same tab fallback
//           const w = window.open(fullUrl, "_blank");
//           if (!w) window.location.assign(fullUrl);
//         }
//       }, delay);

//       // auto close modal after a bit
//       setTimeout(() => {
//         setOpen(false);
//         setStep("form");
//       }, 2500);

//       setLoading(false);
//     } catch (err) {
//       setStep("error");
//       setMsg("Network error. Please try again.");
//       setLoading(false);

//       if (resumeTab && !resumeTab.closed) resumeTab.close();
//     }
//   }

//   return (
//     <>
//       {/* Trigger button with SAME luxury effects */}
//       <LuxuryButton
//         as="button"
//         variant={variant}
//         className={className}
//         onClick={() => {
//           setOpen(true);
//           setStep("form");
//           setMsg("");
//         }}
//       >
//         {children}
//       </LuxuryButton>

//       {/* Modal */}
//       {open ? (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
//           {/* backdrop */}
//           <button
//             aria-label="Close"
//             onClick={() => !loading && setOpen(false)}
//             className="absolute inset-0 bg-black/60"
//           />

//           {/* box (✅ mobile height small + inner scroll) */}
//           <div className="relative w-full max-w-md max-h-[82vh] rounded-2xl border border-white/10 bg-[#0b0b0f] shadow-2xl overflow-hidden">
//             {/* ✅ scroll container */}
//             <div className="p-5 overflow-y-auto max-h-[82vh]">
//               <div className="flex items-start justify-between gap-3">
//                 <div>
//                   <h3 className="text-lg font-semibold text-white">
//                     {step === "thanks" ? "Thanks! ✅" : "Access Resume"}
//                   </h3>
//                   <p className="mt-1 text-sm text-white/70">
//                     {step === "thanks"
//                       ? "Resume opening in a new tab…"
//                       : "Fill details to view the resume."}
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => !loading && setOpen(false)}
//                   className="rounded-lg px-2 py-1 text-white/70 hover:text-white"
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* FORM */}
//               {step === "form" ? (
//                 <form onSubmit={onSubmit} className="mt-4 space-y-3">
//                   {/* Honeypot (hidden) */}
//                   <input
//                     value={form.website}
//                     onChange={(e) =>
//                       setForm((p) => ({ ...p, website: e.target.value }))
//                     }
//                     className="hidden"
//                     tabIndex={-1}
//                     autoComplete="off"
//                     aria-hidden="true"
//                   />

//                   <div>
//                     <label className="text-xs text-white/70">Full Name *</label>
//                     <input
//                       value={form.name}
//                       onChange={(e) =>
//                         setForm((p) => ({ ...p, name: e.target.value }))
//                       }
//                       className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/25"
//                       placeholder="Your name"
//                       autoComplete="name"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-xs text-white/70">Email *</label>
//                     <input
//                       type="email"
//                       value={form.email}
//                       onChange={(e) =>
//                         setForm((p) => ({ ...p, email: e.target.value }))
//                       }
//                       className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/25"
//                       placeholder="you@email.com"
//                       autoComplete="email"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-xs text-white/70">Phone *</label>
//                     <input
//                       type="tel"
//                       inputMode="numeric"
//                       value={form.phone}
//                       onChange={(e) =>
//                         setForm((p) => ({ ...p, phone: e.target.value }))
//                       }
//                       className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/25"
//                       placeholder="10 digit phone"
//                       autoComplete="tel"
//                     />
//                   </div>

//                   <label className="flex items-start gap-2 text-xs text-white/70">
//                     <input
//                       type="checkbox"
//                       checked={form.consent}
//                       onChange={(e) =>
//                         setForm((p) => ({ ...p, consent: e.target.checked }))
//                       }
//                       className="mt-0.5"
//                     />
//                     I agree to share my details for contact regarding
//                     opportunities.
//                   </label>

//                   {msg ? <p className="text-sm text-red-300">{msg}</p> : null}

//                   <LuxuryButton
//                     as="button"
//                     type="submit"
//                     variant="primary"
//                     className="w-full"
//                     disabled={!canSubmit}
//                   >
//                     {loading ? "Submitting..." : "Submit & View Resume"}
//                   </LuxuryButton>

//                   <p className="text-[11px] text-white/50">
//                     Resume link expires in ~10 minutes. (premium security)
//                   </p>
//                 </form>
//               ) : null}

//               {/* THANKS */}
//               {step === "thanks" ? (
//                 <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
//                   ✅ Details received. Opening resume…
//                   <div className="mt-2 text-xs text-white/60">
//                     If it doesn’t open, allow popups for this site.
//                   </div>
//                 </div>
//               ) : null}

//               {/* ERROR */}
//               {step === "error" ? (
//                 <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
//                   {msg || "Something went wrong."}
//                   <div className="mt-3">
//                     <LuxuryButton
//                       as="button"
//                       variant="outline"
//                       onClick={() => {
//                         setStep("form");
//                         setMsg("");
//                       }}
//                     >
//                       Try Again
//                     </LuxuryButton>
//                   </div>
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         </div>
//       ) : null}
//     </>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import LuxuryButton from "@/components/ui/LuxuryButton";

function ModalPortal({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function ResumeGateButton({
  children = "Download Resume →",
  variant = "outline",
  className = "",
  purpose = "Resume Access",
  source = "resume-gate",
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("form"); // form | thanks | error
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "", // ✅ optional field (user can fill)
    consent: true,
    website: "", // honeypot (hidden)
  });

  // ✅ Body scroll lock when modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const canSubmit = useMemo(() => {
    const nameOk = form.name.trim().length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const phoneOk = String(form.phone).replace(/\D/g, "").length === 10;
    return nameOk && emailOk && phoneOk && form.consent && !loading;
  }, [form, loading]);

  const closeModal = () => {
    if (loading) return;
    setOpen(false);
    setStep("form");
    setMsg("");
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    // ✅ user gesture ke andar hi blank tab open (popup blocker avoid)
    const resumeTab = window.open(
      "/resume/opening",
      "_blank",
      "noopener,noreferrer"
    );

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/resume/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          // ✅ optional purpose: user fill kare to use, else prop purpose
          purpose: (form.purpose || "").trim() || purpose,
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

      const delay = Number(data?.openDelayMs || 1000);
      const url = data?.resumeUrl; // expected like "/api/resume/download?token=..."
      const fullUrl = url ? `${window.location.origin}${url}` : null;

      setTimeout(() => {
        if (!fullUrl) return;
        if (resumeTab && !resumeTab.closed) {
          // ✅ about:blank avoid + safer replace
          resumeTab.location.replace(fullUrl);
        } else {
          window.location.href = fullUrl;
        }
      }, delay);

      setTimeout(() => {
        setOpen(false);
        setStep("form");
      }, 2500);

      setLoading(false);
    } catch (err) {
      setStep("error");
      setMsg("Network error. Please try again.");
      setLoading(false);
      if (resumeTab && !resumeTab.closed) resumeTab.close();
    }
  }

  return (
    <>
      {/* Trigger button */}
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

      {/* ✅ Modal via Portal - fixes mobile overlap/z-index issues */}
      {open ? (
        <ModalPortal>
          <div
            className="
              fixed inset-0 z-[2147483647]
              flex min-h-[100dvh] w-full items-center justify-center
              px-4 py-8
            "
          >
            {/* ✅ Full overlay background */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* ✅ Centered responsive box */}
            <div
              role="dialog"
              aria-modal="true"
              className="
                relative w-full max-w-md
                rounded-2xl border border-white/10
                bg-[#0b0b0f] p-5 shadow-2xl
              "
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {step === "thanks" ? "Thanks! ✅" : "Access Resume"}
                  </h3>
                  <p className="mt-1 text-sm text-white/70">
                    {step === "thanks"
                      ? "Resume opening in a new tab…"
                      : "Fill details to view the resume."}
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className="rounded-lg px-2 py-1 text-white/70 hover:text-white"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* FORM */}
              {step === "form" ? (
                <form onSubmit={onSubmit} className="mt-4 space-y-3">
                  {/* Honeypot (hidden) */}
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

                  <div>
                    <label className="text-xs text-white/70">Full Name *</label>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/25"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/70">Email *</label>
                    <input
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/25"
                      placeholder="you@email.com"
                      required
                      inputMode="email"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/70">
                      Phone (10 digit) *
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => {
                        // ✅ digits only + max 10
                        const digits = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setForm((p) => ({ ...p, phone: digits }));
                      }}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/25"
                      placeholder="9876543210"
                      required
                      inputMode="numeric"
                      pattern="\d{10}"
                      maxLength={10}
                    />
                    <p className="mt-1 text-[11px] text-white/50">
                      Only numbers • exactly 10 digits
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-white/70">
                      Purpose (optional)
                    </label>
                    <input
                      value={form.purpose}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, purpose: e.target.value }))
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/25"
                      placeholder="e.g. Hiring / Freelance / Collaboration"
                    />
                  </div>

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

                  <p className="text-[11px] text-white/50">
                    Link opens after submit (secure). If popup blocked, it will
                    open in same tab.
                  </p>
                </form>
              ) : null}

              {/* THANKS */}
              {step === "thanks" ? (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  ✅ Details received. Opening resume…
                  <div className="mt-2 text-xs text-white/60">
                    If it doesn’t open, allow popups for this site.
                  </div>
                </div>
              ) : null}

              {/* ERROR */}
              {step === "error" ? (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {msg || "Something went wrong."}
                  <div className="mt-3">
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
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </ModalPortal>
      ) : null}
    </>
  );
}

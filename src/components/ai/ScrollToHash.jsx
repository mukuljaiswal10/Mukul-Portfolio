"use client";

import { useLayoutEffect, useEffect } from "react";
import { usePathname } from "next/navigation";

function getNavType() {
  try {
    const nav = performance?.getEntriesByType?.("navigation")?.[0];
    return nav?.type || "navigate";
  } catch {
    return "navigate";
  }
}

export default function ScrollToHash() {
  const pathname = usePathname();

  // ✅ 1) Refresh (reload) pe always top + hash clear
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // stop browser from restoring old scroll on refresh
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const type = getNavType(); // "reload" | "navigate" | "back_forward"
    const isReload = type === "reload";

    if (isReload) {
      // remove #hash so sections won't auto-open on refresh
      if (window.location.hash) {
        const cleanUrl = window.location.pathname + window.location.search;
        window.history.replaceState(null, "", cleanUrl);
      }

      // force top
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

  // ✅ 2) Normal cases: hash change pe smooth scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollNow = () => {
      const hash = (window.location.hash || "").replace("#", "");
      if (!hash) return;

      const el = document.getElementById(hash);
      if (!el) return;

      // little delay for layout/components render
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    };

    // on first mount (if user came from link with hash)
    scrollNow();

    // on hash changes
    window.addEventListener("hashchange", scrollNow);
    return () => window.removeEventListener("hashchange", scrollNow);
  }, [pathname]);

  return null;
}

"use client";

import { useEffect } from "react";

const SCROLL_EVENT = "mukul:scrollTo";

function smoothScrollToId(id) {
  if (!id) return;

  const tryScroll = (attempt = 0) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // retry a few times (route push ke baad DOM late aa sakta)
    if (attempt < 10) {
      setTimeout(() => tryScroll(attempt + 1), 120);
    }
  };

  tryScroll(0);
}

export default function ScrollToSection() {
  useEffect(() => {
    // 1) Event based scroll
    const onEvt = (e) => {
      const id = e?.detail?.id;
      smoothScrollToId(id);
    };
    window.addEventListener(SCROLL_EVENT, onEvt);

    // 2) Hash based scroll (/#skills)
    const onHash = () => {
      const id = window.location.hash?.replace("#", "");
      if (id) smoothScrollToId(id);
    };

    // first load
    onHash();

    // hash change
    window.addEventListener("hashchange", onHash);

    return () => {
      window.removeEventListener(SCROLL_EVENT, onEvt);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return null;
}

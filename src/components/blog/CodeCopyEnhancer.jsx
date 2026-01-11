"use client";

import { useEffect } from "react";

export default function CodeCopyEnhancer() {
  useEffect(() => {
    const pres = Array.from(document.querySelectorAll("pre"));
    pres.forEach((pre) => {
      if (pre.querySelector("[data-copy-btn]")) return;

      const btn = document.createElement("button");
      btn.textContent = "Copy";
      btn.setAttribute("data-copy-btn", "1");

      btn.className =
        "absolute top-2 right-2 text-xs px-2 py-1 rounded-md border border-white/20 bg-black/40";

      pre.classList.add("relative");

      btn.onclick = async () => {
        const code = pre.querySelector("code")?.textContent || "";
        await navigator.clipboard.writeText(code);
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy"), 1000);
      };

      pre.appendChild(btn);
    });
  }, []);

  return null;
}

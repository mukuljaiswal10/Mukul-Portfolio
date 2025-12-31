"use client";

import dynamic from "next/dynamic";

// ✅ ssr:false allowed here because THIS file is a Client Component
const StickyNavSearch = dynamic(() => import("./StickyNavSearch"), {
  ssr: false,
});

export default function StickyNavSearchShell() {
  return <StickyNavSearch />;
}

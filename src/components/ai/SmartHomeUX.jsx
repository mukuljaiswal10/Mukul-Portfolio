"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import useSectionInView from "./useSectionInView";
import ScrollProgress from "./ScrollProgress";
import AIAssistant from "./AIAssistant";
import CommandPalette from "./CommandPalette";

export default function SmartHomeUX() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/home"; // safe

  const { currentSection } = useSectionInView();
  const [open, setOpen] = useState(false);

  // Ctrl/Cmd + K
  useEffect(() => {
    const onKey = (e) => {
      const isK = e.key.toLowerCase() === "k";
      const combo = (e.ctrlKey || e.metaKey) && isK;
      if (!combo) return;

      e.preventDefault();
      setOpen(true);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ✅ Only home page
  if (!isHome) return null;

  return (
    <>
      <ScrollProgress />
      <AIAssistant
        currentSection={currentSection}
        pathname={pathname}
        onOpenPalette={() => setOpen(true)}
      />
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}

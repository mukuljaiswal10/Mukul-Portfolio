// "use client";

// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import useSectionInView from "./useSectionInView";
// import ScrollProgress from "./ScrollProgress";
// import AIAssistant from "./AIAssistant";
// import CommandPalette from "./CommandPalette";

// export default function SmartHomeUX() {
//   const pathname = usePathname();
//   const isHome = pathname === "/" || pathname === "/home"; // safe

//   const { currentSection } = useSectionInView();
//   const [open, setOpen] = useState(false);

//   // Ctrl/Cmd + K
//   useEffect(() => {
//     const onKey = (e) => {
//       const isK = e.key.toLowerCase() === "k";
//       const combo = (e.ctrlKey || e.metaKey) && isK;
//       if (!combo) return;

//       e.preventDefault();
//       setOpen(true);
//     };

//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   // ✅ Only home page
//   if (!isHome) return null;

//   return (
//     <>
//       <ScrollProgress />
//       <AIAssistant
//         currentSection={currentSection}
//         pathname={pathname}
//         onOpenPalette={() => setOpen(true)}
//       />
//       <CommandPalette open={open} onClose={() => setOpen(false)} />
//     </>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import useSectionInView from "./useSectionInView";
// import ScrollProgress from "./ScrollProgress";
// import AIAssistant from "./AIAssistant";
// import CommandPalette from "./CommandPalette";

// export default function SmartHomeUX() {
//   const pathname = usePathname();

//   // ✅ hydration-safe: render only after mount
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => setMounted(true), []);

//   // ✅ prevent SSR/client mismatch (Good afternoon/evening issue)
//   if (!mounted) return null;

//   const isHome = pathname === "/" || pathname === "/home"; // safe

//   const { currentSection } = useSectionInView();
//   const [open, setOpen] = useState(false);

//   // Ctrl/Cmd + K
//   useEffect(() => {
//     const onKey = (e) => {
//       const isK = e.key.toLowerCase() === "k";
//       const combo = (e.ctrlKey || e.metaKey) && isK;
//       if (!combo) return;

//       e.preventDefault();
//       setOpen(true);
//     };

//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   // ✅ Only home page
//   if (!isHome) return null;

//   return (
//     <>
//       <ScrollProgress />
//       <AIAssistant
//         currentSection={currentSection}
//         pathname={pathname}
//         onOpenPalette={() => setOpen(true)}
//       />
//       <CommandPalette open={open} onClose={() => setOpen(false)} />
//     </>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import useSectionInView from "./useSectionInView";
import ScrollProgress from "./ScrollProgress";
import AIAssistant from "./AIAssistant";
import CommandPalette from "./CommandPalette";

export default function SmartHomeUX() {
  const pathname = usePathname();

  // ✅ stable boolean (no hook condition)
  const isHome = useMemo(() => {
    return pathname === "/" || pathname === "/home";
  }, [pathname]);

  // ✅ ALWAYS call hooks (no early return before hooks)
  const { currentSection } = useSectionInView();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ avoid hydration / first paint mismatch
  useEffect(() => setMounted(true), []);

  // Ctrl/Cmd + K (listener always via same hook, but logic runs only on home)
  useEffect(() => {
    if (!isHome) return;

    const onKey = (e) => {
      const key = (e.key || "").toLowerCase();
      const combo = (e.ctrlKey || e.metaKey) && key === "k";
      if (!combo) return;

      e.preventDefault();
      setOpen(true);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isHome]);

  // ✅ render gate (hooks already executed above)
  if (!mounted || !isHome) return null;

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

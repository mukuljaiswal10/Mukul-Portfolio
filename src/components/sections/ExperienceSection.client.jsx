"use client";

import dynamic from "next/dynamic";

// ✅ SSR disabled safely (client component ke andar)
const ExperienceSection = dynamic(() => import("./ExperienceSection"), {
  ssr: false,
  loading: () => null, // optional: skeleton bhi de sakte
});

export default ExperienceSection;

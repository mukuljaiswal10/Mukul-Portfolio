"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { projects } from "@/data/projects";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import TiltCard from "@/components/ui/TiltCard";
import { blurDataURL } from "@/lib/blur";
import LuxuryButton from "../ui/LuxuryButton";

// ✅ NEW
import ProjectsSearchPro from "@/components/projects/ProjectsSearchPro";
import { searchProjects } from "@/lib/projectSearch";

/* ---------------- helpers ---------------- */

// ✅ robust slug normalizer (url-safe + data-safe)
function slugKey(s) {
  return decodeURIComponent(String(s || ""))
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** ✅ WIP detector (data-driven) */
function isWipProject(p) {
  return Boolean(
    p?.wip === true ||
      p?.isWip === true ||
      String(p?.status || "").toLowerCase() === "wip" ||
      String(p?.stage || "").toLowerCase() === "wip"
  );
}

/** ✅ Desktop-only / Not responsive detector (data-driven) */
function isDesktopOnlyProject(p) {
  const mode = String(p?.responsiveMode || "").toLowerCase();
  const status = String(p?.status || "").toLowerCase();
  const stage = String(p?.stage || "").toLowerCase();

  return Boolean(
    p?.responsive === false ||
      p?.isResponsive === false ||
      p?.desktopOnly === true ||
      mode === "desktop" ||
      mode === "desktop-only" ||
      status.includes("desktop") ||
      stage.includes("desktop")
  );
}

/** ✅ Premium WIP overlay (UI only, pointer-events none) */
function WipOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-black/35" />

      <motion.div
        aria-hidden
        className="absolute -left-40 top-0 h-full w-40 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60"
        animate={{ x: [0, 720, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={{ opacity: 0.75 }}
        animate={{ opacity: [0.45, 0.85, 0.45] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute left-6 top-6 text-[#FFD54A] drop-shadow-[0_0_12px_rgba(255,215,0,0.55)]">
          ✦
        </span>
        <span className="absolute right-10 top-10 text-[#FFD54A] drop-shadow-[0_0_12px_rgba(255,215,0,0.55)]">
          ✦
        </span>
        <span className="absolute left-10 bottom-10 text-[#FFD54A] drop-shadow-[0_0_12px_rgba(255,215,0,0.55)]">
          ✦
        </span>
      </motion.div>

      <motion.div
        className="absolute right-3 top-3"
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#FFD54A]/25 bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-[#F6E7B2] backdrop-blur">
          <span className="mr-1 text-[#FFD54A]">⚡</span> Work in progress
          <span className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-70" />
        </div>
      </motion.div>

      <div className="absolute inset-0 grid place-items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.26, ease: "easeOut" }}
          className="w-full max-w-[320px] rounded-3xl border border-white/10 bg-black/55 p-4 text-center backdrop-blur-xl"
        >
          <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.06]">
            <span className="text-[#FFD54A] drop-shadow-[0_0_14px_rgba(255,215,0,0.45)]">
              ✦
            </span>
          </div>
          <p className="text-sm font-semibold text-white">
            This project is under development
          </p>
          <p className="mt-1 text-xs text-white/70">
            Premium build in progress — details will be updated soon.
          </p>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className="absolute -inset-[1px] rounded-xl bg-[radial-gradient(circle,rgba(255,215,0,0.22),transparent_58%)] blur-xl"
        animate={{ opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function DesktopOnlyOverlay({ label }) {
  const text = String(label || "").trim() || "Desktop-First";
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_30%,transparent_65%)] opacity-70" />
      <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(135deg,transparent_0px,transparent_10px,rgba(255,255,255,0.06)_10px,rgba(255,255,255,0.06)_11px)]" />

      <motion.div
        aria-hidden
        className="absolute -left-32 top-0 h-full w-32 rotate-12 bg-gradient-to-r from-transparent via-white/14 to-transparent opacity-55"
        animate={{ x: [0, 760] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-3 top-3"
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-white/85 backdrop-blur">
          <span className="mr-1">🖥️</span> {text}
          <span className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-70" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-3 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 6, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="rounded-2xl border border-white/10 bg-black/45 px-3 py-1 text-[11px] text-white/75 backdrop-blur">
          Best experience on laptop/desktop
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute -inset-[1px] rounded-xl bg-[radial-gradient(circle,rgba(125,211,252,0.18),transparent_58%)] blur-xl"
        animate={{ opacity: [0.18, 0.42, 0.18] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function ProjectCard({ p, i }) {
  const isWip = isWipProject(p);
  const isDesktopOnly = isDesktopOnlyProject(p);

  const desktopLabel =
    p?.responsiveLabel ||
    p?.desktopLabel ||
    (p?.responsive === false ? "Desktop-First" : "");

  return (
    <Reveal delay={0.08 + i * 0.08}>
      <TiltCard className="flex flex-col">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
          <Image
            src={p.image || "/images/project-placeholder.jpg"}
            alt={p.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={blurDataURL(1200, 675)}
            className="object-cover transition duration-700 ease-out group-hover:scale-110"
            priority={i === 0}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur">
            {p.tags?.[0] || "Project"}
          </div>

          {isDesktopOnly ? <DesktopOnlyOverlay label={desktopLabel} /> : null}
          {isWip ? <WipOverlay /> : null}
        </div>

        <div className="mt-5 flex-1">
          <p className="text-lg font-semibold">{p.title}</p>
          <p className="mt-2 text-sm text-white/70">{p.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(p.tags || []).map((t, idx) => (
              <Reveal key={`${t}-${idx}`} delay={0.12 + i * 0.06 + idx * 0.02}>
                <Badge>{t}</Badge>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.18 + i * 0.06}>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              href={`/projects/${encodeURIComponent(slugKey(p.slug))}`}
              variant="outline"
            >
              Details
            </Button>
            {p.liveUrl ? (
              <Button href={p.liveUrl} variant="ghost">
                Live →
              </Button>
            ) : null}
          </div>
        </Reveal>
      </TiltCard>
    </Reveal>
  );
}

export default function ProjectsSection({
  limit,
  showViewAll = false,
  enableFilters = false,
  enableSearch = false,
  syncToUrl = false,
  enableSlashFocus = false, // (ProjectsSearchPro already has keyboard logic if needed later)
  sectionId = "projects",
}) {
  const isHome = typeof limit === "number";
  const baseList = isHome ? projects.slice(0, limit) : projects;

  const sectionRef = useRef(null);

  const searchProRef = useRef(null);

  // ✅ NEW: results list controlled by ProjectsSearchPro
  const [list, setList] = useState(baseList);

  // ✅ ensure list resets if baseList changes (home limit / data update)
  useEffect(() => {
    setList(baseList);
  }, [baseList]);

  // ✅ hash scroll (keep)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash?.replace("#", "");
    if (!hash || hash !== sectionId) return;

    const t = setTimeout(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);

    return () => clearTimeout(t);
  }, [sectionId]);

  const heading = isHome
    ? {
        eyebrow: "Projects",
        title: "Selected work",
        desc: "A few projects that show my UI and development style.",
      }
    : {
        title: "All projects",
        desc: "Search and filter by stack—explore UI, performance and real builds.",
      };

  return (
    <section ref={sectionRef} id={sectionId} className="py-16 scroll-mt-24">
      <Container>
        <Parallax from={14} to={-14}>
          <Reveal>
            <SectionHeading
              eyebrow={heading.eyebrow}
              title={heading.title}
              desc={heading.desc}
            />
          </Reveal>
        </Parallax>

        {/* ✅ NEW: Pro Search + Chips (only on Projects page, not home) */}
        {!isHome ? (
          <ProjectsSearchPro
            ref={searchProRef}
            enableFilters={enableFilters}
            enableSearch={enableSearch}
            syncToUrl={syncToUrl}
            onResults={(results) => setList(results)}
          />
        ) : null}

        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${list.length}`}
            initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(10px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-8 grid gap-6 md:grid-cols-2"
          >
            {list.map((p, i) => (
              <ProjectCard key={p.slug} p={p} i={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {list.length === 0 ? (
          // <div className="mt-10 rounded-3xl border border-border/12 bg-foreground/[0.03] p-8 text-center">
          //   <p className="text-lg font-semibold text-foreground">
          //     No projects found
          //   </p>
          //   <p className="mt-2 text-sm text-muted/60">
          //     Try a different keyword or choose another filter.
          //   </p>
          // </div>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                searchProRef.current?.clearFilters?.();
                setList(baseList);
              }}
              className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
              type="button"
            >
              Clear filters
            </button>

            <button
              onClick={() => {
                searchProRef.current?.clearSearch?.();
                setList(baseList);
              }}
              className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
              type="button"
            >
              Clear search
            </button>

            <button
              onClick={() => {
                searchProRef.current?.resetAll?.();
                setList(baseList);
              }}
              className="rounded-xl border border-border/15 bg-foreground/[0.03] px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/[0.06]"
              type="button"
            >
              Reset all
            </button>
          </div>
        ) : null}

        {showViewAll ? (
          <Reveal delay={0.25}>
            <div className="mt-8">
              <LuxuryButton href="/projects" variant="primary">
                View all projects →
              </LuxuryButton>
            </div>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}

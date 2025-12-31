"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { markVisited } from "@/lib/ai/aiEngine";

const DEFAULT_IDS = ["home", "about", "skills", "projects", "testimonials", "faq", "contact"];

export default function useSectionInView(ids = DEFAULT_IDS) {
    const [current, setCurrent] = useState("home");
    const [visible, setVisible] = useState(false);

    const idsMemo = useMemo(() => ids, [ids]);
    const obsRef = useRef(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const elements = idsMemo
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        if (!elements.length) {
            setCurrent("home");
            return;
        }

        // Battery-friendly: only when page is actually moving
        let raf = 0;

        const observer = new IntersectionObserver(
            (entries) => {
                const hit = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

                if (!hit) return;

                const id = hit.target.getAttribute("id");
                if (!id) return;

                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    setCurrent(id);
                    setVisible(true);
                    markVisited(id);
                });
            },
            {
                root: null,
                threshold: [0.12, 0.2, 0.35, 0.5, 0.65],
                rootMargin: "-30% 0px -55% 0px",
            }
        );

        elements.forEach((el) => observer.observe(el));
        obsRef.current = observer;

        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
        };
    }, [idsMemo]);

    // If user scrolls away from tracked sections, still keep visible false sometimes
    useEffect(() => {
        if (typeof window === "undefined") return;

        const onScroll = () => {
            setVisible(true);
            clearTimeout(onScroll._t);
            onScroll._t = setTimeout(() => setVisible(false), 1000);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return { currentSection: current, sectionVisible: visible };
}
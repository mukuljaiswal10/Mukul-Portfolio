"use client";

import { useEffect } from "react";

export default function useLockBodyScroll(locked) {
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!locked) return;

        const html = document.documentElement;
        const body = document.body;

        // save previous styles
        const prevHtmlOverflow = html.style.overflow;
        const prevBodyOverflow = body.style.overflow;
        const prevBodyPaddingRight = body.style.paddingRight;

        // prevent layout shift (scrollbar space)
        const scrollbarWidth = window.innerWidth - html.clientWidth;

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
        if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

        return () => {
            html.style.overflow = prevHtmlOverflow;
            body.style.overflow = prevBodyOverflow;
            body.style.paddingRight = prevBodyPaddingRight;
        };
    }, [locked]);
}
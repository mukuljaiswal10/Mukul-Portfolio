// src/components/ai/suggestionLock.js
"use client";

const KEY = "mukul_suggestion_lock_v1";

/**
 * Lock idea:
 * - One suggestion at a time across the whole app (top + floating).
 * - Uses localStorage so both components share the same lock.
 */

function readLock() {
    try {
        const raw = localStorage.getItem(KEY);
        const data = raw ? JSON.parse(raw) : null;
        if (!data) return null;

        // auto-expire
        if (Date.now() > (data.expiresAt || 0)) {
            localStorage.removeItem(KEY);
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

function writeLock(data) {
    try {
        localStorage.setItem(KEY, JSON.stringify(data));
    } catch { }
}

export function isLocked() {
    if (typeof window === "undefined") return false;
    return !!readLock();
}

export function acquireLock(owner = "unknown", ttlMs = 9000) {
    if (typeof window === "undefined") return false;

    const current = readLock();
    if (current?.owner && Date.now() <= current.expiresAt) return false;

    const next = {
        owner,
        expiresAt: Date.now() + ttlMs,
    };
    writeLock(next);
    return true;
}

export function releaseLock(owner = "unknown") {
    if (typeof window === "undefined") return;

    const current = readLock();
    // only the owner can release
    if (current?.owner && current.owner !== owner) return;

    try {
        localStorage.removeItem(KEY);
    } catch { }
}
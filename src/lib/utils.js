export function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export function slugify(str = "") {
    return String(str)
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-");
}
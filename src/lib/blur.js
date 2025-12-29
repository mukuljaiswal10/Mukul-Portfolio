export function shimmer(w = 1200, h = 675) {
    return `
  <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g">
        <stop stop-color="rgba(255,255,255,0.06)" offset="20%" />
        <stop stop-color="rgba(255,255,255,0.14)" offset="50%" />
        <stop stop-color="rgba(255,255,255,0.06)" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="rgba(255,255,255,0.04)"/>
    <rect id="r" width="${w}" height="${h}" fill="url(#g)"/>
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite" />
  </svg>`;
}

export function toBase64(str) {
    if (typeof window === "undefined") {
        return Buffer.from(str).toString("base64");
    }
    return window.btoa(str);
}

export function blurDataURL(w = 1200, h = 675) {
    return `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
}
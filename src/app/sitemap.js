export default function sitemap() {
    const baseUrl = "https://mukul-portfolio.vercel.app"; // deploy ke baad apna domain dal dena

    return [
        { url: `${baseUrl}/`, lastModified: new Date() },
        { url: `${baseUrl}/about`, lastModified: new Date() },
        { url: `${baseUrl}/projects`, lastModified: new Date() },
        { url: `${baseUrl}/services`, lastModified: new Date() },
        { url: `${baseUrl}/contact`, lastModified: new Date() },
    ];
}
// src/components/blog/BlogJsonLd.jsx
export default function BlogJsonLd({ post }) {
  if (!post) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${siteUrl}/blog/${post.slug}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    datePublished: post.date,
    dateModified: post.updated || post.date,
    mainEntityOfPage: url,
    author: {
      "@type": "Person",
      name: post.author?.name || "Mukul Jaiswal",
    },
    image: post.coverImage ? [`${siteUrl}${post.coverImage}`] : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

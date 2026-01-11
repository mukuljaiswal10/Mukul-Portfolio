// // src/app/(site)/blog/[slug]/page.jsx
// import Container from "@/components/ui/Container";
// import BlogPostClient from "@/components/blog/BlogPostClient";
// import { getAdjacentPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
// import { notFound } from "next/navigation";

// export async function generateMetadata({ params }) {
//   const { slug } = await params; // ✅ Next 16 compatible
//   const post = getPostBySlug(slug);
//   if (!post) return { title: "Post not found | Blog" };

//   return {
//     title: `${post.title} | Mukul Jaiswal`,
//     description: post.excerpt,
//   };
// }

// export default async function BlogDetailPage({ params }) {
//   const { slug } = await params; // ✅ Next 16 compatible
//   const post = getPostBySlug(slug);
//   if (!post) notFound();

//   const adjacent = getAdjacentPosts(post.slug);
//   const related = getRelatedPosts(post.slug, { limit: 3 });

//   return (
//     <section className="py-12 sm:py-16">
//       <Container>
//         <BlogPostClient
//           post={{
//             slug: post.slug,
//             title: post.title,
//             excerpt: post.excerpt,
//             category: post.category,
//             tags: post.tags,
//             date: post.date,
//             readTime: post.readTime,
//             coverStyle: post.coverStyle,
//             contentHtml: post.contentHtml,
//           }}
//           toc={post.headings}
//           adjacent={adjacent}
//           related={related}
//         />
//       </Container>
//     </section>
//   );
// }

// src/app/(site)/blog/[slug]/page.jsx
import Container from "@/components/ui/Container";
import BlogPostClient from "@/components/blog/BlogPostClient";
import BlogJsonLd from "@/components/blog/BlogJsonLd";
import { getAdjacentPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { notFound } from "next/navigation";

const DEFAULT_AUTHOR = {
  name: "Mukul Jaiswal",
  role: "Full-stack & WordPress Developer",
};

const DEFAULT_COVER_IMAGE = "/blog/default-og.jpg"; // public/blog/default-og.jpg

export async function generateMetadata({ params }) {
  const { slug } = await params; // ok even if params is not a Promise

  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found | Blog" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const canonical = `${siteUrl}/blog/${post.slug}`;

  const title = `${post.title} | Mukul Jaiswal`;
  const description = post.excerpt || "";
  const coverImage = post.coverImage || DEFAULT_COVER_IMAGE;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical },

    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: coverImage ? [{ url: coverImage }] : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverImage ? [coverImage] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const adjacent = getAdjacentPosts(post.slug);
  const related = getRelatedPosts(post.slug, { limit: 3 });

  // ✅ fallbacks (no need to update every post manually)
  const updated = post.updated || post.date;
  const author = post.author || DEFAULT_AUTHOR;
  const coverImage = post.coverImage || DEFAULT_COVER_IMAGE;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        {/* ✅ SEO JSON-LD */}
        <BlogJsonLd
          post={{
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            date: post.date,
            updated,
            author,
            coverImage,
            tags: post.tags,
            category: post.category,
          }}
        />

        <BlogPostClient
          post={{
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            category: post.category,
            tags: post.tags,
            date: post.date,
            updated, // ✅ added
            author, // ✅ added
            coverImage, // ✅ added
            readTime: post.readTime ?? post.readMins,
            coverStyle: post.coverStyle,
            contentHtml: post.contentHtml,
          }}
          toc={post.headings}
          adjacent={adjacent}
          related={related}
        />
      </Container>
    </section>
  );
}

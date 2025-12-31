

// src/app/(site)/blog/[slug]/page.jsx
import Container from "@/components/ui/Container";
import BlogPostClient from "@/components/blog/BlogPostClient";
import { getAdjacentPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ Next 16 compatible
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found | Blog" };

  return {
    title: `${post.title} | Mukul Jaiswal`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params; // ✅ Next 16 compatible
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const adjacent = getAdjacentPosts(post.slug);
  const related = getRelatedPosts(post.slug, { limit: 3 });

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <BlogPostClient
          post={{
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            category: post.category,
            tags: post.tags,
            date: post.date,
            readTime: post.readTime,
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

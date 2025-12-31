import Container from "@/components/ui/Container";
import BlogIndexClient from "@/components/blog/BlogIndexClient";
import { getAllPosts } from "@/lib/blog";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
export const metadata = {
  title: "Blog | Mukul Jaiswal",
  description:
    "Practical MERN + WordPress guides, checklists & production patterns.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section className="py-16">
      <Container>
        <Parallax from={10} to={-10}>
          <Reveal>
            <Breadcrumbs items={[{ label: "Blogs" }]} />
            <h1 className="text-3xl font-bold md:text-4xl">Blogs</h1>
            <p className="mt-2 max-w-2xl text-white/70">
              Build faster with clean UI, secure code, and deployment-ready guides.
            </p>
            <div className="mt-[100px] max-w-4xl">
              <p className="text-xs uppercase tracking-[0.25em] text-foreground/55">
                Blog • MERN • WordPress • Next.js
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#E7C266] sm:text-5xl">
                Learn, build & ship premium web experiences
              </h1>
              <p className="mt-3 text-sm text-foreground/70 sm:text-base">
                Practical tutorials, real-world checklists, and production
                patterns for Full Stack MERN + WordPress development.
              </p>
            </div>

            <BlogIndexClient posts={posts} />
          </Reveal>
        </Parallax>
      </Container>
    </section>
  );
}

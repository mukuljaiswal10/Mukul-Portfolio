import Link from "next/link";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-20">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-white/70">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-black hover:opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </Container>
  );
}

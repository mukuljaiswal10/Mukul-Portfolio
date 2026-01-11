// src/app/(site)/blog/[slug]/loading.jsx
export default function Loading() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-10 w-3/4 rounded bg-white/10" />
          <div className="h-4 w-full rounded bg-white/10" />
          <div className="h-4 w-11/12 rounded bg-white/10" />
          <div className="h-4 w-10/12 rounded bg-white/10" />
          <div className="mt-8 h-64 w-full rounded-xl bg-white/10" />
        </div>
      </div>
    </section>
  );
}

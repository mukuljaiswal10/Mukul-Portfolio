export default function SectionHeading({ eyebrow, title, desc }) {
  return (
    <div className="mb-8">
      {eyebrow ? (
        <p className="text-sm font-semibold text-white/60">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-bold md:text-3xl">{title}</h2>
      {desc ? <p className="mt-2 max-w-2xl text-white/70">{desc}</p> : null}
    </div>
  );
}

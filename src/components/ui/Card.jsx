import { cn } from "@/lib/utils";

export default function Card({ className = "", children }) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/10 bg-foreground/[0.03] p-6 transition",
        "hover:border-border/20 hover:bg-foreground/[0.05]",
        className
      )}
    >
      {/* glow */}
      <div className="pointer-events-none absolute -inset-24 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/10 blur-3xl" />
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}

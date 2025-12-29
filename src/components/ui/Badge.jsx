import { cn } from "@/lib/utils";

export default function Badge({ className = "", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs text-white/80",
        className
      )}
    >
      {children}
    </span>
  );
}

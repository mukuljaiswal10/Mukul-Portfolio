import { cn } from "@/lib/utils";

export default function Input({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25",
        className
      )}
      {...props}
    />
  );
}

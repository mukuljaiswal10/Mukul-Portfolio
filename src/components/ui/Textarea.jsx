import { cn } from "@/lib/utils";

export default function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25",
        className
      )}
      {...props}
    />
  );
}

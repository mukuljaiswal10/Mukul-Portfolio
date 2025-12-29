import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition active:scale-[0.99]";
  const styles = {
    primary: "bg-white text-black hover:opacity-90",
    outline: "border border-white/20 text-white hover:bg-white/5",
    ghost: "text-white/80 hover:text-white",
  };

  if (href) {
    return (
      <Link href={href} className={cn(base, styles[variant], className)}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={cn(base, styles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

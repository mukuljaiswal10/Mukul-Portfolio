// import Link from "next/link";
// import { cn } from "@/lib/utils";

// export default function Button({
//   href,
//   children,
//   variant = "primary",
//   className = "",
//   type = "button",
//   ...props
// }) {
//   const base =
//     "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition active:scale-[0.99]";
//   const styles = {
//     primary: "bg-white text-black hover:opacity-90",
//     outline: "border border-white/20 text-white hover:bg-white/5",
//     ghost: "text-white/80 hover:text-white",
//   };

//   if (href) {
//     return (
//       <Link href={href} className={cn(base, styles[variant], className)}>
//         {children}
//       </Link>
//     );
//   }

//   return (
//     <button
//       type={type}
//       className={cn(base, styles[variant], className)}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// }

// import Link from "next/link";
// import { cn } from "@/lib/utils";

// export default function Button({
//   href,
//   children,
//   variant = "primary",
//   className = "",
//   type = "button",
//   asChild = false, // ✅ added
//   ...props
// }) {
//   const base =
//     "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition active:scale-[0.99]";
//   const styles = {
//     primary: "bg-white text-black hover:opacity-90",
//     outline: "border border-white/20 text-white hover:bg-white/5",
//     ghost: "text-white/80 hover:text-white",
//   };

//   // ✅ FIX: asChild ko DOM props me जाने से रोकना
//   // (warning ka root cause yehi tha)
//   const { asChild: _removeAsChild, ...rest } = props;

//   // ✅ If asChild: child element ko hi render kar do with injected classes/props
//   if (asChild) {
//     const child = Array.isArray(children) ? children[0] : children;

//     // child valid element hona chahiye (Link/a/span etc)
//     if (child && typeof child === "object" && "props" in child) {
//       return {
//         ...child,
//         props: {
//           ...child.props,
//           ...rest,
//           className: cn(
//             base,
//             styles[variant],
//             className,
//             child.props.className
//           ),
//         },
//       };
//     }

//     // fallback: if child element valid nahi hai
//     return (
//       <span className={cn(base, styles[variant], className)} {...rest}>
//         {children}
//       </span>
//     );
//   }

//   // ✅ If href provided
//   if (href) {
//     return (
//       <Link href={href} className={cn(base, styles[variant], className)}>
//         {children}
//       </Link>
//     );
//   }

//   // ✅ Normal button
//   return (
//     <button
//       type={type}
//       className={cn(base, styles[variant], className)}
//       {...rest}
//     >
//       {children}
//     </button>
//   );
// }

"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type = "button",
  asChild = false, // ✅ handle asChild properly
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition active:scale-[0.99]";

  const styles = {
    primary: "bg-white text-black hover:opacity-90",
    outline: "border border-white/20 text-white hover:bg-white/5",
    ghost: "text-white/80 hover:text-white",
  };

  const classes = cn(base, styles[variant], className);

  // ✅ asChild support (prevents `asChild` prop from going to DOM)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      className: cn(classes, children.props?.className),
    });
  }

  // ✅ Link mode
  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  // ✅ Button mode
  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

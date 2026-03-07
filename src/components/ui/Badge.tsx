import React from "react";
import type { BadgeProps } from "./types";

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "ok", dot = true, ...props }, ref) => {
    // Tailwind's JIT handles rgba cleanly when referenced from a var
    // To ensure exact matches without complex config, using arbitrary values here
    // for the very specific signal backgrounds since they don't map to global text/bg vars
    const variants = {
      ok: "bg-[#1A7A50]/10 border-[#1A7A50]/20 text-brand-ok",
      warn: "bg-[#9A7200]/10 border-[#9A7200]/20 text-brand-warn",
      danger: "bg-[#A82828]/10 border-[#A82828]/20 text-brand-danger",
    };

    const base =
      "inline-flex items-center gap-1.5 rounded-full border font-sans text-[12px] font-medium px-3 py-1.5";

    return (
      <span
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`.trim()}
        {...props}
      >
        {dot && (
          <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
        )}
        {props.children}
      </span>
    );
  },
);
Badge.displayName = "Badge";

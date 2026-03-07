import React from "react";
import type { ButtonProps } from "./types";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-sans font-semibold transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] rounded-[10px] select-none";

    const sizes = {
      sm: "px-4 py-2 text-[13px]",
      md: "px-6 py-2.5 text-[14px]",
      lg: "px-9 py-3.5 text-[15px]",
    };

    const variants = {
      primary:
        "bg-scarlet dark:bg-scarlet-bright text-white hover:bg-scarlet-dark dark:hover:bg-scarlet-hover hover:-translate-y-0.5 disabled:opacity-40",
      ghost:
        "bg-transparent text-ink/50 dark:text-frost/50 border border-ink/16 dark:border-frost/15 hover:border-ink dark:hover:border-frost hover:text-ink dark:hover:text-frost",
      white: "bg-white text-ink hover:bg-white/90 hover:-translate-y-0.5",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`.trim()}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

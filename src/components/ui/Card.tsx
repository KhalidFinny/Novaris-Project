import React from "react";
import type { CardProps } from "./types";

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`bg-white dark:bg-white border border-ink/8 dark:border-frost/8 rounded-2xl relative overflow-hidden transition-all duration-300 ${className}`.trim()}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

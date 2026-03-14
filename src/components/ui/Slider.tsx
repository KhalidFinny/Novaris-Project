import React from "react";
import { cn } from "../../lib/utils/classNames";
import { SliderProps } from "./types";

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, hint, ...props }, ref) => {
    const isGlow = props.value && (props as any).glow;
    return (
      <div className="w-full">
        {label && (
          <div className="flex justify-between mb-2 items-center">
            <label className="eyebrow eyebrow-muted">{label}</label>
            {props.value !== undefined && (
              <span className="font-mono text-xs text-brand-accent font-medium">
                {props.value}
              </span>
            )}
          </div>
        )}
        <input
          type="range"
          style={{ accentColor: "var(--color-brand-accent)" }}
          className={cn(
            "w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 transition-all duration-300",
            isGlow ? "shadow-[0_0_10px_rgba(255,90,54,0.35)]" : "",
            className,
          )}
          ref={ref}
          {...props}
        />
        {hint && <p className="mt-1 text-xs text-brand-faint">{hint}</p>}
      </div>
    );
  },
);

Slider.displayName = "Slider";

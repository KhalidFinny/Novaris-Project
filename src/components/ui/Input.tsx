import React, { useState } from "react";
import { Info } from "lucide-react";
import type { InputProps } from "./types";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      label,
      suffix,
      type = "text",
      info,
      invalid = false,
      errorText,
      ...props
    },
    ref,
  ) => {
    const [showInfo, setShowInfo] = useState(false);
    if (type === "range") {
      return (
        <div className={`mb-5 ${className}`}>
          {label && (
            <div className="flex justify-between items-end mb-2 relative">
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-sans text-[13px] font-medium ${
                    invalid
                      ? "text-scarlet dark:text-scarlet-bright"
                      : "text-ink/55 dark:text-frost/55"
                  }`}
                >
                  {label}
                </span>
                {info && (
                  <button
                    type="button"
                    className="text-ink/20 dark:text-frost/20 hover:text-ink/60 dark:hover:text-frost/60 transition-colors cursor-help"
                    onMouseEnter={() => setShowInfo(true)}
                    onMouseLeave={() => setShowInfo(false)}
                    aria-label={`Info about ${label}`}
                  >
                    <Info size={12} />
                  </button>
                )}
                {showInfo && info && (
                  <div className="absolute left-0 bottom-full mb-1 w-56 p-2.5 bg-ink dark:bg-arctic text-white dark:text-ink font-sans text-sm rounded shadow-lg z-50 pointer-events-none leading-relaxed">
                    {info}
                  </div>
                )}
              </div>
              <span className="font-mono text-[12px] text-scarlet dark:text-scarlet-bright">
                {props.value}
                {suffix}
              </span>
            </div>
          )}
          <input
            type="range"
            ref={ref}
            className="w-full h-1 bg-ink/8 dark:bg-frost/8 appearance-none cursor-pointer rounded-full"
            style={{ accentColor: "var(--color-scarlet)" }}
            aria-invalid={invalid}
            {...props}
          />
          {invalid && errorText && (
            <p className="mt-2 font-sans text-[12px] text-scarlet dark:text-scarlet-bright">
              {errorText}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className={`mb-5 ${className}`}>
        {label && (
          <div className="flex justify-between items-end mb-2 relative">
            <div className="flex items-center gap-1.5">
                <span
                  className={`font-sans text-[13px] font-medium ${
                    invalid
                      ? "text-scarlet dark:text-scarlet-bright"
                      : "text-ink/55 dark:text-frost/55"
                  }`}
                >
                  {label}
                </span>
              {info && (
                <button
                  type="button"
                  className="text-ink/20 dark:text-frost/20 hover:text-ink/60 dark:hover:text-frost/60 transition-colors cursor-help"
                  onMouseEnter={() => setShowInfo(true)}
                  onMouseLeave={() => setShowInfo(false)}
                  aria-label={`Info about ${label}`}
                >
                  <Info size={12} />
                </button>
              )}
              {showInfo && info && (
                <div className="absolute left-0 bottom-full mb-1 w-56 p-2.5 bg-ink dark:bg-arctic text-white dark:text-ink font-sans text-sm rounded shadow-lg z-50 pointer-events-none leading-relaxed">
                  {info}
                </div>
              )}
            </div>
            {suffix && (
              <span className="font-mono text-[12px] text-ink/35 dark:text-frost/35 uppercase">
                {suffix}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <input
            type={type}
            ref={ref}
            value={type === "number" && props.value === 0 ? "" : props.value}
            placeholder={
              type === "number" && !props.placeholder ? "0" : props.placeholder
            }
            className={`w-full h-11 rounded-[8px] px-4 font-sans text-[15px] text-ink dark:text-frost outline-none transition-all duration-500 placeholder:text-ink/30 dark:placeholder:text-frost/30
                                   bg-ink/4 dark:bg-frost/4 border focus:bg-ink/6 dark:focus:bg-frost/6 ${
                                     invalid
                                       ? "border-scarlet/55 dark:border-scarlet-bright/60"
                                       : "border-ink/9 dark:border-frost/8 focus:border-scarlet/40 dark:focus:border-scarlet-bright/40"
                                   }`}
            aria-invalid={invalid}
            {...props}
          />
        </div>
        {invalid && errorText && (
          <p className="mt-2 font-sans text-[12px] text-scarlet dark:text-scarlet-bright">
            {errorText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

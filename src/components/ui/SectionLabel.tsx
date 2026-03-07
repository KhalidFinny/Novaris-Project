import React from "react";

interface SectionLabelProps {
  text: string;
  className?: string;
}

export function SectionLabel({ text, className = "" }: SectionLabelProps) {
  return (
    <p
      className={`font-mono text-[0.58rem] font-medium tracking-[0.3em] uppercase text-[var(--accent)] flex items-center gap-2.5 mb-7 ${className}`}
    >
      <span className="w-5 h-px bg-[var(--accent)] inline-block shrink-0" />
      {text}
    </p>
  );
}

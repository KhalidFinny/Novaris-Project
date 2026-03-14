import React from "react";

interface SectionGuideProps {
  step: string;
  title: string;
  description: string;
}

export function SectionGuide({ step, title, description }: SectionGuideProps) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="font-sans text-[12px] tracking-[0.18em] uppercase text-ink/58 dark:text-frost/66">
        {step}
      </p>
      <h2 className="mt-3 font-fraunces text-[clamp(28px,3.3vw,42px)] leading-[1.02] tracking-[-0.03em] text-ink dark:text-frost">
        {title}
      </h2>
      <p className="mt-3 font-sans text-[16px] leading-relaxed text-ink/72 dark:text-frost/76">
        {description}
      </p>
    </div>
  );
}

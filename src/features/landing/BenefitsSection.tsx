import React from "react";
import { BENEFITS, BENEFITS_ID } from "./data";
import { useLocale } from "../../hooks/useLocale";

export function BenefitsSection() {
  const { language } = useLocale();
  const isId = language === "id";
  const benefits = isId ? BENEFITS_ID : BENEFITS;

  return (
    <section
      id="solutions"
      className="min-h-screen flex flex-col justify-center px-6 sm:px-13 py-24 bg-bone dark:bg-charcoal transition-colors duration-520"
    >
      <div className="max-w-content mx-auto">
        {/* Header row */}
        <div
          className="flex items-end justify-between gap-10 mb-16
                        max-lg:flex-col max-lg:items-start"
        >
          <h2
            className="font-fraunces font-semibold
                       leading-none tracking-tight text-ink dark:text-frost
                       transition-colors duration-520"
            style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}
          >
            {isId ? "Apa yang berubah saat" : "What changes when"}
            <br />
            {isId ? "Anda pakai Novaris." : "you use Novaris."}
          </h2>
            <p
             className="max-w-[30ch] font-sans font-light text-[20px]
                        text-ink/72 dark:text-frost/76
                        leading-relaxed pl-8 border-l border-ink/9 dark:border-frost/8
                       max-lg:border-l-0 max-lg:pl-0 max-lg:border-t max-lg:border-ink/9 max-lg:pt-4
                       transition-colors duration-520"
          >
            {isId
              ? "Bukan daftar fitur. Ini perubahan nyata dalam cara bisnis Anda berjalan sehari-hari."
              : "Not a feature list. Real shifts in how your business operates day to day."}
          </p>
        </div>

        {/* 3-col flat benefit cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px
                     bg-ink/9 dark:bg-charcoal-light
                     border border-ink/9 dark:border-frost/10
                     rounded-card overflow-hidden"
        >
          {benefits.map((b, i) => (
            <div
              key={i}
              className={`ben-card group relative bg-bone-soft dark:bg-charcoal-soft p-8 cursor-pointer overflow-hidden
                           hover:bg-bone dark:hover:bg-charcoal-light transition-colors duration-200 ease-spring`}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5
                           scale-x-0 group-hover:scale-x-100 origin-left
                           transition-transform duration-380 ease-spring"
                style={{
                  background:
                    "linear-gradient(to right, var(--color-scarlet), var(--color-steel))",
                }}
                aria-hidden="true"
              />

              {/* Number */}
              <div
                className="font-fraunces font-semibold
                           text-[48px] leading-none tracking-tight mb-5
                           text-ink/16 dark:text-frost/20
                           group-hover:text-scarlet dark:group-hover:text-scarlet-bright
                           transition-colors duration-300 ease-spring"
              >
                {b.n}
              </div>

               <h3
                 className="font-fraunces font-semibold text-[28px]
                            leading-snug tracking-tight
                            text-ink dark:text-frost mb-2.5"
               >
                {b.headline}
              </h3>
               <p
                 className="font-sans font-light text-[17px]
                            text-ink/66 dark:text-frost/76 leading-relaxed"
                >
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

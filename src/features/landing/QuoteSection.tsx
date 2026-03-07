import React from "react";
import { useLocale } from "../../hooks/useLocale";

export function QuoteSection() {
  const { language } = useLocale();
  const isId = language === "id";

  return (
    <section
      className="px-13 py-22 bg-transparent dark:bg-transparent
                 transition-colors duration-520 ease-spring
                 max-sm:px-6"
    >
      <div className="max-w-content mx-auto">
        <div className="max-w-quote">
          {/* Quote mark + text */}
          <div className="grid grid-cols-[40px_1fr] gap-7 items-start">
            {/* Opening quote mark */}
            <div
              className="font-fraunces font-bold text-[56px] leading-[.7]
                         text-scarlet dark:text-scarlet-bright transition-colors duration-520"
              aria-hidden="true"
            >
              "
            </div>

            {/* Text + attribution */}
            <div>
              <blockquote
                className="font-fraunces font-light italic
                           leading-[1.46] tracking-[-0.01em]
                           text-ink dark:text-frost mb-6
                           transition-colors duration-520"
                style={{ fontSize: "clamp(24px, 3.2vw, 42px)" }}
              >
                {isId
                  ? "Risiko bukan musuh ambisi."
                  : "Risk isn't the enemy of ambition."}{" "}
                <strong className="font-semibold not-italic text-scarlet dark:text-scarlet-bright">
                  {isId ? "Risiko yang tidak dikelola adalah musuhnya." : "Unmanaged risk is."}
                </strong>{" "}
                {isId
                  ? "Bisnis yang menang bukan yang menghindari risiko, tetapi yang memahaminya cukup baik untuk bergerak lebih cepat dari yang lain."
                  : "The businesses that win aren't the ones that avoided risk — they're the ones who understood it well enough to move faster than everyone else."}
              </blockquote>
              <div
                className="flex items-center gap-2.5
                              font-sans text-[11px] text-ink/30 dark:text-frost/28 tracking-[.06em]
                              transition-colors duration-520"
              >
                <span
                  className="w-4 h-px bg-scarlet dark:bg-scarlet-bright shrink-0"
                  aria-hidden="true"
                />
                {isId
                  ? "Aon Risk Solutions — Laporan Global Manajemen Risiko 2024"
                  : "Aon Risk Solutions — 2024 Global Risk Management Report"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

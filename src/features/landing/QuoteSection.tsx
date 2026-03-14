import React from "react";
import { useLocale } from "../../hooks/useLocale";

export function QuoteSection() {
  const { language } = useLocale();
  const isId = language === "id";

  return (
    <section
      className="px-13 py-22 bg-bone dark:bg-charcoal
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
            ></div>
            <div>
              <blockquote
                 className="font-fraunces font-light italic
                            leading-[1.46] tracking-[-0.01em]
                            text-ink dark:text-frost mb-6
                            transition-colors duration-520"
                 style={{ fontSize: "clamp(28px, 3.4vw, 46px)" }}
              >
                {" "}
                "
                {isId
                  ? "Keputusan yang benar pun menjadi salah"
                  : "Even a correct decision"}
                <strong className="font-semibold not-italic text-scarlet dark:text-scarlet-bright">
                  {" "}
                  {isId
                    ? "jika diambil terlalu lambat."
                    : "is wrong when it was taken too late."}
                </strong>
                "
              </blockquote>
              <div
                  className="flex items-center gap-2.5
                               font-sans text-[15px] text-ink/54 dark:text-frost/64 tracking-[.06em]
                              transition-colors duration-520"
              >
                <span
                  className="w-4 h-px bg-scarlet dark:bg-scarlet-bright shrink-0"
                  aria-hidden="true"
                />
                {isId
                  ? "Lee Iacocca — CEO Chrysler, Bapak Ford Mustang"
                  : "Lee Iacocca — CEO of Chrysler, father of the Ford Mustang"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

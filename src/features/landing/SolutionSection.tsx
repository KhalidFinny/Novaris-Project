import React from "react";
import { Link } from "react-router-dom";
import { FEATURES, FEATURES_ID } from "./data";
import { useLocale } from "../../hooks/useLocale";

export function SolutionSection() {
  const { language } = useLocale();
  const isId = language === "id";
  const features = isId ? FEATURES_ID : FEATURES;

  return (
    <section
      id="platform"
      className="min-h-screen flex flex-col justify-center px-6 sm:px-13 py-24 bg-bone dark:bg-charcoal transition-colors duration-520"
    >
      <div className="max-w-content mx-auto">
        {/* 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start mb-16">
          {/* Left */}
          <div>
            <div
               className="flex items-center gap-2.5 mb-4.5
                             font-mono text-[12px] tracking-[0.16em] uppercase
                            text-scarlet dark:text-scarlet-bright"
            >
              <span
                className="w-4 h-px bg-scarlet dark:bg-scarlet-bright shrink-0"
                aria-hidden="true"
              />
              {isId ? "Solusi" : "The solution"}
            </div>
            <h2
              className="font-fraunces font-semibold
                         leading-none tracking-tight text-ink dark:text-frost mb-6
                         transition-colors duration-520"
              style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}
            >
              {isId ? "Manajemen risiko untuk" : "Risk management built for"}{" "}
              <span className="text-steel dark:text-steel-bright">
                {isId ? "cara kerja Anda." : "how you work."}
              </span>
            </h2>
             <p className="font-sans font-light text-[20px] text-ink/72 dark:text-frost/78 leading-relaxed max-w-[42ch] mb-8">
              {isId
                ? "Novaris terhubung ke tools Anda, memetakan eksposur secara otomatis, dan hanya menampilkan hal yang benar-benar perlu perhatian."
                : "Novaris connects to your tools, maps your exposure automatically, and surfaces only what needs your attention — without demanding your time every day."}
            </p>
            <Link
              to="/financial"
               className="inline-flex font-sans font-semibold text-[13px] uppercase tracking-[0.14em]
                          px-7 py-3.5 rounded-card
                         bg-scarlet dark:bg-scarlet-bright text-white
                         hover:bg-scarlet-dark dark:hover:bg-scarlet-hover hover:-translate-y-0.5
                         transition-all duration-200 ease-spring border-0 cursor-pointer no-underline"
            >
              {isId ? "Jelajahi Platform" : "Explore the Platform"}
            </Link>
          </div>

          {/* Right: feature rows */}
          <div className="flex flex-col">
            {features.map((f, i) => (
              <div
                key={i}
                className="feat-row group grid grid-cols-[28px_1fr_16px] gap-3.5 items-start
                           py-4 border-b border-ink/9 dark:border-frost/8
                           cursor-pointer
                           first:border-t first:border-ink/9 dark:first:border-t dark:first:border-frost/8"
              >
                {/* Index */}
                <span
                   className="font-mono text-[12px] tracking-[0.08em] text-ink/48 dark:text-frost/60 pt-0.5
                                  group-hover:text-scarlet dark:group-hover:text-scarlet-bright transition-colors duration-200"
                >
                  {f.n}
                </span>
                {/* Text */}
                <div>
                   <div className="font-sans font-medium text-[18px] text-ink dark:text-frost mb-1.5">
                    {f.label}
                  </div>
                   <div className="font-sans font-light text-[17px] text-ink/62 dark:text-frost/74 leading-relaxed">
                    {f.desc}
                  </div>
                </div>
                {/* Arrow */}
                <span
                  className="font-sans text-[15px] text-scarlet dark:text-scarlet-bright pt-0.5
                                 opacity-0 -translate-x-1
                                 group-hover:opacity-100 group-hover:translate-x-0
                                 transition-all duration-200 ease-spring"
                >
                  →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

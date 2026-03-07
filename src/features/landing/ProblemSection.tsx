import React from "react";
import { PROBLEMS, PROBLEMS_ID, STATS, STATS_ID } from "./data";
import { useLocale } from "../../hooks/useLocale";

export function ProblemSection() {
  const { language } = useLocale();
  const isId = language === "id";
  const stats = isId ? STATS_ID : STATS;
  const problems = isId ? PROBLEMS_ID : PROBLEMS;

  return (
    <section
      id="about"
      className="min-h-screen flex flex-col justify-center px-6 sm:px-13 py-24 bg-transparent dark:bg-transparent transition-colors duration-520"
    >
      <div className="max-w-content mx-auto">
        {/* Top 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start mb-16">
          {/* Left: headline + body */}
          <div>
            {/* Eyebrow */}
            <div
              className="flex items-center gap-2.5 mb-4.5
                            font-mono text-[9px] tracking-widest uppercase
                            text-scarlet dark:text-scarlet-bright"
            >
              <span
                className="w-4 h-px bg-scarlet dark:bg-scarlet-bright shrink-0"
                aria-hidden="true"
              />
               {isId ? "Masalahnya" : "The problem"}
            </div>
            <h2
              className="font-fraunces font-semibold
                         leading-none tracking-tight text-ink dark:text-frost mb-6
                         transition-colors duration-520"
              style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}
            >
               {isId ? "Banyak bisnis" : "Most businesses are"}{" "}
               <em className="italic font-normal text-scarlet dark:text-scarlet-bright">
                 {isId ? "berjalan tanpa visibilitas." : "flying blind."}
               </em>
            </h2>
            <p className="font-sans font-light text-base text-ink/70 dark:text-frost/70 leading-relaxed max-w-[40ch]">
              {isId
                ? "Setiap hari Anda membuat keputusan berisiko tinggi. Tanpa pandangan risiko yang terstruktur, bisnis hanya mengandalkan insting. Itu bukan strategi. Itu eksposur."
                : "You're making high-stakes decisions every day. Without a structured view of risk, you're operating on instinct alone. That's not strategy. That's exposure."}
            </p>
          </div>

          {/* Right: stat rows */}
          <div className="flex flex-col">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`grid grid-cols-[80px_1fr] gap-5 items-start
                            py-5 border-b border-ink/9 dark:border-frost/8
                            ${i === 0 ? "border-t border-ink/9 dark:border-frost/8" : ""}`}
              >
                <div
                  className="font-fraunces font-semibold leading-none
                             tracking-tight text-scarlet dark:text-scarlet-bright"
                  style={{ fontSize: "clamp(28px, 3vw, 38px)" }}
                >
                  {s.stat}
                </div>
                <div>
                  <p className="font-sans font-medium text-[13.5px] text-ink dark:text-frost leading-snug mb-0.75">
                    {s.label}
                  </p>
                  <span className="font-mono text-[8.5px] tracking-wider text-ink/30 dark:text-frost/28">
                    {s.src}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3-col flat problem cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-px
                     bg-ink/9 dark:bg-frost/8
                     border border-ink/9 dark:border-frost/8
                     rounded-card overflow-hidden"
        >
          {problems.map((p, i) => (
            <div
              key={i}
              className="bg-arctic dark:bg-void p-8 cursor-default
                         hover:bg-arctic-soft dark:hover:bg-void-soft
                         transition-colors duration-200 ease-spring"
            >
              <div
                className="font-mono text-[9px] tracking-widest uppercase
                              text-scarlet dark:text-scarlet-bright mb-4"
              >
                {p.tag}
              </div>
              <h3
                className="font-fraunces font-semibold text-lg leading-tight tracking-tight
                             text-ink dark:text-frost mb-2.5"
              >
                {p.headline}
              </h3>
              <p className="font-sans font-light text-xs text-ink/50 dark:text-frost/50 leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

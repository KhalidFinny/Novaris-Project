import React from "react";
import { ShieldCheck } from "lucide-react";
import type { StabilitySceneProps } from "./types";

export function StabilityScene({
  data,
  survivalColor,
  riskScore,
  headline,
  language = "en",
}: StabilitySceneProps) {
  return (
    <article className="px-8 sm:px-12 py-16 border-b border-ink/5 dark:border-frost/5 relative overflow-hidden bg-arctic dark:bg-void">
      {/* Soft Background Gradient */}
      <div className="absolute top-0 right-0 w-full max-w-2xl h-full pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(164,22,36,0.03),transparent_70%)]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <header className="mb-12">
          <p className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-scarlet dark:text-scarlet-bright mb-4">
            {language === "id"
              ? "Penilaian Kesehatan Finansial"
              : "Financial Health Assessment"}
          </p>
          <h2 className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.02em] text-ink dark:text-frost leading-tight">
            {language === "id" ? "Ilusi" : "The Illusion of"}{" "}
            <span className="italic text-scarlet dark:text-scarlet-bright">
              {language === "id" ? "Stabilitas" : "Stability"}
            </span>
            .
          </h2>
        </header>

        <div className="flex flex-col lg:flex-row lg:items-end gap-12 lg:gap-20">
          {/* Main Number Display */}
          <div className="shrink-0 relative">
            <span
              id="fin-big-num"
              className="font-fraunces block text-[120px] sm:text-[160px] font-normal tracking-[-0.05em] leading-[0.85] transition-colors duration-700"
              style={{ color: survivalColor }}
            >
              {data ? `${Math.round(data.survivalProbability)}%` : "—"}
            </span>
            {data && (
              <div
                className="absolute -bottom-6 left-2 font-mono text-[11px] font-medium tracking-widest uppercase flex items-center gap-2"
                style={{ color: survivalColor }}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                {riskScore > 60
                  ? language === "id"
                    ? "Burn Kritis"
                    : "Critical Burn"
                  : riskScore > 30
                    ? language === "id"
                      ? "Cadangan Rapuh"
                      : "Fragile Reserves"
                    : language === "id"
                      ? "Sangat Tangguh"
                      : "Ironclad"}
              </div>
            )}
          </div>

          {/* Narrative and Stats */}
          <div className="flex-1 space-y-8 pb-4">
            <p className="font-sans text-2xl sm:text-3xl font-light text-ink/80 dark:text-frost/80 leading-relaxed max-w-[45ch]">
              {headline ?? (
                <span className="text-ink/30 dark:text-frost/30">
                  {language === "id"
                    ? "Masukkan parameter finansial untuk menguji ketahanan runway."
                    : "Input your financial parameters to stress-test your runway."}
                </span>
              )}
            </p>

            {data && (
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-ink/10 dark:border-frost/10">
                <div>
                  <p className="font-mono text-xs tracking-widest uppercase text-ink/40 dark:text-frost/40 mb-3 block">
                    {language === "id" ? "Runway Kas" : "Cash Runway"}
                  </p>
                  <p className="font-sans text-4xl font-light text-ink dark:text-frost mt-2 flex items-baseline gap-2">
                    {data.cashRunwayMonths.toFixed(1)}
                    <span className="text-sm text-ink/40 dark:text-frost/40">
                      {language === "id" ? "bulan" : "months"}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="font-mono text-xs tracking-widest uppercase text-ink/40 dark:text-frost/40 mb-4 block">
                    {language === "id"
                      ? "Perisai Ketahanan"
                      : "Resilience Shields"}
                  </p>
                  <div className="flex gap-2.5">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className="w-10 h-10 rounded-md flex items-center justify-center transition-all duration-500"
                        style={{
                          border:
                            s <= data.resilienceShields
                              ? "1px solid rgba(164,22,36,0.3)"
                              : "1px solid rgba(0,0,0,0)",
                          background:
                            s <= data.resilienceShields
                              ? "rgba(164,22,36,0.08)"
                              : "rgba(0,0,0,0.03)",
                        }}
                      >
                        <ShieldCheck
                          size={18}
                          strokeWidth={2}
                          className={
                            s <= data.resilienceShields
                              ? "text-scarlet dark:text-scarlet-bright drop-shadow-sm"
                              : "text-ink/20 dark:text-frost/20"
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

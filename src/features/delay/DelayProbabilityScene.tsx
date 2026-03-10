import React from "react";
import type { DelayProbabilitySceneProps } from "./types";

export function DelayProbabilityScene({
  data,
  isPending: _,
  probColor,
  headline,
  targetDurationDays,
  language = "en",
}: DelayProbabilitySceneProps) {
  const prob = data?.delayProbability ?? 0;

  const activationReasonLabel = (value: string) => {
    if (language !== "id") {
      return value;
    }
    const map: Record<string, string> = {
      "Expected completion exceeds contract target duration":
        "Perkiraan selesai melewati durasi target kontrak",
      "Predicted delay consumes remaining schedule buffer":
        "Prediksi delay menghabiskan sisa buffer jadwal",
      "Delay probability is above watch threshold":
        "Probabilitas delay sudah melewati ambang waspada",
      "Top bottleneck impact is larger than remaining buffer":
        "Dampak bottleneck utama lebih besar dari sisa buffer",
    };
    return map[value] ?? value;
  };

  return (
    <article className="px-8 sm:px-12 py-16 border-b border-ink/5 dark:border-frost/5 relative overflow-hidden bg-arctic dark:bg-void">
      {/* Soft Background Gradient */}
      <div className="absolute top-0 right-0 w-full max-w-2xl h-full pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(164,22,36,0.03),transparent_70%)]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <header className="mb-12">
          <p className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-scarlet dark:text-scarlet-bright mb-4">
            {language === "id"
              ? "Penilaian Risiko Operasional"
              : "Operational Risk Assessment"}
          </p>
          <h2 className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.02em] text-ink dark:text-frost leading-tight">
            {language === "id" ? "Realita" : "The Reality of"}{" "}
            <span className="italic text-scarlet dark:text-scarlet-bright">
              {language === "id" ? "Keterlambatan" : "Delay"}
            </span>
            .
          </h2>
        </header>

        <div className="flex flex-col lg:flex-row lg:items-end gap-12 lg:gap-20">
          {/* Main Number Display */}
          <div className="shrink-0 relative">
            <span
              id="delay-big-num"
              className="font-fraunces block text-[120px] sm:text-[160px] font-normal tracking-[-0.05em] leading-[0.85] transition-colors duration-700"
              style={{ color: probColor }}
            >
              {data ? `${Math.round(data.delayProbability)}%` : "—"}
            </span>
            {data && (
              <div
                className="absolute -bottom-6 left-2 font-mono text-[11px] font-medium tracking-widest uppercase flex items-center gap-2"
                style={{ color: probColor }}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                {prob > 60
                  ? language === "id"
                    ? "Risiko Delay Kritis"
                    : "Critical Delay Risk"
                  : prob > 30
                    ? language === "id"
                      ? "Friksi Menengah"
                      : "Moderate Friction"
                    : language === "id"
                      ? "Sesuai Jadwal"
                      : "On Schedule"}
              </div>
            )}
          </div>

          {/* Narrative and Stats */}
          <div className="flex-1 space-y-8 pb-4">
            <p className="font-sans text-2xl sm:text-3xl font-light text-ink/80 dark:text-frost/80 leading-relaxed max-w-[45ch]">
              {headline ?? (
                <span className="text-ink/30 dark:text-frost/30">
                  {language === "id"
                    ? "Masukkan parameter proyek untuk melihat narasi operasional."
                    : "Input your project parameters to reveal the operational narrative."}
                </span>
              )}
            </p>

            {data && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-8 border-t border-ink/10 dark:border-frost/10">
                <div>
                  <p className="font-mono text-xs tracking-widest uppercase text-ink/40 dark:text-frost/40 mb-3">
                    {language === "id" ? "Jalur Ideal" : "Ideal Path"}
                  </p>
                  <p className="font-sans text-3xl font-light text-ink dark:text-frost">
                    {targetDurationDays}
                    <span className="text-sm text-ink/40 dark:text-frost/40 ml-1.5">
                      {language === "id" ? "hari" : "days"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs tracking-widest uppercase text-ink/40 dark:text-frost/40 mb-3">
                    {language === "id" ? "Disesuaikan Risiko" : "Risk-Adjusted"}
                  </p>
                  <p
                    className="font-sans text-3xl font-light"
                    style={{ color: probColor }}
                  >
                    {data.expectedDurationDays.toFixed(0)}
                    <span className="text-sm opacity-50 ml-1.5">
                      {language === "id" ? "hari" : "days"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs tracking-widest uppercase text-ink/40 dark:text-frost/40 mb-3">
                    {language === "id" ? "Float Maksimal" : "Maximum Float"}
                  </p>
                  <p className="font-sans text-3xl font-light text-scarlet dark:text-scarlet-bright">
                    +{data.estimatedDelayDaysRange[1].toFixed(0)}
                    <span className="text-sm opacity-50 ml-1.5">
                      {language === "id" ? "hari" : "days"}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {data && data.delayMonitoringActive && data.delayActivationReasons[0] && (
              <p className="text-[14px] text-ink/55 dark:text-frost/55 leading-relaxed">
                {language === "id" ? "Pemicu monitoring: " : "Monitoring trigger: "}
                {activationReasonLabel(data.delayActivationReasons[0])}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

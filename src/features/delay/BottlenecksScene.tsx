import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import type { BottlenecksSceneProps } from "./types";

export function BottlenecksScene({
  data,
  language = "en",
}: BottlenecksSceneProps) {
  const bottleneckLabel = (value: string) => {
    if (language !== "id") {
      return value;
    }
    const map: Record<string, string> = {
      "Project Complexity": "Kompleksitas Proyek",
      "Resource Constraint": "Keterbatasan Sumber Daya",
      "Supplier Lead Variance": "Variansi Lead Time Supplier",
      "External Dependencies": "Dependensi Eksternal",
    };
    return map[value] ?? value;
  };

  const mitigationLabel = (value: string) => {
    if (language !== "id") {
      return value;
    }
    const map: Record<string, string> = {
      "Break down the project into smaller, manageable phases to reduce overlapping complexity risks.":
        "Pecah proyek menjadi fase yang lebih kecil agar risiko kompleksitas bertumpuk berkurang.",
      "Identify backup suppliers for critical path materials to mitigate lead time variance.":
        "Siapkan supplier cadangan untuk material jalur kritis agar variasi lead time berkurang.",
      "Begin clearing external dependencies (permits, approvals) immediately, as they account for significant delay blocks.":
        "Segera selesaikan dependensi eksternal (izin, approval) karena ini sering menjadi hambatan delay terbesar.",
      "Maintain current buffer and monitor supplier lead times closely.":
        "Pertahankan buffer saat ini dan pantau lead time supplier secara ketat.",
    };
    if (value.startsWith("Add at least")) {
      return "Tambahkan anggota tim agar pekerjaan bisa diparalelkan dan bottleneck berkurang.";
    }
    if (value.startsWith("Increase project buffer by at least")) {
      return "Tingkatkan buffer proyek agar cukup menutup risiko prioritas tinggi dalam waktu dekat.";
    }
    return map[value] ?? value;
  };

  return (
    <section className="mx-8 sm:mx-12 my-12 bg-white/40 dark:bg-white/2 backdrop-blur-xl rounded-3xl border border-ink/5 dark:border-frost/5 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ink/5 dark:divide-frost/5">
        {/* Left: Bottlenecks */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-scarlet/10 flex items-center justify-center">
              <AlertTriangle
                size={14}
                className="text-scarlet dark:text-scarlet-bright"
                strokeWidth={2}
              />
            </div>
            <h3 className="font-fraunces text-2xl font-light text-ink dark:text-frost">
              {language === "id" ? "Friksi Kritis" : "Critical Friction"}
            </h3>
          </div>
          <div className="space-y-4">
            {data.criticalBottlenecks.map((b, i) => (
              <div
                key={i}
                className="px-6 py-5 rounded-2xl bg-white/50 dark:bg-white/3 border border-ink/5 dark:border-frost/5 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[15px] text-ink/70 dark:text-frost/70 font-medium leading-tight flex-1 pr-4">
                    {bottleneckLabel(b.factor)}
                  </p>
                  <span className="font-mono text-xs font-bold text-scarlet dark:text-scarlet-bright shrink-0">
                    +{b.delayDaysAdded.toFixed(1)}d
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-ink/5 dark:bg-frost/5">
                  <div
                    className="h-full rounded-full bg-scarlet dark:bg-scarlet-bright transition-all duration-1000"
                    style={{
                      width: `${Math.min(100, b.weight * 400)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Action Plan */}
        <div className="p-8 sm:p-10 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-steel-bright/10 flex items-center justify-center">
              <CheckCircle2
                size={14}
                className="text-steel-bright"
                strokeWidth={2}
              />
            </div>
            <h3 className="font-fraunces text-2xl font-light text-ink dark:text-frost">
              {language === "id"
                ? "Intervensi Strategis"
                : "Strategic Interventions"}
            </h3>
          </div>

          <div className="space-y-5 mb-12 flex-1">
            {data.mitigationSuggestions.map((s, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2 bg-steel-bright opacity-80" />
                <p className="text-[15px] text-ink/70 dark:text-frost/70 leading-relaxed font-normal">
                  {mitigationLabel(s)}
                </p>
              </div>
            ))}
          </div>

          {/* Cascade Link */}
          <div className="p-6 rounded-2xl border border-scarlet/10 bg-scarlet/2 dark:bg-scarlet/5 relative overflow-hidden group hover:bg-scarlet/4 dark:hover:bg-scarlet/8 transition-colors duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-scarlet/5 blur-3xl pointer-events-none" />
            <p className="relative z-10 font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-scarlet dark:text-scarlet-bright mb-3">
              {language === "id" ? "Efek Berantai" : "Cascade Effect"}
            </p>
            <p className="relative z-10 text-[14px] text-ink/60 dark:text-frost/60 leading-relaxed mb-6">
              {language === "id" ? "Tambahan" : "A"}{" "}
              <strong className="font-medium text-ink dark:text-frost">
                +{data.estimatedDelayDaysRange[1].toFixed(0)}d
              </strong>{" "}
              {language === "id"
                ? "keterlambatan ini berdampak langsung ke posisi kas dasar Anda."
                : "overrun translates directly into your baseline cash position."}
            </p>
            <Link
              to="/financial"
              className="relative z-10 inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase text-scarlet dark:text-scarlet-bright no-underline hover:gap-3 transition-all duration-300"
            >
              {language === "id"
                ? "Hubungkan ke Finansial"
                : "Bridge to Financials"}{" "}
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Eye, AlertTriangle, CheckCircle2 } from "lucide-react";
import { RISK_COLORS } from "./constants";
import type { DecisionStorySceneProps } from "./types";

export function DecisionStoryScene({
  data,
  language = "en",
}: DecisionStorySceneProps) {
  const riskDriverLabel = (value: string) => {
    if (language !== "id") {
      return value;
    }
    const map: Record<string, string> = {
      "High Debt Servicing Ratio": "Rasio pembayaran utang terlalu tinggi",
      "Significant Project Delay Burn": "Beban biaya delay proyek signifikan",
      "High Uncertainty in Business Data": "Data bisnis memiliki ketidakpastian tinggi",
      "Critically Low Cash Runway": "Runway kas berada di level kritis",
    };
    return map[value] ?? value;
  };

  const storyHeadlineLabel = (value: string) => {
    if (language !== "id") return value;
    const map: Record<string, string> = {
      "Your business is in a stable growth phase.":
        "Bisnis Anda berada pada fase pertumbuhan yang stabil.",
      "Critical feedback loop detected.":
        "Terdeteksi feedback loop kritis.",
      "Low liquidity is stalling your agility.":
        "Likuiditas rendah menghambat kelincahan bisnis.",
      "Project delay has a high 'Revenue Displacement' cost.":
        "Keterlambatan proyek memiliki biaya perpindahan pendapatan yang tinggi.",
    };
    return map[value] ?? value;
  };

  const unseenRiskLabel = (value: string) => {
    if (language !== "id") return value;
    const map: Record<string, string> = {
      "No critical hidden risks detected at current levels.":
        "Tidak ada risiko tersembunyi kritis pada level saat ini.",
      "Fragility cascade. Your cash reserve is too low to survive even a minor project delay.":
        "Kaskade kerapuhan. Cadangan kas terlalu rendah untuk bertahan bahkan pada delay proyek kecil.",
      "The 'Debt Anchor'. Your monthly obligations leave too little room for project variance.":
        "Efek jangkar utang. Kewajiban bulanan membuat ruang toleransi variasi proyek jadi terlalu sempit.",
      "Invisible Opportunity Cost. The resources stuck on this project are preventing future revenue.":
        "Biaya peluang tak terlihat. Sumber daya yang tertahan di proyek ini menahan potensi pendapatan berikutnya.",
    };
    return map[value] ?? value;
  };

  const impactSummaryLabel = (value: string) => {
    if (language !== "id") return value;
    if (value.includes("total cash-out in month")) {
      return "Delay proyek ini bukan hanya menambah biaya, tetapi juga memicu kehabisan kas total pada bulan berjalan yang diproyeksikan.";
    }
    if (value.includes("14-day delay effectively consumes 3 months")) {
      return "Delay 14 hari secara efektif menghabiskan sekitar 3 bulan modal siap tumbuh Anda.";
    }
    if (value.includes("total cost of this delay is")) {
      return "Total biaya delay ini sangat signifikan dan langsung mengurangi peluang pertumbuhan bisnis.";
    }
    const map: Record<string, string> = {
      "Minor operational fluctuations are absorbed by your reserves.":
        "Fluktuasi operasional kecil masih bisa diserap oleh cadangan kas Anda.",
    };
    return map[value] ?? value;
  };

  const recommendationLabel = (value: string) => {
    if (language !== "id") return value;
    const map: Record<string, string> = {
      "Maintain current buffer and proceed with caution.":
        "Pertahankan buffer saat ini dan lanjutkan dengan hati-hati.",
      "Secure bridge financing or drastically reduce fixed costs before proceeding.":
        "Amankan pembiayaan jembatan atau kurangi biaya tetap secara drastis sebelum melanjutkan.",
      "Focus on clearing high-interest debt to free up operational 'Shields'.":
        "Fokus melunasi utang berbunga tinggi untuk membebaskan ruang ketahanan operasional.",
      "Consider hiring temporary support to decouple the project from your core revenue stream.":
        "Pertimbangkan dukungan sementara agar proyek tidak mengganggu aliran pendapatan inti.",
    };
    return map[value] ?? value;
  };

  const riskLevelLabel = (value: string) => {
    if (language !== "id") return value;
    const map: Record<string, string> = {
      low: "rendah",
      medium: "menengah",
      high: "tinggi",
      critical: "kritis",
    };
    return map[value] ?? value;
  };

  const mitigationLabel = (value: string) => {
    if (language !== "id") {
      return value;
    }
    const map: Record<string, string> = {
      "Your business is 'Single-Shock' fragile. Build a 3-month cash buffer to survive independent sales drops.":
        "Bisnis Anda masih rapuh terhadap satu guncangan. Bangun buffer kas 3 bulan untuk menahan penurunan penjualan.",
      "Restructure short-term debt into long-term loans.":
        "Restrukturisasi utang jangka pendek menjadi pinjaman jangka panjang.",
      "Operationally critical project detected. Add a 15% time buffer to project phases.":
        "Proyek kritis terdeteksi. Tambahkan buffer waktu 15% di fase proyek.",
    };
    return map[value] ?? value;
  };

  const story = data.decisionStory;
  const storyColor = story ? RISK_COLORS[story.riskVisualLevel] : undefined;

  return (
    <div className="pb-12 space-y-8">
      {/* Scene 3: Decision Story */}
      {story && (
        <section className="mx-8 sm:mx-12 mt-12 px-8 py-10 bg-white/40 dark:bg-white/2 backdrop-blur-xl rounded-3xl border border-ink/5 dark:border-frost/5 shadow-sm relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-125 h-125 pointer-events-none opacity-20"
            style={{
              background: `radial-gradient(circle at top right, ${storyColor}, transparent 60%)`,
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${storyColor}15` }}
              >
                <Eye size={16} style={{ color: storyColor }} strokeWidth={2} />
              </div>
              <h3 className="font-fraunces text-3xl font-light text-ink dark:text-frost">
                {language === "id"
                  ? "Strategi Naratif"
                  : "The Narrative Strategy"}
              </h3>
              <span className="flex-1" />
              <span
                className="font-sans text-[12px] font-semibold rounded-full px-4 py-1.5"
                style={{
                  color: storyColor,
                  background: `${storyColor}10`,
                  border: `1px solid ${storyColor}20`,
                }}
                >
                {language === "id"
                  ? `Tingkat Risiko ${riskLevelLabel(story.riskVisualLevel)}`
                  : `Risk Level ${story.riskVisualLevel}`}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="space-y-4">
                <p className="font-mono text-xs tracking-[0.15em] uppercase text-ink/40 dark:text-frost/40">
                  {language === "id" ? "Risiko Tersembunyi" : "Unseen Risk"}
                </p>
                <p className="font-fraunces text-2xl font-light text-ink dark:text-frost leading-relaxed italic">
                  "{unseenRiskLabel(story.unseenRisk)}"
                </p>
              </div>
              <div className="space-y-4 md:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink/40 dark:text-frost/40 mb-3">
                      {language === "id"
                        ? "Dampak Kontekstual"
                        : "Contextual Impact"}
                    </p>
                    <p className="text-[15px] text-ink/70 dark:text-frost/70 leading-relaxed font-normal">
                      {impactSummaryLabel(story.impactSummary)}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink/40 dark:text-frost/40 mb-3">
                      {language === "id" ? "Rekomendasi" : "Recommendation"}
                    </p>
                    <p className="text-[15px] text-ink/70 dark:text-frost/70 leading-relaxed font-normal">
                      {recommendationLabel(story.recommendation)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-8 font-sans text-[15px] text-ink/70 dark:text-frost/70">
              {storyHeadlineLabel(story.headline)}
            </p>
          </div>
        </section>
      )}

      {/* Scene 4: Risk Drivers + Levers */}
      <section className="mx-8 sm:mx-12 bg-white/40 dark:bg-white/2 backdrop-blur-xl rounded-3xl border border-ink/5 dark:border-frost/5 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ink/5 dark:divide-frost/5">
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
                {language === "id" ? "Pemicu Utama" : "Primary Stressors"}
              </h3>
            </div>
            <div className="space-y-4">
              {data.topRiskDrivers.length === 0 && (
                <p className="text-[15px] text-ink/40 dark:text-frost/40 italic">
                  {language === "id"
                    ? "Tidak ada pemicu mayor terdeteksi."
                    : "No major stressors found."}
                </p>
              )}
              {data.topRiskDrivers.map((d, i) => (
                <div
                  key={i}
                  className="px-6 py-5 rounded-2xl text-[15px] text-ink/70 dark:text-frost/70 leading-relaxed bg-white/50 dark:bg-white/3 border border-ink/5 dark:border-frost/5 shadow-sm"
                >
                  {i === 0 && (
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-scarlet dark:text-scarlet-bright mb-2 font-bold">
                      {language === "id" ? "PEMICU KRITIS" : "CRITICAL DRIVER"}
                    </p>
                  )}
                      {riskDriverLabel(d)}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-steel-bright/10 flex items-center justify-center">
                <CheckCircle2
                  size={14}
                  className="text-steel-bright"
                  strokeWidth={2}
                />
              </div>
              <h3 className="font-fraunces text-2xl font-light text-ink dark:text-frost">
                {language === "id" ? "Tuas Strategis" : "Strategic Levers"}
              </h3>
            </div>
            <div className="space-y-6">
              {data.mitigationSuggestions.length === 0 && (
                <p className="text-[15px] text-ink/40 dark:text-frost/40 italic">
                  {language === "id"
                    ? "Belum ada intervensi mendesak yang diperlukan."
                    : "No immediate interventions required."}
                </p>
              )}
              {data.mitigationSuggestions.map((s, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2 bg-steel-bright opacity-80" />
                  <p className="text-[15px] text-ink/70 dark:text-frost/70 leading-relaxed font-normal">
                    {mitigationLabel(s)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

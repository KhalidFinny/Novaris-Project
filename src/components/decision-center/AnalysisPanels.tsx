import React, { useState } from "react";
import type {
  AnalysisData,
  ScenarioSliders,
  ScenarioSnapshot,
} from "../../types/decisionCenter";
import { useLocale } from "../../hooks/useLocale";
import { Info, Lightbulb, AlertTriangle, CheckCircle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

interface AnalysisPanelsProps {
  data: AnalysisData;
  scenarioInputs?: ScenarioSliders;
  onUpdateScenario?: (values: Partial<ScenarioSliders>) => void;
  snapshots?: ScenarioSnapshot[];
  onSaveSnapshot?: () => void;
  onLoadSnapshot?: (snapshotId: string) => void;
  onDeleteSnapshot?: (snapshotId: string) => void;
  isCalculating: boolean;
}

export function AnalysisPanels({ 
  data, 
  scenarioInputs = { cashInjection: 0, projectAccelerationWeeks: 0, overheadReduction: 0, earlyARCollectionRate: 0, newRevenue30d: 0 }, 
  onUpdateScenario = () => {},
  snapshots = [],
  onSaveSnapshot = () => {},
  onLoadSnapshot = () => {},
  onDeleteSnapshot = () => {},
  isCalculating 
}: AnalysisPanelsProps) {
  const { language, formatCurrency } = useLocale();
  const isId = language === "id";
  const [expandedScore, setExpandedScore] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-scarlet';
    if (score >= 40) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-scarlet/10';
    if (score >= 40) return 'bg-amber-500/10';
    return 'bg-emerald-500/10';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return isId ? "Kritis" : "Critical";
    if (score >= 40) return isId ? "Waspada" : "Caution";
    return isId ? "Baik" : "Good";
  };

  const getScenarioImpact = (field: string, value: number) => {
    if (value === 0) return null;
    const isPositive = field === 'cashInjection' || field === 'overheadReduction' || field === 'earlyARCollectionRate' || field === 'newRevenue30d';
    return isPositive ? 'positive' : 'neutral';
  };

  // Generate suggestions based on scores
  const generateSuggestions = (category: string, score: number) => {
    if (category.includes("Cash")) {
      if (score >= 70) {
        return isId 
          ? "Runway sangat singkat. Segera cari dana tambahan atau kurangi biaya operasional drastis. Prioritas: kelangsungan hidup."
          : "Runway is very short. Find additional funding or drastically reduce operational costs immediately. Priority: survival.";
      } else if (score >= 40) {
        return isId
          ? "Runway menipis. Evaluasi pengeluaran yang bisa ditunda dan percepat koleksi piutang."
          : "Runway is thinning. Evaluate deferrable expenses and accelerate receivables collection.";
      } else {
        return isId
          ? "Posisi kas sehat. Pertahankan buffer minimal 3 bulan dan pertimbangkan investasi untuk pertumbuhan."
          : "Cash position is healthy. Maintain a minimum 3-month buffer and consider investing in growth.";
      }
    }
    if (category.includes("Revenue") || category.includes("Income")) {
      if (score >= 70) {
        return isId
          ? "Defisit pendapatan signifikan. Cari sumber pendapatan baru atau tingkatkan harga layanan."
          : "Significant revenue deficit. Find new revenue sources or increase service prices.";
      } else if (score >= 40) {
        return isId
          ? "Pendapatan hampir mencukupi. Fokus pada retensi klien dan upselling."
          : "Revenue is almost sufficient. Focus on client retention and upselling.";
      } else {
        return isId
          ? "Pendapatan melebihi target. Bagus! Pertimbangkan diversifikasi untuk mengurangi risiko."
          : "Revenue exceeds target. Great! Consider diversification to reduce risk.";
      }
    }
    if (category.includes("Client")) {
      if (score >= 70) {
        return isId
          ? "Ketergantungan ekstrem pada satu klien. Prioritas: cari 2-3 klien baru segera."
          : "Extreme dependency on one client. Priority: find 2-3 new clients immediately.";
      } else if (score >= 40) {
        return isId
          ? "Ketergantungan tinggi. Mulai pipeline untuk mengurangi risiko kehilangan klien utama."
          : "High dependency. Start pipeline to reduce risk of losing main client.";
      } else {
        return isId
          ? "Portofolio klien seimbang. Pertahankan diversifikasi ini."
          : "Client portfolio is balanced. Maintain this diversification.";
      }
    }
    if (category.includes("Delay")) {
      if (score >= 70) {
        return isId
          ? "Risiko delay sangat tinggi. Siapkan buffer kas ekstra atau renegosiasi timeline."
          : "Delay risk is very high. Prepare extra cash buffer or renegotiate timeline.";
      } else if (score >= 40) {
        return isId
          ? "Delay berpotensi terjadi. Monitor proyek ketat dan komunikasikan risiko ke klien."
          : "Delay is likely. Monitor project closely and communicate risk to client.";
      } else {
        return isId
          ? "Proyek on track. Pertahankan komunikasi reguler dengan tim."
          : "Project is on track. Maintain regular communication with team.";
      }
    }
    return isId ? "Pantau metrik ini secara berkala." : "Monitor this metric regularly.";
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h3 className="font-fraunces text-2xl font-light text-ink dark:text-frost mb-2">
          {isId ? "Analisis Detail" : "Detailed Analysis"}
        </h3>
        <p className="font-sans text-[14px] text-ink/60 dark:text-frost/60">
          {isId 
            ? "Pembahasan mendalam tentang skor risiko Anda dan rekomendasi tindakan."
            : "Deep dive into your risk scores and recommended actions."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Analysis */}
        <div className="space-y-4">
          <h4 className="font-sans text-[15px] font-medium text-ink dark:text-frost flex items-center gap-2">
            <Info size={16} className="text-ink/40" />
            {isId ? "Pembahasan Skor Risiko" : "Risk Score Breakdown"}
          </h4>

          {data.riskScores.length > 0 ? (
            data.riskScores.map((score) => {
              const isExpanded = expandedScore === score.category;
              
              return (
                <div 
                  key={score.category} 
                  className="rounded-xl border border-ink/[0.06] dark:border-frost/[0.06] overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedScore(isExpanded ? null : score.category)}
                    className="w-full p-4 text-left hover:bg-ink/[0.01] dark:hover:bg-frost/[0.01]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-[14px] text-ink dark:text-frost">
                        {score.category}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${getScoreBg(score.score)} ${getScoreColor(score.score)}`}>
                          {getScoreLabel(score.score)}
                        </span>
                        <span className={`font-fraunces text-2xl font-light ${getScoreColor(score.score)}`}>
                          {score.score.toFixed(0)}
                        </span>
                        {isExpanded ? <ChevronUp size={16} className="text-ink/30" /> : <ChevronDown size={16} className="text-ink/30" />}
                      </div>
                    </div>
                    
                    <div className="h-1.5 bg-ink/5 dark:bg-frost/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          score.score >= 70 ? 'bg-scarlet' : 
                          score.score >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${score.score}%` }}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-ink/[0.04] dark:border-frost/[0.04]">
                      <div className="pt-4 space-y-4">
                        {/* Analysis */}
                        <div>
                          <p className="font-sans text-[12px] font-medium text-ink/50 dark:text-frost/50 mb-2 flex items-center gap-1.5">
                            <AlertTriangle size={12} />
                            {isId ? "Analisis" : "Analysis"}
                          </p>
                          <p className="font-sans text-[13px] text-ink/80 dark:text-frost/80 leading-relaxed">
                            {score.trend === 'worsening' 
                              ? (isId 
                                ? `Skor ini menunjukkan peningkatan risiko. Trend memburuk memerlukan perhatian segera untuk mencegah krisis.`
                                : `This score shows increasing risk. The worsening trend requires immediate attention to prevent crisis.`)
                              : score.trend === 'improving'
                              ? (isId
                                ? `Skor menunjukkan perbaikan. Pertahankan momentum ini dengan terus memantau metrik terkait.`
                                : `Score shows improvement. Maintain this momentum by continuing to monitor related metrics.`)
                              : (isId
                                ? `Skor stabil saat ini. Pantau perubahan kecil yang bisa mengindikasikan pergeseran trend.`
                                : `Score is currently stable. Watch for small changes that might indicate trend shifts.`)
                            }
                          </p>
                        </div>

                        {/* Calculation */}
                        <div className="p-3 rounded-lg bg-ink/[0.02] dark:bg-frost/[0.02]">
                          <p className="font-sans text-[12px] font-medium text-ink/50 dark:text-frost/50 mb-2">
                            {isId ? "Perhitungan" : "Calculation"}
                          </p>
                          <p className="font-sans text-[13px] text-ink/70 dark:text-frost/70">
                            {score.category.includes("Cash") 
                              ? (isId 
                                ? `Runway yang diproyeksikan: ${data.scenarioOutput?.projectedRunway || '?'} hari (${data.scenarioOutput?.runwayDelta && data.scenarioOutput.runwayDelta > 0 ? '+' : ''}${data.scenarioOutput?.runwayDelta || 0} dari skenario).`
                                : `Projected runway: ${data.scenarioOutput?.projectedRunway || '?'} days (${data.scenarioOutput?.runwayDelta && data.scenarioOutput.runwayDelta > 0 ? '+' : ''}${data.scenarioOutput?.runwayDelta || 0} from scenario).`)
                              : score.category.includes("Revenue") || score.category.includes("Income")
                              ? (isId
                                ? `Selisih pendapatan vs target dikalikan faktor sensitivitas 2.2x.`
                                : `Revenue vs target gap multiplied by sensitivity factor of 2.2x.`)
                              : score.category.includes("Client")
                              ? (isId
                                ? `Persentase klien terbesar dikalikan faktor risiko konsentrasi 1.5x.`
                                : `Biggest client percentage multiplied by concentration risk factor of 1.5x.`)
                              : (isId
                                ? `Faktor komposit dari beberapa variabel operasional.`
                                : `Composite factor from multiple operational variables.`)
                            }
                          </p>
                        </div>

                        {/* Suggestions */}
                        <div className="flex gap-3">
                          <Lightbulb size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-sans text-[12px] font-medium text-ink/50 dark:text-frost/50 mb-1">
                              {isId ? "Rekomendasi" : "Recommendation"}
                            </p>
                            <p className="font-sans text-[13px] text-ink/80 dark:text-frost/80 leading-relaxed">
                              {generateSuggestions(score.category, score.score)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="font-sans text-[14px] text-ink/40 dark:text-frost/40 italic p-4">
              {isId ? "Submit data untuk melihat analisis." : "Submit data to see analysis."}
            </p>
          )}
        </div>

        {/* Scenario Builder */}
        <div>
          <h4 className="font-sans text-[15px] font-medium text-ink dark:text-frost flex items-center gap-2 mb-4">
            <Lightbulb size={16} className="text-ink/40" />
            {isId ? "Simulasi Skenario" : "Scenario Simulator"}
          </h4>

          <div className="space-y-5">
            <p className="font-sans text-[13px] text-ink/50 dark:text-frost/50">
              {isId 
                ? "Coba berbagai skenario untuk melihat dampaknya terhadap risiko bisnis Anda."
                : "Try different scenarios to see their impact on your business risk."
              }
            </p>

            {/* Cash Injection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-[13px] text-ink dark:text-frost">
                  {isId ? "Injeksi Kas" : "Cash Injection"}
                </span>
                <span className={`font-sans text-[13px] font-medium ${
                  getScenarioImpact('cashInjection', Number(scenarioInputs.cashInjection) || 0) === 'positive' 
                    ? 'text-emerald-600' 
                    : 'text-ink'
                }`}>
                  {formatCurrency(Number(scenarioInputs.cashInjection) || 0)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={Number(scenarioInputs.cashInjection) || 0}
                onChange={(e) => onUpdateScenario({ cashInjection: Number(e.target.value) })}
                className="w-full"
              />
              <p className="font-sans text-[11px] text-ink/40 mt-1">
                {isId ? "Dana masuk: investasi, pinjaman, pembayaran cepat" : "Incoming funds: investment, loan, early payment"}
              </p>
            </div>

            {/* Project Acceleration */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-[13px] text-ink dark:text-frost">
                  {isId ? "Akselerasi Proyek" : "Project Acceleration"}
                </span>
                <span className="font-sans text-[13px] font-medium text-ink">
                  {Number(scenarioInputs.projectAccelerationWeeks) || 0} {isId ? "minggu" : "weeks"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={Number(scenarioInputs.projectAccelerationWeeks) || 0}
                onChange={(e) => onUpdateScenario({ projectAccelerationWeeks: Number(e.target.value) })}
                className="w-full"
              />
              <p className="font-sans text-[11px] text-ink/40 mt-1">
                {isId ? "Percepat penyelesaian untuk pembayaran lebih awal" : "Speed up completion for earlier payment"}
              </p>
            </div>

            {/* Overhead Reduction */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-[13px] text-ink dark:text-frost">
                  {isId ? "Pengurangan Biaya/bulan" : "Cost Reduction/month"}
                </span>
                <span className={`font-sans text-[13px] font-medium ${
                  getScenarioImpact('overheadReduction', Number(scenarioInputs.overheadReduction) || 0) === 'positive' 
                    ? 'text-emerald-600' 
                    : 'text-ink'
                }`}>
                  {formatCurrency(Number(scenarioInputs.overheadReduction) || 0)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={Number(scenarioInputs.overheadReduction) || 0}
                onChange={(e) => onUpdateScenario({ overheadReduction: Number(e.target.value) })}
                className="w-full"
              />
              <p className="font-sans text-[11px] text-ink/40 mt-1">
                {isId ? "Kurangi pengeluaran operasional rutin" : "Reduce regular operational expenses"}
              </p>
            </div>

            {/* Impact Preview */}
            {data.scenarioOutput && (
              <div className="mt-6 p-4 rounded-xl border border-emerald-200/50 bg-emerald-50/30 dark:bg-emerald-900/10 dark:border-emerald-800/30">
                <p className="font-sans text-[12px] font-medium text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                  <ArrowRight size={14} />
                  {isId ? "Dampak Skenario" : "Scenario Impact"}
                </p>
                <p className="font-sans text-[14px] text-emerald-800 dark:text-emerald-300">
                  {data.scenarioOutput.narrativeSummary}
                </p>
              </div>
            )}

            {/* Save Button */}
            <button
              type="button"
              onClick={onSaveSnapshot}
              className="w-full py-2.5 rounded-lg border border-ink/10 font-sans text-[13px] text-ink/70 hover:bg-ink/[0.02] hover:border-ink/20 dark:border-frost/10 dark:text-frost/70 dark:hover:bg-frost/[0.02] dark:hover:border-frost/20"
            >
              {isId ? "Simpan skenario ini" : "Save this scenario"}
            </button>

            {/* Snapshots */}
            {snapshots.length > 0 && (
              <div className="pt-4 border-t border-ink/[0.04] dark:border-frost/[0.04]">
                <p className="font-sans text-[12px] text-ink/40 dark:text-frost/40 mb-3">
                  {isId ? "Skenario tersimpan" : "Saved scenarios"} ({snapshots.length})
                </p>
                <div className="space-y-2">
                  {snapshots.map((snapshot) => (
                    <div
                      key={snapshot.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-ink/[0.04] dark:border-frost/[0.04]"
                    >
                      <div>
                        <p className="font-sans text-[13px] text-ink dark:text-frost">
                          {snapshot.label}
                        </p>
                        <p className="font-sans text-[11px] text-ink/40">
                          {new Date(snapshot.createdAt).toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
                            month: "short",
                            day: "numeric"
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onLoadSnapshot(snapshot.id)}
                          className="px-3 py-1 rounded font-sans text-[12px] text-steel hover:bg-steel/5"
                        >
                          {isId ? "Muat" : "Load"}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteSnapshot(snapshot.id)}
                          className="px-3 py-1 rounded font-sans text-[12px] text-scarlet/70 hover:bg-scarlet/5"
                        >
                          {isId ? "Hapus" : "Del"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

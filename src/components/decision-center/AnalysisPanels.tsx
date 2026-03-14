import React, { useState } from "react";
import type {
  AnalysisData,
  ScenarioSliders,
  ScenarioSnapshot,
} from "../../types/decisionCenter";
import { useLocale } from "../../hooks/useLocale";
import { Info, Lightbulb, AlertTriangle, CheckCircle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { getScoreColor, getScoreBg, getScoreLabel, getScoreBarClass } from "../../lib/decision-center/utils";
import { buildAnalysisText, buildCalculationText, generateSuggestions } from "../../lib/decision-center/analysisUtils";

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

function InfoChip({ label, help }: { label: string; help: string }) {
  return (
    <span className="group relative inline-flex items-center gap-1.5 cursor-help">
      <span>{label}</span>
      <Info size={12} className="text-ink/30 dark:text-frost/36" />
      <span className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-72 rounded-xl border border-ink/6 bg-bone px-3 py-2 font-sans text-[12px] leading-relaxed text-ink/70 opacity-0 transition-opacity group-hover:opacity-100 dark:border-frost/10 dark:bg-charcoal-soft dark:text-frost/78">
        {help}
      </span>
    </span>
  );
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

  const getScenarioImpact = (field: string, value: number) => {
    if (value === 0) return null;
    const isPositive = field === 'cashInjection' || field === 'overheadReduction' || field === 'earlyARCollectionRate' || field === 'newRevenue30d';
    return isPositive ? 'positive' : 'neutral';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-fraunces text-[clamp(28px,3vw,40px)] font-light text-ink dark:text-frost mb-2 leading-[1.02] tracking-[-0.02em]">
          {isId ? "Analisis Detail" : "Detailed Analysis"}
        </h2>
        <p className="font-sans text-[14px] text-ink/66 dark:text-frost/72">
          {isId 
            ? "Pembahasan mendalam tentang skor risiko Anda dan rekomendasi tindakan."
            : "Deep dive into your risk scores and recommended actions."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Analysis */}
        <div className="space-y-4">
          <h3 className="font-sans text-[18px] font-medium text-ink dark:text-frost flex items-center gap-2">
            <Info size={16} className="text-ink/52 dark:text-frost/62" />
            {isId ? "Pembahasan Skor Risiko" : "Risk Score Breakdown"}
          </h3>

          {data.riskScores.length > 0 ? (
            data.riskScores.map((score) => {
              const isExpanded = expandedScore === score.category;
              
              return (
                <div 
                  key={score.category} 
                  className="rounded-xl border border-ink/6 dark:border-frost/6 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedScore(isExpanded ? null : score.category)}
                    className="w-full p-4 text-left hover:bg-ink/1 dark:hover:bg-frost/1"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-[14px] text-ink dark:text-frost">
                        <InfoChip 
                          label={score.category} 
                          help={
                            score.category.toLowerCase().includes("overall") 
                              ? (isId ? "Gabungan semua risiko utama bisnis Anda." : "A weighted blend of all your primary business risks.")
                              : score.category.toLowerCase().includes("cash")
                                ? (isId ? "Seberapa tahan posisi uang Anda terhadap guncangan mendadak." : "How resilient your cash position is against sudden shocks.")
                                : score.category.toLowerCase().includes("revenue") || score.category.toLowerCase().includes("market")
                                  ? (isId ? "Stabilitas pemasukan Anda terhadap target atau operasional." : "The stability of your income against targets or operations.")
                                  : score.category.toLowerCase().includes("client")
                                    ? (isId ? "Tingkat risiko dari ketergantungan pada klien tertentu." : "Risk level stemming from dependency on specific clients.")
                                    : (isId ? "Risiko dari jadwal yang bergeser dan pembayaran tertahan." : "Risk from shifting schedules and withheld payments.")
                          }
                        />
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${getScoreBg(score.score)} ${getScoreColor(score.score)}`}>
                          {getScoreLabel(score.score, isId)}
                        </span>
                        <span className={`font-fraunces text-2xl font-light ${getScoreColor(score.score)}`}>
                          {score.score.toFixed(0)}
                        </span>
                        {isExpanded ? <ChevronUp size={16} className="text-ink/46 dark:text-frost/56" /> : <ChevronDown size={16} className="text-ink/46 dark:text-frost/56" />}
                      </div>
                    </div>
                    
                    <div className="h-1.5 bg-ink/5 dark:bg-frost/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${getScoreBarClass(score.score)}`}
                          style={{ width: `${score.score}%` }}
                        />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-ink/4 dark:border-frost/4">
                      <div className="pt-4 space-y-4">
                        {/* Analysis */}
                        <div>
                          <p className="font-sans text-[12px] font-medium text-ink/58 dark:text-frost/66 mb-2 flex items-center gap-1.5">
                            <AlertTriangle size={12} />
                            {isId ? "Analisis" : "Analysis"}
                          </p>
                          <p className="font-sans text-[13px] text-ink/82 dark:text-frost/84 leading-relaxed">
                            {buildAnalysisText(score.category, score.score, score.trend, isId)}
                          </p>
                        </div>

                        {/* Calculation */}
                        <div className="p-3 rounded-lg bg-ink/2 dark:bg-charcoal-soft/70 border border-ink/4 dark:border-frost/8">
                          <p className="font-sans text-[12px] font-medium text-ink/58 dark:text-frost/66 mb-2">
                            {isId ? "Perhitungan" : "Calculation"}
                          </p>
                          <p className="font-sans text-[13px] text-ink/76 dark:text-frost/78 leading-relaxed">
                            {buildCalculationText(score.category, data.scenarioOutput, isId)}
                          </p>
                        </div>

                        {/* Suggestions */}
                        <div className="flex gap-3">
                          <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-sans text-[12px] font-medium text-ink/58 dark:text-frost/66 mb-1">
                              {isId ? "Rekomendasi" : "Recommendation"}
                            </p>
                            <p className="font-sans text-[13px] text-ink/80 dark:text-frost/80 leading-relaxed">
                              {generateSuggestions(score.category, score.score, isId)}
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
            <p className="font-sans text-[14px] text-ink/56 dark:text-frost/64 italic p-4">
              {isId ? "Submit data untuk melihat analisis." : "Submit data to see analysis."}
            </p>
          )}
        </div>

        {/* Scenario Builder */}
        <div>
          <h3 className="font-sans text-[18px] font-medium text-ink dark:text-frost flex items-center gap-2 mb-4">
            <Lightbulb size={16} className="text-ink/52 dark:text-frost/62" />
            {isId ? "Simulasi Skenario" : "Scenario Simulator"}
          </h3>

          <div className="space-y-5">
            <p className="font-sans text-[13px] text-ink/60 dark:text-frost/68">
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
              <p className="font-sans text-[11px] text-ink/52 dark:text-frost/60 mt-1">
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
              <p className="font-sans text-[11px] text-ink/52 dark:text-frost/60 mt-1">
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
              <p className="font-sans text-[11px] text-ink/52 dark:text-frost/60 mt-1">
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
              className="w-full py-2.5 rounded-lg border border-ink/10 font-sans text-[13px] text-ink/70 hover:bg-ink/2 hover:border-ink/20 dark:border-frost/10 dark:text-frost/70 dark:hover:bg-frost/2 dark:hover:border-frost/20"
            >
              {isId ? "Simpan skenario ini" : "Save this scenario"}
            </button>

            {/* Snapshots */}
            {snapshots.length > 0 && (
              <div className="pt-4 border-t border-ink/4 dark:border-frost/4">
                <p className="font-sans text-[12px] text-ink/52 dark:text-frost/60 mb-3">
                  {isId ? "Skenario tersimpan" : "Saved scenarios"} ({snapshots.length})
                </p>
                <div className="space-y-2">
                  {snapshots.map((snapshot) => (
                    <div
                      key={snapshot.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-ink/4 dark:border-frost/4"
                    >
                      <div>
                        <p className="font-sans text-[13px] text-ink dark:text-frost">
                          {snapshot.label}
                        </p>
                        <p className="font-sans text-[11px] text-ink/52 dark:text-frost/60">
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

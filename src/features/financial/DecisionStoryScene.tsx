import React from "react";
import { Eye, AlertTriangle, CheckCircle2 } from "lucide-react";
import { RISK_COLORS } from "./constants";
import type { DecisionStorySceneProps } from "./types";
import {
  getRiskDriverLabel,
  getStoryHeadlineLabel,
  getUnseenRiskLabel,
  getImpactSummaryLabel,
  getRecommendationLabel,
  getRiskLevelLabel,
  getMitigationLabel,
} from "./utils";

export function DecisionStoryScene({
  data,
  language = "en",
}: DecisionStorySceneProps) {
  const story = data.decisionStory;
  const storyColor = story ? RISK_COLORS[story.riskVisualLevel] : undefined;

  return (
    <div className="pb-12 space-y-8">
      {/* Scene 3: Decision Story */}
      {story && (
        <section className="mx-4 sm:mx-8 lg:mx-12 mt-12 px-6 py-8 sm:px-8 sm:py-10 bg-white/40 dark:bg-white/2 backdrop-blur-xl rounded-3xl border border-ink/5 dark:border-frost/5 shadow-sm relative overflow-hidden">
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
                  ? `Tingkat Risiko ${getRiskLevelLabel(story.riskVisualLevel, language)}`
                  : `Risk Level ${story.riskVisualLevel}`}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="space-y-4">
                <p className="font-mono text-xs tracking-[0.15em] uppercase text-ink/40 dark:text-frost/40">
                  {language === "id" ? "Risiko Tersembunyi" : "Unseen Risk"}
                </p>
                <p className="font-fraunces text-2xl font-light text-ink dark:text-frost leading-relaxed italic">
                  "{getUnseenRiskLabel(story.unseenRisk, language)}"
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
                      {getImpactSummaryLabel(story.impactSummary, language)}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink/40 dark:text-frost/40 mb-3">
                      {language === "id" ? "Rekomendasi" : "Recommendation"}
                    </p>
                    <p className="text-[15px] text-ink/70 dark:text-frost/70 leading-relaxed font-normal">
                      {getRecommendationLabel(story.recommendation, language)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-8 font-sans text-[15px] text-ink/70 dark:text-frost/70">
              {getStoryHeadlineLabel(story.headline, language)}
            </p>
          </div>
        </section>
      )}

      {/* Scene 4: Risk Drivers + Levers */}
      <section className="mx-4 sm:mx-8 lg:mx-12 bg-white/40 dark:bg-white/2 backdrop-blur-xl rounded-3xl border border-ink/5 dark:border-frost/5 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ink/5 dark:divide-frost/5">
          <div className="p-6 sm:p-8 md:p-10">
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
                      {getRiskDriverLabel(d, language)}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
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
                    {getMitigationLabel(s, language)}
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

import React from "react";
import type { RiskBridgePair } from "../../types/decisionCenter";
import { useLocale } from "../../hooks/useLocale";
import { TrendingUp, AlertTriangle } from "lucide-react";

interface RiskBridgeProps {
  pairs: RiskBridgePair[];
}

export function RiskBridge({ pairs }: RiskBridgeProps) {
  const { language } = useLocale();
  const isId = language === "id";

  if (pairs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h3 className="font-fraunces text-2xl font-light text-ink dark:text-frost mb-3">
          {isId ? "Alur Risiko" : "Risk Flow"}
        </h3>
        <p className="font-sans text-[14px] text-ink/50">
          {isId 
            ? "Data akan muncul setelah analisis lengkap."
            : "Data will appear after analysis is complete."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h3 className="font-fraunces text-2xl font-light text-ink dark:text-frost">
          {isId ? "Alur Risiko" : "Risk Flow"}
        </h3>
        <p className="font-sans text-[14px] text-ink/50 mt-2">
          {isId 
            ? `${pairs.length} hubungan sebab-akibat teridentifikasi`
            : `${pairs.length} cause-and-effect relationships identified`
          }
        </p>
      </div>

      {/* Flow Items */}
      <div className="space-y-6">
        {pairs.map((pair, index) => (
          <div key={pair.id} className="relative">
            {/* Connecting Line */}
            {index < pairs.length - 1 && (
              <div className="absolute left-6 top-14 bottom-[-24px] w-px bg-ink/10 dark:bg-frost/10" />
            )}

            <div className="flex gap-4">
              {/* Left - Number & Type */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  pair.triggerType === 'finance'
                    ? 'bg-scarlet/10'
                    : 'bg-amber-500/10'
                }`}>
                  {pair.triggerType === 'finance' ? (
                    <TrendingUp size={20} className="text-scarlet" />
                  ) : (
                    <AlertTriangle size={20} className="text-amber-600" />
                  )}
                </div>
                <span className="font-sans text-[11px] text-ink/30 mt-2">
                  {index + 1}
                </span>
              </div>

              {/* Right - Content */}
              <div className="flex-1 pb-6">
                {/* Trigger */}
                <div className="mb-3">
                  <div className="flex items-baseline gap-3">
                    <span className={`font-sans text-[12px] font-medium ${
                      pair.triggerType === 'finance'
                        ? 'text-scarlet'
                        : 'text-amber-600'
                    }`}>
                      {pair.triggerType === 'finance'
                        ? (isId ? "Finansial" : "Financial")
                        : (isId ? "Operasional" : "Operations")
                      }
                    </span>
                    <span className="font-sans text-[14px] text-ink/60">
                      {pair.triggerCondition}
                    </span>
                  </div>
                  
                  <p className={`font-fraunces text-3xl mt-1 ${
                    pair.triggerType === 'finance'
                      ? 'text-scarlet'
                      : 'text-amber-600'
                  }`}>
                    {pair.triggerValue}
                  </p>
                </div>

                {/* Arrow Down */}
                <div className="flex items-center gap-2 my-3">
                  <div className="h-px flex-1 bg-ink/10 dark:bg-frost/10" />
                  <span className="font-sans text-[11px] text-ink/30">
                    {isId ? "menyebabkan" : "leads to"}
                  </span>
                  <div className="h-px flex-1 bg-ink/10 dark:bg-frost/10" />
                </div>

                {/* Effect */}
                <div className="pl-4 border-l-2 border-steel/20">
                  <p className="font-sans text-[15px] text-ink dark:text-frost">
                    {pair.effect}
                  </p>
                  <p className="font-sans text-[13px] text-ink/50 mt-1 leading-relaxed">
                    {pair.effectDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

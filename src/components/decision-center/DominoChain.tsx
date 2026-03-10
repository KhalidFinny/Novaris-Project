import React from "react";
import type { DominoChain } from "../../types/decisionCenter";
import { useLocale } from "../../hooks/useLocale";
import { AlertTriangle, AlertCircle, TrendingDown, CheckCircle } from "lucide-react";

interface DominoChainProps {
  chain: DominoChain | null;
  isCalculating: boolean;
}

const NODE_ICONS = {
  scarlet: AlertTriangle,
  amber: AlertCircle,
  steel: TrendingDown,
  neutral: CheckCircle,
};

export function DominoChain({ chain, isCalculating }: DominoChainProps) {
  const { language } = useLocale();
  const isId = language === "id";

  if (isCalculating) {
    return (
      <div className="max-w-6xl mx-auto py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-ink/5 dark:bg-frost/5 rounded w-1/3 mb-12" />
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 h-40 bg-ink/5 dark:bg-frost/5 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!chain || chain.nodes.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <h3 className="font-fraunces text-2xl font-light text-ink dark:text-frost mb-4">
            {isId ? "Rantai Domino" : "Domino Chain"}
          </h3>
          <p className="font-sans text-ink/60 dark:text-frost/60">
            {isId 
              ? "Data kas dan proyek diperlukan untuk melihat kaskade risiko."
              : "Cash and project data required to see risk cascade."
            }
          </p>
        </div>
      </div>
    );
  }

  const colorStyles = {
    scarlet: {
      bg: 'bg-scarlet/[0.03]',
      border: 'border-scarlet/15',
      text: 'text-scarlet',
      icon: 'text-scarlet/60',
      line: 'bg-scarlet/20',
    },
    amber: {
      bg: 'bg-amber-500/[0.03]',
      border: 'border-amber-500/15',
      text: 'text-amber-600',
      icon: 'text-amber-500/60',
      line: 'bg-amber-500/20',
    },
    steel: {
      bg: 'bg-steel/[0.03]',
      border: 'border-steel/15',
      text: 'text-steel',
      icon: 'text-steel/60',
      line: 'bg-steel/20',
    },
    neutral: {
      bg: 'bg-ink/[0.02] dark:bg-frost/[0.02]',
      border: 'border-ink/8 dark:border-frost/8',
      text: 'text-ink/60 dark:text-frost/60',
      icon: 'text-ink/30 dark:text-frost/30',
      line: 'bg-ink/10 dark:bg-frost/10',
    },
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <h3 className="font-fraunces text-2xl font-light text-ink dark:text-frost mb-3">
              {isId ? "Rantai Domino" : "Domino Chain"}
            </h3>
            <p className="font-sans text-[14px] text-ink/60 dark:text-frost/60 max-w-xl leading-relaxed">
              {isId 
                ? "Kaskade konsekuensi yang dapat terjadi. Setiap domino mempengaruhi yang berikutnya secara berurutan."
                : "Cascade of consequences that can occur. Each domino affects the next in sequence."
              }
            </p>
          </div>
          
          <div className="px-6 py-4 rounded-xl bg-scarlet/[0.03] border border-scarlet/10">
            <p className="font-sans text-[11px] text-ink/40 dark:text-frost/40 mb-1">
              {isId ? "Probabilitas kaskade" : "Cascade probability"}
            </p>
            <p className="font-fraunces text-3xl font-light text-scarlet">
              {chain.probability}%
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Domino Flow */}
      <div className="relative">
        <div className="flex items-stretch gap-2 overflow-x-auto pb-4">
          {chain.nodes.map((node, index) => {
            const styles = colorStyles[node.color];
            const Icon = NODE_ICONS[node.color];
            const isLast = index === chain.nodes.length - 1;

            return (
              <React.Fragment key={node.step}>
                {/* Domino Card */}
                <div 
                  className={`flex-shrink-0 w-64 p-6 rounded-xl border ${styles.bg} ${styles.border} transition-colors hover:${styles.border.replace('/15', '/25')}`}
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${styles.icon}`}>
                      <Icon size={20} />
                    </div>
                    <span className={`font-sans text-[12px] font-medium ${styles.text}`}>
                      {isId ? `Langkah ${node.step}` : `Step ${node.step}`}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <h4 className={`font-sans text-[15px] font-medium mb-3 ${styles.text}`}>
                      {node.label}
                    </h4>
                    
                    <p className="font-sans text-[13px] text-ink/70 dark:text-frost/70 leading-relaxed">
                      {node.impact}
                    </p>
                  </div>

                  {/* Probability Badge */}
                  <div className="mt-4 pt-4 border-t border-ink/5 dark:border-frost/5">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[11px] text-ink/40">
                        {isId ? "Probabilitas" : "Probability"}
                      </span>
                      <span className={`font-sans text-[13px] font-medium ${styles.text}`}>
                        {Math.round((chain.probability / chain.nodes.length) * (index + 1))}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="flex-shrink-0 w-8 flex items-center justify-center">
                    <div className={`w-full h-px ${styles.line}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Scroll Indicator */}
        {chain.nodes.length > 4 && (
          <div className="mt-4 text-center">
            <p className="font-sans text-[11px] text-ink/30 dark:text-frost/30">
              {isId ? "Geser untuk melihat semua langkah →" : "Scroll to see all steps →"}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-[12px]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-scarlet/60" />
          <span className="text-ink/50 dark:text-frost/50">{isId ? "Kritis" : "Critical"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500/60" />
          <span className="text-ink/50 dark:text-frost/50">{isId ? "Peringatan" : "Warning"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-steel/60" />
          <span className="text-ink/50 dark:text-frost/50">{isId ? "Trend" : "Trend"}</span>
        </div>
      </div>
    </div>
  );
}

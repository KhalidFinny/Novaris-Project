import React from "react";
import type { DominoChain, RiskBridgePair } from "../../types/decisionCenter";
import { useLocale } from "../../hooks/useLocale";
import { Info } from "lucide-react";

function InfoChip({ label, help }: { label: string; help: string }) {
  return (
    <span className="group relative inline-flex items-center gap-1.5">
      <span>{label}</span>
      <Info size={12} className="text-ink/30 dark:text-frost/36" />
      <span className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-72 rounded-xl border border-ink/6 bg-bone px-3 py-2 font-sans text-[12px] leading-relaxed text-ink/70 opacity-0 transition-opacity group-hover:opacity-100 dark:border-frost/10 dark:bg-charcoal-soft dark:text-frost/78">
        {help}
      </span>
    </span>
  );
}

interface RiskSpreadProps {
  pairs: RiskBridgePair[];
  chain: DominoChain | null;
  isCalculating: boolean;
}

export function RiskSpread({ pairs, chain, isCalculating }: RiskSpreadProps) {
  const { language } = useLocale();
  const isId = language === "id";

  if (isCalculating) {
    return (
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="h-8 w-48 rounded bg-ink/5 dark:bg-charcoal-soft/80 mb-4" />
        <div className="h-5 w-96 rounded bg-ink/5 dark:bg-charcoal-soft/80 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr_0.9fr] gap-6">
          <div className="h-56 rounded-xl border border-ink/4 dark:border-frost/8 bg-ink/2 dark:bg-charcoal-soft/70" />
          <div className="h-56 rounded-xl border border-ink/4 dark:border-frost/8 bg-ink/2 dark:bg-charcoal-soft/70" />
          <div className="h-56 rounded-xl border border-ink/4 dark:border-frost/8 bg-ink/2 dark:bg-charcoal-soft/70" />
        </div>
      </div>
    );
  }

  const leadPair = pairs[0] ?? null;
  const spreadNodes = chain?.nodes ?? [];

  if (!leadPair && spreadNodes.length === 0) {
    return (
      <div className="max-w-6xl mx-auto rounded-xl border border-ink/4 dark:border-frost/8 bg-bone/50 dark:bg-charcoal/45 px-8 py-16 text-center">
        <h2 className="font-fraunces text-2xl font-light text-ink dark:text-frost mb-4">
          {isId ? "Bagaimana masalah menyebar" : "How this problem spreads"}
        </h2>
        <p className="max-w-2xl mx-auto font-sans text-[15px] leading-relaxed text-ink/62 dark:text-frost/68">
          {isId
            ? "Untuk input saat ini, tidak ada rantai sebab-akibat yang cukup kuat untuk dibuka lebih jauh. Bagian ini belum dibutuhkan."
            : "For the current inputs, there is no strong cause-and-effect chain that needs unpacking further. This section is not needed yet."}
        </p>
      </div>
    );
  }

  const impactNode = spreadNodes[spreadNodes.length - 1] ?? null;
  const middleNodes = spreadNodes.slice(0, Math.max(0, spreadNodes.length - 1));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 max-w-3xl">
        <h2 className="font-fraunces text-3xl font-light text-ink dark:text-frost mb-3">
          {isId ? "Bagaimana masalah ini menyebar" : "How this problem spreads"}
        </h2>
        <p className="font-sans text-[15px] leading-relaxed text-ink/64 dark:text-frost/70">
          {isId
            ? "Alih-alih banyak panel terpisah, bagian ini menunjukkan satu jalur utama: pemicu, bagaimana tekanan menyebar, lalu ke mana dampaknya mendarat."
            : "Instead of multiple separate panels, this section shows one main path: the trigger, how pressure spreads, and where the impact lands."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.1fr_0.95fr] gap-6 items-start">
        <div className="rounded-xl border border-ink/5 dark:border-frost/8 bg-bone/60 dark:bg-charcoal/50 px-6 py-6">
          <p className="font-sans text-[12px] tracking-[0.18em] uppercase text-scarlet dark:text-scarlet-bright">
            <InfoChip 
              label={isId ? "Pemicu utama" : "Main trigger"} 
              help={isId ? "Kondisi finansial atau operasional yang mengaktifkan rantai risiko ini." : "The financial or operational condition that activated this risk chain."} 
            />
          </p>
          {leadPair ? (
            <>
              <p className="mt-5 font-sans text-[14px] text-ink/62 dark:text-frost/68">
                {leadPair.triggerCondition}
              </p>
              <p className="mt-2 font-fraunces text-[44px] leading-none text-ink dark:text-frost">
                {leadPair.triggerValue}
              </p>
              <p className="mt-4 font-sans text-[14px] leading-relaxed text-ink/72 dark:text-frost/76">
                {leadPair.effectDescription}
              </p>
            </>
          ) : (
            <p className="mt-5 font-sans text-[14px] leading-relaxed text-ink/62 dark:text-frost/68">
              {isId
                ? "Sistem belum melihat pemicu tunggal yang dominan."
                : "The system does not see one dominant trigger yet."}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-ink/5 dark:border-frost/8 bg-bone/60 dark:bg-charcoal/50 px-6 py-6">
          <p className="font-sans text-[12px] tracking-[0.18em] uppercase text-ink/58 dark:text-frost/66">
            <InfoChip 
              label={isId ? "Jalur penyebaran" : "Spread path"} 
              help={isId ? "Bagaimana satu masalah (seperti kas tipis atau delay) mulai merembet ke area lain." : "How a single issue (like thin cash or delay) starts affecting other areas."} 
            />
          </p>
          <div className="mt-5 space-y-4">
            {middleNodes.length > 0 ? (
              middleNodes.map((node: DominoChain["nodes"][number], index: number) => (
                <div key={`${node.step}-${node.label}`} className="grid grid-cols-[28px_1fr] gap-4 items-start">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/8 text-[11px] font-medium text-ink/58 dark:border-frost/10 dark:text-frost/64">
                    {index + 1}
                  </div>
                  <div className="pt-0.5">
                    <p className="font-sans text-[15px] text-ink dark:text-frost">
                      {node.label}
                    </p>
                    <p className="mt-1 font-sans text-[13px] leading-relaxed text-ink/62 dark:text-frost/68">
                      {node.impact}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="font-sans text-[14px] leading-relaxed text-ink/62 dark:text-frost/68">
                {isId
                  ? "Tekanan belum menyebar jauh. Masalah utamanya masih cukup terlokalisasi."
                  : "The pressure has not spread far yet. The problem is still fairly contained."}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-ink/5 dark:border-frost/8 bg-bone/60 dark:bg-charcoal/50 px-6 py-6">
          <p className="font-sans text-[12px] tracking-[0.18em] uppercase text-steel dark:text-steel-bright">
            <InfoChip 
              label={isId ? "Dampak bisnis" : "Business impact"} 
              help={isId ? "Hasil akhir atau risiko strategis jika rantai dominonya tidak segera diputus." : "The final outcome or strategic risk if the domino chain is not interrupted."} 
            />
          </p>
          {impactNode ? (
            <>
              <p className="mt-5 font-fraunces text-[34px] leading-[1.02] text-ink dark:text-frost">
                {impactNode.label}
              </p>
              <p className="mt-4 font-sans text-[14px] leading-relaxed text-ink/72 dark:text-frost/76">
                {impactNode.impact}
              </p>
              {chain ? (
                <p className="mt-5 font-sans text-[13px] text-ink/56 dark:text-frost/64">
                  {isId
                    ? `Jalur ini punya probabilitas sekitar ${chain.probability}% jika tidak ada intervensi.`
                    : `This path carries roughly a ${chain.probability}% probability if nothing interrupts it.`}
                </p>
              ) : null}
            </>
          ) : (
            <p className="mt-5 font-sans text-[14px] leading-relaxed text-ink/62 dark:text-frost/68">
              {isId
                ? "Dampak akhirnya belum cukup jelas untuk diprioritaskan."
                : "The end impact is not strong enough yet to prioritise."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

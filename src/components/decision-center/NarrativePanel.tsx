import React, { useEffect, useRef } from "react";
import type { AllInputs, DecisionNarrative } from "../../types/decisionCenter";
import { useLocale } from "../../hooks/useLocale";
import { Info } from "lucide-react";
import { gsap } from "gsap";

interface NarrativePanelProps {
  data: DecisionNarrative | null;
  isCalculating: boolean;
  inputs: AllInputs;
  onApplyScenario: (scenarioId: string) => void;
}

const RISK_COLORS = {
  low: "#15803d",
  medium: "#d97706",
  high: "#cc1f2e",
  critical: "#a41624",
};

export function NarrativePanel({
  data,
  isCalculating,
  inputs,
  onApplyScenario,
}: NarrativePanelProps) {
  const { language } = useLocale();
  const isId = language === "id";
  const contentRef = useRef<HTMLDivElement>(null);
  const previousDataRef = useRef<DecisionNarrative | null>(null);

  useEffect(() => {
    if (!data || !contentRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    if (previousDataRef.current?.templateId !== data.templateId) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0.6, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
    }

    previousDataRef.current = data;
  }, [data]);

  const InfoLabel = ({
    label,
    help,
    accent = "default",
  }: {
    label: string;
    help: string;
    accent?: "default" | "steel";
  }) => (
    <span
      className={`group relative inline-flex items-center gap-2 ${accent === "steel" ? "text-steel dark:text-steel-bright" : "text-ink/35 dark:text-frost/35"}`}
    >
      <span>{label}</span>
      <Info size={12} className="opacity-70" />
      <span className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-ink/[0.06] bg-bone px-3 py-2 font-sans text-[12px] leading-relaxed text-ink/70 opacity-0 transition-opacity group-hover:opacity-100 dark:border-frost/[0.08] dark:bg-charcoal dark:text-frost/72">
        {help}
      </span>
    </span>
  );

  const scenarioChips = [
    {
      id: "late-client",
      label: isId ? "Klien besar telat bayar" : "Big client pays late",
      show: true,
    },
    {
      id: "delay-2-weeks",
      label: isId ? "Proyek telat 2 minggu" : "Project slips 2 weeks",
      show: Object.values(inputs.delayRisk).some((value) => value !== ""),
    },
    {
      id: "hire-one",
      label: isId ? "Tambah 1 orang" : "Hire one person",
      show: true,
    },
    {
      id: "costs-up",
      label: isId ? "Biaya naik 20%" : "Costs rise 20%",
      show: true,
    },
    {
      id: "reset",
      label: isId ? "Kembali ke kondisi sekarang" : "Reset to current",
      show: inputs.activeScenario !== null,
    },
  ].filter((item) => item.show);

  if (isCalculating) {
    return (
      <div className="w-full">
        <div className="py-20">
          <div className="w-10 h-10 border-2 border-scarlet/20 border-t-scarlet rounded-full animate-spin mb-6" />
          <p className="font-sans text-ink/60 dark:text-frost/60">
            {isId
              ? "Membaca kondisi bisnis Anda..."
              : "Reading your business situation..."}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full py-16">
        <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-scarlet dark:text-scarlet-bright mb-5">
          {isId ? "Mulai dari 4 angka" : "Start with 4 numbers"}
        </p>
        <h1 className="font-fraunces text-[clamp(42px,7vw,84px)] leading-[0.98] tracking-[-0.03em] text-ink dark:text-frost max-w-4xl">
          {isId
            ? "Masukkan angka utama Anda. Kami akan membantu menerjemahkannya menjadi keputusan."
            : "Enter your core numbers. We will help with making decisions."}
        </h1>
        <p className="mt-8 max-w-2xl font-sans text-[18px] leading-relaxed text-ink/60 dark:text-frost/60">
          {isId
            ? "Isi kas, tagihan bulanan, pendapatan bulanan, dan ketergantungan pada klien terbesar. Tambahkan detail proyek hanya jika Anda ingin membaca risiko delay juga."
            : "Fill in cash, monthly bills, monthly revenue, and biggest-client dependency. Add project details only if you want to read delay risk too."}
        </p>
      </div>
    );
  }

  const storyColor = RISK_COLORS[data.riskLevel];

  return (
    <div ref={contentRef} id="decision-story" className="w-full relative overflow-visible">
      <div
        className="absolute top-1/2 right-[-180px] -translate-y-1/2 w-[460px] h-[460px] pointer-events-none opacity-25"
        style={{
          background: `radial-gradient(circle at center, ${storyColor}, transparent 62%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 py-10">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-scarlet dark:text-scarlet-bright">
            {isId ? "Cerita keputusan" : "Decision story"}
          </p>
          <span className="h-px w-12 bg-ink/[0.08] dark:bg-frost/[0.08]" />
          <span className="font-sans text-[12px] text-ink/45 dark:text-frost/45">
            {isId
              ? `Risiko ${data.riskLevel} · Probabilitas ${data.probability}%`
              : `${data.riskLevel} risk · ${data.probability}% probability`}
          </span>
        </div>

        <h1 className="max-w-[min(92rem,82vw)] font-fraunces text-[clamp(46px,8vw,96px)] leading-[0.96] tracking-[-0.04em] text-ink dark:text-frost">
          {data.headline}
        </h1>

        <div className="mt-12 grid grid-cols-[28px_1fr] gap-5 max-w-[min(88rem,78vw)]">
          <div className="font-fraunces text-[48px] leading-[0.7] text-scarlet dark:text-scarlet-bright">
            "
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink/35 dark:text-frost/35 mb-3">
              {isId ? "Risiko yang belum terlihat" : "Unseen risk"}
            </p>
            <blockquote className="font-fraunces text-[clamp(24px,3vw,38px)] italic font-light leading-[1.35] tracking-[-0.02em] text-ink dark:text-frost">
              {data.unseenRisk}
            </blockquote>
          </div>
        </div>

        <div className="mt-12 border-t border-ink/[0.04] dark:border-frost/[0.04] pt-8 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[min(92rem,86vw)]">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-3">
              <InfoLabel
                label={isId ? "Apa artinya sekarang" : "What this means now"}
                help={
                  isId
                    ? "Bagian ini menjelaskan apa arti angka yang Anda kirim untuk kondisi bisnis Anda saat ini, tanpa saran tindakan dulu."
                    : "This explains what your submitted numbers mean for your business right now, before giving any action direction."
                }
              />
            </p>
            <p className="font-sans text-[16px] leading-relaxed text-ink/70 dark:text-frost/70">
              {data.contextualImpact}
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-3">
              <InfoLabel
                label={isId ? "Arah keputusan" : "Decision helper"}
                help={
                  isId
                    ? "Ini bukan keputusan otomatis. Ini adalah arah tindakan paling masuk akal berdasarkan angka yang Anda masukkan."
                    : "This is not an automatic decision. It is the most reasonable direction of action based on the numbers you entered."
                }
                accent="steel"
              />
            </p>
            <p className="font-sans text-[16px] leading-relaxed text-ink/70 dark:text-frost/70 pr-12">
              {data.recommendation}
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-ink/[0.04] dark:border-frost/[0.04] pt-6 max-w-[min(92rem,86vw)]">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink/35 dark:text-frost/35 mb-4">
            {isId ? "Uji skenario Anda" : "Test your scenario"}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {scenarioChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => onApplyScenario(chip.id)}
                className={`px-4 py-2 rounded-full border font-sans text-[13px] transition-colors ${
                  inputs.activeScenario === chip.id
                    ? "border-scarlet/30 bg-scarlet/7 text-scarlet dark:text-scarlet-bright"
                    : "border-ink/[0.06] dark:border-frost/[0.08] text-ink/68 dark:text-frost/68 hover:text-ink dark:hover:text-frost hover:border-ink/[0.12] dark:hover:border-frost/[0.14]"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
          <p className="mt-4 font-sans text-[13px] text-ink/45 dark:text-frost/45">
            {isId
              ? "Skenario di bawah cerita ini membantu Anda melihat keputusan mana yang paling relevan untuk kondisi Anda sekarang."
              : "These scenario chips keep the story focused on decisions you actually care about right now."}
          </p>
        </div>
      </div>
    </div>
  );
}

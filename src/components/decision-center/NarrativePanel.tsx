import React, { useEffect, useRef } from "react";
import type { AllInputs, DecisionNarrative } from "../../types/decisionCenter";
import { useLocale } from "../../hooks/useLocale";
import { Info } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

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

  useGSAP(() => {
    if (!data || !contentRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    if (previousDataRef.current?.templateId !== data.templateId) {
      // Find all elements we want to animate inside the content container using a shared class
      const elements = contentRef.current.querySelectorAll(".stagger-item");
      
      gsap.fromTo(
        elements,
        { opacity: 0, y: 12 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.08, 
          ease: "power2.out",
          clearProps: "all" 
        },
      );
    }

    previousDataRef.current = data;
  }, [data, contentRef]);

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
      className={`group relative inline-flex items-center gap-2 ${accent === "steel" ? "text-steel dark:text-steel-bright" : "text-ink/52 dark:text-frost/60"}`}
    >
      <span>{label}</span>
      <Info size={12} className="opacity-70" />
      <span className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-ink/6 bg-bone px-3 py-2 font-sans text-[12px] leading-relaxed text-ink/70 opacity-0 transition-opacity group-hover:opacity-100 dark:border-frost/8 dark:bg-charcoal dark:text-frost/72">
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
  const urgencySummary = isId
    ? data.riskLevel === "critical"
      ? "Ini perlu ditangani sekarang, bukan nanti."
      : data.riskLevel === "high"
        ? "Ini belum krisis, tapi arahnya sudah salah."
        : data.riskLevel === "medium"
          ? "Masalahnya masih bisa dibenahi tanpa langkah ekstrem."
          : "Posisinya cukup sehat, tetapi tetap perlu dijaga."
    : data.riskLevel === "critical"
      ? "This needs attention now, not later."
      : data.riskLevel === "high"
        ? "This is not a crisis yet, but it is moving the wrong way."
        : data.riskLevel === "medium"
          ? "The issue is still fixable without extreme moves."
          : "The position is fairly healthy, but it still needs guarding.";

  return (
    <div ref={contentRef} id="decision-story" className="w-full relative overflow-visible">
      <div
        className="absolute top-1/2 -right-timeline-col -translate-y-1/2 w-[460px] h-[460px] pointer-events-none opacity-25"
        style={{
          background: `radial-gradient(circle at center, ${storyColor}, transparent 62%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 py-10">
        <div className="flex flex-wrap items-center gap-4 mb-8 stagger-item">
          <p className="font-sans text-[12px] tracking-[0.18em] uppercase text-scarlet dark:text-scarlet-bright">
            {isId ? "Cerita keputusan" : "Decision story"}
          </p>
          <span className="h-px w-12 bg-ink/8 dark:bg-frost/8" />
          <span className="font-sans text-[12px] text-ink/56 dark:text-frost/64">
            {isId
              ? `Risiko ${data.riskLevel} · Probabilitas ${data.probability}%`
              : `${data.riskLevel} risk · ${data.probability}% probability`}
          </span>
        </div>

        <h1 className="max-w-full lg:max-w-5xl font-fraunces text-[clamp(46px,8vw,96px)] leading-[0.96] tracking-[-0.04em] text-ink dark:text-frost stagger-item">
          {data.headline}
        </h1>

        <p className="mt-6 max-w-3xl font-sans text-[18px] leading-relaxed text-ink/68 dark:text-frost/72 stagger-item">
          {isId
            ? "Ringkasnya: ini adalah pembacaan utama tentang apa yang paling menekan bisnis Anda sekarang dan langkah pertama yang paling masuk akal."
            : "In plain terms: this is the main read on what is putting the most pressure on your business right now and the first move that makes the most sense."}
        </p>

        <div className="mt-12 grid grid-cols-[28px_1fr] gap-5 max-w-full xl:max-w-5xl stagger-item">
          <div className="font-fraunces text-[48px] leading-[0.7] text-scarlet dark:text-scarlet-bright">
            "
          </div>
          <div>
            <p className="font-sans text-[12px] tracking-[0.16em] uppercase text-ink/58 dark:text-frost/66 mb-3">
              {isId ? "Yang paling menonjol" : "What stands out"}
            </p>
            <blockquote className="font-fraunces text-[clamp(24px,3vw,38px)] italic font-light leading-[1.35] tracking-[-0.02em] text-ink dark:text-frost">
              {data.unseenRisk}
            </blockquote>
          </div>
        </div>

        <div className="mt-12 border-t border-ink/4 dark:border-frost/8 pt-8 grid grid-cols-1 md:grid-cols-3 gap-8 w-full xl:max-w-6xl stagger-item">
          <div>
            <p className="font-sans text-[12px] tracking-[0.16em] uppercase text-ink/58 dark:text-frost/66 mb-3">
              {isId ? "Seberapa mendesak" : "How urgent it is"}
            </p>
            <p className="font-sans text-[16px] leading-relaxed text-ink/72 dark:text-frost/76">
              {urgencySummary}
            </p>
          </div>
          <div>
            <p className="font-sans text-[12px] tracking-[0.16em] uppercase mb-3 text-ink/58 dark:text-frost/66">
              <InfoLabel
                label={isId ? "Kenapa ini terjadi" : "Why this is happening"}
                help={
                  isId
                    ? "Bagian ini menjelaskan bagaimana angka yang Anda kirim berubah menjadi situasi bisnis saat ini."
                    : "This explains how your submitted numbers turn into the current business situation."
                }
              />
            </p>
            <p className="font-sans text-[16px] leading-relaxed text-ink/74 dark:text-frost/78">
              {data.contextualImpact}
            </p>
          </div>
          <div>
            <p className="font-sans text-[12px] tracking-[0.16em] uppercase mb-3 text-ink/58 dark:text-frost/66">
              <InfoLabel
                label={isId ? "Lakukan ini dulu" : "Do this first"}
                help={
                  isId
                    ? "Ini adalah tindakan awal yang paling masuk akal untuk meredakan tekanan utama lebih dulu."
                    : "This is the most sensible first move to relieve the main pressure first."
                }
                accent="steel"
              />
            </p>
            <p className="font-sans text-[16px] leading-relaxed text-ink/74 dark:text-frost/78 pr-12">
              {data.recommendation}
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-ink/4 dark:border-frost/8 pt-6 w-full xl:max-w-6xl stagger-item">
          <p className="font-sans text-[12px] tracking-[0.16em] uppercase text-ink/58 dark:text-frost/66 mb-4">
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
                    : "border-ink/6 dark:border-frost/8 text-ink/68 dark:text-frost/68 hover:text-ink dark:hover:text-frost hover:border-ink/12 dark:hover:border-frost/14"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
            <p className="mt-4 font-sans text-[13px] text-ink/56 dark:text-frost/64">
              {isId
                ? "Coba satu perubahan kecil di bawah ini untuk melihat apakah masalah utama mulai mereda."
                : "Try one change below to see whether the main problem starts easing."}
            </p>
        </div>
      </div>
    </div>
  );
}

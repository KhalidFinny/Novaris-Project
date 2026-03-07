import React, { useState, useEffect } from "react";
import { Nav } from "../components/layout/Nav";
import type { FinancialInput, FinancialOutput } from "../lib/engine/types";
import { SimLayout } from "../components/layout/SimLayout";
import { FinancialSidebar } from "../features/financial/FinancialSidebar";
import { StabilityScene } from "../features/financial/StabilityScene";
import { FanChartScene } from "../features/financial/FanChartScene";
import { DecisionStoryScene } from "../features/financial/DecisionStoryScene";
import { DEFAULT_FINANCIAL } from "../features/financial/constants";
import { TutorialOverlay } from "../components/ui/TutorialOverlay";
import { SlidersHorizontal, AlertTriangle, BookOpenText } from "lucide-react";
import { useLocale } from "../hooks/useLocale";
import { useSeo } from "../hooks/useSeo";
import logo3 from "../assets/logo/logo3.png";

const MONETARY_FIELDS: (keyof FinancialInput)[] = [
  "monthlyRevenue",
  "fixedCosts",
  "monthlyDebtObligations",
  "currentCashReserves",
  "emergencyBufferSize",
  "activeProjectDailyBurn",
  "opportunityCostPerDay",
  "penaltyAmount",
];

const toNumber = (value: unknown) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const normalizeFinancialInput = (form: FinancialInput): FinancialInput => ({
  monthlyRevenue: toNumber(form.monthlyRevenue),
  fixedCosts: toNumber(form.fixedCosts),
  variableCostPercentage: toNumber(form.variableCostPercentage),
  monthlyDebtObligations: toNumber(form.monthlyDebtObligations),
  seasonalityFactor: toNumber(form.seasonalityFactor),
  projectedGrowthRate: toNumber(form.projectedGrowthRate),
  currentCashReserves: toNumber(form.currentCashReserves),
  emergencyBufferSize: toNumber(form.emergencyBufferSize),
  activeProjectDelayDays: toNumber(form.activeProjectDelayDays),
  activeProjectDailyBurn: toNumber(form.activeProjectDailyBurn),
  confidenceLevel: 1,
  opportunityCostPerDay: toNumber(form.opportunityCostPerDay),
  penaltyThresholdDays: toNumber(form.penaltyThresholdDays),
  penaltyAmount: toNumber(form.penaltyAmount),
});

export default function Financial() {
  const { language, currency, convertAmount, formatCurrency, t } = useLocale();

  useSeo({
    title:
      language === "id"
        ? "Novaris | Simulasi Risiko Finansial"
        : "Novaris | Financial Risk Simulator",
    description:
      language === "id"
        ? "Uji ketahanan kas, runway, dan dampak delay untuk membantu owner bisnis mengambil keputusan finansial mingguan."
        : "Stress-test cash runway and delay impact to support weekly financial decisions for business owners.",
    path: "/financial",
    image: logo3,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name:
        language === "id"
          ? "Novaris Simulasi Risiko Finansial"
          : "Novaris Financial Risk Simulator",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://novaris.app/financial",
      description:
        language === "id"
          ? "Simulasi ketahanan kas, runway, dan dampak keterlambatan proyek untuk membantu keputusan finansial mingguan."
          : "Simulation of cash resilience, runway, and project-delay impact to support weekly financial decisions.",
    },
  });
  const [form, setForm] = useState<FinancialInput>(() => {
    if (currency === "USD") {
      return DEFAULT_FINANCIAL;
    }
    const converted = { ...DEFAULT_FINANCIAL };
    for (const key of MONETARY_FIELDS) {
      converted[key] = Number(
        convertAmount(Number(DEFAULT_FINANCIAL[key]), "USD", "IDR").toFixed(2),
      );
    }
    return converted;
  });
  const previousCurrency = React.useRef(currency);
  const [data, setData] = useState<FinancialOutput | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (previousCurrency.current === currency) {
      return;
    }
    const from = previousCurrency.current;
    const to = currency;
    setForm((prev) => {
      const next = { ...prev };
      for (const key of MONETARY_FIELDS) {
        next[key] = Number(convertAmount(Number(prev[key]), from, to).toFixed(2));
      }
      return next;
    });
    previousCurrency.current = currency;
  }, [currency, convertAmount]);

  const isReadyToSimulate =
    form.monthlyRevenue > 0 &&
    form.fixedCosts >= 0 &&
    form.currentCashReserves > 0 &&
    form.emergencyBufferSize >= 0;

  useEffect(() => {
    if (!isReadyToSimulate) {
      setData(null);
      setIsPending(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsPending(true);
      try {
        const payload: FinancialInput = {
          ...normalizeFinancialInput(form),
          confidenceLevel: 1,
        };
        const res = await fetch("/api/financial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error("Failed to run financial simulation");
        }
        const result = (await res.json()) as FinancialOutput;
        setData(result);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
          setData(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsPending(false);
        }
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [form, isReadyToSimulate]);

  // Animate survival probability counter on new result
  useEffect(() => {
    if (!data) return;
    const el = document.getElementById("fin-big-num");
    if (!el) return;
    let start = 0;
    const target = data.survivalProbability;
    const step = () => {
      start = Math.min(start + 3, target);
      el.textContent = start + "%";
      if (start < target) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [data]);

  const prob = data?.survivalProbability ?? 0;
  const survivalColor = !data
    ? "var(--color-ink-faint)"
    : prob > 70
      ? "var(--color-steel-bright)"
      : prob > 45
        ? "#eab308" // warn
        : "var(--color-scarlet)";

  const headline = data
    ? prob > 70
      ? language === "id"
        ? `Cadangan Anda kuat - bisnis mampu menahan ${data.resilienceShields === 3 ? "tiga" : data.resilienceShields === 2 ? "dua" : "satu"} guncangan bersamaan.`
        : `Your reserves are solid - the business can absorb ${data.resilienceShields === 3 ? "three" : data.resilienceShields === 2 ? "two" : "one"} simultaneous shock${data.resilienceShields !== 1 ? "s" : ""}.`
      : prob > 45
        ? language === "id"
          ? `Tekanan masih terkendali - kas bertahan ${data.cashRunwayMonths.toFixed(1)} bulan, tapi satu tuas utama perlu disesuaikan.`
          : `Manageable pressure - your cash holds for ${data.cashRunwayMonths.toFixed(1)} months, but one lever needs adjusting.`
        : language === "id"
          ? `Posisi kas perlu perhatian segera - runway saat ini ${data.cashRunwayMonths.toFixed(1)} bulan.`
          : `Cash position needs immediate attention - ${data.cashRunwayMonths.toFixed(1)} months of runway at current burn.`
    : null;

  const nextAction = !data
    ? t("sim.impact.pending")
    : prob > 70
      ? t("financial.weeklyAction.low")
      : prob > 45
        ? t("financial.weeklyAction.medium")
        : t("financial.weeklyAction.high");

  const impactBar = (
    <div className="grid grid-cols-4 gap-4">
      <div className="rounded-xl border border-ink/8 dark:border-frost/8 px-4 py-3 bg-white/55 dark:bg-white/[0.02]">
        <p className="font-sans text-[12px] text-ink/45 dark:text-frost/45 mb-1">
          {t("sim.impact.survival")}
        </p>
        <p className="font-sans text-lg text-ink dark:text-frost">{data?.survivalProbability ?? 0}%</p>
      </div>
      <div className="rounded-xl border border-ink/8 dark:border-frost/8 px-4 py-3 bg-white/55 dark:bg-white/[0.02]">
        <p className="font-sans text-[12px] text-ink/45 dark:text-frost/45 mb-1">
          {t("sim.impact.runway")}
        </p>
        <p className="font-sans text-lg text-ink dark:text-frost">
          {data?.cashRunwayMonths.toFixed(1) ?? "0.0"} {t("sim.unit.mo")}
        </p>
      </div>
      <div className="rounded-xl border border-ink/8 dark:border-frost/8 px-4 py-3 bg-white/55 dark:bg-white/[0.02]">
        <p className="font-sans text-[12px] text-ink/45 dark:text-frost/45 mb-1">
          {t("sim.impact.cashRisk")}
        </p>
        <p className="font-sans text-lg text-ink dark:text-frost">
          {data
            ? formatCurrency(
                Math.max(
                  0,
                  toNumber(form.emergencyBufferSize) - toNumber(form.currentCashReserves),
                ),
              )
            : formatCurrency(0)}
        </p>
      </div>
      <div className="rounded-xl border border-ink/8 dark:border-frost/8 px-4 py-3 bg-white/55 dark:bg-white/[0.02]">
        <p className="font-sans text-[12px] text-ink/45 dark:text-frost/45 mb-1">
          {t("sim.impact.action")}
        </p>
        <p className="font-sans text-[13px] text-ink/75 dark:text-frost/75 leading-snug">{nextAction}</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-arctic dark:bg-void transition-colors duration-520">
      <Nav />

      <TutorialOverlay
        storageKey="novaris_financial_tutorial"
        onComplete={() => {}}
        steps={[
          {
            targetId: "fin-sidebar-fields",
            title: language === "id" ? "Atur Runway Anda" : "Set Your Runway",
            description:
              language === "id"
                ? "Masukkan kondisi finansial aktual. Turunkan cadangan atau naikkan utang untuk melihat fragilitas meningkat secara non-linear."
                : "Input your actual financial reality. Lower reserves or increase debt to see fragility scale non-linearly.",
            icon: <SlidersHorizontal size={14} />,
          },
          {
            targetId: "fin-stability-scene",
            title: language === "id" ? "Cek Kondisi" : "Check Your Pulse",
            description:
              language === "id"
                ? "Ini bukan hanya soal bertahan satu bulan, tapi berapa banyak guncangan kritis yang bisa ditahan bersamaan."
                : "This is not just about surviving one month; it evaluates how many simultaneous shocks you can absorb.",
            icon: <AlertTriangle size={14} />,
          },
          {
            targetId: "fin-decision-story",
            title:
              language === "id" ? "Strategi Naratif" : "The Narrative Strategy",
            description:
              language === "id"
                ? "Lihat lebih dari grafik. Engine menyusun data Anda jadi narasi utuh agar keputusan bisnis lebih jelas."
                : "Look past charts. The engine synthesizes your data into a cohesive narrative for real business decisions.",
            icon: <BookOpenText size={14} />,
          },
        ]}
      />

      <SimLayout
        controls={
          <FinancialSidebar form={form} onFormChange={setForm} isPending={isPending} />
        }
        impactBar={impactBar}
        controlsCollapsible
        controlsDefaultOpen={false}
      >
        <div id="fin-stability-scene">
          <StabilityScene
            data={data || undefined}
            survivalColor={survivalColor}
            riskScore={data?.riskScore ?? 0}
            headline={headline}
            language={language}
          />
        </div>
        <FanChartScene
          data={data || undefined}
          isPending={isPending}
          emergencyBufferSize={form.emergencyBufferSize}
          formatCurrency={formatCurrency}
          language={language}
        />
        {data && (
          <div id="fin-decision-story">
            <DecisionStoryScene data={data} language={language} />
          </div>
        )}
      </SimLayout>
    </main>
  );
}

import React, { useState, useEffect } from "react";
import { Nav } from "../components/layout/Nav";
import type { DelayInput, DelayOutput } from "../lib/engine/types";
import { SimLayout } from "../components/layout/SimLayout";
import { DelaySidebar } from "../features/delay/DelaySidebar";
import { DelayProbabilityScene } from "../features/delay/DelayProbabilityScene";
import { PhaseChartScene } from "../features/delay/PhaseChartScene";
import { BottlenecksScene } from "../features/delay/BottlenecksScene";
import { DEFAULT_DELAY } from "../features/delay/constants";
import { TutorialOverlay } from "../components/ui/TutorialOverlay";
import { SlidersHorizontal, AlertTriangle, BookOpenText } from "lucide-react";
import { useLocale } from "../hooks/useLocale";
import { useSeo } from "../hooks/useSeo";
import logo3 from "../assets/logo/logo3.png";

const toNumber = (value: unknown) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const normalizeDelayInput = (form: DelayInput): DelayInput => ({
  targetDurationDays: toNumber(form.targetDurationDays),
  teamSize: toNumber(form.teamSize),
  complexityScore: Math.max(1, toNumber(form.complexityScore)),
  supplierLeadTimeVarianceDays: toNumber(form.supplierLeadTimeVarianceDays),
  externalDependenciesCount: toNumber(form.externalDependenciesCount),
  historicalDelayRate: toNumber(form.historicalDelayRate),
  bufferDaysRemaining: toNumber(form.bufferDaysRemaining),
  financialSensitivity: 0.5,
});

export default function Delay() {
  const { language, t } = useLocale();

  useSeo({
    title:
      language === "id"
        ? "Novaris | Simulasi Risiko Delay"
        : "Novaris | Delay Risk Simulator",
    description:
      language === "id"
        ? "Analisis bottleneck proyek, probabilitas delay, dan dampaknya agar owner bisnis bisa bertindak lebih awal."
        : "Analyze project bottlenecks, delay probability, and impact so business owners can act earlier.",
    path: "/delay",
    image: logo3,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name:
        language === "id"
          ? "Novaris Simulasi Risiko Delay"
          : "Novaris Delay Risk Simulator",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://novaris.app/delay",
      description:
        language === "id"
          ? "Simulasi probabilitas delay, bottleneck, dan rentang durasi untuk membantu keputusan operasional lebih cepat."
          : "Simulation of delay probability, bottlenecks, and duration range to support faster operational decisions.",
    },
  });
  const [form, setForm] = useState<DelayInput>(DEFAULT_DELAY);
  const [data, setData] = useState<DelayOutput | null>(null);
  const [isPending, setIsPending] = useState(false);

  const isReadyToSimulate = form.targetDurationDays > 0 && form.teamSize > 0;

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
        const payload: DelayInput = {
          ...normalizeDelayInput(form),
          financialSensitivity: 0.5,
        };
        const res = await fetch("/api/delay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error("Failed to run delay simulation");
        }
        const result = (await res.json()) as DelayOutput;
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

  // Animate delay probability counter on new result
  useEffect(() => {
    if (!data) return;
    const el = document.getElementById("delay-big-num");
    if (!el) return;
    let start = 0;
    const target = data.delayProbability;
    const step = () => {
      start = Math.min(start + 2, target);
      el.textContent = start + "%";
      if (start < target) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [data]);

  const prob = data?.delayProbability ?? 0;
  const delayTextColor = !data
    ? "var(--color-ink-faint)"
    : prob < 30
      ? "var(--color-steel-bright)"
      : prob < 65
        ? "#eab308" // warn
        : "var(--color-scarlet)";

  const range = data?.estimatedDelayDaysRange;
  const expected = data?.expectedDurationDays;
  const base = form.targetDurationDays;

  const headline = data
    ? language === "id"
      ? `Proyek ${base} hari Anda saat ini mengarah ke total ${expected} hari, dengan estimasi keterlambatan ${range?.[0]}-${range?.[1]} hari.`
      : `Your ${base}-day project is currently tracking towards ${expected} days total, an estimated delay of ${range?.[0]}-${range?.[1]} days.`
    : null;

  const nextAction = !data
    ? t("sim.impact.pending")
    : prob >= 65
      ? t("delay.weeklyAction.high")
      : prob >= 30
        ? t("delay.weeklyAction.medium")
        : t("delay.weeklyAction.low");

  const impactBar = (
    <div className="grid grid-cols-4 gap-4">
      <div className="rounded-xl border border-ink/8 dark:border-frost/8 px-4 py-3 bg-white/55 dark:bg-white/[0.02]">
        <p className="font-sans text-[12px] text-ink/45 dark:text-frost/45 mb-1">
          {t("sim.impact.delay")}
        </p>
        <p className="font-sans text-lg text-ink dark:text-frost">{data?.delayProbability ?? 0}%</p>
      </div>
      <div className="rounded-xl border border-ink/8 dark:border-frost/8 px-4 py-3 bg-white/55 dark:bg-white/[0.02]">
        <p className="font-sans text-[12px] text-ink/45 dark:text-frost/45 mb-1">
          {t("sim.impact.targetDuration")}
        </p>
        <p className="font-sans text-lg text-ink dark:text-frost">
          {form.targetDurationDays} {t("sim.unit.days")}
        </p>
      </div>
      <div className="rounded-xl border border-ink/8 dark:border-frost/8 px-4 py-3 bg-white/55 dark:bg-white/[0.02]">
        <p className="font-sans text-[12px] text-ink/45 dark:text-frost/45 mb-1">
          {t("sim.impact.potentialDelay")}
        </p>
        <p className="font-sans text-lg text-ink dark:text-frost">
          {data
            ? `${data.estimatedDelayDaysRange[0]}-${data.estimatedDelayDaysRange[1]} ${t("sim.unit.days")}`
            : `0 ${t("sim.unit.days")}`}
        </p>
      </div>
      <div className="rounded-xl border border-ink/8 dark:border-frost/8 px-4 py-3 bg-white/55 dark:bg-white/[0.02]">
        <p className="font-sans text-[12px] text-ink/45 dark:text-frost/45 mb-1">
          {t("sim.impact.monitoring")}
        </p>
        <p className="font-sans text-lg text-ink dark:text-frost">
          {data
            ? t(`sim.monitoring.${data.delayMonitoringState}`)
            : t("sim.monitoring.inactive")}
        </p>
        <p className="font-sans text-[13px] text-ink/65 dark:text-frost/65 leading-snug mt-1">
          {nextAction}
        </p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-arctic dark:bg-void transition-colors duration-520">
      <Nav />

      <TutorialOverlay
        storageKey="novaris_delay_tutorial"
        onComplete={() => {}}
        steps={[
          {
            targetId: "delay-sidebar-fields",
            title: language === "id" ? "Atur Parameternya" : "Set the Stage",
            description:
              language === "id"
                ? "Tentukan parameter proyek Anda. Atur kompleksitas, ukuran tim, dan variasi supplier sesuai kondisi operasional."
                : "Define your project parameters. Adjust complexity, team size, and supplier variance to match your reality.",
            icon: <SlidersHorizontal size={14} />,
          },
          {
            targetId: "delay-bottlenecks",
            title:
              language === "id" ? "Identifikasi Friksi" : "Identify the Friction",
            description:
              language === "id"
                ? "Engine langsung menyorot faktor operasional yang paling mungkin mengganggu timeline."
                : "The engine instantly highlights which factors are most likely to derail your timeline.",
            icon: <AlertTriangle size={14} />,
          },
          {
            targetId: "delay-headline",
            title: language === "id" ? "Baca Hasilnya" : "Read the Outcome",
            description:
              language === "id"
                ? "Angka memberi konteks, tapi narasi memberi strategi. Ringkasan ini akan ter-update real-time saat variabel diubah."
                : "Numbers are context, but narrative is strategy. Watch this summary update in real-time as you tweak variables.",
            icon: <BookOpenText size={14} />,
          },
        ]}
      />

      <SimLayout
        controls={<DelaySidebar form={form} onFormChange={setForm} isPending={isPending} />}
        impactBar={impactBar}
        controlsCollapsible
        controlsDefaultOpen
      >
        <div id="delay-headline">
          <DelayProbabilityScene
            data={data || undefined}
            isPending={isPending}
            probColor={delayTextColor}
            headline={headline}
            targetDurationDays={form.targetDurationDays}
            language={language}
          />
        </div>
        <PhaseChartScene
          data={data || undefined}
          isPending={isPending}
          language={language}
        />
        {data && (
          <div id="delay-bottlenecks">
            <BottlenecksScene data={data} language={language} />
          </div>
        )}
      </SimLayout>
    </main>
  );
}

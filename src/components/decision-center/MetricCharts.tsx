import React from "react";
import type { ChartData } from "../../types/decisionCenter";
import { useLocale } from "../../hooks/useLocale";
import { Info } from "lucide-react";
import { getScoreLabel } from "../../lib/decision-center/utils";
import { 
  getMetricTone, 
  getChartTooltipStyle, 
  getRevenueGapData, 
  getRevenueGapOptions, 
  getMonteCarloData, 
  getMonteCarloOptions 
} from "../../lib/decision-center/chartConfigs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface MetricChartsProps {
  data: ChartData | null;
  isCalculating: boolean;
  revenueGapRef?: React.RefObject<any>;
  monteCarloRef?: React.RefObject<any>;
}

function ChartTitle({ title, help }: { title: string; help: string }) {
  return (
    <div className="flex items-center gap-2">
      <h3 className="font-sans text-[20px] font-medium text-ink dark:text-frost">
        {title}
      </h3>
      <span className="group relative inline-flex items-center">
        <Info size={12} className="text-ink/30 dark:text-frost/36" />
        <span className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-ink/6 bg-bone px-3 py-2 font-sans text-[12px] leading-relaxed text-ink/72 opacity-0 transition-opacity group-hover:opacity-100 dark:border-frost/10 dark:bg-charcoal-soft dark:text-frost/78">
          {help}
        </span>
      </span>
    </div>
  );
}


export function MetricCharts({ 
  data, 
  isCalculating,
  revenueGapRef,
  monteCarloRef
}: MetricChartsProps) {
  const { language, formatCurrency } = useLocale();
  const isId = language === "id";

  if (isCalculating || !data) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="font-fraunces text-3xl font-light text-ink dark:text-frost mb-2">
            {isId ? "Bukti Angka" : "Evidence"}
          </h2>
          <p className="font-sans text-ink/62 dark:text-frost/64">
            {isId ? "Menyiapkan pembacaan visual..." : "Preparing visual readout..."}
          </p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`rounded-xl border border-ink/4 p-6 dark:border-frost/8 animate-pulse ${
                i === 3 ? "xl:col-span-2 h-72" : "h-96"
              }`}
            >
              <div className="h-4 w-1/3 rounded bg-ink/5 dark:bg-charcoal-soft/80 mb-4" />
              <div className="h-full rounded bg-ink/5 dark:bg-charcoal-soft/80" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const lfiTone = getMetricTone(data.lfi.score);
  const lfiStatus = isId
    ? getScoreLabel(data.lfi.score, true)
    : lfiTone.label;

  const revenueGapData = getRevenueGapData(data, isId);
  const revenueGapOptions = {
    ...getRevenueGapOptions(isId),
    plugins: {
      ...getRevenueGapOptions(isId).plugins,
      tooltip: {
        ...getChartTooltipStyle(document.documentElement.classList.contains("dark")),
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            return `${label}: ${formatCurrency(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      ...getRevenueGapOptions(isId).scales,
      y: {
        ...getRevenueGapOptions(isId).scales.y,
        ticks: {
          ...getRevenueGapOptions(isId).scales.y.ticks,
          callback: (value: any) => formatCurrency(Number(value)),
        },
      },
    },
  };

  const monteCarloData = getMonteCarloData(data, isId);
  const monteCarloOptions = {
    ...getMonteCarloOptions(isId),
    plugins: {
      ...getMonteCarloOptions(isId).plugins,
      tooltip: getChartTooltipStyle(document.documentElement.classList.contains("dark")),
    },
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-fraunces text-3xl font-light text-ink dark:text-frost mb-2">
          {isId ? "Bukti pendukung" : "Supporting evidence"}
        </h2>
        <p className="font-sans text-ink/62 dark:text-frost/64">
          {isId
            ? "Tiga pembacaan yang menunjukkan di mana tekanan terbesar sekarang."
            : "Three reads that show where the pressure is right now."}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="rounded-xl p-6 border border-ink/4 dark:border-frost/8 bg-bone/60 dark:bg-charcoal/55">
          <div className="mb-5">
            <ChartTitle
              title={isId ? "Apakah pemasukan cukup?" : "Is income enough?"}
              help={isId ? "Membandingkan pemasukan aktual dengan target atau titik impas." : "Compares actual inflow with target or break-even."}
            />
            <p className="mt-2 font-sans text-[15px] text-ink/62 dark:text-frost/70 leading-relaxed">
              {isId
                ? "Grafik ini menunjukkan apakah uang masuk Anda benar-benar menutup kebutuhan rutin bisnis."
                : "This chart shows whether the money coming in is truly covering the business's regular needs."}
            </p>
          </div>

          <div className="h-80">
            <Bar ref={revenueGapRef} data={revenueGapData as never} options={revenueGapOptions as never} />
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${lfiTone.border} ${lfiTone.soft}`}>
          <div className="mb-6">
            <ChartTitle
              title={isId ? "Seberapa aman posisi kas Anda?" : "How safe is your cash position?"}
              help={isId ? "Ini adalah ringkasan cepat tentang seberapa mudah posisi uang Anda bisa terguncang." : "This is a quick summary of how easily your money position could get shaken."}
            />
            <p className="mt-2 font-sans text-[15px] text-ink/62 dark:text-frost/70 leading-relaxed">
              {isId
                ? "Semakin tinggi angkanya, semakin kecil ruang aman Anda jika ada gangguan baru."
                : "The higher the score, the less room you have if another disruption hits."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-8 items-end">
            <div>
              <div className={`font-fraunces text-[clamp(96px,12vw,144px)] leading-[0.86] ${lfiTone.text}`}>
                {data.lfi.score.toFixed(0)}
              </div>
              <p className={`mt-3 font-sans text-[18px] ${lfiTone.text}`}>
                {lfiStatus}
              </p>
              <p className="mt-5 max-w-xl font-sans text-[15px] leading-relaxed text-ink/68 dark:text-frost/72">
                {isId
                  ? `Skor ini menggabungkan runway ${data.lfi.daysCover} hari, current ratio ${data.lfi.currentRatio.toFixed(2)}, dan piutang berisiko ${formatCurrency(data.lfi.arAtRisk)}.`
                  : `This score combines ${data.lfi.daysCover} days of cover, a ${data.lfi.currentRatio.toFixed(2)} current ratio, and ${formatCurrency(data.lfi.arAtRisk)} at-risk receivables.`}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2 font-sans text-[13px] text-ink/48 dark:text-frost/56">
                  <span>{isId ? "Skor tekanan kas" : "Cash pressure score"}</span>
                  <span className={`text-[15px] ${lfiTone.text}`}>{data.lfi.score.toFixed(0)}/100</span>
                </div>
                <div className="h-2 rounded-full bg-ink/6 dark:bg-charcoal-light overflow-hidden">
                  <div className={`h-full ${lfiTone.fill}`} style={{ width: `${data.lfi.score}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="rounded-lg border border-ink/5 dark:border-frost/8 px-4 py-4 bg-bone/70 dark:bg-charcoal-soft/80">
                  <p className="font-sans text-[11px] text-ink/46 dark:text-frost/52">{isId ? "Hari aman" : "Days covered"}</p>
                  <p className="mt-1 font-fraunces text-[32px] leading-none text-ink dark:text-frost">{data.lfi.daysCover}</p>
                </div>
                <div className="rounded-lg border border-ink/5 dark:border-frost/8 px-4 py-4 bg-bone/70 dark:bg-charcoal-soft/80">
                  <p className="font-sans text-[11px] text-ink/46 dark:text-frost/52">{isId ? "Rasio kas lancar" : "Current ratio"}</p>
                  <p className="mt-1 font-fraunces text-[32px] leading-none text-ink dark:text-frost">{data.lfi.currentRatio.toFixed(2)}</p>
                </div>
                <div className="rounded-lg border border-ink/5 dark:border-frost/8 px-4 py-4 bg-bone/70 dark:bg-charcoal-soft/80">
                  <p className="font-sans text-[11px] text-ink/46 dark:text-frost/52">{isId ? "Tagihan tertahan" : "Receivables at risk"}</p>
                  <p className="mt-1 font-fraunces text-[28px] leading-none text-ink dark:text-frost wrap-break-word">{formatCurrency(data.lfi.arAtRisk)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-6 border border-ink/4 dark:border-frost/8 xl:col-span-2 bg-bone/60 dark:bg-charcoal/55">
          <div className="mb-6">
            <ChartTitle
              title={isId ? "Rentang hasil yang mungkin" : "Likely outcome range"}
              help={isId ? "Bagian ini membantu Anda melihat hasil buruk, normal, dan terbaik yang masih masuk akal." : "This helps you see the bad, normal, and best outcomes that still look realistic."}
            />
            <p className="mt-2 font-sans text-[15px] text-ink/62 dark:text-frost/70 leading-relaxed">
              {isId
                ? "Ini bukan satu prediksi pasti, tetapi batas bawah, tengah, dan atas yang layak Anda siapkan."
                : "This is not one fixed forecast, but the lower, middle, and upper outcome you should be prepared for."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-stretch">
            <div className="h-80">
              <Bar ref={monteCarloRef} data={monteCarloData} options={monteCarloOptions as never} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-scarlet/12 bg-scarlet/4 p-7 flex flex-col justify-between min-h-[280px]">
                <p className="font-sans text-[15px] text-ink/56 dark:text-frost/60">{isId ? "Kasus terburuk" : "Worst case"}</p>
                <div>
                  <p className="font-fraunces text-[clamp(68px,7vw,92px)] leading-none text-scarlet dark:text-scarlet-bright">{data.monteCarlo.worst.probability}%</p>
                  <p className="mt-4 font-sans text-[16px] leading-relaxed text-ink/68 dark:text-frost/70">{formatCurrency(data.monteCarlo.worst.outcome)}</p>
                </div>
              </div>

              <div className="rounded-xl border border-steel/12 bg-steel/4 p-7 flex flex-col justify-between min-h-[280px]">
                <p className="font-sans text-[15px] text-ink/56 dark:text-frost/60">{isId ? "Kasus dasar" : "Base case"}</p>
                <div>
                  <p className="font-fraunces text-[clamp(68px,7vw,92px)] leading-none text-steel dark:text-steel-bright">{data.monteCarlo.base.probability}%</p>
                  <p className="mt-4 font-sans text-[16px] leading-relaxed text-ink/68 dark:text-frost/70">{formatCurrency(data.monteCarlo.base.outcome)}</p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/12 bg-emerald-500/4 p-7 flex flex-col justify-between min-h-[280px]">
                <p className="font-sans text-[15px] text-ink/56 dark:text-frost/60">{isId ? "Kasus terbaik" : "Best case"}</p>
                <div>
                  <p className="font-fraunces text-[clamp(68px,7vw,92px)] leading-none text-emerald-600 dark:text-emerald-400">{data.monteCarlo.best.probability}%</p>
                  <p className="mt-4 font-sans text-[16px] leading-relaxed text-ink/68 dark:text-frost/70">{formatCurrency(data.monteCarlo.best.outcome)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

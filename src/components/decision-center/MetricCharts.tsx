import React from "react";
import type { ChartData } from "../../types/decisionCenter";
import { useLocale } from "../../hooks/useLocale";
import { Info } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MetricChartsProps {
  data: ChartData | null;
  isCalculating: boolean;
}

function ChartTitle({ title, help }: { title: string; help: string }) {
  return (
    <div className="flex items-center gap-2">
      <h4 className="font-sans text-[15px] font-medium text-ink dark:text-frost">{title}</h4>
      <span className="group relative inline-flex items-center">
        <Info size={12} className="text-ink/28 dark:text-frost/28" />
        <span className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-ink/[0.06] bg-bone px-3 py-2 font-sans text-[12px] leading-relaxed text-ink/70 opacity-0 transition-opacity group-hover:opacity-100 dark:border-frost/[0.08] dark:bg-charcoal dark:text-frost/72">
          {help}
        </span>
      </span>
    </div>
  );
}

export function MetricCharts({ data, isCalculating }: MetricChartsProps) {
  const { language, formatCurrency } = useLocale();
  const isId = language === "id";

  if (isCalculating || !data) {
    return (
      <div>
        <div className="mb-8">
          <h3 className="font-fraunces text-3xl font-light text-ink dark:text-frost mb-2">
            {isId ? "Grafik Metrik" : "Metric Charts"}
          </h3>
          <p className="font-sans text-ink/60 dark:text-frost/60">
            {isId ? "Memuat data..." : "Loading data..."}
          </p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`rounded-2xl border border-ink/[0.04] p-6 dark:border-frost/[0.04] animate-pulse ${i === 3 ? "xl:col-span-2 h-72" : "h-96"}`}>
              <div className="h-4 bg-ink/5 dark:bg-frost/5 rounded w-1/3 mb-4" />
              <div className="h-full bg-ink/5 dark:bg-frost/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Revenue Gap Chart Data
  const revenueGapData = {
    labels: data.revenueGap.weeks,
    datasets: [
      {
        label: isId ? "Aktual" : "Actual",
        data: data.revenueGap.actual,
        backgroundColor: "rgba(120, 113, 108, 0.7)",
        borderColor: "rgba(120, 113, 108, 1)",
        borderWidth: 1,
        borderRadius: 4,
        order: 2,
      },
      {
        label: isId ? "Target" : "Target",
        data: data.revenueGap.target,
        type: "line" as const,
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 4,
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        fill: true,
        tension: 0.4,
        order: 1,
      },
      {
        label: isId ? "Proyeksi" : "Projected",
        data: data.revenueGap.projected,
        type: "line" as const,
        borderColor: "rgba(204, 31, 46, 0.6)",
        backgroundColor: "rgba(204, 31, 46, 0.05)",
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "rgba(204, 31, 46, 1)",
        borderDash: [3, 3],
        tension: 0.4,
        order: 3,
      },
    ],
  };

  const revenueGapOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1c1917",
        bodyColor: "#1c1917",
        borderColor: "rgba(28, 25, 23, 0.1)",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(28, 25, 23, 0.05)",
        },
        ticks: {
          callback: (value: any) => formatCurrency(Number(value)),
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  // Monte Carlo Chart Data
  const monteCarloData = {
    labels: [isId ? "Terburuk" : "Worst", isId ? "Dasar" : "Base", isId ? "Terbaik" : "Best"],
    datasets: [
      {
        label: isId ? "Probabilitas" : "Probability",
        data: [
          data.monteCarlo.worst.probability,
          data.monteCarlo.base.probability,
          data.monteCarlo.best.probability,
        ],
        backgroundColor: [
          "rgba(204, 31, 46, 0.7)",
          "rgba(120, 113, 108, 0.7)",
          "rgba(16, 185, 129, 0.7)",
        ],
        borderColor: [
          "rgba(204, 31, 46, 1)",
          "rgba(120, 113, 108, 1)",
          "rgba(16, 185, 129, 1)",
        ],
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const monteCarloOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1c1917",
        bodyColor: "#1c1917",
        borderColor: "rgba(28, 25, 23, 0.1)",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `${value}% probability`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(28, 25, 23, 0.05)",
        },
        ticks: {
          callback: (value: any) => `${value}%`,
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: 500 as const,
          },
        },
      },
    },
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="font-fraunces text-3xl font-light text-ink dark:text-frost mb-2">
          {isId ? "Grafik Metrik" : "Metric Charts"}
        </h3>
        <p className="font-sans text-ink/60 dark:text-frost/60">
          {isId ? "Visualisasi data untuk memahami posisi bisnis Anda." : "Data visualizations to understand your business position."}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue Gap Chart */}
        <div className="rounded-xl p-6 border border-ink/[0.04] dark:border-frost/[0.04]">
          <div className="mb-4">
            <ChartTitle
              title={isId ? "Gap Pendapatan" : "Revenue Gap"}
              help={isId ? "Membandingkan pendapatan aktual dengan target atau titik impas." : "Compares actual revenue with target or break-even point."}
            />
            <p className="font-sans text-[13px] text-ink/50 dark:text-frost/50 mt-1">
              {isId ? "Garis hijau = target, Batang abu = aktual, Garis merah putus-putus = proyeksi" : "Green line = target, Grey bars = actual, Red dashed = projected"}
            </p>
          </div>

          <div className="h-80">
            <Bar data={revenueGapData as any} options={revenueGapOptions} />
          </div>
        </div>

        {/* Liquidity Fragility Index */}
        <div className="rounded-xl p-6 border border-ink/[0.04] dark:border-frost/[0.04]">
          <div className="mb-4">
            <ChartTitle
              title={isId ? "Indeks Kerapuhan Likuiditas" : "Liquidity Fragility Index"}
              help={isId ? "Skor ringkas seberapa rapuh posisi uang Anda (0 = aman, 100 = kritis)." : "A compact score showing how fragile your money position is (0 = safe, 100 = critical)."}
            />
          </div>

          <div className="flex flex-col items-center">
            {/* Gauge */}
            <div className="relative w-64 h-32 overflow-hidden mb-6">
              <div className="absolute inset-0 rounded-t-full"
                style={{
                  background: "linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #cc1f2e 100%)",
                }}
              />
              <div className="absolute bottom-0 left-1/2 w-1.5 h-32 bg-ink dark:bg-frost origin-bottom transition-transform duration-700"
                style={{ 
                  transform: `translateX(-50%) rotate(${-90 + (data.lfi.score / 100) * 180}deg)`,
                }}
              />
              
              {/* Score indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2"
                style={{
                  transform: `translateX(-50%) rotate(${-90 + (data.lfi.score / 100) * 180}deg) translateY(-110px) rotate(${90 - (data.lfi.score / 100) * 180}deg)`,
                }}
              >
                <div className="w-3 h-3 rounded-full bg-ink dark:bg-frost" />
              </div>
            </div>

            {/* Score Display */}
            <div className="text-center mb-6">
              <div className={`font-fraunces text-6xl font-light ${
                data.lfi.score >= 70 ? 'text-scarlet' : 
                data.lfi.score >= 40 ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {data.lfi.score.toFixed(0)}
              </div>              
              <p className="font-sans text-[13px] text-ink/50 dark:text-frost/50 mt-1">
                {data.lfi.score >= 70 ? (isId ? "Kritis" : "Critical") : 
                 data.lfi.score >= 40 ? (isId ? "Waspada" : "Caution") : 
                 (isId ? "Aman" : "Safe")}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="text-center p-3 rounded-xl bg-ink/[0.02] dark:bg-frost/[0.02]">
                <p className="font-sans text-[11px] text-ink/50 dark:text-frost/50 mb-1">
                  {isId ? "Cakupan Hari" : "Days Cover"}
                </p>
                <p className="font-fraunces text-xl text-ink dark:text-frost">
                  {data.lfi.daysCover}
                </p>
              </div>

              <div className="text-center p-3 rounded-xl bg-ink/[0.02] dark:bg-frost/[0.02]">
                <p className="font-sans text-[11px] text-ink/50 dark:text-frost/50 mb-1">
                  {isId ? "Rasio Lancar" : "Current Ratio"}
                </p>
                <p className="font-fraunces text-xl text-ink dark:text-frost">
                  {data.lfi.currentRatio.toFixed(2)}
                </p>
              </div>

              <div className="text-center p-3 rounded-xl bg-ink/[0.02] dark:bg-frost/[0.02]">
                <p className="font-sans text-[11px] text-ink/50 dark:text-frost/50 mb-1">
                  {isId ? "Piutang Risiko" : "AR at Risk"}
                </p>
                <p className="font-fraunces text-xl text-ink dark:text-frost">
                  {formatCurrency(data.lfi.arAtRisk)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Monte Carlo Simulation */}
        <div className="rounded-xl p-6 border border-ink/[0.04] dark:border-frost/[0.04] xl:col-span-2">
          <div className="mb-6">
            <ChartTitle
              title={isId ? "Simulasi Monte Carlo" : "Monte Carlo Simulation"}
              help={isId ? "Distribusi kemungkinan hasil dari 10.000 simulasi untuk memahami rentang risiko." : "Probability distribution from 10,000 simulations to understand risk range."}
            />
            <p className="font-sans text-[13px] text-ink/50 dark:text-frost/50 mt-1">
              {isId ? "Menunjukkan probabilitas berbagai skenario hasil" : "Shows probability of different outcome scenarios"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="h-72">
              <Bar data={monteCarloData} options={monteCarloOptions} />
            </div>

            <div className="lg:col-span-2 grid grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-scarlet/5 border border-scarlet/10 text-center">
                <p className="font-sans text-[12px] text-ink/50 dark:text-frost/50 mb-2">
                  {isId ? "Kasus Terburuk" : "Worst Case"}
                </p>
                <p className="font-fraunces text-4xl text-scarlet dark:text-scarlet-bright mb-1">
                  {data.monteCarlo.worst.probability}%
                </p>
                <p className="font-sans text-[12px] text-ink/40 dark:text-frost/40">
                  {isId ? "Probabilitas" : "Probability"}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-steel/5 border border-steel/10 text-center">
                <p className="font-sans text-[12px] text-ink/50 dark:text-frost/50 mb-2">
                  {isId ? "Kasus Dasar" : "Base Case"}
                </p>
                <p className="font-fraunces text-4xl text-steel dark:text-steel-bright mb-1">
                  {data.monteCarlo.base.probability}%
                </p>
                <p className="font-sans text-[12px] text-ink/40 dark:text-frost/40">
                  {isId ? "Probabilitas" : "Probability"}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                <p className="font-sans text-[12px] text-ink/50 dark:text-frost/50 mb-2">
                  {isId ? "Kasus Terbaik" : "Best Case"}
                </p>
                <p className="font-fraunces text-4xl text-emerald-600 dark:text-emerald-400 mb-1">
                  {data.monteCarlo.best.probability}%
                </p>
                <p className="font-sans text-[12px] text-ink/40 dark:text-frost/40">
                  {isId ? "Probabilitas" : "Probability"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

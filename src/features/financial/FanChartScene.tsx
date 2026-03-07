import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { FanChartSceneProps } from "./types";

export function FanChartScene({
  data,
  isPending,
  emergencyBufferSize,
  formatCurrency,
  language,
}: FanChartSceneProps) {
  const chartLegend =
    language === "id"
      ? [
          { label: "Aman", color: "var(--color-steel-bright)" },
          { label: "Tekanan", color: "#eab308" },
          { label: "Kritis", color: "var(--color-scarlet)" },
        ]
      : [
          { label: "Comfortable", color: "var(--color-steel-bright)" },
          { label: "Pressure", color: "#eab308" },
          { label: "Critical", color: "var(--color-scarlet)" },
        ];

  return (
    <section className="mx-8 sm:mx-12 my-12 px-8 py-10 bg-white/40 dark:bg-white/2 backdrop-blur-xl rounded-3xl border border-ink/5 dark:border-frost/5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className="font-fraunces text-3xl font-light text-ink dark:text-frost mb-2">
            {language === "id" ? "Proyeksi Arus Kas" : "Cash Flow Projection"}
          </h3>
          <p className="font-sans text-sm text-ink/50 dark:text-frost/50">
            {language === "id"
              ? "Proyeksi runway 12 bulan dengan variasi risiko."
              : "12-month runway forecast under variance."}
          </p>
        </div>

        {data && (
          <div className="flex gap-5">
            {chartLegend.map((z) => (
              <div key={z.label} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 block rounded-full"
                  style={{ background: z.color }}
                />
                <span className="font-sans text-[13px] text-ink/50 dark:text-frost/50">
                  {z.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!data ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <div
            className="w-5 h-5 rounded-full border-t border-t-scarlet border border-ink/9 dark:border-frost/8"
            style={isPending ? { animation: "spin 0.8s linear infinite" } : {}}
          />
          <p className="font-sans text-[13px] text-ink/40 dark:text-frost/40">
            {isPending
              ? language === "id"
                ? "Menjalankan simulasi..."
                : "Running simulations..."
              : language === "id"
                ? "Menunggu input simulasi"
                : "Awaiting simulation"}
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data.monthlyProjections}
            margin={{ top: 4, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-steel-bright)"
                  stopOpacity={0.15}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-steel-bright)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-scarlet)"
                  stopOpacity={0.06}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-scarlet)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="currentColor"
              className="text-ink/5 dark:text-frost/5"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="transparent"
              tick={{
                fill: "currentColor",
                fontSize: 10,
                className: "text-ink/40 dark:text-frost/40 font-mono",
              }}
              tickFormatter={(v) => `M${v}`}
            />
            <YAxis
              stroke="transparent"
              tick={{
                fill: "currentColor",
                fontSize: 10,
                className: "text-ink/40 dark:text-frost/40 font-mono",
              }}
              tickFormatter={(v: number) => {
                const abs = Math.abs(v);
                if (abs >= 1_000_000_000) {
                  return `${(v / 1_000_000_000).toFixed(1)}B`;
                }
                if (abs >= 1_000_000) {
                  return `${(v / 1_000_000).toFixed(1)}M`;
                }
                if (abs >= 1_000) {
                  return `${(v / 1_000).toFixed(0)}k`;
                }
                return `${v.toFixed(0)}`;
              }}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(244, 247, 251, 0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(8, 14, 28, 0.08)",
                borderRadius: "8px",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                boxShadow: "0 10px 20px -5px rgba(0,0,0,0.05)",
              }}
              itemStyle={{ color: "var(--color-ink)" }}
              labelStyle={{
                color: "var(--color-ink-faint)",
                fontSize: 10,
                marginBottom: 4,
              }}
              formatter={(v: number | undefined) => [
                formatCurrency(Number(v ?? 0)),
                language === "id" ? "Saldo Kas" : "Balance",
              ]}
              labelFormatter={(l) =>
                language === "id" ? `Bulan ${l}` : `Month ${l}`
              }
            />
            <Area
              type="monotone"
              dataKey="varianceRange"
              stroke="none"
              fill="url(#fanGrad)"
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="cashBalance"
              stroke="var(--color-steel-bright)"
              strokeWidth={2}
              fill="url(#cashGrad)"
              dot={false}
              animationDuration={1000}
            />
            <ReferenceLine
              y={emergencyBufferSize}
              stroke="var(--color-scarlet)"
              strokeDasharray="6 4"
              strokeOpacity={0.6}
              label={{
                value:
                  language === "id" ? "Batas Darurat" : "Emergency Floor",
                fill: "var(--color-scarlet)",
                fontSize: 10,
                position: "right",
                fontFamily: "var(--font-mono)",
                offset: 10,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}

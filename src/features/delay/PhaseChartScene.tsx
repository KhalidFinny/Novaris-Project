import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { PhaseChartSceneProps } from "./types";

export function PhaseChartScene({
  data,
  isPending,
  language = "en",
}: PhaseChartSceneProps) {
  const chartLegend =
    language === "id"
      ? [
          { label: "Waktu Dasar", color: "var(--color-steel-bright)" },
          { label: "Rentang Delay", color: "var(--color-scarlet)" },
        ]
      : [
          { label: "Base Time", color: "var(--color-steel-bright)" },
          { label: "Delay Range", color: "var(--color-scarlet)" },
        ];

  const phaseLabel = (value: string) => {
    if (language !== "id") return value;
    const map: Record<string, string> = {
      "Planning & Procurement": "Perencanaan & Pengadaan",
      "Execution & Build": "Eksekusi & Pengerjaan",
      "Testing & Handover": "Pengujian & Serah Terima",
    };
    return map[value] ?? value;
  };

  return (
    <section className="mx-8 sm:mx-12 my-12 px-8 py-10 bg-white/40 dark:bg-white/2 backdrop-blur-xl rounded-3xl border border-ink/5 dark:border-frost/5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className="font-fraunces text-3xl font-light text-ink dark:text-frost mb-2">
            {language === "id" ? "Variansi Fase" : "Phase Variance"}
          </h3>
          <p className="font-sans text-sm text-ink/50 dark:text-frost/50">
            {language === "id"
              ? "Durasi ekspektasi vs potensi delay di setiap fase proyek."
              : "Expected duration vs. potential delay per project stage."}
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
                ? "Menganalisis..."
                : "Analysing..."
              : language === "id"
                ? "Menunggu parameter"
                : "Awaiting parameters"}
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data.timelineProjection}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="currentColor"
              className="text-ink/5 dark:text-frost/5"
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke="transparent"
              tick={{
                fill: "currentColor",
                fontSize: 10,
                className: "text-ink/40 dark:text-frost/40 font-mono",
              }}
            />
            <YAxis
              dataKey="phase"
              type="category"
              stroke="transparent"
              tick={{
                fill: "currentColor",
                fontSize: 11,
                className: "text-ink/60 dark:text-frost/60 font-sans",
              }}
              width={170}
              tickFormatter={phaseLabel}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.02)" }}
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
                marginBottom: 8,
              }}
            />
            <Bar
              dataKey="optimisticDays"
              stackId="a"
              name={language === "id" ? "Waktu Dasar" : "Base Time"}
              barSize={16}
              radius={[2, 0, 0, 2]}
            >
              {data.timelineProjection.map((_, i) => (
                <Cell
                  key={i}
                  fill="var(--color-steel-bright)"
                  fillOpacity={0.9}
                />
              ))}
            </Bar>
            <Bar
              dataKey="pessimisticDays"
              stackId="a"
              name={language === "id" ? "Rentang Delay" : "Delay Range"}
              barSize={16}
              radius={[0, 2, 2, 0]}
            >
              {data.timelineProjection.map((_, i) => (
                <Cell key={i} fill="var(--color-scarlet)" fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}

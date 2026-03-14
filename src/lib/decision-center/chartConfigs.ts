/**
 * Chart configuration utilities and theme constants for MetricCharts.tsx
 */

export const getChartTooltipStyle = (isDark: boolean) => ({
  backgroundColor: isDark ? "rgba(18, 22, 31, 0.96)" : "rgba(255, 255, 255, 0.96)",
  titleColor: isDark ? "#f8fafc" : "#1e293b",
  bodyColor: isDark ? "#e2e8f0" : "#475569",
  borderColor: isDark ? "rgba(226, 234, 248, 0.12)" : "rgba(0, 0, 0, 0.08)",
  borderWidth: 1,
  padding: 12,
  font: {
    family: "DM Sans, sans-serif",
  },
});

export const getMetricTone = (score: number) => {
  if (score >= 70) {
    return {
      text: "text-scarlet dark:text-scarlet-bright",
      fill: "bg-scarlet",
      soft: "bg-scarlet/5 dark:bg-scarlet/8",
      border: "border-scarlet/12 dark:border-scarlet/20",
      label: "Critical",
    };
  }

  if (score >= 40) {
    return {
      text: "text-amber-600 dark:text-amber-400",
      fill: "bg-amber-500",
      soft: "bg-amber-500/5 dark:bg-amber-500/8",
      border: "border-amber-500/12 dark:border-amber-500/20",
      label: "Caution",
    };
  }

  return {
    text: "text-emerald-600 dark:text-emerald-400",
    fill: "bg-emerald-500",
    soft: "bg-emerald-500/5 dark:bg-emerald-500/8",
    border: "border-emerald-500/12 dark:border-emerald-500/20",
    label: "Healthy",
  };
};

export const getRevenueGapData = (data: any, isId: boolean) => ({
  labels: data.revenueGap.weeks,
  datasets: [
    {
      label: isId ? "Aktual" : "Actual",
      data: data.revenueGap.actual,
      backgroundColor: "rgba(45, 95, 138, 0.18)",
      borderColor: "rgba(45, 95, 138, 0.7)",
      borderWidth: 1,
      borderRadius: 8,
      order: 2,
    },
    {
      label: isId ? "Target" : "Target",
      data: data.revenueGap.target,
      type: "line" as const,
      borderColor: "rgba(21, 128, 61, 0.9)",
      backgroundColor: "rgba(21, 128, 61, 0.06)",
      borderWidth: 2,
      borderDash: [5, 4],
      pointRadius: 3,
      pointHoverRadius: 4,
      pointBackgroundColor: "rgba(21, 128, 61, 0.9)",
      fill: false,
      tension: 0.35,
      order: 1,
    },
    {
      label: isId ? "Proyeksi" : "Projected",
      data: data.revenueGap.projected,
      type: "line" as const,
      borderColor: "rgba(164, 22, 36, 0.65)",
      backgroundColor: "rgba(164, 22, 36, 0.04)",
      borderWidth: 2,
      pointRadius: 2,
      pointHoverRadius: 3,
      pointBackgroundColor: "rgba(164, 22, 36, 0.85)",
      borderDash: [3, 4],
      tension: 0.35,
      order: 3,
    },
  ],
});

export const getRevenueGapOptions = (isId: boolean) => ({
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
        padding: 16,
        color: "#64748b",
        font: {
          size: 12,
          family: "DM Sans, sans-serif",
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(8, 14, 28, 0.06)",
      },
      border: { display: false },
      ticks: {
        color: "#6b7280",
        font: {
          size: 11,
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      border: { display: false },
      ticks: {
        color: "#6b7280",
        font: {
          size: 11,
        },
      },
    },
  },
});

export const getMonteCarloData = (data: any, isId: boolean) => ({
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
        "rgba(164, 22, 36, 0.7)",
        "rgba(45, 95, 138, 0.5)",
        "rgba(21, 128, 61, 0.65)",
      ],
      borderColor: [
        "rgba(164, 22, 36, 0.95)",
        "rgba(45, 95, 138, 0.85)",
        "rgba(21, 128, 61, 0.9)",
      ],
      borderWidth: 1,
      borderRadius: 12,
      borderSkipped: false,
    },
  ],
});

export const getMonteCarloOptions = (isId: boolean) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: { color: "rgba(8, 14, 28, 0.06)" },
      border: { display: false },
      ticks: {
        color: "#6b7280",
        callback: (value: string | number) => `${value}%`,
        font: { size: 11 },
      },
    },
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: "#6b7280",
        font: { size: 12, weight: 500 as const },
      },
    },
  },
});

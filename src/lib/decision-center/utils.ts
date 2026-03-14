/**
 * Visual utilities for risk scores and analysis
 */

export const getCategoryKey = (category: string) => {
  const c = category.toLowerCase();
  if (c.includes("cash") || c.includes("kas")) return "cash";
  if (c.includes("revenue") || c.includes("income") || c.includes("pendapatan")) return "revenue";
  if (c.includes("client") || c.includes("klien")) return "client";
  if (c.includes("delay") || c.includes("terlambat")) return "delay";
  return "overall";
};

export const getScoreColor = (score: number) => {
  if (score >= 70) return 'text-scarlet';
  if (score >= 40) return 'text-amber-600';
  return 'text-emerald-600';
};

export const getScoreBg = (score: number) => {
  if (score >= 70) return 'bg-scarlet/10';
  if (score >= 40) return 'bg-amber-500/10';
  return 'bg-emerald-500/10';
};

export const getScoreBarClass = (score: number) => {
  if (score >= 70) return 'bg-scarlet';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-emerald-500';
};

export const getScoreLabel = (score: number, isId: boolean) => {
  if (score >= 70) return isId ? "Kritis" : "Critical";
  if (score >= 40) return isId ? "Waspada" : "Caution";
  return isId ? "Baik" : "Good";
};

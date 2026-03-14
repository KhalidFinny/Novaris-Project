import type {
  AllInputs,
  CashRunwayCalculation,
  ChartData,
  ComplianceCalculation,
  DecisionCenterData,
  DecisionNarrative,
  DailyBurnCalculation,
  DominoChain,
  DominoNode,
  MonthlyRevenueCalculation,
  ResilienceShield,
  RiskBridgePair,
  RiskScore,
  ScenarioOutput,
} from "../../types/decisionCenter";
import { selectTemplate } from "./narrativeTemplates";

type DecisionLanguage = "en" | "id";

/** Converts numeric or empty string values to numbers */
const toNumber = (value: number | "") => (value === "" ? 0 : Number(value));

/** Clamps a value between min and max */
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Checks if any project delay data is present */
const hasDelayLayer = (inputs: AllInputs) => {
  const { paymentAtRisk, projectTargetDays, teamSize, bufferDays } = inputs.delayRisk;
  
  // Payment at risk must be > 0 to be considered an active project layer
  const hasPayment = paymentAtRisk !== "" && Number(paymentAtRisk) > 0;
  
  // Other fields must at least be filled
  const hasMetadata = [projectTargetDays, teamSize, bufferDays].some(v => v !== "" && v !== 0);
  
  return hasPayment || hasMetadata;
};

/** Deep clones the inputs object */
const cloneInputs = (inputs: AllInputs): AllInputs => ({
  ...inputs,
  essentials: { ...inputs.essentials },
  delayRisk: { ...inputs.delayRisk },
  scenario: { ...inputs.scenario },
});

/** Calculates risk score based on cash runway days */
function getRunwayRiskScore(runwayDays: number) {
  if (runwayDays <= 15) return 100;
  if (runwayDays <= 30) return 92;
  if (runwayDays <= 45) return 72;
  if (runwayDays <= 60) return 50;
  if (runwayDays <= 90) return 28;
  return 14;
}

/** Calculates risk score based on revenue variance percentage */
function getRevenueRiskScore(variancePercent: number) {
  if (variancePercent >= 0) {
    return variancePercent >= 20 ? 6 : variancePercent >= 10 ? 10 : 14;
  }

  return clamp(Math.abs(variancePercent) * 2.2, 18, 100);
}

/** Calculates risk score based on lead client revenue dependency */
function getClientDependencyRiskScore(dependencyPercent: number) {
  if (dependencyPercent <= 15) return 12;
  if (dependencyPercent <= 30) return 28;
  if (dependencyPercent <= 40) return 46;
  if (dependencyPercent <= 55) return 68;
  return 88;
}

/** Calculates the weighted composite risk score for the dashboard */
function getCompositeRiskScore(inputs: AllInputs, kpi: DecisionCenterData["kpi"]) {
  const runwayRisk = getRunwayRiskScore(kpi.cashRunway?.baseRunway || 0);
  const revenueRisk = getRevenueRiskScore(kpi.monthlyRevenue?.variancePercent || 0);
  const delayRisk = hasDelayLayer(inputs) ? calculateDelayProbability(inputs) : 0;
  const clientRisk = getClientDependencyRiskScore(
    toNumber(inputs.essentials.biggestClientPercent),
  );

  const score = Math.round(
    runwayRisk * 0.4 +
      revenueRisk * 0.25 +
      delayRisk * 0.2 +
      clientRisk * 0.15,
  );

  return {
    score,
    components: {
      runwayRisk,
      revenueRisk,
      delayRisk,
      clientRisk,
    },
  };
}

/** Maps a numeric score to a named risk level */
function getRiskLevelFromScore(score: number): DecisionNarrative["riskLevel"] {
  if (score >= 78) return "critical";
  if (score >= 58) return "high";
  if (score >= 32) return "medium";
  return "low";
}

/** Applies interactive what-if scenario modifications to inputs */
function applyScenario(inputs: AllInputs): AllInputs {
  const scenario = inputs.activeScenario;
  if (!scenario) return inputs;

  const next = cloneInputs(inputs);

  if (scenario === "late-client") {
    next.essentials.cashInBank = Math.max(
      0,
      toNumber(next.essentials.cashInBank) - toNumber(next.delayRisk.paymentAtRisk) * 0.35,
    );
  }

  if (scenario === "delay-2-weeks") {
    next.delayRisk.bufferDays = Math.max(0, toNumber(next.delayRisk.bufferDays) - 14);
  }

  if (scenario === "hire-one") {
    next.essentials.monthlyBills =
      toNumber(next.essentials.monthlyBills) + Math.max(1000, toNumber(next.essentials.monthlyBills) * 0.12);
  }

  if (scenario === "costs-up") {
    next.essentials.monthlyBills = toNumber(next.essentials.monthlyBills) * 1.2;
  }

  if (scenario === "reset") {
    return { ...inputs, activeScenario: null };
  }

  return next;
}

/** Calculates cash runway based on bank balance and monthly burn */
function calculateCashRunway(inputs: AllInputs): CashRunwayCalculation | null {
  const cash = toNumber(inputs.essentials.cashInBank);
  const monthlyBills = toNumber(inputs.essentials.monthlyBills);

  if (!cash || !monthlyBills) return null;

  const dailyBurn = monthlyBills / 30;
  const baseRunway = Math.floor(cash / dailyBurn);
  const adjustedRunway = Math.floor((cash + Math.max(0, toNumber(inputs.essentials.monthlyRevenue) - monthlyBills)) / dailyBurn);

  let status: CashRunwayCalculation["status"] = "safe";
  if (baseRunway < 30) status = "critical";
  else if (baseRunway < 45) status = "warning";
  else if (baseRunway < 60) status = "monitor";

  return { cashInBank: cash, monthlyBills, dailyBurnRate: dailyBurn, baseRunway, adjustedRunway, status };
}

/** Calculates revenue gap and variance against target/break-even */
function calculateMonthlyRevenue(inputs: AllInputs): MonthlyRevenueCalculation | null {
  const revenue = toNumber(inputs.essentials.monthlyRevenue);
  const bills = toNumber(inputs.essentials.monthlyBills);
  const target = toNumber(inputs.essentials.monthlyRevenueTarget ?? "");
  if (!revenue && !bills) return null;

  const baseline = target > 0 ? target : bills;
  const variance = revenue - baseline;
  const variancePercent = baseline > 0 ? (variance / baseline) * 100 : 0;
  return {
    actualRevenue: revenue,
    targetRevenue: target > 0 ? target : null,
    breakEvenRevenue: bills,
    variance,
    variancePercent,
    isOnTrack: variance >= 0,
  };
}

/** Calculates current daily burn rate and trend relative to income */
function calculateDailyBurn(inputs: AllInputs): DailyBurnCalculation | null {
  const bills = toNumber(inputs.essentials.monthlyBills);
  const revenue = toNumber(inputs.essentials.monthlyRevenue);
  if (!bills) return null;

  const currentRate = bills / 30;
  const trendPercent = revenue > 0 && bills > revenue ? Math.min(25, ((bills - revenue) / revenue) * 100) : 0;

  return {
    currentRate,
    trendPercent,
    isAccelerating: trendPercent > 15,
  };
}

function calculateCompliance(): ComplianceCalculation | null {
  return null;
}

/** Calculates project delay probability using objective project factors */
function calculateDelayProbability(inputs: AllInputs) {
  if (!hasDelayLayer(inputs)) return 0;

  const target = toNumber(inputs.delayRisk.projectTargetDays);
  const team = toNumber(inputs.delayRisk.teamSize);
  const buffer = toNumber(inputs.delayRisk.bufferDays);
  const payment = toNumber(inputs.delayRisk.paymentAtRisk);

  let score = 20;
  if (target > 0 && target < 30) score += 15;
  if (team > 0 && team <= 2) score += 20;
  if (buffer <= 3) score += 25;
  if (payment > toNumber(inputs.essentials.monthlyRevenue) * 0.4) score += 15;

  return Math.min(95, score);
}

/** Selects and populates a strategic narrative template based on simulation results */
function generateNarrative(inputs: AllInputs, kpi: DecisionCenterData["kpi"], language: DecisionLanguage): DecisionNarrative | null {
  if (!kpi.cashRunway) return null;

  const delayProbability = calculateDelayProbability(inputs);
  const variancePercent = kpi.monthlyRevenue?.variancePercent || 0;
  const biggestClientPercent = toNumber(inputs.essentials.biggestClientPercent);
  const composite = getCompositeRiskScore(inputs, kpi);
  const activeRiskCount = [
    composite.components.runwayRisk >= 55,
    composite.components.revenueRisk >= 45,
    composite.components.delayRisk >= 45,
    composite.components.clientRisk >= 55,
  ].filter(Boolean).length;
  const conditions = {
    cashRunwayStatus: kpi.cashRunway.status,
    projectDelayActive: hasDelayLayer(inputs) && delayProbability >= 35,
    projectDataPresent: hasDelayLayer(inputs),
    burnAccelerating: kpi.dailyBurn?.isAccelerating || false,
    multipleRisks: activeRiskCount >= 2,
  };

  const template = selectTemplate(conditions, {
    runwayDays: kpi.cashRunway.baseRunway,
    revenueGapPercent: variancePercent,
    clientDependencyPercent: biggestClientPercent,
  }, language);

  if (!template) return null;

  const paymentAtRisk = toNumber(inputs.delayRisk.paymentAtRisk);
  const revenue = toNumber(inputs.essentials.monthlyRevenue);
  const targetRevenue =
    kpi.monthlyRevenue?.targetRevenue ?? kpi.monthlyRevenue?.breakEvenRevenue ?? 0;
  const varianceAmount = kpi.monthlyRevenue?.variance || 0;
  const consumedDays = Math.max(3, 14 - toNumber(inputs.delayRisk.bufferDays));
  const varianceDays = Math.max(2, 10 - toNumber(inputs.delayRisk.bufferDays));
  const dailyBurn = Math.round(kpi.cashRunway?.dailyBurnRate || 0);
  const riskLevel = getRiskLevelFromScore(composite.score);
  const probabilityBase = clamp(
    Math.round(composite.score * 0.78 + (conditions.projectDelayActive ? 8 : 0)),
    18,
    95,
  );

  const vars: Record<string, string> = {
    runwayDays: String(kpi.cashRunway?.baseRunway || 0),
    acceleratedDays: String(Math.max(0, (kpi.cashRunway?.baseRunway || 0) - 10)),
    dailyBurn: dailyBurn.toLocaleString(),
    blockedPayment: paymentAtRisk.toLocaleString(),
    blockedAmount: paymentAtRisk.toLocaleString(),
    projectName: hasDelayLayer(inputs) ? (language === "id" ? "proyek aktif Anda" : "your active project") : (language === "id" ? "rencana bisnis Anda" : "your business plans"),
    consumedDays: String(consumedDays),
    shockCount: kpi.cashRunway && kpi.cashRunway.baseRunway >= 60 ? "2" : "1",
    shockAbsorption: kpi.cashRunway && kpi.cashRunway.baseRunway >= 90 ? "3" : kpi.cashRunway && kpi.cashRunway.baseRunway >= 60 ? "2" : "1",
    shockCapacity: kpi.cashRunway && kpi.cashRunway.baseRunway >= 120 ? "4" : kpi.cashRunway && kpi.cashRunway.baseRunway >= 90 ? "3" : "2",
    currentRunway: String(kpi.cashRunway?.baseRunway || 0),
    projectedRunway: String(Math.max(0, (kpi.cashRunway?.baseRunway || 0) - 8)),
    burnTrend: String(Math.round(kpi.dailyBurn?.trendPercent || 0)),
    effectiveDays: String(Math.max(0, (kpi.cashRunway?.baseRunway || 0) - 6)),
    delayCount: hasDelayLayer(inputs) ? "1" : "0",
    totalExposure: paymentAtRisk.toLocaleString(),
    teamSize: String(toNumber(inputs.delayRisk.teamSize) || 1),
    varianceDays: String(varianceDays),
    gapAmount: Math.abs(varianceAmount).toLocaleString(),
    gapPercent: String(Math.abs(variancePercent).toFixed(1)),
    topClient: language === "id" ? "klien terbesar Anda" : "your biggest client",
    concentrationPercent: String(biggestClientPercent || 0),
    impactAmount: Math.round((revenue * biggestClientPercent) / 100).toLocaleString(),
    requiredGrowth: String(Math.max(0, Math.round(((targetRevenue - revenue) / Math.max(revenue, 1)) * 100))),
    arDependency: String(clamp(Math.round((paymentAtRisk / Math.max(toNumber(inputs.essentials.cashInBank), 1)) * 100), 0, 100)),
    adjustedRunway: String(kpi.cashRunway?.adjustedRunway || 0),
    delayDays: hasDelayLayer(inputs) ? String(consumedDays) : "0",
    opportunityCost: Math.round(paymentAtRisk * 0.12).toLocaleString(),
    affectedProjects: String(hasDelayLayer(inputs) ? 2 : 1),
    stalledDays: String(consumedDays),
    burnedAmount: Math.round(consumedDays * dailyBurn).toLocaleString(),
    riskDays: String(Math.max(0, varianceDays - toNumber(inputs.delayRisk.bufferDays))),
    originalDays: String(toNumber(inputs.delayRisk.projectTargetDays) || 30),
    currentDays: String(((toNumber(inputs.delayRisk.projectTargetDays) || 30) + varianceDays)),
    scopePercent: String(Math.round((varianceDays / Math.max(toNumber(inputs.delayRisk.projectTargetDays) || 30, 1)) * 100)),
    bufferDays: String(toNumber(inputs.delayRisk.bufferDays) || 0),
    typicalVariance: "5",
    clientName: language === "id" ? "klien utama Anda" : "your lead client",
    riskScore: String(composite.components.clientRisk),
    consecutiveMonths: String(variancePercent < 0 ? 3 : 1),
    cumulativeGap: Math.round(Math.abs(varianceAmount) * 3).toLocaleString(),
    trendDirection: variancePercent >= 0 ? (language === "id" ? "membaik" : "improving") : (language === "id" ? "melemah" : "slipping"),
    trendRate: String(Math.max(4, Math.round(Math.abs(variancePercent) / 2))),
    surplusAmount: Math.max(0, varianceAmount).toLocaleString(),
    capacity: String(hasDelayLayer(inputs) ? 86 : 74),
    variance: String(Math.abs(variancePercent).toFixed(1)),
    delayCost: Math.round(paymentAtRisk * 0.08).toLocaleString(),
    totalBleed: Math.round(Math.abs(varianceAmount) + paymentAtRisk * 0.08).toLocaleString(),
    baseBurn: dailyBurn.toLocaleString(),
    acceleration: String(Math.round(kpi.dailyBurn?.trendPercent || 0)),
    delayCosts: Math.round(paymentAtRisk * 0.08).toLocaleString(),
    effectiveBurn: Math.round(dailyBurn + paymentAtRisk * 0.08).toLocaleString(),
    riskCount: String(activeRiskCount || 1),
    combinedProbability: String(probabilityBase),
    atRiskProjects: String(hasDelayLayer(inputs) ? 1 : 0),
    pipelineRisk: String(clamp(biggestClientPercent, 0, 100)),
    surplusCash: Math.max(0, toNumber(inputs.essentials.cashInBank) - toNumber(inputs.essentials.monthlyBills)).toLocaleString(),
    surplusRevenue: Math.max(0, varianceAmount).toLocaleString(),
    stableMonths: (kpi.cashRunway?.baseRunway || 0) >= 90 ? "6" : "3",
  };

  const replaceVars = (text: string) =>
    text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || `{{${key}}}`);

  return {
    templateId: template.id,
    headline: replaceVars(template.headline),
    unseenRisk: replaceVars(template.unseenRisk),
    contextualImpact: replaceVars(template.contextualImpact),
    recommendation: replaceVars(template.recommendation),
    riskLevel,
    probability: probabilityBase,
    activeTab: "story",
  };
}

/** Generates risk trigger bridges that link operational delays to financial impact */
function generateRiskBridge(inputs: AllInputs, kpi: DecisionCenterData["kpi"], language: DecisionLanguage): RiskBridgePair[] {
  const pairs: RiskBridgePair[] = [];
  const delayProbability = calculateDelayProbability(inputs);

  if (hasDelayLayer(inputs) && kpi.cashRunway && (kpi.cashRunway.status === "warning" || kpi.cashRunway.status === "critical")) {
    pairs.push({
      id: "cash-to-delay",
      triggerType: "finance",
      triggerCondition: language === "id" ? "Buffer kas tipis" : "Thin cash buffer",
      triggerValue: `${kpi.cashRunway.baseRunway} days`,
      effect: language === "id" ? "Tekanan pengiriman" : "Delivery pressure",
      effectDescription: language === "id" ? "Bantalan kas yang tipis menyisakan lebih sedikit ruang untuk menahan proyek yang telat atau menambah bantuan darurat." : "Thin cash leaves less room to absorb project slippage or add emergency help.",
      isActive: true,
    });
  }

  if (hasDelayLayer(inputs)) {
    pairs.push({
      id: "delay-to-cash",
      triggerType: "operations",
      triggerCondition: language === "id" ? "Risiko timeline proyek" : "Project timeline risk",
      triggerValue: `${delayProbability}%`,
      effect: language === "id" ? "Risiko penagihan kas" : "Cash collection risk",
      effectDescription: language === "id" ? `${toNumber(inputs.delayRisk.paymentAtRisk).toLocaleString()} bisa masuk lebih lambat dari rencana.` : `${toNumber(inputs.delayRisk.paymentAtRisk).toLocaleString()} may arrive later than planned.`,
      isActive: true,
    });
  }

  if (toNumber(inputs.essentials.biggestClientPercent) >= 40) {
    pairs.push({
      id: "client-to-cash",
      triggerType: "finance",
        triggerCondition: language === "id" ? "Ketergantungan klien tinggi" : "High client dependency",
        triggerValue: `${toNumber(inputs.essentials.biggestClientPercent)}%`,
        effect: language === "id" ? "Posisi negosiasi melemah" : "Negotiation weakness",
        effectDescription: language === "id" ? "Satu keterlambatan dari klien bisa menekan keputusan kas dan delivery sekaligus." : "One client delay can pressure both cash and delivery decisions.",
      isActive: true,
    });
  }

  return pairs;
}

/** Constructs a domino chain visualization of cascading business risks */
function generateDominoChain(inputs: AllInputs, kpi: DecisionCenterData["kpi"], language: DecisionLanguage): DominoChain | null {
  if (!kpi.cashRunway) return null;

  const nodes: DominoNode[] = [
    {
      step: 1,
      label: kpi.cashRunway.status === "critical" ? (language === "id" ? "Tekanan kas sudah langsung terasa" : "Cash pressure is immediate") : (language === "id" ? "Ruang kas mulai menyempit" : "Cash room is narrowing"),
      impact: language === "id" ? `${kpi.cashRunway.baseRunway} hari runway pada tingkat biaya saat ini` : `${kpi.cashRunway.baseRunway} days of runway at current bills`,
      color: "scarlet",
    },
  ];

  if (hasDelayLayer(inputs)) {
    nodes.push({
      step: 2,
      label: language === "id" ? "Timing proyek mulai krusial" : "Project timing starts to matter",
      impact: language === "id" ? `${toNumber(inputs.delayRisk.bufferDays)} hari buffer tersisa sebelum risiko delivery muncul` : `${toNumber(inputs.delayRisk.bufferDays)} buffer days left before delivery risk shows up`,
      color: "amber",
    });
    nodes.push({
      step: 3,
      label: language === "id" ? "Timing pembayaran ikut tertarik oleh delivery" : "Payment timing gets pulled with delivery",
      impact: language === "id" ? `${toNumber(inputs.delayRisk.paymentAtRisk).toLocaleString()} menjadi sensitif terhadap slip jadwal` : `${toNumber(inputs.delayRisk.paymentAtRisk).toLocaleString()} becomes sensitive to schedule slip`,
      color: "steel",
    });
  } else {
    nodes.push({
      step: 2,
      label: language === "id" ? "Tabungan kas tipis bikin risiko makin bahaya" : "Thin cash makes risks more dangerous",
      impact: language === "id" ? "Pemasukan mepet dan terlalu bergantung pada satu klien" : "Small income gap and high client dependency",
      color: "amber",
    });
  }

  nodes.push({
    step: nodes.length + 1,
    label: language === "id" ? "Ketergantungan memperbesar dampak" : "Dependency amplifies the damage",
    impact: language === "id" ? `${toNumber(inputs.essentials.biggestClientPercent)}% pemasukan bergantung pada satu relasi` : `${toNumber(inputs.essentials.biggestClientPercent)}% of income depends on one relationship`,
    color: "steel",
  });

  nodes.push({
    step: nodes.length + 1,
    label: kpi.cashRunway.status === "critical" ? (language === "id" ? "Anda dipaksa masuk ke keputusan reaktif" : "You are forced into reactive decisions") : (language === "id" ? "Anda kehilangan fleksibilitas strategis" : "You lose strategic flexibility"),
    impact: kpi.cashRunway.status === "critical" ? (language === "id" ? "Memotong biaya, menunda, atau meminjam jadi mendesak" : "Cutting, delaying, or borrowing becomes urgent") : (language === "id" ? "Pilihan yang baik semakin sulit saat waktu menipis" : "Good choices become harder as time shrinks"),
    color: "neutral",
  });

  return {
    nodes,
    probability: Math.max(35, calculateDelayProbability(inputs), kpi.cashRunway.status === "critical" ? 80 : 55),
  };
}

/** Prepares datasets for the dashboard charts (revenue gap, MC distribution, LFI) */
function buildCharts(inputs: AllInputs, kpi: DecisionCenterData["kpi"]): ChartData {
  const bills = toNumber(inputs.essentials.monthlyBills);
  const revenue = toNumber(inputs.essentials.monthlyRevenue);
  const delayRisk = calculateDelayProbability(inputs);
  const composite = getCompositeRiskScore(inputs, kpi);

  // Dynamic probabilities based on risk levels
  const score = composite.score;
  const isHighRisk = score >= 60;
  const isLowRisk = score <= 30;

  // Base ranges: Worst (15-35), Base (45-60), Best (10-30)
  const worstProb = isHighRisk ? 32 : isLowRisk ? 12 : 22;
  const bestProb = isLowRisk ? 35 : isHighRisk ? 12 : 23;
  const baseProb = 100 - worstProb - bestProb;

  return {
    revenueGap: {
      weeks: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
      actual: [revenue * 0.23, revenue * 0.24, revenue * 0.26, revenue * 0.27, revenue * 0.24, revenue * 0.22, revenue * 0.21, revenue * 0.2],
      target: Array(8).fill((kpi.monthlyRevenue?.targetRevenue ?? bills) * 0.25),
      projected: [0, 0, 0, 0, revenue * 0.24, revenue * 0.23, revenue * 0.22, revenue * 0.2],
    },
    lfi: {
      score: Math.min(100, Math.round(composite.score * 0.9 + Math.max(0, delayRisk - 35) * 0.2)),
      daysCover: kpi.cashRunway?.baseRunway || 0,
      currentRatio: bills > 0 ? toNumber(inputs.essentials.cashInBank) / bills : 0,
      arAtRisk: toNumber(inputs.delayRisk.paymentAtRisk),
    },
    monteCarlo: {
      worst: { probability: worstProb, outcome: Math.max(0, toNumber(inputs.essentials.cashInBank) - bills * 2) },
      base: { probability: baseProb, outcome: Math.max(0, toNumber(inputs.essentials.cashInBank) - bills) },
      best: { probability: bestProb, outcome: Math.max(0, toNumber(inputs.essentials.cashInBank) + Math.max(0, revenue - bills)) },
      distribution: [],
    },
  };
}

/** Prepares individual risk category scores and trends for the visual radar */
function buildRiskScores(inputs: AllInputs, kpi: DecisionCenterData["kpi"], language: DecisionLanguage): RiskScore[] {
  const delayProbability = hasDelayLayer(inputs) ? calculateDelayProbability(inputs) : 0;
  const dependency = toNumber(inputs.essentials.biggestClientPercent);
  const variancePercent = kpi.monthlyRevenue?.variancePercent || 0;
  const composite = getCompositeRiskScore(inputs, kpi);
  const revenueRisk = composite.components.revenueRisk;
  const dependencyRisk = composite.components.clientRisk;

  const scores: RiskScore[] = [
    {
      category: language === "id" ? "Risiko keseluruhan berbobot" : "Weighted overall risk",
      score: composite.score,
      trend: composite.score >= 55 ? "worsening" : composite.score <= 30 ? "improving" : "stable",
      exposureWidth: 0,
    },
    {
      category: language === "id" ? "Ketahanan kas" : "Cash resilience",
      score: composite.components.runwayRisk,
      trend: (kpi.cashRunway?.baseRunway || 0) >= 60 ? "improving" : (kpi.cashRunway?.baseRunway || 0) < 45 ? "worsening" : "stable",
      exposureWidth: 0,
    },
  ];

  if (hasDelayLayer(inputs)) {
    scores.push({
      category: language === "id" ? "Eksposur delay" : "Delay exposure",
      score: delayProbability,
      trend: delayProbability >= 45 ? "worsening" : delayProbability === 0 ? "improving" : "stable",
      exposureWidth: 0,
    });
  }

  scores.push(
    {
      category: language === "id" ? "Ketergantungan klien" : "Client dependency",
      score: dependencyRisk,
      trend: dependency >= 40 ? "worsening" : "stable",
      exposureWidth: 0,
    },
    {
      category: language === "id" ? "Pendapatan vs biaya" : "Income vs bills",
      score: revenueRisk,
      trend: variancePercent < 0 ? "worsening" : "improving",
      exposureWidth: 0,
    }
  );

  return scores;
}

/** Calculates the projected outcome of a specific interactive what-if scenario */
function buildScenarioOutput(inputs: AllInputs, kpi: DecisionCenterData["kpi"], language: DecisionLanguage): ScenarioOutput | null {
  if (!kpi.cashRunway) return null;

  const cashInjection = toNumber(inputs.scenario.cashInjection);
  const overheadReduction = toNumber(inputs.scenario.overheadReduction);
  const newMonthlyBills = Math.max(0, toNumber(inputs.essentials.monthlyBills) - overheadReduction);
  const projectedRunway = newMonthlyBills > 0
    ? Math.floor((toNumber(inputs.essentials.cashInBank) + cashInjection) / (newMonthlyBills / 30))
    : kpi.cashRunway.baseRunway;

  return {
    projectedRunway,
    runwayDelta: projectedRunway - kpi.cashRunway.baseRunway,
    revenueGapProjection: Math.max(0, newMonthlyBills - toNumber(inputs.essentials.monthlyRevenue)),
    gapDelta: Math.max(0, overheadReduction),
    shieldLevel: projectedRunway >= 90 ? 3 : projectedRunway >= 60 ? 2 : projectedRunway >= 30 ? 1 : 0,
    narrativeSummary: projectedRunway > kpi.cashRunway.baseRunway
      ? language === "id" ? "Skenario ini memberi Anda lebih banyak waktu untuk mengambil keputusan." : "This scenario buys you more time to make decisions."
      : language === "id" ? "Skenario ini tidak memperbaiki posisi Anda secara material." : "This scenario does not materially improve your current position.",
  };
}

/** Calculates the resilience shield levels based on cash and operational health */
function calculateShield(kpi: DecisionCenterData["kpi"], inputs: AllInputs): ResilienceShield {
  const lfi = Math.min(100, kpi.cashRunway?.status === "critical" ? 80 : kpi.cashRunway?.status === "warning" ? 60 : 28);
  const runway = kpi.cashRunway?.baseRunway || 0;
  const revenueGap = Math.abs(kpi.monthlyRevenue?.variancePercent || 0);
  const level: 0 | 1 | 2 | 3 = runway >= 90 ? 3 : runway >= 60 ? 2 : runway >= 30 ? 1 : 0;

  return {
    level,
    conditions: {
      lfi,
      runway,
      revenueGap,
      compliance: 100,
      currentRatio: toNumber(inputs.essentials.monthlyBills) > 0 ? toNumber(inputs.essentials.cashInBank) / toNumber(inputs.essentials.monthlyBills) : 0,
      burnTrend: (kpi.dailyBurn?.isAccelerating ? "increasing" : "stable") as "stable" | "increasing" | "decreasing",
      projectsOnSchedule: hasDelayLayer(inputs) ? toNumber(inputs.delayRisk.bufferDays) > 3 : true,
    },
  };
}

/** Core engine entry point that calculates all Decision Center intelligence layers */
export function calculateDecisionCenter(rawInputs: AllInputs, language: DecisionLanguage = "en"): DecisionCenterData {
  const inputs = applyScenario(rawInputs);

  const kpi = {
    cashRunway: calculateCashRunway(inputs),
    monthlyRevenue: calculateMonthlyRevenue(inputs),
    dailyBurn: calculateDailyBurn(inputs),
    compliance: calculateCompliance(),
  };

  const narrative = generateNarrative(inputs, kpi, language);
  const riskBridge = generateRiskBridge(inputs, kpi, language);
  const dominoChain = generateDominoChain(inputs, kpi, language);
  const charts = buildCharts(inputs, kpi);
  const riskScores = buildRiskScores(inputs, kpi, language);
  const scenarioOutput = buildScenarioOutput(inputs, kpi, language);
  const shield = calculateShield(kpi, inputs);

  return {
    kpi,
    narrative,
    riskBridge,
    dominoChain,
    charts,
    analysis: { riskScores, scenarioOutput },
    shield,
    isCalculating: false,
    lastUpdated: new Date(),
  };
}

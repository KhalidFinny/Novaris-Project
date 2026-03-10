import { createRequire as VPV_createRequire } from "node:module";
import { fileURLToPath as VPV_fileURLToPath } from "node:url";
import { dirname as VPV_dirname } from "node:path";
const require = VPV_createRequire(import.meta.url);
const __filename = VPV_fileURLToPath(import.meta.url);
const __dirname = VPV_dirname(__filename);


// src/lib/engine/narrativeTemplates.ts
var NARRATIVE_TEMPLATES = [
  // ============================================
  // CATEGORY 1: CASH-FOCUSED (8 templates)
  // ============================================
  {
    id: "cash-01",
    category: "cash",
    priority: 100,
    conditions: {
      cashRunwayStatus: "critical",
      maxRunwayDays: 30
    },
    headline: "You are 30 days from a cash crisis.",
    unseenRisk: "The cliff is closer than it appears. One delayed client payment or unexpected expense will force emergency decisions.",
    contextualImpact: "At current burn, cash runs out in {{runwayDays}} days. Any project delay or collection problem accelerates this to {{acceleratedDays}} days.",
    recommendation: "Immediately: defer non-essential payments, accelerate AR collection, and secure bridge financing as backup.",
    riskLevel: "critical"
  },
  {
    id: "cash-02",
    category: "cash",
    priority: 95,
    conditions: {
      cashRunwayStatus: "warning",
      minRunwayDays: 30,
      maxRunwayDays: 45
    },
    headline: "Your cash buffer is thinning.",
    unseenRisk: "The 'liquidity trap' \u2014 you have enough cash for normal operations but not enough to absorb shocks.",
    contextualImpact: "{{runwayDays}} days of runway sounds safe, but it only covers {{shockAbsorption}} simultaneous problems before critical.",
    recommendation: "Build a 3-month cash reserve. Reduce discretionary spend and renegotiate payment terms with vendors.",
    riskLevel: "high"
  },
  {
    id: "cash-03",
    category: "cash",
    priority: 90,
    conditions: {
      cashRunwayStatus: "warning",
      projectDelayActive: true
    },
    headline: "Project delays are draining your liquidity.",
    unseenRisk: "Each delayed day burns {{dailyBurn}} while blocking {{blockedPayment}} in receivables. A compound cost.",
    contextualImpact: "Active delays have already consumed {{consumedDays}} days of runway. Without intervention, this cascade continues.",
    recommendation: "Prioritize completing {{projectName}} to unblock the payment. Consider temporary resources to accelerate delivery.",
    riskLevel: "high"
  },
  {
    id: "cash-04",
    category: "cash",
    priority: 85,
    conditions: {
      burnAccelerating: true,
      cashRunwayStatus: "monitor"
    },
    headline: "Your burn rate is accelerating.",
    unseenRisk: "Expense growth is outpacing revenue. What looks like investment is actually eroding your safety margin.",
    contextualImpact: "Burn increased {{burnTrend}}% this month. If this continues, runway drops from {{currentRunway}} to {{projectedRunway}} days.",
    recommendation: "Audit last 30 days of expenses. Categorize as essential vs. discretionary. Pause the latter immediately.",
    riskLevel: "medium"
  },
  {
    id: "cash-05",
    category: "cash",
    priority: 80,
    conditions: {
      cashRunwayStatus: "critical",
      burnAccelerating: true
    },
    headline: "Double jeopardy: low cash and rising burn.",
    unseenRisk: "The worst combination \u2014 you're running out of money while spending accelerates. This is a death spiral pattern.",
    contextualImpact: "With only {{runwayDays}} days left and burn up {{burnTrend}}%, you have {{effectiveDays}} effective days before crisis.",
    recommendation: "Emergency triage: cut all non-essential spend today, call your top 3 clients for early payments, and model worst-case scenarios.",
    riskLevel: "critical"
  },
  {
    id: "cash-06",
    category: "cash",
    priority: 75,
    conditions: {
      cashRunwayStatus: "safe",
      minRunwayDays: 60
    },
    headline: "Your cash position is stable.",
    unseenRisk: "Complacency is the hidden risk. Strong cash can mask operational inefficiencies until they compound.",
    contextualImpact: "{{runwayDays}} days of runway provides solid protection. You can absorb {{shockCount}} major shocks simultaneously.",
    recommendation: "Maintain discipline. Use this stability to invest strategically, not to relax cost controls.",
    riskLevel: "low"
  },
  {
    id: "cash-07",
    category: "cash",
    priority: 70,
    conditions: {
      cashRunwayStatus: "warning"
    },
    headline: "You're living invoice-to-invoice.",
    unseenRisk: "Your runway is sustained by expected collections, not actual cash. If AR delays, the picture changes rapidly.",
    contextualImpact: "{{arDependency}}% of your runway depends on collections. If payments are 2 weeks late, effective runway is {{adjustedRunway}} days.",
    recommendation: "Diversify cash sources. Reduce dependence on single large invoices. Build a 45-day pure cash reserve.",
    riskLevel: "high"
  },
  {
    id: "cash-08",
    category: "cash",
    priority: 65,
    conditions: {
      cashRunwayStatus: "monitor",
      minRunwayDays: 45,
      maxRunwayDays: 60
    },
    headline: "Comfortable now, but watch the trend.",
    unseenRisk: "The plateau before the drop. Many businesses feel safe at 45-60 days, then get surprised by a sudden acceleration.",
    contextualImpact: "Current position is adequate, but there's limited room for error. One major unexpected expense changes everything.",
    recommendation: "Extend runway to 90 days. Focus on recurring revenue streams that provide predictable inflows.",
    riskLevel: "medium"
  },
  // ============================================
  // CATEGORY 2: PROJECT-FOCUSED (7 templates)
  // ============================================
  {
    id: "project-01",
    category: "project",
    priority: 90,
    conditions: {
      projectDelayActive: true,
      cashRunwayStatus: "warning"
    },
    headline: "Project delays are creating a cash chokehold.",
    unseenRisk: "The delivery-payment cycle is broken. Each delayed milestone blocks cash that was already committed in your plans.",
    contextualImpact: "{{projectName}} delay has blocked {{blockedAmount}} for {{delayDays}} days. That's {{opportunityCost}} in lost opportunities.",
    recommendation: "Resource surge: add temporary capacity to {{projectName}} specifically. The cost is less than the blocked payment impact.",
    riskLevel: "high"
  },
  {
    id: "project-02",
    category: "project",
    priority: 85,
    conditions: {
      projectDelayActive: true
    },
    headline: "One delayed project is destabilizing your pipeline.",
    unseenRisk: "The domino effect. Delayed resources on Project A cannot start Project B, creating a cascade of commitments.",
    contextualImpact: "{{projectName}} delay affects {{affectedProjects}} other projects. Combined delay exposure is {{totalExposure}}.",
    recommendation: "Isolate the bottleneck. Either complete {{projectName}} fast or descope it to free resources for other projects.",
    riskLevel: "medium"
  },
  {
    id: "project-03",
    category: "project",
    priority: 80,
    conditions: {
      projectDelayActive: true
    },
    headline: "Your team is locked in a stalled project.",
    unseenRisk: "Sunk cost fallacy in action. Continuing to burn resources on a stalled project prevents starting revenue-generating work.",
    contextualImpact: "{{teamSize}} people on {{projectName}} for {{stalledDays}} days with zero progress. That's {{burnedAmount}} with no return.",
    recommendation: "Make a hard decision: either inject resources to finish in 7 days or formally pause and reassign the team.",
    riskLevel: "high"
  },
  {
    id: "project-04",
    category: "project",
    priority: 75,
    conditions: {
      projectDelayActive: true
    },
    headline: "Supplier delays are threatening your commitments.",
    unseenRisk: "Your reputation is at risk. External dependencies are pushing you toward breaking client promises.",
    contextualImpact: "Supplier variance of {{varianceDays}} days puts you {{riskDays}} days past your client commitment. Penalties may apply.",
    recommendation: "Immediate client communication: reset expectations now rather than fail later. Source backup suppliers for critical components.",
    riskLevel: "medium"
  },
  {
    id: "project-05",
    category: "project",
    priority: 70,
    conditions: {
      projectDelayActive: true
    },
    headline: "Scope creep is killing your timeline.",
    unseenRisk: "The project is no longer the project you estimated. Each 'small addition' compounds into significant delay.",
    contextualImpact: "Original timeline: {{originalDays}} days. Current projection: {{currentDays}} days. Scope added {{scopePercent}}% more work.",
    recommendation: "Scope freeze: no new features for 30 days. Finish current commitments before expanding. Document change requests for future phase.",
    riskLevel: "medium"
  },
  {
    id: "project-06",
    category: "project",
    priority: 65,
    conditions: {
      projectDelayActive: false
    },
    headline: "Projects are on track, but margins are tight.",
    unseenRisk: "On-time delivery masks underlying fragility. Small disruptions will push you into delay territory quickly.",
    contextualImpact: "Current buffer: {{bufferDays}} days. Industry variance is typically {{typicalVariance}} days. Little room for error.",
    recommendation: "Build 15% time buffer into all future project phases. Protect the margin that keeps you on schedule.",
    riskLevel: "low"
  },
  {
    id: "project-07",
    category: "project",
    priority: 60,
    conditions: {
      projectDelayActive: true
    },
    headline: "Client confidence is eroding with each delay.",
    unseenRisk: "Intangible but critical. Repeated delays damage relationships that took years to build. Recovery is expensive.",
    contextualImpact: "{{clientName}} has experienced {{delayCount}} delays. Relationship risk score: {{riskScore}}/100. Approaching threshold.",
    recommendation: "Proactive retention: call the client today. Acknowledge the delay, explain the fix, and offer tangible compensation.",
    riskLevel: "high"
  },
  // ============================================
  // CATEGORY 3: REVENUE-FOCUSED (6 templates)
  // ============================================
  {
    id: "revenue-01",
    category: "revenue",
    priority: 85,
    conditions: {
      revenueGapPercent: 20,
      maxRevenueGapPercent: 0
    },
    headline: "You're falling behind your revenue target.",
    unseenRisk: "The gap compounds. Each month of shortfall makes the annual target harder to achieve, requiring unsustainable catch-up.",
    contextualImpact: "Current gap: {{gapAmount}} ({{gapPercent}}% below target). To hit annual goal, you need {{requiredGrowth}}% growth next month.",
    recommendation: "Immediate pipeline audit: identify deals that can close this month. Consider promotional pricing to accelerate decisions.",
    riskLevel: "medium"
  },
  {
    id: "revenue-02",
    category: "revenue",
    priority: 80,
    conditions: {
      revenueGapPercent: 40,
      maxRevenueGapPercent: 0
    },
    headline: "Revenue shortfall is becoming a structural problem.",
    unseenRisk: "This isn't a bad month\u2014it's a pattern. Persistent gaps indicate market, pricing, or execution issues.",
    contextualImpact: "{{consecutiveMonths}} consecutive months below target. Cumulative gap: {{cumulativeGap}}. Annual target at risk.",
    recommendation: "Strategic review: analyze win/loss rates, competitor pricing, and market positioning. Consider pivot or pricing change.",
    riskLevel: "high"
  },
  {
    id: "revenue-03",
    category: "revenue",
    priority: 75,
    conditions: {
      revenueGapPercent: 10,
      maxRevenueGapPercent: 0
    },
    headline: "Revenue is close to target but trending down.",
    unseenRisk: "The slope matters more than the position. A small gap with negative momentum is more dangerous than a larger gap with positive momentum.",
    contextualImpact: "Gap is only {{gapPercent}}%, but trend is {{trendDirection}} at {{trendRate}}% per month. Momentum is concerning.",
    recommendation: "Accelerate near-term closes. Focus on low-friction deals that can sign this week to reverse the trend.",
    riskLevel: "medium"
  },
  {
    id: "revenue-04",
    category: "revenue",
    priority: 70,
    conditions: {
      minClientDependencyPercent: 40
    },
    headline: "One client represents a concentration risk.",
    unseenRisk: "Over-dependence. Losing this client would create an immediate crisis. Yet most resources are dedicated to keeping them happy.",
    contextualImpact: "{{topClient}} represents {{concentrationPercent}}% of revenue. If they delay or leave, you lose {{impactAmount}} immediately.",
    recommendation: "Client diversification initiative. Set target: no client >30% of revenue. Prioritize new client acquisition this quarter.",
    riskLevel: "medium"
  },
  {
    id: "revenue-05",
    category: "revenue",
    priority: 65,
    conditions: {
      revenueGapPercent: -10,
      cashRunwayStatus: "safe"
    },
    headline: "You're ahead of target, but is it sustainable?",
    unseenRisk: "Success blindness. Strong revenue can hide operational strain that will surface when growth normalizes.",
    contextualImpact: "{{surplusAmount}} above target. However, delivery capacity is at {{capacity}}%. Quality or timeline risks emerging.",
    recommendation: "Invest the surplus in capacity building: hire, train, and systematize before taking on more growth.",
    riskLevel: "low"
  },
  {
    id: "revenue-06",
    category: "revenue",
    priority: 60,
    conditions: {
      revenueGapPercent: 15,
      maxRevenueGapPercent: 0
    },
    headline: "Seasonal downturn is deeper than expected.",
    unseenRisk: "You planned for seasonality, but this dip exceeds historical patterns. Something fundamental may have shifted.",
    contextualImpact: "Current decline is {{variance}}% worse than historical seasonal pattern. Market conditions may have changed.",
    recommendation: "Don't assume automatic recovery. Adjust quarterly plan. Cut discretionary spend to match lower revenue reality.",
    riskLevel: "medium"
  },
  // ============================================
  // CATEGORY 4: COMPOUND RISKS (6 templates)
  // ============================================
  {
    id: "compound-01",
    category: "compound",
    priority: 100,
    conditions: {
      multipleRisks: true,
      cashRunwayStatus: "critical",
      projectDelayActive: true
    },
    headline: "Perfect storm: cash crisis meets project failure.",
    unseenRisk: "The most dangerous combination. You have neither the cash to absorb problems nor the operational capacity to prevent them.",
    contextualImpact: "Cash: {{runwayDays}} days. Active delays: {{delayCount}}. Blocked payments: {{blockedAmount}}. This is a survival situation.",
    recommendation: "Emergency protocols: halt all non-critical projects, call all clients for early payments, cut burn by 30% this week.",
    riskLevel: "critical"
  },
  {
    id: "compound-02",
    category: "compound",
    priority: 95,
    conditions: {
      multipleRisks: true,
      cashRunwayStatus: "warning",
      revenueGapPercent: 20,
      maxRevenueGapPercent: 0
    },
    headline: "Cash pressure + revenue gap = time bomb.",
    unseenRisk: "You can't cost-cut your way out of this. Revenue gap means you need to spend more (sales, marketing), but cash says spend less.",
    contextualImpact: "Runway: {{runwayDays}} days. Revenue gap: {{gapPercent}}%. Classic growth vs. survival dilemma. Decision required.",
    recommendation: "Surgical approach: cut non-revenue costs aggressively while protecting sales investment. Focus on quick-win revenue.",
    riskLevel: "high"
  },
  {
    id: "compound-03",
    category: "compound",
    priority: 90,
    conditions: {
      multipleRisks: true,
      projectDelayActive: true,
      revenueGapPercent: 15,
      maxRevenueGapPercent: 0
    },
    headline: "Operations and revenue are in a death spiral.",
    unseenRisk: "Project delays block cash. Cash shortage prevents growth investment. Revenue falls further. The cycle feeds itself.",
    contextualImpact: "Delay cost: {{delayCost}}. Revenue gap: {{gapAmount}}. Combined monthly bleed: {{totalBleed}}. Unsustainable.",
    recommendation: "Break the cycle at one point: either unblock projects with emergency resources OR accept lower revenue and cut costs accordingly. Doing both halfway fails.",
    riskLevel: "critical"
  },
  {
    id: "compound-04",
    category: "compound",
    priority: 85,
    conditions: {
      multipleRisks: true,
      burnAccelerating: true,
      projectDelayActive: true
    },
    headline: "Three forces are accelerating your cash burn.",
    unseenRisk: "Rising expenses + blocked receivables + delay costs. Each amplifies the others. Linear thinking won't solve this.",
    contextualImpact: "Base burn: {{baseBurn}}. Acceleration: {{acceleration}}%. Delay costs: {{delayCosts}}. Effective burn: {{effectiveBurn}}.",
    recommendation: "Immediate triage: which of the three can you impact fastest? Usually it's expense control. Cut deep, cut fast.",
    riskLevel: "high"
  },
  {
    id: "compound-05",
    category: "compound",
    priority: 80,
    conditions: {
      multipleRisks: true
    },
    headline: "Multiple risk chains are converging.",
    unseenRisk: "Independent problems are creating compound effects. The math is multiplicative, not additive.",
    contextualImpact: "{{riskCount}} active risk chains. Individual severity: moderate. Combined probability of crisis: {{combinedProbability}}%.",
    recommendation: "Don't try to solve everything. Pick the one chain that, if broken, collapses the others. Focus there.",
    riskLevel: "high"
  },
  {
    id: "compound-06",
    category: "compound",
    priority: 75,
    conditions: {
      multipleRisks: true
    },
    headline: "You're stable now, but three triggers are armed.",
    unseenRisk: "Current calm is deceptive. Multiple conditions are at threshold. One external shock detonates all three simultaneously.",
    contextualImpact: "Cash: {{runwayDays}} days (thin buffer). Projects: {{atRiskProjects}} near delay threshold. Revenue: {{pipelineRisk}}% pipeline at risk.",
    recommendation: "Pre-position for shock: build 30-day cash buffer, secure backup suppliers, diversify top client exposure. Act while you have time.",
    riskLevel: "medium"
  },
  // ============================================
  // CATEGORY 5: OPPORTUNITY/POSITIVE (3 templates)
  // ============================================
  {
    id: "opportunity-01",
    category: "opportunity",
    priority: 50,
    conditions: {
      cashRunwayStatus: "safe",
      minRunwayDays: 90
    },
    headline: "You're in a position of strength.",
    unseenRisk: "The risk of strength is complacency. Strong cash position can lead to undisciplined spending.",
    contextualImpact: "{{runwayDays}} days of runway. You can absorb {{shockCapacity}} major shocks. This is operational freedom.",
    recommendation: "Use this position strategically: invest in growth, hire key talent, or acquire competitors. Don't fritter it away.",
    riskLevel: "low"
  },
  {
    id: "opportunity-02",
    category: "opportunity",
    priority: 45,
    conditions: {
      cashRunwayStatus: "safe",
      revenueGapPercent: -20,
      maxClientDependencyPercent: 35
    },
    headline: "Strong cash and strong revenue create optionality.",
    unseenRisk: "Analysis paralysis. Too many good options can lead to choosing none while the moment passes.",
    contextualImpact: "{{surplusCash}} surplus cash. {{surplusRevenue}} above revenue target. Rare combination. Window is open.",
    recommendation: "Make one bold move. Pick your highest-conviction opportunity and commit resources fully. Partial efforts waste this moment.",
    riskLevel: "low"
  },
  {
    id: "opportunity-03",
    category: "opportunity",
    priority: 40,
    conditions: {
      cashRunwayStatus: "safe",
      projectDelayActive: false,
      maxClientDependencyPercent: 40
    },
    headline: "Resilience proven-you've earned strategic flexibility.",
    unseenRisk: "Past success doesn't guarantee future results. Market conditions shift. Today's resilience can become tomorrow's rigidity.",
    contextualImpact: "You've maintained strong position through {{stableMonths}} months. Systems are working. Time to optimize, not just survive.",
    recommendation: "Shift from defense to offense. Increase growth investments by 15%. Test new markets or products while you have cushion.",
    riskLevel: "low"
  },
  {
    id: "opportunity-04",
    category: "opportunity",
    priority: 55,
    conditions: {
      cashRunwayStatus: "safe",
      projectDelayActive: false,
      revenueGapPercent: -10,
      maxClientDependencyPercent: 30
    },
    headline: "Your business has room to choose, not just react.",
    unseenRisk: "Strong numbers can tempt you to chase too many ideas at once. Focus still matters when the pressure is low.",
    contextualImpact: "Runway is at {{runwayDays}} days and revenue is {{gapPercent}}% above target. That gives you time and momentum together.",
    recommendation: "Use the cushion deliberately: pick one growth bet, fund it fully, and protect the discipline that created this position.",
    riskLevel: "low"
  },
  {
    id: "opportunity-05",
    category: "opportunity",
    priority: 52,
    conditions: {
      cashRunwayStatus: "safe",
      projectDelayActive: false,
      maxRevenueGapPercent: 5,
      maxClientDependencyPercent: 25
    },
    headline: "Your foundations look healthy across cash, delivery, and client mix.",
    unseenRisk: "Healthy systems are easy to underinvest in because nothing feels urgent. Quiet strength still needs maintenance.",
    contextualImpact: "Cash covers {{runwayDays}} days, projects are staying on track, and no single client dominates your income.",
    recommendation: "Document the habits behind this stability now. Strong operating rhythm is what keeps a good quarter from becoming a lucky one.",
    riskLevel: "low"
  },
  {
    id: "opportunity-06",
    category: "opportunity",
    priority: 48,
    conditions: {
      cashRunwayStatus: "safe",
      revenueGapPercent: -5,
      maxClientDependencyPercent: 35
    },
    headline: "Revenue is clearing the bar and your buffer is holding.",
    unseenRisk: "This is the moment to strengthen systems before growth makes each weak point more expensive to fix.",
    contextualImpact: "You are ahead by {{surplusAmount}} versus target while still carrying {{runwayDays}} days of runway. That is genuine breathing room.",
    recommendation: "Turn the surplus into resilience: tighten collections, improve delivery capacity, and keep client concentration below 30%.",
    riskLevel: "low"
  }
];
function selectTemplate(conditions, inputs) {
  const matching = NARRATIVE_TEMPLATES.filter((template) => {
    const cond = template.conditions;
    if (cond.cashRunwayStatus && conditions.cashRunwayStatus !== cond.cashRunwayStatus) {
      return false;
    }
    if (cond.minRunwayDays !== void 0 && inputs.runwayDays < cond.minRunwayDays) {
      return false;
    }
    if (cond.maxRunwayDays !== void 0 && inputs.runwayDays > cond.maxRunwayDays) {
      return false;
    }
    if (cond.projectDelayActive !== void 0 && conditions.projectDelayActive !== cond.projectDelayActive) {
      return false;
    }
    if (cond.burnAccelerating !== void 0 && conditions.burnAccelerating !== cond.burnAccelerating) {
      return false;
    }
    if (cond.revenueGapPercent !== void 0) {
      if (cond.revenueGapPercent >= 0 && inputs.revenueGapPercent < cond.revenueGapPercent) {
        return false;
      }
      if (cond.revenueGapPercent < 0 && inputs.revenueGapPercent > cond.revenueGapPercent) {
        return false;
      }
    }
    if (cond.maxRevenueGapPercent !== void 0 && inputs.revenueGapPercent > cond.maxRevenueGapPercent) {
      return false;
    }
    if (cond.minClientDependencyPercent !== void 0 && inputs.clientDependencyPercent < cond.minClientDependencyPercent) {
      return false;
    }
    if (cond.maxClientDependencyPercent !== void 0 && inputs.clientDependencyPercent > cond.maxClientDependencyPercent) {
      return false;
    }
    if (cond.multipleRisks !== void 0 && conditions.multipleRisks !== cond.multipleRisks) {
      return false;
    }
    return true;
  });
  matching.sort((a, b) => b.priority - a.priority);
  return matching[0] || null;
}

// src/lib/engine/decisionCenterEngine.ts
var toNumber = (value) => value === "" ? 0 : Number(value);
var clamp = (value, min, max) => Math.min(max, Math.max(min, value));
var hasDelayLayer = (inputs) => Object.values(inputs.delayRisk).some((value) => value !== "");
var cloneInputs = (inputs) => ({
  ...inputs,
  essentials: { ...inputs.essentials },
  delayRisk: { ...inputs.delayRisk },
  scenario: { ...inputs.scenario }
});
function getRunwayRiskScore(runwayDays) {
  if (runwayDays <= 15) return 100;
  if (runwayDays <= 30) return 92;
  if (runwayDays <= 45) return 72;
  if (runwayDays <= 60) return 50;
  if (runwayDays <= 90) return 28;
  return 14;
}
function getRevenueRiskScore(variancePercent) {
  if (variancePercent >= 0) {
    return variancePercent >= 20 ? 6 : variancePercent >= 10 ? 10 : 14;
  }
  return clamp(Math.abs(variancePercent) * 2.2, 18, 100);
}
function getClientDependencyRiskScore(dependencyPercent) {
  if (dependencyPercent <= 15) return 12;
  if (dependencyPercent <= 30) return 28;
  if (dependencyPercent <= 40) return 46;
  if (dependencyPercent <= 55) return 68;
  return 88;
}
function getCompositeRiskScore(inputs, kpi) {
  const runwayRisk = getRunwayRiskScore(kpi.cashRunway?.baseRunway || 0);
  const revenueRisk = getRevenueRiskScore(kpi.monthlyRevenue?.variancePercent || 0);
  const delayRisk = hasDelayLayer(inputs) ? calculateDelayProbability(inputs) : 0;
  const clientRisk = getClientDependencyRiskScore(
    toNumber(inputs.essentials.biggestClientPercent)
  );
  const score = Math.round(
    runwayRisk * 0.4 + revenueRisk * 0.25 + delayRisk * 0.2 + clientRisk * 0.15
  );
  return {
    score,
    components: {
      runwayRisk,
      revenueRisk,
      delayRisk,
      clientRisk
    }
  };
}
function getRiskLevelFromScore(score) {
  if (score >= 78) return "critical";
  if (score >= 58) return "high";
  if (score >= 32) return "medium";
  return "low";
}
function applyScenario(inputs) {
  const scenario = inputs.activeScenario;
  if (!scenario) return inputs;
  const next = cloneInputs(inputs);
  if (scenario === "late-client") {
    next.essentials.cashInBank = Math.max(
      0,
      toNumber(next.essentials.cashInBank) - toNumber(next.delayRisk.paymentAtRisk) * 0.35
    );
  }
  if (scenario === "delay-2-weeks") {
    next.delayRisk.bufferDays = Math.max(0, toNumber(next.delayRisk.bufferDays) - 14);
  }
  if (scenario === "hire-one") {
    next.essentials.monthlyBills = toNumber(next.essentials.monthlyBills) + Math.max(1e3, toNumber(next.essentials.monthlyBills) * 0.12);
  }
  if (scenario === "costs-up") {
    next.essentials.monthlyBills = toNumber(next.essentials.monthlyBills) * 1.2;
  }
  if (scenario === "reset") {
    return { ...inputs, activeScenario: null };
  }
  return next;
}
function calculateCashRunway(inputs) {
  const cash = toNumber(inputs.essentials.cashInBank);
  const monthlyBills = toNumber(inputs.essentials.monthlyBills);
  if (!cash || !monthlyBills) return null;
  const dailyBurn = monthlyBills / 30;
  const baseRunway = Math.floor(cash / dailyBurn);
  const adjustedRunway = Math.floor((cash + Math.max(0, toNumber(inputs.essentials.monthlyRevenue) - monthlyBills)) / dailyBurn);
  let status = "safe";
  if (baseRunway < 30) status = "critical";
  else if (baseRunway < 45) status = "warning";
  else if (baseRunway < 60) status = "monitor";
  return { cashInBank: cash, monthlyBills, dailyBurnRate: dailyBurn, baseRunway, adjustedRunway, status };
}
function calculateMonthlyRevenue(inputs) {
  const revenue = toNumber(inputs.essentials.monthlyRevenue);
  const bills = toNumber(inputs.essentials.monthlyBills);
  const target = toNumber(inputs.essentials.monthlyRevenueTarget ?? "");
  if (!revenue && !bills) return null;
  const baseline = target > 0 ? target : bills;
  const variance = revenue - baseline;
  const variancePercent = baseline > 0 ? variance / baseline * 100 : 0;
  return {
    actualRevenue: revenue,
    targetRevenue: target > 0 ? target : null,
    breakEvenRevenue: bills,
    variance,
    variancePercent,
    isOnTrack: variance >= 0
  };
}
function calculateDailyBurn(inputs) {
  const bills = toNumber(inputs.essentials.monthlyBills);
  const revenue = toNumber(inputs.essentials.monthlyRevenue);
  if (!bills) return null;
  const currentRate = bills / 30;
  const trendPercent = revenue > 0 && bills > revenue ? Math.min(25, (bills - revenue) / revenue * 100) : 0;
  return {
    currentRate,
    trendPercent,
    isAccelerating: trendPercent > 15
  };
}
function calculateCompliance() {
  return null;
}
function calculateDelayProbability(inputs) {
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
function generateNarrative(inputs, kpi) {
  if (!kpi.cashRunway) return null;
  const delayProbability = calculateDelayProbability(inputs);
  const variancePercent = kpi.monthlyRevenue?.variancePercent || 0;
  const biggestClientPercent = toNumber(inputs.essentials.biggestClientPercent);
  const composite = getCompositeRiskScore(inputs, kpi);
  const activeRiskCount = [
    composite.components.runwayRisk >= 55,
    composite.components.revenueRisk >= 45,
    composite.components.delayRisk >= 45,
    composite.components.clientRisk >= 55
  ].filter(Boolean).length;
  const conditions = {
    cashRunwayStatus: kpi.cashRunway.status,
    projectDelayActive: hasDelayLayer(inputs) && delayProbability >= 45,
    burnAccelerating: kpi.dailyBurn?.isAccelerating || false,
    multipleRisks: activeRiskCount >= 2
  };
  const template = selectTemplate(conditions, {
    runwayDays: kpi.cashRunway.baseRunway,
    revenueGapPercent: variancePercent,
    clientDependencyPercent: biggestClientPercent
  });
  if (!template) return null;
  const paymentAtRisk = toNumber(inputs.delayRisk.paymentAtRisk);
  const revenue = toNumber(inputs.essentials.monthlyRevenue);
  const targetRevenue = kpi.monthlyRevenue?.targetRevenue ?? kpi.monthlyRevenue?.breakEvenRevenue ?? 0;
  const varianceAmount = kpi.monthlyRevenue?.variance || 0;
  const consumedDays = Math.max(3, 14 - toNumber(inputs.delayRisk.bufferDays));
  const varianceDays = Math.max(2, 10 - toNumber(inputs.delayRisk.bufferDays));
  const dailyBurn = Math.round(kpi.cashRunway?.dailyBurnRate || 0);
  const riskLevel = getRiskLevelFromScore(composite.score);
  const probabilityBase = clamp(
    Math.round(composite.score * 0.78 + (conditions.projectDelayActive ? 8 : 0)),
    18,
    95
  );
  const replaceVars = (text) => text.replace(/\{\{runwayDays\}\}/g, String(kpi.cashRunway?.baseRunway || 0)).replace(/\{\{acceleratedDays\}\}/g, String(Math.max(0, (kpi.cashRunway?.baseRunway || 0) - 10))).replace(/\{\{dailyBurn\}\}/g, dailyBurn.toLocaleString()).replace(/\{\{blockedPayment\}\}/g, paymentAtRisk.toLocaleString()).replace(/\{\{blockedAmount\}\}/g, paymentAtRisk.toLocaleString()).replace(/\{\{projectName\}\}/g, "your active project").replace(/\{\{consumedDays\}\}/g, String(consumedDays)).replace(/\{\{shockCount\}\}/g, kpi.cashRunway && kpi.cashRunway.baseRunway >= 60 ? "2" : "1").replace(/\{\{shockAbsorption\}\}/g, kpi.cashRunway && kpi.cashRunway.baseRunway >= 90 ? "3" : kpi.cashRunway && kpi.cashRunway.baseRunway >= 60 ? "2" : "1").replace(/\{\{shockCapacity\}\}/g, kpi.cashRunway && kpi.cashRunway.baseRunway >= 120 ? "4" : kpi.cashRunway && kpi.cashRunway.baseRunway >= 90 ? "3" : "2").replace(/\{\{currentRunway\}\}/g, String(kpi.cashRunway?.baseRunway || 0)).replace(/\{\{projectedRunway\}\}/g, String(Math.max(0, (kpi.cashRunway?.baseRunway || 0) - 8))).replace(/\{\{burnTrend\}\}/g, String(Math.round(kpi.dailyBurn?.trendPercent || 0))).replace(/\{\{effectiveDays\}\}/g, String(Math.max(0, (kpi.cashRunway?.baseRunway || 0) - 6))).replace(/\{\{delayCount\}\}/g, hasDelayLayer(inputs) ? "1" : "0").replace(/\{\{totalExposure\}\}/g, paymentAtRisk.toLocaleString()).replace(/\{\{teamSize\}\}/g, String(toNumber(inputs.delayRisk.teamSize) || 1)).replace(/\{\{varianceDays\}\}/g, String(varianceDays)).replace(/\{\{gapAmount\}\}/g, Math.abs(varianceAmount).toLocaleString()).replace(/\{\{gapPercent\}\}/g, String(Math.abs(variancePercent).toFixed(1))).replace(/\{\{topClient\}\}/g, "your biggest client").replace(/\{\{concentrationPercent\}\}/g, String(biggestClientPercent || 0)).replace(/\{\{impactAmount\}\}/g, Math.round(revenue * biggestClientPercent / 100).toLocaleString()).replace(/\{\{requiredGrowth\}\}/g, String(Math.max(0, Math.round((targetRevenue - revenue) / Math.max(revenue, 1) * 100)))).replace(/\{\{arDependency\}\}/g, String(clamp(Math.round(paymentAtRisk / Math.max(toNumber(inputs.essentials.cashInBank), 1) * 100), 0, 100))).replace(/\{\{adjustedRunway\}\}/g, String(kpi.cashRunway?.adjustedRunway || 0)).replace(/\{\{delayDays\}\}/g, String(consumedDays)).replace(/\{\{opportunityCost\}\}/g, Math.round(paymentAtRisk * 0.12).toLocaleString()).replace(/\{\{affectedProjects\}\}/g, String(hasDelayLayer(inputs) ? 2 : 1)).replace(/\{\{stalledDays\}\}/g, String(consumedDays)).replace(/\{\{burnedAmount\}\}/g, Math.round(consumedDays * dailyBurn).toLocaleString()).replace(/\{\{riskDays\}\}/g, String(Math.max(0, varianceDays - toNumber(inputs.delayRisk.bufferDays)))).replace(/\{\{originalDays\}\}/g, String(toNumber(inputs.delayRisk.projectTargetDays) || 30)).replace(/\{\{currentDays\}\}/g, String((toNumber(inputs.delayRisk.projectTargetDays) || 30) + varianceDays)).replace(/\{\{scopePercent\}\}/g, String(Math.round(varianceDays / Math.max(toNumber(inputs.delayRisk.projectTargetDays) || 30, 1) * 100))).replace(/\{\{bufferDays\}\}/g, String(toNumber(inputs.delayRisk.bufferDays) || 0)).replace(/\{\{typicalVariance\}\}/g, "5").replace(/\{\{clientName\}\}/g, "your lead client").replace(/\{\{riskScore\}\}/g, String(composite.components.clientRisk)).replace(/\{\{consecutiveMonths\}\}/g, String(variancePercent < 0 ? 3 : 1)).replace(/\{\{cumulativeGap\}\}/g, Math.round(Math.abs(varianceAmount) * 3).toLocaleString()).replace(/\{\{trendDirection\}\}/g, variancePercent >= 0 ? "improving" : "slipping").replace(/\{\{trendRate\}\}/g, String(Math.max(4, Math.round(Math.abs(variancePercent) / 2)))).replace(/\{\{surplusAmount\}\}/g, Math.max(0, varianceAmount).toLocaleString()).replace(/\{\{capacity\}\}/g, String(hasDelayLayer(inputs) ? 86 : 74)).replace(/\{\{variance\}\}/g, String(Math.abs(variancePercent).toFixed(1))).replace(/\{\{delayCost\}\}/g, Math.round(paymentAtRisk * 0.08).toLocaleString()).replace(/\{\{totalBleed\}\}/g, Math.round(Math.abs(varianceAmount) + paymentAtRisk * 0.08).toLocaleString()).replace(/\{\{baseBurn\}\}/g, dailyBurn.toLocaleString()).replace(/\{\{acceleration\}\}/g, String(Math.round(kpi.dailyBurn?.trendPercent || 0))).replace(/\{\{delayCosts\}\}/g, Math.round(paymentAtRisk * 0.08).toLocaleString()).replace(/\{\{effectiveBurn\}\}/g, Math.round(dailyBurn + paymentAtRisk * 0.08).toLocaleString()).replace(/\{\{riskCount\}\}/g, String(activeRiskCount || 1)).replace(/\{\{combinedProbability\}\}/g, String(probabilityBase)).replace(/\{\{atRiskProjects\}\}/g, String(hasDelayLayer(inputs) ? 1 : 0)).replace(/\{\{pipelineRisk\}\}/g, String(clamp(biggestClientPercent, 0, 100))).replace(/\{\{surplusCash\}\}/g, Math.max(0, toNumber(inputs.essentials.cashInBank) - toNumber(inputs.essentials.monthlyBills)).toLocaleString()).replace(/\{\{surplusRevenue\}\}/g, Math.max(0, varianceAmount).toLocaleString()).replace(/\{\{stableMonths\}\}/g, (kpi.cashRunway?.baseRunway || 0) >= 90 ? "6" : "3");
  return {
    templateId: template.id,
    headline: replaceVars(template.headline),
    unseenRisk: replaceVars(template.unseenRisk),
    contextualImpact: replaceVars(template.contextualImpact),
    recommendation: replaceVars(template.recommendation),
    riskLevel,
    probability: probabilityBase,
    activeTab: "story"
  };
}
function generateRiskBridge(inputs, kpi) {
  const pairs = [];
  const delayProbability = calculateDelayProbability(inputs);
  if (kpi.cashRunway && (kpi.cashRunway.status === "warning" || kpi.cashRunway.status === "critical")) {
    pairs.push({
      id: "cash-to-delay",
      triggerType: "finance",
      triggerCondition: "Thin cash buffer",
      triggerValue: `${kpi.cashRunway.baseRunway} days`,
      effect: "Delivery pressure",
      effectDescription: "Low cash leaves less room to absorb project slippage or add emergency help.",
      isActive: true
    });
  }
  if (hasDelayLayer(inputs)) {
    pairs.push({
      id: "delay-to-cash",
      triggerType: "operations",
      triggerCondition: "Project timeline risk",
      triggerValue: `${delayProbability}%`,
      effect: "Cash collection risk",
      effectDescription: `${toNumber(inputs.delayRisk.paymentAtRisk).toLocaleString()} may arrive later than planned.`,
      isActive: true
    });
  }
  if (toNumber(inputs.essentials.biggestClientPercent) >= 40) {
    pairs.push({
      id: "client-to-cash",
      triggerType: "finance",
      triggerCondition: "High client dependency",
      triggerValue: `${toNumber(inputs.essentials.biggestClientPercent)}%`,
      effect: "Negotiation weakness",
      effectDescription: "One client delay can pressure both cash and delivery decisions.",
      isActive: true
    });
  }
  return pairs;
}
function generateDominoChain(inputs, kpi) {
  if (!kpi.cashRunway) return null;
  const nodes = [
    {
      step: 1,
      label: kpi.cashRunway.status === "critical" ? "Cash pressure is immediate" : "Cash room is narrowing",
      impact: `${kpi.cashRunway.baseRunway} days of runway at current bills`,
      color: "scarlet"
    }
  ];
  if (hasDelayLayer(inputs)) {
    nodes.push({
      step: 2,
      label: "Project timing starts to matter",
      impact: `${toNumber(inputs.delayRisk.bufferDays)} buffer days left before delivery risk shows up`,
      color: "amber"
    });
    nodes.push({
      step: 3,
      label: "Payment timing gets pulled with delivery",
      impact: `${toNumber(inputs.delayRisk.paymentAtRisk).toLocaleString()} becomes sensitive to schedule slip`,
      color: "steel"
    });
  } else {
    nodes.push({
      step: 2,
      label: "Any late customer payment hurts faster",
      impact: "Less buffer means less time to correct course",
      color: "amber"
    });
  }
  if (toNumber(inputs.essentials.biggestClientPercent) >= 40) {
    nodes.push({
      step: nodes.length + 1,
      label: "Dependency amplifies the damage",
      impact: `${toNumber(inputs.essentials.biggestClientPercent)}% of income depends on one relationship`,
      color: "steel"
    });
  }
  nodes.push({
    step: nodes.length + 1,
    label: kpi.cashRunway.status === "critical" ? "You are forced into reactive decisions" : "You lose strategic flexibility",
    impact: kpi.cashRunway.status === "critical" ? "Cutting, delaying, or borrowing becomes urgent" : "Good choices become harder as time shrinks",
    color: "neutral"
  });
  return {
    nodes,
    probability: Math.max(35, calculateDelayProbability(inputs), kpi.cashRunway.status === "critical" ? 80 : 55)
  };
}
function buildCharts(inputs, kpi) {
  const bills = toNumber(inputs.essentials.monthlyBills);
  const revenue = toNumber(inputs.essentials.monthlyRevenue);
  const delayRisk = calculateDelayProbability(inputs);
  const composite = getCompositeRiskScore(inputs, kpi);
  return {
    revenueGap: {
      weeks: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
      actual: [revenue * 0.23, revenue * 0.24, revenue * 0.26, revenue * 0.27, revenue * 0.24, revenue * 0.22, revenue * 0.21, revenue * 0.2],
      target: Array(8).fill((kpi.monthlyRevenue?.targetRevenue ?? bills) * 0.25),
      projected: [0, 0, 0, 0, revenue * 0.24, revenue * 0.23, revenue * 0.22, revenue * 0.2]
    },
    lfi: {
      score: Math.min(100, Math.round(composite.score * 0.9 + Math.max(0, delayRisk - 35) * 0.2)),
      daysCover: kpi.cashRunway?.baseRunway || 0,
      currentRatio: bills > 0 ? toNumber(inputs.essentials.cashInBank) / bills : 0,
      arAtRisk: toNumber(inputs.delayRisk.paymentAtRisk)
    },
    monteCarlo: {
      worst: { probability: 18, outcome: Math.max(0, toNumber(inputs.essentials.cashInBank) - bills * 2) },
      base: { probability: 52, outcome: Math.max(0, toNumber(inputs.essentials.cashInBank) - bills) },
      best: { probability: 20, outcome: Math.max(0, toNumber(inputs.essentials.cashInBank) + Math.max(0, revenue - bills)) },
      distribution: []
    }
  };
}
function buildRiskScores(inputs, kpi) {
  const delayProbability = hasDelayLayer(inputs) ? calculateDelayProbability(inputs) : 0;
  const dependency = toNumber(inputs.essentials.biggestClientPercent);
  const variancePercent = kpi.monthlyRevenue?.variancePercent || 0;
  const composite = getCompositeRiskScore(inputs, kpi);
  const revenueRisk = composite.components.revenueRisk;
  const dependencyRisk = composite.components.clientRisk;
  return [
    {
      category: "Weighted overall risk",
      score: composite.score,
      trend: composite.score >= 55 ? "worsening" : composite.score <= 30 ? "improving" : "stable",
      exposureWidth: 0
    },
    {
      category: "Cash resilience",
      score: composite.components.runwayRisk,
      trend: (kpi.cashRunway?.baseRunway || 0) >= 60 ? "improving" : (kpi.cashRunway?.baseRunway || 0) < 45 ? "worsening" : "stable",
      exposureWidth: 0
    },
    {
      category: "Delay exposure",
      score: delayProbability,
      trend: delayProbability >= 45 ? "worsening" : delayProbability === 0 ? "improving" : "stable",
      exposureWidth: 0
    },
    {
      category: "Client dependency",
      score: dependencyRisk,
      trend: dependency >= 40 ? "worsening" : "stable",
      exposureWidth: 0
    },
    {
      category: "Income vs bills",
      score: revenueRisk,
      trend: variancePercent < 0 ? "worsening" : "improving",
      exposureWidth: 0
    }
  ];
}
function buildScenarioOutput(inputs, kpi) {
  if (!kpi.cashRunway) return null;
  const cashInjection = toNumber(inputs.scenario.cashInjection);
  const overheadReduction = toNumber(inputs.scenario.overheadReduction);
  const newMonthlyBills = Math.max(0, toNumber(inputs.essentials.monthlyBills) - overheadReduction);
  const projectedRunway = newMonthlyBills > 0 ? Math.floor((toNumber(inputs.essentials.cashInBank) + cashInjection) / (newMonthlyBills / 30)) : kpi.cashRunway.baseRunway;
  return {
    projectedRunway,
    runwayDelta: projectedRunway - kpi.cashRunway.baseRunway,
    revenueGapProjection: Math.max(0, newMonthlyBills - toNumber(inputs.essentials.monthlyRevenue)),
    gapDelta: Math.max(0, overheadReduction),
    shieldLevel: projectedRunway >= 90 ? 3 : projectedRunway >= 60 ? 2 : projectedRunway >= 30 ? 1 : 0,
    narrativeSummary: projectedRunway > kpi.cashRunway.baseRunway ? "This scenario buys you more time to make decisions." : "This scenario does not materially improve your current position."
  };
}
function calculateShield(kpi, inputs) {
  const lfi = Math.min(100, kpi.cashRunway?.status === "critical" ? 80 : kpi.cashRunway?.status === "warning" ? 60 : 28);
  const runway = kpi.cashRunway?.baseRunway || 0;
  const revenueGap = Math.abs(kpi.monthlyRevenue?.variancePercent || 0);
  const level = runway >= 90 ? 3 : runway >= 60 ? 2 : runway >= 30 ? 1 : 0;
  return {
    level,
    conditions: {
      lfi,
      runway,
      revenueGap,
      compliance: 100,
      currentRatio: toNumber(inputs.essentials.monthlyBills) > 0 ? toNumber(inputs.essentials.cashInBank) / toNumber(inputs.essentials.monthlyBills) : 0,
      burnTrend: kpi.dailyBurn?.isAccelerating ? "increasing" : "stable",
      projectsOnSchedule: hasDelayLayer(inputs) ? toNumber(inputs.delayRisk.bufferDays) > 3 : true
    }
  };
}
function calculateDecisionCenter(rawInputs) {
  const inputs = applyScenario(rawInputs);
  const kpi = {
    cashRunway: calculateCashRunway(inputs),
    monthlyRevenue: calculateMonthlyRevenue(inputs),
    dailyBurn: calculateDailyBurn(inputs),
    compliance: calculateCompliance()
  };
  const narrative = generateNarrative(inputs, kpi);
  const riskBridge = generateRiskBridge(inputs, kpi);
  const dominoChain = generateDominoChain(inputs, kpi);
  const charts = buildCharts(inputs, kpi);
  const riskScores = buildRiskScores(inputs, kpi);
  const scenarioOutput = buildScenarioOutput(inputs, kpi);
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
    lastUpdated: /* @__PURE__ */ new Date()
  };
}

// api/decision-center.ts
function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }
  try {
    const body = req.body;
    if (!body || !body.essentials || !body.delayRisk || !body.scenario) {
      return res.status(400).json({ error: "Invalid Decision Center payload." });
    }
    const result = calculateDecisionCenter(body);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Decision Center API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
export {
  handler as default
};

/**
 * Narrative Templates Library
 * 
 * 30 pre-written narrative templates for the Decision Center
 * Following the Novaris Blueprint v1.1 specification
 * 
 * Categories:
 * - Cash-Focused (8 templates)
 * - Project-Focused (7 templates)  
 * - Revenue-Focused (6 templates)
 * - Compound Risks (6 templates)
 * - Opportunity/Positive (3 templates)
 */

import type { NarrativeTemplate } from '../../types/decisionCenter';

export const NARRATIVE_TEMPLATES: NarrativeTemplate[] = [
  // ============================================
  // CATEGORY 1: CASH-FOCUSED (8 templates)
  // ============================================
  
  {
    id: 'cash-01',
    category: 'cash',
    priority: 100,
    conditions: {
      cashRunwayStatus: 'critical',
      maxRunwayDays: 30,
    },
    headline: "You are 30 days from a cash crisis.",
    unseenRisk: "The cliff is closer than it appears. One delayed client payment or unexpected expense will force emergency decisions.",
    contextualImpact: "At current burn, cash runs out in {{runwayDays}} days. Any project delay or collection problem accelerates this to {{acceleratedDays}} days.",
    recommendation: "Immediately: defer non-essential payments, accelerate AR collection, and secure bridge financing as backup.",
    riskLevel: 'critical',
  },
  
  {
    id: 'cash-02',
    category: 'cash',
    priority: 95,
    conditions: {
      cashRunwayStatus: 'warning',
      minRunwayDays: 30,
      maxRunwayDays: 45,
    },
    headline: "Your cash buffer is thinning.",
    unseenRisk: "The 'liquidity trap' — you have enough cash for normal operations but not enough to absorb shocks.",
    contextualImpact: "{{runwayDays}} days of runway sounds safe, but it only covers {{shockAbsorption}} simultaneous problems before critical.",
    recommendation: "Build a 3-month cash reserve. Reduce discretionary spend and renegotiate payment terms with vendors.",
    riskLevel: 'high',
  },
  
  {
    id: 'cash-03',
    category: 'cash',
    priority: 90,
    conditions: {
      cashRunwayStatus: 'warning',
      projectDelayActive: true,
    },
    headline: "Project delays are draining your liquidity.",
    unseenRisk: "Each delayed day burns {{dailyBurn}} while blocking {{blockedPayment}} in receivables. A compound cost.",
    contextualImpact: "Active delays have already consumed {{consumedDays}} days of runway. Without intervention, this cascade continues.",
    recommendation: "Prioritize completing {{projectName}} to unblock the payment. Consider temporary resources to accelerate delivery.",
    riskLevel: 'high',
  },
  
  {
    id: 'cash-04',
    category: 'cash',
    priority: 85,
    conditions: {
      burnAccelerating: true,
      cashRunwayStatus: 'monitor',
    },
    headline: "Your burn rate is accelerating.",
    unseenRisk: "Expense growth is outpacing revenue. What looks like investment is actually eroding your safety margin.",
    contextualImpact: "Burn increased {{burnTrend}}% this month. If this continues, runway drops from {{currentRunway}} to {{projectedRunway}} days.",
    recommendation: "Audit last 30 days of expenses. Categorize as essential vs. discretionary. Pause the latter immediately.",
    riskLevel: 'medium',
  },
  
  {
    id: 'cash-05',
    category: 'cash',
    priority: 80,
    conditions: {
      cashRunwayStatus: 'critical',
      burnAccelerating: true,
    },
    headline: "Double jeopardy: low cash and rising burn.",
    unseenRisk: "The worst combination — you're running out of money while spending accelerates. This is a death spiral pattern.",
    contextualImpact: "With only {{runwayDays}} days left and burn up {{burnTrend}}%, you have {{effectiveDays}} effective days before crisis.",
    recommendation: "Emergency triage: cut all non-essential spend today, call your top 3 clients for early payments, and model worst-case scenarios.",
    riskLevel: 'critical',
  },
  
  {
    id: 'cash-06',
    category: 'cash',
    priority: 75,
    conditions: {
      cashRunwayStatus: 'safe',
      minRunwayDays: 60,
    },
    headline: "Your cash position is stable.",
    unseenRisk: "Complacency is the hidden risk. Strong cash can mask operational inefficiencies until they compound.",
    contextualImpact: "{{runwayDays}} days of runway provides solid protection. You can absorb {{shockCount}} major shocks simultaneously.",
    recommendation: "Maintain discipline. Use this stability to invest strategically, not to relax cost controls.",
    riskLevel: 'low',
  },
  
  {
    id: 'cash-07',
    category: 'cash',
    priority: 70,
    conditions: {
      cashRunwayStatus: 'warning',
    },
    headline: "You're living invoice-to-invoice.",
    unseenRisk: "Your runway is sustained by expected collections, not actual cash. If AR delays, the picture changes rapidly.",
    contextualImpact: "{{arDependency}}% of your runway depends on collections. If payments are 2 weeks late, effective runway is {{adjustedRunway}} days.",
    recommendation: "Diversify cash sources. Reduce dependence on single large invoices. Build a 45-day pure cash reserve.",
    riskLevel: 'high',
  },
  
  {
    id: 'cash-08',
    category: 'cash',
    priority: 65,
    conditions: {
      cashRunwayStatus: 'monitor',
      minRunwayDays: 45,
      maxRunwayDays: 60,
    },
    headline: "Comfortable now, but watch the trend.",
    unseenRisk: "The plateau before the drop. Many businesses feel safe at 45-60 days, then get surprised by a sudden acceleration.",
    contextualImpact: "Current position is adequate, but there's limited room for error. One major unexpected expense changes everything.",
    recommendation: "Extend runway to 90 days. Focus on recurring revenue streams that provide predictable inflows.",
    riskLevel: 'medium',
  },

  // ============================================
  // CATEGORY 2: PROJECT-FOCUSED (7 templates)
  // ============================================
  
  {
    id: 'project-01',
    category: 'project',
    priority: 90,
    conditions: {
      projectDelayActive: true,
      cashRunwayStatus: 'warning',
    },
    headline: "Project delays are creating a cash chokehold.",
    unseenRisk: "The delivery-payment cycle is broken. Each delayed milestone blocks cash that was already committed in your plans.",
    contextualImpact: "{{projectName}} delay has blocked {{blockedAmount}} for {{delayDays}} days. That's {{opportunityCost}} in lost opportunities.",
    recommendation: "Resource surge: add temporary capacity to {{projectName}} specifically. The cost is less than the blocked payment impact.",
    riskLevel: 'high',
  },
  
  {
    id: 'project-02',
    category: 'project',
    priority: 85,
    conditions: {
      projectDelayActive: true,
    },
    headline: "One delayed project is destabilizing your pipeline.",
    unseenRisk: "The domino effect. Delayed resources on Project A cannot start Project B, creating a cascade of commitments.",
    contextualImpact: "{{projectName}} delay affects {{affectedProjects}} other projects. Combined delay exposure is {{totalExposure}}.",
    recommendation: "Isolate the bottleneck. Either complete {{projectName}} fast or descope it to free resources for other projects.",
    riskLevel: 'medium',
  },
  
  {
    id: 'project-03',
    category: 'project',
    priority: 80,
    conditions: {
      projectDelayActive: true,
    },
    headline: "Your team is locked in a stalled project.",
    unseenRisk: "Sunk cost fallacy in action. Continuing to burn resources on a stalled project prevents starting revenue-generating work.",
    contextualImpact: "{{teamSize}} people on {{projectName}} for {{stalledDays}} days with zero progress. That's {{burnedAmount}} with no return.",
    recommendation: "Make a hard decision: either inject resources to finish in 7 days or formally pause and reassign the team.",
    riskLevel: 'high',
  },
  
  {
    id: 'project-04',
    category: 'project',
    priority: 75,
    conditions: {
      projectDelayActive: true,
    },
    headline: "Supplier delays are threatening your commitments.",
    unseenRisk: "Your reputation is at risk. External dependencies are pushing you toward breaking client promises.",
    contextualImpact: "Supplier variance of {{varianceDays}} days puts you {{riskDays}} days past your client commitment. Penalties may apply.",
    recommendation: "Immediate client communication: reset expectations now rather than fail later. Source backup suppliers for critical components.",
    riskLevel: 'medium',
  },
  
  {
    id: 'project-05',
    category: 'project',
    priority: 70,
    conditions: {
      projectDelayActive: true,
    },
    headline: "Scope creep is killing your timeline.",
    unseenRisk: "The project is no longer the project you estimated. Each 'small addition' compounds into significant delay.",
    contextualImpact: "Original timeline: {{originalDays}} days. Current projection: {{currentDays}} days. Scope added {{scopePercent}}% more work.",
    recommendation: "Scope freeze: no new features for 30 days. Finish current commitments before expanding. Document change requests for future phase.",
    riskLevel: 'medium',
  },
  
  {
    id: 'project-06',
    category: 'project',
    priority: 65,
    conditions: {
      projectDelayActive: false,
    },
    headline: "Projects are on track, but margins are tight.",
    unseenRisk: "On-time delivery masks underlying fragility. Small disruptions will push you into delay territory quickly.",
    contextualImpact: "Current buffer: {{bufferDays}} days. Industry variance is typically {{typicalVariance}} days. Little room for error.",
    recommendation: "Build 15% time buffer into all future project phases. Protect the margin that keeps you on schedule.",
    riskLevel: 'low',
  },
  
  {
    id: 'project-07',
    category: 'project',
    priority: 60,
    conditions: {
      projectDelayActive: true,
    },
    headline: "Client confidence is eroding with each delay.",
    unseenRisk: "Intangible but critical. Repeated delays damage relationships that took years to build. Recovery is expensive.",
    contextualImpact: "{{clientName}} has experienced {{delayCount}} delays. Relationship risk score: {{riskScore}}/100. Approaching threshold.",
    recommendation: "Proactive retention: call the client today. Acknowledge the delay, explain the fix, and offer tangible compensation.",
    riskLevel: 'high',
  },

  // ============================================
  // CATEGORY 3: REVENUE-FOCUSED (6 templates)
  // ============================================
  
  {
    id: 'revenue-01',
    category: 'revenue',
    priority: 85,
    conditions: {
      revenueGapPercent: 20,
      maxRevenueGapPercent: 0,
    },
    headline: "You're falling behind your revenue target.",
    unseenRisk: "The gap compounds. Each month of shortfall makes the annual target harder to achieve, requiring unsustainable catch-up.",
    contextualImpact: "Current gap: {{gapAmount}} ({{gapPercent}}% below target). To hit annual goal, you need {{requiredGrowth}}% growth next month.",
    recommendation: "Immediate pipeline audit: identify deals that can close this month. Consider promotional pricing to accelerate decisions.",
    riskLevel: 'medium',
  },
  
  {
    id: 'revenue-02',
    category: 'revenue',
    priority: 80,
    conditions: {
      revenueGapPercent: 40,
      maxRevenueGapPercent: 0,
    },
    headline: "Revenue shortfall is becoming a structural problem.",
    unseenRisk: "This isn't a bad month—it's a pattern. Persistent gaps indicate market, pricing, or execution issues.",
    contextualImpact: "{{consecutiveMonths}} consecutive months below target. Cumulative gap: {{cumulativeGap}}. Annual target at risk.",
    recommendation: "Strategic review: analyze win/loss rates, competitor pricing, and market positioning. Consider pivot or pricing change.",
    riskLevel: 'high',
  },
  
  {
    id: 'revenue-03',
    category: 'revenue',
    priority: 75,
    conditions: {
      revenueGapPercent: 10,
      maxRevenueGapPercent: 0,
    },
    headline: "Revenue is close to target but trending down.",
    unseenRisk: "The slope matters more than the position. A small gap with negative momentum is more dangerous than a larger gap with positive momentum.",
    contextualImpact: "Gap is only {{gapPercent}}%, but trend is {{trendDirection}} at {{trendRate}}% per month. Momentum is concerning.",
    recommendation: "Accelerate near-term closes. Focus on low-friction deals that can sign this week to reverse the trend.",
    riskLevel: 'medium',
  },
  
  {
    id: 'revenue-04',
    category: 'revenue',
    priority: 70,
    conditions: {
      minClientDependencyPercent: 40,
    },
    headline: "One client represents a concentration risk.",
    unseenRisk: "Over-dependence. Losing this client would create an immediate crisis. Yet most resources are dedicated to keeping them happy.",
    contextualImpact: "{{topClient}} represents {{concentrationPercent}}% of revenue. If they delay or leave, you lose {{impactAmount}} immediately.",
    recommendation: "Client diversification initiative. Set target: no client >30% of revenue. Prioritize new client acquisition this quarter.",
    riskLevel: 'medium',
  },
  
  {
    id: 'revenue-05',
    category: 'revenue',
    priority: 65,
    conditions: {
      revenueGapPercent: -10,
      cashRunwayStatus: 'safe',
    },
    headline: "You're ahead of target, but is it sustainable?", 
    unseenRisk: "Success blindness. Strong revenue can hide operational strain that will surface when growth normalizes.",
    contextualImpact: "{{surplusAmount}} above target. However, delivery capacity is at {{capacity}}%. Quality or timeline risks emerging.",
    recommendation: "Invest the surplus in capacity building: hire, train, and systematize before taking on more growth.",
    riskLevel: 'low',
  },
  
  {
    id: 'revenue-06',
    category: 'revenue',
    priority: 60,
    conditions: {
      revenueGapPercent: 15,
      maxRevenueGapPercent: 0,
    },
    headline: "Seasonal downturn is deeper than expected.",
    unseenRisk: "You planned for seasonality, but this dip exceeds historical patterns. Something fundamental may have shifted.",
    contextualImpact: "Current decline is {{variance}}% worse than historical seasonal pattern. Market conditions may have changed.",
    recommendation: "Don't assume automatic recovery. Adjust quarterly plan. Cut discretionary spend to match lower revenue reality.",
    riskLevel: 'medium',
  },

  // ============================================
  // CATEGORY 4: COMPOUND RISKS (6 templates)
  // ============================================
  
  {
    id: 'compound-01',
    category: 'compound',
    priority: 100,
    conditions: {
      multipleRisks: true,
      cashRunwayStatus: 'critical',
      projectDelayActive: true,
    },
    headline: "Perfect storm: cash crisis meets project failure.",
    unseenRisk: "The most dangerous combination. You have neither the cash to absorb problems nor the operational capacity to prevent them.",
    contextualImpact: "Cash: {{runwayDays}} days. Active delays: {{delayCount}}. Blocked payments: {{blockedAmount}}. This is a survival situation.",
    recommendation: "Emergency protocols: halt all non-critical projects, call all clients for early payments, cut burn by 30% this week.",
    riskLevel: 'critical',
  },
  
  {
    id: 'compound-02',
    category: 'compound',
    priority: 95,
    conditions: {
      multipleRisks: true,
      cashRunwayStatus: 'warning',
      revenueGapPercent: 20,
      maxRevenueGapPercent: 0,
    },
    headline: "Cash pressure + revenue gap = time bomb.",
    unseenRisk: "You can't cost-cut your way out of this. Revenue gap means you need to spend more (sales, marketing), but cash says spend less.",
    contextualImpact: "Runway: {{runwayDays}} days. Revenue gap: {{gapPercent}}%. Classic growth vs. survival dilemma. Decision required.",
    recommendation: "Surgical approach: cut non-revenue costs aggressively while protecting sales investment. Focus on quick-win revenue.",
    riskLevel: 'high',
  },
  
  {
    id: 'compound-03',
    category: 'compound',
    priority: 90,
    conditions: {
      multipleRisks: true,
      projectDelayActive: true,
      revenueGapPercent: 15,
      maxRevenueGapPercent: 0,
    },
    headline: "Operations and revenue are in a death spiral.",
    unseenRisk: "Project delays block cash. Cash shortage prevents growth investment. Revenue falls further. The cycle feeds itself.",
    contextualImpact: "Delay cost: {{delayCost}}. Revenue gap: {{gapAmount}}. Combined monthly bleed: {{totalBleed}}. Unsustainable.",
    recommendation: "Break the cycle at one point: either unblock projects with emergency resources OR accept lower revenue and cut costs accordingly. Doing both halfway fails.",
    riskLevel: 'critical',
  },
  
  {
    id: 'compound-04',
    category: 'compound',
    priority: 85,
    conditions: {
      multipleRisks: true,
      burnAccelerating: true,
      projectDelayActive: true,
    },
    headline: "Three forces are accelerating your cash burn.",
    unseenRisk: "Rising expenses + blocked receivables + delay costs. Each amplifies the others. Linear thinking won't solve this.",
    contextualImpact: "Base burn: {{baseBurn}}. Acceleration: {{acceleration}}%. Delay costs: {{delayCosts}}. Effective burn: {{effectiveBurn}}.",
    recommendation: "Immediate triage: which of the three can you impact fastest? Usually it's expense control. Cut deep, cut fast.",
    riskLevel: 'high',
  },
  
  {
    id: 'compound-05',
    category: 'compound',
    priority: 80,
    conditions: {
      multipleRisks: true,
    },
    headline: "Multiple risk chains are converging.",
    unseenRisk: "Independent problems are creating compound effects. The math is multiplicative, not additive.",
    contextualImpact: "{{riskCount}} active risk chains. Individual severity: moderate. Combined probability of crisis: {{combinedProbability}}%.",
    recommendation: "Don't try to solve everything. Pick the one chain that, if broken, collapses the others. Focus there.",
    riskLevel: 'high',
  },
  
  {
    id: 'compound-06',
    category: 'compound',
    priority: 75,
    conditions: {
      multipleRisks: true,
    },
    headline: "You're stable now, but three triggers are armed.",
    unseenRisk: "Current calm is deceptive. Multiple conditions are at threshold. One external shock detonates all three simultaneously.",
    contextualImpact: "Cash: {{runwayDays}} days (thin buffer). Projects: {{atRiskProjects}} near delay threshold. Revenue: {{pipelineRisk}}% pipeline at risk.",
    recommendation: "Pre-position for shock: build 30-day cash buffer, secure backup suppliers, diversify top client exposure. Act while you have time.",
    riskLevel: 'medium',
  },

  // ============================================
  // CATEGORY 5: OPPORTUNITY/POSITIVE (3 templates)
  // ============================================
  
  {
    id: 'opportunity-01',
    category: 'opportunity',
    priority: 50,
    conditions: {
      cashRunwayStatus: 'safe',
      minRunwayDays: 90,
    },
    headline: "You're in a position of strength.",
    unseenRisk: "The risk of strength is complacency. Strong cash position can lead to undisciplined spending.",
    contextualImpact: "{{runwayDays}} days of runway. You can absorb {{shockCapacity}} major shocks. This is operational freedom.",
    recommendation: "Use this position strategically: invest in growth, hire key talent, or acquire competitors. Don't fritter it away.",
    riskLevel: 'low',
  },
  
  {
    id: 'opportunity-02',
    category: 'opportunity',
    priority: 45,
    conditions: {
      cashRunwayStatus: 'safe',
      revenueGapPercent: -20,
      maxClientDependencyPercent: 35,
    },
    headline: "Strong cash and strong revenue create optionality.",
    unseenRisk: "Analysis paralysis. Too many good options can lead to choosing none while the moment passes.",
    contextualImpact: "{{surplusCash}} surplus cash. {{surplusRevenue}} above revenue target. Rare combination. Window is open.",
    recommendation: "Make one bold move. Pick your highest-conviction opportunity and commit resources fully. Partial efforts waste this moment.",
    riskLevel: 'low',
  },
  
  {
    id: 'opportunity-03',
    category: 'opportunity',
    priority: 40,
    conditions: {
      cashRunwayStatus: 'safe',
      projectDelayActive: false,
      maxClientDependencyPercent: 40,
    },
    headline: "Resilience proven-you've earned strategic flexibility.",
    unseenRisk: "Past success doesn't guarantee future results. Market conditions shift. Today's resilience can become tomorrow's rigidity.",
    contextualImpact: "You've maintained strong position through {{stableMonths}} months. Systems are working. Time to optimize, not just survive.",
    recommendation: "Shift from defense to offense. Increase growth investments by 15%. Test new markets or products while you have cushion.",
    riskLevel: 'low',
  },

  {
    id: 'opportunity-04',
    category: 'opportunity',
    priority: 55,
    conditions: {
      cashRunwayStatus: 'safe',
      projectDelayActive: false,
      revenueGapPercent: -10,
      maxClientDependencyPercent: 30,
    },
    headline: "Your business has room to choose, not just react.",
    unseenRisk: "Strong numbers can tempt you to chase too many ideas at once. Focus still matters when the pressure is low.",
    contextualImpact: "Runway is at {{runwayDays}} days and revenue is {{gapPercent}}% above target. That gives you time and momentum together.",
    recommendation: "Use the cushion deliberately: pick one growth bet, fund it fully, and protect the discipline that created this position.",
    riskLevel: 'low',
  },

  {
    id: 'opportunity-05',
    category: 'opportunity',
    priority: 52,
    conditions: {
      cashRunwayStatus: 'safe',
      projectDelayActive: false,
      maxRevenueGapPercent: 5,
      maxClientDependencyPercent: 25,
    },
    headline: "Your foundations look healthy across cash, delivery, and client mix.",
    unseenRisk: "Healthy systems are easy to underinvest in because nothing feels urgent. Quiet strength still needs maintenance.",
    contextualImpact: "Cash covers {{runwayDays}} days, projects are staying on track, and no single client dominates your income.",
    recommendation: "Document the habits behind this stability now. Strong operating rhythm is what keeps a good quarter from becoming a lucky one.",
    riskLevel: 'low',
  },

  {
    id: 'opportunity-06',
    category: 'opportunity',
    priority: 48,
    conditions: {
      cashRunwayStatus: 'safe',
      revenueGapPercent: -5,
      maxClientDependencyPercent: 35,
    },
    headline: "Revenue is clearing the bar and your buffer is holding.",
    unseenRisk: "This is the moment to strengthen systems before growth makes each weak point more expensive to fix.",
    contextualImpact: "You are ahead by {{surplusAmount}} versus target while still carrying {{runwayDays}} days of runway. That is genuine breathing room.",
    recommendation: "Turn the surplus into resilience: tighten collections, improve delivery capacity, and keep client concentration below 30%.",
    riskLevel: 'low',
  },
];

/**
 * Select the best template based on current conditions
 */
export function selectTemplate(
  conditions: NarrativeTemplate['conditions'],
  inputs: any
): NarrativeTemplate | null {
  // Filter templates that match current conditions
  const matching = NARRATIVE_TEMPLATES.filter(template => {
    const cond = template.conditions;
    
    // Check cash runway status
    if (cond.cashRunwayStatus && conditions.cashRunwayStatus !== cond.cashRunwayStatus) {
      return false;
    }
    
    // Check runway days
    if (cond.minRunwayDays !== undefined && inputs.runwayDays < cond.minRunwayDays) {
      return false;
    }
    if (cond.maxRunwayDays !== undefined && inputs.runwayDays > cond.maxRunwayDays) {
      return false;
    }
    
    // Check project delay
    if (cond.projectDelayActive !== undefined && conditions.projectDelayActive !== cond.projectDelayActive) {
      return false;
    }
    
    // Check burn acceleration
    if (cond.burnAccelerating !== undefined && conditions.burnAccelerating !== cond.burnAccelerating) {
      return false;
    }
    
    // Check revenue gap
    if (cond.revenueGapPercent !== undefined) {
      if (cond.revenueGapPercent >= 0 && inputs.revenueGapPercent < cond.revenueGapPercent) {
        return false;
      }

      if (cond.revenueGapPercent < 0 && inputs.revenueGapPercent > cond.revenueGapPercent) {
        return false;
      }
    }

    if (cond.maxRevenueGapPercent !== undefined && inputs.revenueGapPercent > cond.maxRevenueGapPercent) {
      return false;
    }

    if (cond.minClientDependencyPercent !== undefined && inputs.clientDependencyPercent < cond.minClientDependencyPercent) {
      return false;
    }

    if (cond.maxClientDependencyPercent !== undefined && inputs.clientDependencyPercent > cond.maxClientDependencyPercent) {
      return false;
    }
    
    // Check multiple risks
    if (cond.multipleRisks !== undefined && conditions.multipleRisks !== cond.multipleRisks) {
      return false;
    }
    
    return true;
  });
  
  // Sort by priority (highest first) and return the best match
  matching.sort((a, b) => b.priority - a.priority);
  return matching[0] || null;
}

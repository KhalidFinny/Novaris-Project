import { FinancialInput, SimulationResult, DecisionStory } from './types';
import { runSimulationMatch } from './simulation';

/**
 * The Storytelling Engine compares multiple futures to uncover "Hidden Risks" 
 * that aren't obvious in a single set of charts.
 */
export function generateDecisionStory(inputs: FinancialInput): DecisionStory {
    // 1. Generate the "Happy Path" (No delay, no shocks)
    const happyInputs = { ...inputs, activeProjectDelayDays: 0 };
    const happyResult = runSimulationMatch(happyInputs, 0);

    // 2. Generate the "Risk Path" (Current inputs + potential delay)
    // We assume a standard "Operational Friction" delay if none provided
    const riskDays = inputs.activeProjectDelayDays || 14;
    const riskInputs = { ...inputs, activeProjectDelayDays: riskDays };
    const riskResult = runSimulationMatch(riskInputs);

    // 3. Compare Results to find "The Story"
    const happyFinalCash = happyResult.monthlyProjections[happyResult.monthlyProjections.length - 1].cashBalance;
    const riskFinalCash = riskResult.monthlyProjections[riskResult.monthlyProjections.length - 1].cashBalance;
    const cashDelta = happyFinalCash - riskFinalCash;

    const isFragile = riskResult.cashRunwayMonths < 6;
    const highSensitivity = inputs.monthlyDebtObligations > (inputs.monthlyRevenue * 0.25);

    // 4. Narrative Selection Logic
    let headline = "Your business is in a stable growth phase.";
    let unseenRisk = "No critical hidden risks detected at current levels.";
    let impactSummary = "Minor operational fluctuations are absorbed by your reserves.";
    let recommendation = "Maintain current buffer and proceed with caution.";
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';

    if (!riskResult.survived) {
        headline = "Critical feedback loop detected.";
        unseenRisk = "Fragility cascade. Your cash reserve is too low to survive even a minor project delay.";
        impactSummary = `This project delay doesn't just cost money—it triggers a total cash-out in month ${Math.floor(riskResult.cashRunwayMonths)}.`;
        recommendation = "Secure bridge financing or drastically reduce fixed costs before proceeding.";
        level = 'critical';
    } else if (isFragile && highSensitivity) {
        headline = "Low liquidity is stalling your agility.";
        unseenRisk = "The 'Debt Anchor'. Your monthly obligations leave too little room for project variance.";
        impactSummary = "A 14-day delay effectively consumes 3 months of your growth-ready capital.";
        recommendation = "Focus on clearing high-interest debt to free up operational 'Shields'.";
        level = 'high';
    } else if (cashDelta > inputs.monthlyRevenue * 0.5) {
        headline = "Project delay has a high 'Revenue Displacement' cost.";
        unseenRisk = "Invisible Opportunity Cost. The resources stuck on this project are preventing future revenue.";
        impactSummary = `The total cost of this delay is ${Math.round(cashDelta).toLocaleString()} in your selected currency, including lost growth opportunity.`;
        recommendation = "Consider hiring temporary support to decouple the project from your core revenue stream.";
        level = 'medium';
    }

    return {
        headline,
        unseenRisk,
        impactSummary,
        recommendation,
        riskVisualLevel: level
    };
}

import { FinancialInput, FinancialOutput } from './financial.types';
import { runSimulationMatch } from './simulation';

const NUM_SIMULATIONS = 500;

export function evaluateFinancialRisk(inputs: FinancialInput): FinancialOutput {
    let survivedCount = 0;
    let totalRunway = 0;
    const baseScenario = runSimulationMatch(inputs, 0); // Control group (0 variance)

    for (let i = 0; i < NUM_SIMULATIONS; i++) {
        const result = runSimulationMatch(inputs);
        if (result.survived) {
            survivedCount++;
        }
        totalRunway += result.cashRunwayMonths;
    }

    const survivalProbability = (survivedCount / NUM_SIMULATIONS) * 100;
    const averageRunway = totalRunway / NUM_SIMULATIONS;

    // Calculate Risk Score (0 = Perfect Health, 100 = Immediate Bankruptcy)
    // 40% driven by runway, 40% by survival prob, 20% by debt ratio
    const runwayRisk = Math.max(0, 100 - (averageRunway / 12) * 100);
    const survivalRisk = 100 - survivalProbability;
    const debtRatio = inputs.monthlyDebtObligations / (inputs.monthlyRevenue || 1);
    const debtRisk = Math.min(100, debtRatio * 200);

    const rawScore = (runwayRisk * 0.4) + (survivalRisk * 0.4) + (debtRisk * 0.2);
    const riskScore = Math.round(rawScore);

    // Identify Drivers
    const topRiskDrivers: string[] = [];
    if (debtRatio > 0.3) topRiskDrivers.push("High Debt Servicing Ratio");
    if (inputs.variableCostPercentage > 60) topRiskDrivers.push("High Variable Cost Exposure");
    if (averageRunway < 3) topRiskDrivers.push("Critically Low Cash Runway");
    if (inputs.seasonalityFactor > 0.6) topRiskDrivers.push("Severe Seasonality Volatility");

    // Mitigations
    const mitigationSuggestions: string[] = [];
    if (debtRisk > 50) mitigationSuggestions.push("Restructure short-term debt into long-term loans to improve monthly cash flow.");
    if (averageRunway < 6) mitigationSuggestions.push(`Increase emergency buffer by $${Math.round(inputs.fixedCosts * 3)} to survive potential 3-month revenue gaps.`);
    if (inputs.variableCostPercentage > 50) mitigationSuggestions.push("Renegotiate supplier contracts or find cheaper material alternatives.");

    return {
        riskScore,
        cashRunwayMonths: Number(averageRunway.toFixed(1)),
        survivalProbability: Math.round(survivalProbability),
        topRiskDrivers,
        monthlyProjections: baseScenario.monthlyProjections,
        mitigationSuggestions
    };
}

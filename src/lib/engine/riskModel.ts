import { FinancialInput, FinancialOutput } from './types';
import { runSimulationMatch } from './simulation';

const NUM_SIMULATIONS = 500;

import { generateDecisionStory } from './storytelling';

export function evaluateFinancialRisk(inputs: FinancialInput): FinancialOutput {
    let survivedCount = 0;
    let totalRunway = 0;

    // 1. BASE SCENARIO (Control group)
    const baseScenario = runSimulationMatch(inputs, 0);

    // 2. MONTE CARLO SIMULATION
    for (let i = 0; i < NUM_SIMULATIONS; i++) {
        const result = runSimulationMatch(inputs);
        if (result.survived) {
            survivedCount++;
        }
        totalRunway += result.cashRunwayMonths;
    }

    const survivalProbability = (survivedCount / NUM_SIMULATIONS) * 100;
    const averageRunway = totalRunway / NUM_SIMULATIONS;

    // 3. CALCULATE RESILIENCE SHIELDS (Stress Testing)
    // We test against concurrent "External Shocks"

    // Shock A: Sales drop 20%
    const salesShockInputs = { ...inputs, monthlyRevenue: inputs.monthlyRevenue * 0.8 };
    const survivesSalesShock = runSimulationMatch(salesShockInputs, 0).survived;

    // Shock B: Project delay increases by 50%
    const delayShockInputs = {
        ...inputs,
        activeProjectDelayDays: (inputs.activeProjectDelayDays || 0) * 1.5 + 7
    };
    const survivesDelayShock = runSimulationMatch(delayShockInputs, 0).survived;

    // Shock C: Concurrent (Both)
    const doubleShockInputs = { ...salesShockInputs, activeProjectDelayDays: delayShockInputs.activeProjectDelayDays };
    const survivesDoubleShock = runSimulationMatch(doubleShockInputs, 0).survived;

    let resilienceShields = 1;
    if (survivesSalesShock || survivesDelayShock) resilienceShields = 2;
    if (survivesDoubleShock && survivalProbability > 80) resilienceShields = 3;

    // 4. RISK SCORE & FRAGILITY
    const runwayRisk = Math.max(0, 100 - (averageRunway / 12) * 100);
    const survivalRisk = 100 - survivalProbability;
    const debtRatio = inputs.monthlyDebtObligations / (inputs.monthlyRevenue || 1);
    const debtRisk = Math.min(100, debtRatio * 200);

    const riskScore = Math.round((runwayRisk * 0.4) + (survivalRisk * 0.4) + (debtRisk * 0.2));
    const isFragile = resilienceShields === 1 || survivalProbability < 50;

    // 5. DRIVERS & MITIGATIONS
    const topRiskDrivers: string[] = [];
    if (debtRatio > 0.3) topRiskDrivers.push("High Debt Servicing Ratio");
    if (inputs.activeProjectDelayDays && inputs.activeProjectDelayDays > 14) topRiskDrivers.push("Significant Project Delay Burn");
    if (inputs.confidenceLevel && inputs.confidenceLevel < 0.5) topRiskDrivers.push("High Uncertainty in Business Data");
    if (averageRunway < 3) topRiskDrivers.push("Critically Low Cash Runway");

    const mitigationSuggestions: string[] = [];
    if (resilienceShields < 2) mitigationSuggestions.push("Your business is 'Single-Shock' fragile. Build a 3-month cash buffer to survive independent sales drops.");
    if (debtRisk > 50) mitigationSuggestions.push("Restructure short-term debt into long-term loans.");
    if (!survivesDelayShock && inputs.activeProjectDelayDays) mitigationSuggestions.push("Operationally critical project detected. Add a 15% time buffer to project phases.");

    // 6. GENERATE DECISION STORY
    const decisionStory = generateDecisionStory(inputs);

    return {
        riskScore,
        cashRunwayMonths: Number(averageRunway.toFixed(1)),
        survivalProbability: Math.round(survivalProbability),
        resilienceShields,
        isFragile,
        topRiskDrivers,
        monthlyProjections: baseScenario.monthlyProjections,
        mitigationSuggestions,
        decisionStory
    };
}

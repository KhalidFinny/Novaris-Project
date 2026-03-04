import { FinancialInput } from './financial.types';

export interface SimulationResult {
    cashRunwayMonths: number;
    survived: boolean;
    monthlyProjections: { month: number, revenue: number, expenses: number, cashBalance: number }[];
}

export function runSimulationMatch(inputs: FinancialInput, seedVariance: number = 0.2): SimulationResult {
    const monthsToSimulate = 12;
    let currentCash = inputs.currentCashReserves;
    const projections = [];
    let survived = true;
    let cashRunwayMonths = monthsToSimulate;

    for (let i = 1; i <= monthsToSimulate; i++) {
        // Apply variance to revenue
        const revenueVariance = 1 + (Math.random() * seedVariance * 2 - seedVariance);

        // Apply seasonality if applicable (simplified sine wave)
        const seasonalityMultiplier = 1 + (inputs.seasonalityFactor * Math.sin((i / 12) * Math.PI * 2));

        // Apply growth
        const growthMultiplier = 1 + (inputs.projectedGrowthRate / 100);

        const simulatedRevenue = inputs.monthlyRevenue * revenueVariance * seasonalityMultiplier * growthMultiplier;

        // Calculate Expenses
        const variableCosts = simulatedRevenue * (inputs.variableCostPercentage / 100);
        // Add random cost spikes (e.g., 5% chance of a 20% spike in fixed costs)
        const costSpikeMultiplier = Math.random() < 0.05 ? 1.2 : 1;
        const totalExpenses = (inputs.fixedCosts * costSpikeMultiplier) + variableCosts + inputs.monthlyDebtObligations;

        const netCashFlow = simulatedRevenue - totalExpenses;
        currentCash += netCashFlow;

        projections.push({
            month: i,
            revenue: Math.round(simulatedRevenue),
            expenses: Math.round(totalExpenses),
            cashBalance: Math.round(currentCash)
        });

        if (currentCash < 0 && survived) {
            survived = false;
            const divisor = Math.abs(netCashFlow) || 1;
            cashRunwayMonths = i - 1 + (currentCash - netCashFlow) / divisor; // Fractional month
            if (cashRunwayMonths < 0) cashRunwayMonths = 0;
        }
    }

    return {
        cashRunwayMonths: survived ? monthsToSimulate : Number(cashRunwayMonths.toFixed(1)),
        survived,
        monthlyProjections: projections
    };
}

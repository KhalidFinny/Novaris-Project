import { FinancialInput, SimulationResult } from './types';

export function runSimulationMatch(inputs: FinancialInput, seedVariance: number = 0.2): SimulationResult {
    const monthsToSimulate = 12;
    let currentCash = inputs.currentCashReserves;
    const projections = [];
    let survived = true;
    let cashRunwayMonths = monthsToSimulate;

    // Adjust variance based on confidence level (Lower confidence = Higher variance)
    const baseVariance = seedVariance * (1 + (1 - (inputs.confidenceLevel || 1)));

    for (let i = 1; i <= monthsToSimulate; i++) {
        // FRAGILITY SCALING: Variance increases as cash reserve drops below the emergency buffer
        const fragilityFactor = currentCash < inputs.emergencyBufferSize
            ? 1 + (Math.max(0, inputs.emergencyBufferSize - currentCash) / (inputs.emergencyBufferSize || 1))
            : 1;
        const adjustedVariance = baseVariance * fragilityFactor;

        // Apply variance to revenue
        const revenueVariance = 1 + (Math.random() * adjustedVariance * 2 - adjustedVariance);

        // Apply seasonality if applicable
        const seasonalityMultiplier = 1 + (inputs.seasonalityFactor * Math.sin((i / 12) * Math.PI * 2));

        // Apply growth
        const growthMultiplier = 1 + (inputs.projectedGrowthRate / 100);

        const simulatedRevenue = inputs.monthlyRevenue * revenueVariance * seasonalityMultiplier * growthMultiplier;

        // Calculate Base Expenses
        const variableCosts = simulatedRevenue * (inputs.variableCostPercentage / 100);
        const costSpikeMultiplier = Math.random() < 0.05 ? (1.2 * fragilityFactor) : 1; // Spikes are worse when fragile
        let totalExpenses = (inputs.fixedCosts * costSpikeMultiplier) + variableCosts + inputs.monthlyDebtObligations;

        // CALCULATE THE CASCADE EFFECT & HIDDEN RISKS
        if (inputs.activeProjectDelayDays && inputs.activeProjectDelayDays > 0) {
            const daysInMonth = 30;
            const monthStartDay = (i - 1) * daysInMonth;
            const remainingDelayDays = Math.max(0, inputs.activeProjectDelayDays - monthStartDay);

            if (remainingDelayDays > 0) {
                const effectiveDelayDaysInThisMonth = Math.min(daysInMonth, remainingDelayDays);

                // 1. Burn Rate Impact
                const delayBurn = effectiveDelayDaysInThisMonth * (inputs.activeProjectDailyBurn || 0);
                totalExpenses += delayBurn;

                // 2. Revenue Displacement & Opportunity Cost
                // We model this as a reduction in simulated revenue due to team being stuck
                const opportunityCost = effectiveDelayDaysInThisMonth * (inputs.opportunityCostPerDay || 0);
                totalExpenses += opportunityCost; // We add as expense for simplicity in cash balance tracking

                // 3. Contractual Penalties
                const totalDaysElapsedSinceStart = inputs.activeProjectDelayDays; // Assuming delay started at simulation start
                if (inputs.penaltyThresholdDays && totalDaysElapsedSinceStart > inputs.penaltyThresholdDays) {
                    // If this is the month where the threshold is crossed, apply penalty
                    const dayPenaltyStarts = inputs.penaltyThresholdDays;
                    if (dayPenaltyStarts >= monthStartDay && dayPenaltyStarts < (monthStartDay + daysInMonth)) {
                        totalExpenses += (inputs.penaltyAmount || 0);
                    }
                }
            }
        }

        const netCashFlow = simulatedRevenue - totalExpenses;
        currentCash += netCashFlow;

        // Calculate a simple variance range for the Fan Chart at this point in time
        // This grows as we go further into the future
        const uncertaintyFactor = (i / 12) * adjustedVariance;
        const low = currentCash * (1 - uncertaintyFactor);
        const high = currentCash * (1 + uncertaintyFactor);

        projections.push({
            month: i,
            revenue: Math.round(simulatedRevenue),
            expenses: Math.round(totalExpenses),
            cashBalance: Math.round(currentCash),
            varianceRange: [Math.round(low), Math.round(high)]
        });

        if (currentCash < 0 && survived) {
            survived = false;
            const divisor = Math.abs(netCashFlow) || 1;
            cashRunwayMonths = i - 1 + (currentCash - netCashFlow) / divisor;
            if (cashRunwayMonths < 0) cashRunwayMonths = 0;
        }
    }

    return {
        cashRunwayMonths: survived ? monthsToSimulate : Number(cashRunwayMonths.toFixed(1)),
        survived,
        monthlyProjections: projections
    };
}

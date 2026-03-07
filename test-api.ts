import { evaluateFinancialRisk } from './src/lib/engine/riskModel';
import { FinancialInputSchema } from './src/lib/engine/types';

try {
  const payload = {
    monthlyRevenue: 50000,
    fixedCosts: 20000,
    variableCostPercentage: 40,
    monthlyDebtObligations: 5000,
    seasonalityFactor: 0.1,
    projectedGrowthRate: 5,
    currentCashReserves: 100000,
    emergencyBufferSize: 30000,
    activeProjectDelayDays: 0,
    activeProjectDailyBurn: 0,
    confidenceLevel: 1,
    opportunityCostPerDay: 0,
    penaltyThresholdDays: 0,
    penaltyAmount: 0
  };
  const parsed = FinancialInputSchema.parse(payload);
  console.log("Validation passed");
  const result = evaluateFinancialRisk(parsed);
  console.log("Simulation Result:", JSON.stringify(result, null, 2));
} catch (e) {
  console.error("Error:", e);
}

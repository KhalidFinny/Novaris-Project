import { z } from 'zod';

export const FinancialInputSchema = z.object({
    monthlyRevenue: z.number().min(0, "Revenue cannot be negative").max(10_000_000_000, "Revenue too large"),
    fixedCosts: z.number().min(0, "Fixed costs cannot be negative").max(10_000_000_000, "Fixed costs too large"),
    variableCostPercentage: z.number().min(0).max(100, "Must be between 0 and 100"),
    monthlyDebtObligations: z.number().min(0, "Debt obligations cannot be negative").max(10_000_000_000, "Debt too large"),
    seasonalityFactor: z.number().min(0).max(1, "Must be between 0 and 1"),
    projectedGrowthRate: z.number().min(-100).max(1000, "Unrealistic growth rate"),
    currentCashReserves: z.number().min(0, "Cash cannot be negative").max(10_000_000_000, "Cash too large"),
    emergencyBufferSize: z.number().min(0, "Buffer cannot be negative").max(10_000_000_000, "Buffer too large"),
});

export type FinancialInput = z.infer<typeof FinancialInputSchema>;

export const FinancialOutputSchema = z.object({
    riskScore: z.number().min(0).max(100),
    cashRunwayMonths: z.number().min(0),
    survivalProbability: z.number().min(0).max(100),
    topRiskDrivers: z.array(z.string()),
    monthlyProjections: z.array(z.object({
        month: z.number(),
        revenue: z.number(),
        expenses: z.number(),
        cashBalance: z.number(),
    })),
    mitigationSuggestions: z.array(z.string()),
});

export type FinancialOutput = z.infer<typeof FinancialOutputSchema>;

import { z } from 'zod';

// ── SIMULATION TYPES ──

export interface SimulationResult {
    cashRunwayMonths: number;
    survived: boolean;
    monthlyProjections: {
        month: number,
        revenue: number,
        expenses: number,
        cashBalance: number,
        varianceRange: number[] // [low, high] for Fan Chart
    }[];
}

// ── FINANCIAL TYPES ──

export const FinancialInputSchema = z.object({
    monthlyRevenue: z.number().min(0, "Revenue cannot be negative").max(10_000_000_000, "Revenue too large"),
    fixedCosts: z.number().min(0, "Fixed costs cannot be negative").max(10_000_000_000, "Fixed costs too large"),
    variableCostPercentage: z.number().min(0).max(100, "Must be between 0 and 100"),
    monthlyDebtObligations: z.number().min(0, "Debt obligations cannot be negative").max(10_000_000_000, "Debt too large"),
    seasonalityFactor: z.number().min(0).max(1, "Must be between 0 and 1"),
    projectedGrowthRate: z.number().min(-100).max(1000, "Unrealistic growth rate"),
    currentCashReserves: z.number().min(0, "Cash cannot be negative").max(10_000_000_000, "Cash too large"),
    emergencyBufferSize: z.number().min(0, "Buffer cannot be negative").max(10_000_000_000, "Buffer too large"),

    // The Cascade Effect inputs
    activeProjectDelayDays: z.number().min(0).optional().default(0),
    activeProjectDailyBurn: z.number().min(0).optional().default(0),
    confidenceLevel: z.number().min(0).max(1).optional().default(1), // 1 = 100% Fact, 0 = 100% Guess

    // Hidden Risk factors
    opportunityCostPerDay: z.number().min(0).optional().default(0), // Lost revenue from future projects
    penaltyThresholdDays: z.number().min(0).optional().default(0), // Days until contractual penalty kicks in
    penaltyAmount: z.number().min(0).optional().default(0), // Amount of penalty
});

export type FinancialInput = z.infer<typeof FinancialInputSchema>;

export const FinancialOutputSchema = z.object({
    riskScore: z.number().min(0).max(100),
    cashRunwayMonths: z.number().min(0),
    survivalProbability: z.number().min(0).max(100),
    resilienceShields: z.number().min(1).max(3), // 1 = Fragile, 2 = Robust, 3 = Secure
    isFragile: z.boolean(),
    topRiskDrivers: z.array(z.string()),
    monthlyProjections: z.array(z.object({
        month: z.number(),
        revenue: z.number(),
        expenses: z.number(),
        cashBalance: z.number(),
        varianceRange: z.array(z.number()), // [low, high] for the Fan Chart
    })),
    mitigationSuggestions: z.array(z.string()),
    decisionStory: z.object({
        headline: z.string(),
        unseenRisk: z.string(),
        impactSummary: z.string(),
        recommendation: z.string(),
        riskVisualLevel: z.enum(['low', 'medium', 'high', 'critical']),
    }).optional(),
});

export type FinancialOutput = z.infer<typeof FinancialOutputSchema>;

// ── DELAY TYPES ──

export const DelayInputSchema = z.object({
    targetDurationDays: z.number().min(1, "Project must have a duration").max(3650, "Duration exceeds limits"),
    teamSize: z.number().min(1, "Team must have at least 1 member").max(1000, "Team excessively large"),
    complexityScore: z.number().min(1).max(5, "Complexity must be between 1 and 5"), // 1 = Simple, 5 = Highly Complex
    supplierLeadTimeVarianceDays: z.number().min(0, "Variance cannot be negative").max(365, "Variance exceeds 1 year limit"),
    externalDependenciesCount: z.number().min(0).max(100, "Maximum limit reached"),
    historicalDelayRate: z.number().min(0).max(100), // % of past projects delayed
    bufferDaysRemaining: z.number().min(0, "Buffer cannot be negative").max(365, "Buffer exceeds 1 year limit"),
    financialSensitivity: z.number().min(0).max(1).optional().default(0.5), // 0 = Immune to liquidity, 1 = High sensitivity
    managementConfidence: z.number().min(0).max(1).optional(), // confidence in staying on schedule; bounded impact
});

export type DelayInput = z.infer<typeof DelayInputSchema>;

export interface RiskFactor {
    factor: string;
    weight: number; // 0 to 1 impact score
    delayDaysAdded: number;
}

export const DelayOutputSchema = z.object({
    delayProbability: z.number().min(0).max(100),
    estimatedDelayDaysRange: z.tuple([z.number(), z.number()]),
    expectedDurationDays: z.number(),
    delayMonitoringActive: z.boolean(),
    delayMonitoringState: z.enum(['inactive', 'watch', 'active', 'critical']),
    delayActivationReasons: z.array(z.string()),
    objectiveConfidence: z.number().min(0).max(1),
    confidenceAdjustmentApplied: z.number().min(-0.12).max(0.12),
    criticalBottlenecks: z.array(z.object({
        factor: z.string(),
        weight: z.number(),
        delayDaysAdded: z.number()
    })),
    timelineProjection: z.array(z.object({
        phase: z.string(),
        optimisticDays: z.number(),
        pessimisticDays: z.number(),
    })),
    mitigationSuggestions: z.array(z.string()),
});

export type DelayOutput = z.infer<typeof DelayOutputSchema>;

// ── STORYTELLING TYPES ──

export interface DecisionStory {
    headline: string;
    unseenRisk: string;
    impactSummary: string;
    recommendation: string;
    riskVisualLevel: 'low' | 'medium' | 'high' | 'critical';
}

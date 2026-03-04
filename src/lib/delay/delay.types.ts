import { z } from 'zod';

export const DelayInputSchema = z.object({
    targetDurationDays: z.number().min(1, "Project must have a duration").max(3650, "Duration exceeds limits"),
    teamSize: z.number().min(1, "Team must have at least 1 member").max(1000, "Team excessively large"),
    complexityScore: z.number().min(1).max(5, "Complexity must be between 1 and 5"), // 1 = Simple, 5 = Highly Complex
    supplierLeadTimeVarianceDays: z.number().min(0, "Variance cannot be negative").max(365, "Variance exceeds 1 year limit"),
    externalDependenciesCount: z.number().min(0).max(100, "Maximum limit reached"),
    historicalDelayRate: z.number().min(0).max(100), // % of past projects delayed
    bufferDaysRemaining: z.number().min(0, "Buffer cannot be negative").max(365, "Buffer exceeds 1 year limit"),
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

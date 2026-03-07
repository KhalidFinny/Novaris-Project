import type { DelayInput } from '../../lib/engine/types';

export const DEFAULT_DELAY: DelayInput = {
    targetDurationDays: 0,
    teamSize: 0,
    complexityScore: 1,
    supplierLeadTimeVarianceDays: 0,
    externalDependenciesCount: 0,
    historicalDelayRate: 0,
    bufferDaysRemaining: 0,
    financialSensitivity: 0.5,
};

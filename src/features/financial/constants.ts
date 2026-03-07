import type { FinancialInput } from '../../lib/engine/types';

export const DEFAULT_FINANCIAL: FinancialInput = {
    monthlyRevenue: 0,
    fixedCosts: 0,
    variableCostPercentage: 0,
    monthlyDebtObligations: 0,
    seasonalityFactor: 0,
    projectedGrowthRate: 0,
    currentCashReserves: 0,
    emergencyBufferSize: 0,
    activeProjectDelayDays: 0,
    activeProjectDailyBurn: 0,
    confidenceLevel: 1,
    opportunityCostPerDay: 0,
    penaltyThresholdDays: 0,
    penaltyAmount: 0,
};

export const RISK_COLORS: Record<string, string> = {
    low: 'var(--color-steel-bright)',
    medium: '#eab308', // gold/yellow
    high: 'var(--color-scarlet)',
    critical: '#A41624', // darker scarlet
};

import { describe, it, expect } from 'vitest';
import { evaluateFinancialRisk } from './riskModel';
import { FinancialInput, FinancialInputSchema } from './financial.types';

describe('evaluateFinancialRisk', () => {
    it('should calculate valid risk scores for healthy numbers', () => {
        const mockInput: FinancialInput = {
            monthlyRevenue: 100000,
            fixedCosts: 10000,
            variableCostPercentage: 20,
            monthlyDebtObligations: 2000,
            seasonalityFactor: 0.1,
            projectedGrowthRate: 10,
            currentCashReserves: 500000,
            emergencyBufferSize: 30000
        };

        const result = evaluateFinancialRisk(mockInput);

        expect(result.cashRunwayMonths).toBeGreaterThanOrEqual(11.5);
        expect(result.riskScore).toBeLessThan(50);
    });

    // Add more edge cases where inputs cause high risk
    it('should calculate high risk score for terrible numbers', () => {
        const mockInput: FinancialInput = {
            monthlyRevenue: 10000,
            fixedCosts: 15000,
            variableCostPercentage: 80,
            monthlyDebtObligations: 5000,
            seasonalityFactor: 0.5,
            projectedGrowthRate: -10,
            currentCashReserves: 20000,
            emergencyBufferSize: 5000
        };

        const result = evaluateFinancialRisk(mockInput);

        expect(result.cashRunwayMonths).toBeLessThan(6);
        expect(result.riskScore).toBeGreaterThan(60);
    });

    it('should reject massive inputs exceeding boundaries to prevent DoS', () => {
        const maliciousInput = {
            monthlyRevenue: 1e15, // 1 quadrillion
            fixedCosts: 10000,
            variableCostPercentage: 20,
            monthlyDebtObligations: 2000,
            seasonalityFactor: 0.1,
            projectedGrowthRate: 10,
            currentCashReserves: 500000,
            emergencyBufferSize: 30000
        };

        const result = FinancialInputSchema.safeParse(maliciousInput);
        expect(result.success).toBe(false);
    });
});

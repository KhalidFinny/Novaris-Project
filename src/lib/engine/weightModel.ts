import { DelayInput, DelayOutput, RiskFactor } from './types';
import { generateMitigationSuggestions } from './mitigation';

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

export function evaluateDelayRisk(inputs: DelayInput): DelayOutput {
    // Phase breakdown baseline
    const phases = [
        { phase: "Planning & Procurement", percentOfTime: 0.3 },
        { phase: "Execution & Build", percentOfTime: 0.5 },
        { phase: "Testing & Handover", percentOfTime: 0.2 },
    ];

    // Core risk factors with relative weights (0-1)
    const riskFactors: RiskFactor[] = [];
    let totalDelayAdded = 0;

    // 1. Complexity Risk (Exponential delay factor)
    if (inputs.complexityScore > 2) {
        const complexityWeight = (inputs.complexityScore - 2) * 0.15;
        const delay = inputs.targetDurationDays * complexityWeight;
        totalDelayAdded += delay;
        riskFactors.push({ factor: "Project Complexity", weight: complexityWeight, delayDaysAdded: delay });
    }

    // 2. Team Bottleneck Risk (If too few people for the duration/complexity)
    const teamRatio = inputs.targetDurationDays / (inputs.teamSize * 5); // arbitrary constant for ratio
    if (teamRatio > 1 && inputs.complexityScore >= 3) {
        const teamWeight = Math.min(0.4, (teamRatio - 1) * 0.1);
        const delay = inputs.targetDurationDays * teamWeight;
        totalDelayAdded += delay;
        riskFactors.push({ factor: "Resource Constraint", weight: teamWeight, delayDaysAdded: delay });
    }

    // 3. Supplier Lead Time Risk
    if (inputs.supplierLeadTimeVarianceDays > 0) {
        const supplierWeight = Math.min(0.3, inputs.supplierLeadTimeVarianceDays / inputs.targetDurationDays);
        const delay = inputs.supplierLeadTimeVarianceDays * 1.5; // Pessimistic view
        totalDelayAdded += delay;
        riskFactors.push({ factor: "Supplier Lead Variance", weight: supplierWeight, delayDaysAdded: Math.min(delay, inputs.targetDurationDays * 0.5) });
    }

    // 4. External Dependencies
    if (inputs.externalDependenciesCount > 0) {
        const depWeight = Math.min(0.25, inputs.externalDependenciesCount * 0.05);
        const delay = inputs.externalDependenciesCount * 3; // 3 days per external blocker
        totalDelayAdded += delay;
        riskFactors.push({ factor: "External Dependencies", weight: depWeight, delayDaysAdded: delay });
    }

    // Sort risk factors descending by weight
    riskFactors.sort((a, b) => b.weight - a.weight);

    // Calculate probabilities
    // Base probability derived from historical rate and total weights
    const combinedWeight = riskFactors.reduce((sum, rf) => sum + rf.weight, 0);
    const calculatedProbability = (inputs.historicalDelayRate / 100) * 0.4 + combinedWeight * 0.6;
    const baseProbability = Math.min(99, Math.max(1, calculatedProbability * 100)); // Cap between 1 and 99%

    // Management confidence is accepted but intentionally bounded so subjective optimism
    // can never dominate objective risk signals.
    const objectiveRiskSignal = clamp(
        combinedWeight * 0.65 + (inputs.historicalDelayRate / 100) * 0.35,
        0,
        1,
    );
    const objectiveConfidence = clamp(1 - objectiveRiskSignal, 0, 1);
    const managementConfidence = clamp(inputs.managementConfidence ?? 0.5, 0, 1);
    const confidenceAlignment = 1 - Math.abs(managementConfidence - objectiveConfidence);
    const confidenceAdjustmentApplied = clamp(
        (managementConfidence - 0.5) * 0.24 * confidenceAlignment,
        -0.12,
        0.12,
    );

    const finalProbability = clamp(
        baseProbability * (1 - confidenceAdjustmentApplied),
        1,
        99,
    );

    // Account for buffer
    const netDelayDays = Math.max(0, totalDelayAdded - inputs.bufferDaysRemaining);
    const pessimisticDelay = netDelayDays * 1.3;
    const expectedDuration = inputs.targetDurationDays + netDelayDays;

    // Timeline projection
    let currentOpt = 0;
    let currentPess = 0;
    const timelineProjection = phases.map(p => {
        const optDays = inputs.targetDurationDays * p.percentOfTime;
        const pessDays = expectedDuration * p.percentOfTime;

        currentOpt += optDays;
        currentPess += pessDays;

        return {
            phase: p.phase,
            optimisticDays: Math.round(currentOpt),
            pessimisticDays: Math.round(currentPess)
        };
    });

    const mitigations = generateMitigationSuggestions(riskFactors, inputs);

    const delayActivationReasons: string[] = [];
    if (expectedDuration > inputs.targetDurationDays) {
        delayActivationReasons.push("Expected completion exceeds contract target duration");
    }
    if (netDelayDays > 0) {
        delayActivationReasons.push("Predicted delay consumes remaining schedule buffer");
    }
    if (finalProbability >= 25) {
        delayActivationReasons.push("Delay probability is above watch threshold");
    }
    if (riskFactors[0] && riskFactors[0].delayDaysAdded > inputs.bufferDaysRemaining) {
        delayActivationReasons.push("Top bottleneck impact is larger than remaining buffer");
    }

    const delayMonitoringActive = delayActivationReasons.length > 0;
    const delayMonitoringState: 'inactive' | 'watch' | 'active' | 'critical' =
        !delayMonitoringActive
            ? 'inactive'
            : finalProbability >= 70
                ? 'critical'
                : finalProbability >= 45
                    ? 'active'
                    : 'watch';

    return {
        delayProbability: Math.round(finalProbability),
        expectedDurationDays: Math.round(expectedDuration),
        estimatedDelayDaysRange: [Math.round(netDelayDays * 0.8), Math.round(pessimisticDelay)] as [number, number],
        delayMonitoringActive,
        delayMonitoringState,
        delayActivationReasons,
        objectiveConfidence: Number(objectiveConfidence.toFixed(2)),
        confidenceAdjustmentApplied: Number(confidenceAdjustmentApplied.toFixed(3)),
        criticalBottlenecks: riskFactors.slice(0, 3), // Top 3
        timelineProjection,
        mitigationSuggestions: mitigations
    };
}

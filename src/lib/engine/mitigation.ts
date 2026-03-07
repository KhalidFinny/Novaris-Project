import { DelayInput, RiskFactor } from './types';

export function generateMitigationSuggestions(riskFactors: RiskFactor[], inputs: DelayInput): string[] {
    const suggestions: string[] = [];

    // Prioritize top 2 risks
    const topRisks = riskFactors.slice(0, 2);

    for (const risk of topRisks) {
        switch (risk.factor) {
            case "Project Complexity":
                suggestions.push("Break down the project into smaller, manageable phases to reduce overlapping complexity risks.");
                break;
            case "Resource Constraint":
                suggestions.push(`Add at least ${Math.ceil(inputs.teamSize * 0.5)} more team members to parallelize tasks and reduce bottlenecking.`);
                break;
            case "Supplier Lead Variance":
                suggestions.push("Identify backup suppliers for critical path materials to mitigate lead time variance.");
                break;
            case "External Dependencies":
                suggestions.push("Begin clearing external dependencies (permits, approvals) immediately, as they account for significant delay blocks.");
                break;
        }
    }

    // General buffer suggestion based on the model
    if (riskFactors.length > 0 && inputs.bufferDaysRemaining < riskFactors[0].delayDaysAdded) {
        suggestions.push(`Increase project buffer by at least ${Math.ceil(riskFactors[0].delayDaysAdded - inputs.bufferDaysRemaining)} days to cover the immediate high-priority risks.`);
    }

    // Default if no top risks found (unlikely but safe)
    if (suggestions.length === 0) {
        suggestions.push("Maintain current buffer and monitor supplier lead times closely.");
    }

    return suggestions;
}

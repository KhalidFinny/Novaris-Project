import type { VercelRequest, VercelResponse } from '@vercel/node';
import { FinancialInputSchema } from '../src/lib/financial/financial.types';
import { evaluateFinancialRisk } from '../src/lib/financial/riskModel';
import { ZodError } from 'zod';

export default function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests for the simulation
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    try {
        // 1. Zod Validation
        const parsedBody = FinancialInputSchema.parse(req.body);

        // 2. Run simulation engine
        const simulationResult = evaluateFinancialRisk(parsedBody);

        // 3. Return structured JSON output
        return res.status(200).json(simulationResult);

    } catch (error: any) {
        // Handle Zod validation errors gracefully
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.issues
            });
        }

        // Handle unexpected errors
        console.error("Financial API Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

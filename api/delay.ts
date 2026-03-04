import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DelayInputSchema } from '../src/lib/delay/delay.types';
import { evaluateDelayRisk } from '../src/lib/delay/weightModel';
import { ZodError } from 'zod';

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    try {
        const parsedBody = DelayInputSchema.parse(req.body);
        const simulationResult = evaluateDelayRisk(parsedBody);

        return res.status(200).json(simulationResult);

    } catch (error: any) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.issues
            });
        }

        console.error("Delay API Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

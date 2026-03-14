import type { VercelRequest, VercelResponse } from "@vercel/node";
import { calculateDecisionCenter } from "../src/lib/engine/decisionCenterEngine";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  try {
    const body = req.body;
    if (!body || !body.essentials || !body.delayRisk || !body.scenario) {
      return res.status(400).json({ error: "Invalid Decision Center payload." });
    }

    const result = calculateDecisionCenter(body, body.language === "id" ? "id" : "en");
    return res.status(200).json(result);
  } catch (error) {
    console.error("Decision Center API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

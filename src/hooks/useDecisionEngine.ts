import { useState, useEffect } from "react";
import type { AllInputs, DecisionCenterData } from "../types/decisionCenter";
import { calculateDecisionCenter } from "../lib/engine/decisionCenterEngine";

export function useDecisionEngine(
  submittedInputs: AllInputs | null,
  scenarioInputs: AllInputs["scenario"],
  language: "en" | "id",
  initialData: DecisionCenterData
) {
  const [data, setData] = useState<DecisionCenterData>(initialData);
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isId = language === "id";

  // Calculate when submitted inputs change
  useEffect(() => {
    if (!submittedInputs) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setData((prev) => ({ ...prev, isCalculating: true }));
      setErrorMessage(null);

      try {
        if (import.meta.env.DEV && import.meta.env.VITE_USE_HTTP_API !== "true") {
          const local = calculateDecisionCenter(submittedInputs, language);
          setData({ ...local, isCalculating: false, lastUpdated: new Date() });
          return;
        }

        if (apiUnavailable) {
          const local = calculateDecisionCenter(submittedInputs, language);
          setData({ ...local, isCalculating: false, lastUpdated: new Date() });
          return;
        }

        const res = await fetch("/api/decision-center", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...submittedInputs, language }),
          signal: controller.signal,
        });

        if (res.status === 404) {
          setApiUnavailable(true);
          const local = calculateDecisionCenter(submittedInputs, language);
          setData({ ...local, isCalculating: false, lastUpdated: new Date() });
          return;
        }

        if (!res.ok) {
          throw new Error("Decision Center request failed");
        }

        const result = (await res.json()) as DecisionCenterData;
        setData({ ...result, isCalculating: false, lastUpdated: new Date() });
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
          const local = calculateDecisionCenter(submittedInputs, language);
          setApiUnavailable(true);
          setErrorMessage(
            isId
              ? "Analisis online gagal. Menggunakan engine lokal."
              : "Online analysis failed. Using local engine.",
          );
          setData({ ...local, isCalculating: false, lastUpdated: new Date() });
        }
      }
    }, 120);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [submittedInputs, apiUnavailable, isId, language]);

  // Recalculate when scenario sliders change
  useEffect(() => {
    if (!submittedInputs) return;

    const timer = setTimeout(() => {
      const inputsWithScenario = {
        ...submittedInputs,
        scenario: { ...scenarioInputs },
      };
      const local = calculateDecisionCenter(inputsWithScenario, language);
      setData({ ...local, isCalculating: false, lastUpdated: new Date() });
    }, 120);

    return () => clearTimeout(timer);
  }, [scenarioInputs, submittedInputs, language]);

  return { data, setData, apiUnavailable, setApiUnavailable, errorMessage, setErrorMessage };
}

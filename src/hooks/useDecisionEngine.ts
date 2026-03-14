import { useState, useEffect, useMemo } from "react";
import type { AllInputs, DecisionCenterData } from "../types/decisionCenter";
import { calculateDecisionCenter } from "../lib/engine/decisionCenterEngine";
import { useLocale } from "./useLocale";

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
  const { currency, convertAmount } = useLocale();

  // Helper to normalize inputs to USD for consistent internal math
  const normalizedSubmittedInputs = useMemo(() => {
    if (!submittedInputs) return null;
    
    return {
      ...submittedInputs,
      essentials: {
        ...submittedInputs.essentials,
        cashInBank: toNumber(convertAmount(Number(submittedInputs.essentials.cashInBank || 0), currency, "USD")),
        monthlyBills: toNumber(convertAmount(Number(submittedInputs.essentials.monthlyBills || 0), currency, "USD")),
        monthlyRevenue: toNumber(convertAmount(Number(submittedInputs.essentials.monthlyRevenue || 0), currency, "USD")),
        monthlyRevenueTarget: toNumber(convertAmount(Number(submittedInputs.essentials.monthlyRevenueTarget || 0), currency, "USD")),
      },
      delayRisk: {
        ...submittedInputs.delayRisk,
        paymentAtRisk: toNumber(convertAmount(Number(submittedInputs.delayRisk.paymentAtRisk || 0), currency, "USD")),
      }
    } as AllInputs;
  }, [submittedInputs, currency, convertAmount]);

  const normalizedScenarioInputs = useMemo(() => {
    return {
      ...scenarioInputs,
      cashInjection: toNumber(convertAmount(Number(scenarioInputs.cashInjection || 0), currency, "USD")),
      overheadReduction: toNumber(convertAmount(Number(scenarioInputs.overheadReduction || 0), currency, "USD")),
      newRevenue30d: toNumber(convertAmount(Number(scenarioInputs.newRevenue30d || 0), currency, "USD")),
    };
  }, [scenarioInputs, currency, convertAmount]);

function toNumber(val: any): number | "" {
  if (val === "" || val === null || val === undefined) return "";
  const num = Number(val);
  return isNaN(num) ? "" : num;
}

  // Calculate when submitted inputs change
  useEffect(() => {
    if (!normalizedSubmittedInputs) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setData((prev) => ({ ...prev, isCalculating: true }));
      setErrorMessage(null);

      try {
        if (import.meta.env.DEV && import.meta.env.VITE_USE_HTTP_API !== "true") {
          const local = calculateDecisionCenter(normalizedSubmittedInputs, language);
          setData({ ...local, isCalculating: false, lastUpdated: new Date() });
          return;
        }

        if (apiUnavailable) {
          const local = calculateDecisionCenter(normalizedSubmittedInputs, language);
          setData({ ...local, isCalculating: false, lastUpdated: new Date() });
          return;
        }

        const res = await fetch("/api/decision-center", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...normalizedSubmittedInputs, language }),
          signal: controller.signal,
        });

        if (res.status === 404) {
          setApiUnavailable(true);
          const local = calculateDecisionCenter(normalizedSubmittedInputs, language);
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
          const local = calculateDecisionCenter(normalizedSubmittedInputs, language);
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
  }, [normalizedSubmittedInputs, apiUnavailable, isId, language]);

  // Recalculate when scenario sliders change
  useEffect(() => {
    if (!normalizedSubmittedInputs) return;

    const timer = setTimeout(() => {
      const inputsWithScenario = {
        ...normalizedSubmittedInputs,
        scenario: { ...normalizedScenarioInputs },
      };
      const local = calculateDecisionCenter(inputsWithScenario, language);
      setData({ ...local, isCalculating: false, lastUpdated: new Date() });
    }, 120);

    return () => clearTimeout(timer);
  }, [normalizedScenarioInputs, normalizedSubmittedInputs, language]);

  return { data, setData, apiUnavailable, setApiUnavailable, errorMessage, setErrorMessage };
}

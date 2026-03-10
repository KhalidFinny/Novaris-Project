import { useState, useEffect, useCallback } from "react";
import type {
  AllInputs,
  DecisionCenterData,
  EssentialInputs,
  DelayRiskInputs,
  ScenarioSnapshot,
} from "../types/decisionCenter";
import { calculateDecisionCenter } from "../lib/engine/decisionCenterEngine";

const createEmptyInputs = (): AllInputs => ({
  essentials: {
    cashInBank: "",
    monthlyBills: "",
    monthlyRevenue: "",
    monthlyRevenueTarget: "",
    biggestClientPercent: "",
  },
  delayRisk: {
    projectTargetDays: "",
    paymentAtRisk: "",
    teamSize: "",
    bufferDays: "",
  },
  scenario: {
    cashInjection: "",
    projectAccelerationWeeks: "",
    overheadReduction: "",
    earlyARCollectionRate: "",
    newRevenue30d: "",
  },
  activeScenario: null,
});

const createEmptyData = (): DecisionCenterData => ({
  kpi: {
    cashRunway: null,
    monthlyRevenue: null,
    dailyBurn: null,
    compliance: null,
  },
  narrative: null,
  riskBridge: [],
  dominoChain: null,
  charts: null,
  analysis: {
    riskScores: [],
    scenarioOutput: null,
  },
  shield: {
    level: 0,
    conditions: {
      lfi: 0,
      runway: 0,
      revenueGap: 0,
      compliance: 0,
      currentRatio: 0,
      burnTrend: "stable",
      projectsOnSchedule: true,
    },
  },
  isCalculating: false,
  lastUpdated: null,
});

const SUBMITTED_INPUTS_STORAGE_KEY = "novaris_decision_center_submitted_v1";
const SNAPSHOTS_STORAGE_KEY = "novaris_decision_center_snapshots_v1";

export function useDecisionCenter(language: "en" | "id") {
  const isId = language === "id";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputs, setInputs] = useState<AllInputs>(createEmptyInputs());
  const [submittedInputs, setSubmittedInputs] = useState<AllInputs | null>(null);
  const [scenarioSnapshots, setScenarioSnapshots] = useState<ScenarioSnapshot[]>([]);
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const missingEssentials = [
    inputs.essentials.cashInBank === "" ? "cashInBank" : null,
    inputs.essentials.monthlyBills === "" ? "monthlyBills" : null,
    inputs.essentials.monthlyRevenue === "" ? "monthlyRevenue" : null,
    inputs.essentials.biggestClientPercent === "" ? "biggestClientPercent" : null,
  ].filter(Boolean) as string[];

  const delayTouched = Object.values(inputs.delayRisk).some((value) => value !== "");
  const validateDelay = delayTouched;
  const missingDelay = [
    inputs.delayRisk.projectTargetDays === "" ? "projectTargetDays" : null,
    inputs.delayRisk.paymentAtRisk === "" ? "paymentAtRisk" : null,
    inputs.delayRisk.teamSize === "" ? "teamSize" : null,
    inputs.delayRisk.bufferDays === "" ? "bufferDays" : null,
  ].filter(Boolean) as string[];

  const [data, setData] = useState<DecisionCenterData>(createEmptyData());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(SUBMITTED_INPUTS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AllInputs;
        setInputs(parsed);
        setSubmittedInputs(parsed);
      } catch (error) {
        console.error("Failed to restore Decision Center inputs", error);
        window.localStorage.removeItem(SUBMITTED_INPUTS_STORAGE_KEY);
      }
    }

    const snapshotStore = window.localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
    if (snapshotStore) {
      try {
        const parsedSnapshots = JSON.parse(snapshotStore) as ScenarioSnapshot[];
        setScenarioSnapshots(parsedSnapshots);
      } catch (error) {
        console.error("Failed to restore Decision Center snapshots", error);
        window.localStorage.removeItem(SNAPSHOTS_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(scenarioSnapshots));
  }, [scenarioSnapshots]);

  // Calculate when submitted inputs change
  useEffect(() => {
    if (!submittedInputs) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setData((prev) => ({ ...prev, isCalculating: true }));
      setErrorMessage(null);

      try {
        if (import.meta.env.DEV && import.meta.env.VITE_USE_HTTP_API !== "true") {
          const local = calculateDecisionCenter(submittedInputs);
          setData({ ...local, isCalculating: false, lastUpdated: new Date() });
          return;
        }

        if (apiUnavailable) {
          const local = calculateDecisionCenter(submittedInputs);
          setData({ ...local, isCalculating: false, lastUpdated: new Date() });
          return;
        }

        const res = await fetch("/api/decision-center", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submittedInputs),
          signal: controller.signal,
        });

        if (res.status === 404) {
          setApiUnavailable(true);
          const local = calculateDecisionCenter(submittedInputs);
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
          const local = calculateDecisionCenter(submittedInputs);
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
  }, [submittedInputs, apiUnavailable, isId]);

  // Recalculate when scenario sliders change (if we have submitted data)
  useEffect(() => {
    if (!submittedInputs) return;

    const timer = setTimeout(() => {
      const inputsWithScenario = {
        ...submittedInputs,
        scenario: { ...inputs.scenario },
      };
      const local = calculateDecisionCenter(inputsWithScenario);
      setData({ ...local, isCalculating: false, lastUpdated: new Date() });
    }, 120);

    return () => clearTimeout(timer);
  }, [inputs.scenario, submittedInputs]);

  const updateEssentials = useCallback((values: Partial<EssentialInputs>) => {
    setInputs((prev) => ({
      ...prev,
      essentials: { ...prev.essentials, ...values },
    }));
  }, []);

  const updateDelayRisk = useCallback((values: Partial<DelayRiskInputs>) => {
    setInputs((prev) => ({
      ...prev,
      delayRisk: { ...prev.delayRisk, ...values },
    }));
  }, []);

  const canSubmit =
    missingEssentials.length === 0 && (!validateDelay || missingDelay.length === 0);

  const handleConfirmData = useCallback(() => {
    if (!canSubmit) {
      setErrorMessage(
        missingEssentials.length > 0
          ? isId
            ? "Lengkapi dulu 4 angka utama Anda."
            : "Complete the 4 core numbers first."
          : isId
            ? "Lengkapi detail delay yang sudah Anda buka."
            : "Complete the delay details you opened.",
      );
      return;
    }

    setErrorMessage(null);
    const nextSubmittedInputs = {
      ...inputs,
      scenario: { ...inputs.scenario },
      essentials: { ...inputs.essentials },
      delayRisk: { ...inputs.delayRisk },
    };

    setSubmittedInputs(nextSubmittedInputs);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        SUBMITTED_INPUTS_STORAGE_KEY,
        JSON.stringify(nextSubmittedInputs),
      );
    }

    setSidebarOpen(false);
  }, [canSubmit, inputs, isId, missingEssentials.length, validateDelay, missingDelay.length]);

  const handleClearData = useCallback(() => {
    setInputs(createEmptyInputs());
    setSubmittedInputs(null);
    setScenarioSnapshots([]);
    setErrorMessage(null);
    setApiUnavailable(false);
    setData(createEmptyData());

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SUBMITTED_INPUTS_STORAGE_KEY);
      window.localStorage.removeItem(SNAPSHOTS_STORAGE_KEY);
    }
  }, []);

  const handleSaveSnapshot = useCallback(() => {
    const source = submittedInputs ?? inputs;
    const nextIndex = scenarioSnapshots.length + 1;
    const snapshot: ScenarioSnapshot = {
      id: `snapshot-${Date.now()}`,
      label: isId ? `Skenario ${nextIndex}` : `Scenario ${nextIndex}`,
      createdAt: new Date().toISOString(),
      inputs: {
        ...source,
        essentials: { ...source.essentials },
        delayRisk: { ...source.delayRisk },
        scenario: { ...source.scenario },
      },
    };

    setScenarioSnapshots((prev) => [snapshot, ...prev].slice(0, 6));
  }, [inputs, isId, scenarioSnapshots.length, submittedInputs]);

  const handleLoadSnapshot = useCallback(
    (snapshotId: string) => {
      const snapshot = scenarioSnapshots.find((item) => item.id === snapshotId);
      if (!snapshot) return;

      const restoredInputs: AllInputs = {
        ...snapshot.inputs,
        essentials: { ...snapshot.inputs.essentials },
        delayRisk: { ...snapshot.inputs.delayRisk },
        scenario: { ...snapshot.inputs.scenario },
      };

      setInputs(restoredInputs);
      setSubmittedInputs(restoredInputs);
      setErrorMessage(null);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          SUBMITTED_INPUTS_STORAGE_KEY,
          JSON.stringify(restoredInputs),
        );
      }
    },
    [scenarioSnapshots],
  );

  const handleDeleteSnapshot = useCallback((snapshotId: string) => {
    setScenarioSnapshots((prev) => prev.filter((item) => item.id !== snapshotId));
  }, []);

  return {
    sidebarOpen,
    setSidebarOpen,
    inputs,
    setInputs,
    submittedInputs,
    setSubmittedInputs,
    scenarioSnapshots,
    data,
    errorMessage,
    isCalculating: data.isCalculating,
    missingEssentials,
    missingDelay,
    validateDelay,
    canSubmit,
    updateEssentials,
    updateDelayRisk,
    handleConfirmData,
    handleClearData,
    handleSaveSnapshot,
    handleLoadSnapshot,
    handleDeleteSnapshot,
  };
}

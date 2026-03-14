import { useState, useCallback, useEffect, useRef } from "react";
import { useLocale } from "./useLocale";
import type {
  AllInputs,
  DecisionCenterData,
  EssentialInputs,
  DelayRiskInputs,
  ScenarioSnapshot,
} from "../types/decisionCenter";
import { useDecisionPersistence } from "./useDecisionPersistence";
import { useDecisionEngine } from "./useDecisionEngine";

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

export function useDecisionCenter(language: "en" | "id") {
  const isId = language === "id";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPaid, setIsPaidState] = useState(() => {
    return localStorage.getItem("novaris_reports_paid") === "true";
  });

  const setIsPaid = useCallback((val: boolean) => {
    setIsPaidState(val);
    localStorage.setItem("novaris_reports_paid", String(val));
  }, []);
  
  // Use Persistence Hook
  const {
    inputs,
    setInputs,
    submittedInputs,
    setSubmittedInputs,
    persistSubmittedInputs,
    scenarioSnapshots,
    setScenarioSnapshots,
    clearPersistence,
  } = useDecisionPersistence(createEmptyInputs());

  // Use Engine Hook
  const { 
    data, 
    setData, 
    setApiUnavailable, 
    errorMessage, 
    setErrorMessage 
  } = useDecisionEngine(submittedInputs, inputs.scenario, language, createEmptyData());

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

  const updateEssentials = useCallback((values: Partial<EssentialInputs>) => {
    setInputs((prev) => ({
      ...prev,
      essentials: { ...prev.essentials, ...values },
    }));
  }, [setInputs]);

  const { currency, convertAmount } = useLocale();
  const prevCurrencyRef = useRef(currency);

  useEffect(() => {
    if (prevCurrencyRef.current !== currency) {
      const oldCurrency = prevCurrencyRef.current;
      const newCurrency = currency;

      setInputs((prev) => {
        const convert = (val: string | number) => {
          if (val === "" || val === undefined) return "";
          return convertAmount(Number(val), oldCurrency, newCurrency);
        };

        return {
          ...prev,
          essentials: {
            ...prev.essentials,
            cashInBank: convert(prev.essentials.cashInBank),
            monthlyBills: convert(prev.essentials.monthlyBills),
            monthlyRevenue: convert(prev.essentials.monthlyRevenue),
            monthlyRevenueTarget: convert(prev.essentials.monthlyRevenueTarget ?? ""),
          },
          delayRisk: {
            ...prev.delayRisk,
            paymentAtRisk: convert(prev.delayRisk.paymentAtRisk),
          },
          scenario: {
            ...prev.scenario,
            cashInjection: convert(prev.scenario.cashInjection),
            overheadReduction: convert(prev.scenario.overheadReduction),
            newRevenue30d: convert(prev.scenario.newRevenue30d),
          },
        };
      });

      prevCurrencyRef.current = currency;
    }
  }, [currency, convertAmount, setInputs]);

  const updateDelayRisk = useCallback((values: Partial<DelayRiskInputs>) => {
    setInputs((prev) => ({
      ...prev,
      delayRisk: { ...prev.delayRisk, ...values },
    }));
  }, [setInputs]);

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

    persistSubmittedInputs(nextSubmittedInputs);
    setSidebarOpen(false);
  }, [canSubmit, inputs, isId, missingEssentials.length, validateDelay, missingDelay.length, setErrorMessage, persistSubmittedInputs]);

  const handleClearData = useCallback(() => {
    setInputs(createEmptyInputs());
    clearPersistence();
    setErrorMessage(null);
    setApiUnavailable(false);
    setData(createEmptyData());
  }, [setInputs, clearPersistence, setErrorMessage, setApiUnavailable, setData]);

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
  }, [inputs, isId, scenarioSnapshots.length, submittedInputs, setScenarioSnapshots]);

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
      persistSubmittedInputs(restoredInputs);
      setErrorMessage(null);
    },
    [scenarioSnapshots, setInputs, persistSubmittedInputs, setErrorMessage],
  );

  const handleDeleteSnapshot = useCallback((snapshotId: string) => {
    setScenarioSnapshots((prev) => prev.filter((item) => item.id !== snapshotId));
  }, [setScenarioSnapshots]);

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
    isPaid,
    setIsPaid,
  };
}

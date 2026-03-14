import { useState, useEffect, useCallback } from "react";
import type { AllInputs, ScenarioSnapshot } from "../types/decisionCenter";

const SUBMITTED_INPUTS_STORAGE_KEY = "novaris_decision_center_submitted_v1";
const SNAPSHOTS_STORAGE_KEY = "novaris_decision_center_snapshots_v1";

export function useDecisionPersistence(initialInputs: AllInputs) {
  const [inputs, setInputs] = useState<AllInputs>(initialInputs);
  const [submittedInputs, setSubmittedInputs] = useState<AllInputs | null>(null);
  const [scenarioSnapshots, setScenarioSnapshots] = useState<ScenarioSnapshot[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedInputs = window.localStorage.getItem(SUBMITTED_INPUTS_STORAGE_KEY);
    if (storedInputs) {
      try {
        const parsed = JSON.parse(storedInputs) as AllInputs;
        setInputs(parsed);
        setSubmittedInputs(parsed);
      } catch (error) {
        console.error("Failed to restore Decision Center inputs", error);
        window.localStorage.removeItem(SUBMITTED_INPUTS_STORAGE_KEY);
      }
    }

    const storedSnapshots = window.localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
    if (storedSnapshots) {
      try {
        const parsed = JSON.parse(storedSnapshots) as ScenarioSnapshot[];
        setScenarioSnapshots(parsed);
      } catch (error) {
        console.error("Failed to restore Decision Center snapshots", error);
        window.localStorage.removeItem(SNAPSHOTS_STORAGE_KEY);
      }
    }
  }, []);

  // Sync Snapshots to LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(scenarioSnapshots));
  }, [scenarioSnapshots]);

  const persistSubmittedInputs = useCallback((newInputs: AllInputs) => {
    setSubmittedInputs(newInputs);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SUBMITTED_INPUTS_STORAGE_KEY, JSON.stringify(newInputs));
    }
  }, []);

  const clearPersistence = useCallback(() => {
    setSubmittedInputs(null);
    setScenarioSnapshots([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SUBMITTED_INPUTS_STORAGE_KEY);
      window.localStorage.removeItem(SNAPSHOTS_STORAGE_KEY);
    }
  }, []);

  return {
    inputs,
    setInputs,
    submittedInputs,
    setSubmittedInputs,
    persistSubmittedInputs,
    scenarioSnapshots,
    setScenarioSnapshots,
    clearPersistence,
  };
}

import { ReactNode } from "react";
import type { FinancialOutput, FinancialInput } from "../../lib/engine/types";

export interface StabilitySceneProps {
  data: FinancialOutput | undefined;
  survivalColor: string;
  riskScore: number;
  headline: string | null;
  language?: "en" | "id";
}

export interface DecisionStorySceneProps {
  data: FinancialOutput;
  language?: "en" | "id";
}

export interface FanChartSceneProps {
  data: FinancialOutput | undefined;
  isPending: boolean;
  emergencyBufferSize: FinancialInput["emergencyBufferSize"];
  formatCurrency: (amount: number) => string;
  language: "en" | "id";
}

export interface FinancialSidebarProps {
  form: FinancialInput;
  onFormChange: (f: FinancialInput) => void;
  isPending: boolean;
  onRun?: () => void;
}

export interface FinancialFieldProps {
  label: string;
  fieldKey: keyof FinancialInput;
  form: FinancialInput;
  onChange: (f: FinancialInput) => void;
  type?: "number" | "text" | "range";
  min?: number;
  max?: number;
  suffix?: string;
  info?: string | ReactNode;
  placeholder?: string;
}

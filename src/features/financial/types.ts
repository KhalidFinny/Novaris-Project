import { ReactNode } from "react";
import type { FinancialOutput, FinancialInput } from "../../lib/engine/types";

export type FinancialFormState = {
  [K in keyof FinancialInput]: FinancialInput[K] | "";
};

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
  form: FinancialFormState;
  onFormChange: (f: FinancialFormState) => void;
  isPending: boolean;
  onRun?: () => void;
  invalidFieldKeys?: Set<keyof FinancialInput>;
}

export interface FinancialFieldProps {
  label: string;
  fieldKey: keyof FinancialInput;
  form: FinancialFormState;
  onChange: (f: FinancialFormState) => void;
  type?: "number" | "text" | "range";
  min?: number;
  max?: number;
  suffix?: string;
  info?: string | ReactNode;
  placeholder?: string;
  invalid?: boolean;
  errorText?: string;
}

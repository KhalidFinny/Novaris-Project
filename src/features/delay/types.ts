import { ReactNode } from "react";
import type { DelayOutput, DelayInput } from "../../lib/engine/types";

export type DelayFormState = {
  [K in keyof DelayInput]: DelayInput[K] | "";
};

export interface PhaseChartSceneProps {
  data: DelayOutput | undefined;
  isPending: boolean;
  language?: "en" | "id";
}

export interface BottlenecksSceneProps {
  data: DelayOutput;
  language?: "en" | "id";
}

export interface DelayProbabilitySceneProps {
  data: DelayOutput | undefined;
  isPending: boolean;
  probColor: string;
  headline: string | null;
  targetDurationDays: DelayInput["targetDurationDays"];
  language?: "en" | "id";
}

export interface DelaySidebarProps {
  form: DelayFormState;
  onFormChange: (f: DelayFormState) => void;
  isPending: boolean;
  onRun?: () => void;
  invalidFieldKeys?: Set<keyof DelayInput>;
}

export interface DelayFieldProps {
  label: string;
  fieldKey: keyof DelayInput;
  form: DelayFormState;
  onChange: (f: DelayFormState) => void;
  type?: "number" | "text" | "range";
  min?: number;
  max?: number;
  suffix?: string;
  info?: string | ReactNode;
  placeholder?: string;
  invalid?: boolean;
  errorText?: string;
}

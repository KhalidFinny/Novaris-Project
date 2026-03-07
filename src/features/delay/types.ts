import { ReactNode } from "react";
import type { DelayOutput, DelayInput } from "../../lib/engine/types";

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
  form: DelayInput;
  onFormChange: (f: DelayInput) => void;
  isPending: boolean;
  onRun?: () => void;
}

export interface DelayFieldProps {
  label: string;
  fieldKey: keyof DelayInput;
  form: DelayInput;
  onChange: (f: DelayInput) => void;
  type?: "number" | "text" | "range";
  min?: number;
  max?: number;
  suffix?: string;
  info?: string | ReactNode;
  placeholder?: string;
}

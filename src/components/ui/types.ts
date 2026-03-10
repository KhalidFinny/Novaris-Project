import { HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

// Card
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "article" | "section" | "aside";
}

// Button
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
}

// Input
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: "text" | "number" | "range";
  suffix?: string;
  info?: string | ReactNode;
  invalid?: boolean;
  errorText?: string;
}

// Badge
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "ok" | "warn" | "danger";
  dot?: boolean;
}

// Gauge (Keeping for compatibility if used elsewhere)
export interface GaugeProps {
  score: number;
  size?: number;
}

// Slider
export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  hint?: string;
  glow?: boolean;
}

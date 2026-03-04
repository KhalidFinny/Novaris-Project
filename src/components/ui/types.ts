import { HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

// Card
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

// Button
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

// Input
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

// Badge
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'safe' | 'caution' | 'risk' | 'neutral';
    children: React.ReactNode;
}

// Gauge
export interface GaugeProps {
    score: number;
    size?: number;
}

// Slider
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    hint?: string;
}

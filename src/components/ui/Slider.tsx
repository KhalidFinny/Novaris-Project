import React from 'react';
import { cn } from '../../lib/utils/classNames';
import { SliderProps } from './types';

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, label, hint, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-200">
                            {label}
                        </label>
                        {props.value !== undefined && (
                            <span className="text-sm font-mono text-brand-primary">
                                {props.value}
                            </span>
                        )}
                    </div>
                )}
                <input
                    type="range"
                    className={cn(
                        "w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-primary",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {hint && (
                    <p className="mt-1 text-xs text-gray-400">{hint}</p>
                )}
            </div>
        );
    }
);

Slider.displayName = "Slider";

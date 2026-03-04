import React from 'react';
import { cn } from '../../lib/utils/classNames';
import { InputProps } from './types';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = "text", label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-300 mb-1.5 cursor-pointer">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-gray-700 bg-brand-bg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:border-brand-primary placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                        error && "border-brand-risk focus:ring-brand-risk",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-xs text-brand-risk">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

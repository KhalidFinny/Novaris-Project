import React from 'react';
import { cn } from '../../lib/utils/classNames';
import { BadgeProps } from './types';

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'neutral', children, ...props }, ref) => {
        const variants = {
            safe: "bg-brand-safe/20 text-brand-safe border-brand-safe/30",
            caution: "bg-brand-caution/20 text-brand-caution border-brand-caution/30",
            risk: "bg-brand-risk/20 text-brand-risk border-brand-risk/30",
            neutral: "bg-gray-800 text-gray-300 border-gray-700",
        };

        return (
            <span
                ref={ref}
                className={cn(
                    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = "Badge";

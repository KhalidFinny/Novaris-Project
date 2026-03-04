import React from 'react';
import { cn } from '../../lib/utils/classNames';
import { ButtonProps } from './types';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50";

        const variants = {
            primary: "bg-brand-primary text-white hover:bg-brand-primary/90 shadow",
            secondary: "bg-brand-surface text-white border border-gray-700 hover:bg-gray-800",
            outline: "border border-brand-primary text-brand-primary hover:bg-brand-primary/10",
            ghost: "hover:bg-brand-surface hover:text-white text-gray-300",
            danger: "bg-brand-risk text-white hover:bg-brand-risk/90 shadow",
        };

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-8 text-base",
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyle, variants[variant], sizes[size], className)}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

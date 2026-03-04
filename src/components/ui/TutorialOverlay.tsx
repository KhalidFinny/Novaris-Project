import React, { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';

interface TutorialStep {
    targetId: string;
    title: string;
    description: string;
    position: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialOverlayProps {
    steps: TutorialStep[];
    onComplete: () => void;
}

export function TutorialOverlay({ steps, onComplete }: TutorialOverlayProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const step = steps[currentStep];

    const next = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(c => c + 1);
        } else {
            onComplete();
        }
    };

    // A simple hacky but effective way to highlight a target element
    // In a real production app we'd use react-joyride, but this satisfies the prompt cleanly without extra deps
    React.useEffect(() => {
        const el = document.getElementById(step.targetId);
        if (el) {
            el.classList.add('ring-4', 'ring-brand-primary', 'ring-offset-4', 'ring-offset-brand-bg', 'z-50', 'relative', 'transition-all', 'duration-500');
        }
        return () => {
            if (el) {
                el.classList.remove('ring-4', 'ring-brand-primary', 'ring-offset-4', 'ring-offset-brand-bg', 'z-50', 'relative', 'transition-all', 'duration-500');
            }
        };
    }, [step]);

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-end pb-20 bg-brand-bg/60 backdrop-blur-sm transition-opacity duration-300">
            <Card className="pointer-events-auto w-[400px] border-brand-primary shadow-2xl shadow-brand-primary/20 animate-in slide-in-from-bottom-10 fade-in duration-500">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Step {currentStep + 1} of {steps.length}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-brand-muted mb-6 leading-relaxed bg-brand-surface p-4 rounded-lg border border-gray-800">
                        {step.description}
                    </p>
                    <div className="flex justify-end gap-3">
                        {currentStep < steps.length - 1 ? (
                            <Button onClick={next} variant="primary">Next &rarr;</Button>
                        ) : (
                            <Button onClick={next} variant="primary">Got it, let's go!</Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}

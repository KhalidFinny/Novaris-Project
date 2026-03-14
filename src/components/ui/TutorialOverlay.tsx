import React, { useState, useEffect } from "react";
import { useLocale } from "../../hooks/useLocale";

interface TutorialStep {
  targetId: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  storageKey: string; // unique key per module so each tutorial only shows once
  onComplete: () => void;
}

/**
 * TutorialOverlay — shows once per storageKey using localStorage.
 * Switching between pages and coming back will NOT re-trigger the tutorial.
 * The user can manually replay via "How to use" button (pass forceShow prop).
 */
export function TutorialOverlay({
  steps,
  storageKey,
  onComplete,
}: TutorialOverlayProps) {
  const { t } = useLocale();
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(storageKey);
    if (!seen) {
      // Small delay so the page has time to mount
      const t = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(t);
    } else {
      // Already seen — immediately call onComplete so parent knows
      onComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Highlight the target element for the current step
  useEffect(() => {
    if (!visible) return;
    const step = steps[currentStep];
    const el = document.getElementById(step.targetId);
    if (el) {
      el.classList.add(
        "ring-2",
        "ring-brand-accent",
        "ring-offset-2",
        "ring-offset-brand-bg",
        "z-50",
        "relative",
        "transition-all",
        "duration-500",
      );
    }
    return () => {
      if (el) {
        el.classList.remove(
          "ring-2",
          "ring-brand-accent",
          "ring-offset-2",
          "ring-offset-brand-bg",
          "z-50",
          "relative",
          "transition-all",
          "duration-500",
        );
      }
    };
  }, [currentStep, visible, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((c) => c + 1);
    } else {
      localStorage.setItem(storageKey, "true");
      setVisible(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, "true");
    setVisible(false);
    onComplete();
  };

  if (!visible) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-end pb-12 bg-ink/20 dark:bg-void/40 backdrop-blur-md transition-opacity duration-500">
      {/* Tutorial card */}
      <div
        className="pointer-events-auto w-[420px] bg-white dark:bg-white/4 border border-ink/10 dark:border-white/8 rounded-3xl shadow-2xl backdrop-blur-xl mb-4"
        style={{ animation: "slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        {/* Progress bar */}
        <div className="h-[2px] bg-white/10 rounded-t-card overflow-hidden">
          <div
            className="h-full bg-brand-accent transition-all duration-500 ease-novaris"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-scarlet dark:text-scarlet-bright font-bold flex items-center gap-2">
              {step.icon} {`0${currentStep + 1}`} / {`0${steps.length}`}
            </p>
            <button
              onClick={handleSkip}
              className="font-mono text-[9px] tracking-widest uppercase text-ink/40 dark:text-frost/40 hover:text-ink dark:hover:text-frost transition-colors cursor-pointer"
            >
              {t("tutorial.skip")}
            </button>
          </div>

          {/* Content */}
          <h3 className="font-fraunces text-2xl font-light text-ink dark:text-frost mb-3 leading-snug">
            {step.title}
          </h3>
          <p className="font-sans text-sm text-ink/60 dark:text-frost/60 leading-relaxed mb-8">
            {step.description}
          </p>

          {/* Dots + Next */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    borderRadius: "9999px",
                    transition: "all 0.3s ease",
                    width: i === currentStep ? "1.25rem" : "0.375rem",
                    height: "0.375rem",
                    background:
                      i <= currentStep
                        ? "var(--color-brand-accent)"
                        : "var(--color-ink)",
                    opacity: i < currentStep ? 0.4 : 1,
                  }}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-full bg-scarlet dark:bg-scarlet-bright text-white font-sans text-xs font-medium hover:-translate-y-0.5 transition-all shadow-sm cursor-pointer"
            >
              {currentStep < steps.length - 1
                ? `${t("tutorial.next")} →`
                : `${t("tutorial.start")} →`}
            </button>
          </div>
        </div>
      </div>

      <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
}

import React from "react";
import { useLocale } from "../../hooks/useLocale";

interface SimLayoutProps {
  controls: React.ReactNode;
  impactBar?: React.ReactNode;
  children: React.ReactNode;
  controlsCollapsible?: boolean;
  controlsDefaultOpen?: boolean;
}

export function SimLayout({
  controls,
  impactBar,
  children,
  controlsCollapsible = false,
  controlsDefaultOpen = true,
}: SimLayoutProps) {
  const { t } = useLocale();
  const [controlsOpen, setControlsOpen] = React.useState(controlsDefaultOpen);

  return (
    <div className="min-h-[calc(100vh-72px)] mt-[72px] bg-arctic dark:bg-void transition-colors duration-[520ms] ease-[cubic-bezier(.22,1,.36,1)]">
      <section className="px-8 sm:px-12 pt-8 pb-4 border-b border-ink/[.09] dark:border-frost/[.08] bg-arctic-soft/55 dark:bg-void-soft/55 backdrop-blur-md">
        <div className="max-w-[1500px] mx-auto">
          <div className="flex items-center justify-between gap-4 mb-4">
            <p className="font-sans text-[14px] font-medium text-scarlet dark:text-scarlet-bright">
              {t("sim.controls")}
            </p>
            {controlsCollapsible && (
              <button
                type="button"
                onClick={() => setControlsOpen((open) => !open)}
                className="px-3.5 py-1.5 rounded-full border border-ink/15 dark:border-frost/15 text-[12px] font-sans text-ink/70 dark:text-frost/70 hover:text-ink dark:hover:text-frost"
              >
                {controlsOpen ? t("sim.controls.hide") : t("sim.controls.show")}
              </button>
            )}
          </div>
          {(controlsOpen || !controlsCollapsible) && controls}
        </div>
      </section>

      {impactBar && (
        <section className="sticky top-[72px] z-[120] px-8 sm:px-12 py-4 border-b border-ink/[.09] dark:border-frost/[.08] bg-arctic/[.93] dark:bg-void/[.93] backdrop-blur-xl">
          <div className="max-w-[1500px] mx-auto">{impactBar}</div>
        </section>
      )}

      <section className="overflow-auto relative flex flex-col">{children}</section>
    </div>
  );
}

import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { useLocale } from "../../hooks/useLocale";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useLocale();

  return (
    <button
      onClick={toggle}
      aria-label={t("nav.toggleTheme")}
      className="w-9.5 h-5.5 rounded-full relative cursor-pointer
                         bg-ink/4 dark:bg-frost/4
                         border border-ink/16 dark:border-frost/15
                         transition-colors duration-520 ease-spring"
    >
      <div
        className={`absolute top-0.75 left-0.75 w-3 h-3 rounded-full
                                    bg-scarlet dark:bg-scarlet-bright
                                    transition-transform duration-300 ease-spring-bounce
                                    ${theme === "dark" ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}

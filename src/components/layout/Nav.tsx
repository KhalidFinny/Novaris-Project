import React, { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import logoUrl from "../../assets/logo/logo1.png";
import { useLocale } from "../../hooks/useLocale";

export function Nav() {
  const { theme, toggle } = useTheme();
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
    usdToIdrRate,
  } = useLocale();
  const location = useLocation();
  const isOnLanding = location.pathname === "/";
  const isOnFinancial = location.pathname === "/financial";
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      nav.dataset.scrolled = window.scrollY > 30 ? "true" : "false";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      id="nav"
      ref={navRef}
      data-scrolled="false"
      className="fixed top-0 left-0 right-0 z-[200]
                       flex items-center justify-between
                       px-[52px] py-[18px]
                       transition-all duration-[520ms] ease-[cubic-bezier(.22,1,.36,1)]
                       max-md:px-6
                       data-[scrolled=true]:bg-arctic/[.88] dark:data-[scrolled=true]:bg-void/[.88]
                       data-[scrolled=true]:backdrop-blur-[20px]"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center no-underline">
        <img
          src={logoUrl}
          alt={t("nav.logoAlt")}
          className="h-7 w-auto object-contain dark:invert transition-all duration-[520ms]"
        />
      </Link>

      {/* Center nav links (landing only) */}
      {isOnLanding && (
        <ul className="hidden md:flex gap-7 list-none m-0 p-0 absolute left-1/2 -translate-x-1/2">
          {(["Platform", "Solutions", "Pricing", "About"] as const).map(
            (label) => (
              <li key={label}>
                <a
                  href={`#${label.toLowerCase()}`}
                  className="font-[family-name:var(--font-family-sans)] text-[13px] font-normal
                                           text-ink/50 dark:text-frost/50
                                           hover:text-ink dark:hover:text-frost
                                           transition-colors duration-200 no-underline
                                           cursor-pointer"
                >
                  {t(`nav.${label.toLowerCase()}`)}
                </a>
              </li>
            ),
          )}
        </ul>
      )}

      {/* Right: toggle + CTA */}
      <div className="flex items-center gap-[14px]">
        <div className="hidden lg:flex items-center gap-2">
          <label className="font-sans text-[12px] text-ink/45 dark:text-frost/45">
            {t("nav.language")}
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "id")}
            className="h-8 px-2.5 rounded-[8px] border border-ink/14 dark:border-frost/14 bg-arctic-soft dark:bg-void-soft text-ink/75 dark:text-frost/75 font-sans text-[13px] outline-none"
            aria-label={t("nav.language")}
          >
            <option value="en">{t("lang.en")}</option>
            <option value="id">{t("lang.id")}</option>
          </select>

          {isOnFinancial && (
            <>
              <label className="font-sans text-[12px] text-ink/45 dark:text-frost/45 ml-2">
                {t("nav.currency")}
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as "USD" | "IDR")}
                className="h-8 px-2.5 rounded-[8px] border border-ink/14 dark:border-frost/14 bg-arctic-soft dark:bg-void-soft text-ink/75 dark:text-frost/75 font-sans text-[13px] outline-none"
                aria-label={t("nav.currency")}
              >
                <option value="USD">{t("currency.usd")}</option>
                <option value="IDR">{t("currency.idr")}</option>
              </select>
              <span className="font-sans text-[12px] text-ink/45 dark:text-frost/45">
                {t("nav.fx")} {Math.round(usdToIdrRate).toLocaleString("en-US")} IDR
              </span>
            </>
          )}
        </div>

        {/* Theme toggle */}
        <button
          id="tog"
          onClick={toggle}
          aria-label={t("nav.toggleTheme")}
          className="w-[38px] h-[22px] rounded-full relative cursor-pointer
                               bg-ink/[.04] dark:bg-frost/[.04]
                               border border-ink/[.16] dark:border-frost/[.15]
                               transition-colors duration-[520ms] ease-[cubic-bezier(.22,1,.36,1)]"
        >
          <div
            className={`absolute top-[3px] left-[3px] w-3 h-3 rounded-full
                                    bg-scarlet dark:bg-scarlet-bright
                                    transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]
                                    ${theme === "dark" ? "translate-x-4" : "translate-x-0"}`}
          />
        </button>

        {/* CTA buttons */}
        <div className="flex items-center gap-2">
          <Link
            to="/financial"
            className="font-sans font-semibold text-[12.5px]
                               px-4 py-2 rounded-[6px]
                               bg-scarlet dark:bg-scarlet-bright text-white
                               hover:bg-scarlet-dark dark:hover:bg-scarlet-hover
                               hover:-translate-y-px
                               transition-all duration-200 ease-spring
                               cursor-pointer no-underline text-center"
          >
            {t("nav.financial")}
          </Link>
          <Link
            to="/delay"
            className="font-sans font-semibold text-[12.5px]
                               px-4 py-2 rounded-[6px] border border-ink/20 dark:border-frost/20
                               text-ink/70 dark:text-frost/70
                               hover:border-ink dark:hover:border-frost hover:text-ink dark:hover:text-frost
                               hover:-translate-y-px
                               transition-all duration-200 ease-[cubic-bezier(.22,1,.36,1)]
                               cursor-pointer no-underline text-center"
          >
            {t("nav.delay")}
          </Link>
        </div>
      </div>
    </nav>
  );
}

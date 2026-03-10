import React, { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import logoUrl from "../../assets/logo/logo1.png";
import { useLocale } from "../../hooks/useLocale";
import { Sun, Moon } from "lucide-react";

export function Nav() {
  const { theme, toggle } = useTheme();
  const { language, setLanguage, t } = useLocale();
  const location = useLocation();
  const isOnLanding = location.pathname === "/";
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
      className="fixed top-0 left-0 right-0 z-200
                       flex items-center justify-between
                       px-6 lg:px-12 py-4
                       data-[scrolled=true]:backdrop-blur-[20px]"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center no-underline">
        <img
          src={logoUrl}
          alt={t("nav.logoAlt")}
          className="h-6 w-auto object-contain dark:invert transition-all duration-[520ms]"
        />
      </Link>

      {/* Center nav links - Only Home and Decision Center */}
      <ul className="hidden md:flex gap-8 list-none m-0 p-0 absolute left-1/2 -translate-x-1/2">
        <li>
          <Link
            to="/"
            className={`font-sans text-[14px] font-medium
                                 transition-colors duration-200 no-underline
                                 cursor-pointer
                                 ${
                                   isOnLanding
                                     ? "text-ink dark:text-frost"
                                     : "text-ink/60 dark:text-frost/60 hover:text-ink dark:hover:text-frost"
                                 }`}
          >
            {t("nav.home")}
          </Link>
        </li>
        <li>
          <Link
            to="/decision-center"
            className={`font-sans text-[14px] font-medium
                                 transition-colors duration-200 no-underline
                                 cursor-pointer
                                 ${
                                   !isOnLanding
                                     ? "text-ink dark:text-frost"
                                     : "text-ink/60 dark:text-frost/60 hover:text-ink dark:hover:text-frost"
                                 }`}
          >
            {t("nav.decisionCenter")}
          </Link>
        </li>
      </ul>

      {/* Right: Language toggle + Theme toggle */}
      <div className="flex items-center gap-3">
        {/* Language Toggle - Text buttons */}
        <div className="flex items-center gap-1 font-sans text-[13px]">
          <button
            onClick={() => setLanguage("en")}
            className={`px-2 py-1 rounded transition-colors duration-200 ${
              language === "en"
                ? "text-ink dark:text-frost font-semibold"
                : "text-ink/40 dark:text-frost/40 hover:text-ink/70 dark:hover:text-frost/70"
            }`}
          >
            EN
          </button>
          <span className="text-ink/20 dark:text-frost/20">|</span>
          <button
            onClick={() => setLanguage("id")}
            className={`px-2 py-1 rounded transition-colors duration-200 ${
              language === "id"
                ? "text-ink dark:text-frost font-semibold"
                : "text-ink/40 dark:text-frost/40 hover:text-ink/70 dark:hover:text-frost/70"
            }`}
          >
            ID
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-ink/10 dark:bg-frost/10" />

        {/* Theme Toggle - Clean icon button */}
        <button
          onClick={toggle}
          aria-label={theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
          className="w-9 h-9 rounded-full flex items-center justify-center
                             bg-cream dark:bg-charcoal-soft
                             border border-ink/10 dark:border-frost/10
                             text-ink/70 dark:text-frost/70
                             hover:bg-cream-dark dark:hover:bg-charcoal-light
                             hover:text-ink dark:hover:text-frost
                             transition-all duration-200"
        >
          {theme === "dark" ? (
            <Sun size={16} strokeWidth={1.5} />
          ) : (
            <Moon size={16} strokeWidth={1.5} />
          )}
        </button>
      </div>
    </nav>
  );
}

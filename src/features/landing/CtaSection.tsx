import React from "react";
import { Link } from "react-router-dom";
import { DAY_ONE_FEATURES, DAY_ONE_FEATURES_ID } from "./data";
import { useLocale } from "../../hooks/useLocale";
import logoUrl from "../../assets/logo/logo1.png";

export function CtaSection() {
  const { language } = useLocale();
  const isId = language === "id";
  const dayOneFeatures = isId ? DAY_ONE_FEATURES_ID : DAY_ONE_FEATURES;

  return (
    <>
      {/* ── CONTACT / CTA ── */}
      <section className="px-13 py-25 relative overflow-hidden max-sm:px-6 bg-scarlet dark:bg-charcoal-light transition-colors duration-520">
        {/* Metallic shimmer top line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
             background:
               "linear-gradient(to right, transparent 5%, rgba(243,239,230,.12) 25%, rgba(243,239,230,.22) 50%, rgba(243,239,230,.12) 75%, transparent 95%)",
          }}
          aria-hidden="true"
        />

        {/* Ghost NOVARIS text */}
        <div
          className="absolute -right-2 -bottom-10 pointer-events-none select-none
                     font-fraunces font-bold leading-none
                     tracking-tighter whitespace-nowrap"
          style={{
            fontSize: "clamp(90px, 13vw, 200px)",
             color: "rgba(243,239,230,0.05)",
          }}
          aria-hidden="true"
        >
          NOVARIS
        </div>

        <div className="max-w-content mx-auto relative z-2">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">
            {/* Left */}
            <div>
              <div className="font-sans text-[13px] tracking-[0.14em] uppercase mb-4.5 text-white/62 dark:text-frost/60">
                {isId
                  ? "Capaian Strategis Anda"
                  : "Your Strategic Edge"}
              </div>
              <h2
                className="font-fraunces font-semibold
                         leading-none tracking-tight text-white mb-6
                         transition-colors duration-520"
                style={{ fontSize: "clamp(40px, 5vw, 76px)" }}
              >
                {isId
                  ? "Analisis siap eksekusi."
                  : "Insights ready to execute."}
              </h2>
              <p className="font-sans font-light text-[21px] text-white/84 dark:text-frost/84 leading-relaxed max-w-[38ch] mb-10">
                {isId
                  ? "Buka kekuatan penuh intelegensi risiko finansial dan operasional. Eksplorasi dashboard interaktif kami sekarang secara gratis."
                  : "Unlock the full power of financial and operational risk intelligence. Explore our interactive dashboard now for free during beta."}
              </p>
              <div className="flex gap-3 items-center flex-wrap">
                {/* White primary */}
                <Link
                  to="/decision-center"
                  className="inline-flex font-sans font-bold text-[13px] uppercase tracking-[0.14em]
                             px-6.5 py-3.5 rounded-card bg-frost text-charcoal no-underline
                             hover:opacity-90 hover:-translate-y-0.5
                             transition-all duration-200 ease-spring border-0 cursor-pointer"
                >
                  {isId ? "Eksplorasi Engine" : "Explore the Engine"}
                </Link>
              </div>
            </div>

            {/* Right: feature checklist aside */}
            <div className="min-w-50 rounded-card p-6 border border-white/12 bg-white/8 dark:border-frost/10 dark:bg-charcoal-soft/78 backdrop-blur-xs">
              <div className="font-sans text-[13px] tracking-[0.14em] uppercase mb-4 text-white/60 dark:text-frost/60">
                {isId
                  ? "Fitur Inti Intelegensi"
                  : "Core Intelligence Features"}
              </div>
              {dayOneFeatures.map((f, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 font-sans text-[16px]
                              py-1.75 ${i < dayOneFeatures.length - 1 ? "border-b" : ""} ${
                                f.included
                                  ? "border-white/10 text-white/84 dark:border-frost/10 dark:text-frost/84"
                                  : "border-white/10 text-white/44 dark:border-frost/10 dark:text-frost/44"
                              }`}
                >
                  <div
                    className="w-1.25 h-1.25 rounded-full shrink-0"
                    style={{ background: f.included ? "var(--color-steel-bright)" : "rgba(243,239,230,0.22)" }}
                  />
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
       <footer
         className="px-13 py-7
                    border-t border-ink/9 dark:border-frost/10
                    bg-bone dark:bg-charcoal
                    flex items-center justify-between flex-wrap gap-3
                    transition-colors duration-520 ease-spring
                    max-sm:px-6"
      >
        <img
          src={logoUrl}
          alt="Novaris"
          width="112"
          height="24"
          className="h-6 w-auto object-contain opacity-70"
        />
        <span className="font-mono text-[12px] tracking-[0.08em] text-ink/44 dark:text-frost/56">
          {isId
            ? "© 2025 Novaris Inc. — Hak cipta dilindungi."
            : "© 2025 Novaris Inc. — All rights reserved."}
        </span>
        <div className="flex gap-5">
          {(isId
            ? ["Privasi", "Ketentuan", "Kontak"]
            : ["Privacy", "Terms", "Contact"]
          ).map((label) => (
            <a
              key={label}
              href="#"
               className="font-sans text-[15px] text-ink/48 dark:text-frost/58
                          hover:text-ink dark:hover:text-frost no-underline transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}

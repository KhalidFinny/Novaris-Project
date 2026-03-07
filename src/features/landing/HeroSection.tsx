import React from "react";
import { Link } from "react-router-dom";
import { Nav } from "../../components/layout/Nav";
import { ProblemSection } from "./ProblemSection";
import { SolutionSection } from "./SolutionSection";
import { QuoteSection } from "./QuoteSection";
import { BenefitsSection } from "./BenefitsSection";
import { PricingSection } from "./PricingSection";
import { CtaSection } from "./CtaSection";
import { useLocale } from "../../hooks/useLocale";

export function HeroSection() {
  const { language } = useLocale();
  const isId = language === "id";

  return (
    <div
      className="relative"
      style={{
        background:
          "linear-gradient(180deg, rgba(244,247,251,1) 0%, rgba(241,245,250,1) 34%, rgba(238,243,249,1) 68%, rgba(236,241,248,1) 100%)",
      }}
    >
      <Nav />
      {/* ── HERO ── */}
      <section
        className="flex flex-col items-center justify-start text-center
                   px-[5%] pt-12 pb-24 bg-transparent dark:bg-transparent relative overflow-hidden
                   transition-colors duration-520 ease-spring"
      >
        {/* Ambient orbs */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(204,31,46,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 35% at 80% 80%, rgba(45,95,138,0.07) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        <h1
          className="max-w-500 mt-32 mx-auto mb-8 flex flex-col items-center"
          style={{
            animation: "fadeUp .8s var(--ease-spring) 200ms both",
          }}
        >
          <div className="flex flex-wrap justify-center items-baseline gap-[1ch]">
            <span
              className="block font-fraunces font-normal
                         text-ink dark:text-frost transition-colors duration-520 ease-spring"
              style={{
                fontSize: "clamp(52px, 8vw, 114px)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              {isId ? "Kenali" : "Know the"}
            </span>
            <span
              className="block font-fraunces font-bold
                         text-scarlet dark:text-scarlet-bright transition-colors duration-520 ease-spring"
              style={{
                fontSize: "clamp(52px, 8vw, 114px)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              {isId ? "risikonya." : "risk."}
            </span>
          </div>
          <span
            className="block font-fraunces font-normal
                       text-ink dark:text-frost transition-colors duration-520 ease-spring"
            style={{
              fontSize: "clamp(52px, 8vw, 114px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            {isId ? "Eksekusi dengan Yakin." : "Execute Confidently."}
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="max-w-[50ch] mx-auto mb-10
                     font-sans font-normal text-2xl leading-[1.6]
                     text-ink/60 dark:text-frost/60 text-center
                     transition-colors duration-520 ease-spring"
          style={{
            animation: "fadeUp .6s var(--ease-spring) 300ms both",
          }}
        >
          {isId
            ? "Novaris memberi owner bisnis pandangan risiko yang live dan terstruktur agar keputusan dibuat dengan yakin, bukan menebak."
            : "Novaris gives business owners a live, structured view of every risk that matters so decisions land with conviction, not guesswork."}
        </p>

        {/* CTA buttons */}
        <div
          className="flex gap-3 items-center justify-center mb-18"
          style={{
            animation: "fadeUp .6s var(--ease-spring) 380ms both",
          }}
        >
          <Link
            to="/financial"
            className="font-sans font-semibold text-[11.5px] uppercase tracking-wider
                       px-7 py-3 rounded-card text-center no-underline
                       bg-scarlet dark:bg-scarlet-bright text-white
                       hover:bg-scarlet-dark dark:hover:bg-scarlet-hover
                       hover:-translate-y-0.5
                       transition-all duration-200 ease-spring border-0 cursor-pointer"
          >
            {isId ? "Stress Test Finansial" : "Financial Stress Test"}
          </Link>
          <Link
            to="/delay"
            className="font-sans font-semibold text-[11.5px] uppercase tracking-wider
                       px-7 py-3 rounded-card border border-scarlet-dark text-black dark:text-frost/50 text-center
                       hover:-translate-y-0.5 no-underline
                       transition-all duration-200 ease-spring cursor-pointer"
          >
            {isId ? "Simulasi Delay" : "Delay Simulation"}
          </Link>
        </div>

        {/* Stat strip */}
        <div
          className="flex items-stretch w-full max-w-stat-strip mx-auto
                     border-t border-b border-ink/9 dark:border-frost/8
                     transition-colors duration-520 ease-spring
                     max-sm:flex-col"
          style={{
            animation: "fadeUp .6s var(--ease-spring) 480ms both",
          }}
        >
          {[
            {
              stat: "50%",
              label: isId
                ? "bisnis gagal sebelum tahun kelima"
                : "of businesses fail by year five",
              src: isId
                ? "Biro Statistik Tenaga Kerja AS"
                : "US Bureau of Labor Statistics",
            },
            {
              stat: "73%",
              label: isId
                ? "menyebut ketidakpastian ekonomi sebagai risiko utama"
                : "cite economic uncertainty as #1 risk",
              src: "Gitnux Report 2024",
            },
            {
              stat: "11%",
              label: isId
                ? "mengelola risiko secara strategis"
                : "use risk management strategically",
              src: "PwC Pulse Survey 2024",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex-1 py-5.5 flex flex-col items-center gap-1
                         ${i < 2 ? "border-r border-ink/9 dark:border-frost/8 max-sm:border-r-0 max-sm:border-b max-sm:border-ink/9" : ""}`}
            >
              <div
                className="font-sans font-semibold text-[32px] leading-none tracking-[-0.02em]
                           text-scarlet dark:text-scarlet-bright transition-colors duration-520"
              >
                {item.stat}
              </div>
              <div className="font-sans text-[11.5px] text-ink/50 dark:text-frost/50 text-center max-w-32.5 leading-[1.3]">
                {item.label}
              </div>
              <div className="font-mono text-[9px] tracking-[.06em] text-ink/30 dark:text-frost/28">
                {item.src}
              </div>
            </div>
          ))}
        </div>
      </section>
      <ProblemSection />
      <SolutionSection />
      <QuoteSection />
      <BenefitsSection />
      <PricingSection />
      <CtaSection />
    </div>
  );
}

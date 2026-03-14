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
import { AnimatedOnScroll } from "../../components/decision-center/AnimatedSection";

export function HeroSection() {
  const { language } = useLocale();
  const isId = language === "id";

  return (
    <div className="relative bg-bone dark:bg-charcoal transition-colors duration-520">
      <Nav />
      <section
        className="flex flex-col items-center justify-start text-center
                   px-[5%] pt-12 pb-24 bg-bone dark:bg-charcoal relative overflow-hidden
                   transition-colors duration-520 ease-spring"
      >
        {/* Ambient orbs */}
        <div
          className="absolute inset-0 pointer-events-none dark:opacity-85"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(164,22,36,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 35% at 80% 80%, rgba(45,95,138,0.07) 0%, transparent 60%), radial-gradient(ellipse 36% 28% at 18% 22%, rgba(210,179,116,0.14) 0%, transparent 68%)",
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
                         text-scarlet dark:text-steel-bright transition-colors duration-520 ease-spring"
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

         <p
           className="max-w-[50ch] mx-auto mb-10
                      font-sans font-normal text-[clamp(21px,2.4vw,28px)] leading-[1.68]
                     text-ink/68 dark:text-frost/76 text-center
                     transition-colors duration-520 ease-spring"
          style={{
            animation: "fadeUp .6s var(--ease-spring) 300ms both",
          }}
        >
          {isId
            ? "Novaris memberi owner bisnis pandangan risiko yang live dan terstruktur agar keputusan dibuat dengan yakin, bukan menebak."
            : "Novaris gives business owners a live, structured view of every risk that matters so decisions land with conviction, not guesswork."}
        </p>

        <div
          className="flex gap-3 items-center justify-center mb-18"
          style={{
            animation: "fadeUp .6s var(--ease-spring) 380ms both",
          }}
        >
          <Link
            to="/decision-center"
            className="font-sans font-semibold text-[13px] uppercase tracking-[0.14em]
                       px-7 py-3.5 rounded-card text-center no-underline
                       bg-scarlet dark:bg-steel-bright text-white dark:text-void
                       hover:bg-scarlet-dark dark:hover:bg-[#a8cbd4]
                       hover:-translate-y-0.5
                       transition-all duration-200 ease-spring border-0 cursor-pointer"
          >
            {isId ? "Masuk Pusat Keputusan" : "Enter Decision Center"}
          </Link>
          <Link
            to="/how-it-works"
            className="font-sans font-semibold text-[13px] uppercase tracking-[0.14em]
                        px-7 py-3.5 rounded-card border border-scarlet-dark text-black dark:text-frost/86 text-center dark:border-steel-bright/28 dark:bg-charcoal-soft/72
                       hover:-translate-y-0.5 no-underline
                       transition-all duration-200 ease-spring cursor-pointer"
          >
            {isId ? "Lihat Cara Kerja" : "See How It Works"}
          </Link>
        </div>

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
              stat: "82%",
              label: isId
                ? "bisnis gagal karena masalah arus kas"
                : "of businesses fail due to cash flow problems",
              src: isId
                ? "Studi Bank AS via SCORE"
                : "U.S. Bank Study via SCORE",
            },
            {
              stat: "62%",
              label: isId
                ? "SMB memiliki pembayaran terlambat"
                : "of SMBs currently owed late payments",
              src: "Intuit QuickBooks, 2026",
            },
            {
              stat: "32",
              label: isId
                ? "hari adalah rata-rata keterlambatan pembayaran."
                : "days is the average payment delay.",
              src: "Coface UK, 2026",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex-1 py-5.5 flex flex-col items-center gap-1
                         ${i < 2 ? "border-r border-ink/9 dark:border-frost/8 max-sm:border-r-0 max-sm:border-b max-sm:border-ink/9" : ""}`}
            >
              <div
                className="font-sans font-semibold text-[32px] leading-none tracking-[-0.02em]
                           text-scarlet dark:text-steel-bright transition-colors duration-520"
              >
                {item.stat}
              </div>
                 <div className="font-sans text-[16px] text-ink/66 dark:text-frost/76 text-center max-w-44 leading-[1.45]">
                 {item.label}
               </div>
                <div className="font-mono text-[12px] tracking-[.06em] text-ink/46 dark:text-frost/58">
                 {item.src}
               </div>
            </div>
          ))}
        </div>
      </section>
      
      <AnimatedOnScroll>
        <ProblemSection />
      </AnimatedOnScroll>
      
      <AnimatedOnScroll>
        <SolutionSection />
      </AnimatedOnScroll>
      
      <AnimatedOnScroll>
        <QuoteSection />
      </AnimatedOnScroll>
      
      <AnimatedOnScroll>
        <BenefitsSection />
      </AnimatedOnScroll>
      
      <AnimatedOnScroll>
        <PricingSection />
      </AnimatedOnScroll>
      
      <AnimatedOnScroll>
        <CtaSection />
      </AnimatedOnScroll>
    </div>
  );
}

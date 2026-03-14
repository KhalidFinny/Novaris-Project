import React from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";

export function PricingSection() {
  const { language } = useLocale();
  const isId = language === "id";

  return (
    <section
      id="pricing"
      className="min-h-screen flex flex-col justify-center px-6 sm:px-13 py-24 bg-bone dark:bg-charcoal relative overflow-hidden transition-colors duration-520"
    >
      <div
        className="absolute -right-2.5 -bottom-6 pointer-events-none select-none font-fraunces font-bold leading-none tracking-tighter text-transparent"
        style={{
          fontSize: "clamp(80px, 12vw, 180px)",
          WebkitTextStroke: "1px rgba(8,14,28,0.09)",
        }}
        aria-hidden="true"
      >
        EXPORT
      </div>

      <div className="max-w-content mx-auto relative z-2">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center">
          <div>
            <div className="flex items-center gap-2.5 mb-4.5 font-sans text-[13px] tracking-[0.14em] uppercase text-scarlet dark:text-scarlet-bright">
              <span className="w-4 h-px bg-scarlet dark:bg-scarlet-bright shrink-0" aria-hidden="true" />
              {isId ? "Export profesional" : "Professional export"}
            </div>
            <h2
              className="font-fraunces font-semibold leading-none tracking-tight text-ink dark:text-frost mb-6 transition-colors duration-520"
              style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}
            >
              {isId ? "Laporan siap kirim" : "A report ready to send"}{" "}
              <em className="italic font-normal text-scarlet dark:text-scarlet-bright">
                {isId ? "tanpa langganan." : "without a subscription."}
              </em>
            </h2>
            <p className="font-sans font-light text-[20px] text-ink/72 dark:text-frost/78 leading-relaxed max-w-[42ch] mb-8">
              {isId
                ? "Simulasi dan analisis risiko tetap gratis di dalam aplikasi. Jelajahi semua fitur intelegensi Novaris tanpa biaya selama masa pengetesan beta kami."
                : "Risk simulations and analysis stay free inside the app. Explore all Novaris intelligence features at no cost during our beta testing phase."}
            </p>
            <div className="flex gap-2.5 items-center">
              <Link
                to="/decision-center"
                className="inline-flex font-sans font-semibold text-[13px] uppercase tracking-[0.14em] px-7 py-3.5 rounded-card bg-scarlet dark:bg-scarlet-bright text-white hover:bg-scarlet-dark hover:-translate-y-0.5 transition-all duration-200 ease-spring border-0 cursor-pointer no-underline"
              >
                {isId ? "Coba Decision Center" : "Try Decision Center"}
              </Link>
            </div>
          </div>

          <div className="rounded-[8px] border border-ink/10 dark:border-frost/10 bg-bone-soft dark:bg-charcoal-soft overflow-hidden">
            <div className="px-6 py-5 border-b border-ink/10 dark:border-frost/10 flex items-start justify-between gap-4">
              <div>
                <p className="font-fraunces text-[32px] leading-none text-ink dark:text-frost">
                  {isId ? "Coba Decision Center" : "Try Decision Center"}
                </p>
                <p className="mt-2 font-sans text-[17px] text-ink/66 dark:text-frost/74 max-w-[34ch] leading-relaxed">
                  {isId
                    ? "Akses penuh ke semua fitur Decision Center, gratis."
                    : "Full access to all Decision Center features, for free."}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              {[
                isId ? "Format cocok untuk founder, finance, dan stakeholder" : "Format suited for founders, finance teams, and stakeholders",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 py-1.5 opacity-80">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-scarlet dark:bg-scarlet-bright shrink-0" />
                  <p className="font-sans text-[17px] leading-relaxed text-ink/72 dark:text-frost/78">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="px-6 py-8 bg-ink text-white">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="font-sans text-[11px] tracking-widest uppercase text-white/50 mb-1">
                    {isId ? "Status Akses" : "Access Status"}
                  </p>
                  <p className="font-fraunces text-[32px] leading-none text-white">
                    {isId ? "Gratis Selama Beta" : "Free During Beta"}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 font-sans text-[11px] tracking-[0.14em] uppercase text-white/60">
                  {isId ? "SEGERA HADIR" : "COMING SOON"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

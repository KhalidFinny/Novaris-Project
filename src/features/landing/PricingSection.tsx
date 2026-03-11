import React from "react";
import { Link } from "react-router-dom";
import { PLANS, PLANS_ID } from "./data";
import { useLocale } from "../../hooks/useLocale";

export function PricingSection() {
  const { language } = useLocale();
  const isId = language === "id";
  const plans = isId ? PLANS_ID : PLANS;

  return (
    <section
      id="pricing"
      className="min-h-screen flex flex-col justify-center px-6 sm:px-13 py-24 bg-transparent dark:bg-transparent relative overflow-hidden transition-colors duration-520"
    >
      {/* Ghost background text */}
      <div
        className="absolute -right-2.5 -bottom-6 pointer-events-none select-none
                   font-fraunces font-bold leading-none tracking-tighter
                   text-transparent"
        style={{
          fontSize: "clamp(80px, 12vw, 180px)",
          WebkitTextStroke: "1px rgba(8,14,28,0.09)",
        }}
        aria-hidden="true"
      >
        PLANS
      </div>

      <div className="max-w-content mx-auto relative z-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: copy */}
          <div>
            <div
              className="flex items-center gap-2.5 mb-4.5
                            font-mono text-[9px] tracking-widest uppercase
                            text-scarlet dark:text-scarlet-bright"
            >
              <span
                className="w-4 h-px bg-scarlet dark:bg-scarlet-bright shrink-0"
                aria-hidden="true"
              />
               {isId ? "Harga" : "Pricing"}
            </div>
            <h2
              className="font-fraunces font-semibold
                         leading-none tracking-tight text-ink dark:text-frost mb-6
                         transition-colors duration-520"
              style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}
            >
              {isId ? "Paket yang" : "Plans that"}{" "}
              <em className="italic font-normal text-scarlet dark:text-scarlet-bright">
                {isId ? "tumbuh bersama Anda." : "scale with you."}
              </em>
            </h2>
            <p className="font-sans font-light text-base text-ink/70 dark:text-frost/70 leading-relaxed max-w-[40ch] mb-8">
              {isId
                ? "Baik Anda memimpin tim ramping maupun portofolio kompleks, ada paket yang pas untuk tahap bisnis Anda."
                : "Whether you're running a lean team or a complex portfolio — there's a plan that fits where you are. No bloated contracts."}
            </p>
            <div className="flex gap-2.5 items-center">
              <Link
                to="/financial"
                className="inline-flex font-sans font-semibold text-[11.5px] uppercase tracking-wider
                           px-7 py-3 rounded-card bg-scarlet dark:bg-scarlet-bright text-white
                           hover:bg-scarlet-dark hover:-translate-y-0.5
                           transition-all duration-200 ease-spring border-0 cursor-pointer no-underline"
              >
                {isId ? "Lihat Detail Harga" : "See Full Pricing"}
              </Link>
              <a
                href="mailto:hello@novaris.app"
                className="font-sans font-normal text-[13px] text-ink/30 dark:text-frost/28
                           bg-transparent border-0 cursor-pointer flex items-center gap-1
                           hover:text-ink dark:hover:text-frost transition-colors duration-200 no-underline"
              >
                {isId ? "Hubungi kami →" : "Talk to us →"}
              </a>
            </div>
          </div>

          {/* Right: plan stack */}
          <div
            className="flex flex-col gap-px
                       bg-ink/9 dark:bg-frost/8
                       border border-ink/9 dark:border-frost/8
                       rounded-[6px] overflow-hidden"
          >
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`plan-item group flex items-center justify-between px-5.5 py-5
                            cursor-pointer transition-colors duration-200 ease-spring
                            ${
                              plan.popular
                                ? "bg-scarlet/7 dark:bg-scarlet-bright/9 hover:bg-scarlet/10 dark:hover:bg-scarlet-bright/12"
                                : "bg-bone-soft dark:bg-void-soft hover:bg-bone dark:hover:bg-void"
                            }`}
              >
                <div>
                  <div
                    className={`font-fraunces font-semibold text-base tracking-tight
                                ${plan.popular ? "text-scarlet dark:text-scarlet-bright" : "text-ink dark:text-frost"}`}
                  >
                    {plan.name}
                  </div>
                  <div className="font-sans text-xs text-ink/30 dark:text-frost/28 mt-0.5">
                    {plan.desc}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-[9px] tracking-widest uppercase
                                px-2 py-0.75 rounded-badge
                                ${
                                  plan.popular
                                    ? "bg-scarlet/14 dark:bg-scarlet-bright/14 text-scarlet dark:text-scarlet-bright"
                                    : "bg-ink/5 dark:bg-frost/5 text-ink/30 dark:text-frost/28"
                                }`}
                  >
                    {plan.tag}
                  </span>
                  <span
                    className="font-sans text-xs text-scarlet dark:text-scarlet-bright
                               opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0
                               transition-all duration-200 ease-spring"
                  >
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

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
      <section className="px-13 py-25 relative overflow-hidden max-sm:px-6 bg-scarlet">
        {/* Metallic shimmer top line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent 5%, rgba(210,225,240,.3) 25%, rgba(255,255,255,.55) 50%, rgba(210,225,240,.3) 75%, transparent 95%)",
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
            color: "rgba(255,255,255,0.04)",
          }}
          aria-hidden="true"
        >
          NOVARIS
        </div>

        <div className="max-w-content mx-auto relative z-2">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">
            {/* Left */}
            <div>
              <div
                className="font-mono text-[9px] tracking-widest uppercase mb-4.5"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {isId
                  ? "Tanpa kartu kredit · Setup kurang dari 10 menit"
                  : "No credit card needed · Setup in under 10 minutes"}
              </div>
              <h2
                className="font-fraunces font-semibold
                         leading-none tracking-tight text-white mb-6
                         transition-colors duration-520"
                style={{ fontSize: "clamp(40px, 5vw, 76px)" }}
              >
                {isId
                  ? "Berhenti berjalan tanpa visibilitas."
                  : "Stop flying blind."}
              </h2>
              <p className="font-sans font-light text-xl text-white/70 leading-relaxed max-w-[35ch] mx-auto mb-10">
                {isId
                  ? "Bergabung dengan ribuan owner bisnis yang beralih dari reaktif menjadi siap. Mulai gratis, upgrade saat sudah tepat."
                  : "Join thousands of business owners who've moved from reactive to ready. Start free, upgrade when it makes sense."}
              </p>
              <div className="flex gap-2.5 items-center">
                {/* White primary */}
                <Link
                  to="/financial"
                  className="inline-flex font-sans font-bold text-[11px] uppercase tracking-wider
                             px-6.5 py-3 rounded-card bg-white no-underline
                             hover:opacity-90 hover:-translate-y-0.5
                             transition-all duration-200 ease-spring border-0 cursor-pointer"
                  style={{ color: "var(--color-scarlet)" }}
                >
                  {isId ? "Mulai Uji Coba Gratis" : "Start Free Trial"}
                </Link>
                {/* Outline */}
                <a
                  href="mailto:hello@novaris.app"
                  className="inline-flex font-sans text-[12px] rounded-card
                             px-5 py-2.75 cursor-pointer no-underline
                             transition-all duration-200"
                  style={{
                    color: "rgba(255,255,255,0.42)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(255,255,255,0.5)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "rgba(255,255,255,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(255,255,255,0.2)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "rgba(255,255,255,0.42)";
                  }}
                >
                  {isId ? "Jadwalkan Demo" : "Book a Demo"}
                </a>
              </div>
            </div>

            {/* Right: feature checklist aside */}
            <div
              className="min-w-50 rounded-card p-6"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                className="font-mono text-[8.5px] tracking-widest uppercase mb-4"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                {isId
                  ? "Yang Anda dapat di hari pertama"
                  : "What you get on day one"}
              </div>
              {dayOneFeatures.map((f, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 font-sans text-[12.5px]
                              py-1.75 ${i < dayOneFeatures.length - 1 ? "border-b" : ""}`}
                  style={{
                    color: f.included
                      ? "rgba(255,255,255,0.52)"
                      : "rgba(255,255,255,0.26)",
                    borderBottomColor: "rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="w-1.25 h-1.25 rounded-full shrink-0"
                    style={{
                      background: f.included
                        ? "#6fcf97"
                        : "rgba(255,255,255,0.25)",
                    }}
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
                   border-t border-ink/9 dark:border-frost/8
                   bg-bone dark:bg-void
                   flex items-center justify-between flex-wrap gap-3
                   transition-colors duration-520 ease-spring
                   max-sm:px-6"
      >
        <img
          src={logoUrl}
          alt="Novaris"
          className="h-6 w-auto object-contain opacity-70"
        />
        <span className="font-mono text-[9.5px] tracking-wider text-ink/30 dark:text-frost/28">
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
              className="font-sans text-xs text-ink/30 dark:text-frost/28
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

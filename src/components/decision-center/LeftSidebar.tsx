import React, { useState } from "react";
import type {
  AllInputs,
  EssentialInputs,
  DelayRiskInputs,
} from "../../types/decisionCenter";
import { useLocale } from "../../hooks/useLocale";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Info,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { CURRENCY_SYMBOLS } from "../../config/constants";
import {
  formatWithDots,
  parseDotNumber,
  withCap,
} from "../../utils/formatters";

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  inputs: AllInputs;
  onUpdateEssentials: (values: Partial<EssentialInputs>) => void;
  onUpdateDelayRisk: (values: Partial<DelayRiskInputs>) => void;
  missingEssentials: string[];
  validateDelay: boolean;
  missingDelay: string[];
  onConfirmData: () => void;
  canConfirm: boolean;
  hasSubmitted: boolean;
  errorMessage: string | null;
  isCalculating: boolean;
  onClearData: () => void;
}

export function LeftSidebar({
  isOpen,
  onToggle,
  inputs,
  onUpdateEssentials,
  onUpdateDelayRisk,
  missingEssentials,
  validateDelay,
  missingDelay,
  onConfirmData,
  canConfirm,
  hasSubmitted,
  errorMessage,
  isCalculating,
  onClearData,
}: LeftSidebarProps) {
  const {
    language,
    currency,
    setCurrency,
    fxLastUpdatedAt,
    refreshExchangeRates,
    isFxLoading,
    t,
    convertAmount,
  } = useLocale();
  const isId = language === "id";
  const c = CURRENCY_SYMBOLS[currency] ?? currency;

  const [showDelayDetails, setShowDelayDetails] = useState(false);
  const [showRevenueTarget, setShowRevenueTarget] = useState(
    inputs.essentials.monthlyRevenueTarget !== "",
  );

  const InfoBadge = ({ text }: { text: string }) => (
    <span className="group relative inline-flex items-center">
      <Info size={13} className="text-ink/30 dark:text-frost/36 cursor-help transition-colors group-hover:text-scarlet group-hover:dark:text-scarlet-bright" />
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full z-50 mb-3 w-[260px] rounded-xl border border-ink/10 bg-bone/95 px-4 py-3 font-sans text-[12px] leading-relaxed text-ink/80 opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 group-hover:opacity-100 dark:border-frost/10 dark:bg-charcoal-soft/95 dark:text-frost/82">
        {text}
      </span>
    </span>
  );

  /** Closes sidebar on mobile when Escape key is pressed */
  React.useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && window.innerWidth < 1024) {
        onToggle();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onToggle]);

  /** Prevents body scrolling on mobile when sidebar is open */
  React.useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink/60 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Toggle Button - Mobile (bottom right FAB) */}
      <button
        onClick={onToggle}
        className={`fixed bottom-5 right-5 z-50 flex lg:hidden items-center gap-2 rounded-full bg-scarlet px-5 py-3 text-white dark:bg-scarlet-bright dark:text-void transition-all duration-300 ${
          isOpen ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100"
        }`}
        aria-label={isId ? "Buka panel input" : "Open input panel"}
      >
        <Plus size={18} />
        <span className="font-sans text-[13px] font-medium">
          {isId ? "Input" : "Inputs"}
        </span>
      </button>
      <button
        onClick={onToggle}
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 hidden lg:flex items-center justify-center w-12 h-24 rounded-r-xl bg-ink text-bone dark:bg-charcoal-soft dark:text-frost border-y border-r border-ink/15 dark:border-frost/10 transition-all duration-300 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label={isId ? "Buka panel input" : "Open input panel"}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="rotate-180 [writing-mode:vertical-rl] font-sans text-[10px] uppercase tracking-[0.18em]">
            {isId ? "Input" : "Inputs"}
          </span>
          <ChevronRight size={16} />
        </div>
      </button>
      <aside
        id="decision-sidebar"
        className={`fixed z-40 bg-bone dark:bg-charcoal border-ink/4 dark:border-frost/4 transition-all duration-500 ease-spring-bounce ${
          // Desktop (lg+): docked sidebar
          isOpen
            ? "lg:left-0 lg:top-18 lg:bottom-0 lg:w-[420px] lg:border-r"
            : "lg:left-0 lg:top-18 lg:bottom-0 lg:w-0 lg:border-0 lg:overflow-hidden"
        } ${
          // Mobile/Tablet (<lg): modal sheet
          isOpen
            ? "left-0 bottom-0 top-18 w-[85%] max-w-[360px] lg:rounded-none"
            : "-left-full bottom-0 top-18 w-[85%] max-w-[360px]"
        } overflow-hidden`}
      >
        {isOpen && (
          <div className="h-full flex flex-col ">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink/4 dark:border-frost/4">
              <div>
                <p className="font-sans text-[15px] font-medium text-ink dark:text-frost">
                  {isId ? "Mulai Dari Sini" : "Start Here"}
                </p>
                <p className="font-sans text-[12px] text-ink/56 dark:text-frost/64 mt-0.5">
                  {isId
                    ? "Isi 4 angka untuk risiko uang"
                    : "Fill 4 numbers for money risk"}
                </p>
              </div>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg border border-ink/8 dark:border-frost/8 hover:bg-ink/3 dark:hover:bg-frost/3 transition-colors"
                aria-label={isId ? "Tutup panel input" : "Close input panel"}
              >
                <ChevronLeft
                  size={18}
                  className="text-ink/54 dark:text-frost/62"
                />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <div className="mb-8 rounded-xl border border-ink/5 dark:border-frost/8 bg-bone/60 dark:bg-charcoal-soft/60 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-[13px] tracking-[0.14em] uppercase text-ink/54 dark:text-frost/62">
                      {t("sidebar.currencySelector")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void refreshExchangeRates()}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/8 text-ink/60 hover:text-ink dark:border-frost/10 dark:text-frost/66 dark:hover:text-frost"
                    aria-label={
                      isId ? "Perbarui kurs" : "Refresh exchange rates"
                    }
                  >
                    <RefreshCw
                      size={14}
                      className={isFxLoading ? "animate-spin" : ""}
                    />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <label
                    htmlFor="sidebar-currency"
                    className="font-sans text-[13px] text-ink/60 dark:text-frost/68"
                  >
                    {t("nav.currency")}
                  </label>
                  <select
                    id="sidebar-currency"
                    value={currency}
                    onChange={(e) => {
                      setCurrency(e.target.value as typeof currency);
                    }}
                    className="min-w-[120px] rounded-full border border-ink/8 bg-transparent px-3 py-2 font-sans text-[13px] text-ink dark:bg-charcoal-soft dark:text-frost outline-none dark:border-frost/10"
                  >
                    {(["USD", "IDR", "SGD", "EUR", "GBP"] as const).map(
                      (option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <p className="mt-3 font-sans text-[12px] text-ink/58 dark:text-frost/66">
                  {fxLastUpdatedAt
                    ? `${t("nav.fx")}: ${new Date(
                        fxLastUpdatedAt,
                      ).toLocaleString(language === "id" ? "id-ID" : "en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : isId
                      ? "Kurs belum tersedia."
                      : "FX update not available yet."}
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 rounded-2xl border border-scarlet/14 bg-scarlet/3 px-4 py-3">
                  <p className="font-sans text-[13px] text-scarlet dark:text-scarlet-bright">
                    {errorMessage}
                  </p>
                </div>
              )}

              {missingEssentials.length > 0 && (
                <div className="mb-6 rounded-2xl border border-scarlet/14 bg-scarlet/3 px-4 py-3">
                  <p className="font-sans text-[13px] text-scarlet dark:text-scarlet-bright">
                    {isId
                      ? "Isi dulu 4 angka utama untuk membaca risiko uang."
                      : "Fill the 4 core numbers first to read your money risk."}
                  </p>
                </div>
              )}

              <div className="mb-8">
                <p className="font-sans text-[12px] tracking-[0.18em] uppercase text-scarlet dark:text-scarlet-bright mb-6">
                  {isId ? "METRIK UTAMA" : "ESSENTIAL METRICS"}
                </p>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="dc-cash-in-bank"
                      className="block font-sans text-[13px] text-ink dark:text-frost mb-2"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {isId
                          ? "Saldo Kas Sekarang"
                          : "Actual Cash in Bank"}
                        <InfoBadge
                          text={
                            isId
                              ? "Total uang tunai yang benar-benar ada di tangan dan siap pakai. Jangan hitung uang yang masih ditunggu pembayarannya."
                              : "The total cash you can spend right now. Don't include money you're still waiting for from customers."
                          }
                        />
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/54 dark:text-frost/62">
                        {c}
                      </span>
                      <input
                        id="dc-cash-in-bank"
                        type="text"
                        inputMode="numeric"
                        value={formatWithDots(inputs.essentials.cashInBank)}
                        onChange={(e) =>
                          onUpdateEssentials({
                            cashInBank: parseDotNumber(e.target.value),
                          })
                        }
                        className={`w-full h-12 pl-6 pr-3 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingEssentials.includes("cashInBank") ? "border-scarlet/60" : "border-ink/8 dark:border-frost/8 focus:border-scarlet/50"}`}
                        placeholder={isId ? "Contoh: 50000000" : "e.g. 50000"}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="dc-monthly-bills"
                      className="block font-sans text-[13px] text-ink dark:text-frost mb-2"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {isId
                          ? "Pengeluaran Pasti Bulanan"
                          : "Regular Monthly Bills"}
                        <InfoBadge
                          text={
                            isId
                              ? "Uang yang harus keluar tiap bulan (Gaji, sewa, dll) supaya bisnis tetap jalan, meskipun tidak ada jualan."
                              : "The money you must pay every month (Rent, salaries, software) just to keep the business running, even if you make zero sales."
                          }
                        />
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/40">
                        {c}
                      </span>
                      <input
                        id="dc-monthly-bills"
                        type="text"
                        inputMode="numeric"
                        value={formatWithDots(inputs.essentials.monthlyBills)}
                        onChange={(e) =>
                          onUpdateEssentials({
                            monthlyBills: parseDotNumber(e.target.value),
                          })
                        }
                        className={`w-full h-12 pl-6 pr-3 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingEssentials.includes("monthlyBills") ? "border-scarlet/60" : "border-ink/8 dark:border-frost/8 focus:border-scarlet/50"}`}
                        placeholder={isId ? "Contoh: 20000000" : "e.g. 20000"}
                      />
                    </div>
                    <p className="font-sans text-[11px] text-ink/54 dark:text-frost/62 mt-2">
                      {isId
                        ? "Sewa, gaji, software, dll"
                        : "Rent, salaries, software, etc."}
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="dc-monthly-revenue"
                      className="block font-sans text-[13px] text-ink dark:text-frost mb-2"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {isId
                          ? "Pemasukan Bulanan Biasa"
                          : "Typical Monthly Revenue"}
                        <InfoBadge
                          text={
                            isId
                              ? "Berapa uang masuk biasanya per bulan? Gunakan angka rata-rata yang sering terjadi, bukan target ideal."
                              : "How much do you usually make in a month? Use realistic average numbers, not your 'dream' target."
                          }
                        />
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/54 dark:text-frost/62">
                        {c}
                      </span>
                      <input
                        id="dc-monthly-revenue"
                        type="text"
                        inputMode="numeric"
                        value={formatWithDots(inputs.essentials.monthlyRevenue)}
                        onChange={(e) =>
                          onUpdateEssentials({
                            monthlyRevenue: parseDotNumber(e.target.value),
                          })
                        }
                        className={`w-full h-12 pl-6 pr-3 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingEssentials.includes("monthlyRevenue") ? "border-scarlet/60" : "border-ink/8 dark:border-frost/8 focus:border-scarlet/50"}`}
                        placeholder={isId ? "Contoh: 50000000" : "e.g. 50000"}
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowRevenueTarget((prev) => !prev)}
                      className="inline-flex items-center gap-2 rounded-lg border border-ink/12 bg-transparent px-4 py-2.5 font-sans text-[13px] text-ink/70 transition-all hover:border-ink/22 hover:bg-ink/3 hover:text-ink dark:border-frost/12 dark:text-frost/70 dark:hover:border-frost/22 dark:hover:bg-frost/3 dark:hover:text-frost"
                    >
                      {showRevenueTarget ? (
                        <>
                          {isId ? "Sembunyikan target" : "Hide revenue target"}
                          <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          {isId ? "Saya tahu target saya" : "I know my target"}
                          <ChevronDown size={16} />
                        </>
                      )}
                    </button>
                    <p className="mt-2 font-sans text-[11px] text-ink/54 dark:text-frost/62">
                      {isId
                        ? "Opsional. Jika kosong, Novaris memakai titik impas dari tagihan bulanan."
                        : "Optional. If left empty, Novaris uses your monthly bills as the break-even target."}
                    </p>
                  </div>

                  {showRevenueTarget && (
                    <div>
                      <label
                        htmlFor="dc-monthly-revenue-target"
                        className="block font-sans text-[13px] text-ink dark:text-frost mb-2"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {isId
                            ? "Target pendapatan bulanan"
                            : "Monthly revenue target"}
                          <InfoBadge
                            text={
                              isId
                                ? "Isi jika Anda punya target omset yang jelas. Kalau tidak, sistem akan memakai titik impas."
                                : "Fill this only if you already have a revenue goal. Otherwise the system uses your break-even point."
                            }
                          />
                        </span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/54 dark:text-frost/62">
                          {c}
                        </span>
                        <input
                          id="dc-monthly-revenue-target"
                          type="text"
                          inputMode="numeric"
                          value={formatWithDots(
                            inputs.essentials.monthlyRevenueTarget ?? "",
                          )}
                          onChange={(e) =>
                            onUpdateEssentials({
                              monthlyRevenueTarget: parseDotNumber(
                                e.target.value,
                              ),
                            })
                          }
                          className="w-full h-12 pl-6 pr-3 bg-transparent border-b border-ink/8 dark:border-frost/8 font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 focus:border-scarlet/50"
                          placeholder={isId ? "Contoh: 65000000" : "e.g. 65000"}
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="dc-biggest-client"
                      className="block font-sans text-[13px] text-ink dark:text-frost mb-2"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {isId
                          ? "Risiko Ketergantungan Klien"
                          : "Client Concentration Risk"}
                        <InfoBadge
                          text={
                            isId
                              ? "Jika klien terbesar Anda berhenti hari ini, berapa persen (%) pendapatan Anda yang hilang? Semakin besar angkanya, bisnis Anda semakin bahaya karena terlalu bergantung pada satu orang/perusahaan."
                              : "If your biggest customer left you today, what % of your income would vanish? If this is high (e.g. over 40%), your business is very vulnerable to that one client."
                          }
                        />
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="dc-biggest-client"
                        type="text"
                        inputMode="numeric"
                        value={formatWithDots(
                          inputs.essentials.biggestClientPercent,
                        )}
                        onChange={(e) => {
                          const val = parseDotNumber(e.target.value);
                          onUpdateEssentials({
                            biggestClientPercent: withCap(val, 100),
                          });
                        }}
                        className={`w-full h-12 pr-8 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingEssentials.includes("biggestClientPercent") ? "border-scarlet/60" : "border-ink/8 dark:border-frost/8 focus:border-scarlet/50"}`}
                        placeholder={isId ? "Contoh: 40" : "e.g. 40"}
                      />
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/54 dark:text-frost/62">
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-ink/4 dark:border-frost/4 pt-6">
                <button
                  id="decision-delay-toggle"
                  onClick={() => setShowDelayDetails(!showDelayDetails)}
                  className={`flex flex-col gap-3 w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                    showDelayDetails 
                      ? "bg-scarlet/5 border-scarlet/20 dark:bg-scarlet-bright/5 dark:border-scarlet-bright/20" 
                      : "bg-bone-soft border-ink/8 hover:border-scarlet/40 hover:bg-scarlet/2 dark:bg-charcoal-soft dark:border-frost/10 dark:hover:border-scarlet-bright/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg transition-colors ${showDelayDetails ? "bg-scarlet text-white" : "bg-ink/5 text-ink/60 dark:bg-frost/5 dark:text-frost/60"}`}>
                        <Plus
                          size={16}
                          className={`transition-transform duration-300 ${showDelayDetails ? "rotate-45" : ""}`}
                        />
                      </div>
                      <span className="font-sans text-[14px] font-medium text-ink dark:text-frost">
                        {isId
                          ? "Cek Efek Penundaan Proyek"
                          : "Check Project Delay Impacts"}
                      </span>
                    </div>
                  </div>
                  
                  <p className="font-sans text-[12px] leading-relaxed text-ink/56 dark:text-frost/64 translate-x-1">
                    {isId
                      ? "Buka ini jika Anda ingin tahu bahayanya jika pengiriman proyek atau pembayaran klien terlambat."
                      : "Open this to see the financial danger if your project delivery or client payment gets delayed."}
                  </p>
                </button>

                {showDelayDetails && (
                  <div className="mt-6 space-y-6 pl-6 border-l border-scarlet/20">
                    {validateDelay && missingDelay.length > 0 && (
                      <p className="font-sans text-[12px] text-scarlet dark:text-scarlet-bright">
                        {isId
                          ? "Karena Anda membuka layer delay, isi semua detail delay agar ceritanya akurat."
                          : "Since you opened delay risk, fill the delay details so the story stays accurate."}
                      </p>
                    )}

                    <div>
                      <label
                        htmlFor="dc-project-target-days"
                        className="block font-sans text-[13px] text-ink dark:text-frost mb-2"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {isId
                            ? "Target pengiriman proyek (hari)"
                            : "Project delivery target (days)"}
                          <InfoBadge
                            text={
                              isId
                                ? "Berapa lama proyek seharusnya selesai."
                                : "How long the project should take when things go to plan."
                            }
                          />
                        </span>
                      </label>
                      <input
                        id="dc-project-target-days"
                        type="text"
                        inputMode="numeric"
                        value={formatWithDots(
                          inputs.delayRisk.projectTargetDays,
                        )}
                        onChange={(e) =>
                          onUpdateDelayRisk({
                            projectTargetDays: parseDotNumber(e.target.value),
                          })
                        }
                        className={`w-full h-12 pr-8 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingDelay.includes("projectTargetDays") ? "border-scarlet/60" : "border-ink/8 dark:border-frost/8 focus:border-scarlet/50"}`}
                        placeholder={isId ? "Contoh: 30" : "e.g. 30"}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="dc-payment-at-risk"
                        className="block font-sans text-[13px] text-ink dark:text-frost mb-2"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {isId
                            ? "Pembayaran terkait proyek"
                            : "Payment tied to delivery"}
                          <InfoBadge
                            text={
                              isId
                                ? "Uang yang masuk jika proyek terkirim sesuai rencana."
                                : "Money you expect to receive when that project gets delivered."
                            }
                          />
                        </span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/54 dark:text-frost/62">
                          {c}
                        </span>
                        <input
                          id="dc-payment-at-risk"
                          type="text"
                          inputMode="numeric"
                          value={formatWithDots(inputs.delayRisk.paymentAtRisk)}
                          onChange={(e) =>
                            onUpdateDelayRisk({
                              paymentAtRisk: parseDotNumber(e.target.value),
                            })
                          }
                          className={`w-full h-12 pl-6 pr-3 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingDelay.includes("paymentAtRisk") ? "border-scarlet/60" : "border-ink/8 dark:border-frost/8 focus:border-scarlet/50"}`}
                          placeholder={isId ? "Contoh: 25000000" : "e.g. 25000"}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="dc-team-size"
                        className="block font-sans text-[13px] text-ink dark:text-frost mb-2"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {isId
                            ? "Ukuran tim di proyek ini"
                            : "Team size on this project"}
                          <InfoBadge
                            text={
                              isId
                                ? "Jumlah orang yang benar-benar mengerjakan proyek ini sekarang."
                                : "How many people are actually working on this project right now."
                            }
                          />
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          id="dc-team-size"
                          type="text"
                          inputMode="numeric"
                          value={formatWithDots(inputs.delayRisk.teamSize)}
                          onChange={(e) =>
                            onUpdateDelayRisk({
                              teamSize: parseDotNumber(e.target.value),
                            })
                          }
                          className={`w-full h-12 pr-16 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingDelay.includes("teamSize") ? "border-scarlet/60" : "border-ink/8 dark:border-frost/8 focus:border-scarlet/50"}`}
                          placeholder={isId ? "Contoh: 3" : "e.g. 3"}
                        />
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/54 dark:text-frost/62">
                          {isId ? "orang" : "people"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="dc-buffer-days"
                        className="block font-sans text-[13px] text-ink dark:text-frost mb-2"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {isId ? "Sisa hari buffer" : "Days buffer remaining"}
                          <InfoBadge
                            text={
                              isId
                                ? "Cadangan waktu sebelum proyek dianggap benar-benar telat."
                                : "Extra days you still have before the project is truly late."
                            }
                          />
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          id="dc-buffer-days"
                          type="text"
                          inputMode="numeric"
                          value={formatWithDots(inputs.delayRisk.bufferDays)}
                          onChange={(e) =>
                            onUpdateDelayRisk({
                              bufferDays: parseDotNumber(e.target.value),
                            })
                          }
                          className={`w-full h-12 pr-16 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingDelay.includes("bufferDays") ? "border-scarlet/60" : "border-ink/8 dark:border-frost/8 focus:border-scarlet/50"}`}
                          placeholder={isId ? "Contoh: 5" : "e.g. 5"}
                        />
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/54 dark:text-frost/62">
                          {isId ? "hari" : "days"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-ink/4 dark:border-frost/8 px-6 py-5 bg-bone/96 dark:bg-charcoal/96">
              <button
                type="button"
                onClick={onConfirmData}
                disabled={!canConfirm || isCalculating}
                className={`w-full rounded-2xl px-4 py-3 font-sans text-[14px] font-medium transition-colors ${
                  !canConfirm || isCalculating
                    ? "bg-ink/6 dark:bg-charcoal-light text-ink/50 dark:text-frost/60 cursor-not-allowed"
                    : "bg-ink text-bone dark:bg-frost/95 dark:text-void hover:bg-ink/92 dark:hover:bg-frost"
                }`}
              >
                {isCalculating
                  ? isId
                    ? "Menganalisis..."
                    : "Analyzing..."
                  : hasSubmitted
                    ? isId
                      ? "Perbarui Analisis"
                      : "Update Analysis"
                    : isId
                      ? "Konfirmasi Data & Analisis"
                      : "Confirm Data & Analyze"}
              </button>
              <p className="mt-3 font-sans text-[12px] text-ink/56 dark:text-frost/64">
                {isId
                  ? "Novaris hanya menjalankan cerita keputusan setelah Anda menekan tombol ini."
                  : "Novaris only runs the decision story after you press this button."}
              </p>
              <button
                type="button"
                onClick={onClearData}
                className="mt-4 w-full rounded-2xl border border-ink/8 px-4 py-3 font-sans text-[13px] text-ink/58 transition-all hover:border-ink/14 hover:text-ink dark:border-frost/8 dark:text-frost/58 dark:hover:border-frost/14 dark:hover:text-frost"
              >
                {isId ? "Hapus data tersimpan" : "Clear saved data"}
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

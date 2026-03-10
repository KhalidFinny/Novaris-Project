import React, { useState } from "react";
import type { 
  AllInputs, 
  EssentialInputs,
  DelayRiskInputs,
} from "../../types/decisionCenter";
import { useLocale } from "../../hooks/useLocale";
import { ChevronRight, ChevronLeft, Plus, Info, ChevronDown, ChevronUp } from "lucide-react";

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
  const { language, currency } = useLocale();
  const isId = language === "id";
  const c = currency === "USD" ? "$" : "Rp";
  
  const [showDelayDetails, setShowDelayDetails] = useState(false);
  const [showRevenueTarget, setShowRevenueTarget] = useState(inputs.essentials.monthlyRevenueTarget !== "");

  // Format number with dots for thousands
  const formatNumber = (value: number | ""): string => {
    if (value === "") return "";
    return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(Number(value));
  };

  // Parse number from formatted string
  const parseNumber = (value: string): number | "" => {
    const normalized = value.replace(/[^\d]/g, "");
    if (!normalized) return "";
    return Number(normalized);
  };

  const withCap = (value: number | "", max: number): number | "" => {
    if (value === "") return "";
    return value > max ? max : value;
  };

  const InfoBadge = ({ text }: { text: string }) => (
    <span className="group relative inline-flex items-center">
      <Info size={12} className="text-ink/28 dark:text-frost/28" />
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-52 -translate-x-1/2 rounded-xl border border-ink/[0.06] bg-bone px-3 py-2 text-[12px] leading-relaxed text-ink/70 opacity-0 shadow-none transition-opacity group-hover:opacity-100 dark:border-frost/[0.08] dark:bg-charcoal dark:text-frost/72">
        {text}
      </span>
    </span>
  );

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-12 h-24 rounded-r-xl bg-ink text-bone dark:bg-frost dark:text-charcoal border-y border-r border-ink/15 dark:border-frost/15 transition-all duration-300 ${
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

      {/* Sidebar */}
      <aside
        id="decision-sidebar"
        className={`fixed left-0 top-[72px] bottom-0 z-40 bg-bone/98 dark:bg-charcoal/98 backdrop-blur-xl border-r border-ink/[0.04] dark:border-frost/[0.04] transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] overflow-hidden ${
          isOpen ? "w-[360px]" : "w-0"
        }`}
      >
        {isOpen && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink/[0.04] dark:border-frost/[0.04]">
              <div>
                <p className="font-sans text-[15px] font-medium text-ink dark:text-frost">
                  {isId ? "Mulai Dari Sini" : "Start Here"}
                </p>
                <p className="font-sans text-[12px] text-ink/45 dark:text-frost/45 mt-0.5">
                  {isId ? "Isi 4 angka untuk risiko uang" : "Fill 4 numbers for money risk"}
                </p>
              </div>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg border border-ink/[0.08] dark:border-frost/[0.08] hover:bg-ink/[0.03] dark:hover:bg-frost/[0.03] transition-colors"
                aria-label={isId ? "Tutup panel input" : "Close input panel"}
              >
                <ChevronLeft size={18} className="text-ink/40 dark:text-frost/40" />
              </button>
            </div>

            {/* Essential Inputs - Always Visible */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              {errorMessage && (
                <div className="mb-6 rounded-2xl border border-scarlet/14 bg-scarlet/[0.03] px-4 py-3">
                  <p className="font-sans text-[13px] text-scarlet dark:text-scarlet-bright">{errorMessage}</p>
                </div>
              )}

              {missingEssentials.length > 0 && (
                <div className="mb-6 rounded-2xl border border-scarlet/14 bg-scarlet/[0.03] px-4 py-3">
                  <p className="font-sans text-[13px] text-scarlet dark:text-scarlet-bright">
                    {isId ? "Isi dulu 4 angka utama untuk membaca risiko uang." : "Fill the 4 core numbers first to read your money risk."}
                  </p>
                </div>
              )}

              <div className="mb-8">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-scarlet dark:text-scarlet-bright mb-6">
                  {isId ? "METRIK UTAMA" : "ESSENTIAL METRICS"}
                </p>

                <div className="space-y-6">
                  {/* Cash in Bank */}
                  <div>
                    <label className="block font-sans text-[13px] text-ink dark:text-frost mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        {isId ? "Uang di bank saat ini" : "Cash in your bank right now"}
                        <InfoBadge text={isId ? "Hanya uang yang benar-benar bisa Anda pakai hari ini." : "Only money you can actually use today."} />
                      </span>
                    </label>                    
                    <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/40">{c}</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatNumber(inputs.essentials.cashInBank)}
                        onChange={(e) => onUpdateEssentials({ 
                          cashInBank: parseNumber(e.target.value) 
                        })}
                        className={`w-full h-12 pl-6 pr-3 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingEssentials.includes("cashInBank") ? "border-scarlet/60" : "border-ink/[0.08] dark:border-frost/[0.08] focus:border-scarlet/50"}`}
                        placeholder={isId ? "Contoh: 50000000" : "e.g. 50000"}
                      />
                    </div>
                  </div>

                  {/* Monthly Bills */}
                  <div>
                    <label className="block font-sans text-[13px] text-ink dark:text-frost mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        {isId ? "Tagihan wajib per bulan" : "Monthly bills you MUST pay"}
                        <InfoBadge text={isId ? "Biaya yang tetap jalan walau penjualan berhenti." : "Bills that keep happening even if sales stop."} />
                      </span>
                    </label>                    
                    <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/40">{c}</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatNumber(inputs.essentials.monthlyBills)}
                        onChange={(e) => onUpdateEssentials({ 
                          monthlyBills: parseNumber(e.target.value) 
                        })}
                        className={`w-full h-12 pl-6 pr-3 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingEssentials.includes("monthlyBills") ? "border-scarlet/60" : "border-ink/[0.08] dark:border-frost/[0.08] focus:border-scarlet/50"}`}
                        placeholder={isId ? "Contoh: 20000000" : "e.g. 20000"}
                      />
                    </div>
                    <p className="font-sans text-[11px] text-ink/40 dark:text-frost/40 mt-2">
                      {isId ? "Sewa, gaji, software, dll" : "Rent, salaries, software, etc."}
                    </p>
                  </div>

                  {/* Monthly Revenue */}
                  <div>
                    <label className="block font-sans text-[13px] text-ink dark:text-frost mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        {isId ? "Uang masuk per bulan" : "Money coming in each month"}
                        <InfoBadge text={isId ? "Rata-rata uang yang masuk per bulan, bukan target ambisius." : "Average money coming in each month, not your ideal target."} />
                      </span>
                    </label>                    
                    <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/40">{c}</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatNumber(inputs.essentials.monthlyRevenue)}
                        onChange={(e) => onUpdateEssentials({ 
                          monthlyRevenue: parseNumber(e.target.value) 
                        })}
                        className={`w-full h-12 pl-6 pr-3 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingEssentials.includes("monthlyRevenue") ? "border-scarlet/60" : "border-ink/[0.08] dark:border-frost/[0.08] focus:border-scarlet/50"}`}
                        placeholder={isId ? "Contoh: 50000000" : "e.g. 50000"}
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowRevenueTarget((prev) => !prev)}
                      className="inline-flex items-center gap-2 rounded-lg border border-ink/[0.12] bg-transparent px-4 py-2.5 font-sans text-[13px] text-ink/70 transition-all hover:border-ink/[0.22] hover:bg-ink/[0.03] hover:text-ink dark:border-frost/[0.12] dark:text-frost/70 dark:hover:border-frost/[0.22] dark:hover:bg-frost/[0.03] dark:hover:text-frost"
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
                    <p className="mt-2 font-sans text-[11px] text-ink/38 dark:text-frost/38">
                      {isId
                        ? "Opsional. Jika kosong, Novaris memakai titik impas dari tagihan bulanan."
                        : "Optional. If left empty, Novaris uses your monthly bills as the break-even target."}
                    </p>
                  </div>

                  {showRevenueTarget && (
                    <div>
                      <label className="block font-sans text-[13px] text-ink dark:text-frost mb-2">
                        <span className="inline-flex items-center gap-1.5">
                          {isId ? "Target pendapatan bulanan" : "Monthly revenue target"}
                          <InfoBadge text={isId ? "Isi jika Anda punya target omset yang jelas. Kalau tidak, sistem akan memakai titik impas." : "Fill this only if you already have a revenue goal. Otherwise the system uses your break-even point."} />
                        </span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/40">{c}</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatNumber(inputs.essentials.monthlyRevenueTarget ?? "")}
                          onChange={(e) => onUpdateEssentials({ monthlyRevenueTarget: parseNumber(e.target.value) })}
                          className="w-full h-12 pl-6 pr-3 bg-transparent border-b border-ink/[0.08] dark:border-frost/[0.08] font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 focus:border-scarlet/50"
                          placeholder={isId ? "Contoh: 65000000" : "e.g. 65000"}
                        />
                      </div>
                    </div>
                  )}

                  {/* Biggest Client % */}
                  <div>
                    <label className="block font-sans text-[13px] text-ink dark:text-frost mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        {isId ? "Klien terbesar (% pendapatan)" : "Biggest client % of income"}
                        <InfoBadge text={isId ? "Kalau satu klien menyumbang terlalu besar, bisnis Anda jadi rapuh." : "If one client contributes too much, your business becomes fragile."} />
                      </span>
                    </label>                    
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatNumber(inputs.essentials.biggestClientPercent)}
                        onChange={(e) => {
                          const val = parseNumber(e.target.value);
                          onUpdateEssentials({ 
                            biggestClientPercent: withCap(val, 100)
                          });
                        }}
                        className={`w-full h-12 pr-8 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingEssentials.includes("biggestClientPercent") ? "border-scarlet/60" : "border-ink/[0.08] dark:border-frost/[0.08] focus:border-scarlet/50"}`}
                        placeholder={isId ? "Contoh: 40" : "e.g. 40"}
                      />
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/40">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delay Risk Toggle */}
              <div className="border-t border-ink/[0.04] dark:border-frost/[0.04] pt-6">
                <button
                  id="decision-delay-toggle"
                  onClick={() => setShowDelayDetails(!showDelayDetails)}
                  className="flex items-center gap-2 w-full text-left group"
                >
                  <Plus 
                    size={16} 
                    className={`text-scarlet dark:text-scarlet-bright transition-transform ${showDelayDetails ? 'rotate-45' : ''}`}
                  />
                  <span className="font-sans text-[13px] text-ink/70 dark:text-frost/70 group-hover:text-ink dark:group-hover:text-frost transition-colors">
                    {isId ? "Tambahkan detail proyek & risiko delay" : "Add project & delay risk details"}
                  </span>
                </button>
                <p className="mt-2 pl-6 font-sans text-[12px] text-ink/42 dark:text-frost/42">
                  {isId ? "Buka ini hanya jika Anda ingin tahu dampak keterlambatan proyek terhadap uang masuk." : "Open this only if you want to see how delivery delays affect your money."}
                </p>

                {/* Delay Risk Inputs - Hidden by default */}
                {showDelayDetails && (
                  <div className="mt-6 space-y-6 pl-6 border-l border-scarlet/20">
                    {validateDelay && missingDelay.length > 0 && (
                      <p className="font-sans text-[12px] text-scarlet dark:text-scarlet-bright">
                        {isId ? "Karena Anda membuka layer delay, isi semua detail delay agar ceritanya akurat." : "Since you opened delay risk, fill the delay details so the story stays accurate."}
                      </p>
                    )}
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-scarlet/70 dark:text-scarlet-bright/70 mb-4">
                      {isId ? "RISIKO DELAY" : "DELAY RISK"}
                    </p>

                    {/* Project Target Days */}
                    <div>
                      <label className="block font-sans text-[13px] text-ink dark:text-frost mb-2">
                        <span className="inline-flex items-center gap-1.5">
                          {isId ? "Target pengiriman proyek (hari)" : "Project delivery target (days)"}
                          <InfoBadge text={isId ? "Berapa lama proyek seharusnya selesai." : "How long the project should take when things go to plan."} />
                        </span>
                      </label>                      
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatNumber(inputs.delayRisk.projectTargetDays)}
                        onChange={(e) => onUpdateDelayRisk({ 
                          projectTargetDays: parseNumber(e.target.value) 
                        })}
                        className={`w-full h-12 pr-8 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingDelay.includes("projectTargetDays") ? "border-scarlet/60" : "border-ink/[0.08] dark:border-frost/[0.08] focus:border-scarlet/50"}`}
                        placeholder={isId ? "Contoh: 30" : "e.g. 30"}
                      />
                    </div>

                    {/* Payment at Risk */}
                    <div>
                      <label className="block font-sans text-[13px] text-ink dark:text-frost mb-2">
                        <span className="inline-flex items-center gap-1.5">
                          {isId ? "Pembayaran terkait proyek" : "Payment tied to delivery"}
                          <InfoBadge text={isId ? "Uang yang masuk jika proyek terkirim sesuai rencana." : "Money you expect to receive when that project gets delivered."} />
                        </span>
                      </label>                      
                      <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/40">{c}</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatNumber(inputs.delayRisk.paymentAtRisk)}
                          onChange={(e) => onUpdateDelayRisk({ 
                            paymentAtRisk: parseNumber(e.target.value) 
                          })}
                          className={`w-full h-12 pl-6 pr-3 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingDelay.includes("paymentAtRisk") ? "border-scarlet/60" : "border-ink/[0.08] dark:border-frost/[0.08] focus:border-scarlet/50"}`}
                          placeholder={isId ? "Contoh: 25000000" : "e.g. 25000"}
                        />
                      </div>
                    </div>

                    {/* Team Size */}
                    <div>
                      <label className="block font-sans text-[13px] text-ink dark:text-frost mb-2">
                        <span className="inline-flex items-center gap-1.5">
                          {isId ? "Ukuran tim di proyek ini" : "Team size on this project"}
                          <InfoBadge text={isId ? "Jumlah orang yang benar-benar mengerjakan proyek ini sekarang." : "How many people are actually working on this project right now."} />
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatNumber(inputs.delayRisk.teamSize)}
                          onChange={(e) => onUpdateDelayRisk({ 
                            teamSize: parseNumber(e.target.value) 
                          })}
                          className={`w-full h-12 pr-16 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingDelay.includes("teamSize") ? "border-scarlet/60" : "border-ink/[0.08] dark:border-frost/[0.08] focus:border-scarlet/50"}`}
                          placeholder={isId ? "Contoh: 3" : "e.g. 3"}
                        />
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/40">
                          {isId ? "orang" : "people"}
                        </span>
                      </div>
                    </div>

                    {/* Buffer Days */}
                    <div>
                      <label className="block font-sans text-[13px] text-ink dark:text-frost mb-2">
                        <span className="inline-flex items-center gap-1.5">
                          {isId ? "Sisa hari buffer" : "Days buffer remaining"}
                          <InfoBadge text={isId ? "Cadangan waktu sebelum proyek dianggap benar-benar telat." : "Extra days you still have before the project is truly late."} />
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatNumber(inputs.delayRisk.bufferDays)}
                          onChange={(e) => onUpdateDelayRisk({ 
                            bufferDays: parseNumber(e.target.value) 
                          })}
                          className={`w-full h-12 pr-16 bg-transparent border-b font-sans text-[18px] text-ink dark:text-frost outline-none transition-colors placeholder:text-ink/20 ${missingDelay.includes("bufferDays") ? "border-scarlet/60" : "border-ink/[0.08] dark:border-frost/[0.08] focus:border-scarlet/50"}`}
                          placeholder={isId ? "Contoh: 5" : "e.g. 5"}
                        />
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 font-sans text-[14px] text-ink/40">
                          {isId ? "hari" : "days"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-ink/[0.04] dark:border-frost/[0.04] px-6 py-5 bg-bone/96 dark:bg-charcoal/96">
              <button
                type="button"
                onClick={onConfirmData}
                disabled={!canConfirm || isCalculating}
                className={`w-full rounded-2xl px-4 py-3 font-sans text-[14px] font-medium transition-colors ${
                  !canConfirm || isCalculating
                    ? "bg-ink/[0.06] dark:bg-frost/[0.08] text-ink/35 dark:text-frost/35 cursor-not-allowed"
                    : "bg-ink text-bone dark:bg-frost dark:text-charcoal hover:bg-ink/92 dark:hover:bg-frost/92"
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
              <p className="mt-3 font-sans text-[12px] text-ink/42 dark:text-frost/42">
                {isId
                  ? "Novaris hanya menjalankan cerita keputusan setelah Anda menekan tombol ini."
                  : "Novaris only runs the decision story after you press this button."}
              </p>
              <button
                type="button"
                onClick={onClearData}
                className="mt-4 w-full rounded-2xl border border-ink/[0.08] px-4 py-3 font-sans text-[13px] text-ink/58 transition-colors hover:border-ink/[0.14] hover:text-ink dark:border-frost/[0.08] dark:text-frost/58 dark:hover:border-frost/[0.14] dark:hover:text-frost"
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

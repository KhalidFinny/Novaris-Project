import React from "react";
import { Input } from "../../components/ui/Input";
import { useLocale } from "../../hooks/useLocale";
import type { FinancialInput } from "../../lib/engine/types";
import type {
  FinancialFieldProps,
  FinancialFormState,
  FinancialSidebarProps,
} from "./types";
import { formatWithDots, parseDotNumber, preserveCaretAfterFormat } from "../../utils/formatters";

type SectionId = "core" | "debt" | "growth" | "cascade";

function NumberField({
  label,
  fieldKey,
  form,
  onChange,
  suffix,
  info,
  placeholder,
  onBlur,
  invalid,
  errorText,
}: FinancialFieldProps & { onBlur?: () => void }) {
  const raw = form[fieldKey];
  const display =
    raw === "" ? "" : typeof raw === "number" ? formatWithDots(raw) : "";

  return (
    <Input
      label={label}
      type="text"
      inputMode="numeric"
      value={display}
      suffix={suffix}
      info={info}
      placeholder={placeholder}
      onBlur={onBlur}
      invalid={invalid}
      errorText={errorText}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const inputEl = e.target;
        const cursor = inputEl.selectionStart ?? inputEl.value.length;
        const digitsBeforeCursor = (
          inputEl.value.slice(0, cursor).match(/\d/g) || []
        ).length;

        const parsed = parseDotNumber(inputEl.value);
        onChange({ ...form, [fieldKey]: parsed } as FinancialFormState);

        requestAnimationFrame(() => {
          if (document.activeElement !== inputEl) {
            return;
          }
          const formatted =
            parsed === "" ? "" : formatWithDots(Number(parsed));
          preserveCaretAfterFormat(inputEl, digitsBeforeCursor, formatted);
        });
      }}
    />
  );
}

function RangeField({
  label,
  fieldKey,
  form,
  onChange,
  min,
  max,
  suffix,
  info,
  onBlur,
  invalid,
  errorText,
}: FinancialFieldProps & { onBlur?: () => void }) {
  return (
    <Input
      label={label}
      type="range"
      min={min}
      max={max}
      suffix={suffix}
      info={info}
      value={Number(form[fieldKey] === "" ? 0 : form[fieldKey])}
      onBlur={onBlur}
      invalid={invalid}
      errorText={errorText}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        onChange({ ...form, [fieldKey]: Number.isFinite(val) ? val : "" } as FinancialFormState);
      }}
    />
  );
}

interface SectionField {
  label: string;
  fieldKey: keyof FinancialInput;
  type?: "range";
  min?: number;
  max?: number;
  suffix?: string;
  info: string;
  placeholder?: string;
}

type SaveState = "saved" | "editing";

export function FinancialSidebar({
  form,
  onFormChange,
  invalidFieldKeys,
}: FinancialSidebarProps) {
  const { language, currency, t } = useLocale();
  const isId = language === "id";
  const c = currency === "USD" ? "$" : "Rp";
  const [variableSpendDraft, setVariableSpendDraft] = React.useState<string>("");
  const [saveState, setSaveState] = React.useState<SaveState>("saved");
  const saveTimerRef = React.useRef<number | null>(null);

  const sections: {
    id: SectionId;
    label: string;
    helper: string;
    fields: SectionField[];
  }[] = [
    {
      id: "core",
      label: isId ? "Arus Inti" : "Core Run Rate",
      helper: isId
        ? "Pendapatan dan biaya utama bulanan."
        : "Monthly revenue and operating cost baseline.",
      fields: [
        {
          label: isId ? "Pendapatan Bulanan" : "Monthly Revenue",
          fieldKey: "monthlyRevenue",
          suffix: c,
          info: isId
            ? "Rata-rata uang yang masuk setiap bulan."
            : "Average money coming in each month.",
          placeholder: isId ? "50.000.000" : "50.000",
        },
        {
          label: isId ? "Biaya Tetap" : "Fixed Costs",
          fieldKey: "fixedCosts",
          suffix: c,
          info: isId
            ? "Biaya rutin seperti sewa, gaji, and software inti."
            : "Recurring costs like rent, payroll, and core software.",
          placeholder: isId ? "20.000.000" : "20.000",
        },
        {
          label: isId ? "Biaya Variabel (%)" : "Variable Cost (%)",
          fieldKey: "variableCostPercentage",
          type: "range",
          min: 0,
          max: 100,
          suffix: "%",
          info: isId
            ? "Persentase pendapatan yang dipakai untuk biaya variabel."
            : "Percent of revenue spent on variable costs.",
        },
      ],
    },
    {
      id: "debt",
      label: isId ? "Kas & Utang" : "Cash & Debt",
      helper: isId
        ? "Cadangan kas dan kewajiban rutin."
        : "Cash reserve and recurring debt obligations.",
      fields: [
        {
          label: isId ? "Cadangan Kas" : "Cash Reserves",
          fieldKey: "currentCashReserves",
          suffix: c,
          info: isId ? "Kas likuid saat ini." : "Cash available right now.",
          placeholder: isId ? "120.000.000" : "120.000",
        },
        {
          label: isId ? "Buffer Darurat" : "Emergency Buffer",
          fieldKey: "emergencyBufferSize",
          suffix: c,
          info: isId
            ? "Batas kas minimum sebelum risiko kritis."
            : "Minimum cash floor before risk becomes critical.",
          placeholder: isId ? "35.000.000" : "35.000",
        },
        {
          label: isId ? "Pembayaran Pinjaman / bln" : "Monthly Loan Payments",
          fieldKey: "monthlyDebtObligations",
          suffix: c,
          info: isId
            ? "Pembayaran utang wajib setiap bulan."
            : "Required monthly debt servicing payments.",
          placeholder: isId ? "8.000.000" : "8.000",
        },
      ],
    },
    {
      id: "growth",
      label: isId ? "Pertumbuhan" : "Growth",
      helper: isId
        ? "Asumsi pertumbuhan bulanan."
        : "Expected month-over-month growth trend.",
      fields: [
        {
          label: isId ? "Laju Pertumbuhan" : "Growth Rate",
          fieldKey: "projectedGrowthRate",
          type: "range",
          min: -20,
          max: 100,
          suffix: "%",
          info: isId
            ? "Proyeksi tren pertumbuhan dari bulan ke bulan."
            : "Expected month-over-month growth trend.",
        },
      ],
    },
    {
      id: "cascade",
      label: isId ? "Dampak Delay" : "Delay Cascade",
      helper: isId
        ? "Hubungkan delay operasional ke dampak finansial."
        : "Connect operational delay directly to financial impact.",
      fields: [
        {
          label: isId ? "Hari Keterlambatan" : "Delay Days",
          fieldKey: "activeProjectDelayDays",
          info: isId
            ? "Jumlah hari proyek aktif terlambat."
            : "Number of days the active project is delayed.",
          placeholder: "14",
        },
        {
          label: isId ? "Biaya Harian" : "Daily Burn",
          fieldKey: "activeProjectDailyBurn",
          suffix: c,
          info: isId
            ? "Biaya tambahan per hari selama proyek terlambat."
            : "Extra daily cost while delayed project continues.",
          placeholder: isId ? "1.200.000" : "1.200",
        },
        {
          label: isId ? "Biaya Peluang / hari" : "Opportunity Cost / day",
          fieldKey: "opportunityCostPerDay",
          suffix: c,
          info: isId
            ? "Estimasi pendapatan yang hilang per hari delay."
            : "Estimated revenue lost per delayed day.",
          placeholder: isId ? "2.500.000" : "2.500",
        },
        {
          label: isId ? "Batas Penalti (hari)" : "Penalty Threshold (days)",
          fieldKey: "penaltyThresholdDays",
          info: isId
            ? "Hari telat sebelum penalti kontrak berlaku."
            : "Late days before contractual penalties start.",
          placeholder: "7",
        },
        {
          label: isId ? "Nilai Penalti" : "Penalty Amount",
          fieldKey: "penaltyAmount",
          suffix: c,
          info: isId
            ? "Nilai penalti saat melewati batas."
            : "Penalty amount charged when threshold is exceeded.",
          placeholder: isId ? "10.000.000" : "10.000",
        },
      ],
    },
  ];

  const [activeSection, setActiveSection] = React.useState<SectionId>("core");
  const selectedSection =
    sections.find((section) => section.id === activeSection) ?? sections[0];

  const markSavedSoon = () => {
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }
    setSaveState("editing");
    saveTimerRef.current = window.setTimeout(() => {
      setSaveState("saved");
    }, 450);
  };

  const handleFormChange = (next: FinancialFormState) => {
    markSavedSoon();
    onFormChange(next);
  };

  React.useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const isFilled = (fieldKey: keyof FinancialInput) => form[fieldKey] !== "";

  const applyVariableSpendToPercent = () => {
    const variableSpend = Number(parseDotNumber(variableSpendDraft) || 0);
    const revenue = Number(form.monthlyRevenue || 0);
    if (revenue <= 0 || variableSpend < 0) return;
    const pct = Math.max(0, Math.min(100, (variableSpend / revenue) * 100));
    handleFormChange({ ...form, variableCostPercentage: Number(pct.toFixed(1)) });
  };

  return (
    <div className="flex flex-col">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-fraunces text-[30px] font-light tracking-tight text-ink dark:text-frost">
            {isId ? "Kontrol Finansial" : "Financial Controls"}
          </h2>
          <p className="font-sans text-[15px] text-ink/60 dark:text-frost/60 mt-2 leading-relaxed max-w-3xl">
            {isId
              ? "Pilih satu bagian dan semua input langsung terlihat."
              : "Pick one section and all inputs are visible immediately."}
          </p>
        </div>
        <span
          className={`text-[13px] font-sans ${
            saveState === "saved"
              ? "text-steel dark:text-steel-bright"
              : "text-scarlet dark:text-scarlet-bright"
          }`}
        >
          {saveState === "saved"
            ? t("sim.status.saved")
            : t("sim.status.saving")}
        </span>
      </header>

      <div id="fin-sidebar-fields" className="space-y-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {sections.map((section) => {
            const filled = section.fields.filter((field) => isFilled(field.fieldKey)).length;
            const isActive = section.id === activeSection;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`text-left rounded-xl border px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? "border-scarlet/40 bg-scarlet/6 dark:bg-scarlet/8"
                    : "border-ink/8 dark:border-frost/8 bg-white/35 dark:bg-white/2 hover:border-ink/20 dark:hover:border-frost/20"
                }`}
              >
                <p className="font-sans text-[13px] font-medium text-ink dark:text-frost">
                  {section.label}
                </p>
                <p className="font-sans text-[12px] text-ink/45 dark:text-frost/45 mt-1">
                  {filled}/{section.fields.length} {t("sim.status.filled")}
                </p>
              </button>
            );
          })}
        </div>

        <section className="rounded-2xl border border-ink/8 dark:border-frost/8 bg-white/45 dark:bg-white/2 p-6">
          <div className="mb-5">
            <p className="font-sans text-[15px] font-medium text-scarlet dark:text-scarlet-bright">
              {selectedSection.label}
            </p>
            <p className="font-sans text-[14px] text-ink/55 dark:text-frost/55 mt-1">
              {selectedSection.helper}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {selectedSection.fields.map((field) => (
              <div key={field.fieldKey}>
                {field.type === "range" ? (
                  <RangeField
                    label={field.label}
                    fieldKey={field.fieldKey}
                    form={form}
                    onChange={handleFormChange}
                    min={field.min}
                    max={field.max}
                    suffix={field.suffix}
                    info={field.info}
                    onBlur={() => setSaveState("saved")}
                    invalid={Boolean(invalidFieldKeys?.has(field.fieldKey))}
                    errorText={
                      invalidFieldKeys?.has(field.fieldKey)
                        ? t("validation.fieldRequired")
                        : undefined
                    }
                  />
                ) : (
                  <NumberField
                    label={field.label}
                    fieldKey={field.fieldKey}
                    form={form}
                    onChange={handleFormChange}
                    suffix={field.suffix}
                    info={field.info}
                    placeholder={field.placeholder}
                    onBlur={() => setSaveState("saved")}
                    invalid={Boolean(invalidFieldKeys?.has(field.fieldKey))}
                    errorText={
                      invalidFieldKeys?.has(field.fieldKey)
                        ? t("validation.fieldRequired")
                        : undefined
                    }
                  />
                )}

                {field.fieldKey === "variableCostPercentage" && (
                  <div className="mb-4 mt-1 px-1">
                    <p className="font-sans text-[13px] text-ink/60 dark:text-frost/60 mb-2">
                      {isId
                        ? "Isi biaya variabel bulanan jika belum tahu persentasenya."
                        : "Enter monthly variable spend if you do not know the percentage."}
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={variableSpendDraft}
                        onChange={(e) => {
                          const inputEl = e.target;
                          const cursor = inputEl.selectionStart ?? inputEl.value.length;
                          const digitsBeforeCursor = (
                            inputEl.value.slice(0, cursor).match(/\d/g) || []
                          ).length;
                          const num = Number(parseDotNumber(inputEl.value) || 0);
                          setVariableSpendDraft(num > 0 ? formatWithDots(num) : "");

                          requestAnimationFrame(() => {
                            if (document.activeElement !== inputEl) {
                              return;
                            }
                            const formatted = num > 0 ? formatWithDots(num) : "";
                            preserveCaretAfterFormat(
                              inputEl,
                              digitsBeforeCursor,
                              formatted,
                            );
                          });
                        }}
                        placeholder={isId ? "12.000.000" : "12.000"}
                        className="h-10 flex-1 rounded-[8px] px-3 font-sans text-[15px] bg-white/70 dark:bg-white/4 border border-ink/12 dark:border-frost/12 outline-none"
                      />
                      <button
                        type="button"
                        onClick={applyVariableSpendToPercent}
                        className="h-10 px-3 rounded-[8px] border border-ink/15 dark:border-frost/15 font-sans text-[13px] text-ink/70 dark:text-frost/70"
                      >
                        {isId ? "Hitung %" : "Calc %"}
                      </button>
                    </div>
                    <p className="font-sans text-[12px] text-ink/45 dark:text-frost/45 mt-2">
                      {isId
                        ? `Rumus: biaya variabel / pendapatan. Nilai sekarang ${Number(form.variableCostPercentage || 0).toFixed(1)}%.`
                        : `Formula: variable spend / revenue. Current value ${Number(form.variableCostPercentage || 0).toFixed(1)}%.`}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

import React from "react";
import { Input } from "../../components/ui/Input";
import { useLocale } from "../../hooks/useLocale";
import type { DelayInput } from "../../lib/engine/types";
import type { DelayFieldProps, DelaySidebarProps } from "./types";

type SectionId = "scope" | "friction" | "buffer";

const formatWithDots = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
    Math.round(value),
  );

const parseDotNumber = (value: string) => {
  const normalized = value.replace(/[^\d]/g, "");
  if (!normalized) return 0;
  return Number(normalized);
};

function NumberField({
  label,
  fieldKey,
  form,
  onChange,
  suffix,
  info,
  placeholder,
  onBlur,
}: DelayFieldProps & { onBlur?: () => void }) {
  const raw = Number(form[fieldKey] || 0);
  const display = raw > 0 ? formatWithDots(raw) : "";

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
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...form, [fieldKey]: parseDotNumber(e.target.value) });
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
}: DelayFieldProps & { onBlur?: () => void }) {
  return (
    <Input
      label={label}
      type="range"
      min={min}
      max={max}
      suffix={suffix}
      info={info}
      value={Number(form[fieldKey] || 0)}
      onBlur={onBlur}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        onChange({ ...form, [fieldKey]: Number.isFinite(val) ? val : 0 });
      }}
    />
  );
}

interface SectionField {
  label: string;
  fieldKey: keyof DelayInput;
  type?: "range";
  min?: number;
  max?: number;
  suffix?: string;
  info: string;
  placeholder?: string;
}

type SaveState = "saved" | "editing";

export function DelaySidebar({ form, onFormChange }: DelaySidebarProps) {
  const { language, t } = useLocale();
  const isId = language === "id";
  const [saveState, setSaveState] = React.useState<SaveState>("saved");
  const saveTimerRef = React.useRef<number | null>(null);

  const sections: {
    id: SectionId;
    label: string;
    helper: string;
    fields: SectionField[];
  }[] = [
    {
      id: "scope",
      label: isId ? "Cakupan" : "Scope",
      helper: isId
        ? "Data dasar durasi dan kapasitas tim."
        : "Core project duration and team capacity.",
      fields: [
        {
          label: isId ? "Durasi Target (hari)" : "Target Duration (days)",
          fieldKey: "targetDurationDays",
          info: isId
            ? "Jumlah hari ideal tanpa gangguan untuk menyelesaikan proyek."
            : "Ideal uninterrupted number of days to complete the project.",
          placeholder: "90",
        },
        {
          label: isId ? "Ukuran Tim" : "Team Size",
          fieldKey: "teamSize",
          info: isId
            ? "Jumlah total anggota aktif yang mengerjakan proyek."
            : "Total number of active members working on the project.",
          placeholder: "8",
        },
        {
          label: isId ? "Skor Kompleksitas (1-5)" : "Complexity Score (1-5)",
          fieldKey: "complexityScore",
          type: "range",
          min: 1,
          max: 5,
          info: isId
            ? "1 berarti tugas rutin, 5 berarti integrasi baru yang kompleks."
            : "1 is routine, 5 is a highly complex new integration.",
        },
      ],
    },
    {
      id: "friction",
      label: isId ? "Friksi" : "Friction",
      helper: isId
        ? "Faktor eksternal yang sering menambah delay."
        : "External factors that usually add delay risk.",
      fields: [
        {
          label: isId ? "Variansi Supplier (hari)" : "Supplier Variance (days)",
          fieldKey: "supplierLeadTimeVarianceDays",
          info: isId
            ? "Perkiraan keterlambatan maksimum dari supplier."
            : "Expected maximum delay from suppliers or materials.",
          placeholder: "14",
        },
        {
          label: isId ? "Dependensi Eksternal" : "External Dependencies",
          fieldKey: "externalDependenciesCount",
          info: isId
            ? "Jumlah tim atau sistem lain yang harus selesai dulu."
            : "How many external teams/systems must deliver first.",
          placeholder: "3",
        },
        {
          label: isId ? "Riwayat Tingkat Delay" : "Historical Delay Rate",
          fieldKey: "historicalDelayRate",
          type: "range",
          min: 0,
          max: 100,
          suffix: "%",
          info: isId
            ? "Persentase proyek serupa yang melewati deadline."
            : "Percentage of similar past projects delayed.",
        },
      ],
    },
    {
      id: "buffer",
      label: isId ? "Buffer" : "Buffer",
      helper: isId
        ? "Cadangan waktu untuk menyerap keterlambatan."
        : "Time reserve available to absorb delays.",
      fields: [
        {
          label: isId ? "Sisa Hari Buffer" : "Buffer Days Remaining",
          fieldKey: "bufferDaysRemaining",
          info: isId
            ? "Cadangan hari sebelum jalur kritis ikut terlambat."
            : "Slack days available before critical path slips.",
          placeholder: "10",
        },
      ],
    },
  ];

  const [activeSection, setActiveSection] = React.useState<SectionId>("scope");
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

  const handleFormChange = (next: DelayInput) => {
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

  const isFilled = (fieldKey: keyof DelayInput) => Number(form[fieldKey] || 0) > 0;

  return (
    <div className="flex flex-col">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-fraunces text-[30px] font-light tracking-tight text-ink dark:text-frost">
            {isId ? "Kontrol Proyek" : "Project Controls"}
          </h2>
          <p className="font-sans text-[15px] text-ink/60 dark:text-frost/60 mt-2 leading-relaxed max-w-3xl">
            {isId
              ? "Semua input di bagian aktif langsung terlihat tanpa klik Next."
              : "All inputs in the active section are visible immediately."}
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

      <div id="delay-sidebar-fields" className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
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
                    : "border-ink/8 dark:border-frost/8 bg-white/35 dark:bg-white/[0.02] hover:border-ink/20 dark:hover:border-frost/20"
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

        <section className="rounded-2xl border border-ink/8 dark:border-frost/8 bg-white/45 dark:bg-white/[0.02] p-6">
          <div className="mb-5">
            <p className="font-sans text-[15px] font-medium text-scarlet dark:text-scarlet-bright">
              {selectedSection.label}
            </p>
            <p className="font-sans text-[14px] text-ink/55 dark:text-frost/55 mt-1">
              {selectedSection.helper}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {selectedSection.fields.map((field) =>
              field.type === "range" ? (
                <RangeField
                  key={field.fieldKey}
                  label={field.label}
                  fieldKey={field.fieldKey}
                  form={form}
                  onChange={handleFormChange}
                  min={field.min}
                  max={field.max}
                  suffix={field.suffix}
                  info={field.info}
                  onBlur={() => setSaveState("saved")}
                />
              ) : (
                <NumberField
                  key={field.fieldKey}
                  label={field.label}
                  fieldKey={field.fieldKey}
                  form={form}
                  onChange={handleFormChange}
                  suffix={field.suffix}
                  info={field.info}
                  placeholder={field.placeholder}
                  onBlur={() => setSaveState("saved")}
                />
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

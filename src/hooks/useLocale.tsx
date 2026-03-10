import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "id";
export type Currency = "USD" | "IDR";

interface LocaleContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
  convertAmount: (amount: number, from: Currency, to: Currency) => number;
  usdToIdrRate: number;
  fxLastUpdatedAt: string | null;
}

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

const FX_RATE_STORAGE_KEY = "novaris-usd-idr-rate";
const FX_RATE_UPDATED_AT_STORAGE_KEY = "novaris-usd-idr-updated-at";
const DEFAULT_USD_TO_IDR_RATE = 16000;

// Define basic dictionaries (we can expand this later or move to a separate file)
const dict: Record<Language, Record<string, string>> = {
  en: {
    "lang.en": "English",
    "lang.id": "Bahasa Indonesia",
    "currency.usd": "USD",
    "currency.idr": "IDR",
    "nav.financial": "Financial Risk",
    "nav.delay": "Delay Risk",
    "nav.workspace": "Decision Workspace",
    "nav.decisionCenter": "Decision Center",
    "nav.home": "Home",
    "nav.platform": "Platform",
    "nav.solutions": "Solutions",
    "nav.pricing": "Pricing",
    "nav.about": "About",
    "nav.back": "← Back to Home",
    "nav.language": "Language",
    "nav.currency": "Currency",
    "nav.fx": "FX: 1 USD =",
    "nav.logoAlt": "Novaris Logo",
    "nav.toggleTheme": "Toggle dark mode",
    "nav.lightMode": "Switch to light mode",
    "nav.darkMode": "Switch to dark mode",
    "sim.controls": "Simulation Controls",
    "sim.controls.show": "Show controls",
    "sim.controls.hide": "Hide controls",
    "sim.impact.survival": "Survival",
    "sim.impact.runway": "Runway",
    "sim.impact.delay": "Delay Risk",
    "sim.impact.action": "Next Move",
    "sim.impact.cashRisk": "Cash at Risk",
    "sim.impact.targetDuration": "Target Duration",
    "sim.impact.potentialDelay": "Potential Delay",
    "sim.impact.monitoring": "Delay Monitoring",
    "sim.monitoring.inactive": "Inactive",
    "sim.monitoring.watch": "Watch",
    "sim.monitoring.active": "Active",
    "sim.monitoring.critical": "Critical",
    "sim.unit.days": "days",
    "sim.unit.mo": "mo",
    "sim.unit.months": "months",
    "workspace.mode.integrated": "Integrated",
    "workspace.mode.financial": "Financial",
    "workspace.mode.delay": "Delay",
    "workspace.integrated.title": "Integrated Decision Board",
    "workspace.integrated.subtitle": "Model delay and financial risk together to see the cost of inaction.",
    "workspace.integrated.metrics.inaction": "Cost of Inaction",
    "workspace.integrated.metrics.runway": "Runway Outlook",
    "workspace.integrated.metrics.delay": "Delay Probability",
    "workspace.integrated.horizon.30": "30 days",
    "workspace.integrated.horizon.60": "60 days",
    "workspace.integrated.horizon.90": "90 days",
    "workspace.integrated.focus.both": "Both",
    "workspace.integrated.focus.cash": "Cash",
    "workspace.integrated.focus.timeline": "Timeline",
    "workspace.integrated.stepline": "Situation -> Risk -> Action -> Impact",
    "workspace.integrated.readyPrompt": "Fill the 4 core inputs to start analysis.",
    "workspace.integrated.breakdown": "Need detail?",
    "workspace.integrated.actionTitle": "What to do this week",
    "workspace.integrated.action.high": "Protect cash now: cut non-essential burn and add project buffer this week.",
    "workspace.integrated.action.medium": "Stabilize operations: reduce supplier variance and review debt obligations.",
    "workspace.integrated.action.low": "Keep current plan, monitor weekly, and preserve cash discipline.",
    "workspace.integrated.formula": "Inaction cost uses delay probability, daily burn, opportunity cost, and penalties.",
    "workspace.integrated.advanced.show": "Show advanced inputs",
    "workspace.integrated.advanced.hide": "Hide advanced inputs",
    "workspace.integrated.status.running": "Running integrated simulation...",
    "validation.required": "Required fields missing",
    "validation.missing": "missing",
    "validation.complete": "Complete these fields to run simulation.",
    "validation.apiError": "Simulation failed. Please review inputs and try again.",
    "validation.fieldRequired": "This field is required.",
    "sim.impact.pending": "Adjust inputs to generate insights",
    "sim.status.saved": "Saved",
    "sim.status.saving": "Saving...",
    "sim.status.filled": "filled",
    "tutorial.skip": "Skip",
    "tutorial.next": "Next",
    "tutorial.start": "Let's go",
    "financial.weeklyAction": "What to do this week",
    "financial.weeklyAction.high": "Reduce short-term debt pressure and freeze non-essential spend.",
    "financial.weeklyAction.medium": "Protect runway by increasing buffer and reducing variable costs.",
    "financial.weeklyAction.low": "Maintain momentum and review cash assumptions weekly.",
    "delay.weeklyAction": "What to do this week",
    "delay.weeklyAction.high": "Resolve the top bottleneck and secure a backup supplier immediately.",
    "delay.weeklyAction.medium": "Add timeline buffer to high-risk phases and align dependencies.",
    "delay.weeklyAction.low": "Maintain current plan and monitor supplier variance closely.",
  },
  id: {
    "lang.en": "English",
    "lang.id": "Bahasa Indonesia",
    "currency.usd": "USD",
    "currency.idr": "IDR",
    "nav.financial": "Risiko Finansial",
    "nav.delay": "Risiko Penundaan",
    "nav.workspace": "Ruang Keputusan",
    "nav.decisionCenter": "Pusat Keputusan",
    "nav.home": "Beranda",
    "nav.platform": "Platform",
    "nav.solutions": "Solusi",
    "nav.pricing": "Harga",
    "nav.about": "Tentang",
    "nav.back": "← Kembali ke Beranda",
    "nav.language": "Bahasa",
    "nav.currency": "Mata Uang",
    "nav.fx": "Kurs: 1 USD =",
    "nav.logoAlt": "Logo Novaris",
    "nav.toggleTheme": "Ubah mode gelap",
    "nav.lightMode": "Beralih ke mode terang",
    "nav.darkMode": "Beralih ke mode gelap",
    "sim.controls": "Kontrol Simulasi",
    "sim.controls.show": "Tampilkan kontrol",
    "sim.controls.hide": "Sembunyikan kontrol",
    "sim.impact.survival": "Peluang Bertahan",
    "sim.impact.runway": "Runway",
    "sim.impact.delay": "Risiko Delay",
    "sim.impact.action": "Aksi Berikutnya",
    "sim.impact.cashRisk": "Kas Berisiko",
    "sim.impact.targetDuration": "Durasi Target",
    "sim.impact.potentialDelay": "Delay Potensial",
    "sim.impact.monitoring": "Pemantauan Delay",
    "sim.monitoring.inactive": "Tidak Aktif",
    "sim.monitoring.watch": "Waspada",
    "sim.monitoring.active": "Aktif",
    "sim.monitoring.critical": "Kritis",
    "sim.unit.days": "hari",
    "sim.unit.mo": "bln",
    "sim.unit.months": "bulan",
    "workspace.mode.integrated": "Terintegrasi",
    "workspace.mode.financial": "Finansial",
    "workspace.mode.delay": "Delay",
    "workspace.integrated.title": "Papan Keputusan Terintegrasi",
    "workspace.integrated.subtitle": "Modelkan risiko delay dan finansial bersama untuk melihat biaya jika tidak bertindak.",
    "workspace.integrated.metrics.inaction": "Biaya Tidak Bertindak",
    "workspace.integrated.metrics.runway": "Proyeksi Runway",
    "workspace.integrated.metrics.delay": "Probabilitas Delay",
    "workspace.integrated.horizon.30": "30 hari",
    "workspace.integrated.horizon.60": "60 hari",
    "workspace.integrated.horizon.90": "90 hari",
    "workspace.integrated.focus.both": "Keduanya",
    "workspace.integrated.focus.cash": "Kas",
    "workspace.integrated.focus.timeline": "Timeline",
    "workspace.integrated.stepline": "Situasi -> Risiko -> Aksi -> Dampak",
    "workspace.integrated.readyPrompt": "Isi 4 input utama untuk mulai analisis.",
    "workspace.integrated.breakdown": "Butuh rincian?",
    "workspace.integrated.actionTitle": "Apa yang harus dilakukan minggu ini",
    "workspace.integrated.action.high": "Lindungi kas sekarang: kurangi biaya non-prioritas dan tambah buffer proyek minggu ini.",
    "workspace.integrated.action.medium": "Stabilkan operasi: turunkan variansi supplier dan tinjau kewajiban utang.",
    "workspace.integrated.action.low": "Pertahankan rencana saat ini, pantau mingguan, dan jaga disiplin kas.",
    "workspace.integrated.formula": "Biaya tidak bertindak memakai probabilitas delay, biaya harian, biaya peluang, dan penalti.",
    "workspace.integrated.advanced.show": "Tampilkan input lanjutan",
    "workspace.integrated.advanced.hide": "Sembunyikan input lanjutan",
    "workspace.integrated.status.running": "Menghitung simulasi terintegrasi...",
    "validation.required": "Input wajib belum lengkap",
    "validation.missing": "kurang",
    "validation.complete": "Lengkapi input ini untuk menjalankan simulasi.",
    "validation.apiError": "Simulasi gagal. Periksa input lalu coba lagi.",
    "validation.fieldRequired": "Input ini wajib diisi.",
    "sim.impact.pending": "Atur input untuk mendapatkan insight",
    "sim.status.saved": "Tersimpan",
    "sim.status.saving": "Menyimpan...",
    "sim.status.filled": "terisi",
    "tutorial.skip": "Lewati",
    "tutorial.next": "Lanjut",
    "tutorial.start": "Mulai",
    "financial.weeklyAction": "Apa yang harus dilakukan minggu ini",
    "financial.weeklyAction.high": "Kurangi tekanan utang jangka pendek dan hentikan pengeluaran non-prioritas.",
    "financial.weeklyAction.medium": "Lindungi runway dengan menambah buffer dan menurunkan biaya variabel.",
    "financial.weeklyAction.low": "Pertahankan momentum dan tinjau asumsi kas tiap minggu.",
    "delay.weeklyAction": "Apa yang harus dilakukan minggu ini",
    "delay.weeklyAction.high": "Selesaikan bottleneck utama dan siapkan pemasok cadangan sekarang.",
    "delay.weeklyAction.medium": "Tambahkan buffer di fase berisiko tinggi dan rapikan dependensi.",
    "delay.weeklyAction.low": "Pertahankan rencana saat ini dan pantau variasi pemasok.",
  },
};

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("novaris-lang") as Language;
    return stored === "id" ? "id" : "en";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const stored = localStorage.getItem("novaris-currency") as Currency;
    return stored === "IDR" ? "IDR" : "USD";
  });

  const [usdToIdrRate, setUsdToIdrRate] = useState<number>(() => {
    const stored = Number(localStorage.getItem(FX_RATE_STORAGE_KEY));
    return Number.isFinite(stored) && stored > 0
      ? stored
      : DEFAULT_USD_TO_IDR_RATE;
  });

  const [fxLastUpdatedAt, setFxLastUpdatedAt] = useState<string | null>(() => {
    return localStorage.getItem(FX_RATE_UPDATED_AT_STORAGE_KEY);
  });

  // Handle localStorage sync manually if needed, or stick to effect
  React.useEffect(() => {
    localStorage.setItem("novaris-lang", language);
    document.documentElement.lang = language === "id" ? "id" : "en";
  }, [language]);

  React.useEffect(() => {
    localStorage.setItem("novaris-currency", currency);
  }, [currency]);

  React.useEffect(() => {
    let cancelled = false;

    const fetchRate = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD", {
          method: "GET",
        });
        if (!res.ok) {
          return;
        }
        const payload = await res.json();
        const rate = Number(payload?.rates?.IDR);
        if (!Number.isFinite(rate) || rate <= 0 || cancelled) {
          return;
        }
        const updatedAt = new Date().toISOString();
        setUsdToIdrRate(rate);
        setFxLastUpdatedAt(updatedAt);
        localStorage.setItem(FX_RATE_STORAGE_KEY, String(rate));
        localStorage.setItem(FX_RATE_UPDATED_AT_STORAGE_KEY, updatedAt);
      } catch {
        // keep cached rate silently
      }
    };

    fetchRate();
    const interval = setInterval(fetchRate, 1000 * 60 * 10);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const t = (key: string): string => {
    // Fallback to key if string not found
    return dict[language]?.[key] || dict["en"]?.[key] || key;
  };

  const formatCurrency = (amount: number): string => {
    if (!Number.isFinite(amount)) {
      return currency === "IDR" ? "Rp0" : "$0";
    }
    if (currency === "IDR") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const convertAmount = (
    amount: number,
    from: Currency,
    to: Currency,
  ): number => {
    if (!Number.isFinite(amount) || from === to) {
      return amount;
    }
    if (from === "USD" && to === "IDR") {
      return amount * usdToIdrRate;
    }
    if (from === "IDR" && to === "USD") {
      return amount / usdToIdrRate;
    }
    return amount;
  };

  return (
    <LocaleContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        formatCurrency,
        convertAmount,
        usdToIdrRate,
        fxLastUpdatedAt,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};

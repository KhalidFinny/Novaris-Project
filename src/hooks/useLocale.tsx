import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Language = "en" | "id";
export type Currency = "USD" | "IDR" | "SGD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CNY" | "MYR";

interface ExchangeRates {
  [key: string]: number;
}

interface LocaleContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatCurrency: (amount: number) => string;
  convertAmount: (amount: number, from: Currency, to: Currency) => number;
  exchangeRates: ExchangeRates;
  fxLastUpdatedAt: string | null;
  refreshExchangeRates: () => Promise<void>;
  isFxLoading: boolean;
}

const FX_RATES_STORAGE_KEY = "novaris-fx-rates";
const FX_RATE_UPDATED_AT_STORAGE_KEY = "novaris-fx-rates-updated-at";

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

// Base currency is USD
const DEFAULT_RATES: ExchangeRates = {
  USD: 1,
  IDR: 16000,
  SGD: 1.35,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150,
  AUD: 1.52,
  CAD: 1.36,
  CNY: 7.24,
  MYR: 4.75,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  IDR: "Rp",
  SGD: "S$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  CNY: "¥",
  MYR: "RM",
};

const CURRENCY_LOCALES: Record<Currency, string> = {
  USD: "en-US",
  IDR: "en-US", // Use international format
  SGD: "en-SG",
  EUR: "de-DE",
  GBP: "en-GB",
  JPY: "ja-JP",
  AUD: "en-AU",
  CAD: "en-CA",
  CNY: "zh-CN",
  MYR: "ms-MY",
};

// Translation dictionary
const dict: Record<Language, Record<string, string>> = {
  en: {
    // ... existing translations ...
    "lang.en": "English",
    "lang.id": "Bahasa Indonesia",
    "currency.usd": "USD",
    "currency.idr": "IDR",
    "currency.sgd": "SGD",
    "currency.eur": "EUR",
    "currency.gbp": "GBP",
    "currency.jpy": "JPY",
    "currency.aud": "AUD",
    "currency.cad": "CAD",
    "currency.cny": "CNY",
    "currency.myr": "MYR",
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
    "nav.fx": "FX Rate",
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
    // Narrative Template Translations
    "narrative.cash.critical.headline": "You are {days} days from a cash crisis.",
    "narrative.cash.critical.risk": "A delay of just 5 days would push you past the brink. Most businesses don't recover from this close to zero.",
    "narrative.cash.warning.headline": "Your runway is shorter than your project timeline.",
    "narrative.cash.warning.risk": "There's a gap between when you need cash and when you'll get it. Projects often slip by 10-15%.",
    "narrative.cash.monitor.headline": "Cash is tight but manageable with strict discipline.",
    "narrative.cash.monitor.risk": "One unexpected expense or delay could shift you into critical territory within days.",
    "narrative.cash.safe.headline": "Your cash position is stable with room to breathe.",
    "narrative.cash.safe.risk": "Complacency is the hidden risk. Stable cash can lead to delayed decisions when conditions change.",
    "narrative.revenue.deficit.headline": "You're falling behind your revenue target.",
    "narrative.revenue.deficit.risk": "This gap compounds monthly. Three months of deficits becomes a structural problem that's hard to reverse.",
    "narrative.revenue.structural.headline": "Revenue shortfall is becoming a structural problem.",
    "narrative.revenue.structural.risk": "At this deficit level, you're burning reserves to cover basic operations. The math gets worse each month.",
    "narrative.revenue.trending.headline": "Revenue is close to target but trending down.",
    "narrative.revenue.trending.risk": "The slope matters more than the absolute number. A 5% monthly decline creates a crisis in 6 months.",
    "narrative.revenue.concentration.headline": "One client represents a concentration risk.",
    "narrative.revenue.concentration.risk": "Losing this client would create an immediate cash crisis. Diversification takes months, not weeks.",
    "narrative.revenue.seasonal.headline": "Seasonal downturn is deeper than expected.",
    "narrative.revenue.seasonal.risk": "If this isn't truly seasonal, you may have misdiagnosed a demand problem as timing.",
    "narrative.project.delayed.headline": "Payment blocked by project delay.",
    "narrative.project.delayed.risk": "Every week of delay burns cash you don't have. The delay cost often exceeds the project value.",
    "narrative.project.consumed.headline": "Buffer days already consumed by early delays.",
    "narrative.project.consumed.risk": "You've used your cushion in the first phase. Later phases typically face more unknowns.",
    "narrative.project.cascading.headline": "Team distraction from delays threatens other projects.",
    "narrative.project.cascading.risk": "Crisis management on one project often causes delays on three others. The cascade is invisible until it's severe.",
    "narrative.project.shock.headline": "Small shock could deplete remaining buffer.",
    "narrative.project.shock.risk": "With {days} days buffer, a single sick day or supplier delay pushes you past deadline.",
    "narrative.compound.bleeding.headline": "Cash bleeding from multiple directions simultaneously.",
    "narrative.compound.bleeding.risk": "Revenue gaps and project delays together create exponential risk. The math isn't additive—it's multiplicative.",
    "narrative.compound.bomb.headline": "Cash pressure + revenue gap = time bomb.",
    "narrative.compound.bomb.risk": "Neither problem alone would be fatal. Together, they leave no room for error on any front.",
    "narrative.compound.spiral.headline": "Operations and revenue are in a death spiral.",
    "narrative.compound.spiral.risk": "Project delays reduce revenue. Revenue gaps strain delivery. Each makes the other worse.",
    "narrative.compound.window.headline": "Window for easy fixes is closing rapidly.",
    "narrative.compound.window.risk": "In 30 days, the same actions will require 3x the effort. Early intervention has 10x leverage.",
    "narrative.opportunity.buffer.headline": "Buffer available—use it deliberately or lose it.",
    "narrative.opportunity.buffer.risk": "Cash cushion creates temptation to delay hard decisions. Most businesses squander their buffer on avoidable problems.",
    "narrative.opportunity.diversification.headline": "Strong position enables diversification moves.",
    "narrative.opportunity.diversification.risk": "Don't mistake good timing for permanent safety. Market conditions shift without warning.",
    "narrative.opportunity.flexibility.headline": "Resilience proven—you've earned strategic flexibility.",
    "narrative.opportunity.flexibility.risk": "Past success doesn't guarantee future results. Market conditions shift. Today's resilience can become tomorrow's rigidity.",
    "narrative.recommendation.cash": "Secure a line of credit before you need it. Cut discretionary spend by 30% this week.",
    "narrative.recommendation.revenue": "Focus on collections before new sales. A dollar collected today is worth two in pipeline.",
    "narrative.recommendation.project": "Communicate the delay timeline to stakeholders now. Buy time through transparency.",
    "narrative.recommendation.compound": "Triage ruthlessly. Pause all non-critical projects to preserve cash for core operations.",
    "narrative.recommendation.opportunity": "Use the cushion to make one strategic bet. Don't split resources across too many initiatives.",
    // Sidebar Labels
    "sidebar.title": "Decision Inputs",
    "sidebar.essentials": "Essential Metrics",
    "sidebar.delayRisk": "Delay Risk (Optional)",
    "sidebar.cashInBank": "Cash in Bank",
    "sidebar.monthlyBills": "Monthly Bills",
    "sidebar.monthlyRevenue": "Monthly Revenue",
    "sidebar.monthlyRevenueTarget": "Revenue Target",
    "sidebar.biggestClient": "Biggest Client %",
    "sidebar.projectTargetDays": "Project Target Days",
    "sidebar.paymentAtRisk": "Payment at Risk",
    "sidebar.teamSize": "Team Size",
    "sidebar.bufferDays": "Buffer Days",
    "sidebar.confirm": "Confirm Data",
    "sidebar.clear": "Clear Data",
    "sidebar.currencySelector": "Display Currency",
    "sidebar.exchangeRate": "Exchange Rate",
  },
  id: {
    // ... existing translations ...
    "lang.en": "English",
    "lang.id": "Bahasa Indonesia",
    "currency.usd": "USD",
    "currency.idr": "IDR",
    "currency.sgd": "SGD",
    "currency.eur": "EUR",
    "currency.gbp": "GBP",
    "currency.jpy": "JPY",
    "currency.aud": "AUD",
    "currency.cad": "CAD",
    "currency.cny": "CNY",
    "currency.myr": "MYR",
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
    "nav.fx": "Kurs",
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
    // Narrative Template Translations
    "narrative.cash.critical.headline": "Anda {days} hari dari krisis kas.",
    "narrative.cash.critical.risk": "Penundaan hanya 5 hari akan mendorong Anda melewati batas. Sebagian besar bisnis tidak pulih dari posisi se Dekat ini dengan nol.",
    "narrative.cash.warning.headline": "Runway Anda lebih pendek dari timeline proyek.",
    "narrative.cash.warning.risk": "Ada celah antara kapan Anda butuh kas dan kapan Anda akan mendapatkannya. Proyek sering tertunda 10-15%.",
    "narrative.cash.monitor.headline": "Kas ketat tapi dapat dikelola dengan disiplin ketat.",
    "narrative.cash.monitor.risk": "Satu pengeluaran tak terduga atau penundaan bisa menggeser Anda ke wilayah kritis dalam beberapa hari.",
    "narrative.cash.safe.headline": "Posisi kas Anda stabil dengan ruang untuk bernapas.",
    "narrative.cash.safe.risk": "Kemudahan adalah risiko tersembunyi. Kas stabil bisa menyebabkan penundaan keputusan ketika kondisi berubah.",
    "narrative.revenue.deficit.headline": "Anda tertinggal dari target pendapatan.",
    "narrative.revenue.deficit.risk": "Celah ini bertambah setiap bulan. Tiga bulan defisit menjadi masalah struktural yang sulik dibalikkan.",
    "narrative.revenue.structural.headline": "Kekurangan pendapatan menjadi masalah struktural.",
    "narrative.revenue.structural.risk": "Pada tingkat defisit ini, Anda membakar cadangan untuk menutupi operasi dasar. Matematika semakin buruk setiap bulan.",
    "narrative.revenue.trending.headline": "Pendapatan mendekati target tapi trend menurun.",
    "narrative.revenue.trending.risk": "Kemiringan lebih penting dari angka absolut. Penurunan 5% per bulan menciptakan krisis dalam 6 bulan.",
    "narrative.revenue.concentration.headline": "Satu klien mewakili risiko konsentrasi.",
    "narrative.revenue.concentration.risk": "Kehilangan klien ini akan menciptakan krisis kas segera. Diversifikasi butuh berbulan-bulan, bukan berminggu-minggu.",
    "narrative.revenue.seasonal.headline": "Penurunan musiman lebih dalam dari yang diharapkan.",
    "narrative.revenue.seasonal.risk": "Jika ini bukan benar-benar musiman, Anda mungkin salah diagnosis masalah permintaan sebagai masalah waktu.",
    "narrative.project.delayed.headline": "Pembayaran terblokir oleh penundaan proyek.",
    "narrative.project.delayed.risk": "Setiap minggu penundaan membakar kas yang tidak Anda miliki. Biaya penundaan sering melebihi nilai proyek.",
    "narrative.project.consumed.headline": "Hari buffer sudah habis oleh penundaan awal.",
    "narrative.project.consumed.risk": "Anda telah menggunakan bantalan di fase pertama. Fase selanjutnya biasanya menghadapi lebih banyak hal tak diketahui.",
    "narrative.project.cascading.headline": "Gangguan tim dari penundaan mengancam proyek lain.",
    "narrative.project.cascading.risk": "Manajemen krisis di satu proyek sering menyebabkan penundaan di tiga proyek lain. Kaskade tidak terlihat sampai parah.",
    "narrative.project.shock.headline": "Guncangan kecil bisa menghabiskan buffer tersisa.",
    "narrative.project.shock.risk": "Dengan {days} hari buffer, satu hari sakit atau penundaan pemasok mendorong Anda melewati tenggat.",
    "narrative.compound.bleeding.headline": "Kas berdarah dari berbagai arah secara bersamaan.",
    "narrative.compound.bleeding.risk": "Celah pendapatan dan penundaan proyek bersama menciptakan risiko eksponensial. Matematikanya tidak additive—multiplikatif.",
    "narrative.compound.bomb.headline": "Tekanan kas + celah pendapatan = bom waktu.",
    "narrative.compound.bomb.risk": "Tidak ada masalah sendiri yang fatal. Bersama, mereka tidak meninggalkan ruang untuk kesalahan di front mana pun.",
    "narrative.compound.spiral.headline": "Operasi dan pendapatan dalam spiral kematian.",
    "narrative.compound.spiral.risk": "Penundaan proyek mengurangi pendapatan. Celah pendapatan memberi tekanan pada pengiriman. Masing-masing memperburuk yang lain.",
    "narrative.compound.window.headline": "Jendela untuk perbaikan mudah menutup dengan cepat.",
    "narrative.compound.window.risk": "Dalam 30 hari, tindakan yang sama akan membutuhkan 3x usaha. Intervensi awal memiliki leverage 10x.",
    "narrative.opportunity.buffer.headline": "Buffer tersedia—gunakan dengan sengaja atau hilangkan.",
    "narrative.opportunity.buffer.risk": "Bantalan kas menciptakan godaan untuk menunda keputusan sulit. Sebagian besar bisnis menyia-nyiakan buffer mereka pada masalah yang bisa dihindari.",
    "narrative.opportunity.diversification.headline": "Posisi kuat memungkinkan gerakan diversifikasi.",
    "narrative.opportunity.diversification.risk": "Jangan salah mengira waktu yang baik untuk keselamatan permanen. Kondisi pasar berubah tanpa peringatan.",
    "narrative.opportunity.flexibility.headline": "Ketahanan terbukti—Anda telah memperoleh fleksibilitas strategis.",
    "narrative.opportunity.flexibility.risk": "Kesuksesan masa lalu tidak menjamin hasil masa depan. Kondisi pasar bergeser. Ketahanan hari ini bisa menjadi rigiditas besok.",
    "narrative.recommendation.cash": "Amankan jalur kredit sebelum Anda membutuhkannya. Potong pengeluaran diskresioner 30% minggu ini.",
    "narrative.recommendation.revenue": "Fokus pada koleksi sebelum penjualan baru. Dolar yang dikumpulkan hari ini bernilai dua di pipeline.",
    "narrative.recommendation.project": "Komunikasikan timeline penundaan ke stakeholder sekarang. Beli waktu melalui transparansi.",
    "narrative.recommendation.compound": "Triage tanpa ampun. Jeda semua proyek non-kritis untuk melestarikan kas untuk operasi inti.",
    "narrative.recommendation.opportunity": "Gunakan bantalan untuk membuat satu taruhan strategis. Jangan bagi sumber daya di terlalu banyak inisiatif.",
    // Sidebar Labels
    "sidebar.title": "Input Keputusan",
    "sidebar.essentials": "Metrik Esensial",
    "sidebar.delayRisk": "Risiko Delay (Opsional)",
    "sidebar.cashInBank": "Kas di Bank",
    "sidebar.monthlyBills": "Tagihan Bulanan",
    "sidebar.monthlyRevenue": "Pendapatan Bulanan",
    "sidebar.monthlyRevenueTarget": "Target Pendapatan",
    "sidebar.biggestClient": "% Klien Terbesar",
    "sidebar.projectTargetDays": "Target Hari Proyek",
    "sidebar.paymentAtRisk": "Pembayaran Berisiko",
    "sidebar.teamSize": "Ukuran Tim",
    "sidebar.bufferDays": "Hari Buffer",
    "sidebar.confirm": "Konfirmasi Data",
    "sidebar.clear": "Hapus Data",
    "sidebar.currencySelector": "Mata Uang Tampilan",
    "sidebar.exchangeRate": "Kurs",
  },
};

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("novaris-lang") as Language;
    return stored === "id" ? "id" : "en";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const stored = localStorage.getItem("novaris-currency") as Currency;
    return stored && DEFAULT_RATES[stored] ? stored : "USD";
  });

  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(() => {
    const stored = localStorage.getItem(FX_RATES_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_RATES, ...parsed };
      } catch {
        return DEFAULT_RATES;
      }
    }
    return DEFAULT_RATES;
  });

  const [fxLastUpdatedAt, setFxLastUpdatedAt] = useState<string | null>(() => {
    return localStorage.getItem(FX_RATE_UPDATED_AT_STORAGE_KEY);
  });
  const [isFxLoading, setIsFxLoading] = useState(false);

  const refreshExchangeRates = async () => {
    setIsFxLoading(true);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD", {
        cache: "no-store",
      });
      if (!res.ok) return;

      const payload = await res.json();
      const rates = payload?.rates;
      if (!rates) return;

      const newRates: ExchangeRates = { USD: 1 };

      (Object.keys(DEFAULT_RATES) as Currency[]).forEach((curr) => {
        if (curr === "USD") return;
        const rate = rates[curr];
        newRates[curr] = rate && Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_RATES[curr];
      });

      const updatedAt = new Date().toISOString();
      setExchangeRates(newRates);
      setFxLastUpdatedAt(updatedAt);
      localStorage.setItem(FX_RATES_STORAGE_KEY, JSON.stringify(newRates));
      localStorage.setItem(FX_RATE_UPDATED_AT_STORAGE_KEY, updatedAt);
    } catch {
      // Keep cached rates silently
    } finally {
      setIsFxLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("novaris-lang", language);
    document.documentElement.lang = language === "id" ? "id" : "en";
  }, [language]);

  useEffect(() => {
    localStorage.setItem("novaris-currency", currency);
  }, [currency]);

  useEffect(() => {
    let cancelled = false;

    const fetchRates = async () => {
      await refreshExchangeRates();
      if (cancelled) return;
    };

    fetchRates();
    const interval = setInterval(fetchRates, 1000 * 60 * 10); // 10 minutes
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = dict[language]?.[key] || dict["en"]?.[key] || key;
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(`{${paramKey}}`, "g"), String(value));
      });
    }
    
    return text;
  };

  const formatCurrency = (amount: number): string => {
    if (!Number.isFinite(amount)) {
      return `${CURRENCY_SYMBOLS[currency]}0`;
    }
    
    // Convert to display currency
    const convertedAmount = convertAmount(amount, "USD", currency);
    
    // Use international format (en-US) for consistency
    const formatted = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: currency === "JPY" ? 0 : 0,
    }).format(Math.round(convertedAmount));
    
    return `${CURRENCY_SYMBOLS[currency]}${formatted}`;
  };

  const convertAmount = (
    amount: number,
    from: Currency,
    to: Currency,
  ): number => {
    if (!Number.isFinite(amount) || from === to) {
      return amount;
    }
    
    // Convert to USD first, then to target
    const usdAmount = from === "USD" ? amount : amount / exchangeRates[from];
    return to === "USD" ? usdAmount : usdAmount * exchangeRates[to];
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
        exchangeRates,
        fxLastUpdatedAt,
        refreshExchangeRates,
        isFxLoading,
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

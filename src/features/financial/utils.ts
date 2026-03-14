/**
 * Utilites for DecisionStoryScene translations and labels
 */

export const getRiskDriverLabel = (value: string, language: string) => {
  if (language !== "id") return value;
  const map: Record<string, string> = {
    "High Debt Servicing Ratio": "Rasio pembayaran utang terlalu tinggi",
    "Significant Project Delay Burn": "Beban biaya delay proyek signifikan",
    "High Uncertainty in Business Data": "Data bisnis memiliki ketidakpastian tinggi",
    "Critically Low Cash Runway": "Runway kas berada di level kritis",
  };
  return map[value] ?? value;
};

export const getStoryHeadlineLabel = (value: string, language: string) => {
  if (language !== "id") return value;
  const map: Record<string, string> = {
    "Your business is in a stable growth phase.":
      "Bisnis Anda berada pada fase pertumbuhan yang stabil.",
    "Critical feedback loop detected.":
      "Terdeteksi feedback loop kritis.",
    "Low liquidity is stalling your agility.":
      "Likuiditas rendah menghambat kelincahan bisnis.",
    "Project delay has a high 'Revenue Displacement' cost.":
      "Keterlambatan proyek memiliki biaya perpindahan pendapatan yang tinggi.",
  };
  return map[value] ?? value;
};

export const getUnseenRiskLabel = (value: string, language: string) => {
  if (language !== "id") return value;
  const map: Record<string, string> = {
    "No critical hidden risks detected at current levels.":
      "Tidak ada risiko tersembunyi kritis pada level saat ini.",
    "Fragility cascade. Your cash reserve is too low to survive even a minor project delay.":
      "Kaskade kerapuhan. Cadangan kas terlalu rendah untuk bertahan bahkan pada delay proyek kecil.",
    "The 'Debt Anchor'. Your monthly obligations leave too little room for project variance.":
      "Efek jangkar utang. Kewajiban bulanan membuat ruang toleransi variasi proyek jadi terlalu sempit.",
    "Invisible Opportunity Cost. The resources stuck on this project are preventing future revenue.":
      "Biaya peluang tak terlihat. Sumber daya yang tertahan di proyek ini menahan potensi pendapatan berikutnya.",
  };
  return map[value] ?? value;
};

export const getImpactSummaryLabel = (value: string, language: string) => {
  if (language !== "id") return value;
  if (value.includes("total cash-out in month")) {
    return "Delay proyek ini bukan hanya menambah biaya, tetapi juga memicu kehabisan kas total pada bulan berjalan yang diproyeksikan.";
  }
  if (value.includes("14-day delay effectively consumes 3 months")) {
    return "Delay 14 hari secara efektif menghabiskan sekitar 3 bulan modal siap tumbuh Anda.";
  }
  if (value.includes("total cost of this delay is")) {
    return "Total biaya delay ini sangat signifikan dan langsung mengurangi peluang pertumbuhan bisnis.";
  }
  const map: Record<string, string> = {
    "Minor operational fluctuations are absorbed by your reserves.":
      "Fluktuasi operasional kecil masih bisa diserap oleh cadangan kas Anda.",
  };
  return map[value] ?? value;
};

export const getRecommendationLabel = (value: string, language: string) => {
  if (language !== "id") return value;
  const map: Record<string, string> = {
    "Maintain current buffer and proceed with caution.":
      "Pertahankan buffer saat ini dan lanjutkan dengan hati-hati.",
    "Secure bridge financing or drastically reduce fixed costs before proceeding.":
      "Amankan pembiayaan jembatan atau kurangi biaya tetap secara drastis sebelum melanjutkan.",
    "Focus on clearing high-interest debt to free up operational 'Shields'.":
      "Fokus melunasi utang berbunga tinggi untuk membebaskan ruang ketahanan operasional.",
    "Consider hiring temporary support to decouple the project from your core revenue stream.":
      "Pertimbangkan dukungan sementara agar proyek tidak mengganggu aliran pendapatan inti.",
  };
  return map[value] ?? value;
};

export const getRiskLevelLabel = (value: string, language: string) => {
  if (language !== "id") return value;
  const map: Record<string, string> = {
    low: "rendah",
    medium: "menengah",
    high: "tinggi",
    critical: "kritis",
  };
  return map[value] ?? value;
};

export const getMitigationLabel = (value: string, language: string) => {
  if (language !== "id") return value;
  const map: Record<string, string> = {
    "Your business is 'Single-Shock' fragile. Build a 3-month cash buffer to survive independent sales drops.":
      "Bisnis Anda masih rapuh terhadap satu guncangan. Bangun buffer kas 3 bulan untuk menahan penurunan penjualan.",
    "Restructure short-term debt into long-term loans.":
      "Restrukturisasi utang jangka pendek menjadi pinjaman jangka panjang.",
    "Operationally critical project detected. Add a 15% time buffer to project phases.":
      "Proyek kritis terdeteksi. Tambahkan buffer waktu 15% di fase proyek.",
  };
  return map[value] ?? value;
};

/**
 * Text builders and recommendations for analysis panels
 */
import { getCategoryKey, getScoreLabel } from "./utils";

export const buildAnalysisText = (category: string, scoreValue: number, trend: string, isId: boolean) => {
  const categoryKey = getCategoryKey(category);
  const direction =
    trend === "worsening"
      ? isId ? "naik" : "moving up"
      : trend === "improving"
        ? isId ? "turun" : "moving down"
        : isId ? "stabil" : "holding steady";

  const label = getScoreLabel(scoreValue, isId).toLowerCase();

  if (categoryKey === "cash") {
    return isId
      ? `Sistem membaca bantalan kas Anda sebagai ${label}. Risiko kas sedang ${direction}, jadi fokus utama adalah apakah runway masih cukup untuk menyerap satu gangguan tambahan.`
      : `The system reads your cash buffer as ${label}. Cash risk is ${direction}, so the key question is whether runway can absorb one more shock.`;
  }

  if (categoryKey === "revenue") {
    return isId
      ? `Skor ini berasal dari jarak antara pemasukan dan kebutuhan bulanan. Sistem melihat apakah gap tersebut masih aman, mulai menekan margin, atau sudah mengganggu ritme bisnis.`
      : `This score comes from the distance between incoming revenue and your monthly requirement. The system checks whether that gap is still safe, starting to squeeze margin, or already disrupting the business rhythm.`;
  }

  if (categoryKey === "client") {
    return isId
      ? `Sistem membaca seberapa rapuh bisnis jika satu klien berubah perilaku. Semakin tinggi skor, semakin besar ketergantungan pada satu sumber pendapatan.`
      : `The system reads how fragile the business becomes if one client changes behavior. The higher the score, the more concentrated income is around a single source.`;
  }

  if (categoryKey === "delay") {
    return isId
      ? `Skor ini melihat apakah keterlambatan proyek bisa berubah menjadi tekanan kas. Fokusnya adalah seberapa mudah jadwal yang bergeser ikut menahan pembayaran masuk.`
      : `This score checks whether delivery delays can turn into cash pressure. The focus is how easily a slipping schedule starts holding back incoming payments.`;
  }

  return isId
    ? `Ini adalah skor gabungan yang merangkum area risiko paling dominan saat ini. Tujuannya memberi pembacaan cepat atas posisi bisnis Anda secara keseluruhan.`
    : `This is a blended score summarizing the dominant risk areas right now. Its job is to give a quick read on the overall business position.`;
};

export const buildCalculationText = (category: string, scenarioOutput: any, isId: boolean) => {
  const categoryKey = getCategoryKey(category);

  if (categoryKey === "cash") {
    return isId
      ? `Runway proyeksi: ${scenarioOutput?.projectedRunway ?? "?"} hari, perubahan skenario: ${scenarioOutput?.runwayDelta && scenarioOutput.runwayDelta > 0 ? "+" : ""}${scenarioOutput?.runwayDelta ?? 0} hari.`
      : `Projected runway: ${scenarioOutput?.projectedRunway ?? "?"} days, scenario change: ${scenarioOutput?.runwayDelta && scenarioOutput.runwayDelta > 0 ? "+" : ""}${scenarioOutput?.runwayDelta ?? 0} days.`;
  }

  if (categoryKey === "revenue") {
    return isId
      ? `Perhitungan berbasis selisih pendapatan terhadap target/break-even, lalu dibobotkan untuk melihat seberapa cepat gap itu bisa berubah menjadi tekanan.`
      : `Calculated from the revenue gap versus target/break-even, then weighted to show how quickly that gap can turn into pressure.`;
  }

  if (categoryKey === "client") {
    return isId
      ? `Semakin besar porsi klien terbesar, semakin tinggi penalti konsentrasi. Sistem menaikkan skor ketika satu klien terlalu dominan.`
      : `The larger the biggest-client share, the higher the concentration penalty. The score rises when one client dominates too much of income.`;
  }

  if (categoryKey === "delay") {
    return isId
      ? `Skor delay menggabungkan buffer waktu, pembayaran yang tertahan, dan tekanan operasional untuk membaca peluang gangguan ikut memukul kas.`
      : `Delay risk combines time buffer, blocked payment, and operational strain to read how likely disruption is to hit cash too.`;
  }

  return isId
    ? `Skor keseluruhan merangkum bobot kas, pendapatan, delay, dan konsentrasi klien ke dalam satu angka akhir.`
    : `The overall score blends cash, revenue, delay, and client concentration into one final number.`;
};

export const generateSuggestions = (category: string, score: number, isId: boolean) => {
  const categoryKey = getCategoryKey(category);

  if (categoryKey === "cash") {
    if (score >= 70) {
      return isId 
        ? "Runway sangat singkat. Segera cari dana tambahan atau kurangi biaya operasional drastis. Prioritas: kelangsungan hidup."
        : "Runway is very short. Find additional funding or drastically reduce operational costs immediately. Priority: survival.";
    } else if (score >= 40) {
      return isId
        ? "Runway menipis. Evaluasi pengeluaran yang bisa ditunda dan percepat koleksi piutang."
        : "Runway is thinning. Evaluate deferrable expenses and accelerate receivables collection.";
    } else {
      return isId
        ? "Posisi kas sehat. Pertahankan buffer minimal 3 bulan dan pertimbangkan investasi untuk pertumbuhan."
        : "Cash position is healthy. Maintain a minimum 3-month buffer and consider investing in growth.";
    }
  }
  if (categoryKey === "revenue") {
    if (score >= 70) {
      return isId
        ? "Defisit pendapatan signifikan. Cari sumber pendapatan baru atau tingkatkan harga layanan."
        : "Significant revenue deficit. Find new revenue sources or increase service prices.";
    } else if (score >= 40) {
      return isId
        ? "Pendapatan hampir mencukupi. Fokus pada retensi klien dan upselling."
        : "Revenue is almost sufficient. Focus on client retention and upselling.";
    } else {
      return isId
        ? "Pendapatan melebihi target. Bagus! Pertimbangkan diversifikasi untuk mengurangi risiko."
        : "Revenue exceeds target. Great! Consider diversification to reduce risk.";
    }
  }
  if (categoryKey === "client") {
    if (score >= 70) {
      return isId
        ? "Ketergantungan ekstrem pada satu klien. Prioritas: cari 2-3 klien baru segera."
        : "Extreme dependency on one client. Priority: find 2-3 new clients immediately.";
    } else if (score >= 40) {
      return isId
        ? "Ketergantungan tinggi. Mulai pipeline untuk mengurangi risiko kehilangan klien utama."
        : "High dependency. Start pipeline to reduce risk of losing main client.";
    } else {
      return isId
        ? "Portofolio klien seimbang. Pertahankan diversifikasi ini."
        : "Client portfolio is balanced. Maintain this diversification.";
    }
  }
  if (categoryKey === "delay") {
    if (score >= 70) {
      return isId
        ? "Risiko delay sangat tinggi. Siapkan buffer kas ekstra atau renegosiasi timeline."
        : "Delay risk is very high. Prepare extra cash buffer or renegotiate timeline.";
    } else if (score >= 40) {
      return isId
        ? "Delay berpotensi terjadi. Monitor proyek ketat dan komunikasikan risiko ke klien."
        : "Delay is likely. Monitor project closely and communicate risk to client.";
    } else {
      return isId
        ? "Proyek on track. Pertahankan komunikasi reguler dengan tim."
        : "Project is on track. Maintain regular communication with team.";
    }
  }
  return isId ? "Pantau metrik ini secara berkala." : "Monitor this metric regularly.";
};

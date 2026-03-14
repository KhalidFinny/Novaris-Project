/**
 * Text builders and recommendations for analysis panels
 */
import { getCategoryKey, getScoreLabel } from "./utils";

export const buildAnalysisText = (category: string, scoreValue: number, trend: string, isId: boolean) => {
  const categoryKey = getCategoryKey(category);
  const direction =
    trend === "worsening"
      ? (isId ? "sedang naik" : "is going up")
      : trend === "improving"
        ? (isId ? "mulai turun" : "is starting to drop")
        : (isId ? "masih stabil" : "is holding steady");

  const label = getScoreLabel(scoreValue, isId).toLowerCase();

  if (categoryKey === "cash") {
    return isId
      ? `Tabungan kas Anda saat ini dalam kondisi ${label}. Risikonya ${direction}, jadi pertanyaannya: apakah uang yang ada sekarang cukup kalau tiba-tiba ada pengeluaran tak terduga?`
      : `Your cash savings look ${label} right now. The risk level ${direction}, so the main thing to watch is whether you have enough to handle a surprise expense.`;
  }

  if (categoryKey === "revenue") {
    return isId
      ? `Skor ini melihat selisih antara pemasukan bulanan dan biaya hidup bisnis Anda. Kami memantau apakah jaraknya masih aman atau sudah mulai mepet sehingga mengganggu operasional.`
      : `This score looks at the gap between your monthly income and your business bills. We're checking if that gap is still safe or getting too tight for comfort.`;
  }

  if (categoryKey === "client") {
    return isId
      ? `Hal ini menunjukkan seberapa bahaya bisnis Anda kalau klien terbesar tiba-tiba pergi atau berhenti bayar. Semakin tinggi skornya, berarti Anda terlalu bergantung pada satu orang saja.`
      : `This shows how much danger your business is in if your biggest customer suddenly leaves. A higher score means you're leaning too much on just one source of income.`;
  }

  if (categoryKey === "delay") {
    return isId
      ? `Skor ini memantau apakah keterlambatan kerja bisa langsung bikin kantong kering. Intinya: seberapa mudah jadwal yang molor mengganggu aliran uang masuk Anda.`
      : `This score checks if project delays might lead to a cash crunch. Basically: how easily a slipping schedule starts blocking your incoming payments.`;
  }

  return isId
    ? `Ini adalah skor gabungan yang merangkum kondisi bisnis Anda secara keseluruhan saat ini, supaya Anda bisa melihat gambaran besarnya dengan cepat.`
    : `This is a combined score that summarizes your overall business health right now, so you can see the big picture at a glance.`;
};

export const buildCalculationText = (category: string, scenarioOutput: any, isId: boolean) => {
  const categoryKey = getCategoryKey(category);

  if (categoryKey === "cash") {
    return isId
      ? `Berdasarkan pengeluaran Anda, uang di bank akan habis dalam ${scenarioOutput?.projectedRunway ?? "?"} hari. Perubahan skenario ini menambah napas bisnis Anda selama ${scenarioOutput?.runwayDelta ?? 0} hari.`
      : `Based on your spending, your cash will last about ${scenarioOutput?.projectedRunway ?? "?"} days. This scenario adds ${scenarioOutput?.runwayDelta ?? 0} days of "breathing room" for your business.`;
  }

  if (categoryKey === "revenue") {
    return isId
      ? `Dihitung dari selisih antara apa yang Anda dapatkan vs apa yang harus dibayar. Kami memantau seberapa cepat kekurangan uang ini bisa bikin bisnis goyang.`
      : `Calculated from the difference between what you earn vs what you owe. We're tracking how quickly this gap could put pressure on your business.`;
  }

  if (categoryKey === "client") {
    return isId
      ? `Semakin besar porsi satu klien dalam pendapatan Anda, semakin bahaya posisinya. Kami memberikan tanda bahaya jika ada satu orang yang terlalu mengontrol keuangan Anda.`
      : `The more one customer pays you, the riskier it gets. We raise a flag when one person has too much control over your total income.`;
  }

  if (categoryKey === "delay") {
    return isId
      ? `Kami menghitung seberapa kuat "cadangan waktu" Anda dan bagaimana keterlambatan bayar dari klien bisa langsung memacetkan kas bisnis.`
      : `We calculate how much "time buffer" you have and how a late payment from a client could immediately lock up your business cash.`;
  }

  return isId
    ? `Skor ini menggabungkan semua faktor (kas, pemasukan, ketergantungan klien, dan delay) untuk memberikan nilai akhir kesehatan bisnis Anda.`
    : `This score blends all factors (cash, income, client dependency, and delays) to give a final "health check" number for your business.`;
};

export const generateSuggestions = (category: string, score: number, isId: boolean) => {
  const categoryKey = getCategoryKey(category);

  if (categoryKey === "cash") {
    if (score >= 70) {
      return isId 
        ? "Waktu Anda sangat mepet. Segera cari suntikan dana atau potong biaya yang tidak penting hari ini juga. Fokus utama: pastikan bisnis tetap hidup."
        : "Your time is running out. Find extra funds or cut non-essential costs immediately. Main focus: making sure the business survives.";
    } else if (score >= 40) {
      return isId
        ? "Persediaan uang mulai menipis. Coba cek lagi biaya apa yang bisa ditunda dan tagih klien yang belum bayar secepatnya."
        : "Cash is getting tight. Look for expenses you can delay and follow up with clients who haven't paid yet.";
    } else {
      return isId
        ? "Posisi uang Anda aman. Usahakan punya cadangan buat 3 bulan ke depan agar lebih tenang saat ingin mengembangkan bisnis."
        : "Your cash position is healthy. Try to keep a 3-month buffer so you can feel safe while growing your business.";
    }
  }
  if (categoryKey === "revenue") {
    if (score >= 70) {
      return isId
        ? "Pemasukan jauh di bawah pengeluaran. Anda butuh sumber pendapatan baru atau coba naikkan harga layanan Anda."
        : "Your income is way below your bills. You need new ways to make money or consider raising your prices.";
    } else if (score >= 40) {
      return isId
        ? "Pemasukan hampir cukup buat nutup biaya. Fokus jaga hubungan dengan klien yang ada dan tawarkan layanan tambahan."
        : "Income is almost enough to cover bills. Focus on keeping your current clients happy and look for extra work with them.";
    } else {
      return isId
        ? "Bagus! Pemasukan sudah lebih dari cukup. Mulai pikirkan cara lain buat cari uang supaya tidak tergantung di satu tempat saja."
        : "Great! You're making more than you spend. Start thinking about diversifying your income so you're not stuck with just one source.";
    }
  }
  if (categoryKey === "client") {
    if (score >= 70) {
      return isId
        ? "Sangat bahaya karena terlalu tergantung pada satu klien. Wajib cari 2-3 klien baru sekarang juga supaya tidak gampang tumbang."
        : "Very risky to depend this much on one client. You must find 2-3 new customers immediately so you're not easily affected if one leaves.";
    } else if (score >= 40) {
      return isId
        ? "Ketergantungan cukup tinggi. Mulai cari calon klien baru dari sekarang buat jaga-jaga kalau klien utama Anda berhenti."
        : "Dependency is high. Start looking for new potential clients now as a backup in case your main one stops.";
    } else {
      return isId
        ? "Bagus, klien Anda sudah beragam. Pertahankan kondisi ini supaya bisnis tetap stabil."
        : "Good, your client list is well-balanced. Keep it this way to stay stable.";
    }
  }
  if (categoryKey === "delay") {
    if (score >= 70) {
      return isId
        ? "Risiko molor sangat tinggi. Siapkan dana cadangan ekstra atau coba bicarakan ulang jadwalnya dengan klien."
        : "High risk of delays. Prepare some extra cash as a backup or talk to your client about adjusting the schedule.";
    } else if (score >= 40) {
      return isId
        ? "Ada potensi keterlambatan. Pantau terus progresnya dan komunikasikan risikonya ke klien dari awal."
        : "Delays are possible. Keep a close eye on progress and let your client know about any risks early on.";
    } else {
      return isId
        ? "Proyek berjalan lancar. Tetap jaga komunikasi yang rutin dengan tim Anda."
        : "Project is on track. Keep talking regularly with your team.";
    }
  }
  return isId ? "Pantau terus angka-angka ini ya." : "Keep a close eye on these numbers.";
};

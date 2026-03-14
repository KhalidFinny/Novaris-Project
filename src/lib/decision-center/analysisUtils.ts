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
      ? `Tabungan kas Anda saat ini dalam kondisi ${label}. Risikonya ${direction}. Pertanyaan utamanya: apakah uang yang ada sekarang cukup untuk menahan pengeluaran tak terduga?`
      : `Your cash savings look ${label} right now. The risk level ${direction}. The main thing to watch is whether you have enough to handle a surprise expense comfortably.`;
  }

  if (categoryKey === "revenue") {
    return isId
      ? `Skor ini melihat selisih antara pemasukan bulanan dan biaya operasional bisnis Anda. Kami memantau apakah jaraknya masih aman atau sudah mulai terlalu mepet.`
      : `This score looks at the gap between your monthly income and your business bills. We're checking if that gap is still safe or getting a little too tight for comfort.`;
  }

  if (categoryKey === "client") {
    return isId
      ? `Hal ini menunjukkan risiko jika klien terbesar tiba-tiba berhenti bekerja sama. Semakin tinggi skornya, berarti bisnis Anda sangat bergantung pada satu sumber pemasukan saja.`
      : `This shows what might happen if your biggest customer suddenly stops working with you. A higher score means you're leaning a bit too much on just one source of income.`;
  }

  if (categoryKey === "delay") {
    return isId
      ? `Skor ini memantau seberapa mudah jadwal yang molor bisa mengganggu aliran uang masuk Anda. Intinya: seberapa kuat bantalan waktu Anda saat ini.`
      : `This score checks how easily a slipping schedule might start blocking your incoming payments. Basically: how strong your "time buffer" is right now.`;
  }

  return isId
    ? `Ini adalah skor gabungan yang merangkum kondisi keuangan dan operasional Anda saat ini, supaya Anda bisa melihat gambaran besarnya dengan cepat.`
    : `This is a combined score that summarizes your overall business health right now, so you can see the big picture at a glance.`;
};

export const buildCalculationText = (category: string, scenarioOutput: any, isId: boolean) => {
  const categoryKey = getCategoryKey(category);

  if (categoryKey === "cash") {
    return isId
      ? `Berdasarkan pengeluaran Anda, uang di bank diperkirakan akan habis dalam ${scenarioOutput?.projectedRunway ?? "?"} hari. Skenario ini bisa menambah napas bisnis Anda selama ${scenarioOutput?.runwayDelta ?? 0} hari.`
      : `Based on your spending, your cash will last about ${scenarioOutput?.projectedRunway ?? "?"} days. This scenario can add ${scenarioOutput?.runwayDelta ?? 0} days of "breathing room" for your business.`;
  }

  if (categoryKey === "revenue") {
    return isId
      ? `Dihitung dari selisih antara apa yang Anda dapatkan vs biaya yang harus dibayar. Kami memantau seberapa cepat celah ini bisa memengaruhi keleluasaan bisnis Anda.`
      : `Calculated from the difference between what you earn vs what you owe. We're tracking how this gap affects your ability to move comfortably.`;
  }

  if (categoryKey === "client") {
    return isId
      ? `Semakin besar porsi satu klien dalam pendapatan Anda, semakin tinggi risikonya. Kami memberi tanda jika ada satu pihak yang punya kontrol terlalu besar atas total pemasukan Anda.`
      : `The more one customer pays you, the riskier it gets. We raise a flag when one party has a lot of control over your total income.`;
  }

  if (categoryKey === "delay") {
    return isId
      ? `Kami menghitung seberapa kuat cadangan waktu Anda dan bagaimana keterlambatan pembayaran bisa langsung memengaruhi ketersediaan kas bisnis.`
      : `We calculate how much "time buffer" you have and how a late payment might immediately affect your business cash flow.`;
  }

  return isId
    ? `Skor ini menggabungkan berbagai faktor (kas, pemasukan, ketergantungan klien, dan jadwal) untuk memberikan nilai akhir kesehatan bisnis Anda.`
    : `This score blends different factors (cash, income, client dependency, and schedules) to give a final "health check" number for your business.`;
};

export const generateSuggestions = (category: string, score: number, isId: boolean) => {
  const categoryKey = getCategoryKey(category);

  if (categoryKey === "cash") {
    if (score >= 70) {
      return isId 
        ? "Waktu Anda cukup mepet. Segera cari cara untuk menambah kas atau tunda pengeluaran yang tidak mendesak. Prioritas utama: menjaga napas bisnis tetap aman."
        : "Your time is running thin. Find ways to add cash or delay non-urgent costs immediately. Main focus: keeping the business's breathing room safe.";
    } else if (score >= 40) {
      return isId
        ? "Persediaan uang mulai menipis. Coba cek kembali biaya yang bisa ditunda dan pastikan penagihan ke klien berjalan lancar."
        : "Cash is getting a bit tight. Look for expenses you can delay and make sure your client follow-ups are on track.";
    } else {
      return isId
        ? "Posisi uang Anda sehat. Usahakan punya cadangan buat 3 bulan ke depan supaya Anda punya ruang lebih saat ingin mengembangkan bisnis."
        : "Your cash position is healthy. Try to keep a 3-month buffer so you have more room to move when you're ready to grow.";
    }
  }
  if (categoryKey === "revenue") {
    if (score >= 70) {
      return isId
        ? "Pemasukan saat ini tertinggal dari biaya operasional. Anda mungkin butuh sumber pendapatan tambahan atau meninjau kembali harga layanan Anda."
        : "Your income is currently trailing behind your bills. You might need new revenue sources or to review your pricing structure.";
    } else if (score >= 40) {
      return isId
        ? "Pemasukan hampir cukup untuk menutup biaya. Fokus jaga hubungan dengan klien yang ada dan tawarkan bantuan tambahan jika memungkinkan."
        : "Income is nearly enough to cover bills. Focus on keeping current clients happy and look for extra ways to help them.";
    } else {
      return isId
        ? "Bagus! Pemasukan sudah cukup untuk menutup biaya. Mulai pikirkan cara untuk menambah variasi sumber pendapatan agar bisnis lebih stabil."
        : "Great! You're making enough to cover your bills. Start thinking about adding different income sources to make the business even more stable.";
    }
  }
  if (categoryKey === "client") {
    if (score >= 70) {
      return isId
        ? "Risikonya cukup tinggi karena terlalu tergantung pada satu klien. Sangat disarankan untuk mulai mencari 2-3 klien baru agar bisnis tidak mudah goyah."
        : "It's quite risky to depend this much on one client. It's highly recommended to start finding 2-3 new customers so your business stays steady.";
    } else if (score >= 40) {
      return isId
        ? "Ketergantungan klien agak tinggi. Mulai cari calon klien baru dari sekarang untuk berjaga-jaga jika klien utama Anda berhenti."
        : "Client dependency is a bit high. Start looking for new potential clients now as a backup in case your main one stops.";
    } else {
      return isId
        ? "Bagus, daftar klien Anda sudah beragam. Pertahankan kondisi ini supaya bisnis tetap stabil."
        : "Good, your client list is well-balanced. Keep it this way to stay stable.";
    }
  }
  if (categoryKey === "delay") {
    if (score >= 70) {
      return isId
        ? "Risiko jadwal terhambat cukup tinggi. Siapkan dana cadangan ekstra atau coba diskusikan kembali jadwal dengan klien Anda."
        : "The risk of jumping off schedule is high. Prepare some extra cash as a backup or discuss the timeline again with your client.";
    } else if (score >= 40) {
      return isId
        ? "Ada potensi keterlambatan. Tetap pantau progres berkala dan komunikasikan setiap risiko ke klien dari awal."
        : "Slipping behind is possible. Keep a close eye on progress and let your client know about any risks early on.";
    } else {
      return isId
        ? "Operasional berjalan lancar. Tetap jaga komunikasi rutin dengan tim Anda."
        : "Operations are on track. Keep talking regularly with your team.";
    }
  }
  return isId ? "Terus pantau angka-angka ini ya." : "Keep a close eye on these numbers.";
};

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../hooks/useLocale";
import { useSeo } from "../hooks/useSeo";
import { Nav } from "../components/layout/Nav";
import logo1 from "../assets/logo/logo1.png";

export default function HowItWorksPage() {
  const { language } = useLocale();
  const isId = language === "id";

  useSeo({
    title: isId ? "Cara Kerja Novaris" : "How Novaris Works",
    description: isId
      ? "Pelajari bagaimana Novaris mengubah angka Anda menjadi pandangan risiko yang jelas untuk membantu keputusan bisnis."
      : "Learn how Novaris turns your numbers into a clear view of risk to help you execute business decisions.",
    path: "/how-it-works",
    image: logo1,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      num: "01",
      title: isId ? "Input Sederhana" : "Simple Input",
      desc: isId
        ? "Mulai dengan 4 angka dasar: uang di bank, pengeluaran wajib, rata-rata pendapatan, dan persentase klien terbesar. Anda tidak butuh laporan keuangan penuh untuk memulai."
        : "Start with 4 basic numbers: cash in bank, mandatory bills, average revenue, and biggest client percentage. You don't need full financial statements to begin.",
    },
    {
      num: "02",
      title: isId ? "Mesin Risiko Berjalan" : "Risk Engine Runs",
      desc: isId
        ? "Sistem memproses profil keuangan Anda instan, memeriksa potensi titik krisis (cash runway, dominasi klien) dan mengembalikan skor risiko yang jelas."
        : "The system processes your financial profile instantly, checking for potential breaking points (cash runway, client dominance) and returns a clear risk score.",
    },
    {
      num: "03",
      title: isId ? "Cerita Keputusan Terbentuk" : "Decision Story Forms",
      desc: isId
        ? "Novaris menerjemahkan data mentah ke dalam 'Decision Story'—suatu narasi yang memberikan rekomendasi nyata tentang tekanan terbesar bisnis Anda."
        : "Novaris translates raw data into a 'Decision Story'—a narrative that gives you actionable advice on the biggest pressure putting your business at risk.",
    },
    {
      num: "04",
      title: isId ? "Uji Skenario Aktif" : "Active Scenario Testing",
      desc: isId
        ? "Gunakan data interaktif untuk bereksperimen. Lihat apa yang terjadi apabila Anda menyewa orang baru, jika proyek molor 2 minggu, atau jika biaya tak terduga naik 20%."
        : "Use interactive data to experiment. See what happens if you hire a new person, if a project slips 2 weeks, or if unexpected costs rise 20%.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-bone dark:bg-charcoal transition-colors duration-520">
      <Nav />
      <main className="pt-32 pb-24 px-[5%] max-w-content mx-auto">
        <h1 className="font-fraunces text-[clamp(42px,6vw,72px)] leading-tight tracking-[-0.03em] text-ink dark:text-frost text-center mb-6">
          {isId ? "Cara Kerja Novaris" : "How Novaris Works"}
        </h1>
        <p className="font-sans text-[clamp(18px,2vw,22px)] text-ink/68 dark:text-frost/72 text-center max-w-2xl mx-auto mb-20 leading-relaxed">
          {isId
            ? "Kami mengubah angka Anda yang membosankan menjadi narasi keputusan yang mudah dimengerti."
            : "We turn your boring numbers into easy-to-understand decision narratives."}
        </p>

        <div className="space-y-16">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className={`flex flex-col md:flex-row items-start gap-6 md:gap-12 opacity-0`}
              style={{
                animation: `fadeUp 0.8s var(--ease-spring) ${idx * 150}ms forwards`,
              }}
            >
              <div className="md:w-1/3 flex border-t-2 border-scarlet/20 dark:border-steel-bright/20 pt-4">
                <span className="font-mono text-scarlet dark:text-steel-bright text-4xl mr-4 opacity-50">
                  {step.num}
                </span>
                <h3 className="font-fraunces text-3xl text-ink dark:text-frost leading-tight">
                  {step.title}
                </h3>
              </div>
              <div className="md:w-2/3 border-t border-ink/10 dark:border-frost/10 md:border-transparent pt-4">
                <p className="font-sans text-[18px] text-ink/70 dark:text-frost/70 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <Link
            to="/decision-center"
            className="inline-block font-sans font-semibold text-[14px] uppercase tracking-[0.14em] px-8 py-4 rounded-card bg-scarlet dark:bg-steel-bright text-white dark:text-void hover:bg-scarlet-dark dark:hover:bg-[#a8cbd4] hover:-translate-y-0.5 transition-all duration-200 ease-spring"
          >
            {isId ? "Mulai Analisis Pertama" : "Start First Analysis"}
          </Link>
        </div>
      </main>
    </div>
  );
}

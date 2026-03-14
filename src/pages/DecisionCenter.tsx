import React, { useRef, useState } from "react";
import { Nav } from "../components/layout/Nav";
import { useLocale } from "../hooks/useLocale";
import { useSeo } from "../hooks/useSeo";
import logo3 from "../assets/logo/logo3.png";
import { useDecisionCenter } from "../hooks/useDecisionCenter";
import { LeftSidebar } from "../components/decision-center/LeftSidebar";
import { KPIStrip } from "../components/decision-center/KPIStrip";
import { NarrativePanel } from "../components/decision-center/NarrativePanel";
import { RiskSpread } from "../components/decision-center/RiskSpread";
import { MetricCharts } from "../components/decision-center/MetricCharts";
import { AnalysisPanels } from "../components/decision-center/AnalysisPanels";
import { TutorialOverlay } from "../components/ui/TutorialOverlay";
import { UpdateNotification } from "../components/decision-center/UpdateNotification";
import { SectionGuide } from "../components/ui/SectionGuide";
import { useSectionObserver } from "../hooks/useSectionObserver";
import {
  AnimatedSection,
  AnimatedOnScroll,
} from "../components/decision-center/AnimatedSection";
import { exportToPdf, exportToExcel } from "../lib/decision-center/exportUtils";
import { Download, FileText, Table, Lock } from "lucide-react";
import { LoadingOverlay } from "../components/ui/LoadingOverlay";
import { PaymentWall } from "../components/decision-center/PaymentWall";

const SECTION_IDS = [
  "zone-narrative",
  "zone-kpi",
  "zone-spread",
  "zone-charts",
  "zone-analysis",
];

export default function DecisionCenter() {
  const { language, currency } = useLocale();
  const isId = language === "id";
  const { activeSection } = useSectionObserver(SECTION_IDS);

  const revenueGapRef = useRef<any>(null);
  const monteCarloRef = useRef<any>(null);
  const [showPaymentWall, setShowPaymentWall] = useState(false);

  /** Captures chart state and triggers professional PDF generation */
  const handlePdfExport = async () => {
    if (!data || !submittedInputs) return;

    if (!isPaid) {
      setShowPaymentWall(true);
      return;
    }
    
    const chartImages = {
      revenue: revenueGapRef.current?.toBase64Image() || "",
      monteCarlo: monteCarloRef.current?.toBase64Image() || ""
    };

    await exportToPdf(data, submittedInputs, { language, currency, chartImages });
  };

  /** Generates professional Excel export with live formulas */
  const handleExcelExport = () => {
    if (!data || !submittedInputs) return;

    if (!isPaid) {
      setShowPaymentWall(true);
      return;
    }

    exportToExcel(data, submittedInputs, { language, currency });
  };

  const progressItems = [
    { id: "zone-narrative", label: isId ? "Debrief" : "Debrief" },
    { id: "zone-kpi", label: isId ? "Fakta" : "Facts" },
    { id: "zone-spread", label: isId ? "Alur" : "Spread" },
    { id: "zone-charts", label: isId ? "Bukti" : "Evidence" },
    { id: "zone-analysis", label: isId ? "Aksi" : "Action" },
  ];

  useSeo({
    title: isId ? "Novaris | Pusat Keputusan" : "Novaris | Decision Center",
    description: isId
      ? "Pusat keputusan terintegrasi untuk melihat risiko finansial dan operasional dalam satu narasi koheren."
      : "Integrated decision center to see financial and operational risk in one coherent narrative.",
    path: "/decision-center",
    image: logo3,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: isId ? "Novaris Pusat Keputusan" : "Novaris Decision Center",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://novaris.app/decision-center",
      description: isId
        ? "Platform simulasi risiko untuk membantu owner bisnis mengambil keputusan finansial dan operasional."
        : "Risk simulation platform to support financial and operational decision-making for business owners.",
    },
  });

  const {
    sidebarOpen,
    setSidebarOpen,
    inputs,
    setInputs,
    submittedInputs,
    scenarioSnapshots,
    data,
    errorMessage,
    isCalculating,
    missingEssentials,
    missingDelay,
    validateDelay,
    canSubmit,
    updateEssentials,
    updateDelayRisk,
    handleConfirmData,
    handleClearData,
    handleSaveSnapshot,
    handleLoadSnapshot,
    handleDeleteSnapshot,
    isPaid,
    setIsPaid,
  } = useDecisionCenter(language);

  const sectionPaddingX = sidebarOpen
    ? "px-6 sm:px-8 lg:px-20"
    : "px-6 sm:px-10 lg:pl-56 lg:pr-16";

  return (
    <div className="min-h-screen bg-bone dark:bg-charcoal transition-colors duration-520">
      {isCalculating && (
        <LoadingOverlay message={isId ? "MENGKALKULASI RISIKO..." : "CALCULATING RISK..."} />
      )}
      <Nav />
      <TutorialOverlay
        storageKey="novaris_decision_center_tutorial_v2"
        onComplete={() => {}}
        steps={[
          {
            targetId: "decision-sidebar",
            title: isId ? "Mulai dari 4 angka" : "Start with 4 numbers",
            description: isId
              ? "Isi kas, tagihan bulanan, pendapatan bulanan, dan persentase klien terbesar untuk membaca risiko uang Anda."
              : "Fill cash, monthly bills, monthly revenue, and biggest-client percentage to read your money risk.",
          },
          {
            targetId: "decision-story",
            title: isId ? "Baca cerita utamanya" : "Read the main story",
            description: isId
              ? "Novaris menerjemahkan angka Anda menjadi cerita keputusan: situasi, risiko, dan arah tindakan."
              : "Novaris turns your numbers into a decision story: situation, risk, and direction.",
          },
          {
            targetId: "decision-delay-toggle",
            title: isId
              ? "Delay hanya jika perlu"
              : "Delay only if you need it",
            description: isId
              ? "Buka layer delay hanya jika Anda ingin tahu dampak keterlambatan proyek pada uang masuk."
              : "Open the delay layer only if you want to see how delivery timing changes your cash story.",
          },
        ]}
      />

      <div className="fixed right-4 top-27 z-40 hidden xl:flex flex-col gap-2 rounded-sm border border-ink/6 bg-bone/80 px-3 py-3 backdrop-blur dark:border-frost/8 dark:bg-charcoal-soft/80">
        {progressItems.map((item) => {
          const active = item.id === activeSection;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`font-sans text-[11px] tracking-[0.14em] uppercase transition-colors ${
                active
                  ? "text-scarlet dark:text-scarlet-bright"
                  : "text-ink/46 dark:text-frost/52 hover:text-ink dark:hover:text-frost"
              }`}
            >
              {item.label}
            </a>
          );
        })}

      </div>

      <div className="pt-18 flex">
        <LeftSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          inputs={inputs}
          onUpdateEssentials={updateEssentials}
          onUpdateDelayRisk={updateDelayRisk}
          missingEssentials={missingEssentials}
          validateDelay={validateDelay}
          missingDelay={missingDelay}
          onConfirmData={handleConfirmData}
          canConfirm={canSubmit}
          hasSubmitted={submittedInputs !== null}
          errorMessage={errorMessage}
          isCalculating={isCalculating}
          onClearData={handleClearData}
        />

        <main
          className={`flex-1 transition-all duration-400 ease-out ${
            sidebarOpen ? "lg:ml-[360px]" : "ml-0"
          }`}
        >
          <AnimatedSection delay={0.1}>
            <section
              id="zone-narrative"
              className={`min-h-screen pb-18 transition-all duration-400 ease-out ${
                sidebarOpen
                  ? "px-6 sm:px-8 lg:pl-12 lg:pr-12"
                  : sectionPaddingX
              }`}
            >
              <NarrativePanel
                data={data.narrative}
                isCalculating={isCalculating}
                inputs={submittedInputs ?? inputs}
                onApplyScenario={(scenarioId: string) => {
                  setInputs((prev) => ({
                    ...prev,
                    activeScenario: scenarioId,
                  }));
                  if (submittedInputs) {
                    setInputs((prev) =>
                      prev ? { ...prev, activeScenario: scenarioId } : prev,
                    );
                  }
                }}
              />
            </section>
          </AnimatedSection>

          <AnimatedOnScroll delay={0.15}>
            <section
              id="zone-kpi"
              className={`sticky top-18 z-40 py-6 bg-bone/95 dark:bg-charcoal/95 backdrop-blur-xl border-y border-ink/4 dark:border-frost/8 transition-all duration-400 ease-out ${sectionPaddingX}`}
            >
              <SectionGuide
                step={isId ? "Langkah 2" : "Step 2"}
                title={isId ? "Fakta utama" : "Key facts"}
                description={
                  isId
                    ? "Tiga pembacaan inti yang langsung menjelaskan posisi bisnis Anda sekarang."
                    : "Three core reads that explain where the business stands right now."
                }
              />
              <KPIStrip data={data.kpi} />
            </section>
          </AnimatedOnScroll>

          <AnimatedOnScroll delay={0.1}>
            <section id="zone-spread" className={`py-20 transition-all duration-400 ease-out ${sectionPaddingX}`}>
              <SectionGuide
                step={isId ? "Langkah 3" : "Step 3"}
                title={
                  isId
                    ? "Bagaimana masalah menyebar"
                    : "How the problem spreads"
                }
                description={
                  isId
                    ? "Satu jalur utama dari pemicu awal sampai dampak bisnis yang paling perlu Anda cegah."
                    : "One main path from the initial trigger to the business impact you most need to prevent."
                }
              />
              <RiskSpread
                pairs={data.riskBridge}
                chain={data.dominoChain}
                isCalculating={isCalculating}
              />
            </section>
          </AnimatedOnScroll>

          <AnimatedOnScroll delay={0.1}>
            <section id="zone-charts" className={`py-20 transition-all duration-400 ease-out ${sectionPaddingX}`}>
              <SectionGuide
                step={isId ? "Langkah 4" : "Step 4"}
                title={isId ? "Bukti angkanya" : "The evidence"}
                description={
                  isId
                    ? "Grafik untuk menunjukkan apakah masalah utamanya ada di pendapatan, likuiditas, atau rentang hasil."
                    : "Charts showing whether the main issue is revenue, liquidity, or the outcome range."
                }
              />
                <MetricCharts 
                  data={data.charts} 
                  isCalculating={isCalculating} 
                  revenueGapRef={revenueGapRef}
                  monteCarloRef={monteCarloRef}
                />
            </section>
          </AnimatedOnScroll>

          <AnimatedOnScroll delay={0.1}>
            <section id="zone-analysis" className={`py-20 transition-all duration-400 ease-out ${sectionPaddingX}`}>
              <SectionGuide
                step={isId ? "Langkah 5" : "Step 5"}
                title={
                  isId ? "Apa yang sebaiknya dilakukan" : "What to do next"
                }
                description={
                  isId
                    ? "Pembacaan skor, alasan di baliknya, dan simulasi perubahan keputusan."
                    : "Score interpretation, why it landed there, and scenario testing for your next move."
                }
              />
              <AnalysisPanels
                data={data.analysis}
                scenarioInputs={inputs.scenario}
                onUpdateScenario={(values) =>
                  setInputs((prev) => ({
                    ...prev,
                    scenario: { ...prev.scenario, ...values },
                    
                  }))
                }
                snapshots={scenarioSnapshots}
                onSaveSnapshot={handleSaveSnapshot}
                onLoadSnapshot={handleLoadSnapshot}
                onDeleteSnapshot={handleDeleteSnapshot}
                isCalculating={isCalculating}
              />
            </section>
          </AnimatedOnScroll>
        </main>
      </div>

      <UpdateNotification
        lastUpdated={data.lastUpdated}
        isCalculating={isCalculating}
      />

      <PaymentWall 
        isOpen={showPaymentWall}
        onClose={() => setShowPaymentWall(false)}
        onSuccess={() => setShowPaymentWall(false)}
        language={language}
      />
    </div>
  );
}

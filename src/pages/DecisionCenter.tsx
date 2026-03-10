import { Nav } from "../components/layout/Nav";
import { useLocale } from "../hooks/useLocale";
import { useSeo } from "../hooks/useSeo";
import logo3 from "../assets/logo/logo3.png";
import { useDecisionCenter } from "../hooks/useDecisionCenter";
import { LeftSidebar } from "../components/decision-center/LeftSidebar";
import { KPIStrip } from "../components/decision-center/KPIStrip";
import { NarrativePanel } from "../components/decision-center/NarrativePanel";
import { RiskBridge } from "../components/decision-center/RiskBridge";
import { DominoChain } from "../components/decision-center/DominoChain";
import { MetricCharts } from "../components/decision-center/MetricCharts";
import { AnalysisPanels } from "../components/decision-center/AnalysisPanels";
import { TutorialOverlay } from "../components/ui/TutorialOverlay";
import { UpdateNotification } from "../components/decision-center/UpdateNotification";
import {
  AnimatedSection,
  AnimatedOnScroll,
  AnimatedStagger,
} from "../components/decision-center/AnimatedSection";

export default function DecisionCenter() {
  const { language } = useLocale();
  const isId = language === "id";

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
  } = useDecisionCenter(language);

  return (
    <div className="min-h-screen bg-bone dark:bg-charcoal transition-colors duration-520">
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

      <div className="pt-[72px] flex">
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
          className={`flex-1 transition-all duration-[400ms] ease-out ${
            sidebarOpen ? "ml-[360px]" : "ml-0"
          }`}
        >
          <AnimatedSection delay={0.1}>
            <section
              id="zone-narrative"
              className={`min-h-screen pb-18 transition-all duration-[400ms] ease-out ${
                sidebarOpen ? "pl-12 lg:pl-20" : "pl-48 lg:pl-56"
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
              className="sticky top-[72px] z-40 px-12 lg:px-20 py-6 bg-bone/95 dark:bg-charcoal/95 backdrop-blur-xl border-y border-ink/[0.04] dark:border-frost/[0.04]"
            >
              <KPIStrip data={data.kpi} />
            </section>
          </AnimatedOnScroll>

          <AnimatedOnScroll delay={0.1}>
            <section id="zone-risk-bridge" className="px-12 lg:px-20 py-20">
              <RiskBridge pairs={data.riskBridge} />
            </section>
          </AnimatedOnScroll>

          <AnimatedOnScroll delay={0.1}>
            <section id="zone-domino" className="px-12 lg:px-20 py-20">
              <DominoChain
                chain={data.dominoChain}
                isCalculating={isCalculating}
              />
            </section>
          </AnimatedOnScroll>

          <AnimatedOnScroll delay={0.1}>
            <section id="zone-charts" className="px-12 lg:px-20 py-20">
              <MetricCharts data={data.charts} isCalculating={isCalculating} />
            </section>
          </AnimatedOnScroll>

          <AnimatedOnScroll delay={0.1}>
            <section id="zone-analysis" className="px-12 lg:px-20 py-20">
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
    </div>
  );
}

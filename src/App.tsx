import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LoadingOverlay } from "./components/ui/LoadingOverlay";
import { PageTransitionProvider, usePageTransition } from "./components/layout/PageTransitionProvider";

const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const DecisionCenter = React.lazy(() => import("./pages/DecisionCenter"));
const HowItWorksPage = React.lazy(() => import("./pages/HowItWorksPage"));

function GlobalTransitionOverlay() {
  const { isLoading } = usePageTransition();
  return <LoadingOverlay show={isLoading} message="LOADING NOVARIS..." />;
}

function AppContent() {
  return (
    <>
      <GlobalTransitionOverlay />
      <Suspense fallback={<LoadingOverlay show={true} />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/decision-center" element={<DecisionCenter />} />
          
          {/* Legacy redirects */}
          <Route path="/workspace" element={<Navigate to="/decision-center" replace />} />
          <Route path="/workspace/financial" element={<Navigate to="/decision-center" replace />} />
          <Route path="/workspace/delay" element={<Navigate to="/decision-center" replace />} />
          <Route path="/financial" element={<Navigate to="/decision-center" replace />} />
          <Route path="/delay" element={<Navigate to="/decision-center" replace />} />
          <Route path="/integrated" element={<Navigate to="/decision-center" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PageTransitionProvider>
        <AppContent />
      </PageTransitionProvider>
    </BrowserRouter>
  );
}

export default App;

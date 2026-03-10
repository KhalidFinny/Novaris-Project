import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";

const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const DecisionCenter = React.lazy(() => import("./pages/DecisionCenter"));

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  // Initialise theme from localStorage on mount — writes .dark class to <html>
  useTheme();
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeWrapper>
        <Suspense fallback={<main className="min-h-screen bg-bone dark:bg-charcoal" />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
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
      </ThemeWrapper>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import LandingPage from "./pages/LandingPage";
import Financial from "./pages/Financial";
import Delay from "./pages/Delay";

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  // Initialise theme from localStorage on mount — writes .dark class to <html>
  useTheme();
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeWrapper>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/delay" element={<Delay />} />
        </Routes>
      </ThemeWrapper>
    </BrowserRouter>
  );
}

export default App;

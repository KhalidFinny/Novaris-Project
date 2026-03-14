import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Trigger loading on route change
  useEffect(() => {
    setIsLoading(true);
    // Automatic timeout to ensure we don't get stuck, 
    // but ideally pages call setIsLoading(false) when ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <PageTransitionContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (context === undefined) {
    throw new Error("usePageTransition must be used within a PageTransitionProvider");
  }
  return context;
}

import React from "react";
import logo3 from "../../assets/logo/logo3.png";

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
  show?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message, 
  fullScreen = true,
  show = true
}) => {
  return (
    <div className={`
      ${fullScreen ? "fixed inset-0 z-9999" : "absolute inset-0 z-50"}
      flex flex-col items-center justify-center
      bg-bone dark:bg-charcoal backdrop-blur-md
      transition-all duration-800 ease-novaris
      ${show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
    `}>
      <div className={`
        relative flex flex-col items-center
        transition-transform duration-800 ease-novaris
        ${show ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
      `}>
        <div className="relative w-24 h-24 mb-6">
          <img 
            src={logo3} 
            alt="Novaris Logo" 
            className="w-full h-full object-contain animate-pulse-logo"
          />
          <div className="absolute inset-0 bg-scarlet/20 dark:bg-scarlet-bright/10 blur-2xl rounded-full -z-10 animate-pulse-glow" />
        </div>
        
        {message && (
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60 dark:text-frost/60 animate-pulse">
            {message}
          </p>
        )}
        
        <div className="w-32 h-px bg-ink/10 dark:bg-frost/10 mt-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-scarlet dark:bg-scarlet-bright w-1/2 animate-loading-slide" />
        </div>
      </div>
    </div>
  );
};

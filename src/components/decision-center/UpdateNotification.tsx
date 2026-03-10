import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface UpdateNotificationProps {
  lastUpdated: Date | null;
  isCalculating: boolean;
}

export function UpdateNotification({ lastUpdated, isCalculating }: UpdateNotificationProps) {
  const [visible, setVisible] = useState(false);
  const [displayTime, setDisplayTime] = useState("");

  useEffect(() => {
    if (!lastUpdated || isCalculating) {
      setVisible(false);
      return;
    }

    // Show notification when data updates
    setVisible(true);
    
    // Format time ago
    const updateTime = () => {
      const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      if (seconds < 5) {
        setDisplayTime("just now");
      } else if (seconds < 60) {
        setDisplayTime(`${seconds}s ago`);
      } else {
        const minutes = Math.floor(seconds / 60);
        setDisplayTime(`${minutes}m ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 5000);

    // Auto-hide after 10 seconds
    const hideTimeout = setTimeout(() => {
      setVisible(false);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimeout);
    };
  }, [lastUpdated, isCalculating]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 transition-all duration-300 dark:border-emerald-800 dark:bg-emerald-900/20">
      <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
      <span className="font-sans text-[13px] text-emerald-700 dark:text-emerald-300">
        Updated {displayTime}
      </span>
    </div>
  );
}

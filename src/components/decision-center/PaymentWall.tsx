import React from "react";
import { X, Lock, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";

interface PaymentWallProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: "en" | "id";
}

export function PaymentWall({ isOpen, onClose, onSuccess, language }: PaymentWallProps) {
  if (!isOpen) return null;

  const isId = language === "id";

  const features = [
    {
      title: isId ? "PDF Report Premium" : "Premium PDF Report",
      desc: isId ? "Analisis naratif lengkap dengan layout konsultasi profesional." : "Full narrative analysis with professional consulting layout."
    },
    {
      title: isId ? "Dynamic Excel Export" : "Dynamic Excel Export",
      desc: isId ? "Bawa data Anda ke spreadsheet dengan formula live dan backing data." : "Take your data to a spreadsheet with live formulas and backing data."
    },
    {
      title: isId ? "Monte Carlo Insights" : "Monte Carlo Insights",
      desc: isId ? "Akses distribusi probabilitas penuh untuk analisis risiko mendalam." : "Access full probability distributions for deep risk analysis."
    }
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center px-6 py-10 overflow-y-auto">
      <div 
        className="absolute inset-0 bg-ink/60 dark:bg-charcoal/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-[640px] bg-bone dark:bg-charcoal-soft border border-ink/10 dark:border-frost/10 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-400 ease-spring">
        {/* Header */}
        <div className="relative h-32 bg-ink dark:bg-charcoal flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(164,22,36,0.3),transparent)]" />
          </div>
          <Lock className="text-white/20 absolute -bottom-4 -right-4 w-32 h-32 rotate-12" />
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-scarlet/20 border border-scarlet/30 text-scarlet-bright text-[10px] tracking-[0.2em] uppercase mb-2">
              <ShieldCheck size={12} />
              {isId ? "FITUR MENDATANG" : "UPCOMING FEATURE"}
            </div>
            <h3 className="font-fraunces text-2xl text-white">
              {isId ? "Professional Bundle: Segera Hadir" : "Professional Bundle: Coming Soon"}
            </h3>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="font-sans text-[17px] text-ink/70 dark:text-frost/70 text-center mb-8 max-w-[46ch] mx-auto">
            {isId 
              ? "Kami sedang memfinalisasi fitur bundle PDF dan Excel untuk presentasi profesional. Coba dashboard gratis kami sekarang." 
              : "We are finalizing the professional PDF and Excel bundle for high-stakes presentations. Try our free dashboard tools now."}
          </p>

          <div className="space-y-5 mb-8">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg bg-white/40 dark:bg-white/5 border border-ink/5 dark:border-frost/5 opacity-80">
                <div className="mt-0.5 text-scarlet dark:text-scarlet-bright shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="font-sans font-semibold text-[15px] text-ink dark:text-frost mb-1">{f.title}</h4>
                  <p className="font-sans text-[13px] text-ink/60 dark:text-frost/60 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon CTA */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-ink text-white text-center">
            <div className="mb-4">
              <p className="font-sans text-[11px] tracking-widest uppercase text-white/50 mb-1">{isId ? "Status Akses" : "Access Status"}</p>
              <div className="flex items-baseline gap-2 justify-center">
                <span className="font-fraunces text-3xl">{isId ? "Gratis Selama Beta" : "Free During Beta"}</span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-10 py-3.5 bg-scarlet hover:bg-scarlet-dark rounded-lg font-sans font-bold text-[13px] tracking-[0.05em] uppercase transition-all shadow-lg shadow-scarlet/20 active:scale-[0.98] w-full"
            >
              {isId ? "Lanjutkan Eksplorasi" : "Continue Exploring"}
            </button>
          </div>

          <p className="mt-6 text-center font-sans text-[11px] text-ink/40 dark:text-frost/40">
            {isId 
              ? "Dashboard analisis tetap gratis selamanya. Fitur export segera menyusul." 
              : "The interactive dashboard remains free. Export features are currently in final development."}
          </p>
        </div>
      </div>
    </div>
  );
}

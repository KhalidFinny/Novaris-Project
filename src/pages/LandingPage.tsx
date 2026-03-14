import React from "react";
import { HeroSection } from "../features/landing/HeroSection";
import { useLocale } from "../hooks/useLocale";
import { useSeo } from "../hooks/useSeo";
import logo1 from "../assets/logo/logo1.png";

export default function LandingPage() {
  const { language } = useLocale();

  useSeo({
    title:
      language === "id"
        ? "Novaris | Kenali Risiko, Ambil Keputusan dengan Yakin"
        : "Novaris | Know the Risk. Execute Confidently.",
    description:
      language === "id"
        ? "Novaris membantu owner bisnis memahami risiko finansial dan operasional agar keputusan lebih cepat dan tepat."
        : "Novaris helps business owners understand financial and operational risk to make faster, clearer decisions.",
    path: "/",
    image: logo1,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Novaris",
        url: "https://novaris.app",
        logo: `https://novaris.app${logo1}`,
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Novaris",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          language === "id"
            ? "Platform simulasi risiko untuk membantu owner bisnis mengambil keputusan finansial dan operasional."
            : "Risk simulation platform to support financial and operational decision-making for business owners.",
      },
    ],
  });

  return <HeroSection />;
}

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { DecisionCenterData, AllInputs } from "../../types/decisionCenter";
import { formatWithDots } from "../../utils/formatters";
import logo3 from "../../assets/logo/logo3.png";

type RGB = [number, number, number];

const COLORS = {
  ink: [15, 23, 42] as RGB, // Slate-900
  scarlet: [164, 22, 36] as RGB,
  gray: [100, 116, 139] as RGB, // Slate-500
  lightGray: [241, 245, 249] as RGB, // Slate-100
  white: [255, 255, 255] as RGB,
  emerald: [22, 163, 74] as RGB,
  amber: [217, 119, 6] as RGB,
};

interface ExportOptions {
  language: "en" | "id";
  currency: string;
  chartImages?: { revenue?: string; monteCarlo?: string };
}

/** Maps a status string to a specific RGB color theme */
const getStatusColor = (s: string): RGB => {
  const v = (s || "").toLowerCase();
  if (v.includes("on track") || v.includes("safe") || v.includes("stable") || v.includes("normal") || v.includes("best") || v.includes("low"))
    return COLORS.emerald;
  if (v.includes("warn") || v.includes("caution") || v.includes("base") || v.includes("medium"))
    return COLORS.amber;
  return COLORS.scarlet;
};

/** Generates and saves a professional PDF intelligence report */
export const exportToPdf = async (
  data: DecisionCenterData,
  inputs: AllInputs,
  { language, currency, chartImages }: ExportOptions
) => {
  const L = language === "id";
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  const margin = 20;
  const contentWidth = W - margin * 2;
  let Y = 0;
  let pageNumber = 0;

  const setFill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
  const setDraw = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
  const setText = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
  const setFont = (w: "normal" | "bold" | "italic", s: number) => {
    doc.setFont("helvetica", w);
    doc.setFontSize(s);
  };

  const drawLine = (y: number, x1 = margin, x2 = W - margin, weight = 0.2, color = COLORS.gray) => {
    setDraw(color);
    doc.setLineWidth(weight);
    doc.line(x1, y, x2, y);
  };

/** Renders common page elements like header and footer */
  const renderShell = () => {
    pageNumber++;
    setFill(COLORS.white);
    doc.rect(0, 0, W, H, "F");
    
    // Header
    setFont("bold", 8);
    setText(COLORS.ink);
    doc.text("NOVARIS", margin, 12);
    setFont("normal", 8);
    setText(COLORS.gray);
    doc.text(L ? "INTELLIGENCE REPORT" : "INTELLIGENCE REPORT", margin + 16, 12);
    doc.text(`${L ? "Hal" : "Page"} ${pageNumber}`, W - margin, 12, { align: "right" });
    drawLine(15, margin, W - margin, 0.5, COLORS.ink);

    // Footer
    drawLine(H - 15, margin, W - margin, 0.2, COLORS.gray);
    setFont("normal", 7);
    setText(COLORS.gray);
    doc.text(`NOVARIS EXECUTIVE REPORT · ${new Date().toLocaleDateString()}`, margin, H - 10);
    doc.text("CONFIDENTIAL", W - margin, H - 10, { align: "right" });
  };

/** Renders a section title with a separator line */
  const renderSectionHeader = (title: string, y: number): number => {
    setFont("bold", 10);
    setText(COLORS.ink);
    doc.text(title.toUpperCase(), margin, y);
    drawLine(y + 2, margin, W - margin, 0.2, COLORS.gray);
    return y + 8;
  };

  // --- Page 1: Cover & Summary ---
  renderShell();
  
  // Logo
  try {
    const img = new Image();
    img.src = logo3;
    await new Promise((r) => { img.onload = r; img.onerror = r; });
    if (img.complete && img.naturalWidth > 0) {
      const lw = 25;
      const lh = (img.naturalHeight / img.naturalWidth) * lw;
      doc.addImage(img, "PNG", margin, 25, lw, lh);
    }
  } catch (_) {}

  Y = 60;
  setFont("bold", 24);
  setText(COLORS.ink);
  doc.text("Report summary", margin, Y);
  
  Y += 12;
  setFont("normal", 10);
  setText(COLORS.gray);
  doc.text(L ? "Analisis Risiko dan Keputusan Strategis" : "Risk Analysis and Strategic Decision Report", margin, Y);

  Y += 15;
  drawLine(Y, margin, W - margin, 0.5, COLORS.ink);
  Y += 10;

  // Key Info
  const info = [
    [L ? "ID LAPORAN" : "REPORT ID", `NOV-${Date.now().toString().slice(-8)}`],
    [L ? "TANGGAL" : "DATE", new Date().toLocaleDateString()],
    [L ? "MATA UANG" : "CURRENCY", currency],
    [L ? "STATUS RISIKO" : "RISK STATUS", (data.narrative?.riskLevel || "LOW").toUpperCase()]
  ];

  info.forEach(([lbl, val], i) => {
    setFont("bold", 8);
    setText(COLORS.gray);
    doc.text(lbl, margin, Y + i * 8);
    setFont("bold", 8);
    setText(val === info[3][1] ? getStatusColor(val) : COLORS.ink);
    doc.text(val, margin + 40, Y + i * 8);
  });

  Y += 40;
  Y = renderSectionHeader(L ? "Vonis Strategis" : "Strategic Verdict", Y);
  
  setFont("bold", 14);
  setText(COLORS.ink);
  const hlLines = doc.splitTextToSize(data.narrative?.headline || "", contentWidth);
  doc.text(hlLines, margin, Y);
  Y += hlLines.length * 7 + 5;

  setFont("normal", 10);
  setText(COLORS.ink);
  const recLines = doc.splitTextToSize(data.narrative?.recommendation || "", contentWidth);
  doc.text(recLines, margin, Y);
  Y += recLines.length * 5 + 10;

  // --- Section: KPI & Risk ---
  if (Y > H - 100) {
    doc.addPage();
    renderShell();
    Y = 25;
  } else {
    Y += 10;
  }

  Y = renderSectionHeader(L ? "Indikator Utama" : "Key Indicators", Y);
  
  autoTable(doc, {
    startY: Y,
    margin: { left: margin, right: margin },
    head: [[L ? "METRIK" : "METRIC", L ? "NILAI" : "VALUE", L ? "TARGET" : "TARGET", "STATUS"]],
    body: [
      ["Cash Runway", `${data.kpi.cashRunway?.adjustedRunway ?? "–"} Days`, ">= 90 Days", (data.kpi.cashRunway?.status || "").toUpperCase()],
      ["Revenue Gap", `${currency} ${formatWithDots(data.kpi.monthlyRevenue?.variance || 0)}`, "0 Variance", data.kpi.monthlyRevenue?.isOnTrack ? "ON TRACK" : "ACTION REQUIRED"],
      ["Burn Rate", `${currency} ${formatWithDots(data.kpi.dailyBurn?.currentRate || 0)}/day`, "Within Budget", data.kpi.dailyBurn?.isAccelerating ? "ACCELERATING" : "STABLE"],
    ],
    theme: "striped",
    headStyles: { fillColor: COLORS.ink, textColor: COLORS.white, fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: COLORS.ink },
    didParseCell(data) {
      if (data.section === 'body' && data.column.index === 3) {
        data.cell.styles.fontStyle = 'bold';
        const color = getStatusColor(data.cell.text[0]);
        data.cell.styles.textColor = color;
      }
    }
  });

  Y = (doc as any).lastAutoTable.finalY + 15;
  Y = renderSectionHeader(L ? "Arsitektur Risiko" : "Risk Architecture", Y);

  if (data.riskBridge?.length) {
    autoTable(doc, {
      startY: Y,
      margin: { left: margin, right: margin },
      head: [[L ? "PEMICU" : "TRIGGER", L ? "KONDISI" : "CONDITION", "STATUS"]],
      body: data.riskBridge.map(r => [r.triggerType, r.triggerCondition, r.isActive ? "ACTIVE" : "PENDING"]),
      theme: "striped",
      headStyles: { fillColor: COLORS.gray, textColor: COLORS.white, fontSize: 8 },
      bodyStyles: { fontSize: 8, textColor: COLORS.ink },
    });
  }

  // --- Section: Visual Analysis ---
  if (chartImages?.revenue || chartImages?.monteCarlo) {
    if (Y > H - 100) {
      doc.addPage();
      renderShell();
      Y = 25;
    } else {
      Y += 15;
    }
    Y = renderSectionHeader(L ? "Analisis Visual" : "Visual Analysis", Y);

    if (chartImages?.revenue) {
      setFont("bold", 9);
      setText(COLORS.ink);
      doc.text(L ? "Tren Pendapatan" : "Revenue Trends", margin, Y);
      Y += 5;
      doc.addImage(chartImages.revenue, "PNG", margin, Y, contentWidth, 60);
      Y += 70;
    }

    if (chartImages?.monteCarlo) {
      if (Y > 200) { doc.addPage(); renderShell(); Y = 25; }
      setFont("bold", 9);
      setText(COLORS.ink);
      doc.text(L ? "Distribusi Monte Carlo" : "Monte Carlo Distribution", margin, Y);
      Y += 5;
      doc.addImage(chartImages.monteCarlo, "PNG", margin, Y, contentWidth, 60);
      Y += 70;
    }
  }

  doc.save(`Novaris Report.pdf`);
};

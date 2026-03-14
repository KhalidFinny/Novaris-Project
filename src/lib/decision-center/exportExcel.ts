import * as XLS from "xlsx-js-style";
import type { DecisionCenterData, AllInputs } from "../../types/decisionCenter";
import { formatWithDots } from "../../utils/formatters";

type HEX = string;
type Cell = XLS.CellObject;

const COLORS = {
  ink: "0F172A",
  white: "FFFFFF",
  gray: "64748B",
  lightGray: "F1F5F9",
  emerald: "16A34A",
  amber: "D97606",
  scarlet: "A41624",
};

interface ExportOptions {
  language: "en" | "id";
  currency: string;
}

/** Maps a status string to a specific HEX color theme */
const getStatusHex = (s: string): HEX => {
  const v = (s || "").toLowerCase();
  if (v.includes("on track") || v.includes("safe") || v.includes("stable") || v.includes("normal") || v.includes("best") || v.includes("low"))
    return COLORS.emerald;
  if (v.includes("warn") || v.includes("caution") || v.includes("base") || v.includes("medium"))
    return COLORS.amber;
  return COLORS.scarlet;
};

/** Generates and saves a professional Excel intelligence report */
export const exportToExcel = (
  data: DecisionCenterData,
  inputs: AllInputs,
  { language, currency }: ExportOptions
) => {
  const L = language === "id";
  const wb = XLS.utils.book_new();
  const now = new Date().toLocaleString();
  
  const border = {
    top: { style: "thin" as XLS.BorderType, color: { rgb: "E2E8F0" } },
    bottom: { style: "thin" as XLS.BorderType, color: { rgb: "E2E8F0" } },
    left: { style: "thin" as XLS.BorderType, color: { rgb: "E2E8F0" } },
    right: { style: "thin" as XLS.BorderType, color: { rgb: "E2E8F0" } }
  };

  const s = {
    title: (): XLS.CellStyle => ({
      font: { bold: true, sz: 16, color: { rgb: COLORS.ink } },
      alignment: { vertical: "center" },
    }),
    header: (): XLS.CellStyle => ({
      font: { bold: true, sz: 11, color: { rgb: COLORS.white } },
      fill: { fgColor: { rgb: COLORS.ink }, patternType: "solid" },
      alignment: { vertical: "center", horizontal: "center" },
      border
    }),
    subHeader: (): XLS.CellStyle => ({
      font: { bold: true, sz: 10, color: { rgb: COLORS.ink } },
      fill: { fgColor: { rgb: COLORS.lightGray }, patternType: "solid" },
      alignment: { vertical: "center" },
      border
    }),
    cell: (): XLS.CellStyle => ({
      font: { sz: 10, color: { rgb: COLORS.ink } },
      alignment: { vertical: "center", wrapText: true },
      border
    }),
    boldCell: (): XLS.CellStyle => ({
      font: { bold: true, sz: 10, color: { rgb: COLORS.ink } },
      alignment: { vertical: "center" },
      border
    }),
    moneyCell: (): XLS.CellStyle => ({
      font: { sz: 10, color: { rgb: COLORS.ink } },
      alignment: { vertical: "center", horizontal: "right" },
      border
    }),
    statusCell: (color: HEX): XLS.CellStyle => ({
      font: { bold: true, sz: 10, color: { rgb: color } },
      alignment: { vertical: "center", horizontal: "center" },
      fill: { fgColor: { rgb: COLORS.lightGray }, patternType: "solid" },
      border
    }),
  };

/** Helper to create a formatted Excel cell with optional styles and formulas */
  const createCell = (v: any, style: XLS.CellStyle, formula?: string, numFmt?: string): Cell => {
    const isNum = typeof v === "number";
    return {
      v: v ?? (formula ? 0 : ""),
      t: (formula || isNum) ? "n" : "s",
      s: style,
      f: formula,
      z: numFmt,
    };
  };

  // --- Sheet 1: Report summary ---
  const ws1: XLS.WorkSheet = {};
  let r1 = 0;

  const writeR1 = (cells: (Cell | null)[]) => {
    cells.forEach((cell, i) => {
      if (!cell) return;
      ws1[XLS.utils.encode_cell({ r: r1, c: i })] = cell;
    });
    r1++;
  };

  // Branding & Header
  writeR1([createCell("Report summary", s.title()), null, null, null, null]);
  writeR1([createCell(`${L ? "Dihasilkan" : "Generated"}: ${now}`, s.cell())]);
  writeR1([]);

  // Strategic Verdict
  writeR1([createCell(L ? "VONIS STRATEGIS" : "STRATEGIC VERDICT", s.subHeader()), null, null, null, null]);
  writeR1([createCell(data.narrative?.headline || "–", s.boldCell()), null, null, null, null]);
  writeR1([createCell(data.narrative?.recommendation || "–", s.cell()), null, null, null, null]);
  writeR1([]);

  // Financial Architecture (KPIs with Formulas)
  writeR1([createCell(L ? "ARSITEKTUR KEUANGAN" : "FINANCIAL ARCHITECTURE", s.subHeader()), null, null, null, null]);
  writeR1([
    createCell(L ? "Metrik" : "Metric", s.header()),
    createCell(L ? "Nilai Saat Ini" : "Current Value", s.header()),
    createCell(L ? "Target" : "Target", s.header()),
    createCell(L ? "Varians" : "Variance", s.header()),
    createCell("Status", s.header()),
  ]);

  const kpiData = [
    { 
      label: "Monthly Revenue", 
      val: data.kpi.monthlyRevenue?.actualRevenue || 0, 
      tgt: data.kpi.monthlyRevenue?.targetRevenue || 0,
      fmt: `"${currency}" #,##0`,
      status: data.kpi.monthlyRevenue?.isOnTrack ? "ON TRACK" : "ACTION"
    },
    { 
      label: "Cash Runway", 
      val: data.kpi.cashRunway?.adjustedRunway || 0, 
      tgt: 90,
      fmt: `0 "Days"`,
      status: (data.kpi.cashRunway?.status || "monitor").toUpperCase()
    },
    { 
      label: "Daily Burn", 
      val: data.kpi.dailyBurn?.currentRate || 0, 
      tgt: 0, 
      fmt: `"${currency}" #,##0`,
      status: data.kpi.dailyBurn?.isAccelerating ? "ACCEL" : "NORMAL"
    }
  ];

  kpiData.forEach((k, i) => {
    const row = r1 + 1; // 1-indexed for formula
    const valAddr = XLS.utils.encode_cell({ r: r1, c: 1 });
    const tgtAddr = XLS.utils.encode_cell({ r: r1, c: 2 });
    
    writeR1([
      createCell(k.label, s.cell()),
      createCell(k.val, s.moneyCell(), undefined, k.fmt),
      createCell(k.tgt, s.moneyCell(), undefined, k.fmt),
      createCell(undefined, k.tgt === 0 ? s.moneyCell() : s.moneyCell(), `=${valAddr}-${tgtAddr}`, k.fmt),
      createCell(k.status, s.statusCell(getStatusHex(k.status))),
    ]);
  });

  writeR1([]);

  // Risks
  writeR1([createCell(L ? "INVENTARIS RISIKO" : "RISK INVENTORY", s.subHeader()), null, null, null, null]);
  writeR1([
    createCell(L ? "Pemicu" : "Trigger", s.header()),
    createCell(L ? "Kondisi" : "Condition", s.header()),
    createCell(L ? "Dampak" : "Impact", s.header()),
    createCell("Status", s.header()),
  ]);

  (data.riskBridge || []).forEach(rb => {
    writeR1([
      createCell(rb.triggerType, s.cell()),
      createCell(rb.triggerCondition, s.cell()),
      createCell(rb.effect, s.cell()),
      createCell(rb.isActive ? "ACTIVE" : "PENDING", s.statusCell(rb.isActive ? COLORS.scarlet : COLORS.amber)),
    ]);
  });

  ws1["!cols"] = [{ wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
  ws1["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Title
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Timestamp
    { s: { r: 3, c: 0 }, e: { r: 3, c: 4 } }, // Strategic Verdict Header
    { s: { r: 4, c: 0 }, e: { r: 4, c: 4 } }, // Headline
    { s: { r: 5, c: 0 }, e: { r: 5, c: 4 } }, // Rec
    { s: { r: 7, c: 0 }, e: { r: 7, c: 4 } }, // Financial Architecture Header
    { s: { r: 13, c: 0 }, e: { r: 13, c: 4 } }, // Risks Header
  ];

  ws1["!ref"] = XLS.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r1 - 1, c: 4 } });

  XLS.utils.book_append_sheet(wb, ws1, "Executive Insights");

  // --- Sheet 2: Strategic Intelligence Data ---
  const ws2: XLS.WorkSheet = {};
  let r2 = 0;
  const writeR2 = (cells: (Cell | null)[]) => {
    cells.forEach((cell, i) => {
      if (!cell) return;
      ws2[XLS.utils.encode_cell({ r: r2, c: i })] = cell;
    });
    r2++;
  };

  writeR2([createCell("RAW INTELLIGENCE DATA", s.title())]);
  writeR2([]);

  // Revenue Gap Data
  writeR2([createCell("REVENUE PERFORMANCE TRACKING", s.subHeader()), null, null, null]);
  writeR2([
    createCell("Week", s.header()),
    createCell("Actual", s.header()),
    createCell("Target", s.header()),
    createCell("Projected", s.header()),
  ]);

  const rev = data.charts?.revenueGap;
  if (rev) {
    rev.weeks.forEach((w, i) => {
      writeR2([
        createCell(w, s.cell()),
        createCell(rev.actual[i] || 0, s.moneyCell(), undefined, "#,##0"),
        createCell(rev.target[i] || 0, s.moneyCell(), undefined, "#,##0"),
        createCell(rev.projected[i] || 0, s.moneyCell(), undefined, "#,##0"),
      ]);
    });
  }

  writeR2([]);

  // Monte Carlo Distribution
  writeR2([createCell("MONTE CARLO PROBABILITY DISTRIBUTION", s.subHeader()), null]);
  writeR2([
    createCell("Outcome Value", s.header()),
    createCell("Probability Density", s.header()),
  ]);

  const mc = data.charts?.monteCarlo;
  if (mc?.distribution) {
    mc.distribution.forEach(pt => {
      writeR2([
        createCell(pt.x, s.cell(), undefined, "#,##0"),
        createCell(pt.y, s.cell(), undefined, "0.00%"),
      ]);
    });
  }

  ws2["!cols"] = [{ wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
  ws2["!ref"] = XLS.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r2 - 1, c: 3 } });

  XLS.utils.book_append_sheet(wb, ws2, "Strategic Data");

  XLS.writeFile(wb, `Novaris Report.xlsx`);
};

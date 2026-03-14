/**
 * Decision Center Types
 * 
 * Comprehensive type definitions for the Decision Center
 * following the Novaris Blueprint v1.1 specification
 */

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// Simplified inputs - 4 essential + 4 delay-related
export interface EssentialInputs {
  cashInBank: number | "";          
  monthlyBills: number | "";         
  monthlyRevenue: number | "";       
  monthlyRevenueTarget?: number | ""; 
  biggestClientPercent: number | ""; 
}

export interface DelayRiskInputs {
  projectTargetDays: number | "";    
  paymentAtRisk: number | "";       
  teamSize: number | "";            
  bufferDays: number | "";          
}

export interface ProjectInputs {
  id: string;
  name: string;
  plannedDeliveryDate: string;
  linkedPaymentAmount: number | "";
  status: 'active' | 'stalled' | 'delayed' | 'complete';
  delayToleranceDays: number | "";
  teamSize: number | "";
  complexityScore: number | "";
  supplierVarianceDays: number | "";
  externalDependencies: number | "";
  historicalDelayRate: number | "";
  bufferDaysRemaining: number | "";
}

export interface ComplianceItem {
  id: string;
  name: string;
  dueDate: string;
  recurrence: 'once' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  status: 'complete' | 'pending' | 'overdue';
}

export interface ComplianceInputs {
  items: ComplianceItem[];
  auditDate: string | null;
}

export interface SimulationSettings {
  timeHorizon: 30 | 60 | 90;
  revenueAssumption: 'conservative' | 'base' | 'optimistic';
  expenseVolatility: number; // 0-20%
  projectDeliveryConfidence: number; // 0-100%
}

export interface RiskThresholds {
  cashThresholdDays: number; // default 45
  projectDelayTolerance: number; // default 3
  burnRateAccelerationTrigger: number; // default 15%
  stallDetectionWindow: number; // default 5
}

export interface ScenarioSliders {
  cashInjection: number | "";
  projectAccelerationWeeks: number | "";
  overheadReduction: number | "";
  earlyARCollectionRate: number | "";
  newRevenue30d: number | "";
}

export interface AllInputs {
  essentials: EssentialInputs;
  delayRisk: DelayRiskInputs;
  scenario: ScenarioSliders;
  activeScenario: string | null;
}

export interface CashRunwayCalculation {
  cashInBank: number;
  monthlyBills: number;
  dailyBurnRate: number;
  baseRunway: number;
  adjustedRunway: number;
  status: 'safe' | 'monitor' | 'warning' | 'critical';
}

export interface MonthlyRevenueCalculation {
  actualRevenue: number;
  targetRevenue: number | null;
  breakEvenRevenue: number;
  variance: number;
  variancePercent: number;
  isOnTrack: boolean;
}

export interface DailyBurnCalculation {
  currentRate: number;
  trendPercent: number;
  isAccelerating: boolean;
}

export interface ComplianceCalculation {
  baseScore: number;
  penalty: number;
  finalScore: number;
}

export interface KPIStripData {
  cashRunway: CashRunwayCalculation | null;
  monthlyRevenue: MonthlyRevenueCalculation | null;
  dailyBurn: DailyBurnCalculation | null;
  compliance: ComplianceCalculation | null;
}

export interface NarrativeTemplate {
  id: string;
  category: 'cash' | 'project' | 'revenue' | 'compound' | 'opportunity';
  priority: number;
  conditions: {
    cashRunwayStatus?: 'safe' | 'monitor' | 'warning' | 'critical';
    minRunwayDays?: number;
    maxRunwayDays?: number;
    projectDelayActive?: boolean;
    projectDataPresent?: boolean;
    burnAccelerating?: boolean;
    revenueGapPercent?: number;
    maxRevenueGapPercent?: number;
    minClientDependencyPercent?: number;
    maxClientDependencyPercent?: number;
    complianceOverdue?: boolean;
    multipleRisks?: boolean;
  };
  headline: string;
  unseenRisk: string;
  contextualImpact: string;
  recommendation: string;
  riskLevel: RiskLevel;
}

export interface DecisionNarrative {
  templateId: string;
  headline: string;
  unseenRisk: string;
  contextualImpact: string;
  recommendation: string;
  riskLevel: RiskLevel;
  probability: number;
  activeTab: 'story' | 'numbers' | 'scenarios' | 'actions';
}

export interface RiskBridgePair {
  id: string;
  triggerType: 'finance' | 'operations';
  triggerCondition: string;
  triggerValue: string;
  effect: string;
  effectDescription: string;
  isActive: boolean;
}

export interface DominoNode {
  step: number;
  label: string;
  impact: string;
  color: 'scarlet' | 'amber' | 'steel' | 'neutral';
}

export interface DominoChain {
  nodes: DominoNode[];
  probability: number;
}

export interface ChartData {
  revenueGap: {
    weeks: string[];
    actual: number[];
    target: number[];
    projected: number[];
  };
  lfi: {
    score: number;
    daysCover: number;
    currentRatio: number;
    arAtRisk: number;
  };
  monteCarlo: {
    worst: { probability: number; outcome: number };
    base: { probability: number; outcome: number };
    best: { probability: number; outcome: number };
    distribution: { x: number; y: number }[];
  };
}

export interface RiskScore {
  category: string;
  score: number;
  trend: 'improving' | 'stable' | 'worsening';
  exposureWidth: number;
}

export interface ScenarioOutput {
  projectedRunway: number;
  runwayDelta: number;
  revenueGapProjection: number;
  gapDelta: number;
  shieldLevel: 0 | 1 | 2 | 3;
  narrativeSummary: string;
}

export interface AnalysisData {
  riskScores: RiskScore[];
  scenarioOutput: ScenarioOutput | null;
}

export interface ScenarioSnapshot {
  id: string;
  label: string;
  createdAt: string;
  inputs: AllInputs;
}

export interface ResilienceShield {
  level: 0 | 1 | 2 | 3;
  conditions: {
    lfi: number;
    runway: number;
    revenueGap: number;
    compliance: number;
    currentRatio: number;
    burnTrend: 'stable' | 'increasing' | 'decreasing';
    projectsOnSchedule: boolean;
  };
}

export interface DecisionCenterData {
  kpi: KPIStripData;
  narrative: DecisionNarrative | null;
  riskBridge: RiskBridgePair[];
  dominoChain: DominoChain | null;
  charts: ChartData | null;
  analysis: AnalysisData;
  shield: ResilienceShield;
  isCalculating: boolean;
  lastUpdated: Date | null;
}

export type ZoneId = 'kpi' | 'narrative' | 'risk-bridge' | 'domino' | 'charts' | 'analysis';

export interface ZoneConfig {
  id: ZoneId;
  label: string;
  labelId: string;
  description: string;
  descriptionId: string;
}

import { expect, test, describe } from "vitest";
import { calculateDecisionCenter } from "./decisionCenterEngine";
import { AllInputs } from "../../types/decisionCenter";

describe("decisionCenterEngine", () => {
  const mockInputs: AllInputs = {
    essentials: {
      cashInBank: 50000,
      monthlyBills: 5000,
      monthlyRevenue: 6000,
      monthlyRevenueTarget: 8000,
      biggestClientPercent: 30,
    },
    delayRisk: {
      projectTargetDays: 30,
      paymentAtRisk: 10000,
      teamSize: 3,
      bufferDays: 5,
    },
    scenario: {
      cashInjection: "",
      projectAccelerationWeeks: "",
      overheadReduction: "",
      earlyARCollectionRate: "",
      newRevenue30d: "",
    },
    activeScenario: null,
  };

  test("should calculate correct KPIs", () => {
    const result = calculateDecisionCenter(mockInputs, "en");
    expect(result.kpi.cashRunway?.baseRunway).toBe(10); // 50000 / (5000/30) = 50000 / 166.6 = 300 days? Wait.
    // cashInBank: 50000
    // monthlyBills: 5000
    // dailyBurn: 5000 / 30 = 166.6
    // baseRunway: 50000 / 166.6 = 300
    
    // Let's re-check the logic in calculateCashRunway:
    // const dailyBurn = monthlyBills / 30;
    // const baseRunway = Math.floor(cash / dailyBurn);
    
    expect(result.kpi.cashRunway?.baseRunway).toBe(300);
    expect(result.kpi.monthlyRevenue?.variance).toBe(-2000); // 6000 - 8000
  });

  test("should generate narrative with correct variable replacement", () => {
    const result = calculateDecisionCenter(mockInputs, "en");
    expect(result.narrative).not.toBeNull();
    
    // Check if variables like {{runwayDays}} are replaced
    if (result.narrative) {
      expect(result.narrative.headline).not.toContain("{{runwayDays}}");
      expect(result.narrative.contextualImpact).not.toContain("{{dailyBurn}}");
    }
  });
});

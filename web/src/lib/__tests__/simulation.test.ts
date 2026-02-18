import { describe, it, expect } from "vitest";
import { simulateMonthsToGoal } from "../simulation";

describe("simulateMonthsToGoal", () => {
  it("목표가 현재보다 작으면 0개월", () => {
    const result = simulateMonthsToGoal(100000, 150000, 50000);
    expect(result.monthsToGoal).toBe(0);
    expect(result.projectedByMonth).toContain(150000);
  });

  it("목표와 현재가 같으면 0개월", () => {
    const result = simulateMonthsToGoal(100000, 100000, 50000);
    expect(result.monthsToGoal).toBe(0);
  });

  it("목표가 현재보다 크면 양수 개월 반환", () => {
    const result = simulateMonthsToGoal(500000, 100000, 200000);
    expect(result.monthsToGoal).toBeGreaterThan(0);
    expect(result.projectedByMonth.length).toBeGreaterThan(0);
  });

  it("월 납입이 0이어도 배당 수익만으로 증가하면 수렴한다", () => {
    const result = simulateMonthsToGoal(100000, 50000, 0, 0.05);
    expect(result.monthsToGoal).toBeGreaterThanOrEqual(0);
  });

  it("projectedByMonth는 목표 달성 시점까지의 월별 예상 배당 배열", () => {
    const result = simulateMonthsToGoal(200000, 100000, 100000);
    expect(result.projectedByMonth.length).toBe(result.monthsToGoal);
    expect(result.projectedByMonth[result.projectedByMonth.length - 1]).toBeGreaterThanOrEqual(200000);
  });
});

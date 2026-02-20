import { describe, it, expect } from "vitest";

/**
 * 대시보드 byCategory / seedMoney 계산 로직 (API에서 사용하는 알고리즘)
 * 순수 함수로 추출하여 단위 테스트
 */
function computeByCategory(
  categories: [string, string][],
  budgetByCat: Map<string, number>,
  expenseByCat: Map<string, number>
): { seedMoney: number; byCategory: Array<{ categoryName: string; budget: number; actual: number; saved: number }> } {
  let seedMoney = 0;
  const byCategory: Array<{ categoryName: string; budget: number; actual: number; saved: number }> = [];

  for (const [catId, catName] of categories) {
    const budget = budgetByCat.get(catId) ?? 0;
    const actual = expenseByCat.get(catId) ?? 0;
    const saved = Math.max(0, budget - actual);
    seedMoney += saved;
    byCategory.push({ categoryName: catName, budget, actual, saved });
  }

  return { seedMoney, byCategory };
}

describe("computeByCategory (대시보드 계산 로직)", () => {
  it("예산-실지출이 양수면 절약액으로 합산된다", () => {
    const categories: [string, string][] = [["1", "식비"], ["2", "교통"]];
    const budgetByCat = new Map([["1", 400000], ["2", 100000]]);
    const expenseByCat = new Map([["1", 350000], ["2", 80000]]);

    const result = computeByCategory(categories, budgetByCat, expenseByCat);

    expect(result.seedMoney).toBe(70000); // 5만 + 2만
    expect(result.byCategory[0].saved).toBe(50000);
    expect(result.byCategory[1].saved).toBe(20000);
  });

  it("실지출이 예산 초과면 절약은 0이다", () => {
    const categories: [string, string][] = [["1", "식비"]];
    const budgetByCat = new Map([["1", 300000]]);
    const expenseByCat = new Map([["1", 400000]]);

    const result = computeByCategory(categories, budgetByCat, expenseByCat);

    expect(result.seedMoney).toBe(0);
    expect(result.byCategory[0].saved).toBe(0);
  });

  it("예산만 있고 지출 없으면 전액 절약", () => {
    const categories: [string, string][] = [["1", "식비"]];
    const budgetByCat = new Map([["1", 500000]]);
    const expenseByCat = new Map<string, number>();

    const result = computeByCategory(categories, budgetByCat, expenseByCat);

    expect(result.seedMoney).toBe(500000);
    expect(result.byCategory[0].actual).toBe(0);
    expect(result.byCategory[0].saved).toBe(500000);
  });
});

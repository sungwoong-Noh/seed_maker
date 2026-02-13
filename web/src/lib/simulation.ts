/**
 * 배당 목표 달성 시뮬레이션 (MVP: 간소화된 복리 재투자 모델)
 * monthlyDeposit = seedMoney + extraDeposit
 * 평균 배당 수익률(연) 가정
 */

export function simulateMonthsToGoal(
  targetMonthlyDividend: number,
  currentMonthlyDividend: number,
  monthlyDeposit: number,
  avgDividendYieldAnnual: number = 0.03
): { monthsToGoal: number; projectedByMonth: number[] } {
  if (targetMonthlyDividend <= currentMonthlyDividend) {
    return { monthsToGoal: 0, projectedByMonth: [currentMonthlyDividend] };
  }

  const monthlyYield = avgDividendYieldAnnual / 12;
  let portfolioValue = (currentMonthlyDividend * 12) / avgDividendYieldAnnual;
  const targetPortfolioValue = (targetMonthlyDividend * 12) / avgDividendYieldAnnual;
  const projectedByMonth: number[] = [];
  let month = 0;
  const maxMonths = 600;

  while (monthlyDeposit > 0 || portfolioValue < targetPortfolioValue) {
    const monthlyDividend = portfolioValue * monthlyYield;
    portfolioValue += monthlyDeposit + monthlyDividend;
    const currentDiv = portfolioValue * monthlyYield;
    projectedByMonth.push(Math.round(currentDiv));

    if (currentDiv >= targetMonthlyDividend) {
      return { monthsToGoal: month + 1, projectedByMonth };
    }
    month++;
    if (month >= maxMonths) break;
  }

  return {
    monthsToGoal: month,
    projectedByMonth,
  };
}

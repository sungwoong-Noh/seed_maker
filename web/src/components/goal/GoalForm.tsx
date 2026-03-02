"use client";

import { useState } from "react";
import Link from "next/link";
import { useDividendGoal } from "@/hooks/useDividendGoal";
import { useDividendStocks } from "@/hooks/useDividendStocks";
import { formatKRW, formatNumberWithComma } from "@/lib/format";
import { simulateMonthsToGoal } from "@/lib/simulation";
import { showSuccess, showError } from "@/lib/toast";
import { BottomNav } from "@/components/common/BottomNav";

type Props = {
  userId: string;
};

type GoalFormFieldsProps = {
  goal: { target_monthly_dividend?: number | null; extra_monthly_deposit?: number | null; monthly_salary?: number | null } | null;
  currentDividend: number;
  upsertGoal: (v: { target_monthly_dividend: number; extra_monthly_deposit?: number; monthly_salary?: number }) => Promise<unknown>;
};

function GoalFormFields({ goal, currentDividend, upsertGoal }: GoalFormFieldsProps) {
  const [targetMonthlyDividend, setTargetMonthlyDividend] = useState(
    () => (goal ? String(goal.target_monthly_dividend ?? "") : "")
  );
  const [extraMonthlyDeposit, setExtraMonthlyDeposit] = useState(
    () => (goal ? String(goal.extra_monthly_deposit ?? "") : "")
  );
  const [monthlySalary, setMonthlySalary] = useState(
    () => (goal?.monthly_salary ? String(goal.monthly_salary) : "")
  );
  const [saved, setSaved] = useState(false);

  const extra = parseInt(extraMonthlyDeposit.replace(/\D/g, "") || "0", 10);
  const target = parseInt(targetMonthlyDividend.replace(/\D/g, ""), 10);
  const { monthsToGoal } =
    target > 0
      ? simulateMonthsToGoal(target, currentDividend, extra)
      : { monthsToGoal: null };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const targetNum = parseInt(targetMonthlyDividend.replace(/\D/g, ""), 10);
    const extraNum = parseInt(extraMonthlyDeposit.replace(/\D/g, "") || "0", 10);

    if (!targetNum) {
      showError("목표 월 배당금을 입력해주세요");
      return;
    }

    const salaryNum = parseInt(monthlySalary.replace(/\D/g, "") || "0", 10);

    try {
      await upsertGoal({
        target_monthly_dividend: targetNum,
        extra_monthly_deposit: extraNum,
        monthly_salary: salaryNum,
      });
      showSuccess("목표가 저장되었습니다");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("[GoalForm] Error:", err);
      showError("목표 저장에 실패했습니다");
    }
  }

  return (
    <>
      {target > 0 && monthsToGoal !== null && (
        <div className="rounded-xl bg-gray-50 p-5 min-h-[140px] flex flex-col justify-center gap-2 transition-shadow duration-200 hover:shadow-md">
          <p className="text-base font-semibold text-gray-900">목표 달성까지</p>
          <p className="text-[32px] font-bold text-emerald-700">
            {monthsToGoal === 0 ? "🎉 달성!" : `${monthsToGoal}개월`}
          </p>
          {monthsToGoal > 0 && (
            <p className="text-sm text-gray-600">
              {new Date(new Date().setMonth(new Date().getMonth() + monthsToGoal)).getFullYear()}년{" "}
              {new Date(new Date().setMonth(new Date().getMonth() + monthsToGoal)).getMonth() + 1}월
              예상
            </p>
          )}
          <p className="text-xs text-gray-600">* 평균 배당 수익률 3% 가정</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl bg-white p-4 min-h-[80px] flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">고정 급여 (월)</label>
          <div className="flex items-center gap-1 rounded-lg bg-gray-50 h-10 px-3">
            <span className="text-base text-gray-600">₩</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatNumberWithComma(monthlySalary)}
              onChange={(e) =>
                setMonthlySalary(e.target.value.replace(/\D/g, ""))
              }
              placeholder="3,000,000"
              className="flex-1 text-base text-gray-900 bg-transparent outline-none"
            />
          </div>
          <p className="text-xs text-gray-500">투자 가능 금액 계산에 사용됩니다</p>
        </div>

        <div className="rounded-xl bg-white p-4 min-h-[80px] flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">목표 월 배당금</label>
          <div className="flex items-center gap-1 rounded-lg bg-gray-50 h-10 px-3">
            <span className="text-base text-gray-600">₩</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatNumberWithComma(targetMonthlyDividend)}
              onChange={(e) =>
                setTargetMonthlyDividend(e.target.value.replace(/\D/g, ""))
              }
              placeholder="1,000,000"
              className="flex-1 text-base text-gray-900 bg-transparent outline-none"
              required
            />
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 min-h-[80px] flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">추가 월 납입액</label>
          <div className="flex items-center gap-1 rounded-lg bg-gray-50 h-10 px-3">
            <span className="text-base text-gray-600">₩</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatNumberWithComma(extraMonthlyDeposit)}
              onChange={(e) =>
                setExtraMonthlyDeposit(e.target.value.replace(/\D/g, ""))
              }
              placeholder="500,000"
              className="flex-1 text-base text-gray-900 bg-transparent outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-emerald-700 flex items-center justify-center text-base font-semibold text-white hover:bg-emerald-800 active:scale-[0.98] transition-all duration-150"
        >
          {saved ? "저장됨 ✓" : "저장"}
        </button>
      </form>
    </>
  );
}

export function GoalForm({ userId }: Props) {
  const { goal, isLoading, upsertGoal } = useDividendGoal(userId);
  const { stocks } = useDividendStocks(userId);
  const currentDividend = stocks.reduce((sum, s) => {
    return sum + (Number(s.quantity) * Number(s.dividend_per_share)) / 12;
  }, 0);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg pb-24">
        <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 border-b border-gray-100">
          <Link
            href="/"
            className="text-2xl text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded"
            aria-label="뒤로 가기"
          >
            ←
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">목표 설정</h1>
        </header>
        <main id="main-content" className="px-4 py-6 space-y-4" tabIndex={-1}>
          <div className="rounded-xl bg-gray-50 p-5 space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 border-b border-gray-100">
        <Link
          href="/"
          className="text-2xl text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded"
          aria-label="뒤로 가기"
        >
          ←
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">목표 설정</h1>
      </header>

      <main id="main-content" className="p-4 space-y-4" tabIndex={-1}>
        <GoalFormFields
          key={goal?.id ?? "new"}
          goal={goal}
          currentDividend={currentDividend}
          upsertGoal={upsertGoal}
        />
      </main>

      <BottomNav />
    </div>
  );
}

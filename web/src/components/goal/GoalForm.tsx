"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDividendGoal } from "@/hooks/useDividendGoal";
import { useDashboard } from "@/hooks/useDashboard";
import { formatKRW } from "@/lib/format";
import { simulateMonthsToGoal } from "@/lib/simulation";
import { showSuccess, showError } from "@/lib/toast";
import { BottomNav } from "@/components/common/BottomNav";

type Props = {
  userId: string;
  yearMonth: string;
};

export function GoalForm({ userId, yearMonth }: Props) {
  const { goal, isLoading, upsertGoal } = useDividendGoal(userId);
  const { data: dashboard } = useDashboard(userId, yearMonth);

  const [targetMonthlyDividend, setTargetMonthlyDividend] = useState("");
  const [extraMonthlyDeposit, setExtraMonthlyDeposit] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (goal) {
      setTargetMonthlyDividend(String(goal.target_monthly_dividend || ""));
      setExtraMonthlyDeposit(String(goal.extra_monthly_deposit || ""));
    }
  }, [goal]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const target = parseInt(targetMonthlyDividend.replace(/\D/g, ""), 10);
    const extra = parseInt(extraMonthlyDeposit.replace(/\D/g, "") || "0", 10);
    
    if (!target) {
      showError('목표 월 배당금을 입력해주세요');
      return;
    }

    try {
      await upsertGoal({
        target_monthly_dividend: target,
        extra_monthly_deposit: extra,
      });
      showSuccess('목표가 저장되었습니다');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('[GoalForm] Error:', err);
      showError('목표 저장에 실패했습니다');
    }
  }

  const seedMoney = dashboard?.seedMoney ?? 0;
  const currentDividend = dashboard?.currentMonthlyDividend ?? 0;
  const extra = parseInt(extraMonthlyDeposit.replace(/\D/g, "") || "0", 10);
  const monthlyDeposit = seedMoney + extra;

  const target = parseInt(targetMonthlyDividend.replace(/\D/g, ""), 10);
  const { monthsToGoal } =
    target > 0
      ? simulateMonthsToGoal(target, currentDividend, monthlyDeposit)
      : { monthsToGoal: null };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg pb-24">
        <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 border-b border-gray-100">
          <Link href="/" className="text-2xl text-gray-900">←</Link>
          <h1 className="text-xl font-semibold text-gray-900">목표 설정</h1>
        </header>
        <main className="px-4 py-6 space-y-4">
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
        <Link href="/" className="text-2xl text-gray-900">←</Link>
        <h1 className="text-xl font-semibold text-gray-900">목표 설정</h1>
      </header>

      <main className="p-4 space-y-4">
        {/* 목표 달성까지 카드 - Pencil: height 140, padding 20, gap 8 */}
        {target > 0 && monthsToGoal !== null && (
          <div className="rounded-xl bg-gray-50 p-5 min-h-[140px] flex flex-col justify-center gap-2">
            <p className="text-base font-semibold text-gray-900">목표 달성까지</p>
            <p className="text-[32px] font-bold text-emerald-600">
              {monthsToGoal === 0 ? "🎉 달성!" : `${monthsToGoal}개월`}
            </p>
            {monthsToGoal > 0 && (
              <p className="text-sm text-gray-500">
                {new Date(new Date().setMonth(new Date().getMonth() + monthsToGoal)).getFullYear()}년{" "}
                {new Date(new Date().setMonth(new Date().getMonth() + monthsToGoal)).getMonth() + 1}월 예상
              </p>
            )}
            <p className="text-xs text-gray-500">* 평균 배당 수익률 3% 가정</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 목표 월 배당금 - Pencil: outer height 80, padding 16 / inner height 40, padding 12 */}
          <div className="rounded-xl bg-white p-4 min-h-[80px] flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">
              목표 월 배당금
            </label>
            <div className="flex items-center gap-1 rounded-lg bg-gray-50 h-10 px-3">
              <span className="text-base text-gray-500">₩</span>
              <input
                type="text"
                inputMode="numeric"
                value={targetMonthlyDividend}
                onChange={(e) =>
                  setTargetMonthlyDividend(e.target.value.replace(/\D/g, ""))
                }
                placeholder="1,000,000"
                className="flex-1 text-base text-gray-900 bg-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* 추가 월 납입액 - Pencil: same structure */}
          <div className="rounded-xl bg-white p-4 min-h-[80px] flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-900">
              추가 월 납입액
            </label>
            <div className="flex items-center gap-1 rounded-lg bg-gray-50 h-10 px-3">
              <span className="text-base text-gray-500">₩</span>
              <input
                type="text"
                inputMode="numeric"
                value={extraMonthlyDeposit}
                onChange={(e) =>
                  setExtraMonthlyDeposit(e.target.value.replace(/\D/g, ""))
                }
                placeholder="0"
                className="flex-1 text-base text-gray-900 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* 씨앗돈 정보 - Pencil: height 60, padding 12, cornerRadius 8 */}
          <div className="rounded-lg bg-gray-50 p-3 min-h-[60px] flex flex-col justify-center gap-1">
            <p className="text-sm text-gray-500">이번 달 씨앗돈: {formatKRW(seedMoney)}</p>
            <p className="text-sm text-gray-500">월 총 납입 예상: {formatKRW(monthlyDeposit)}</p>
          </div>

          {/* 저장 버튼 - Pencil: height 48, padding 12 */}
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-base font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            {saved ? "저장됨 ✓" : "저장"}
          </button>
        </form>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}

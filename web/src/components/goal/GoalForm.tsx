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
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-100 bg-white/90 px-4 py-3 backdrop-blur">
          <Link href="/" className="text-lg font-bold text-emerald-800">
            🌱 Seed Maker
          </Link>
          <h2 className="text-sm font-medium text-gray-700">목표 설정</h2>
        </header>
        <main className="px-4 py-6 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="h-4 w-24 bg-gray-200 rounded mb-3 animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg lg:max-w-4xl pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-100 bg-white/90 px-4 py-3 backdrop-blur">
        <Link href="/" className="text-lg font-bold text-emerald-800 hover:text-emerald-900 transition-colors">
          🌱 Seed Maker
        </Link>
        <h2 className="text-sm font-medium text-gray-700">목표 설정</h2>
      </header>

      <main className="px-4 py-6 space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 text-sm text-amber-800">
          * 시뮬레이션은 참고용입니다. 평균 배당 수익률 3% 가정.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              목표 월 배당금 (원) *
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={targetMonthlyDividend}
              onChange={(e) =>
                setTargetMonthlyDividend(e.target.value.replace(/\D/g, ""))
              }
              placeholder="1000000"
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              추가 월 납입액 (원)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={extraMonthlyDeposit}
              onChange={(e) =>
                setExtraMonthlyDeposit(e.target.value.replace(/\D/g, ""))
              }
              placeholder="0"
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <p className="mt-0.5 text-xs text-gray-500">
              씨앗돈 외 추가로 투자할 금액
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            <p>이번 달 씨앗돈: {formatKRW(seedMoney)}</p>
            <p>월 총 납입 예상: {formatKRW(monthlyDeposit)}</p>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white hover:bg-emerald-700"
          >
            {saved ? "저장됨 ✓" : "저장"}
          </button>
        </form>

        {target > 0 && (
          <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-emerald-600">
              시뮬레이션 결과
            </h3>
            <p className="mt-2 text-xl font-bold text-emerald-800">
              현재 월 배당: {formatKRW(currentDividend)}
            </p>
            <p className="mt-2 text-lg font-semibold text-emerald-700">
              {monthsToGoal !== null
                ? monthsToGoal === 0
                  ? "🎉 목표 달성!"
                  : `목표 달성까지 약 ${monthsToGoal}개월`
                : "목표를 저장하면 결과가 표시됩니다"}
            </p>
          </section>
        )}
      </main>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}

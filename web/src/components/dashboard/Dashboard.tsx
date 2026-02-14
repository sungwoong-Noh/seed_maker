"use client";

import { useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { useExpenses } from "@/hooks/useExpenses";
import { useAuth } from "@/hooks/useAuth";
import { AddExpenseModal } from "./AddExpenseModal";
import { formatKRW } from "@/lib/format";
import { BottomNav } from "@/components/common/BottomNav";

type Props = {
  userId: string;
  yearMonth: string;
  userEmail: string;
};

export function Dashboard({ userId, yearMonth, userEmail }: Props) {
  const { data, isLoading, error } = useDashboard(userId, yearMonth);
  const { expenses } = useExpenses(userId, yearMonth);
  const { signOut } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-emerald-600">로딩 중...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-center text-red-600">
          데이터를 불러올 수 없습니다. Supabase SQL Editor에서 마이그레이션을 실행했는지 확인하세요.
        </p>
        <p className="text-center text-sm text-gray-500">
          supabase/migrations/20250213000000_initial_schema.sql
        </p>
        {error && (
          <p className="max-w-md text-center text-xs text-gray-500">
            {String(error)}
          </p>
        )}
      </div>
    );
  }

  const progressPercent = Math.min(100, data.progressPercent);

  return (
    <div className="mx-auto max-w-lg md:max-w-3xl lg:max-w-5xl pb-24 min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 md:px-6 lg:px-8 py-4 border-b border-gray-100">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Seed Maker</h1>
        <button
          onClick={() => signOut()}
          className="text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors"
        >
          ⚙️
        </button>
      </header>

      <main className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
        {/* 주요 카드 (태블릿 이상에서 2열) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* 씨앗돈 카드 */}
          <section className="rounded-xl bg-gray-50 p-5 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">🌱 이번 달 씨앗돈</h2>
            <p className="mt-3 text-4xl md:text-5xl font-bold text-emerald-600">
              {formatKRW(data.seedMoney)}
            </p>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              씨앗 {data.seedCount}알 수확!
            </p>
          </section>

          {/* 목표 진행률 */}
          {data.targetMonthlyDividend > 0 && (
            <section className="rounded-xl bg-gray-50 p-5 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">목표 월 배당금</h2>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-gray-900">
                  {formatKRW(data.currentMonthlyDividend)}
                </span>
                <span className="text-sm md:text-base text-gray-500">/ {formatKRW(data.targetMonthlyDividend)}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-sm md:text-base text-gray-600">
                {data.monthsToGoal != null
                  ? `목표 달성까지 약 ${data.monthsToGoal}개월`
                  : "목표를 설정해보세요"}
              </p>
            </section>
          )}
        </div>

        {/* 스트릭 */}
        {data.streakDays > 0 && (
          <section className="rounded-xl bg-amber-50 p-4 md:p-5">
            <p className="text-center text-base md:text-lg font-semibold text-amber-700">
              🔥 {data.streakDays}일 연속 기록 중!
            </p>
          </section>
        )}

        {/* 하단 섹션 (데스크톱에서 2열) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* 카테고리별 예산 vs 실지출 */}
          {data.byCategory.length > 0 && (
            <section>
              <h2 className="mb-3 text-base md:text-lg font-semibold text-gray-900">
                카테고리별 절약 현황
              </h2>
              <div className="space-y-2 md:space-y-3">
                {data.byCategory
                  .filter((c) => c.budget > 0 || c.actual > 0)
                  .map((c) => (
                      <div
                        key={c.categoryId}
                        className="flex items-center justify-between rounded-xl bg-gray-50 px-4 md:px-5 py-3 md:py-4"
                      >
                        <span className="text-sm md:text-base font-medium text-gray-900">
                          {c.categoryName}
                        </span>
                        <div className="text-right text-sm md:text-base">
                          <span className="text-gray-600">
                            {formatKRW(c.actual)} / {formatKRW(c.budget)}
                          </span>
                          {c.saved > 0 && (
                            <span className="ml-2 font-semibold text-emerald-600">
                              +{formatKRW(c.saved)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
              </div>
            </section>
          )}

          {/* 최근 지출 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">최근 지출</h2>
              <Link
                href="/expenses"
                className="text-sm md:text-base font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                전체 보기 →
              </Link>
            </div>
            <div className="space-y-2 md:space-y-3">
              {expenses.slice(0, 5).map((e: { id: string; amount: number; spent_at: string; category?: { name: string } }) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 md:px-5 py-3 md:py-4"
                >
                  <div>
                    <p className="text-base md:text-lg font-semibold text-gray-900">{formatKRW(e.amount)}</p>
                    <p className="text-sm md:text-base text-gray-600 mt-0.5">
                      {(e.category as { name?: string })?.name ?? "-"} · {e.spent_at}
                    </p>
                  </div>
                </div>
              ))}
              {expenses.length === 0 && (
                <div className="py-12 text-center">
                  <div className="text-3xl md:text-4xl mb-2">📝</div>
                  <p className="text-sm md:text-base text-gray-600">아직 지출 기록이 없어요</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-20 right-4 md:right-6 lg:right-8 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
        aria-label="지출 추가"
      >
        <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {showAddModal && (
        <AddExpenseModal
          userId={userId}
          yearMonth={yearMonth}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => setShowAddModal(false)}
        />
      )}

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { useExpenses } from "@/hooks/useExpenses";
import { useAuth } from "@/hooks/useAuth";
import { AddExpenseModal } from "./AddExpenseModal";
import { formatKRW } from "@/lib/format";

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
    <div className="mx-auto max-w-lg lg:max-w-4xl pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-100 bg-white/90 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-bold text-emerald-800">🌱 Seed Maker</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden sm:inline">{userEmail}</span>
          <button
            onClick={() => signOut()}
            className="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        {/* 씨앗돈 카드 */}
        <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-1">
          <h2 className="text-sm font-medium text-emerald-600">이번 달 씨앗돈</h2>
          <p className="mt-2 text-3xl lg:text-4xl font-bold text-emerald-800">
            {formatKRW(data.seedMoney)}
          </p>
          <p className="mt-1 text-emerald-600">
            🌱 씨앗 {data.seedCount}알 수확!
          </p>
        </section>

        {/* 목표 진행률 */}
        {data.targetMonthlyDividend > 0 && (
          <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-1">
            <h2 className="text-sm font-medium text-emerald-600">목표 월 배당금</h2>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl lg:text-3xl font-bold text-emerald-800">
                {formatKRW(data.currentMonthlyDividend)}
              </span>
              <span className="text-sm text-gray-500">/ {formatKRW(data.targetMonthlyDividend)}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-emerald-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-emerald-600">
              {data.monthsToGoal != null
                ? `목표 달성까지 약 ${data.monthsToGoal}개월`
                : "목표를 설정해보세요"}
            </p>
          </section>
        )}

        {/* 스트릭 */}
        {data.streakDays > 0 && (
          <section className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
            <p className="text-center font-medium text-amber-700">
              🔥 {data.streakDays}일 연속 기록 중!
            </p>
          </section>
        )}

        {/* 카테고리별 예산 vs 실지출 */}
        {data.byCategory.length > 0 && (
          <section className="lg:col-span-2">
            <h2 className="mb-3 text-sm font-medium text-gray-700">
              카테고리별 절약 현황
            </h2>
            <div className="space-y-2 md:grid md:grid-cols-2 md:gap-2 md:space-y-0">
              {data.byCategory
                .filter((c) => c.budget > 0 || c.actual > 0)
                .map((c) => (
                    <div
                      key={c.categoryId}
                      className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-2"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {c.categoryName}
                      </span>
                      <div className="text-right text-sm">
                        <span className="text-gray-500">
                          {formatKRW(c.actual)} / {formatKRW(c.budget)}
                        </span>
                        {c.saved > 0 && (
                          <span className="ml-2 text-emerald-600">
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
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-700">최근 지출</h2>
            <Link
              href="/expenses"
              className="text-sm text-emerald-600 hover:underline transition-colors"
            >
              전체 보기
            </Link>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white divide-y">
            {expenses.slice(0, 5).map((e: { id: string; amount: number; spent_at: string; category?: { name: string } }) => (
              <div
                key={e.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="font-medium text-gray-800">{formatKRW(e.amount)}</p>
                  <p className="text-xs text-gray-500">
                    {(e.category as { name?: string })?.name ?? "-"} · {e.spent_at}
                  </p>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                아직 지출 기록이 없어요. 추가해보세요!
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white shadow-lg hover:bg-emerald-600 hover:scale-110 transition-all"
        aria-label="지출 추가"
      >
        +
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
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-gray-200 bg-white py-2 lg:hidden">
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 px-4 py-2 text-emerald-600 transition-colors"
        >
          <span className="text-lg">🏠</span>
          <span className="text-xs font-medium">홈</span>
        </Link>
        <Link
          href="/expenses"
          className="flex flex-col items-center gap-0.5 px-4 py-2 text-gray-500 hover:text-emerald-600 transition-colors"
        >
          <span className="text-lg">📋</span>
          <span className="text-xs">지출</span>
        </Link>
        <Link
          href="/budget"
          className="flex flex-col items-center gap-0.5 px-4 py-2 text-gray-500 hover:text-emerald-600 transition-colors"
        >
          <span className="text-lg">📊</span>
          <span className="text-xs">예산</span>
        </Link>
        <Link
          href="/portfolio"
          className="flex flex-col items-center gap-0.5 px-4 py-2 text-gray-500 hover:text-emerald-600 transition-colors"
        >
          <span className="text-lg">💹</span>
          <span className="text-xs">배당</span>
        </Link>
        <Link
          href="/goal"
          className="flex flex-col items-center gap-0.5 px-4 py-2 text-gray-500 hover:text-emerald-600 transition-colors"
        >
          <span className="text-lg">🎯</span>
          <span className="text-xs">목표</span>
        </Link>
      </nav>
      
      {/* 데스크톱 사이드 네비게이션 */}
      <nav className="hidden lg:block fixed left-4 top-20 w-48 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 text-emerald-700 font-medium"
        >
          <span className="text-xl">🏠</span>
          <span>홈</span>
        </Link>
        <Link
          href="/expenses"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl">📋</span>
          <span>지출 목록</span>
        </Link>
        <Link
          href="/budget"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl">📊</span>
          <span>예산 설정</span>
        </Link>
        <Link
          href="/portfolio"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl">💹</span>
          <span>배당 포트폴리오</span>
        </Link>
        <Link
          href="/goal"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl">🎯</span>
          <span>목표 설정</span>
        </Link>
      </nav>
    </div>
  );
}

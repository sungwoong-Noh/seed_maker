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
    <div className="mx-auto max-w-lg pb-24 min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900">Seed Maker</h1>
        <button
          onClick={() => signOut()}
          className="text-2xl"
        >
          ⚙️
        </button>
      </header>

      <main className="p-4 space-y-4">
        {/* 주요 카드 */}
        <div className="space-y-4">
          {/* 씨앗돈 카드 */}
          <section className="rounded-xl bg-gray-50 p-5 space-y-2">
            <h2 className="text-base font-semibold text-gray-900">🌱 이번 달 씨앗돈</h2>
            <p className="text-[32px] font-bold text-emerald-600">
              {formatKRW(data.seedMoney)}
            </p>
            <p className="text-sm text-gray-600">
              씨앗 {data.seedCount}알 수확!
            </p>
          </section>

          {/* 목표 진행률 */}
          {data.targetMonthlyDividend > 0 && (
            <section className="rounded-xl bg-gray-50 p-5 space-y-3">
              <h2 className="text-base font-semibold text-gray-900">목표 월 배당금</h2>
              <div className="h-2 overflow-hidden rounded bg-gray-200">
                <div
                  className="h-full rounded bg-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {formatKRW(data.currentMonthlyDividend)} / {formatKRW(data.targetMonthlyDividend)}
              </p>
              <p className="text-sm font-semibold text-blue-600">
                {data.monthsToGoal != null
                  ? `달성까지 약 ${data.monthsToGoal}개월`
                  : "목표를 설정해보세요"}
              </p>
            </section>
          )}
        </div>

        {/* 스트릭 */}
        {data.streakDays > 0 && (
          <section className="rounded-xl bg-amber-50 p-4 flex items-center justify-center">
            <p className="text-base font-semibold text-amber-900">
              🔥 {data.streakDays}일 연속 기록 중!
            </p>
          </section>
        )}

        {/* 최근 지출 */}
        <section>
          <h2 className="mb-4 text-base font-semibold text-gray-900">최근 지출</h2>
          <div className="space-y-0">
            {expenses.slice(0, 3).map((e: { id: string; amount: number; spent_at: string; memo?: string | null; category?: { name: string } }, idx: number) => {
              const daysAgo = idx === 0 ? "오늘" : idx === 1 ? "어제" : `${idx}일 전`;
              return (
                <div
                  key={e.id}
                  className="flex items-center justify-between h-10"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{(e.category as { name?: string })?.name ?? "-"}</span>
                    <span className="text-sm text-gray-900">{formatKRW(e.amount)}</span>
                  </div>
                  <span className="text-sm text-gray-500">{daysAgo}</span>
                </div>
              );
            })}
            {expenses.length === 0 && (
              <div className="py-12 text-center">
                <div className="text-3xl mb-2">📝</div>
                <p className="text-sm text-gray-600">아직 지출 기록이 없어요</p>
              </div>
            )}
          </div>
        </section>
      </div>
      </main>

      {/* FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
        aria-label="지출 추가"
      >
        <span className="text-[32px] font-semibold leading-none">+</span>
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

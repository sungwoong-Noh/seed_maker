"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Utensils,
  Train,
  Film,
  ShoppingBag,
  Activity,
  Package,
  Tag,
  Plus,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { useDashboardTrend } from "@/hooks/useDashboardTrend";
import { useExpenses } from "@/hooks/useExpenses";
import { useAuth } from "@/hooks/useAuth";
import { AddExpenseModal } from "./AddExpenseModal";
import { formatKRW } from "@/lib/format";
import { BottomNav } from "@/components/common/BottomNav";
import { getCategoryIcon } from "@/lib/categoryIcons";

const BudgetChart = dynamic(() => import("./BudgetChart").then((m) => ({ default: m.BudgetChart })), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl bg-gray-50 p-4 min-h-[200px] animate-pulse flex items-center justify-center">
      <span className="text-sm text-gray-500">차트 로딩...</span>
    </div>
  ),
});

const SeedMoneyTrendChart = dynamic(
  () => import("./SeedMoneyTrendChart").then((m) => ({ default: m.SeedMoneyTrendChart })),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl bg-gray-50 p-4 min-h-[200px] animate-pulse flex items-center justify-center">
        <span className="text-sm text-gray-500">트렌드 로딩...</span>
      </div>
    ),
  }
);

type Props = {
  userId: string;
  yearMonth: string;
};

// 카테고리별 아이콘 컴포넌트 매핑
const categoryIconComponents: Record<string, React.ReactNode> = {
  "식비": <Utensils size={20} className="text-emerald-700" />,
  "교통": <Train size={20} className="text-emerald-700" />,
  "문화": <Film size={20} className="text-emerald-700" />,
  "쇼핑": <ShoppingBag size={20} className="text-emerald-700" />,
  "의료": <Activity size={20} className="text-emerald-700" />,
  "기타": <Package size={20} className="text-emerald-700" />,
  "default": <Tag size={20} className="text-emerald-700" />,
};

function getCategoryIconComponent(categoryName: string): React.ReactNode {
  return categoryIconComponents[categoryName] || categoryIconComponents["default"];
}

export function Dashboard({ userId, yearMonth }: Props) {
  const { data, isLoading, error } = useDashboard(userId, yearMonth);
  const { trend } = useDashboardTrend(6);
  const { expenses } = useExpenses(userId, yearMonth);
  const { signOut } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-emerald-700">로딩 중...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-center text-red-600">
          데이터를 불러올 수 없습니다. Supabase SQL Editor에서 마이그레이션을 실행했는지 확인하세요.
        </p>
        <p className="text-center text-sm text-gray-600">
          supabase/migrations/20250213000000_initial_schema.sql
        </p>
        {error && (
          <p className="max-w-md text-center text-xs text-gray-600">
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
          className="text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded"
          aria-label="설정"
        >
          ⚙️
        </button>
      </header>

      <main id="main-content" className="p-4 space-y-4" tabIndex={-1}>
        {/* 주요 카드 */}
        <div className="space-y-4">
          {/* 투자 가능 금액 카드 */}
          {data.salary > 0 ? (
            <section className="rounded-xl bg-emerald-50 p-5 min-h-[140px] flex flex-col justify-center gap-2 transition-shadow duration-200 hover:shadow-md">
              <h2 className="text-base font-semibold text-gray-900">💰 이번 달 투자 가능 금액</h2>
              <p className="text-[32px] font-bold text-emerald-700">
                {formatKRW(data.investableAmount)}
              </p>
              <p className="text-sm text-gray-600">
                급여 {formatKRW(data.salary)} - 실지출 {formatKRW(data.expenseTotal)}
                {data.fixedExpense > 0 && ` - 고정지출 ${formatKRW(data.fixedExpense)}`}
              </p>
            </section>
          ) : (
            <section className="rounded-xl bg-gray-50 p-5 min-h-[100px] flex flex-col justify-center gap-2 transition-shadow duration-200 hover:shadow-md">
              <h2 className="text-base font-semibold text-gray-900">💰 투자 가능 금액</h2>
              <p className="text-sm text-gray-600">급여를 설정하면 투자 가능 금액을 확인할 수 있어요</p>
              <a href="/goal" className="text-sm font-semibold text-emerald-700 underline">목표 설정에서 급여 입력하기 →</a>
            </section>
          )}

          {/* 실지출 + 배당 목표 2열 */}
          <div className="grid grid-cols-2 gap-3">
            {/* 이번 달 실지출 */}
            <section className="rounded-xl bg-gray-50 p-4 flex flex-col justify-center gap-1 transition-shadow duration-200 hover:shadow-md">
              <h2 className="text-sm font-semibold text-gray-900">📝 이번 달 지출</h2>
              <p className="text-xl font-bold text-gray-900">
                {formatKRW(data.expenseTotal)}
              </p>
              {data.fixedExpense > 0 && (
                <p className="text-xs text-gray-500">고정 {formatKRW(data.fixedExpense)} 별도</p>
              )}
            </section>

            {/* 배당 목표 진행률 */}
            <section className="rounded-xl bg-gray-50 p-4 flex flex-col justify-center gap-1 transition-shadow duration-200 hover:shadow-md">
              <h2 className="text-sm font-semibold text-gray-900">배당 목표</h2>
              {data.targetMonthlyDividend > 0 ? (
                <>
                  <p className="text-xl font-bold text-blue-700">{progressPercent}%</p>
                  <div className="h-1.5 overflow-hidden rounded bg-gray-200">
                    <div
                      className="h-full rounded bg-blue-700 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-xs text-gray-500">목표 미설정</p>
              )}
            </section>
          </div>
        </div>

        {/* 스트릭 - Pencil: height 60, padding 16 */}
        {data.streakDays > 0 && (
          <section className="rounded-xl bg-amber-50 min-h-[60px] p-4 flex items-center justify-center">
            <p className="text-base font-semibold text-amber-900">
              🔥 {data.streakDays}일 연속 기록 중!
            </p>
          </section>
        )}

        {/* 카테고리별 예산 vs 실지출 차트 */}
        {data.byCategory.length > 0 && (
          <BudgetChart data={data.byCategory} />
        )}

        {/* 월별 씨앗돈 트렌드 */}
        {trend.length > 0 && <SeedMoneyTrendChart data={trend} />}

        {/* 최근 지출 */}
        <section>
          <h2 className="mb-4 text-base font-semibold text-gray-900">최근 지출</h2>
          <div className="space-y-0">
            {expenses.slice(0, 3).map((e: { id: string; amount: number; spent_at: string; memo?: string | null; category?: { name: string } }, idx: number) => {
              const daysAgo = idx === 0 ? "오늘" : idx === 1 ? "어제" : `${idx}일 전`;
              const categoryName = (e.category as { name?: string })?.name ?? "기타";
              return (
                <div
                  key={e.id}
                  className="flex items-center justify-between h-10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      {getCategoryIconComponent(categoryName)}
                    </div>
                    <span className="text-base font-semibold text-gray-900">{formatKRW(e.amount)}</span>
                  </div>
                  <span className="text-sm text-gray-600">{daysAgo}</span>
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
      </main>

      {/* FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg hover:bg-emerald-800 hover:scale-105 active:scale-95 transition-transform duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        aria-label="지출 추가"
      >
        <Plus size={24} strokeWidth={3} />
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

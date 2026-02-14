"use client";

import { useState } from "react";
import Link from "next/link";
import { useExpenses } from "@/hooks/useExpenses";
import { AddExpenseModal } from "@/components/dashboard/AddExpenseModal";
import { formatKRW } from "@/lib/format";
import { showSuccess, showError } from "@/lib/toast";
import { BottomNav } from "@/components/common/BottomNav";

type Props = {
  userId: string;
  yearMonth: string;
};

export function ExpenseList({ userId, yearMonth }: Props) {
  const { expenses, isLoading, deleteExpense } = useExpenses(userId, yearMonth);
  const [showAdd, setShowAdd] = useState(false);

  // 로딩 상태는 Suspense에서 처리

  return (
    <div className="mx-auto max-w-lg pb-24 min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 border-b border-gray-100">
        <Link href="/" className="text-2xl text-gray-900">←</Link>
        <h1 className="text-xl font-semibold text-gray-900">지출 목록</h1>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="p-4 space-y-4">
        {/* 지출 추가 버튼 */}
        <button
          onClick={() => setShowAdd(true)}
          className="w-full rounded-xl bg-emerald-600 py-3 text-base font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          + 지출 추가
        </button>

        {/* 지출 목록 */}
        <div className="space-y-4">
          {expenses.map((e: { id: string; amount: number; spent_at: string; memo?: string | null; category?: { name: string } }) => (
            <div
              key={e.id}
              className="bg-gray-50 rounded-xl p-4 space-y-1"
            >
              <p className="text-lg font-semibold text-gray-900">{formatKRW(e.amount)}</p>
              <p className="text-sm text-gray-600">
                {(e.category as { name?: string })?.name ?? "-"} · {e.spent_at}
                {e.memo ? ` · ${e.memo}` : ""}
              </p>
            </div>
          ))}
          
          {expenses.length === 0 && (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-base text-gray-600">지출 기록이 없어요</p>
              <p className="text-sm text-gray-500 mt-1">위 버튼을 눌러 추가해보세요!</p>
            </div>
          )}
        </div>
      </main>

      {/* 지출 추가 모달 */}
      {showAdd && (
        <AddExpenseModal
          userId={userId}
          yearMonth={yearMonth}
          onClose={() => setShowAdd(false)}
          onSuccess={() => setShowAdd(false)}
        />
      )}

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}

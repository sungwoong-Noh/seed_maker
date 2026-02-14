"use client";

import { useState } from "react";
import Link from "next/link";
import { useExpenses } from "@/hooks/useExpenses";
import { AddExpenseModal } from "@/components/dashboard/AddExpenseModal";
import { formatKRW } from "@/lib/format";
import { showSuccess, showError } from "@/lib/toast";

type Props = {
  userId: string;
  yearMonth: string;
};

export function ExpenseList({ userId, yearMonth }: Props) {
  const { expenses, isLoading, deleteExpense } = useExpenses(userId, yearMonth);
  const [showAdd, setShowAdd] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg pb-24">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-100 bg-white/90 px-4 py-3 backdrop-blur">
          <Link href="/" className="text-lg font-bold text-emerald-800">
            🌱 Seed Maker
          </Link>
          <h2 className="text-sm font-medium text-gray-700">지출 목록</h2>
        </header>
        <main className="px-4 py-6">
          <div className="rounded-xl border border-gray-100 bg-white divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div className="flex-1">
                  <div className="h-5 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
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
        <h2 className="text-sm font-medium text-gray-700">지출 목록</h2>
      </header>

      <main className="px-4 py-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            + 지출 추가
          </button>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white divide-y">
          {expenses.map((e: { id: string; amount: number; spent_at: string; memo?: string | null; category?: { name: string } }) => (
            <div
              key={e.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="font-medium text-gray-800">{formatKRW(e.amount)}</p>
                <p className="text-xs text-gray-500">
                  {(e.category as { name?: string })?.name ?? "-"} · {e.spent_at}
                  {e.memo ? ` · ${e.memo}` : ""}
                </p>
              </div>
              <button
                onClick={async () => {
                  if (confirm("삭제할까요?")) {
                    try {
                      await deleteExpense(e.id);
                      showSuccess('지출이 삭제되었습니다');
                    } catch (err) {
                      console.error('[ExpenseList] Delete Error:', err);
                      showError('지출 삭제에 실패했습니다');
                    }
                  }
                }}
                className="text-sm text-red-500 hover:text-red-700"
              >
                삭제
              </button>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-gray-500">
              지출 기록이 없어요. 추가해보세요!
            </div>
          )}
        </div>
      </main>

      {showAdd && (
        <AddExpenseModal
          userId={userId}
          yearMonth={yearMonth}
          onClose={() => setShowAdd(false)}
          onSuccess={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}

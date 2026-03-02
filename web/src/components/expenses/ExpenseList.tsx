"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";
import { AddExpenseModal } from "@/components/dashboard/AddExpenseModal";
import { showSuccess, showError } from "@/lib/toast";
import { formatKRW } from "@/lib/format";
import { BottomNav } from "@/components/common/BottomNav";
import type { ExpenseWithCategory } from "@/types";

type Props = {
  userId: string;
  yearMonth: string;
};

// 월 계산 유틸 함수
function prevMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const date = new Date(y, m - 2, 1); // m - 1 - 1 (0-indexed)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function nextMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const date = new Date(y, m, 1); // m (0-indexed)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatYearMonth(ym: string): string {
  const [y, m] = ym.split("-");
  return `${y}년 ${parseInt(m)}월`;
}

function isCurrentMonth(ym: string): boolean {
  const now = new Date();
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return ym === current;
}

export function ExpenseList({ userId, yearMonth: initialYearMonth }: Props) {
  const [currentYearMonth, setCurrentYearMonth] = useState(initialYearMonth);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<ExpenseWithCategory | null>(null);
  const { expenses, deleteExpense } = useExpenses(userId, currentYearMonth);

  async function handleDelete(id: string) {
    if (!window.confirm("이 지출을 삭제하시겠습니까?")) return;

    try {
      await deleteExpense(id);
      showSuccess("지출이 삭제되었습니다");
    } catch (err) {
      console.error("[ExpenseList] Delete error:", err);
      showError("지출 삭제에 실패했습니다");
    }
  }

  return (
    <div className="mx-auto max-w-lg pb-24 min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 border-b border-gray-100">
        <Link href="/" className="text-2xl text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded" aria-label="뒤로 가기">←</Link>
        <h1 className="text-xl font-semibold text-gray-900">지출 목록</h1>
      </header>

      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <button
          onClick={() => setCurrentYearMonth(prevMonth(currentYearMonth))}
          className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-900 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          aria-label="이전 달"
        >
          &lt;
        </button>
        <span className="text-base font-semibold text-gray-900">
          {formatYearMonth(currentYearMonth)}
        </span>
        <button
          onClick={() => setCurrentYearMonth(nextMonth(currentYearMonth))}
          disabled={isCurrentMonth(currentYearMonth)}
          className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-900 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="다음 달"
        >
          &gt;
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <main id="main-content" className="p-4 space-y-4" tabIndex={-1}>
        {/* 지출 추가 버튼 - Pencil: height 48, padding 12 */}
        <button
          onClick={() => setShowAdd(true)}
          className="w-full h-12 rounded-xl bg-emerald-700 flex items-center justify-center text-base font-semibold text-white hover:bg-emerald-800 active:scale-[0.98] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          aria-label="지출 추가"
        >
          + 지출 추가
        </button>

        {/* 지출 목록 - Pencil: height 72, padding 16, gap 4 */}
        <div className="space-y-4">
          {expenses.map((e: ExpenseWithCategory) => (
            <div
              key={e.id}
              className="bg-gray-50 rounded-xl p-4 min-h-[72px] flex items-center justify-between gap-3 transition-shadow duration-200 hover:shadow-md"
            >
              {/* 지출 정보 */}
              <div className="flex-1 flex flex-col justify-center gap-1">
                <p className="text-lg font-semibold text-gray-900">{formatKRW(e.amount)}</p>
                <p className="text-sm text-gray-600">
                  {e.category?.name ?? "-"} · {e.spent_at}
                  {e.memo ? ` · ${e.memo}` : ""}
                </p>
              </div>

              {/* 수정/삭제 버튼 */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditTarget(e)}
                  className="h-9 w-9 flex items-center justify-center rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  aria-label="수정"
                  title="수정"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(e.id)}
                  className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  aria-label="삭제"
                  title="삭제"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {expenses.length === 0 && (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-base text-gray-600">지출 기록이 없어요</p>
              <p className="text-sm text-gray-600 mt-1">위 버튼을 눌러 추가해보세요!</p>
            </div>
          )}
        </div>
      </main>

      {/* 지출 추가/수정 모달 */}
      {(showAdd || editTarget) && (
        <AddExpenseModal
          userId={userId}
          yearMonth={currentYearMonth}
          onClose={() => {
            setShowAdd(false);
            setEditTarget(null);
          }}
          onSuccess={() => {
            setShowAdd(false);
            setEditTarget(null);
          }}
          initialData={
            editTarget
              ? {
                  id: editTarget.id,
                  amount: editTarget.amount,
                  category_id: editTarget.category_id,
                  spent_at: editTarget.spent_at,
                  memo: editTarget.memo,
                }
              : undefined
          }
        />
      )}

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}

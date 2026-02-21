"use client";

import { useState } from "react";
import Link from "next/link";
import { useFixedExpenses } from "@/hooks/useFixedExpenses";
import { formatKRW } from "@/lib/format";
import { showSuccess, showError } from "@/lib/toast";
import { BottomNav } from "@/components/common/BottomNav";

type Props = {
  userId: string;
};

export function BudgetForm({ userId }: Props) {
  const { items, isLoading, addItem, deleteItem } = useFixedExpenses(userId);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const totalFixedExpense = items.reduce((sum, item) => sum + Number(item.amount), 0);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const amountNum = parseInt(amount.replace(/\D/g, ""), 10);
    if (!name.trim()) {
      showError("항목명을 입력해주세요");
      return;
    }
    if (!amountNum) {
      showError("금액을 입력해주세요");
      return;
    }
    try {
      await addItem({ name: name.trim(), amount: amountNum });
      showSuccess("추가되었습니다");
      setName("");
      setAmount("");
    } catch {
      showError("추가에 실패했습니다");
    }
  }

  async function handleDelete(id: string, itemName: string) {
    try {
      await deleteItem(id);
      showSuccess(`'${itemName}' 삭제되었습니다`);
    } catch {
      showError("삭제에 실패했습니다");
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg pb-24">
        <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 border-b border-gray-100">
          <Link href="/" className="text-2xl text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded" aria-label="뒤로 가기">←</Link>
          <h1 className="text-xl font-semibold text-gray-900">고정지출</h1>
        </header>
        <main className="p-4 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-50 p-4 h-16 animate-pulse" />
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 border-b border-gray-100">
        <Link href="/" className="text-2xl text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded" aria-label="뒤로 가기">←</Link>
        <h1 className="text-xl font-semibold text-gray-900">고정지출</h1>
      </header>

      <main id="main-content" className="p-4 space-y-4" tabIndex={-1}>
        {/* 합계 카드 */}
        <section className="rounded-xl bg-gray-50 p-5 flex flex-col gap-1">
          <p className="text-base font-semibold text-gray-900">월 고정지출 합계</p>
          <p className="text-[32px] font-bold text-emerald-700">{formatKRW(totalFixedExpense)}</p>
          <p className="text-xs text-gray-500">투자 가능 금액 = 급여 - 고정지출 - 실지출</p>
        </section>

        {/* 항목 추가 폼 */}
        <form onSubmit={handleAdd} className="rounded-xl bg-white border border-gray-200 p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-900">항목 추가</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="항목명 (예: 월세, 보험료)"
            className="w-full rounded-lg bg-gray-50 h-10 px-3 text-base text-gray-900 outline-none border border-transparent focus:border-emerald-500"
          />
          <div className="flex items-center gap-1 rounded-lg bg-gray-50 h-10 px-3 border border-transparent focus-within:border-emerald-500">
            <span className="text-base text-gray-600">₩</span>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className="flex-1 text-base text-gray-900 bg-transparent outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-emerald-700 text-base font-semibold text-white hover:bg-emerald-800 active:scale-[0.98] transition-all duration-150"
          >
            + 추가
          </button>
        </form>

        {/* 항목 목록 */}
        <div className="space-y-2">
          {items.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-500">
              고정지출 항목을 추가해보세요
            </div>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-gray-50 px-4 py-3 flex items-center justify-between transition-shadow hover:shadow-md"
            >
              <div>
                <p className="text-base font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">{formatKRW(item.amount)}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id, item.name)}
                className="text-gray-400 hover:text-red-500 transition-colors text-xl px-2"
                aria-label={`${item.name} 삭제`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

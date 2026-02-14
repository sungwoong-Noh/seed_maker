"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useBudgets } from "@/hooks/useBudgets";
import { formatKRW } from "@/lib/format";
import { showSuccess, showError } from "@/lib/toast";
import { BottomNav } from "@/components/common/BottomNav";
import { getCategoryIcon } from "@/lib/categoryIcons";

type Props = {
  userId: string;
  yearMonth: string;
};

export function BudgetForm({ userId, yearMonth }: Props) {
  const { budgets, isLoading, upsertBudgets } = useBudgets(userId, yearMonth);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const supabase = createClient();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!categories || categories.length === 0) return;
    
    const map: Record<string, string> = {};
    for (const b of budgets) {
      const catId = (b as { category_id: string }).category_id ?? (b as { category?: { id: string } }).category?.id;
      if (catId) map[catId] = String((b as { amount: number }).amount ?? 0);
    }
    for (const c of categories) {
      if (!(c.id in map)) map[c.id] = "0";
    }
    setAmounts(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgets.length, categories?.length]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categories) return;

    const items = categories.map((c) => ({
      category_id: c.id,
      amount: parseInt(amounts[c.id]?.replace(/\D/g, "") || "0", 10),
    }));

    try {
      await upsertBudgets(items);
      showSuccess('예산이 저장되었습니다');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('[BudgetForm] Error:', err);
      showError('예산 저장에 실패했습니다');
    }
  }

  if (isLoading || !categories) {
    return (
      <div className="mx-auto max-w-lg pb-8">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-100 bg-white/90 px-4 py-3 backdrop-blur">
          <Link href="/" className="text-lg font-bold text-emerald-800">
            🌱 Seed Maker
          </Link>
          <h2 className="text-sm font-medium text-gray-700">예산 설정</h2>
        </header>
        <main className="px-4 py-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-4">
                <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const totalBudget = categories.reduce((sum, c) => {
    return sum + parseInt(amounts[c.id]?.replace(/\D/g, "") || "0", 10);
  }, 0);

  return (
    <div className="mx-auto max-w-lg pb-24 min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 border-b border-gray-100">
        <Link href="/" className="text-2xl text-gray-900">
          ←
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">예산 설정</h1>
      </header>

      <main className="p-4">
        {/* 월 선택 (향후 구현) */}
        <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-3">
          <span className="text-base text-gray-900">{yearMonth.replace('-', '년 ')}월</span>
          <span className="text-sm text-gray-500">▼</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 카테고리별 예산 입력 */}
          {categories.map((c) => (
            <div key={c.id} className="space-y-2">
              {/* 카테고리 헤더 */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(c.name)}</span>
                <span className="text-base font-semibold text-gray-900">{c.name}</span>
              </div>
              
              {/* 입력 필드 */}
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-3">
                <span className="text-base text-gray-500">₩</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amounts[c.id] ?? ""}
                  onChange={(e) =>
                    setAmounts((prev) => ({
                      ...prev,
                      [c.id]: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  placeholder="0"
                  className="flex-1 text-base text-gray-900 bg-transparent outline-none"
                />
              </div>
            </div>
          ))}

          {/* 총 예산 */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-semibold text-gray-900">총 예산:</span>
              <span className="text-xl font-bold text-emerald-600">{formatKRW(totalBudget)}</span>
            </div>
            
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-3.5 text-base font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              {saved ? "저장됨 ✓" : "저장"}
            </button>
          </div>
        </form>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}

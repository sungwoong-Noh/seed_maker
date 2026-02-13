"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useBudgets } from "@/hooks/useBudgets";
import { formatKRW } from "@/lib/format";

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

    await upsertBudgets(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (isLoading || !categories) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-emerald-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg pb-8">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-100 bg-white/90 px-4 py-3 backdrop-blur">
        <Link href="/" className="text-lg font-bold text-emerald-800">
          🌱 Seed Maker
        </Link>
        <h2 className="text-sm font-medium text-gray-700">예산 설정</h2>
      </header>

      <main className="px-4 py-6">
        <p className="mb-4 text-sm text-gray-600">
          {yearMonth} · 카테고리별 월 예산을 입력하세요
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4">
              <label className="w-24 text-sm font-medium text-gray-700">
                {c.name}
              </label>
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
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-right focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-500">원</span>
            </div>
          ))}
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white hover:bg-emerald-700"
          >
            {saved ? "저장됨 ✓" : "저장"}
          </button>
        </form>
      </main>
    </div>
  );
}

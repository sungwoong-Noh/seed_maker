import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { TrendItem } from "@/types";

/**
 * 과거 N개월 씨앗돈 트렌드 (가장 오래된 달 → 최신 달 순)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const months = Math.min(12, Math.max(1, parseInt(searchParams.get("months") ?? "6", 10)));

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const yearMonths = getYearMonths(months);
  const categoriesRes = await supabase.from("categories").select("id, name");
  const categories = new Map((categoriesRes.data ?? []).map((c) => [c.id, c.name]));

  const [budgetsRes, expensesRes] = await Promise.all([
    supabase
      .from("budgets")
      .select("year_month, category_id, amount")
      .eq("user_id", user.id)
      .in("year_month", yearMonths),
    supabase
      .from("expenses")
      .select("category_id, amount, spent_at")
      .eq("user_id", user.id),
  ]);

  const budgetByMonth = new Map<string, Map<string, number>>();
  for (const b of budgetsRes.data ?? []) {
    if (!budgetByMonth.has(b.year_month)) {
      budgetByMonth.set(b.year_month, new Map());
    }
    budgetByMonth.get(b.year_month)!.set(b.category_id, Number(b.amount));
  }

  const expenseByMonth = new Map<string, Map<string, number>>();
  for (const e of expensesRes.data ?? []) {
    const ym = (e.spent_at as string).slice(0, 7);
    if (!yearMonths.includes(ym)) continue;
    if (!expenseByMonth.has(ym)) {
      expenseByMonth.set(ym, new Map());
    }
    const m = expenseByMonth.get(ym)!;
    m.set(e.category_id, (m.get(e.category_id) ?? 0) + Number(e.amount));
  }

  const trend: TrendItem[] = yearMonths.map((ym) => {
    let seedMoney = 0;
    const budgetMap = budgetByMonth.get(ym) ?? new Map();
    const expenseMap = expenseByMonth.get(ym) ?? new Map();
    for (const [catId] of categories) {
      const budget = budgetMap.get(catId) ?? 0;
      const actual = expenseMap.get(catId) ?? 0;
      seedMoney += Math.max(0, budget - actual);
    }
    const [y, m] = ym.split("-");
    return {
      yearMonth: ym,
      label: `${y}.${m}`,
      seedMoney,
    };
  });

  return NextResponse.json({ trend });
}

function getYearMonths(count: number): string[] {
  const result: string[] = [];
  const d = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const x = new Date(d.getFullYear(), d.getMonth() - i, 1);
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, "0");
    result.push(`${y}-${m}`);
  }
  return result;
}

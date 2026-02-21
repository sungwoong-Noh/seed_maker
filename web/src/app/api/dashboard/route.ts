import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { simulateMonthsToGoal } from "@/lib/simulation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearMonth = searchParams.get("yearMonth") ?? getCurrentYearMonth();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [start, end] = getMonthRange(yearMonth);

  const [expensesRes, stocksRes, goalsRes, fixedExpensesRes] = await Promise.all([
    supabase
      .from("expenses")
      .select("category_id, amount")
      .eq("user_id", user.id)
      .gte("spent_at", start)
      .lte("spent_at", end),
    supabase
      .from("dividend_stocks")
      .select("quantity, dividend_per_share")
      .eq("user_id", user.id),
    supabase
      .from("dividend_goals")
      .select("target_monthly_dividend, extra_monthly_deposit, monthly_salary")
      .eq("user_id", user.id)
      .limit(1)
      .single(),
    supabase
      .from("fixed_expenses")
      .select("amount")
      .eq("user_id", user.id),
  ]);

  const categoriesRes = await supabase.from("categories").select("id, name");

  const categories = new Map(
    (categoriesRes.data ?? []).map((c) => [c.id, c.name])
  );

  const expenseByCat = new Map<string, number>();
  for (const e of expensesRes.data ?? []) {
    expenseByCat.set(
      e.category_id,
      (expenseByCat.get(e.category_id) ?? 0) + Number(e.amount)
    );
  }

  const byCategory: Array<{
    categoryId: string;
    categoryName: string;
    actual: number;
  }> = [];

  for (const [catId, catName] of categories) {
    const actual = expenseByCat.get(catId) ?? 0;
    byCategory.push({ categoryId: catId, categoryName: catName, actual });
  }

  const expenseTotal = [...expenseByCat.values()].reduce((a, b) => a + b, 0);

  const fixedExpense = (fixedExpensesRes.data ?? []).reduce(
    (sum, r) => sum + Number(r.amount),
    0
  );

  let currentMonthlyDividend = 0;
  for (const s of stocksRes.data ?? []) {
    const annualDiv = Number(s.quantity) * Number(s.dividend_per_share);
    currentMonthlyDividend += annualDiv / 12;
  }

  const goal = goalsRes.data;
  const targetMonthlyDividend = goal ? Number(goal.target_monthly_dividend) : 0;
  const extraDeposit = goal ? Number(goal.extra_monthly_deposit) : 0;
  const salary = goal ? Number(goal.monthly_salary ?? 0) : 0;

  const monthlyDeposit = extraDeposit;
  const investableAmount = salary > 0 ? salary - fixedExpense - expenseTotal : 0;

  const progressPercent =
    targetMonthlyDividend > 0
      ? Math.min(
          100,
          Math.round((currentMonthlyDividend / targetMonthlyDividend) * 100)
        )
      : 0;

  const { monthsToGoal } =
    targetMonthlyDividend > 0
      ? simulateMonthsToGoal(
          targetMonthlyDividend,
          currentMonthlyDividend,
          monthlyDeposit
        )
      : { monthsToGoal: null };

  const streakDays = await getStreakDays(supabase, user.id);

  return NextResponse.json({
    expenseTotal,
    byCategory,
    currentMonthlyDividend,
    targetMonthlyDividend,
    progressPercent,
    monthsToGoal,
    streakDays,
    salary,
    fixedExpense,
    investableAmount,
  });
}

function getCurrentYearMonth() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function getMonthRange(yearMonth: string): [string, string] {
  const [y, m] = yearMonth.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0);
  return [
    start.toISOString().split("T")[0],
    end.toISOString().split("T")[0],
  ];
}

async function getStreakDays(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<number> {
  const { data } = await supabase
    .from("expenses")
    .select("spent_at")
    .eq("user_id", userId)
    .order("spent_at", { ascending: false });

  if (!data?.length) return 0;

  const uniqueDates = [...new Set((data ?? []).map((r) => r.spent_at))].sort(
    (a, b) => b.localeCompare(a)
  );

  const today = new Date().toISOString().split("T")[0];
  let streak = 0;
  let check = today;

  for (const d of uniqueDates) {
    if (d === check) {
      streak++;
      const prev = new Date(check);
      prev.setDate(prev.getDate() - 1);
      check = prev.toISOString().split("T")[0];
    } else if (d < check) {
      break;
    }
  }

  return streak;
}

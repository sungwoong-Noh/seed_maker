export type Category = {
  id: string;
  name: string;
  icon: string | null;
  sort_order: number;
};

export type Budget = {
  id: string;
  user_id: string;
  year_month: string;
  category_id: string;
  amount: number;
  created_at: string;
  updated_at: string;
};

export type Expense = {
  id: string;
  user_id: string;
  amount: number;
  category_id: string;
  spent_at: string;
  memo: string | null;
  created_at: string;
  updated_at: string;
};

export type DividendStock = {
  id: string;
  user_id: string;
  ticker: string | null;
  name: string;
  quantity: number;
  dividend_per_share: number;
  share_price: number;
  currency: string;
  created_at: string;
  updated_at: string;
};

export type DividendGoal = {
  id: string;
  user_id: string;
  target_monthly_dividend: number;
  extra_monthly_deposit: number;
  created_at: string;
  updated_at: string;
};

export type ExpenseWithCategory = Expense & {
  category?: Category;
};

export type DashboardData = {
  seedMoney: number;
  seedCount: number;
  budgetTotal: number;
  expenseTotal: number;
  byCategory: Array<{
    categoryId: string;
    categoryName: string;
    budget: number;
    actual: number;
    saved: number;
  }>;
  currentMonthlyDividend: number;
  targetMonthlyDividend: number;
  progressPercent: number;
  monthsToGoal: number | null;
  streakDays: number;
};

export type TrendItem = {
  yearMonth: string;
  label: string;
  seedMoney: number;
};

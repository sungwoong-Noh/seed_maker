-- categories (시드)
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

INSERT INTO categories (name, icon, sort_order) VALUES
  ('식비', 'restaurant', 1),
  ('교통', 'directions_transit', 2),
  ('공과금', 'receipt', 3),
  ('쇼핑', 'shopping_bag', 4),
  ('의료', 'local_hospital', 5),
  ('기타', 'more_horiz', 99);

-- budgets
CREATE TABLE budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year_month text NOT NULL,
  category_id uuid NOT NULL REFERENCES categories(id),
  amount bigint NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, year_month, category_id)
);

-- expenses
CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount bigint NOT NULL,
  category_id uuid NOT NULL REFERENCES categories(id),
  spent_at date NOT NULL DEFAULT current_date,
  memo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_expenses_user_spent ON expenses(user_id, spent_at);

-- dividend_stocks
CREATE TABLE dividend_stocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker text,
  name text NOT NULL,
  quantity int NOT NULL DEFAULT 0,
  dividend_per_share decimal(12,4) NOT NULL,
  share_price decimal(12,4) NOT NULL,
  currency text DEFAULT 'KRW',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- dividend_goals
CREATE TABLE dividend_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_monthly_dividend bigint NOT NULL,
  extra_monthly_deposit bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS 정책
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE dividend_stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dividend_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own expenses" ON expenses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own dividend_stocks" ON dividend_stocks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own dividend_goals" ON dividend_goals FOR ALL USING (auth.uid() = user_id);
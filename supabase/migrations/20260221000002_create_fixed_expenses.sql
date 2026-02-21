-- 고정지출 항목 테이블
CREATE TABLE fixed_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount bigint NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fixed_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own fixed_expenses" ON fixed_expenses FOR ALL USING (auth.uid() = user_id);
스크린샷 2026-02-21 오후 8.39.15
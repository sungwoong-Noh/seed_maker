-- 고정지출 항목 테이블
CREATE TABLE IF NOT EXISTS fixed_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount bigint NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE IF EXISTS fixed_expenses ENABLE ROW LEVEL SECURITY;

-- 정책이 없을 때만 생성
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'fixed_expenses'
    AND policyname = 'Users can manage own fixed_expenses'
  ) THEN
    CREATE POLICY "Users can manage own fixed_expenses" ON fixed_expenses FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

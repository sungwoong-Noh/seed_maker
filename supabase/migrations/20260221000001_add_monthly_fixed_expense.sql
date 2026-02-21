-- dividend_goals 테이블에 monthly_fixed_expense 컬럼 추가
ALTER TABLE dividend_goals
  ADD COLUMN IF NOT EXISTS monthly_fixed_expense bigint DEFAULT 0;

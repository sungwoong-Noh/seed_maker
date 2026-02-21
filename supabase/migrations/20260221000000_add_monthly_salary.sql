-- dividend_goals 테이블에 monthly_salary 컬럼 추가
ALTER TABLE dividend_goals
  ADD COLUMN IF NOT EXISTS monthly_salary bigint DEFAULT 0;

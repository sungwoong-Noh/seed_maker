# Seed Maker DB 스키마

## ER 개요

```
users
  ├── budgets (1:N)
  ├── expenses (1:N)
  ├── dividend_stocks (1:N)
  └── dividend_goals (1:N)
```

---

## 테이블 정의 (PostgreSQL / Supabase)

### users
Supabase Auth 기본 제공. profiles 확장 시 사용.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | Auth 제공 |
| email | text | 이메일 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

---

### categories
기본 지출 카테고리 (시드 데이터)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | |
| name | text | 카테고리명 (식비, 교통, 공과금 등) |
| icon | text | 아이콘 이름 (선택) |
| sort_order | int | 정렬 순서 |
| created_at | timestamptz | |

---

### budgets
카테고리별 월 예산

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | |
| user_id | uuid (FK → users) | |
| year_month | text | 'YYYY-MM' |
| category_id | uuid (FK → categories) | |
| amount | bigint | 예산 금액 (원) |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| UNIQUE(user_id, year_month, category_id) | | |

---

### expenses
지출 기록

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | |
| user_id | uuid (FK → users) | |
| amount | bigint | 금액 (원) |
| category_id | uuid (FK → categories) | |
| spent_at | date | 지출 일자 |
| memo | text | 메모 (선택) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

### dividend_stocks
배당주 보유 현황

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | |
| user_id | uuid (FK → users) | |
| ticker | text | 종목코드/티커 (예: VOO, SCHD) |
| name | text | 종목명 |
| quantity | int | 보유 수량 |
| dividend_per_share | decimal(12,4) | 주당 배당금 (원 또는 USD) |
| share_price | decimal(12,4) | 현재 주가 |
| currency | text | 'KRW' | 'USD' |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**월 배당금 계산**: quantity × dividend_per_share (연 배당이면 /12)

---

### dividend_goals
목표 월 배당금

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | |
| user_id | uuid (FK → users) | |
| target_monthly_dividend | bigint | 목표 월 배당금 (원) |
| extra_monthly_deposit | bigint | 추가 월 납입액 (씨앗돈 외) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## Supabase 마이그레이션 (SQL)

```sql
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
```

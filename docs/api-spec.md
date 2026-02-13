# Seed Maker API 명세

인증: Supabase Auth JWT. `Authorization: Bearer <token>`

---

## 인증

### POST /auth/v1/signup
Supabase Auth 기본. 이메일/비밀번호 회원가입.

### POST /auth/v1/token
Supabase Auth 기본. 로그인.

---

## Categories (읽기 전용)

### GET /rest/v1/categories
Supabase REST. 모든 카테고리 조회.

---

## Budgets

### GET /rest/v1/budgets?user_id=eq.{uid}&year_month=eq.{YYYY-MM}
해당 월 예산 조회.

### POST /rest/v1/budgets
예산 생성.
```json
{
  "user_id": "uuid",
  "year_month": "2025-02",
  "category_id": "uuid",
  "amount": 300000
}
```

### PATCH /rest/v1/budgets?id=eq.{id}
예산 수정.

### DELETE /rest/v1/budgets?id=eq.{id}
예산 삭제.

---

## Expenses

### GET /rest/v1/expenses?user_id=eq.{uid}&spent_at=gte.{start}&spent_at=lte.{end}&order=spent_at.desc
지출 목록 조회. start/end는 ISO date.

### POST /rest/v1/expenses
지출 생성.
```json
{
  "user_id": "uuid",
  "amount": 8500,
  "category_id": "uuid",
  "spent_at": "2025-02-13",
  "memo": "점심"
}
```

### PATCH /rest/v1/expenses?id=eq.{id}
지출 수정.

### DELETE /rest/v1/expenses?id=eq.{id}
지출 삭제.

---

## Dividend Stocks

### GET /rest/v1/dividend_stocks?user_id=eq.{uid}
배당주 목록 조회.

### POST /rest/v1/dividend_stocks
배당주 추가.
```json
{
  "user_id": "uuid",
  "ticker": "VOO",
  "name": "Vanguard S&P 500",
  "quantity": 10,
  "dividend_per_share": 6.5,
  "share_price": 450,
  "currency": "USD"
}
```

### PATCH /rest/v1/dividend_stocks?id=eq.{id}
배당주 수정.

### DELETE /rest/v1/dividend_stocks?id=eq.{id}
배당주 삭제.

---

## Dividend Goals

### GET /rest/v1/dividend_goals?user_id=eq.{uid}
목표 조회. 1 user 1 goal 가정.

### POST /rest/v1/dividend_goals
목표 생성.
```json
{
  "user_id": "uuid",
  "target_monthly_dividend": 1000000,
  "extra_monthly_deposit": 50000
}
```

### PATCH /rest/v1/dividend_goals?id=eq.{id}
목표 수정.

---

## 계산 API (Next.js API Routes)

### GET /api/dashboard?yearMonth=YYYY-MM
대시보드 집계 데이터.

**Response:**
```json
{
  "seedMoney": 150000,
  "seedCount": 15,
  "budgetTotal": 500000,
  "expenseTotal": 350000,
  "byCategory": [
    { "categoryId": "...", "categoryName": "식비", "budget": 300000, "actual": 250000, "saved": 50000 }
  ],
  "currentMonthlyDividend": 800000,
  "targetMonthlyDividend": 1000000,
  "progressPercent": 80,
  "monthsToGoal": 8,
  "streakDays": 7
}
```

### GET /api/simulation
배당 목표 달성 시뮬레이션.

**Query:** targetMonthlyDividend, seedMoney, extraDeposit, dividendYield(평균), currentDividend

**Response:**
```json
{
  "monthsToGoal": 24,
  "projectedMonthlyDividendByMonth": [ ... ]
}
```

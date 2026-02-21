# 현재 프로젝트 상태

**마지막 업데이트**: 2026-02-21
**작업자**: AI Assistant

---

## 🎯 현재 위치

- **브랜치**: `feature/modal-icon-improvements`
- **진행률**: **투자 가능 금액 & 고정지출 기능 추가 완료** ✅

---

## ✅ 완료된 작업

### [2026-02-21] 투자 가능 금액 & 고정지출 기능 고도화

#### 핵심 수식
```
투자 가능 금액 = 급여 - 고정지출 합계 - 실지출
```

#### 1. DB 마이그레이션 (3개 파일)
- `20260221000000_add_monthly_salary.sql` — `dividend_goals.monthly_salary` 추가
- `20260221000001_add_monthly_fixed_expense.sql` — (사용 안함, 고정지출 별도 테이블로 교체)
- `20260221000002_create_fixed_expenses.sql` — `fixed_expenses` 테이블 신규 생성

#### 2. 예산 → 고정지출 페이지 전환
- **개념 변경**: 카테고리별 예산 입력 → 항목명+금액 자유 추가/삭제
- **씨앗돈 제거**: 예산-실지출 개념 삭제
- **BottomNav**: "예산" → "고정지출"
- **신규 훅**: `useFixedExpenses.ts` (추가/삭제 CRUD)
- **BudgetForm 재작성**: 고정지출 항목 리스트 UI

#### 3. 목표 설정 화면 개선
- **급여 입력 필드** 추가 (`monthly_salary`)
- 고정지출 입력란 제거 (고정지출 페이지로 이관)

#### 4. 대시보드 개선
- **상단 메인 카드**: 씨앗돈 → 💰 투자 가능 금액
  - 급여 설정 시: `급여 - 고정지출 - 실지출` 수식 표시
  - 급여 미설정 시: 목표 설정 링크 안내
- **보조 2열 카드**: 씨앗돈 제거 → 이번 달 지출 + 배당 목표 진행률
- **차트**: 예산 vs 실지출 비교 → 카테고리별 실지출만 표시

#### 5. 포트폴리오 개선
- 종목별 **추가 매수 주수** 표시
  - `ceil((목표월배당 - 현재월배당) * 12 / 주당연배당)`
  - 목표 달성 시 "🎉 목표 달성" 표시

#### ✅ 설계 완료 (2026-02-21)
- Pencil 화면 설계 완전 재구성
  - 4개 화면 모두 새롭게 설계
  - 고정지출 관리 화면 신규 추가
  - 대시보드 투자 가능 금액 중심으로 재설계
  - 목표 설정 화면에 급여 입력 필드 반영
  - 배당 포트폴리오에 종목별 추가 매수 주수 표시

---

### [2026-02-14] 1차 디자인 적용 (완료)
- Dashboard, AddExpenseModal, BudgetScreen, ExpenseListScreen, PortfolioScreen, GoalScreen Pencil 설계 완료
- 모든 페이지 디자인 통일 (GoalForm, PortfolioList, BudgetForm, ExpenseList, Dashboard)
- react-hot-toast, 전역 에러 바운더리, 로딩 스켈레톤 UI
- 페이지 전환 애니메이션 (Framer Motion), 카드 호버 효과
- 접근성 개선 (aria-label, SkipLink, 포커스 링)
- 차트 (BudgetChart, SeedMoneyTrendChart)
- E2E 테스트 (Playwright), 단위 테스트 (Vitest)
- GitHub Actions CI

---

## 🔜 다음 작업 (우선순위)

### 1. Pencil 화면 설계 업데이트 ⭐ 우선
> 기능 변경 시 설계 → 구현 순서를 지켜야 함

- [ ] 대시보드: 투자 가능 금액 중심으로 재설계
- [ ] 고정지출 관리 화면 신규 설계
- [ ] 목표 설정 화면: 급여 입력 필드 반영

### 2. Supabase 마이그레이션 적용
```sql
-- Supabase 대시보드 SQL Editor에서 순서대로 실행
-- 1. 20260221000000_add_monthly_salary.sql
-- 2. 20260221000002_create_fixed_expenses.sql
```

### 3. 검증
- [ ] 목표 설정에서 급여 입력 → 저장 확인
- [ ] 고정지출 페이지에서 항목 추가/삭제
- [ ] 대시보드 투자 가능 금액 수식 확인 (급여 - 고정지출 - 실지출)
- [ ] 포트폴리오 종목별 추가 매수 주수 표시 확인

---

## 🔑 주요 결정사항

### 디자인 시스템
- **Primary Color**: `#047857` (emerald-700)
- **Card Background**: `#F9FAFB` (gray-50)
- **Text Primary**: `#111827` (gray-900)
- **Text Secondary**: `#6B7280` (gray-500)

### 레이아웃
- **화면 너비**: 375px (max-w-lg)
- **패딩**: 16px (px-4)
- **카드 간격**: 16px (space-y-4)
- **카드 모서리**: 12px (rounded-xl)
- **버튼 높이**: 48px (py-3)

### 핵심 수식 (2026-02-21 확정)
```
투자 가능 금액 = 급여 - 고정지출 합계 - 실지출
종목별 추가 주수 = ceil((목표월배당 - 현재월배당) * 12 / 주당연배당)
```

### 개념 정리
| 개념 | 정의 |
|------|------|
| 급여 | 고정 월급여 (dividend_goals.monthly_salary) |
| 고정지출 | 임대료·보험 등 매달 고정 비용 (fixed_expenses 테이블) |
| 실지출 | 이번 달 실제 지출 합계 (expenses 테이블) |
| 투자 가능 금액 | 급여 - 고정지출 - 실지출 |
| ~~씨앗돈~~ | ~~예산 - 실지출 (제거됨)~~ |

### 네비게이션 (하단 5개)
- 홈 / 지출 / **고정지출** (구 예산) / 배당 / 목표

---

## 📁 주요 파일 구조

```
seed_maker/
├── web/src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── page.tsx              # 대시보드
│   │   │   ├── budget/page.tsx       # 고정지출 관리
│   │   │   ├── expenses/page.tsx     # 지출 목록
│   │   │   ├── portfolio/page.tsx    # 배당 포트폴리오
│   │   │   └── goal/page.tsx         # 목표 설정
│   │   └── api/dashboard/route.ts    # 대시보드 API
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx         # 투자 가능 금액 중심 UI
│   │   │   └── BudgetChart.tsx       # 카테고리별 실지출 차트
│   │   ├── budget/
│   │   │   └── BudgetForm.tsx        # 고정지출 항목 추가/삭제
│   │   ├── portfolio/
│   │   │   └── PortfolioList.tsx     # 종목별 추가 매수 주수
│   │   └── goal/
│   │       └── GoalForm.tsx          # 급여 입력 포함
│   ├── hooks/
│   │   ├── useFixedExpenses.ts       # 고정지출 CRUD (신규)
│   │   ├── useDividendGoal.ts        # monthly_salary 포함
│   │   └── useDividendStocks.ts
│   └── types/index.ts                # DividendGoal, DashboardData 업데이트
├── supabase/migrations/
│   ├── 20260221000000_add_monthly_salary.sql
│   ├── 20260221000001_add_monthly_fixed_expense.sql (미사용)
│   └── 20260221000002_create_fixed_expenses.sql
└── designs/
    └── 화면기획서_1.pen              # ⚠️ Pencil 업데이트 필요
```

---

## 🚨 알려진 이슈

### 진행 중 🔄
- Pencil 앱 연결 불가 — 화면 설계 미반영 상태

### 해결됨 ✅
- 이전 이슈들 (Tailwind 에러, 렌더링 멈춤 등)

---

## 💡 개발 원칙 (2026-02-21 추가)

> **기능 변경 시 반드시 설계 → 구현 순서 준수**
> 1. Pencil에서 화면 설계 먼저
> 2. 설계 확인 후 코드 구현

---

**이 문서는 프로젝트 상태가 변경될 때마다 업데이트해주세요!**

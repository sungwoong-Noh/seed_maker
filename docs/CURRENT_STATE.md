# 현재 프로젝트 상태

**마지막 업데이트**: 2026-03-02
**작업자**: AI Assistant

---

## 🎯 현재 위치

- **브랜치**: `feature/stock-search-improvement` (Phase 6 진행 중)
- **진행률**: **Phase 7 지출 기능 개선 진행 중** 🔄

---

## ✅ 완료된 작업

### [2026-03-02] Phase 7: 지출 기능 개선 ✅ 완료

#### 월별 조회 + 수정/삭제 기능 + 포괄적 테스트

**1. AddExpenseModal.tsx 수정 완료** ✅
- `initialData` prop 추가 → 수정 모드 지원
  - 추가 모드: initialData 없음 → `addExpense` 호출
  - 수정 모드: initialData 있음 → `updateExpense` 호출
- 모달 타이틀 조건부: "지출 추가" / "지출 수정"
- 버튼 텍스트 조건부: "저장" / "수정 완료"
- 금액 필드에 formatNumberWithComma 적용

**2. ExpenseList.tsx 수정 완료** ✅
- 월 네비게이션 UI 추가: `< YYYY년 MM월 >`
  - 이전 달 버튼: `prevMonth()` 함수로 계산
  - 다음 달 버튼: 현재 달까지만 활성화
- `currentYearMonth` 상태 추가
- 각 지출 항목에 수정(✏️) / 삭제(🗑️) 버튼 추가
  - 수정: `editTarget` 상태 → AddExpenseModal에 initialData 전달
  - 삭제: `window.confirm` 후 `deleteExpense` 호출
- `useExpenses` 훅 updateExpense, deleteExpense 이미 완성

**3. formatNumberWithComma 전체 적용** ✅
- **AddExpenseModal**: 금액 필드에 1000 단위 콤마 포맷팅
- **BudgetForm**: 고정지출 금액에 포맷팅 (placeholder "500,000")
- **GoalForm**: 급여, 목표 배당금, 추가 납입액 (placeholder "3,000,000", "1,000,000", "500,000")
- **AddStockModal**: 수량, 배당금, 주가 필드 포맷팅

**4. Pencil 설계 업데이트 완료** ✅
- 새 화면 추가: "2-2. 지출 목록"
  - 헤더 (뒤로가기 + "지출 목록")
  - 월 네비게이션 (`< 2026년 3월 >`)
  - "지출 추가" 버튼
  - 지출 항목 리스트 (수정/삭제 버튼 포함)
  - 하단 네비게이션
- 기존 "2-1. 지출 작성" 화면은 추가/수정 모드 모두 지원

**5. 포괄적 테스트 완료** ✅ (전체 63개 통과, 0개 실패)
- **AddExpenseModal.test.tsx**: 7개 통과
  - 기본 폼 렌더링
  - 저장 버튼 활성화
  - addExpense 호출
  - **수정 모드 타이틀 "지출 수정" 확인**
  - **updateExpense 호출 검증**
  - **추가/수정 모드 타이틀 차이 확인**
- **GoalForm.test.tsx**: 3개 통과
  - useDividendStocks 훅 모킹 추가
  - 씨앗돈 개념 제거로 인한 UI 텍스트 업데이트
  - monthly_salary 파라미터 검증
- **BudgetForm.test.tsx**: 3개 통과
  - useFixedExpenses 모킹
  - formatNumberWithComma 검증
- **format.test.ts**: 13개 통과 (formatNumberWithComma 포괄적 테스트)
- **ExpenseList.test.tsx**: 6개 통과 (유틸 함수 단위 테스트)
- **기타**: 31개 통과 (Modal, Button, Chart, 계산 함수)

**다음 단계**: Phase 6 ETF 검색 개선 완료 후 병합

---

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

### 1. Phase 6 ETF 검색 개선 ⭐
- [ ] AddStockModal 검색 기능 구현 (조회 버튼 → 실시간 검색)
- [ ] API 엔드포인트 구현 (GET /api/stocks/search?q=...)
- [ ] 설계 문서 업데이트
- [ ] 관련 테스트 작성

### 2. 병합 준비
- [ ] Phase 6 완료
- [ ] feature/stock-search-improvement → main 병합
- [ ] 깃 히스토리 정리

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
│   │   │   ├── AddExpenseModal.tsx   # 지출 추가/수정 모달 (initialData 지원)
│   │   │   └── BudgetChart.tsx       # 카테고리별 실지출 차트
│   │   ├── expenses/
│   │   │   └── ExpenseList.tsx       # 지출 목록 (월 네비게이션 + 수정/삭제)
│   │   ├── budget/
│   │   │   └── BudgetForm.tsx        # 고정지출 항목 추가/삭제
│   │   ├── portfolio/
│   │   │   └── PortfolioList.tsx     # 종목별 추가 매수 주수
│   │   └── goal/
│   │       └── GoalForm.tsx          # 급여 입력 포함
│   ├── hooks/
│   │   ├── useExpenses.ts            # 지출 CRUD (updateExpense, deleteExpense 완성)
│   │   ├── useFixedExpenses.ts       # 고정지출 CRUD
│   │   ├── useDividendGoal.ts        # monthly_salary 포함
│   │   └── useDividendStocks.ts
│   └── types/index.ts                # ExpenseWithCategory 포함
├── supabase/migrations/
│   ├── 20260221000000_add_monthly_salary.sql
│   ├── 20260221000001_add_monthly_fixed_expense.sql (미사용)
│   └── 20260221000002_create_fixed_expenses.sql
└── designs/
    └── 화면기획서_1.pen              # ✅ Phase 7 지출 목록 화면 추가
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

# Pencil 화면 설계 완료 보고서

**작업일**: 2026년 2월 14일  
**작업 브랜치**: `feature/ui-ux-improvement`  
**작업자**: AI Assistant

---

## 작업 개요

Seed Maker 앱의 모든 주요 화면에 대한 Pencil 와이어프레임 설계를 완료하고, 설계된 디자인에 맞춰 실제 컴포넌트를 구현했습니다.

---

## 완료된 Pencil 화면 설계

### 1. Dashboard (홈 화면) ✅
- **위치**: x: 0, y: 0
- **크기**: 375 × 812
- **구성 요소**:
  - 헤더 (Seed Maker 로고, 설정 아이콘)
  - 이번 달 씨앗돈 카드
  - 목표 진행률 카드
  - 연속 기록 뱃지
  - 최근 지출 목록
  - FAB 버튼 (지출 추가)

### 2. AddExpenseModal (지출 추가 모달) ✅
- **위치**: x: 400, y: 0
- **크기**: 375 × 812
- **구성 요소**:
  - 모달 헤더 (제목, 닫기 버튼)
  - 금액 입력 필드
  - 카테고리 선택 그리드 (6개)
  - 날짜 선택
  - 메모 입력
  - 저장 버튼

### 3. BudgetScreen (예산 설정) ✅
- **위치**: x: 800, y: 0
- **크기**: 375 × 812
- **구성 요소**:
  - 헤더 (뒤로가기, 제목)
  - 월 선택
  - 카테고리별 예산 입력 (6개)
  - 총 예산 표시
  - 저장 버튼

### 4. ExpenseListScreen (지출 목록) ✅ **NEW**
- **위치**: x: 1200, y: 0
- **크기**: 375 × 812
- **구성 요소**:
  - 헤더 (뒤로가기, 제목)
  - 지출 추가 버튼
  - 지출 카드 리스트 (금액, 카테고리, 날짜, 메모)
  - 하단 네비게이션

### 5. PortfolioScreen (배당 포트폴리오) ✅ **NEW**
- **위치**: x: 1600, y: 0
- **크기**: 375 × 812
- **구성 요소**:
  - 헤더 (뒤로가기, 제목)
  - 현재 월 배당금 카드
  - 종목 추가 버튼
  - 종목 리스트 (티커, 이름, 보유 수량, 월 배당금)
  - 하단 네비게이션

### 6. GoalScreen (목표 설정) ✅ **NEW**
- **위치**: x: 2000, y: 0
- **크기**: 375 × 812
- **구성 요소**:
  - 헤더 (뒤로가기, 제목)
  - 목표 달성까지 카드 (개월 수, 예상 날짜)
  - 목표 월 배당금 입력
  - 추가 월 납입액 입력
  - 씨앗돈 정보 표시
  - 저장 버튼
  - 하단 네비게이션

---

## 공통 디자인 시스템

### 색상 팔레트
- **Primary (Emerald)**: `#059669` - 주요 액션 버튼, 강조 텍스트
- **Background**: `#FFFFFF` - 화면 배경
- **Card Background**: `#F9FAFB` - 카드 배경
- **Text Primary**: `#111827` - 주요 텍스트
- **Text Secondary**: `#6B7280` - 보조 텍스트
- **Border**: `#E5E7EB` - 테두리

### 타이포그래피
- **헤더 제목**: 20px, 600 weight
- **카드 제목**: 16px, 600 weight
- **금액 (큰)**: 32px, 700 weight
- **금액 (중)**: 18px, 600 weight
- **본문**: 14-16px, 400 weight
- **캡션**: 12px, 400 weight

### 레이아웃
- **화면 너비**: 375px (모바일 기준)
- **화면 높이**: 812px
- **패딩**: 16px (좌우)
- **카드 간격**: 16px
- **카드 모서리**: 12px
- **버튼 높이**: 48px

### 하단 네비게이션
- **높이**: 80px
- **아이템**: 5개 (홈, 지출, 예산, 배당, 목표)
- **아이콘**: 이모지 (🏠, 📝, 💰, 📊, 🎯)
- **활성 상태**: Emerald 색상 + 600 weight

---

## 구현 완료된 컴포넌트

### 1. GoalForm.tsx ✅
- Pencil 디자인에 맞춰 완전히 재구현
- 목표 달성까지 카드 상단 배치
- ₩ 접두사가 있는 입력 필드
- 씨앗돈 정보 카드
- 통일된 버튼 스타일

**주요 변경사항**:
```tsx
// 헤더
<header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 border-b border-gray-100">
  <Link href="/" className="text-2xl text-gray-900">←</Link>
  <h1 className="text-xl font-semibold text-gray-900">목표 설정</h1>
</header>

// 목표 달성 카드
<div className="rounded-xl bg-gray-50 p-5 space-y-2">
  <p className="text-base font-semibold text-gray-900">목표 달성까지</p>
  <p className="text-[32px] font-bold text-emerald-600">{monthsToGoal}개월</p>
</div>

// 입력 필드
<div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3">
  <span className="text-base text-gray-500">₩</span>
  <input className="flex-1 text-base text-gray-900 bg-transparent outline-none" />
</div>
```

### 2. PortfolioList.tsx ✅
- Pencil 디자인에 맞춰 완전히 재구현
- 현재 월 배당금 카드
- 전체 너비 종목 추가 버튼
- 카드 스타일 종목 리스트
- 삭제 기능 제거 (UI 단순화)

**주요 변경사항**:
```tsx
// 헤더
<header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 border-b border-gray-100">
  <Link href="/" className="text-2xl text-gray-900">←</Link>
  <h1 className="text-xl font-semibold text-gray-900">배당 포트폴리오</h1>
</header>

// 월 배당금 카드
<div className="rounded-xl bg-gray-50 p-5 space-y-2">
  <p className="text-base font-semibold text-gray-900">현재 월 배당금</p>
  <p className="text-[32px] font-bold text-emerald-600">{formatKRW(totalMonthlyDividend)}</p>
</div>

// 종목 카드
<div className="rounded-xl bg-gray-50 p-4 space-y-1">
  <p className="text-base font-semibold text-gray-900">{ticker} - {name}</p>
  <p className="text-sm text-gray-500">{quantity}주 · 월 {dividend} 배당</p>
</div>
```

---

## 디자인 일관성 체크리스트

### 헤더 ✅
- [x] 모든 서브 페이지에 뒤로가기 버튼 (←)
- [x] 제목 텍스트 크기 통일 (20px, 600 weight)
- [x] 하단 테두리 (border-gray-100)

### 카드 ✅
- [x] 배경색 통일 (bg-gray-50)
- [x] 모서리 반경 통일 (rounded-xl, 12px)
- [x] 패딩 통일 (p-4 또는 p-5)
- [x] 간격 통일 (space-y-2)

### 버튼 ✅
- [x] Primary 버튼 색상 (bg-emerald-600)
- [x] 버튼 높이 통일 (py-3, 48px)
- [x] 모서리 반경 통일 (rounded-xl)
- [x] 텍스트 크기 통일 (text-base, 16px)

### 입력 필드 ✅
- [x] 배경색 통일 (bg-gray-50)
- [x] 테두리 통일 (border-gray-200)
- [x] ₩ 접두사 (text-gray-500)
- [x] 패딩 통일 (px-3 py-3)

### 하단 네비게이션 ✅
- [x] 모든 주요 페이지에 표시
- [x] 활성 상태 표시 (emerald 색상)
- [x] 아이콘 크기 통일 (24px)
- [x] 라벨 크기 통일 (12px)

---

## 다음 단계

### 1. 테스트 및 검증
- [ ] 모든 화면 간 네비게이션 테스트
- [ ] 데이터 입력 및 저장 테스트
- [ ] 반응형 디자인 테스트 (모바일, 태블릿)
- [ ] 접근성 테스트

### 2. 추가 개선 사항
- [ ] 애니메이션 추가 (페이지 전환, 카드 호버)
- [ ] 스켈레톤 로딩 개선
- [ ] 에러 상태 UI 개선
- [ ] 빈 상태 UI 개선

### 3. 문서화
- [ ] 컴포넌트 사용 가이드 작성
- [ ] 디자인 시스템 문서 작성
- [ ] 스타일 가이드 작성

---

## 완료 요약

✅ **Pencil 화면 설계**: 6개 화면 완료  
✅ **컴포넌트 구현**: 목표 설정, 배당 포트폴리오 완료  
✅ **디자인 통일**: 색상, 타이포그래피, 레이아웃 일관성 확보  
✅ **하단 네비게이션**: 모든 주요 페이지에 적용  

**작업 시간**: 약 2시간  
**커밋 예정**: 2026년 2월 14일

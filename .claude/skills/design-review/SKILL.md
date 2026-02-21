---
name: design-review
description: 디자인 시스템 검증. UI/UX 구현이 설계 가이드라인과 일치하는지 확인
context: fork
agent: Explore
---

# Design Review

Seed Maker 프로젝트의 **엄격한 디자인 시스템**을 따르는지 검증합니다.

## 🎨 설계 시스템 기준

### Color Palette (엄격히 준수)
```
- Primary:           #047857 (emerald-700)  → 주요 액션, 강조 (WCAG 2.1 대비)
- Card BG:           #F9FAFB (gray-50)     → 카드 배경
- Text Primary:      #111827 (gray-900)    → 주요 텍스트
- Text Secondary:    #6B7280 (gray-500)    → 보조 텍스트
```

**검증 방법:**
```bash
# 코드에서 색상 검색
grep -r "#047857\|#F9FAFB\|#111827\|#6B7280\|emerald-700\|gray" <files>
```

### Typography (엄격히 준수)
```
- Header:      20px (text-xl)       / 600 weight (font-semibold)
- Card Title:  16px (text-base)     / 600 weight (font-semibold)
- Amount:      32px (text-[32px])   / 700 weight (font-bold)
- Body:        14-16px (text-sm/base) / 400 weight (font-normal)
```

**검증 예시:**
- 금액 표시: 32px / 700 weight ✅
- 카드 제목: 16px / 600 weight ✅
- 본문 텍스트: 14-16px / 400 weight ✅

### Layout & Spacing
```
- Max Width:       375px (모바일 우선)        → max-w-lg
- Padding:         16px (px-4)               → 모든 카드/페이지
- Card Gap:        16px (space-y-4)          → 카드 간격
- Border Radius:   12px (rounded-xl)         → 모든 라운드 모서리
- Button Height:   48px (py-3)               → 모든 버튼
```

### Component Patterns (필수)
```
✅ Header 패턴:
   - 뒤로가기(←) + 제목
   - border-b 추가

✅ Card 패턴:
   - bg-gray-50 + rounded-xl + p-4/p-5
   - shadow 없음 (최소화)

✅ Button 패턴:
   - bg-emerald-600 + rounded-xl + py-3 + text-white
   - hover 상태 정의

✅ Input 패턴:
   - ₩ 접두사 (금액 입력)
   - bg-gray-50 + border-gray-200
   - placeholder 색상: gray-400
```

## 📋 검증 체크리스트

### 색상 검증
- [ ] Primary 색상이 #047857 (또는 emerald-700) 사용?
- [ ] Card 배경이 #F9FAFB (또는 gray-50) 사용?
- [ ] 텍스트 색상이 정의된 팔레트 내 사용?
- [ ] 임의의 색상(arbitrary color) 추가 없음?

### 타이포그래피 검증
- [ ] 금액은 32px / 700 weight?
- [ ] 헤더는 20px / 600 weight?
- [ ] 카드 제목은 16px / 600 weight?
- [ ] 본문은 14-16px / 400 weight?
- [ ] line-height 일관성?

### 레이아웃 검증
- [ ] Max width 375px 준수?
- [ ] 패딩 16px 일관?
- [ ] 카드 간격 16px 일관?
- [ ] Border radius 12px 일관?
- [ ] Button height 48px?

### 컴포넌트 패턴 검증
- [ ] Header에 border-b?
- [ ] Card에 올바른 배경색?
- [ ] Button 스타일 일관?
- [ ] Input에 ₩ 프리픽스?

## 🔍 검증 대상

검증할 파일 또는 컴포넌트:
```bash
/design-review src/components/GoalForm.tsx
/design-review src/app/dashboard/page.tsx
/design-review web/src/components/  # 폴더 전체
```

## 📊 출력 형식

```
📋 Design Review Report
════════════════════════

✅ [색상] 4/4 통과
  ✓ Primary: #059669 사용 (맞음)
  ✓ Card BG: #F9FAFB 사용 (맞음)
  ✓ Text: 정의된 팔레트만 사용

⚠️ [타이포그래피] 2/4 통과
  ✓ 헤더: text-xl font-semibold (맞음)
  ✗ 금액: 24px (잘못됨) → 32px로 변경 필요
  ✗ 본문: 12px (너무 작음) → 14px 이상 필요

✅ [레이아웃] 5/5 통과
  ✓ Max width: 375px
  ✓ Padding: px-4 (16px)
  ✓ Gap: space-y-4

✅ [컴포넌트 패턴] 3/4 통과
  ✓ Card: 올바른 패턴
  ✓ Button: 올바른 패턴
  ✗ Input: ₩ 프리픽스 누락

📌 [수정 권장사항]
1. src/components/GoalForm.tsx:12
   - 금액 폰트 크기를 24px → 32px로 변경

2. src/components/Common/Input.tsx
   - ₩ 프리픽스 추가
```

## 🚀 사용 방법

```bash
# 단일 파일 검증
/design-review src/components/Button.tsx

# 폴더 전체 검증
/design-review src/components/

# 페이지 검증
/design-review src/app/dashboard/page.tsx
```

## 🎯 검증 우선순위

1. **색상** (가장 중요)
2. **타이포그래피**
3. **레이아웃 & 스페이싱**
4. **컴포넌트 패턴**

## ⚠️ 주의사항

- Tailwind CSS v4 문법 사용 (임의값 최소화)
- CSS-in-JS 대신 Tailwind 클래스만 사용
- 컴포넌트마다 일관성 검증
- 디자인 파일 (.pen)과 코드 비교 가능

---

**모든 UI 변경은 이 검증을 거쳐야 합니다.**

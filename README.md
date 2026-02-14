# Seed Maker 🌱

> 지출 기록 → 절약(씨앗돈) → 배당주 투자 시뮬레이션까지 연결하는 게이미피케이션 기반 예산 관리 앱

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)](https://tailwindcss.com/)

## 왜 만들었나요?

### 문제 인식
기존 가계부 앱은 단순히 **"얼마를 썼는지"**만 보여줍니다. 하지만 정작 중요한 것은:
- ❓ "얼마를 **아꼈는지**"
- ❓ "아낀 돈으로 **무엇을 할 수 있는지**"
- ❓ "**언제쯤** 재정적 자유에 도달할 수 있는지"

많은 사람들이 가계부를 시작하지만, **동기부여 부족**으로 며칠 만에 포기합니다.

### 해결 방법
Seed Maker는 **절약을 투자로 연결**하여 명확한 목표를 제시합니다:

1. **씨앗돈 개념**: 예산 대비 절약액을 "씨앗돈"으로 시각화
   - 예산 30만원, 실지출 25만원 → 씨앗돈 5만원 (씨앗 5알 수확!)
   
2. **배당 투자 시뮬레이션**: 씨앗돈으로 배당주에 투자하면?
   - "매월 10만원씩 모으면 **3년 후** 월 배당 50만원 달성!"
   - 구체적인 숫자와 기간으로 동기부여

3. **게이미피케이션**: 지루한 기록을 재미있게
   - 연속 기록 스트릭 (7일, 30일, 100일 배지)
   - 씨앗 수확 애니메이션
   - 카테고리별 절약 순위

### 타깃 유저
- **30대 FIRE 추구자**: 조기 은퇴를 꿈꾸지만 막연한 사람
- **배당 투자자**: 배당 성장 투자에 관심 있지만 계획이 없는 사람
- **가계부 실패자**: 기존 가계부 앱에서 동기부여를 느끼지 못한 사람

## 핵심 개념

### 1. 씨앗돈 (Seed Money)
```
씨앗돈 = 예산 - 실지출
씨앗 개수 = 씨앗돈 / 10,000원
```
절약액을 "씨앗"으로 시각화하여 성취감을 높입니다.

### 2. 배당 시뮬레이션
```
현재 보유 배당주 + 매월 씨앗돈 투자
→ 목표 월 배당금 달성까지 예상 기간 계산
```
막연한 목표를 **구체적인 숫자와 기간**으로 변환합니다.

### 3. 게이미피케이션
- **연속 기록 스트릭**: 매일 지출 기록 시 배지 획득
- **씨앗 수확**: 절약할 때마다 씨앗 수확 애니메이션
- **카테고리별 순위**: 어느 카테고리에서 가장 많이 아꼈는지

## 프로젝트 구조

```
seed_maker/
├── docs/                          # 기획 문서
│   ├── user-scenarios.md         # 사용자 시나리오
│   ├── screens.md                # 화면 목록 및 와이어프레임
│   ├── db-schema.md              # 데이터베이스 스키마
│   ├── api-spec.md               # REST API 명세
│   ├── 1일차.md                  # 개발 로그 (상세)
│   └── 2026-02-14_진행도.md      # 현재 개발 진행도
├── designs/                       # 디자인 파일
│   └── 화면기획서_1.pen          # Pencil 디자인
├── supabase/
│   └── migrations/               # DB 마이그레이션
│       └── 20250213000000_initial_schema.sql
├── web/                          # Next.js 웹 앱
│   ├── src/
│   │   ├── app/                  # App Router
│   │   ├── components/           # React 컴포넌트
│   │   ├── hooks/                # Custom Hooks
│   │   ├── lib/                  # 유틸리티
│   │   └── types/                # TypeScript 타입
│   ├── .env.local                # 환경 변수 (Git 제외)
│   └── package.json
├── .cursor/
│   └── rules/                    # AI 개발 규칙
│       ├── senior-developer.mdc
│       └── senior-developer-ko.md
└── README.md
```

## 웹 앱 실행

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 가입 후 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/20250213000000_initial_schema.sql` 내용 실행
3. Project Settings → API에서 URL, anon key 복사

### 2. 환경 변수 설정

```bash
cd web
cp .env.example .env.local
```

`.env.local`에 다음 값 입력:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 개발 서버 실행

```bash
cd web
npm install
npm run dev
```

http://localhost:3000 접속 (포트가 사용 중이면 3001, 3002 등으로 자동 변경됨)

### 4. 첫 사용자 생성

```
http://localhost:3000/signup
```

이메일과 비밀번호로 회원가입 후 자동 로그인됩니다.

### 문제 해결

**화면이 안 나올 때**
1. **Supabase 마이그레이션**: SQL Editor에서 `supabase/migrations/20250213000000_initial_schema.sql` 전체 복사 후 실행
2. **환경 변수**: `.env.local` 설정 후 `rm -rf .next && npm run dev` 로 재시작
3. **브라우저 개발자 도구**(F12) → Console 탭에서 에러 확인
4. **외부 터미널 사용**: Cursor IDE 터미널에서 에러 발생 시 iTerm/Terminal.app 사용

## 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **상태 관리**: TanStack Query, Zustand

## 프로젝트 문서

- **개발 진행도**: [`docs/2026-02-14_진행도.md`](docs/2026-02-14_진행도.md) - 현재 개발 상태 및 로드맵
- **기획**: [`docs/user-scenarios.md`](docs/user-scenarios.md), [`docs/screens.md`](docs/screens.md)
- **설계**: [`docs/db-schema.md`](docs/db-schema.md), [`docs/api-spec.md`](docs/api-spec.md)
- **디자인**: [`designs/화면기획서_1.pen`](designs/화면기획서_1.pen)

## 라이선스

MIT License

---

**최종 업데이트**: 2026년 2월 14일  
**개발 상태**: MVP 구현 완료, UI/UX 개선 진행 중

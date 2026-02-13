# Seed Maker 🌱

지출 기록 → 절약(씨앗돈) → 배당주 투자 시뮬레이션까지 연결하는 게이미피케이션 기반 예산 관리 앱

## 프로젝트 구조

```
seed_maker/
├── docs/               # 기획 문서
│   ├── user-scenarios.md
│   ├── screens.md
│   ├── db-schema.md
│   └── api-spec.md
├── supabase/
│   └── migrations/     # DB 스키마
├── web/                # Next.js 웹 앱
└── .cursorrules
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

### 문제 해결

**화면이 안 나올 때**
1. **Supabase 마이그레이션**: SQL Editor에서 `supabase/migrations/20250213000000_initial_schema.sql` 전체 복사 후 실행
2. **환경 변수**: `.env.local` 설정 후 `rm -rf .next && npm run dev` 로 재시작
3. **브라우저 개발자 도구**(F12) → Console 탭에서 에러 확인

## 기능

- **인증**: 이메일/비밀번호 로그인, 회원가입
- **지출**: 카테고리별 지출 기록 (추가, 삭제)
- **예산**: 카테고리별 월 예산 설정
- **씨앗돈 대시보드**: 예산 vs 실지출, 절약액, 씨앗 수확 시각화
- **배당 포트폴리오**: 보유 배당주 입력 (종목, 수량, 주당 연 배당금)
- **목표**: 목표 월 배당금, 추가 월 납입 설정, 달성 예상 기간 시뮬레이션
- **게이미피케이션**: 연속 기록 스트릭, 카테고리별 절약 현황

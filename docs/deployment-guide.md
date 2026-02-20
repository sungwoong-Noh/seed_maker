# 배포 가이드

**구성**: GitHub Actions (CI) + Vercel (CD)

---

## 1. GitHub Actions (CI)

**파일**: `.github/workflows/ci.yml`

### 트리거
- `main`, `master`, `feature/ui-ux-improvement` 브랜치 push
- `main`, `master`로의 PR

### 실행 순서
1. **lint-and-test**: Lint → 단위 테스트 → Next.js 빌드
2. **e2e**: Playwright E2E (비로그인 플로우 + 인증 플로우*)

\* `TEST_EMAIL`, `TEST_PASSWORD`를 Secrets에 추가하면 대시보드·지출·목표 등 전체 E2E 실행

### Secrets (Repo → Settings → Secrets and variables → Actions)

| Secret | 필수 | 용도 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 배포 시 | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 배포 시 | Supabase anon key |
| `TEST_EMAIL` | E2E 전체 | 테스트용 계정 이메일 |
| `TEST_PASSWORD` | E2E 전체 | 테스트용 계정 비밀번호 |

미설정 시 `placeholder`로 빌드만 수행 (E2E 인증 테스트 스킵)

---

## 2. Vercel (CD)

### 설정 순서
1. [vercel.com](https://vercel.com) 로그인 → **Add New Project**
2. GitHub Repo **Import** → `seed_maker` 선택
3. **Root Directory** → `web` 지정 (⚠️ 필수)
4. **Environment Variables** 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **Deploy** 클릭

### 동작
- `main` 브랜치 push → Vercel이 자동 빌드·배포 (CD)
- 프리뷰: PR 생성 시 별도 URL 자동 생성

### CI와의 관계
- GitHub Actions와 Vercel은 **독립 실행**
- Actions: 품질 검증 (테스트)
- Vercel: 배포 (호스팅)

---

## 3. 플랫폼 이전 시 (CD 재설정)

다른 호스팅(Netlify, Railway, CloudFlare 등)으로 옮길 때:

| 항목 | 이전 작업 |
|------|----------|
| **CI** | GitHub Actions 그대로 유지 (`ci.yml` 변경 없음) |
| **CD** | 새 플랫폼의 배포 설정 필요 (Git 연동 또는 Actions deploy job) |
| **환경 변수** | 새 플랫폼에 동일 값 재입력 |
| **루트** | `web` 폴더가 앱 루트임을 새 플랫폼에 지정 |

CI는 그대로, CD만 새 플랫폼에서 다시 연결하면 됨.

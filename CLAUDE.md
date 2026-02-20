# Seed Maker - Claude Code Configuration

## 📋 Project Overview
- **Name**: Seed Maker (시드 메이커)
- **Type**: Next.js 16 + React 19 + TypeScript
- **Purpose**: FIRE 운동 중심의 예산 관리 서비스 (기회비용 기반 절약 추적)
- **Current Branch**: feature/ui-ux-improvement

## 🛠️ Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **UI Library**: Framer Motion, react-hot-toast, Recharts
- **State**: Zustand
- **Data Fetching**: React Query
- **Backend**: Supabase (SSR support)
- **Testing**: Vitest, Playwright
- **Design Tool**: Pencil (.pen files)

## 📁 Project Structure
```
seed_maker/
├── web/                          # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   ├── components/          # React 컴포넌트
│   │   │   ├── common/          # 공통 컴포넌트
│   │   │   └── [feature]/       # 기능별 컴포넌트
│   │   ├── hooks/               # Custom Hooks
│   │   ├── lib/                 # Utilities
│   │   └── types/               # TypeScript 타입
│   └── package.json
├── designs/                      # Pencil 디자인 파일 (.pen)
├── docs/                         # 문서
│   ├── CURRENT_STATE.md         # ⭐ 현재 상태 및 다음 작업
│   ├── api-spec.md              # API 명세
│   └── YYYY-MM-DD/              # 일일 작업 로그
├── supabase/                     # Supabase 설정
└── .github/                      # CI/CD 설정
```

## 🎨 Design System (엄격히 따르기)
**Color Palette:**
- Primary: `#059669` (emerald-600) - 주요 액션
- Card BG: `#F9FAFB` (gray-50)
- Text Primary: `#111827` (gray-900)
- Text Secondary: `#6B7280` (gray-500)

**Typography:**
- Header: 20px / 600 weight
- Card Title: 16px / 600 weight
- Amount: 32px / 700 weight
- Body: 14-16px / 400 weight

**Layout:**
- Max Width: 375px (모바일 우선)
- Padding: 16px (px-4)
- Gap: 16px
- Border Radius: 12px
- Button Height: 48px

## 💡 Working Principles
1. **⭐ 한국어로 응답**: 모든 답변과 커뮤니케이션은 한국어로 진행
2. **Always check context first**: Read `@docs/CURRENT_STATE.md` before starting any task
3. **Document work**: Update docs after completing significant tasks
4. **Code style matters**: Follow naming conventions strictly
   - Components: PascalCase
   - Hooks/Utils: camelCase
   - Types: PascalCase
5. **Formatting**: Always use `formatKRW()` for amounts
6. **UI Feedback**: Use `showSuccess()` / `showError()` for toasts

## 📝 Commit Message Format
```
<type>: <subject>

## Changes
- 변경사항 1
- 변경사항 2
```
**Types**: feat, fix, docs, style, refactor, test, chore

## 🔑 Important Commands
- Dev: `npm run dev` (web 디렉토리)
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm run test:watch`
- E2E: `npm run test:e2e:ui`

## 🔗 Key Documents
- **Current Status** ⭐: `@docs/CURRENT_STATE.md`
- **Design Files**: `@designs/*.pen`
- **API Spec**: `@docs/api-spec.md`
- **Work Logs**: `@docs/YYYY-MM-DD/`

## 📌 Working Memory
- Use `/Users/nohsw/.claude/projects/-Users-nohsw-Desktop-work-seed-maker/memory/` for persistent notes
- Save patterns, decisions, and recurring solutions
- Update MEMORY.md for cross-session knowledge

## ⚠️ Before Any Task
1. Check `docs/CURRENT_STATE.md` for context
2. Verify branch alignment
3. Review related design files (.pen)
4. Check for ongoing work in task list

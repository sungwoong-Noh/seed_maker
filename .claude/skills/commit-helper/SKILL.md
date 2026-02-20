---
name: commit-helper
description: 커밋 메시지 작성 도우미. 규칙에 맞는 형식으로 변경사항을 정리하고 커밋 수행
disable-model-invocation: false
allowed-tools: Bash, Read, Edit
---

# Commit Helper

CLAUDE.md에 정의된 커밋 메시지 규칙을 따르는 도우미입니다.

## 📋 커밋 메시지 규칙

```
<type>: <subject>

## Changes
- 변경사항 1
- 변경사항 2
```

## 📌 Type 종류

- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 코드 포맷팅, 세미콜론 등 (논리 변경 없음)
- **refactor**: 코드 리팩토링 (기능 변경 없음)
- **test**: 테스트 추가 또는 수정
- **chore**: 빌드 설정, 의존성 업데이트 등

## 🎯 작업 흐름

### 1. 변경사항 확인
```bash
git status          # 변경된 파일 목록
git diff           # 구체적 변경사항 확인
```

### 2. Type 선택
사용자에게 type 선택지 제시:
- [ ] feat - 새로운 기능
- [ ] fix - 버그 수정
- [ ] docs - 문서
- [ ] style - 포맷팅
- [ ] refactor - 리팩토링
- [ ] test - 테스트
- [ ] chore - 유지보수

### 3. 메시지 작성
- **subject**: 과거형이 아닌 명령형 사용
  - ❌ "Added login feature"
  - ✅ "Add login feature"

- **Changes**: 변경사항 목록 작성
  - 구체적이고 명확하게
  - 줄 단위로 분리

### 4. 커밋 실행
```bash
git add <files>
git commit -m "..."
```

## 📝 좋은 예시

### 예시 1: 기능 추가
```
feat: 기회비용 계산 기능 추가

## Changes
- OpportunityCost 컴포넌트 생성
- calculateOpportunityCost() 유틸 함수 작성
- 테스트 케이스 추가 (5개)
- useOpportunityCost 커스텀 훅 구현
```

### 예시 2: 버그 수정
```
fix: 금액 포맷팅 에러 수정

## Changes
- formatKRW()에서 음수 처리 버그 해결
- 테스트 케이스 2개 추가
- 관련 컴포넌트 재검증
```

### 예시 3: 문서 수정
```
docs: CURRENT_STATE.md 업데이트

## Changes
- 완료된 작업 섹션 정리
- 다음 예정 작업 추가
- 진행률 업데이트 (75%)
```

## 🚀 사용 방법

```bash
/commit-helper
/commit-helper feat  # 특정 타입으로 시작
```

## ⚠️ 안전장치

- ✅ 미스테이징 파일 경고
- ✅ 비어있는 커밋 방지
- ✅ 메시지 길이 검증
- ✅ 브랜치 불일치 확인

---

**모든 커밋은 이 양식을 따라야 합니다.**

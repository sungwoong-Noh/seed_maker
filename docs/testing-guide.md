# Seed Maker 테스트 가이드

## 테스트 종류

| 구분 | 도구 | 대상 | 용도 |
|------|------|------|------|
| **단위** | Vitest | 순수 함수, 유틸, 컴포넌트 | 로직 검증, 빠른 피드백 |
| **E2E** | Playwright | 브라우저 동작 | 사용자 시나리오 검증 |

## 테스트 현황

- **단위**: format, simulation, utils, categoryIcons, dashboardCalc, BudgetChart, SeedMoneyTrendChart
- **E2E**: 로그인/회원가입/네비게이션, 대시보드, **지출/예산/목표** 비즈니스 플로우(인증 시)

---

## 단위 테스트 작성 패턴

```
Given (준비) → When (실행) → Then (검증)
또는 Arrange → Act → Assert
```

```ts
it("목표가 현재 배당과 같으면 0개월", () => {
  // Given: 목표 10만, 현재 10만
  const target = 100000;
  const current = 100000;
  const deposit = 50000;

  // When: 시뮬레이션 실행
  const result = simulateMonthsToGoal(target, current, deposit);

  // Then: 0개월
  expect(result.monthsToGoal).toBe(0);
});
```

- **테스트할 것**: 입력 → 출력이 예상대로인지
- **엣지 케이스**: 0, 음수, 경계값, 빈 값

---

## E2E 테스트 작성 패턴

```
페이지 이동 → 요소 확인/상호작용 → 결과 검증
```

```ts
test("로그인 버튼 클릭 시 처리된다", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("이메일").fill("test@test.com");
  await page.getByLabel("비밀번호").fill("password123");
  await page.getByRole("button", { name: /로그인/ }).click();
  // 리다이렉트 또는 에러 메시지 검증
});
```

- **우선순위**: 로그인/회원가입, 주요 플로우
- **세부보다는**: "사용자가 할 수 있는가"에 집중

---

## 명령어

```bash
npm run test        # 단위 테스트
npm run test:watch  # 단위 (감시)
npm run test:e2e    # E2E (서버 실행 중 상태에서)
```

## 인증 E2E (대시보드 등)

`TEST_EMAIL`, `TEST_PASSWORD` 환경변수를 설정한 뒤 실행:

```bash
TEST_EMAIL=your@email.com TEST_PASSWORD=yourpassword npm run test:e2e
```

최초 실행 시 `auth.setup.ts`가 로그인 후 `.auth/user.json`을 저장하고, `dashboard.spec.ts`가 대시보드 기능을 검증합니다.

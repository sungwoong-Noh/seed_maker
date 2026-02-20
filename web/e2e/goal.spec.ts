import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const authFile = path.join(__dirname, ".auth", "user.json");
const hasAuth = fs.existsSync(authFile);
const describeFn = hasAuth ? test.describe : test.describe.skip;

describeFn("목표 E2E (로그인 필요)", () => {
  if (hasAuth) {
    test.use({ storageState: authFile });
  }

  test("목표 입력 → 저장 → 시뮬레이션 표시", async ({ page }) => {
    await page.goto("/goal");

    // 목표 월 배당금 입력
    const targetInput = page.getByPlaceholder("1,000,000");
    await targetInput.waitFor({ state: "visible", timeout: 10000 });
    await targetInput.fill("1000000");

    // 저장
    await page.getByRole("button", { name: /^저장$/ }).click();

    // 토스트 확인
    await expect(page.getByText("목표가 저장되었습니다")).toBeVisible({ timeout: 5000 });

    // 목표 달성까지 시뮬레이션 표시 - strict mode 이슈로 .first() 사용
    await expect(
      page.getByText(/목표 달성까지|달성!|\d+개월/).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("목표 설정 페이지 헤더가 표시된다", async ({ page }) => {
    await page.goto("/goal");
    await expect(page.getByRole("heading", { name: "목표 설정" })).toBeVisible();
  });

  test("씨앗돈 정보가 표시된다", async ({ page }) => {
    await page.goto("/goal");
    await expect(page.getByText(/이번 달 씨앗돈|월 총 납입 예상/).first()).toBeVisible({ timeout: 5000 });
  });
});

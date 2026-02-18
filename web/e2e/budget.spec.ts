import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const authFile = path.join(__dirname, ".auth", "user.json");
const hasAuth = fs.existsSync(authFile);
const describeFn = hasAuth ? test.describe : test.describe.skip;

describeFn("예산 E2E (로그인 필요)", () => {
  if (hasAuth) {
    test.use({ storageState: authFile });
  }

  test("예산 입력 → 저장 → 토스트 표시", async ({ page }) => {
    await page.goto("/budget");

    // 첫 번째 카테고리(식비) 예산 입력 - .first()로 단일 요소 지정 (form 전체가 매칭되는 strict mode 이슈)
    const 식비Input = page.getByPlaceholder("0").first();
    await 식비Input.waitFor({ state: "visible", timeout: 10000 });
    await 식비Input.fill("300000");

    // 저장
    await page.getByRole("button", { name: /^저장$/ }).click();

    // 토스트 확인
    await expect(page.getByText("예산이 저장되었습니다")).toBeVisible({ timeout: 5000 });
  });

  test("예산 저장 후 대시보드에 반영된다", async ({ page }) => {
    await page.goto("/budget");

    const 식비Input = page.getByPlaceholder("0").first();
    await 식비Input.waitFor({ state: "visible", timeout: 10000 });
    await 식비Input.fill("500000");

    await page.getByRole("button", { name: /^저장$/ }).click();
    await expect(page.getByText("예산이 저장되었습니다")).toBeVisible({ timeout: 5000 });

    // 대시보드로 이동
    await page.getByRole("link", { name: /홈/ }).click();
    await expect(page).toHaveURL("/");

    // 씨앗돈 또는 예산 관련 텍스트 표시 (strict mode → .first())
    await expect(page.getByText(/이번 달 씨앗돈|씨앗.*수확/).first()).toBeVisible({ timeout: 5000 });
  });

  test("예산 설정 페이지 헤더가 표시된다", async ({ page }) => {
    await page.goto("/budget");
    await expect(page.getByRole("heading", { name: "예산 설정" })).toBeVisible();
  });
});

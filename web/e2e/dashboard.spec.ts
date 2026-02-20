import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const authFile = path.join(__dirname, ".auth", "user.json");

const hasAuth = fs.existsSync(authFile);
const describeFn = hasAuth ? test.describe : test.describe.skip;

describeFn("대시보드 (로그인 후)", () => {
  if (hasAuth) {
    test.use({ storageState: authFile });
  }

  test("씨앗돈 카드가 표시된다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/이번 달 씨앗돈/)).toBeVisible();
    await expect(page.getByText(/씨앗.*수확/)).toBeVisible();
  });

  test("최근 지출 섹션이 있다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /최근 지출/ })).toBeVisible();
  });

  test("지출 추가 FAB이 있다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /지출 추가/ })).toBeVisible();
  });

  test("FAB 클릭 시 지출 추가 모달이 열린다", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /지출 추가/ }).click();
    await expect(page.getByRole("heading", { name: "지출 추가" })).toBeVisible();
  });

  test("하단 네비게이션이 있다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: /메인 네비게이션/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /홈/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /지출/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /예산/ })).toBeVisible();
  });
});

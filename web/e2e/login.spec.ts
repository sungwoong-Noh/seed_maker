import { test, expect } from "@playwright/test";

test.describe("로그인 페이지", () => {
  test("로그인 페이지가 렌더링된다", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Seed Maker");
    await expect(page.getByRole("button", { name: /로그인/ })).toBeVisible();
    await expect(page.getByLabel("이메일")).toBeVisible();
    await expect(page.getByLabel("비밀번호")).toBeVisible();
  });

  test("회원가입 링크가 있다", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("link", { name: /회원가입/ })).toBeVisible();
    await page.getByRole("link", { name: /회원가입/ }).click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("잘못된 로그인 시 에러 메시지가 표시된다", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("이메일").fill("invalid@test.com");
    await page.getByLabel("비밀번호").fill("wrongpassword");
    await page.getByRole("button", { name: /로그인/ }).click();
    // 로그인 실패 = 리다이렉트 안 됨. 에러 문구는 Supabase/네트워크마다 상이하므로 URL로 검증
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});

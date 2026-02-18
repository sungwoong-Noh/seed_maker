import { test, expect } from "@playwright/test";

test.describe("회원가입 페이지", () => {
  test("회원가입 페이지가 렌더링된다", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("h1")).toContainText("Seed Maker");
    await expect(page.getByRole("button", { name: /회원가입/ })).toBeVisible();
    await expect(page.getByLabel("이메일")).toBeVisible();
    await expect(page.getByLabel("비밀번호", { exact: true })).toBeVisible();
    await expect(page.getByLabel("비밀번호 확인")).toBeVisible();
  });

  test("로그인 링크가 있다", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("link", { name: /로그인/ })).toBeVisible();
    await page.getByRole("link", { name: /로그인/ }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("비밀번호 불일치 시 에러 메시지가 표시된다", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("이메일").fill("test@test.com");
    await page.getByLabel("비밀번호", { exact: true }).fill("password123");
    await page.getByLabel("비밀번호 확인").fill("different456");
    await page.getByRole("button", { name: /회원가입/ }).click();
    await expect(page.getByText("비밀번호가 일치하지 않습니다")).toBeVisible();
  });

  test("비밀번호 입력 필드에 6자 이상 안내가 표시된다", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByText("6자 이상")).toBeVisible();
  });
});

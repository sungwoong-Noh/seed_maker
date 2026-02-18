import { test, expect } from "@playwright/test";

test.describe("비로그인 접근", () => {
  test("로그인 필요 페이지 접근 시 로그인으로 리다이렉트된다", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("예산 페이지 접근 시 로그인으로 리다이렉트된다", async ({ page }) => {
    await page.goto("/budget");
    await expect(page).toHaveURL(/\/login/);
  });

  test("지출 페이지 접근 시 로그인으로 리다이렉트된다", async ({ page }) => {
    await page.goto("/expenses");
    await expect(page).toHaveURL(/\/login/);
  });

  test("배당 페이지 접근 시 로그인으로 리다이렉트된다", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page).toHaveURL(/\/login/);
  });

  test("목표 페이지 접근 시 로그인으로 리다이렉트된다", async ({ page }) => {
    await page.goto("/goal");
    await expect(page).toHaveURL(/\/login/);
  });
});

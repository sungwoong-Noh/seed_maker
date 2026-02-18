import { test as setup, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const authFile = path.join(__dirname, ".auth", "user.json");

setup("로그인하여 인증 상태 저장", async ({ page }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  setup.skip(!email || !password, "TEST_EMAIL, TEST_PASSWORD 필요");

  await page.goto("/login");
  await page.getByLabel("이메일").fill(email!);
  await page.getByLabel("비밀번호", { exact: true }).fill(password!);
  await page.getByRole("button", { name: /로그인/ }).click();

  await expect(page).toHaveURL(/\/(?!login)/, { timeout: 10000 });
  // 대시보드 진입 확인 (strict mode → .first())
  await expect(
    page.getByText(/이번 달 씨앗돈|씨앗.*수확|로딩 중|데이터를 불러올 수 없습니다/).first()
  ).toBeVisible({ timeout: 15000 });

  const dir = path.dirname(authFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  await page.context().storageState({ path: authFile });
});

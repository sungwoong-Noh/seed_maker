import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const authFile = path.join(__dirname, ".auth", "user.json");
const hasAuth = fs.existsSync(authFile);
const describeFn = hasAuth ? test.describe : test.describe.skip;

describeFn("지출 E2E (로그인 필요)", () => {
  if (hasAuth) {
    test.use({ storageState: authFile });
  }

  test("지출 추가 → 저장 → 목록에 표시된다", async ({ page }) => {
    const uniqueAmount = 9999 + Math.floor(Math.random() * 90000);
    const uniqueMemo = `E2E테스트_${Date.now()}`;

    await page.goto("/expenses");

    // 지출 추가 버튼 클릭
    await page.getByRole("button", { name: /지출 추가/ }).click();

    // 모달에서 입력 (Modal에 role=dialog 없음 → heading으로 검증)
    await expect(page.getByRole("heading", { name: "지출 추가" })).toBeVisible();
    // 저장 버튼 활성화 대기 (카테고리 로드 후 categoryId 설정됨)
    await expect(page.getByRole("button", { name: "저장" })).toBeEnabled({ timeout: 5000 });
    await page.getByLabel("금액").fill(String(uniqueAmount));
    await page.getByLabel("메모 (선택)").fill(uniqueMemo);

    // 저장
    await page.getByRole("button", { name: "저장" }).click();

    // 목록에 새 지출 표시 대기 (실제 결과 검증, 모달/토스트 타이밍 무관)
    await expect(page.getByText(uniqueMemo)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(new RegExp(`${uniqueAmount.toLocaleString()}`))).toBeVisible();
  });

  test("지출 목록 페이지에 지출 추가 버튼이 있다", async ({ page }) => {
    await page.goto("/expenses");
    await expect(page.getByRole("button", { name: /지출 추가/ })).toBeVisible();
  });

  test("지출 목록 헤더가 표시된다", async ({ page }) => {
    await page.goto("/expenses");
    await expect(page.getByRole("heading", { name: "지출 목록" })).toBeVisible();
  });
});

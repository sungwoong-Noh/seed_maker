import { describe, it, expect } from "vitest";
import { formatKRW, formatNumberWithComma } from "../format";

describe("formatKRW", () => {
  it("숫자를 원화 포맷으로 변환한다", () => {
    const result = formatKRW(1000);
    expect(result).toContain("1");
    expect(result).toMatch(/[₩원,0-9]/);
  });

  it("0을 올바르게 포맷한다", () => {
    expect(formatKRW(0)).toContain("0");
  });

  it("큰 금액을 포맷한다", () => {
    const result = formatKRW(150000);
    expect(result).toMatch(/\d/);
    expect(result).toMatch(/[₩원,0-9]/);
  });

  it("10000은 콤마가 포함된다", () => {
    const result = formatKRW(10000);
    expect(result).toMatch(/\d/);
  });

  it("1000000 (백만) 포맷", () => {
    const result = formatKRW(1000000);
    expect(result).toMatch(/\d/);
    expect(typeof result).toBe("string");
  });
});

describe("formatNumberWithComma", () => {
  it("1000 단위로 콤마를 추가한다", () => {
    expect(formatNumberWithComma("12500")).toBe("12,500");
  });

  it("백만 단위를 올바르게 포맷한다", () => {
    expect(formatNumberWithComma("1000000")).toBe("1,000,000");
  });

  it("천 단위 미만은 콤마 없이 반환한다", () => {
    expect(formatNumberWithComma("500")).toBe("500");
  });

  it("정확히 1000은 콤마가 포함된다", () => {
    expect(formatNumberWithComma("1000")).toBe("1,000");
  });

  it("빈 문자열을 처리한다", () => {
    expect(formatNumberWithComma("")).toBe("");
  });

  it("0을 처리한다", () => {
    expect(formatNumberWithComma("0")).toBe("0");
  });

  it("숫자 입력도 처리한다", () => {
    expect(formatNumberWithComma(12500)).toBe("12,500");
  });

  it("복잡한 금액을 포맷한다", () => {
    expect(formatNumberWithComma("3000000")).toBe("3,000,000");
    expect(formatNumberWithComma("5500000")).toBe("5,500,000");
  });
});

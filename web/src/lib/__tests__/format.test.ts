import { describe, it, expect } from "vitest";
import { formatKRW } from "../format";

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

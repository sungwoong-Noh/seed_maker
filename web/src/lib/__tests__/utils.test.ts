import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn (className merge)", () => {
  it("여러 클래스를 합친다", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("조건부 클래스를 적용한다", () => {
    expect(cn("base", false && "hidden", true && "visible")).toBe("base visible");
  });

  it("Tailwind 충돌 시 나중 것이 우선한다", () => {
    const result = cn("p-4", "p-2");
    expect(result).toBe("p-2");
  });

  it("빈 입력이면 빈 문자열", () => {
    expect(cn()).toBe("");
  });
});

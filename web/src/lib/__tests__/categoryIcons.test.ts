import { describe, it, expect } from "vitest";
import { getCategoryIcon } from "../categoryIcons";

describe("getCategoryIcon", () => {
  it("알려진 카테고리는 해당 이모지를 반환한다", () => {
    expect(getCategoryIcon("식비")).toBe("🍽️");
    expect(getCategoryIcon("교통")).toBe("🚇");
    expect(getCategoryIcon("쇼핑")).toBe("🛍️");
    expect(getCategoryIcon("의료")).toBe("🏥");
    expect(getCategoryIcon("기타")).toBe("📦");
  });

  it("알 수 없는 카테고리는 기본 아이콘을 반환한다", () => {
    expect(getCategoryIcon("공과금")).toBe("📌");
    expect(getCategoryIcon("unknown")).toBe("📌");
  });

  it("빈 문자열은 기본 아이콘", () => {
    expect(getCategoryIcon("")).toBe("📌");
  });
});

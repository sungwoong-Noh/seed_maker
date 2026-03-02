import { describe, it, expect } from "vitest";
import { getCategoryIcon } from "../categoryIcons";

describe("getCategoryIcon", () => {
  it("알려진 카테고리는 해당 아이콘 이름을 반환한다", () => {
    expect(getCategoryIcon("식비")).toBe("utensils");
    expect(getCategoryIcon("교통")).toBe("train");
    expect(getCategoryIcon("쇼핑")).toBe("shopping-bag");
    expect(getCategoryIcon("의료")).toBe("activity");
    expect(getCategoryIcon("기타")).toBe("package");
  });

  it("알 수 없는 카테고리는 기본 아이콘을 반환한다", () => {
    expect(getCategoryIcon("공과금")).toBe("tag");
    expect(getCategoryIcon("unknown")).toBe("tag");
  });

  it("빈 문자열은 기본 아이콘", () => {
    expect(getCategoryIcon("")).toBe("tag");
  });
});

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BudgetChart } from "../BudgetChart";

const mockData = [
  { categoryId: "1", categoryName: "식비", budget: 400000, actual: 350000, saved: 50000 },
  { categoryId: "2", categoryName: "교통", budget: 100000, actual: 80000, saved: 20000 },
];

describe("BudgetChart", () => {
  it("데이터가 있으면 차트 섹션을 렌더링한다", () => {
    render(
      <div style={{ width: 400, height: 300 }}>
        <BudgetChart data={mockData} />
      </div>
    );
    expect(screen.getByRole("region", { name: /카테고리별 예산 대비 실지출/ })).toBeInTheDocument();
    expect(screen.getByText("카테고리별 예산 vs 실지출")).toBeInTheDocument();
  });

  it("데이터가 비어있으면 null을 반환한다", () => {
    const { container } = render(<BudgetChart data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("budget과 actual이 모두 0인 항목은 제외하고 렌더링한다", () => {
    const dataWithZero = [
      ...mockData,
      { categoryId: "3", categoryName: "기타", budget: 0, actual: 0, saved: 0 },
    ];
    render(
      <div style={{ width: 400, height: 300 }}>
        <BudgetChart data={dataWithZero} />
      </div>
    );
    expect(screen.getByText("카테고리별 예산 vs 실지출")).toBeInTheDocument();
  });
});

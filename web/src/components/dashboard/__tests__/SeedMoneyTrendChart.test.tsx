// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SeedMoneyTrendChart } from "../SeedMoneyTrendChart";

const mockTrend = [
  { yearMonth: "2025-09", label: "2025.9", seedMoney: 150000 },
  { yearMonth: "2025-10", label: "2025.10", seedMoney: 80000 },
  { yearMonth: "2025-11", label: "2025.11", seedMoney: 120000 },
];

describe("SeedMoneyTrendChart", () => {
  it("데이터가 있으면 트렌드 차트를 렌더링한다", () => {
    render(
      <div style={{ width: 400, height: 300 }}>
        <SeedMoneyTrendChart data={mockTrend} />
      </div>
    );
    expect(screen.getByRole("region", { name: /월별 씨앗돈 트렌드/ })).toBeInTheDocument();
    expect(screen.getByText("월별 씨앗돈 트렌드")).toBeInTheDocument();
  });

  it("데이터가 비어있으면 null을 반환한다", () => {
    const { container } = render(<SeedMoneyTrendChart data={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

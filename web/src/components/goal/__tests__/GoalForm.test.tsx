// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoalForm } from "../GoalForm";

const mockUpsertGoal = vi.fn();

vi.mock("@/hooks/useDividendGoal", () => ({
  useDividendGoal: () => ({
    goal: null,
    isLoading: false,
    upsertGoal: mockUpsertGoal,
  }),
}));

vi.mock("@/hooks/useDividendStocks", () => ({
  useDividendStocks: () => ({
    stocks: [],
    isLoading: false,
  }),
}));

vi.mock("@/lib/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

vi.mock("@/components/common/BottomNav", () => ({
  BottomNav: () => <nav data-testid="bottom-nav" />,
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("GoalForm", () => {
  const defaultProps = {
    userId: "user1",
    yearMonth: "2026-02",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("헤더와 목표 설정 폼을 렌더링한다", async () => {
    render(<GoalForm {...defaultProps} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "목표 설정" })).toBeInTheDocument();
    });
    expect(screen.getByText(/목표 월 배당금/)).toBeInTheDocument();
    expect(screen.getByText(/추가 월 납입액/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
  });

  it("목표 설정 폼의 모든 입력 필드를 표시한다", async () => {
    render(<GoalForm {...defaultProps} />, { wrapper });
    await waitFor(() => expect(screen.getByText("고정 급여 (월)")).toBeInTheDocument());
    expect(screen.getByText("목표 월 배당금")).toBeInTheDocument();
    expect(screen.getByText("추가 월 납입액")).toBeInTheDocument();
  });

  it("목표 월 배당금·급여·추가 납입 입력 후 저장 시 upsertGoal이 호출된다", async () => {
    mockUpsertGoal.mockResolvedValue(undefined);

    render(<GoalForm {...defaultProps} />, { wrapper });

    await waitFor(() => expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument());

    const salaryInput = screen.getByPlaceholderText("3,000,000");
    const targetInput = screen.getByPlaceholderText("1,000,000");
    const extraInput = screen.getByPlaceholderText("500,000");

    fireEvent.change(salaryInput, { target: { value: "3000000" } });
    fireEvent.change(targetInput, { target: { value: "1000000" } });
    fireEvent.change(extraInput, { target: { value: "100000" } });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(mockUpsertGoal).toHaveBeenCalledWith({
        target_monthly_dividend: 1000000,
        extra_monthly_deposit: 100000,
        monthly_salary: 3000000,
      });
    });
  });
});

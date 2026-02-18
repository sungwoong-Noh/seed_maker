// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BudgetForm } from "../BudgetForm";

const mockUpsertBudgets = vi.fn();

vi.mock("@/hooks/useBudgets", () => ({
  useBudgets: () => ({
    budgets: [],
    isLoading: false,
    upsertBudgets: mockUpsertBudgets,
  }),
}));

vi.mock("@/lib/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === "categories") {
        return {
          select: () => ({
            order: () =>
              Promise.resolve({
                data: [
                  { id: "cat1", name: "식비" },
                  { id: "cat2", name: "교통" },
                ],
                error: null,
              }),
          }),
        };
      }
      return { select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) };
    },
  }),
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

describe("BudgetForm", () => {
  const defaultProps = {
    userId: "user1",
    yearMonth: "2026-02",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("헤더와 예산 설정 폼을 렌더링한다", async () => {
    render(<BudgetForm {...defaultProps} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText("식비")).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "예산 설정" })).toBeInTheDocument();
    expect(screen.getByText("교통")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
  });

  it("월 표시가 yearMonth 형식으로 보인다", async () => {
    render(<BudgetForm {...defaultProps} />, { wrapper });
    await waitFor(() => expect(screen.getByText(/2026년.*월/)).toBeInTheDocument());
  });

  it("총 예산 입력 후 저장 시 upsertBudgets가 호출된다", async () => {
    mockUpsertBudgets.mockResolvedValue(undefined);

    render(<BudgetForm {...defaultProps} />, { wrapper });

    await waitFor(() => expect(screen.getByText("식비")).toBeInTheDocument());

    const inputs = screen.getAllByPlaceholderText("0");
    fireEvent.change(inputs[0], { target: { value: "100000" } });
    fireEvent.change(inputs[1], { target: { value: "50000" } });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(mockUpsertBudgets).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ category_id: "cat1", amount: 100000 }),
          expect.objectContaining({ category_id: "cat2", amount: 50000 }),
        ])
      );
    });
  });
});

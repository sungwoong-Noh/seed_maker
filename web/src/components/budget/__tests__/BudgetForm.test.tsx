// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BudgetForm } from "../BudgetForm";

const mockAddItem = vi.fn();
const mockDeleteItem = vi.fn();

vi.mock("@/hooks/useFixedExpenses", () => ({
  useFixedExpenses: () => ({
    items: [
      { id: "1", user_id: "user1", name: "월세", amount: 1500000, created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z" },
      { id: "2", user_id: "user1", name: "보험료", amount: 300000, created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z" },
    ],
    isLoading: false,
    addItem: mockAddItem,
    deleteItem: mockDeleteItem,
  }),
}));

vi.mock("@/lib/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

vi.mock("@/components/common/BottomNav", () => ({
  BottomNav: () => <nav data-testid="bottom-nav" />,
}));

describe("BudgetForm", () => {
  const defaultProps = {
    userId: "user1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("헤더와 고정지출 폼을 렌더링한다", async () => {
    render(<BudgetForm {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("고정지출")).toBeInTheDocument();
    });
    expect(screen.getByText("월 고정지출 합계")).toBeInTheDocument();
    expect(screen.getByText("항목 추가")).toBeInTheDocument();
  });

  it("고정지출 항목을 표시한다", async () => {
    render(<BudgetForm {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("월세")).toBeInTheDocument();
      expect(screen.getByText("보험료")).toBeInTheDocument();
    });
  });

  it("항목 추가 후 addItem이 호출된다", async () => {
    mockAddItem.mockResolvedValue(undefined);

    render(<BudgetForm {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText("항목명 (예: 월세, 보험료)");
    const amountInput = screen.getByPlaceholderText("500,000");
    const addButton = screen.getByRole("button", { name: "+ 추가" });

    fireEvent.change(nameInput, { target: { value: "통신비" } });
    fireEvent.change(amountInput, { target: { value: "80000" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddItem).toHaveBeenCalledWith({
        name: "통신비",
        amount: 80000,
      });
    });
  });
});

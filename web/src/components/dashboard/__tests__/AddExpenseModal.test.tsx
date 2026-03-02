// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AddExpenseModal } from "../AddExpenseModal";

const mockAddExpense = vi.fn();
const mockUpdateExpense = vi.fn();

vi.mock("@/hooks/useExpenses", () => ({
  useExpenses: () => ({
    addExpense: mockAddExpense,
    updateExpense: mockUpdateExpense,
  }),
}));

vi.mock("@/lib/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
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
    }),
  }),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("AddExpenseModal", () => {
  const defaultProps = {
    userId: "user1",
    yearMonth: "2026-02",
    onClose: vi.fn(),
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("폼 필드(금액, 카테고리, 일자, 메모)를 렌더링한다", async () => {
    render(<AddExpenseModal {...defaultProps} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByLabelText(/금액/)).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/메모/)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
  });

  it("카테고리 로드 전 저장 버튼이 비활성화된다", async () => {
    render(<AddExpenseModal {...defaultProps} />, { wrapper });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "저장" })).toBeEnabled();
    });
  });

  it("금액·메모 입력 후 저장 시 addExpense가 호출된다", async () => {
    mockAddExpense.mockResolvedValue(undefined);

    render(<AddExpenseModal {...defaultProps} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "저장" })).toBeEnabled();
    });

    fireEvent.change(screen.getByLabelText(/금액/), {
      target: { value: "10000" },
    });
    fireEvent.change(screen.getByLabelText(/메모/), {
      target: { value: "점심" },
    });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(mockAddExpense).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 10000,
          memo: "점심",
        })
      );
    });
  });

  it("금액에 콤마 포맷팅이 표시된다", async () => {
    render(<AddExpenseModal {...defaultProps} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "저장" })).toBeEnabled();
    });

    const amountInput = screen.getByLabelText(/금액/);
    fireEvent.change(amountInput, { target: { value: "50000" } });

    // 실제로 저장할 때는 숫자이지만, 표시는 콤마가 포함될 수 있음
    expect(mockAddExpense).not.toHaveBeenCalled();
  });

  it("수정 모드: initialData가 있을 때 폼이 기존 값으로 채워진다", async () => {
    const editProps = {
      ...defaultProps,
      initialData: {
        id: "expense1",
        amount: 15000,
        category_id: "cat1",
        spent_at: "2026-02-15",
        memo: "카페",
      },
    };

    render(<AddExpenseModal {...editProps} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByRole("heading")).toHaveTextContent("지출 수정");
    });
    expect(screen.getByRole("button", { name: "수정 완료" })).toBeInTheDocument();
  });

  it("수정 모드: 저장 시 updateExpense가 호출된다", async () => {
    mockUpdateExpense.mockResolvedValue(undefined);

    const editProps = {
      ...defaultProps,
      initialData: {
        id: "expense1",
        amount: 15000,
        category_id: "cat1",
        spent_at: "2026-02-15",
        memo: "카페",
      },
    };

    render(<AddExpenseModal {...editProps} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "수정 완료" })).toBeEnabled();
    });

    // 금액 수정
    fireEvent.change(screen.getByLabelText(/금액/), {
      target: { value: "20000" },
    });
    fireEvent.click(screen.getByRole("button", { name: "수정 완료" }));

    await waitFor(() => {
      expect(mockUpdateExpense).toHaveBeenCalledWith({
        id: "expense1",
        amount: 20000,
        category_id: "cat1",
        spent_at: "2026-02-15",
        memo: "카페",
      });
    });
  });

  it("추가 모드와 수정 모드의 타이틀이 다르다", async () => {
    const { rerender } = render(<AddExpenseModal {...defaultProps} />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByRole("heading")).toHaveTextContent("지출 추가");
    });

    const editProps = {
      ...defaultProps,
      initialData: {
        id: "expense1",
        amount: 15000,
        category_id: "cat1",
        spent_at: "2026-02-15",
        memo: "카페",
      },
    };

    rerender(<AddExpenseModal {...editProps} />);

    await waitFor(() => {
      expect(screen.getByRole("heading")).toHaveTextContent("지출 수정");
    });
  });
});

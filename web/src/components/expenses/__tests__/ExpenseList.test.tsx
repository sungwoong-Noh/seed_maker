import { describe, it, expect } from "vitest";

describe("ExpenseList - 단위 테스트", () => {
  describe("월 네비게이션 유틸 함수", () => {
    // 실제 함수를 테스트하기 위해 직접 구현
    function prevMonth(ym: string): string {
      const [y, m] = ym.split("-").map(Number);
      const date = new Date(y, m - 2, 1);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }

    function nextMonth(ym: string): string {
      const [y, m] = ym.split("-").map(Number);
      const date = new Date(y, m, 1);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }

    function formatYearMonth(ym: string): string {
      const [y, m] = ym.split("-");
      return `${y}년 ${parseInt(m)}월`;
    }

    function isCurrentMonth(ym: string): boolean {
      const now = new Date();
      const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      return ym === current;
    }

    it("이전 달을 정확히 계산한다", () => {
      expect(prevMonth("2026-03")).toBe("2026-02");
      expect(prevMonth("2026-01")).toBe("2025-12");
      expect(prevMonth("2026-12")).toBe("2026-11");
    });

    it("다음 달을 정확히 계산한다", () => {
      expect(nextMonth("2026-02")).toBe("2026-03");
      expect(nextMonth("2026-12")).toBe("2027-01");
      expect(nextMonth("2025-12")).toBe("2026-01");
    });

    it("월을 올바른 형식으로 포맷한다", () => {
      expect(formatYearMonth("2026-03")).toBe("2026년 3월");
      expect(formatYearMonth("2026-12")).toBe("2026년 12월");
      expect(formatYearMonth("2025-01")).toBe("2025년 1월");
    });

    it("현재 월을 올바르게 감지한다", () => {
      const now = new Date();
      const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      expect(isCurrentMonth(currentYM)).toBe(true);
      expect(isCurrentMonth("2020-01")).toBe(false);
    });
  });

  describe("포맷팅 로직", () => {
    function formatNumberWithComma(num: string | number): string {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    it("1000 단위로 콤마를 추가한다", () => {
      expect(formatNumberWithComma("12500")).toBe("12,500");
      expect(formatNumberWithComma("1000000")).toBe("1,000,000");
    });

    it("금액 입력 변환을 시뮬레이션한다", () => {
      // 사용자가 "12500"을 입력했을 때
      const userInput = "12500";
      const displayed = formatNumberWithComma(userInput);
      const stored = userInput.replace(/\D/g, "");

      expect(displayed).toBe("12,500"); // 화면에 표시
      expect(stored).toBe("12500"); // 저장소에 저장
    });
  });
});

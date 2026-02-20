// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  it("children을 렌더링한다", () => {
    render(<Button>클릭</Button>);
    expect(screen.getByRole("button", { name: "클릭" })).toBeInTheDocument();
  });

  it("disabled일 때 버튼이 비활성화된다", () => {
    render(<Button disabled>비활성</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("loading일 때 버튼이 비활성화된다", () => {
    render(<Button loading>로딩</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("variant에 따라 적절한 스타일이 적용된다", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-emerald-700");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gray-100");

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border");

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-red-600");
  });
});

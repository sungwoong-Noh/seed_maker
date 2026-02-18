// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal, ModalHeader, ModalBody } from "../Modal";

describe("Modal", () => {
  it("isOpen이 false면 null을 반환한다", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}}>
        <span>내용</span>
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it("isOpen이 true면 children을 렌더링한다", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <span>모달 내용</span>
      </Modal>
    );
    expect(screen.getByText("모달 내용")).toBeInTheDocument();
  });

  it("배경 클릭 시 onClose가 호출된다", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>내용</div>
      </Modal>
    );
    const overlay = document.querySelector(".fixed.inset-0");
    expect(overlay).toBeInTheDocument();
    if (overlay) {
      fireEvent.click(overlay as HTMLElement);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });
});

describe("ModalHeader", () => {
  it("children을 렌더링한다", () => {
    render(<ModalHeader>제목</ModalHeader>);
    expect(screen.getByRole("heading", { name: "제목" })).toBeInTheDocument();
  });

  it("onClose가 있으면 닫기 버튼을 렌더링한다", () => {
    const onClose = vi.fn();
    render(<ModalHeader onClose={onClose}>제목</ModalHeader>);
    const closeBtn = screen.getByRole("button", { name: "닫기" });
    expect(closeBtn).toBeInTheDocument();
  });

  it("닫기 버튼 클릭 시 onClose가 호출된다", () => {
    const onClose = vi.fn();
    render(<ModalHeader onClose={onClose}>제목</ModalHeader>);
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("ModalBody", () => {
  it("children을 렌더링한다", () => {
    render(<ModalBody><p>본문</p></ModalBody>);
    expect(screen.getByText("본문")).toBeInTheDocument();
  });
});

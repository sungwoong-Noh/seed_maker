"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

/**
 * 재사용 가능한 모달 컴포넌트
 * 
 * @param isOpen - 모달 표시 여부
 * @param onClose - 모달 닫기 핸들러
 * @param size - 모달 크기
 */
export function Modal({ isOpen, onClose, children, size = "md" }: ModalProps) {
  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full rounded-t-2xl bg-white shadow-xl sm:rounded-2xl flex flex-col max-h-[90dvh]",
          sizeStyles[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * 모달 헤더
 */
export function ModalHeader({
  children,
  onClose,
  className,
}: {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between border-b border-gray-100 p-6", className)}>
      <h2 className="text-lg font-bold text-gray-800">{children}</h2>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="닫기"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

/**
 * 모달 본문
 */
export function ModalBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-6", className)}>
      {children}
    </div>
  );
}

/**
 * 모달 푸터
 */
export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-3 border-t border-gray-100 p-6", className)}>
      {children}
    </div>
  );
}

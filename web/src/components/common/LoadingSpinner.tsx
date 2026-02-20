import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
}

/**
 * 로딩 스피너 컴포넌트
 * 
 * @param size - 스피너 크기 (sm: 16px, md: 24px, lg: 32px)
 * @param fullScreen - 전체 화면 로딩 표시 여부
 * @param className - 추가 CSS 클래스
 */
export function LoadingSpinner({
  size = "md",
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };

  const spinner = (
    <div
      className={cn(
        "animate-spin rounded-full border-emerald-600 border-t-transparent",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="로딩 중"
    >
      <span className="sr-only">로딩 중...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * 인라인 로딩 스피너 (버튼 내부 등)
 */
export function InlineSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent",
        className
      )}
      role="status"
      aria-label="로딩 중"
    >
      <span className="sr-only">로딩 중...</span>
    </div>
  );
}

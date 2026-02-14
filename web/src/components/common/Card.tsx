import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  clickable?: boolean;
  shadow?: "none" | "sm" | "md" | "lg";
}

/**
 * 재사용 가능한 카드 컴포넌트
 * 
 * @param clickable - 클릭 가능한 카드 (호버 효과)
 * @param shadow - 그림자 크기
 */
export function Card({
  children,
  clickable = false,
  shadow = "sm",
  className,
  ...props
}: CardProps) {
  const shadowStyles = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-6",
        shadowStyles[shadow],
        clickable && "cursor-pointer transition-all hover:shadow-md hover:border-gray-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * 카드 헤더
 */
export function CardHeader({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * 카드 제목
 */
export function CardTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold text-gray-800", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * 카드 설명
 */
export function CardDescription({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-gray-600", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * 카드 본문
 */
export function CardContent({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * 카드 푸터
 */
export function CardFooter({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-4 flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

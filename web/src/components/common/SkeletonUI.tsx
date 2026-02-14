import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * 기본 스켈레톤 컴포넌트
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gray-200",
        className
      )}
      role="status"
      aria-label="로딩 중"
    >
      <span className="sr-only">로딩 중...</span>
    </div>
  );
}

/**
 * 카드 스켈레톤
 */
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

/**
 * 대시보드 카드 스켈레톤
 */
export function DashboardCardSkeleton() {
  return (
    <div className="space-y-4">
      {/* 씨앗돈 카드 */}
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <Skeleton className="h-4 w-20 mb-3" />
        <Skeleton className="h-10 w-36 mb-2" />
        <Skeleton className="h-3 w-48" />
      </div>

      {/* 목표 진행률 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-2 w-full mb-2" />
        <Skeleton className="h-3 w-32" />
      </div>

      {/* 스트릭 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <Skeleton className="h-4 w-28 mb-3" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * 리스트 아이템 스켈레톤
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex-1">
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-3 w-40" />
      </div>
      <Skeleton className="h-4 w-12" />
    </div>
  );
}

/**
 * 지출 목록 스켈레톤
 */
export function ExpenseListSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white divide-y">
      {Array.from({ length: 5 }).map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 텍스트 스켈레톤
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

/**
 * 테이블 스켈레톤
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      
      {/* 행 */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

/**
 * 포트폴리오 카드 스켈레톤
 */
export function PortfolioCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white divide-y">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-4 py-3">
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

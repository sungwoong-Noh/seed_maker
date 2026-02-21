"use client";

import { useState } from "react";
import Link from "next/link";
import { useDividendStocks } from "@/hooks/useDividendStocks";
import { useDividendGoal } from "@/hooks/useDividendGoal";
import { AddStockModal } from "./AddStockModal";
import { formatKRW } from "@/lib/format";
import { BottomNav } from "@/components/common/BottomNav";

type Props = {
  userId: string;
};

type Stock = {
  id: string;
  ticker: string | null;
  name: string;
  quantity: number;
  dividend_per_share: number;
  share_price: number;
  currency: string;
};

export function PortfolioList({ userId }: Props) {
  const { stocks, isLoading } = useDividendStocks(userId);
  const { goal } = useDividendGoal(userId);
  const [showAdd, setShowAdd] = useState(false);

  const totalMonthlyDividend = stocks.reduce((sum, s) => {
    const annualDiv = Number(s.quantity) * Number(s.dividend_per_share);
    return sum + annualDiv / 12;
  }, 0);

  const targetMonthlyDividend = goal ? Number(goal.target_monthly_dividend) : 0;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg pb-24">
        <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 border-b border-gray-100">
          <Link href="/" className="text-2xl text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded" aria-label="뒤로 가기">←</Link>
          <h1 className="text-xl font-semibold text-gray-900">배당 포트폴리오</h1>
        </header>
        <main id="main-content" className="px-4 py-6 space-y-4" tabIndex={-1}>
          <div className="rounded-xl bg-gray-50 p-5 space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-50 p-4 space-y-1">
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 border-b border-gray-100">
        <Link href="/" className="text-2xl text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded" aria-label="뒤로 가기">←</Link>
        <h1 className="text-xl font-semibold text-gray-900">배당 포트폴리오</h1>
      </header>

      <main id="main-content" className="p-4 space-y-4" tabIndex={-1}>
        {/* 현재 월 배당금 카드 - Pencil: height 120, padding 20, gap 8 */}
        <div className="rounded-xl bg-gray-50 p-5 min-h-[120px] flex flex-col justify-center gap-2 transition-shadow duration-200 hover:shadow-md">
          <p className="text-base font-semibold text-gray-900">현재 월 배당금</p>
          <p className="text-[32px] font-bold text-emerald-700">
            {formatKRW(totalMonthlyDividend)}
          </p>
          <p className="text-xs text-gray-600">* 주당 연 배당금 기준 월 환산</p>
        </div>

        {/* 종목 추가 버튼 - Pencil: height 48, padding 12, cornerRadius 12 */}
        <button
          onClick={() => setShowAdd(true)}
          className="w-full h-12 rounded-xl bg-emerald-700 flex items-center justify-center text-base font-semibold text-white hover:bg-emerald-800 active:scale-[0.98] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          aria-label="종목 추가"
        >
          + 종목 추가
        </button>

        {/* 종목 리스트 - Pencil: height 80, padding 16, gap 4 */}
        <div className="space-y-4">
          {stocks.map((s: Stock) => {
            const annualDiv = Number(s.quantity) * Number(s.dividend_per_share);
            const monthlyDiv = annualDiv / 12;

            // 종목별 추가 매수 주수 계산
            let sharesNeededText: string | null = null;
            if (targetMonthlyDividend > 0 && Number(s.dividend_per_share) > 0) {
              const shortfall = targetMonthlyDividend - totalMonthlyDividend;
              if (shortfall <= 0) {
                sharesNeededText = "🎉 목표 달성";
              } else {
                const sharesNeeded = Math.ceil((shortfall * 12) / Number(s.dividend_per_share));
                sharesNeededText = `+${sharesNeeded}주 필요`;
              }
            }

            return (
              <div
                key={s.id}
                className="rounded-xl bg-gray-50 p-4 min-h-[80px] flex flex-col justify-center gap-1 transition-shadow duration-200 hover:shadow-md"
              >
                <p className="text-base font-semibold text-gray-900">
                  {s.ticker ? `${s.ticker} - ` : ""}
                  {s.name}
                </p>
                <p className="text-sm text-gray-600">
                  {s.quantity}주 · 월 {formatKRW(monthlyDiv)} 배당
                </p>
                {sharesNeededText && (
                  <p className={`text-xs font-semibold ${sharesNeededText.startsWith("🎉") ? "text-emerald-700" : "text-blue-700"}`}>
                    목표 달성 위해 {sharesNeededText}
                  </p>
                )}
              </div>
            );
          })}
          {stocks.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-600">
              보유 종목이 없어요. 배당주를 추가해보세요!
            </div>
          )}
        </div>
      </main>

      {showAdd && (
        <AddStockModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => setShowAdd(false)}
          userId={userId}
        />
      )}

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}

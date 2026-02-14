"use client";

import { useState } from "react";
import Link from "next/link";
import { useDividendStocks } from "@/hooks/useDividendStocks";
import { AddStockModal } from "./AddStockModal";
import { formatKRW } from "@/lib/format";
import { showSuccess, showError } from "@/lib/toast";
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
  const { stocks, isLoading, deleteStock } = useDividendStocks(userId);
  const [showAdd, setShowAdd] = useState(false);

  const totalMonthlyDividend = stocks.reduce((sum, s) => {
    const annualDiv = Number(s.quantity) * Number(s.dividend_per_share);
    return sum + annualDiv / 12;
  }, 0);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg pb-24">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl text-gray-900">←</Link>
            <h1 className="text-xl font-semibold text-gray-900">Seed Maker</h1>
          </div>
          <span className="text-sm text-gray-600">배당 포트폴리오</span>
        </header>
        <main className="px-4 py-6 space-y-4">
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
    <div className="mx-auto max-w-lg md:max-w-3xl lg:max-w-5xl pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 md:px-6 lg:px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-2xl text-gray-900">←</Link>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Seed Maker</h1>
        </div>
        <span className="text-sm md:text-base text-gray-600">배당 포트폴리오</span>
      </header>

      <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-4 md:space-y-6">
        {/* 현재 월 배당금 카드 */}
        <div className="rounded-xl bg-gray-50 p-5 md:p-6 space-y-2">
          <p className="text-base md:text-lg font-semibold text-gray-900">현재 월 배당금</p>
          <p className="text-[32px] md:text-[40px] font-bold text-emerald-600">
            {formatKRW(totalMonthlyDividend)}
          </p>
          <p className="text-xs md:text-sm text-gray-500">* 주당 연 배당금 기준 월 환산</p>
        </div>

        {/* 종목 추가 버튼 */}
        <button
          onClick={() => setShowAdd(true)}
          className="w-full rounded-xl bg-emerald-600 py-3 md:py-4 text-base md:text-lg font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          + 종목 추가
        </button>

        {/* 종목 리스트 (데스크톱에서 2열) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {stocks.map((s: Stock) => {
            const annualDiv = Number(s.quantity) * Number(s.dividend_per_share);
            const monthlyDiv = annualDiv / 12;
            return (
              <div
                key={s.id}
                className="rounded-xl bg-gray-50 p-4 md:p-5 space-y-1"
              >
                <p className="text-base md:text-lg font-semibold text-gray-900">
                  {s.ticker ? `${s.ticker} - ` : ""}
                  {s.name}
                </p>
                <p className="text-sm md:text-base text-gray-500">
                  {s.quantity}주 · 월 {formatKRW(monthlyDiv)} 배당
                </p>
              </div>
            );
          })}
          {stocks.length === 0 && (
            <div className="py-12 text-center text-sm md:text-base text-gray-500 md:col-span-2">
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

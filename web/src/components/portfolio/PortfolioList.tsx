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
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-100 bg-white/90 px-4 py-3 backdrop-blur">
          <Link href="/" className="text-lg font-bold text-emerald-800">
            🌱 Seed Maker
          </Link>
          <h2 className="text-sm font-medium text-gray-700">배당 포트폴리오</h2>
        </header>
        <main className="px-4 py-6 space-y-6">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="h-4 w-24 bg-gray-200 rounded mb-3 animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="rounded-xl border border-gray-100 bg-white divide-y">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div className="flex-1">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg lg:max-w-4xl pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-100 bg-white/90 px-4 py-3 backdrop-blur">
        <Link href="/" className="text-lg font-bold text-emerald-800 hover:text-emerald-900 transition-colors">
          🌱 Seed Maker
        </Link>
        <h2 className="text-sm font-medium text-gray-700">배당 포트폴리오</h2>
      </header>

      <main className="px-4 py-6 space-y-6">
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-emerald-600">
            현재 월 배당금
          </h3>
          <p className="mt-2 text-2xl lg:text-3xl font-bold text-emerald-800">
            {formatKRW(totalMonthlyDividend)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            * 주당 연 배당금 기준 월 환산
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            + 종목 추가
          </button>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white divide-y">
          {stocks.map((s: Stock) => {
            const annualDiv = Number(s.quantity) * Number(s.dividend_per_share);
            const monthlyDiv = annualDiv / 12;
            return (
              <div
                key={s.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {s.ticker ? `${s.ticker} - ` : ""}
                    {s.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {s.quantity}주 · 월 {formatKRW(monthlyDiv)} 배당
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (confirm("삭제할까요?")) {
                      try {
                        await deleteStock(s.id);
                        showSuccess('종목이 삭제되었습니다');
                      } catch (err) {
                        console.error('[PortfolioList] Delete Error:', err);
                        showError('종목 삭제에 실패했습니다');
                      }
                    }
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            );
          })}
          {stocks.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-gray-500">
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

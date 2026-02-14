"use client";

import { useState } from "react";
import { useDividendStocks } from "@/hooks/useDividendStocks";

type Props = {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function AddStockModal({ userId, onClose, onSuccess }: Props) {
  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dividendPerShare, setDividendPerShare] = useState("");
  const [sharePrice, setSharePrice] = useState("");
  const { addStock } = useDividendStocks(userId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const qty = parseInt(quantity.replace(/\D/g, ""), 10);
    const div = parseFloat(dividendPerShare.replace(/,/g, ""));
    const price = parseFloat(sharePrice.replace(/,/g, ""));
    if (!qty || !div || !price || !name.trim()) return;

    try {
      await addStock({
        ticker: ticker.trim() || undefined,
        name: name.trim(),
        quantity: qty,
        dividend_per_share: div,
        share_price: price,
        currency: "KRW",
      });
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">배당주 추가</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              티커 (선택)
            </label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="VOO, SCHD"
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              종목명 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vanguard S&P 500"
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              보유 수량 *
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value.replace(/\D/g, ""))
              }
              placeholder="10"
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              주당 연 배당금 (원) *
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={dividendPerShare}
              onChange={(e) =>
                setDividendPerShare(e.target.value.replace(/[^\d.]/g, ""))
              }
              placeholder="6500"
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              required
            />
            <p className="mt-0.5 text-xs text-gray-500">
              연간 배당금 합계를 입력하세요
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              현재 주가 (원) *
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={sharePrice}
              onChange={(e) =>
                setSharePrice(e.target.value.replace(/\D/g, ""))
              }
              placeholder="450000"
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white hover:bg-emerald-700"
          >
            저장
          </button>
        </form>
      </div>
    </div>
  );
}

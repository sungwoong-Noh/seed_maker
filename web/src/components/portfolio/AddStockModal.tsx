"use client";

import { useState } from "react";
import { useDividendStocks } from "@/hooks/useDividendStocks";
import { showSuccess, showError } from "@/lib/toast";
import { Modal, ModalHeader, ModalBody } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

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
    
    if (!qty || !div || !price || !name.trim()) {
      showError('모든 필수 항목을 입력해주세요');
      return;
    }

    try {
      await addStock({
        ticker: ticker.trim() || undefined,
        name: name.trim(),
        quantity: qty,
        dividend_per_share: div,
        share_price: price,
        currency: "KRW",
      });
      showSuccess('배당주가 추가되었습니다');
      onSuccess();
    } catch (err) {
      console.error('[AddStockModal] Error:', err);
      showError('배당주 추가에 실패했습니다');
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} size="sm">
      <ModalHeader onClose={onClose}>배당주 추가</ModalHeader>
      
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="티커 (선택)"
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="VOO, SCHD"
          />
          
          <Input
            label="종목명"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vanguard S&P 500"
            required
          />
          
          <Input
            label="보유 수량"
            type="text"
            inputMode="numeric"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))}
            placeholder="10"
            required
          />
          
          <Input
            label="주당 연 배당금 (원)"
            type="text"
            inputMode="decimal"
            value={dividendPerShare}
            onChange={(e) => setDividendPerShare(e.target.value.replace(/[^\d.]/g, ""))}
            placeholder="6500"
            helperText="연간 배당금 합계를 입력하세요"
            required
          />
          
          <Input
            label="현재 주가 (원)"
            type="text"
            inputMode="numeric"
            value={sharePrice}
            onChange={(e) => setSharePrice(e.target.value.replace(/\D/g, ""))}
            placeholder="450000"
            required
          />
          
          <Button type="submit" className="w-full" size="lg">
            저장
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
}

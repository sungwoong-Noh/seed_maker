"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useExpenses } from "@/hooks/useExpenses";
import { showSuccess, showError } from "@/lib/toast";
import { formatNumberWithComma } from "@/lib/format";
import { Modal, ModalHeader, ModalBody } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";

type Props = {
  userId: string;
  yearMonth: string;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: {
    id: string;
    amount: number;
    category_id: string;
    spent_at: string;
    memo: string | null;
  };
};

export function AddExpenseModal({
  userId,
  yearMonth,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const isEditing = !!initialData;
  const [amount, setAmount] = useState(
    initialData ? String(initialData.amount) : ""
  );
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [spentAt, setSpentAt] = useState(
    initialData?.spent_at || new Date().toISOString().split("T")[0]
  );
  const [memo, setMemo] = useState(initialData?.memo || "");
  const { addExpense, updateExpense } = useExpenses(userId, yearMonth);

  const supabase = createClient();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const effectiveCategoryId = categoryId || categories?.[0]?.id || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseInt(amount.replace(/\D/g, ""), 10);
    if (!num || !effectiveCategoryId) {
      showError('금액과 카테고리를 입력해주세요');
      return;
    }

    try {
      if (isEditing && initialData) {
        // 수정 모드
        await updateExpense({
          id: initialData.id,
          amount: num,
          category_id: effectiveCategoryId,
          spent_at: spentAt,
          memo: memo || null,
        });
        showSuccess('지출이 수정되었습니다');
      } else {
        // 추가 모드
        await addExpense({
          amount: num,
          category_id: effectiveCategoryId,
          spent_at: spentAt,
          memo: memo || undefined,
        });
        showSuccess('지출이 추가되었습니다');
      }
      onSuccess();
    } catch (err) {
      console.error('[AddExpenseModal] Error:', err);
      showError(isEditing ? '지출 수정에 실패했습니다' : '지출 추가에 실패했습니다');
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} size="sm">
      <ModalHeader onClose={onClose}>{isEditing ? '지출 수정' : '지출 추가'}</ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="금액"
            type="text"
            inputMode="numeric"
            value={formatNumberWithComma(amount)}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            placeholder="8,500"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리 <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={effectiveCategoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-emerald-500 focus:ring-emerald-500"
            >
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="일자"
            type="date"
            value={spentAt}
            onChange={(e) => setSpentAt(e.target.value)}
          />

          <Input
            label="메모 (선택)"
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="점심"
          />

          <button
            type="submit"
            disabled={!categories?.length}
            className="w-full h-12 rounded-xl bg-emerald-700 flex items-center justify-center text-base font-semibold text-white hover:bg-emerald-800 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? '수정 완료' : '저장'}
          </button>
        </form>
      </ModalBody>
    </Modal>
  );
}

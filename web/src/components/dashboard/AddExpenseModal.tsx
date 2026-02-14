"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useExpenses } from "@/hooks/useExpenses";
import { showSuccess, showError } from "@/lib/toast";
import { Modal, ModalHeader, ModalBody } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";

type Props = {
  userId: string;
  yearMonth: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function AddExpenseModal({
  userId,
  yearMonth,
  onClose,
  onSuccess,
}: Props) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [spentAt, setSpentAt] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [memo, setMemo] = useState("");
  const { addExpense } = useExpenses(userId, yearMonth);

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

  useEffect(() => {
    if (categories?.length && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseInt(amount.replace(/\D/g, ""), 10);
    if (!num || !categoryId) {
      showError('금액과 카테고리를 입력해주세요');
      return;
    }

    try {
      await addExpense({
        amount: num,
        category_id: categoryId,
        spent_at: spentAt,
        memo: memo || undefined,
      });
      showSuccess('지출이 추가되었습니다');
      onSuccess();
    } catch (err) {
      console.error('[AddExpenseModal] Error:', err);
      showError('지출 추가에 실패했습니다');
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} size="sm">
      <ModalHeader onClose={onClose}>지출 추가</ModalHeader>
      
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="금액"
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            placeholder="8500"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리 <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={categoryId}
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
            className="w-full h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-base font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            저장
          </button>
        </form>
      </ModalBody>
    </Modal>
  );
}

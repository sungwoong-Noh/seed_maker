"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Expense } from "@/types";

function getYearMonth(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function getMonthRange(yearMonth: string) {
  const [y, m] = yearMonth.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

export function useExpenses(userId: string | undefined, yearMonth: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { start, end } = getMonthRange(yearMonth);

  const query = useQuery({
    queryKey: ["expenses", userId, yearMonth],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("expenses")
        .select("*, category:categories(name)")
        .eq("user_id", userId)
        .gte("spent_at", start)
        .lte("spent_at", end)
        .order("spent_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
  });

  const addMutation = useMutation({
    mutationFn: async (expense: { amount: number; category_id: string; spent_at: string; memo?: string }) => {
      if (!userId) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("expenses")
        .insert({
          user_id: userId,
          amount: expense.amount,
          category_id: expense.category_id,
          spent_at: expense.spent_at,
          memo: expense.memo || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", userId, yearMonth] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Expense> & { id: string }) => {
      const { data, error } = await supabase
        .from("expenses")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", userId, yearMonth] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", userId, yearMonth] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  return {
    expenses: query.data ?? [],
    isLoading: query.isLoading,
    addExpense: addMutation.mutateAsync,
    updateExpense: updateMutation.mutateAsync,
    deleteExpense: deleteMutation.mutateAsync,
  };
}

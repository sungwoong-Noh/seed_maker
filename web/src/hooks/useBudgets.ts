"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useBudgets(userId: string | undefined, yearMonth: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["budgets", userId, yearMonth],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("budgets")
        .select("*, category:categories(id, name)")
        .eq("user_id", userId)
        .eq("year_month", yearMonth);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
  });

  const upsertMutation = useMutation({
    mutationFn: async (items: Array<{ category_id: string; amount: number }>) => {
      if (!userId) throw new Error("Not authenticated");
      const rows = items.map(({ category_id, amount }) => ({
        user_id: userId,
        year_month: yearMonth,
        category_id,
        amount,
      }));
      const { error } = await supabase.from("budgets").upsert(rows, {
        onConflict: "user_id,year_month,category_id",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", userId, yearMonth] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  return {
    budgets: query.data ?? [],
    isLoading: query.isLoading,
    upsertBudgets: upsertMutation.mutateAsync,
  };
}

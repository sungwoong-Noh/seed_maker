"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export type FixedExpenseItem = {
  id: string;
  name: string;
  amount: number;
};

export function useFixedExpenses(userId: string | undefined) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["fixedExpenses", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("fixed_expenses")
        .select("id, name, amount")
        .eq("user_id", userId)
        .order("created_at");
      if (error) throw error;
      return (data ?? []) as FixedExpenseItem[];
    },
    enabled: !!userId,
  });

  const addMutation = useMutation({
    mutationFn: async (item: { name: string; amount: number }) => {
      if (!userId) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("fixed_expenses")
        .insert({ user_id: userId, name: item.name, amount: item.amount });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fixedExpenses", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("fixed_expenses")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fixedExpenses", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    addItem: addMutation.mutateAsync,
    deleteItem: deleteMutation.mutateAsync,
  };
}

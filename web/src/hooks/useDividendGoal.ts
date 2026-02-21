"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useDividendGoal(userId: string | undefined) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["dividendGoal", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("dividend_goals")
        .select("*")
        .eq("user_id", userId)
        .limit(1)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!userId,
  });

  const upsertMutation = useMutation({
    mutationFn: async (goal: {
      target_monthly_dividend: number;
      extra_monthly_deposit?: number;
      monthly_salary?: number;
    }) => {
      if (!userId) throw new Error("Not authenticated");
      const existing = query.data;
      const payload = {
        user_id: userId,
        target_monthly_dividend: goal.target_monthly_dividend,
        extra_monthly_deposit: goal.extra_monthly_deposit ?? 0,
        monthly_salary: goal.monthly_salary ?? 0,
      };
      if (existing) {
        const { data, error } = await supabase
          .from("dividend_goals")
          .update(payload)
          .eq("id", existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase
        .from("dividend_goals")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dividendGoal", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return {
    goal: query.data,
    isLoading: query.isLoading,
    upsertGoal: upsertMutation.mutateAsync,
  };
}

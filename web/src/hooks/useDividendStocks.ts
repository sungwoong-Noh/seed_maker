"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useDividendStocks(userId: string | undefined) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["dividendStocks", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("dividend_stocks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
  });

  const addMutation = useMutation({
    mutationFn: async (stock: {
      ticker?: string;
      name: string;
      quantity: number;
      dividend_per_share: number;
      share_price: number;
      currency?: string;
    }) => {
      if (!userId) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("dividend_stocks")
        .insert({
          user_id: userId,
          ticker: stock.ticker || null,
          name: stock.name,
          quantity: stock.quantity,
          dividend_per_share: stock.dividend_per_share,
          share_price: stock.share_price,
          currency: stock.currency || "KRW",
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dividendStocks", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      ticker?: string;
      name?: string;
      quantity?: number;
      dividend_per_share?: number;
      share_price?: number;
      currency?: string;
    }) => {
      const { data, error } = await supabase
        .from("dividend_stocks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dividendStocks", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("dividend_stocks")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dividendStocks", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return {
    stocks: query.data ?? [],
    isLoading: query.isLoading,
    addStock: addMutation.mutateAsync,
    updateStock: updateMutation.mutateAsync,
    deleteStock: deleteMutation.mutateAsync,
  };
}

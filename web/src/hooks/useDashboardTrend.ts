"use client";

import { useQuery } from "@tanstack/react-query";
import type { TrendItem } from "@/types";

export function useDashboardTrend(months = 6) {
  const query = useQuery({
    queryKey: ["dashboardTrend", months],
    queryFn: async (): Promise<{ trend: TrendItem[] }> => {
      const res = await fetch(`/api/dashboard/trend?months=${months}`);
      if (!res.ok) throw new Error("Failed to fetch trend");
      return res.json();
    },
  });

  return {
    trend: query.data?.trend ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

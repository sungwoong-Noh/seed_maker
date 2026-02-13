"use client";

import { useQuery } from "@tanstack/react-query";
import type { DashboardData } from "@/types";

export function useDashboard(userId: string | undefined, yearMonth: string) {
  const query = useQuery({
    queryKey: ["dashboard", userId, yearMonth],
    queryFn: async (): Promise<DashboardData> => {
      const res = await fetch(`/api/dashboard?yearMonth=${yearMonth}`);
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      return res.json();
    },
    enabled: !!userId,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

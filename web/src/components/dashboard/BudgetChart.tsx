"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatKRW } from "@/lib/format";

type CategoryData = {
  categoryId: string;
  categoryName: string;
  actual: number;
};

type Props = {
  data: CategoryData[];
};

/**
 * 카테고리별 실지출 막대 차트
 */
export function BudgetChart({ data }: Props) {
  const chartData = data
    .filter((d) => d.actual > 0)
    .map((d) => ({
      name: d.categoryName,
      실지출: d.actual,
    }));

  if (chartData.length === 0) return null;

  return (
    <section
      className="rounded-xl bg-gray-50 p-4 min-h-[200px] transition-shadow duration-200 hover:shadow-md"
      aria-label="카테고리별 실지출 차트"
    >
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        카테고리별 지출
      </h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6B7280" }}
              tickLine={false}
              tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
            />
            <Tooltip
              formatter={(value: number | undefined) => formatKRW(value ?? 0)}
              contentStyle={{
                backgroundColor: "#ffffff",
                color: "#111827",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
              }}
              labelStyle={{ color: "#111827" }}
            />
            <Bar dataKey="실지출" fill="#047857" radius={[4, 4, 0, 0]} name="실지출" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

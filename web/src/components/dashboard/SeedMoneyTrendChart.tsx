"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatKRW } from "@/lib/format";
import type { TrendItem } from "@/types";

type Props = {
  data: TrendItem[];
};

/**
 * 월별 씨앗돈 트렌드 차트 (Area)
 */
export function SeedMoneyTrendChart({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <section
      className="rounded-xl bg-gray-50 p-4 min-h-[200px] transition-shadow duration-200 hover:shadow-md"
      aria-label="월별 씨앗돈 트렌드"
    >
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        월별 씨앗돈 트렌드
      </h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="seedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#047857" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#047857" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="label"
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
            <Area
              type="monotone"
              dataKey="seedMoney"
              stroke="#047857"
              strokeWidth={2}
              fill="url(#seedGradient)"
              name="씨앗돈"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

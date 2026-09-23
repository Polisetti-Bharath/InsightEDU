"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/charts/chart-colors";
import type { DepartmentPerformance } from "@/types";

interface DepartmentPerformanceBarChartProps {
  data: DepartmentPerformance[];
}

export function DepartmentPerformanceBarChart({ data }: DepartmentPerformanceBarChartProps) {
  const chartData = data.map((item) => ({
    department: item.department,
    average: item.averageScore,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          stroke="var(--muted-foreground)"
        />
        <YAxis
          type="category"
          dataKey="department"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          width={64}
          stroke="var(--muted-foreground)"
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          contentStyle={{
            backgroundColor: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value) => [`${value}`, "Average Score"]}
        />
        <Bar dataKey="average" fill={CHART_COLORS.violet} radius={[0, 6, 6, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

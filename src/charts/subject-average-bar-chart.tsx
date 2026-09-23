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
import type { SubjectAverage } from "@/types";

interface SubjectAverageBarChartProps {
  data: SubjectAverage[];
}

export function SubjectAverageBarChart({ data }: SubjectAverageBarChartProps) {
  const chartData = data.map((item) => ({
    name: item.subjectCode,
    fullName: item.subjectName,
    average: item.averageScore,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          stroke="var(--muted-foreground)"
        />
        <YAxis
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          fontSize={12}
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
          labelFormatter={(label, payload) => {
            const fullName = (payload?.[0]?.payload as { fullName?: string } | undefined)?.fullName;
            return fullName ?? label;
          }}
        />
        <Bar dataKey="average" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

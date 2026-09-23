"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { GRADE_COLORS } from "@/charts/chart-colors";
import type { GradeDistributionBucket } from "@/types";

interface GradeDistributionPieChartProps {
  data: GradeDistributionBucket[];
}

export function GradeDistributionPieChart({ data }: GradeDistributionPieChartProps) {
  const chartData = data.filter((item) => item.count > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="grade"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(props) => {
            const { grade, count } = props as unknown as { grade: string; count: number };
            return `${grade}: ${count}`;
          }}
          labelLine={false}
        >
          {chartData.map((entry) => (
            <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade] ?? "#94A3B8"} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

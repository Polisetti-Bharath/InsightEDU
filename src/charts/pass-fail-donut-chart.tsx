"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_COLORS } from "@/charts/chart-colors";
import type { PassFailRatio } from "@/types";

interface PassFailDonutChartProps {
  data: PassFailRatio;
}

export function PassFailDonutChart({ data }: PassFailDonutChartProps) {
  const chartData = [
    { name: "Passed", value: data.passed, color: CHART_COLORS.success },
    { name: "Failed", value: data.failed, color: CHART_COLORS.danger },
  ];

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
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
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center -translate-y-3">
        <span className="text-2xl font-semibold">{data.passPercentage}%</span>
        <span className="text-xs text-muted-foreground">Pass Rate</span>
      </div>
    </div>
  );
}

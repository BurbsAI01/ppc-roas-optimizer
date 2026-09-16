import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "../types";

interface SpendConversionChartProps {
  data: ChartDataPoint[];
}

export const SpendConversionChart: React.FC<SpendConversionChartProps> = ({ data }) => {
  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Spend vs Conversions
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis yAxisId="left" stroke="#6b7280" />
          <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
            formatter={(value: number) => value.toFixed(0)}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="cost"
            fill="#ef4444"
            name="Spend ($)"
            radius={[8, 8, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="conversions"
            stroke="#10b981"
            strokeWidth={2}
            name="Conversions"
            dot={{ fill: "#10b981", r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ChartDataPoint } from "../types";

interface ROASTrendChartProps {
  data: ChartDataPoint[];
  target?: number;
}

export const ROASTrendChart: React.FC<ROASTrendChartProps> = ({ data, target = 2.0 }) => {
  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        ROAS Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Legend />
          <ReferenceLine y={target} stroke="#fbbf24" strokeDasharray="5 5" label="Target" />
          <Line
            type="monotone"
            dataKey="roas"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

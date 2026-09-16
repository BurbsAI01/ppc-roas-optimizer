import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { CampaignMetrics } from "../types";

interface BudgetPieChartProps {
  campaigns: CampaignMetrics[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export const BudgetPieChart: React.FC<BudgetPieChartProps> = ({ campaigns }) => {
  const data = campaigns.map((c) => ({
    name: c.campaign_name.substring(0, 20),
    value: c.cost,
    fullName: c.campaign_name,
  }));

  const totalBudget = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Budget Allocation
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total Budget: <span className="font-semibold">${totalBudget.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};

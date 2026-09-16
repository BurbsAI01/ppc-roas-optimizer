import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { CampaignMetrics } from "../types";

interface CampaignPerformanceChartProps {
  campaigns: CampaignMetrics[];
}

export const CampaignPerformanceChart: React.FC<CampaignPerformanceChartProps> = ({
  campaigns,
}) => {
  const getColor = (roas: number) => {
    if (roas >= 4) return "#10b981";
    if (roas >= 2) return "#3b82f6";
    if (roas >= 1) return "#f59e0b";
    return "#ef4444";
  };

  const chartData = campaigns.map((c) => ({
    name: c.campaign_name.substring(0, 15) + "...",
    roas: c.roas,
    fullName: c.campaign_name,
  }));

  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        ROAS by Campaign
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" />
          <YAxis dataKey="name" type="category" width={140} stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
            formatter={(value: number) => `${value.toFixed(2)}x`}
          />
          <Bar dataKey="roas" fill="#3b82f6" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.roas)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

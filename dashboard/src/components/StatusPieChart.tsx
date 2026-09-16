import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { CampaignMetrics } from "../types";

interface StatusPieChartProps {
  campaigns: CampaignMetrics[];
}

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ campaigns }) => {
  const enabled = campaigns.filter((c) => c.status === "ENABLED").length;
  const paused = campaigns.filter((c) => c.status === "PAUSED").length;
  const atRisk = campaigns.filter((c) => c.roas < 2.0 && c.status === "ENABLED").length;

  const data = [
    { name: "Enabled", value: enabled - atRisk, fill: "#10b981" },
    { name: "At Risk", value: atRisk, fill: "#f59e0b" },
    { name: "Paused", value: paused, fill: "#9ca3af" },
  ];

  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Campaign Status
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} campaigns`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

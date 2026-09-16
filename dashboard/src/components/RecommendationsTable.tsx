import React from "react";
import { AlertCircle, TrendingUp, TrendingDown, Zap } from "lucide-react";
import type { Recommendation } from "../types";

interface RecommendationsTableProps {
  recommendations: Recommendation[];
}

const getRecommendationIcon = (type: string) => {
  switch (type) {
    case "increase_bid":
      return <TrendingUp className="h-4 w-4" />;
    case "decrease_bid":
      return <TrendingDown className="h-4 w-4" />;
    case "pause_campaign":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Zap className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
    case "medium":
      return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "low":
      return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400";
    default:
      return "text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export const RecommendationsTable: React.FC<RecommendationsTableProps> = ({
  recommendations,
}) => {
  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Recommendations ({recommendations.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Campaign
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Action
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Description
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Impact
              </th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="font-medium">{rec.campaign_name}</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    {getRecommendationIcon(rec.recommendation_type)}
                    {rec.recommendation_type.replace(/_/g, " ").toUpperCase()}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {rec.description}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${getPriorityColor(rec.priority)}`}
                  >
                    {rec.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400">
                  {rec.estimated_impact}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

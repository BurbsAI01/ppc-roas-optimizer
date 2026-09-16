import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Keyword {
  keyword: string;
  cost: number;
  clicks: number;
  conversions: number;
  roas: number;
  cpc: number;
}

interface KeywordsTableProps {
  keywords: Keyword[];
  title?: string;
  type?: "top" | "bottom";
}

export const KeywordsTable: React.FC<KeywordsTableProps> = ({
  keywords,
  title = "Keywords",
  type = "top",
}) => {
  const getROASColor = (roas: number) => {
    if (roas >= 4) return "text-green-600 dark:text-green-400";
    if (roas >= 2) return "text-blue-600 dark:text-blue-400";
    if (roas >= 1) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="card">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
        {type === "top" && <TrendingUp className="h-5 w-5 text-green-600" />}
        {type === "bottom" && <TrendingDown className="h-5 w-5 text-red-600" />}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Keyword
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                Cost
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                Clicks
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                Conv.
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                CPC
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                ROAS
              </th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {kw.keyword}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                  ${kw.cost.toFixed(0)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                  {kw.clicks}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                  {kw.conversions}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                  ${kw.cpc.toFixed(2)}
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${getROASColor(kw.roas)}`}>
                  {kw.roas.toFixed(2)}x
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

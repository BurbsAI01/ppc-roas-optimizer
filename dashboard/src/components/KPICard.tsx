import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: "up" | "down" | "stable";
  format?: "currency" | "percent" | "number";
  icon?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  change,
  trend = "stable",
  format = "number",
  icon,
}) => {
  const formatValue = () => {
    if (format === "currency") {
      return `$${parseFloat(String(value)).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
    }
    if (format === "percent") {
      return `${parseFloat(String(value)).toFixed(2)}%`;
    }
    return parseFloat(String(value)).toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {formatValue()}
            </span>
            {unit && <span className="text-gray-600 dark:text-gray-400">{unit}</span>}
          </p>
          {change !== undefined && (
            <p className="mt-2 flex items-center gap-1 text-sm font-medium">
              {trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
              {trend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
              <span
                className={
                  trend === "up"
                    ? "text-green-600"
                    : trend === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                }
              >
                {change > 0 ? "+" : ""}{change.toFixed(1)}%
              </span>
            </p>
          )}
        </div>
        {icon && <div className="text-3xl text-gray-400">{icon}</div>}
      </div>
    </div>
  );
};

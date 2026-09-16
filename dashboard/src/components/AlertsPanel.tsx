import React from "react";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20";
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20";
      case "info":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20";
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20";
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      default:
        return null;
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="card">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Alerts
        </h3>
        <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
          <CheckCircle className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
          All systems operating normally
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Alerts ({alerts.length})
      </h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border-l-4 p-4 ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {alert.title}
                </h4>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {alert.message}
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {alert.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

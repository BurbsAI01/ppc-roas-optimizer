import { useState, useMemo } from "react";
import { RefreshCw, BarChart3, Settings } from "lucide-react";
import {
  KPICard,
  ROASTrendChart,
  SpendConversionChart,
  CampaignPerformanceChart,
  StatusPieChart,
  BudgetPieChart,
  RecommendationsTable,
  KeywordsTable,
  AlertsPanel,
} from "./components";
import {
  mockCampaigns,
  mockChartData,
  mockRecommendations,
  topKeywords,
  bottomKeywords,
} from "./data/mockData";
import "./App.css";

function App() {
  const [dateRange, setDateRange] = useState("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const metrics = useMemo(() => {
    const totalCost = mockCampaigns.reduce((sum, c) => sum + c.cost, 0);
    const totalConversions = mockCampaigns.reduce((sum, c) => sum + c.conversions, 0);
    const totalConversionValue = mockCampaigns.reduce(
      (sum, c) => sum + c.conversion_value,
      0
    );
    const avgROAS = mockCampaigns.reduce((sum, c) => sum + c.roas, 0) / mockCampaigns.length;
    const totalImpressions = mockCampaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = mockCampaigns.reduce((sum, c) => sum + c.clicks, 0);
    const avgCTR = (totalClicks / totalImpressions) * 100;

    return {
      totalCost,
      totalConversions,
      totalConversionValue,
      avgROAS,
      totalImpressions,
      totalClicks,
      avgCTR,
    };
  }, []);

  const alerts = [
    {
      id: "1",
      type: "critical" as const,
      title: "Discovery Ads - Low ROAS",
      message: "Campaign ROAS of 1.11x is below the 2.0x target threshold. Consider pausing or optimizing.",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "warning" as const,
      title: "Search Campaign - High CPC",
      message: "Average CPC increased 15% week-over-week. Review keyword bids.",
      timestamp: "4 hours ago",
    },
    {
      id: "3",
      type: "info" as const,
      title: "4 New Recommendations Available",
      message: "Claude AI has analyzed your campaigns and generated optimization recommendations.",
      timestamp: "1 hour ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  PPC ROAS Optimizer
                </h1>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Real-time campaign monitoring and optimization
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button
                onClick={handleRefresh}
                className="btn-secondary flex items-center gap-2 px-4 py-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button className="btn-secondary px-3 py-2">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* KPI Cards */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Average ROAS"
            value={metrics.avgROAS}
            unit="x"
            change={8.5}
            trend="up"
            icon="📊"
          />
          <KPICard
            title="Total Spend"
            value={metrics.totalCost}
            format="currency"
            change={-2.3}
            trend="down"
            icon="💰"
          />
          <KPICard
            title="Conversions"
            value={metrics.totalConversions}
            change={12.4}
            trend="up"
            icon="✅"
          />
          <KPICard
            title="Conversion Value"
            value={metrics.totalConversionValue}
            format="currency"
            change={15.8}
            trend="up"
            icon="💵"
          />
        </section>

        {/* Alerts */}
        <section className="mb-8">
          <AlertsPanel alerts={alerts} />
        </section>

        {/* Charts Row 1 */}
        <section className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ROASTrendChart data={mockChartData} />
          <SpendConversionChart data={mockChartData} />
        </section>

        {/* Charts Row 2 */}
        <section className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CampaignPerformanceChart campaigns={mockCampaigns} />
          </div>
          <StatusPieChart campaigns={mockCampaigns} />
        </section>

        {/* Charts Row 3 */}
        <section className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <BudgetPieChart campaigns={mockCampaigns} />
          <div className="card">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Impressions</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {metrics.totalImpressions.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Clicks</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {metrics.totalClicks.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average CTR</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {metrics.avgCTR.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Active Campaigns</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {mockCampaigns.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Recommendations</span>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {mockRecommendations.length}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Recommendations & Keywords */}
        <section className="mb-8">
          <RecommendationsTable recommendations={mockRecommendations} />
        </section>

        {/* Keywords */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <KeywordsTable keywords={topKeywords} title="Top Performing Keywords" type="top" />
          <KeywordsTable keywords={bottomKeywords} title="Underperforming Keywords" type="bottom" />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()} • Powered by Claude AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

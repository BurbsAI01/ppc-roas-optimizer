import { useState, useMemo, useEffect } from "react";
import { RefreshCw, BarChart3, Settings, AlertCircle } from "lucide-react";
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
import { apiClient } from "./services/api";
import type { CampaignMetrics, Recommendation, ChartDataPoint } from "./types";
import "./App.css";

function App() {
  const [dateRange, setDateRange] = useState("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [campaigns, setCampaigns] = useState<CampaignMetrics[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>(mockChartData);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [keywords, setKeywords] = useState({ top: topKeywords, bottom: bottomKeywords });
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch data from API
  const fetchData = async () => {
    try {
      setApiError(null);

      // Fetch campaigns
      const campaignsData = await apiClient.getCampaigns();
      const campaignsList = campaignsData.campaigns || [];
      setCampaigns(campaignsList);

      // Fetch recommendations
      const recommendationsData = await apiClient.getRecommendations();
      const recommendationsList = recommendationsData.recommendations || [];
      setRecommendations(recommendationsList);

      // Fetch trends
      const trendsData = await apiClient.getTrends(
        dateRange === "7d" ? 7 : dateRange === "90d" ? 90 : 30
      );
      if (trendsData.trends && trendsData.trends.length > 0) {
        setChartData(trendsData.trends.map((t: any) => ({
          date: t.date,
          cost: t.cost,
          conversions: t.conversions,
          roas: t.roas,
        })));
      }

      // Fetch alerts
      const alertsData = await apiClient.getAlerts();
      const alertsList = (alertsData.alerts || []).map((alert: any) => ({
        id: alert.id,
        type: alert.severity as "critical" | "warning" | "info" | "success",
        title: alert.title,
        message: alert.message,
        timestamp: alert.timestamp,
      }));
      setAlerts(alertsList);

      // Fetch keywords for first campaign if available
      if (campaignsList.length > 0) {
        const keywordsData = await apiClient.getKeywords(campaignsList[0].campaign_id);
        const keywordsList = keywordsData.keywords || [];
        const sorted = keywordsList.sort((a: any, b: any) => b.roas - a.roas);
        setKeywords({
          top: sorted.slice(0, 5),
          bottom: sorted.slice(-5).reverse(),
        });
      }

      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to fetch data";
      setApiError(errorMsg);
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [dateRange]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const metrics = useMemo(() => {
    const campaignList = campaigns.length > 0 ? campaigns : mockCampaigns;
    const totalCost = campaignList.reduce((sum, c) => sum + c.cost, 0);
    const totalConversions = campaignList.reduce((sum, c) => sum + c.conversions, 0);
    const totalConversionValue = campaignList.reduce(
      (sum, c) => sum + c.conversion_value,
      0
    );
    const avgROAS = campaignList.length > 0
      ? campaignList.reduce((sum, c) => sum + c.roas, 0) / campaignList.length
      : 0;
    const totalImpressions = campaignList.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = campaignList.reduce((sum, c) => sum + c.clicks, 0);
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      totalCost,
      totalConversions,
      totalConversionValue,
      avgROAS,
      totalImpressions,
      totalClicks,
      avgCTR,
      campaignCount: campaignList.length,
    };
  }, [campaigns]);

  const displayCampaigns = campaigns.length > 0 ? campaigns : mockCampaigns;
  const displayRecommendations = recommendations.length > 0 ? recommendations : mockRecommendations;
  const displayChartData = chartData.length > 0 ? chartData : mockChartData;

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
        {/* API Error Banner */}
        {apiError && (
          <div className="mb-8 flex items-start gap-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-900/20">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 dark:text-red-200">Connection Error</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {apiError}. Using mock data for demonstration.
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-8 flex items-center justify-center rounded-lg border border-gray-300 bg-gray-100 p-8 dark:border-gray-600 dark:bg-gray-800">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="ml-3 text-gray-700 dark:text-gray-300">Loading campaign data...</span>
          </div>
        )}

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
          <AlertsPanel alerts={alerts.length > 0 ? alerts : []} />
        </section>

        {/* Charts Row 1 */}
        <section className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ROASTrendChart data={displayChartData} />
          <SpendConversionChart data={displayChartData} />
        </section>

        {/* Charts Row 2 */}
        <section className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CampaignPerformanceChart campaigns={displayCampaigns} />
          </div>
          <StatusPieChart campaigns={displayCampaigns} />
        </section>

        {/* Charts Row 3 */}
        <section className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <BudgetPieChart campaigns={displayCampaigns} />
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
                  {metrics.campaignCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Recommendations</span>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {displayRecommendations.length}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Recommendations & Keywords */}
        <section className="mb-8">
          <RecommendationsTable recommendations={displayRecommendations} />
        </section>

        {/* Keywords */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <KeywordsTable keywords={keywords.top} title="Top Performing Keywords" type="top" />
          <KeywordsTable keywords={keywords.bottom} title="Underperforming Keywords" type="bottom" />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()} • Powered by Claude AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

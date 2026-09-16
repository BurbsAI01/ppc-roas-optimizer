export interface CampaignMetrics {
  campaign_id: string;
  campaign_name: string;
  status: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversion_value: number;
  ctr: number;
  cpc: number;
  roas: number;
  timestamp: string;
}

export interface Recommendation {
  campaign_id: string;
  campaign_name: string;
  recommendation_type: string;
  description: string;
  reasoning: string;
  priority: "high" | "medium" | "low";
  estimated_impact: string;
  timestamp: string;
}

export interface ChartDataPoint {
  date: string;
  roas: number;
  cost: number;
  conversions: number;
  conversions_value: number;
}

"""Data models for campaign performance and recommendations."""
from dataclasses import dataclass
from datetime import datetime
from enum import Enum


class PerformanceMetric(str, Enum):
    """Key performance metrics to track."""
    ROAS = "roas"
    CTR = "ctr"
    CPC = "cpc"
    CONVERSION_RATE = "conversion_rate"
    IMPRESSIONS = "impressions"
    CLICKS = "clicks"
    CONVERSIONS = "conversions"
    COST = "cost"


class RecommendationType(str, Enum):
    """Types of recommendations the optimizer can make."""
    PAUSE_CAMPAIGN = "pause_campaign"
    INCREASE_BID = "increase_bid"
    DECREASE_BID = "decrease_bid"
    ADD_KEYWORDS = "add_keywords"
    PAUSE_KEYWORDS = "pause_keywords"
    EXPAND_AUDIENCE = "expand_audience"
    ADJUST_BUDGET = "adjust_budget"
    IMPROVE_AD_COPY = "improve_ad_copy"
    OPTIMIZE_LANDING_PAGE = "optimize_landing_page"


@dataclass
class CampaignMetrics:
    """Campaign performance metrics snapshot."""
    campaign_id: str
    campaign_name: str
    status: str
    impressions: int
    clicks: int
    cost: float
    conversions: int
    conversion_value: float
    ctr: float  # Click-through rate
    cpc: float  # Cost per click
    roas: float  # Return on ad spend
    timestamp: datetime


@dataclass
class Recommendation:
    """Optimization recommendation from Claude."""
    campaign_id: str
    campaign_name: str
    recommendation_type: RecommendationType
    description: str
    reasoning: str
    priority: str  # "high", "medium", "low"
    estimated_impact: str  # Expected impact on ROAS
    timestamp: datetime


@dataclass
class PerformanceAlert:
    """Alert for underperforming campaigns."""
    campaign_id: str
    campaign_name: str
    metric_name: PerformanceMetric
    current_value: float
    threshold_value: float
    change_percentage: float  # % change from previous period
    severity: str  # "critical", "warning", "info"
    timestamp: datetime

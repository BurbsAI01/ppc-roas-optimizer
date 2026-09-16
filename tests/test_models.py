"""Tests for data models."""
from datetime import datetime

from src.models import CampaignMetrics, Recommendation, RecommendationType


def test_campaign_metrics_creation():
    """Test CampaignMetrics dataclass creation."""
    metrics = CampaignMetrics(
        campaign_id="123456789",
        campaign_name="Test Campaign",
        status="ENABLED",
        impressions=1000,
        clicks=50,
        cost=100.0,
        conversions=5,
        conversion_value=250.0,
        ctr=0.05,
        cpc=2.0,
        roas=2.5,
        timestamp=datetime.now(),
    )

    assert metrics.campaign_id == "123456789"
    assert metrics.campaign_name == "Test Campaign"
    assert metrics.roas == 2.5
    assert metrics.cost == 100.0


def test_recommendation_creation():
    """Test Recommendation dataclass creation."""
    rec = Recommendation(
        campaign_id="123456789",
        campaign_name="Test Campaign",
        recommendation_type=RecommendationType.INCREASE_BID,
        description="Increase bid by 10%",
        reasoning="High conversion rate indicates strong performance",
        priority="high",
        estimated_impact="5-10% ROAS improvement",
        timestamp=datetime.now(),
    )

    assert rec.campaign_id == "123456789"
    assert rec.recommendation_type == RecommendationType.INCREASE_BID
    assert rec.priority == "high"

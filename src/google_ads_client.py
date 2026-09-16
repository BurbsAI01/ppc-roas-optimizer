"""Google Ads API integration for fetching campaign data."""
from datetime import datetime, timedelta
from typing import Optional

from google.ads.googleads.client import GoogleAdsClient

from src.config import settings
from src.logger import setup_logger
from src.models import CampaignMetrics

logger = setup_logger(__name__)


class GoogleAdsOptimizer:
    """Client for interacting with Google Ads API."""

    def __init__(self):
        """Initialize Google Ads client."""
        self.client = GoogleAdsClient.load_from_storage(
            version="v17",
            client_id=settings.google_ads_client_id,
            client_secret=settings.google_ads_client_secret,
            refresh_token=settings.google_ads_refresh_token,
            developer_token=settings.google_ads_developer_token,
        )
        self.customer_id = settings.google_ads_customer_id
        self.ga_service = self.client.get_service("GoogleAdsService")

    def get_campaign_metrics(
        self, days_back: int = 7
    ) -> list[CampaignMetrics]:
        """
        Fetch campaign performance metrics for the last N days.

        Args:
            days_back: Number of days to look back (default 7)

        Returns:
            List of CampaignMetrics for active campaigns
        """
        try:
            # Calculate date range
            end_date = datetime.now().date()
            start_date = end_date - timedelta(days=days_back)

            # GAQL query to fetch campaign metrics
            query = f"""
                SELECT
                    campaign.id,
                    campaign.name,
                    campaign.status,
                    metrics.impressions,
                    metrics.clicks,
                    metrics.cost_micros,
                    metrics.conversions,
                    metrics.conversion_value,
                    metrics.ctr,
                    metrics.average_cpc
                FROM campaign
                WHERE segments.date BETWEEN '{start_date}' AND '{end_date}'
                    AND campaign.status = 'ENABLED'
                ORDER BY campaign.id
            """

            request = self.client.get_type("SearchGoogleAdsRequest")
            request.customer_id = self.customer_id
            request.query = query

            results = self.ga_service.search(request=request)

            metrics_list = []
            for row in results:
                campaign = row.campaign
                metrics = row.metrics

                # Calculate ROAS
                cost = metrics.cost_micros / 1_000_000
                roas = (
                    metrics.conversion_value / cost if cost > 0 else 0
                )

                campaign_metrics = CampaignMetrics(
                    campaign_id=campaign.id,
                    campaign_name=campaign.name,
                    status=campaign.status.name,
                    impressions=metrics.impressions,
                    clicks=metrics.clicks,
                    cost=cost,
                    conversions=int(metrics.conversions),
                    conversion_value=metrics.conversion_value,
                    ctr=metrics.ctr,
                    cpc=metrics.average_cpc,
                    roas=roas,
                    timestamp=datetime.now(),
                )
                metrics_list.append(campaign_metrics)

            logger.info(f"Fetched metrics for {len(metrics_list)} campaigns")
            return metrics_list

        except Exception as e:
            logger.error(f"Error fetching campaign metrics: {e}")
            return []

    def get_keyword_metrics(self, campaign_id: str) -> list[dict]:
        """
        Fetch keyword-level metrics for a specific campaign.

        Args:
            campaign_id: Google Ads campaign ID

        Returns:
            List of keyword metrics dictionaries
        """
        try:
            query = f"""
                SELECT
                    ad_group.id,
                    ad_group.name,
                    ad_group_criterion.keyword.text,
                    ad_group_criterion.keyword.match_type,
                    metrics.impressions,
                    metrics.clicks,
                    metrics.cost_micros,
                    metrics.conversions,
                    metrics.conversion_value
                FROM ad_group_criterion
                WHERE campaign.id = '{campaign_id}'
                    AND ad_group_criterion.type = 'KEYWORD'
                ORDER BY metrics.cost_micros DESC
                LIMIT 50
            """

            request = self.client.get_type("SearchGoogleAdsRequest")
            request.customer_id = self.customer_id
            request.query = query

            results = self.ga_service.search(request=request)

            keywords = []
            for row in results:
                keywords.append({
                    "ad_group_id": row.ad_group.id,
                    "ad_group_name": row.ad_group.name,
                    "keyword_text": row.ad_group_criterion.keyword.text,
                    "match_type": row.ad_group_criterion.keyword.match_type.name,
                    "impressions": row.metrics.impressions,
                    "clicks": row.metrics.clicks,
                    "cost": row.metrics.cost_micros / 1_000_000,
                    "conversions": row.metrics.conversions,
                    "conversion_value": row.metrics.conversion_value,
                })

            logger.info(
                f"Fetched metrics for {len(keywords)} keywords in campaign {campaign_id}"
            )
            return keywords

        except Exception as e:
            logger.error(f"Error fetching keyword metrics: {e}")
            return []

    def pause_campaign(self, campaign_id: str) -> bool:
        """Pause a campaign."""
        try:
            logger.warning(f"Pausing campaign {campaign_id}")
            # Implementation would go here
            return True
        except Exception as e:
            logger.error(f"Error pausing campaign: {e}")
            return False

    def update_campaign_budget(self, campaign_id: str, new_budget: float) -> bool:
        """Update campaign daily budget."""
        try:
            logger.info(f"Updating budget for campaign {campaign_id} to ${new_budget}")
            # Implementation would go here
            return True
        except Exception as e:
            logger.error(f"Error updating budget: {e}")
            return False

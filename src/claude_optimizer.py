"""Claude AI integration for campaign optimization analysis."""
import json
from typing import Optional

from anthropic import Anthropic

from src.config import settings
from src.logger import setup_logger
from src.models import CampaignMetrics, Recommendation, RecommendationType

logger = setup_logger(__name__)


class ClaudeOptimizer:
    """AI-powered optimizer using Claude for campaign analysis."""

    def __init__(self):
        """Initialize Claude client."""
        self.client = Anthropic(api_key=settings.anthropic_api_key)
        self.model = "claude-3-5-sonnet-20241022"

    def analyze_campaign_performance(
        self, metrics: list[CampaignMetrics], historical_data: Optional[dict] = None
    ) -> list[Recommendation]:
        """
        Analyze campaign performance and generate recommendations.

        Args:
            metrics: Current campaign metrics
            historical_data: Previous metrics for comparison

        Returns:
            List of optimization recommendations
        """
        try:
            # Format metrics for Claude
            metrics_text = self._format_metrics(metrics)
            historical_text = (
                self._format_historical_data(historical_data)
                if historical_data
                else "No historical data available"
            )

            prompt = f"""
You are an expert Google Ads PPC campaign optimizer focused on maximizing ROAS (Return on Ad Spend).

Current Campaign Metrics (Last 7 Days):
{metrics_text}

Historical Performance:
{historical_text}

Based on the current metrics and any historical data, provide specific, actionable recommendations
to improve ROAS. For each campaign that needs optimization, identify:

1. Key performance issues (if any)
2. Root causes of underperformance
3. Specific actions to take (pause campaigns, adjust bids, pause keywords, etc.)
4. Expected impact on ROAS

Format your response as a JSON array with this structure:
[
    {{
        "campaign_id": "string",
        "campaign_name": "string",
        "recommendation_type": "pause_campaign|increase_bid|decrease_bid|add_keywords|pause_keywords|expand_audience|adjust_budget|improve_ad_copy|optimize_landing_page",
        "description": "brief description of the action",
        "reasoning": "explanation of why this action will improve ROAS",
        "priority": "high|medium|low",
        "estimated_impact": "expected improvement to ROAS as percentage or description"
    }}
]

Only recommend changes that will meaningfully improve ROAS. If no changes are needed, return an empty array.
"""

            response = self.client.messages.create(
                model=self.model,
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}],
            )

            # Parse recommendations from response
            response_text = response.content[0].text
            recommendations = self._parse_recommendations(response_text, metrics)

            logger.info(f"Generated {len(recommendations)} recommendations")
            return recommendations

        except Exception as e:
            logger.error(f"Error analyzing campaign performance: {e}")
            return []

    def analyze_keyword_performance(
        self, campaign_name: str, keywords: list[dict]
    ) -> list[Recommendation]:
        """
        Analyze keyword-level performance for a specific campaign.

        Args:
            campaign_name: Name of the campaign
            keywords: List of keyword metrics

        Returns:
            List of keyword-level recommendations
        """
        try:
            keywords_text = json.dumps(keywords[:20], indent=2)  # Top 20 keywords

            prompt = f"""
You are a PPC keyword optimization expert. Analyze these keywords for campaign "{campaign_name}"
and recommend optimizations to improve ROAS.

Top Keywords by Cost:
{keywords_text}

Provide specific recommendations for:
1. Keywords to pause (low performance, high cost)
2. Keywords to increase bids on (high conversion value)
3. New keyword opportunities based on patterns
4. Landing page improvements needed

Return recommendations as JSON with the same format as campaign recommendations.
"""

            response = self.client.messages.create(
                model=self.model,
                max_tokens=1500,
                messages=[{"role": "user", "content": prompt}],
            )

            response_text = response.content[0].text
            recommendations = self._parse_keyword_recommendations(
                response_text, campaign_name
            )

            logger.info(
                f"Generated {len(recommendations)} keyword recommendations for {campaign_name}"
            )
            return recommendations

        except Exception as e:
            logger.error(f"Error analyzing keyword performance: {e}")
            return []

    def _format_metrics(self, metrics: list[CampaignMetrics]) -> str:
        """Format metrics for display in prompt."""
        lines = []
        for m in metrics:
            lines.append(f"""
Campaign: {m.campaign_name} (ID: {m.campaign_id})
- Status: {m.status}
- Impressions: {m.impressions:,}
- Clicks: {m.clicks:,}
- Cost: ${m.cost:.2f}
- CTR: {m.ctr:.2%}
- CPC: ${m.cpc:.2f}
- Conversions: {m.conversions}
- Conversion Value: ${m.conversion_value:.2f}
- ROAS: {m.roas:.2f}x
""")
        return "\n".join(lines)

    def _format_historical_data(self, data: dict) -> str:
        """Format historical data for display."""
        return json.dumps(data, indent=2)

    def _parse_recommendations(
        self, response_text: str, metrics: list[CampaignMetrics]
    ) -> list[Recommendation]:
        """Parse JSON recommendations from Claude response."""
        try:
            # Extract JSON from response
            json_start = response_text.find("[")
            json_end = response_text.rfind("]") + 1
            json_str = response_text[json_start:json_end]

            rec_data = json.loads(json_str)
            recommendations = []

            # Create metrics lookup
            metrics_by_id = {m.campaign_id: m for m in metrics}

            for rec in rec_data:
                campaign_id = rec.get("campaign_id", "")
                campaign_name = rec.get("campaign_name", "")

                recommendation = Recommendation(
                    campaign_id=campaign_id,
                    campaign_name=campaign_name,
                    recommendation_type=RecommendationType(
                        rec.get("recommendation_type", "").lower()
                    ),
                    description=rec.get("description", ""),
                    reasoning=rec.get("reasoning", ""),
                    priority=rec.get("priority", "medium"),
                    estimated_impact=rec.get("estimated_impact", "TBD"),
                    timestamp=metrics_by_id.get(campaign_id, {}).timestamp
                    if campaign_id in metrics_by_id
                    else None,
                )
                recommendations.append(recommendation)

            return recommendations
        except Exception as e:
            logger.error(f"Error parsing recommendations: {e}")
            return []

    def _parse_keyword_recommendations(
        self, response_text: str, campaign_name: str
    ) -> list[Recommendation]:
        """Parse keyword-level recommendations from Claude response."""
        try:
            json_start = response_text.find("[")
            json_end = response_text.rfind("]") + 1
            json_str = response_text[json_start:json_end]

            rec_data = json.loads(json_str)
            recommendations = []

            for rec in rec_data:
                recommendation = Recommendation(
                    campaign_id=campaign_name,
                    campaign_name=campaign_name,
                    recommendation_type=RecommendationType(
                        rec.get("recommendation_type", "").lower()
                    ),
                    description=rec.get("description", ""),
                    reasoning=rec.get("reasoning", ""),
                    priority=rec.get("priority", "medium"),
                    estimated_impact=rec.get("estimated_impact", "TBD"),
                    timestamp=None,
                )
                recommendations.append(recommendation)

            return recommendations
        except Exception as e:
            logger.error(f"Error parsing keyword recommendations: {e}")
            return []

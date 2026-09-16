"""Main monitoring loop for PPC ROAS Optimizer."""
import asyncio
import json
from datetime import datetime, timedelta
from pathlib import Path

from src.claude_optimizer import ClaudeOptimizer
from src.google_ads_client import GoogleAdsOptimizer
from src.logger import setup_logger

logger = setup_logger(__name__)


class PPCOptimizationMonitor:
    """Main orchestrator for continuous PPC optimization."""

    def __init__(self):
        """Initialize the monitoring system."""
        self.google_ads = GoogleAdsOptimizer()
        self.claude = ClaudeOptimizer()
        self.history_file = Path("data/optimization_history.json")
        self.history_file.parent.mkdir(exist_ok=True)
        self.historical_data = self._load_history()

    def _load_history(self) -> dict:
        """Load historical optimization data."""
        try:
            if self.history_file.exists():
                with open(self.history_file, "r") as f:
                    return json.load(f)
        except Exception as e:
            logger.warning(f"Could not load history: {e}")
        return {}

    def _save_history(self, data: dict):
        """Save optimization history."""
        try:
            with open(self.history_file, "w") as f:
                json.dump(data, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Could not save history: {e}")

    async def run_check(self):
        """Execute a single optimization check."""
        logger.info("=" * 80)
        logger.info("Starting PPC optimization check")
        logger.info("=" * 80)

        try:
            # 1. Fetch current campaign metrics
            logger.info("Fetching campaign metrics from Google Ads...")
            metrics = self.google_ads.get_campaign_metrics(days_back=7)

            if not metrics:
                logger.warning("No campaign metrics retrieved")
                return

            logger.info(f"Retrieved {len(metrics)} campaign metrics")

            # 2. Analyze with Claude for recommendations
            logger.info("Analyzing metrics with Claude AI...")
            recommendations = self.claude.analyze_campaign_performance(
                metrics, self.historical_data
            )

            # 3. Store recommendations
            timestamp = datetime.now().isoformat()
            for rec in recommendations:
                logger.info(
                    f"[{rec.priority.upper()}] {rec.campaign_name}: {rec.description}"
                )
                logger.info(f"  Reasoning: {rec.reasoning}")
                logger.info(f"  Estimated Impact: {rec.estimated_impact}")

            # 4. Update history
            self.historical_data[timestamp] = {
                "metrics": [
                    {
                        "campaign_id": m.campaign_id,
                        "campaign_name": m.campaign_name,
                        "roas": m.roas,
                        "cost": m.cost,
                        "conversions": m.conversions,
                        "ctr": m.ctr,
                    }
                    for m in metrics
                ],
                "recommendations": [
                    {
                        "campaign_id": r.campaign_id,
                        "campaign_name": r.campaign_name,
                        "type": r.recommendation_type.value,
                        "priority": r.priority,
                        "description": r.description,
                    }
                    for r in recommendations
                ],
            }
            self._save_history(self.historical_data)

            # 5. Keyword-level analysis for low-performing campaigns
            logger.info("Performing keyword-level analysis...")
            for metric in metrics:
                if metric.roas < 2.0:  # ROAS below 2x
                    logger.info(
                        f"Analyzing keywords for underperforming campaign: {metric.campaign_name}"
                    )
                    keywords = self.google_ads.get_keyword_metrics(metric.campaign_id)
                    if keywords:
                        kw_recommendations = self.claude.analyze_keyword_performance(
                            metric.campaign_name, keywords
                        )
                        for rec in kw_recommendations:
                            logger.info(
                                f"  [KEYWORD] {rec.description} - {rec.reasoning}"
                            )

            logger.info("=" * 80)
            logger.info("PPC optimization check completed successfully")
            logger.info("=" * 80)

        except Exception as e:
            logger.error(f"Error during optimization check: {e}", exc_info=True)

    async def start_monitoring(self, interval_hours: int = 2):
        """
        Start continuous monitoring loop.

        Args:
            interval_hours: Check interval in hours
        """
        logger.info(f"Starting PPC optimizer monitoring (interval: {interval_hours} hours)")

        try:
            while True:
                await self.run_check()

                # Wait for next check
                wait_seconds = interval_hours * 3600
                logger.info(f"Next check in {interval_hours} hours...")
                await asyncio.sleep(wait_seconds)

        except KeyboardInterrupt:
            logger.info("Monitoring stopped by user")
        except Exception as e:
            logger.error(f"Fatal error in monitoring loop: {e}", exc_info=True)


async def main():
    """Main entry point."""
    # Import here to get settings from config
    from src.config import settings

    monitor = PPCOptimizationMonitor()
    await monitor.start_monitoring(interval_hours=settings.check_interval_hours)


if __name__ == "__main__":
    asyncio.run(main())

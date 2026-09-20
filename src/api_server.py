"""FastAPI server for PPC ROAS Optimizer dashboard."""
import json
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.claude_optimizer import ClaudeOptimizer
from src.google_ads_client import GoogleAdsOptimizer
from src.logger import setup_logger
from src.models import CampaignMetrics, Recommendation

logger = setup_logger(__name__)

app = FastAPI(
    title="PPC ROAS Optimizer API",
    description="Real-time Google Ads optimization using Claude AI",
    version="1.0.0",
)

# Enable CORS for dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
google_ads: Optional[GoogleAdsOptimizer] = None
claude_optimizer: Optional[ClaudeOptimizer] = None
history_file = Path("data/optimization_history.json")


def init_services():
    """Initialize Google Ads and Claude services."""
    global google_ads, claude_optimizer
    try:
        google_ads = GoogleAdsOptimizer()
        claude_optimizer = ClaudeOptimizer()
        logger.info("Services initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
        # Services will remain None, endpoints will return empty data


def load_history() -> dict:
    """Load historical optimization data."""
    try:
        if history_file.exists():
            with open(history_file, "r") as f:
                return json.load(f)
    except Exception as e:
        logger.warning(f"Could not load history: {e}")
    return {}


@app.on_event("startup")
async def startup_event():
    """Initialize on startup."""
    init_services()
    logger.info("API server started")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "google_ads_connected": google_ads is not None,
        "claude_connected": claude_optimizer is not None,
    }


@app.get("/api/campaigns")
async def get_campaigns():
    """Get current campaign metrics."""
    try:
        if not google_ads:
            return {
                "campaigns": [],
                "error": "Google Ads service not initialized",
                "timestamp": datetime.now().isoformat(),
            }

        metrics = google_ads.get_campaign_metrics(days_back=7)

        return {
            "campaigns": [
                {
                    "campaign_id": m.campaign_id,
                    "campaign_name": m.campaign_name,
                    "status": m.status,
                    "impressions": m.impressions,
                    "clicks": m.clicks,
                    "cost": m.cost,
                    "conversions": m.conversions,
                    "conversion_value": m.conversion_value,
                    "ctr": m.ctr,
                    "cpc": m.cpc,
                    "roas": m.roas,
                    "timestamp": m.timestamp,
                }
                for m in metrics
            ],
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        logger.error(f"Error fetching campaigns: {e}")
        return {
            "campaigns": [],
            "error": str(e),
            "timestamp": datetime.now().isoformat(),
        }


@app.get("/api/recommendations")
async def get_recommendations():
    """Get latest AI recommendations."""
    try:
        if not google_ads or not claude_optimizer:
            return {
                "recommendations": [],
                "error": "Services not initialized",
                "timestamp": datetime.now().isoformat(),
            }

        # Get current metrics
        metrics = google_ads.get_campaign_metrics(days_back=7)
        if not metrics:
            return {
                "recommendations": [],
                "error": "No campaigns found",
                "timestamp": datetime.now().isoformat(),
            }

        # Load historical data
        history = load_history()

        # Analyze with Claude
        recommendations = claude_optimizer.analyze_campaign_performance(
            metrics, history
        )

        return {
            "recommendations": [
                {
                    "campaign_id": r.campaign_id,
                    "campaign_name": r.campaign_name,
                    "recommendation_type": r.recommendation_type.value,
                    "description": r.description,
                    "reasoning": r.reasoning,
                    "priority": r.priority,
                    "estimated_impact": r.estimated_impact,
                }
                for r in recommendations
            ],
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        return {
            "recommendations": [],
            "error": str(e),
            "timestamp": datetime.now().isoformat(),
        }


@app.get("/api/trends")
async def get_trends(days: int = 30):
    """Get historical trend data."""
    try:
        history = load_history()

        if not history:
            return {
                "trends": [],
                "message": "No historical data available yet",
                "timestamp": datetime.now().isoformat(),
            }

        # Convert history to trend format
        trends = []
        for timestamp_str, data in sorted(history.items()):
            try:
                ts = datetime.fromisoformat(timestamp_str)
                metrics = data.get("metrics", [])

                total_cost = sum(m.get("cost", 0) for m in metrics)
                total_conversions = sum(m.get("conversions", 0) for m in metrics)
                avg_roas = (
                    sum(m.get("roas", 0) for m in metrics) / len(metrics)
                    if metrics
                    else 0
                )

                trends.append(
                    {
                        "date": ts.strftime("%Y-%m-%d"),
                        "cost": total_cost,
                        "conversions": total_conversions,
                        "roas": avg_roas,
                        "campaign_count": len(metrics),
                    }
                )
            except Exception as e:
                logger.warning(f"Could not parse history entry: {e}")
                continue

        return {
            "trends": trends[-days:],  # Return last N days
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        logger.error(f"Error fetching trends: {e}")
        return {
            "trends": [],
            "error": str(e),
            "timestamp": datetime.now().isoformat(),
        }


@app.get("/api/keywords/{campaign_id}")
async def get_keywords(campaign_id: str):
    """Get keyword metrics for a specific campaign."""
    try:
        if not google_ads:
            return {
                "keywords": [],
                "error": "Google Ads service not initialized",
                "timestamp": datetime.now().isoformat(),
            }

        keywords = google_ads.get_keyword_metrics(campaign_id)

        return {
            "keywords": [
                {
                    "keyword_id": k.keyword_id,
                    "keyword_text": k.keyword_text,
                    "match_type": k.match_type,
                    "cost": k.cost,
                    "clicks": k.clicks,
                    "conversions": k.conversions,
                    "cpc": k.cpc,
                    "roas": k.roas,
                }
                for k in keywords
            ],
            "campaign_id": campaign_id,
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        logger.error(f"Error fetching keywords for campaign {campaign_id}: {e}")
        return {
            "keywords": [],
            "error": str(e),
            "campaign_id": campaign_id,
            "timestamp": datetime.now().isoformat(),
        }


@app.get("/api/alerts")
async def get_alerts():
    """Get performance alerts."""
    try:
        if not google_ads:
            return {
                "alerts": [],
                "error": "Google Ads service not initialized",
                "timestamp": datetime.now().isoformat(),
            }

        metrics = google_ads.get_campaign_metrics(days_back=7)
        alerts = []

        # Generate alerts based on metrics
        for metric in metrics:
            # Critical: ROAS < 1.0
            if metric.roas < 1.0:
                alerts.append(
                    {
                        "id": f"roas_critical_{metric.campaign_id}",
                        "severity": "critical",
                        "title": f"{metric.campaign_name}: Critical ROAS",
                        "message": f"ROAS of {metric.roas:.2f}x is below 1.0. Campaign is losing money.",
                        "timestamp": datetime.now().isoformat(),
                    }
                )
            # Warning: ROAS between 1.0 and 2.0
            elif metric.roas < 2.0:
                alerts.append(
                    {
                        "id": f"roas_warning_{metric.campaign_id}",
                        "severity": "warning",
                        "title": f"{metric.campaign_name}: Low ROAS",
                        "message": f"ROAS of {metric.roas:.2f}x is below target of 2.0x. Optimization recommended.",
                        "timestamp": datetime.now().isoformat(),
                    }
                )

            # Warning: High CPC
            if metric.cpc > 5.0:
                alerts.append(
                    {
                        "id": f"cpc_high_{metric.campaign_id}",
                        "severity": "warning",
                        "title": f"{metric.campaign_name}: High CPC",
                        "message": f"Average CPC of ${metric.cpc:.2f} is elevated. Consider bid adjustments.",
                        "timestamp": datetime.now().isoformat(),
                    }
                )

        return {
            "alerts": alerts,
            "count": len(alerts),
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        logger.error(f"Error generating alerts: {e}")
        return {
            "alerts": [],
            "error": str(e),
            "timestamp": datetime.now().isoformat(),
        }


@app.get("/api/summary")
async def get_summary():
    """Get dashboard summary data."""
    try:
        if not google_ads:
            return {
                "error": "Google Ads service not initialized",
                "timestamp": datetime.now().isoformat(),
            }

        metrics = google_ads.get_campaign_metrics(days_back=7)

        if not metrics:
            return {
                "error": "No campaigns found",
                "timestamp": datetime.now().isoformat(),
            }

        total_cost = sum(m.cost for m in metrics)
        total_conversions = sum(m.conversions for m in metrics)
        total_conversion_value = sum(m.conversion_value for m in metrics)
        avg_roas = total_conversion_value / total_cost if total_cost > 0 else 0
        total_impressions = sum(m.impressions for m in metrics)
        total_clicks = sum(m.clicks for m in metrics)
        avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0

        return {
            "total_cost": total_cost,
            "total_conversions": total_conversions,
            "total_conversion_value": total_conversion_value,
            "average_roas": avg_roas,
            "total_impressions": total_impressions,
            "total_clicks": total_clicks,
            "average_ctr": avg_ctr,
            "campaign_count": len(metrics),
            "enabled_campaigns": sum(1 for m in metrics if m.status == "ENABLED"),
            "paused_campaigns": sum(1 for m in metrics if m.status == "PAUSED"),
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        logger.error(f"Error generating summary: {e}")
        return {
            "error": str(e),
            "timestamp": datetime.now().isoformat(),
        }


def run():
    """Run the API server."""
    import uvicorn

    uvicorn.run(
        "src.api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info",
    )


if __name__ == "__main__":
    run()

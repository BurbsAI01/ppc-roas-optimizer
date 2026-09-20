"""Configuration management for PPC ROAS Optimizer."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings from environment variables."""

    # Google Ads API (optional for development/testing)
    google_ads_developer_token: str | None = None
    google_ads_client_id: str | None = None
    google_ads_client_secret: str | None = None
    google_ads_refresh_token: str | None = None
    google_ads_customer_id: str | None = None

    # Claude API (optional for development/testing)
    anthropic_api_key: str | None = None

    # Monitoring
    check_interval_hours: int = 2
    log_level: str = "INFO"

    # Optional
    alert_webhook_url: str | None = None

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

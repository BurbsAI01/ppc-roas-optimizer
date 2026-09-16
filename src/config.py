"""Configuration management for PPC ROAS Optimizer."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings from environment variables."""

    # Google Ads API
    google_ads_developer_token: str
    google_ads_client_id: str
    google_ads_client_secret: str
    google_ads_refresh_token: str
    google_ads_customer_id: str

    # Claude API
    anthropic_api_key: str

    # Monitoring
    check_interval_hours: int = 2
    log_level: str = "INFO"

    # Optional
    alert_webhook_url: str | None = None

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

# PPC ROAS Optimizer - Claude Code Documentation

## Project Overview

This is an AI-powered Google Ads campaign optimizer that uses Claude to continuously monitor and optimize PPC campaigns for maximum ROAS (Return on Ad Spend).

## Tech Stack

- **Language**: Python 3.11+
- **Main Libraries**:
  - `google-ads` - Google Ads API integration
  - `anthropic` - Claude AI API
  - `pydantic` - Data validation
  - `python-dotenv` - Environment configuration

## Project Structure

```
src/
├── main.py                 # Main monitoring loop and orchestration
├── google_ads_client.py   # Google Ads API wrapper
├── claude_optimizer.py    # Claude AI integration for analysis
├── config.py              # Configuration management
├── models.py              # Data models (CampaignMetrics, Recommendation, etc.)
└── logger.py              # Logging configuration

tests/                      # Unit tests (to be expanded)
data/                       # Historical optimization data (JSON)
logs/                       # Application logs
```

## Key Modules

### google_ads_client.py
Handles all Google Ads API interactions:
- `GoogleAdsOptimizer.get_campaign_metrics()` - Fetches campaign performance data
- `GoogleAdsOptimizer.get_keyword_metrics()` - Gets keyword-level performance
- Methods for future: pause campaigns, adjust budgets

### claude_optimizer.py
AI-powered analysis using Claude:
- `ClaudeOptimizer.analyze_campaign_performance()` - Campaign-level analysis
- `ClaudeOptimizer.analyze_keyword_performance()` - Keyword-level analysis
- Parses Claude's JSON responses into structured recommendations

### main.py
Orchestrates the monitoring flow:
- `PPCOptimizationMonitor` - Main class that ties everything together
- Continuous loop that checks campaigns at configured intervals
- Persists historical data for trend analysis

## Development Workflow

### Adding New Features

1. **New API Integration**: Add methods to `GoogleAdsOptimizer` class
2. **New Analysis Type**: Add analysis method to `ClaudeOptimizer` class
3. **New Recommendation Type**: Add to `RecommendationType` enum in `models.py`
4. **New Data Model**: Add dataclass to `models.py`

### Testing

```bash
poetry run pytest
poetry run pytest --cov=src
```

### Code Style

Follow PEP 8:
```bash
poetry run black src/
poetry run flake8 src/
poetry run isort src/
```

## Configuration

All configuration via environment variables in `.env`:

```
GOOGLE_ADS_DEVELOPER_TOKEN=...
GOOGLE_ADS_CLIENT_ID=...
GOOGLE_ADS_CLIENT_SECRET=...
GOOGLE_ADS_REFRESH_TOKEN=...
GOOGLE_ADS_CUSTOMER_ID=...
ANTHROPIC_API_KEY=...
CHECK_INTERVAL_HOURS=2
LOG_LEVEL=INFO
```

See `.env.example` for full list.

## Running Locally

```bash
# One-time check
python -c "from src.main import PPCOptimizationMonitor; import asyncio; m = PPCOptimizationMonitor(); asyncio.run(m.run_check())"

# Continuous monitoring
python -m src.main
```

## API Flows

### Campaign Optimization Flow

```
1. Get Campaign Metrics (Google Ads API)
   → CampaignMetrics objects

2. Send to Claude for Analysis
   → JSON recommendation format

3. Parse Recommendations
   → Recommendation objects

4. Store Historical Data
   → JSON file for trending

5. Keyword Analysis (for ROAS < 2.0)
   → Keyword-specific recommendations
```

### Claude Prompt Strategy

Claude is asked to:
1. Identify underperforming campaigns
2. Suggest specific actions (pause, bid adjust, etc.)
3. Rank by priority (high/medium/low)
4. Estimate ROAS impact
5. Return structured JSON

## Future Enhancements

- **Automated Actions**: Execute pause/bid adjustments programmatically
- **Notifications**: Slack/email alerts for high-priority recommendations
- **Dashboard**: Web UI for viewing trends and recommendations
- **Multi-Account**: Support multiple Google Ads accounts
- **Advanced Analysis**: Forecasting, anomaly detection, A/B testing
- **Integrations**: Connect to CRM, analytics platforms

## Known Limitations

- Currently recommendations only (no automated actions yet)
- Single Google Ads account support
- Basic threshold-based keyword analysis
- No multi-currency support yet

## Common Development Tasks

### Adding a new metric to track
1. Update `CampaignMetrics` dataclass in `models.py`
2. Update GAQL query in `google_ads_client.py`
3. Update Claude prompt in `claude_optimizer.py`

### Adding a new recommendation type
1. Add to `RecommendationType` enum in `models.py`
2. Update Claude prompt template
3. Add handling in recommendation parsing

### Debugging
- Check `logs/` directory for detailed logs
- Set `LOG_LEVEL=DEBUG` in `.env`
- Review `data/optimization_history.json` for past recommendations

## Contact

For questions about this project, open an issue on GitHub or contact the maintainer.

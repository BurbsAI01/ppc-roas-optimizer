# API Integration Guide

The PPC ROAS Optimizer now features a complete API layer connecting the Python backend to the React dashboard.

## Architecture

```
┌─────────────────────┐
│  React Dashboard    │
│  (Port 5173)        │
└──────────┬──────────┘
           │
           │ HTTP/REST
           │
┌──────────▼──────────┐
│  FastAPI Server     │
│  (Port 8000)        │
├─────────────────────┤
│ • Campaign metrics  │
│ • Recommendations   │
│ • Alerts            │
│ • Trends            │
│ • Keywords          │
└──────────┬──────────┘
           │
┌──────────▼──────────────────────┐
│  Core Services                  │
├─────────────────────────────────┤
│ • GoogleAdsOptimizer (v24)      │
│ • ClaudeOptimizer (Claude API)  │
│ • History Storage (JSON)        │
└─────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Google Ads API credentials (optional for development)
- Anthropic API key (optional for development)

### 1. Setup Backend API

```bash
cd /home/user/ppc-roas-optimizer

# Install dependencies
poetry install

# Copy environment template
cp .env.example .env

# Edit .env with your actual credentials (optional for development)
# The API will use mock data if services aren't initialized

# Run the API server
python run_api.py
```

The API will be available at `http://localhost:8000`

API Endpoints:
- `GET /health` - Health check
- `GET /api/campaigns` - Campaign metrics
- `GET /api/recommendations` - AI recommendations
- `GET /api/trends?days=30` - Historical trends
- `GET /api/keywords/{campaign_id}` - Keyword metrics
- `GET /api/alerts` - Performance alerts
- `GET /api/summary` - Dashboard summary

### 2. Setup Dashboard

```bash
cd dashboard

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env if using a different API URL
# Default: VITE_API_URL=http://localhost:8000

# Run development server
npm run dev
```

Dashboard will be at `http://localhost:5173`

## Environment Variables

### Backend (.env)

```env
# Google Ads Configuration
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_CUSTOMER_ID=your_customer_id

# Anthropic Configuration
ANTHROPIC_API_KEY=your_api_key

# Monitoring
CHECK_INTERVAL_HOURS=2
LOG_LEVEL=INFO
```

### Dashboard (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:8000
```

## Production Deployment

### Docker

```dockerfile
# Backend
FROM python:3.11-slim
WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN pip install poetry && poetry install --no-dev
COPY . .
CMD ["python", "run_api.py"]

# Frontend
FROM node:18-alpine
WORKDIR /app
COPY dashboard/package*.json ./
RUN npm ci --only=production
COPY dashboard/dist ./dist
CMD ["npm", "run", "preview"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - GOOGLE_ADS_DEVELOPER_TOKEN=${GOOGLE_ADS_DEVELOPER_TOKEN}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    restart: unless-stopped

  dashboard:
    build: ./dashboard
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://api:8000
    depends_on:
      - api
```

## API Endpoints Reference

### GET /health
Health check endpoint
```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "google_ads_connected": true,
  "claude_connected": true
}
```

### GET /api/campaigns
Get current campaign metrics (last 7 days by default)
```bash
curl http://localhost:8000/api/campaigns
```

Response:
```json
{
  "campaigns": [
    {
      "campaign_id": "123456789",
      "campaign_name": "Brand Campaign",
      "status": "ENABLED",
      "impressions": 15420,
      "clicks": 892,
      "cost": 1240.50,
      "conversions": 125,
      "conversion_value": 6250,
      "ctr": 0.0578,
      "cpc": 1.39,
      "roas": 5.04,
      "timestamp": "2026-09-20T12:30:00"
    }
  ],
  "timestamp": "2026-09-20T12:35:00"
}
```

### GET /api/recommendations
Get AI-generated recommendations
```bash
curl http://localhost:8000/api/recommendations
```

### GET /api/trends
Get historical trend data
```bash
curl http://localhost:8000/api/trends?days=30
```

### GET /api/alerts
Get performance alerts
```bash
curl http://localhost:8000/api/alerts
```

### GET /api/keywords/{campaign_id}
Get keywords for a specific campaign
```bash
curl http://localhost:8000/api/keywords/123456789
```

### GET /api/summary
Get dashboard summary
```bash
curl http://localhost:8000/api/summary
```

## Dashboard Features

### Connected Features (Real Data)
- ✅ Campaign Metrics
- ✅ AI Recommendations
- ✅ Performance Alerts
- ✅ Trend Charts
- ✅ Keyword Analysis

### UI Features
- 🎨 Dark mode support
- 📱 Responsive design
- ⚡ Real-time refresh (every 60 seconds)
- 🔄 Manual refresh button
- ⚠️ Error handling with fallback to mock data

## Troubleshooting

### API Connection Issues

If you see "Connection Error" in the dashboard:

1. **Check if API is running**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check CORS settings**
   The API has CORS enabled for all origins by default. For production, update `src/api_server.py`:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://yourdomain.com"],  # Restrict to your domain
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Check environment variables**
   ```bash
   python -c "from src.config import settings; print(settings.google_ads_developer_token)"
   ```

4. **Check logs**
   API logs are written to `logs/ppc_optimizer.log`

### Google Ads API Errors

If Google Ads client fails to initialize:
- The API will return empty data
- Dashboard will show "Services not initialized"
- Check your `.env` file has correct credentials

### Dashboard shows mock data

This is expected if:
- API is not running or unreachable
- Google Ads credentials are not configured
- It's the first load (while data is being fetched)

## Development Tips

### Enable API Reload
The API runs with `reload=True` in development, so code changes auto-refresh

### View API Docs
FastAPI automatically generates interactive docs:
```
http://localhost:8000/docs      # Swagger UI
http://localhost:8000/redoc     # ReDoc
```

### Check Request/Response
Use the built-in Swagger UI at `/docs` to test endpoints

### Monitor API Calls
Frontend logs all API calls to browser console:
```javascript
// Check failed requests in console
// Look for "Failed to fetch..." messages
```

## Next Steps

1. **Configure Google Ads**: Add credentials to `.env` for real data
2. **Configure Claude API**: Add API key to `.env` for AI recommendations
3. **Deploy to Production**: Use Docker Compose or your preferred hosting
4. **Set up Monitoring**: Configure monitoring for API uptime
5. **Add Authentication**: Secure the API with JWT/OAuth for multi-user access

## Support

For issues or questions:
1. Check the logs: `tail -f logs/ppc_optimizer.log`
2. Review API docs: `http://localhost:8000/docs`
3. Check dashboard console for frontend errors
4. Review the main README.md for architecture details

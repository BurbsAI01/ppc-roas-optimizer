# PPC ROAS Optimizer Dashboard

Modern, real-time dashboard for monitoring and optimizing Google Ads campaigns using AI-powered insights.

## Features

✨ **Real-time KPI Tracking** - Monitor ROAS, spend, conversions, and more  
📊 **Historical Trends** - Visualize performance over time with interactive charts  
🎯 **Campaign Analysis** - Compare performance across all campaigns  
🔍 **Keyword Insights** - Identify top and bottom-performing keywords  
🤖 **AI Recommendations** - View actionable recommendations from Claude AI  
🚨 **Alert System** - Real-time alerts for performance issues  
📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile  
🌙 **Dark Mode** - Eye-friendly dark theme support  

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd dashboard
npm install
```

### Development

```bash
npm run dev
```

Dashboard opens at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Axios** - HTTP client

## Project Structure

```
src/
├── components/          # React components
│   ├── KPICard.tsx
│   ├── ROASTrendChart.tsx
│   ├── SpendConversionChart.tsx
│   ├── CampaignPerformanceChart.tsx
│   ├── StatusPieChart.tsx
│   ├── BudgetPieChart.tsx
│   ├── RecommendationsTable.tsx
│   ├── KeywordsTable.tsx
│   ├── AlertsPanel.tsx
│   └── index.ts
├── data/                # Mock data
│   └── mockData.ts
├── types/               # TypeScript types
│   └── index.ts
├── App.tsx              # Main app
├── App.css              # App styles
├── index.css            # Global styles
└── main.tsx             # Entry point
```

## Key Components

### KPICard
Shows key metrics with trend indicators and formatting options.

### Charts
- **ROASTrendChart** - ROAS performance over time
- **SpendConversionChart** - Spend vs conversions correlation
- **CampaignPerformanceChart** - Campaign ROAS comparison
- **StatusPieChart** - Campaign status distribution
- **BudgetPieChart** - Budget allocation breakdown

### Tables
- **RecommendationsTable** - AI recommendations with priority
- **KeywordsTable** - Keyword metrics and performance

### Panels
- **AlertsPanel** - Real-time notifications and alerts

## API Integration

Currently uses mock data. To integrate with backend:

1. Replace `mockData.ts` with API calls
2. Create `src/api/client.ts`:

```typescript
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api"
});

export const getCampaigns = () => API.get("/campaigns");
export const getRecommendations = () => API.get("/recommendations");
export const getChartData = (range: string) => API.get(`/metrics?range=${range}`);
```

3. Update `App.tsx` to use API data:

```typescript
const [campaigns, setCampaigns] = useState([]);

useEffect(() => {
  getCampaigns().then(res => setCampaigns(res.data));
}, []);
```

## Styling

- **Tailwind CSS** - Utility classes for layout and styling
- **Dark Mode** - Built-in with `dark:` prefix
- **Responsive** - Mobile-first design
- **Custom Components** - Defined in `src/index.css`

## Performance Optimizations

- Lazy component loading
- Memoized calculations
- Recharts chart optimization
- Responsive image handling
- Minimal bundle size

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Roadmap

- [ ] Real API integration
- [ ] WebSocket for live updates
- [ ] Export to PDF/CSV
- [ ] Custom dashboard layouts
- [ ] Multi-account management
- [ ] Advanced filtering
- [ ] Drill-down analytics
- [ ] Performance benchmarking

## Troubleshooting

**Charts not rendering?**
- Check browser console for errors
- Verify Recharts is installed
- Ensure data format is correct

**Styles not working?**
- Run `npm install` to get dependencies
- Check `tailwind.config.js` is in place
- Clear cache: `rm -rf node_modules/.vite`

**Port in use?**
- Change in `vite.config.ts` or run `npm run dev -- --port 3000`

## License

MIT License

## Support

Open an issue on GitHub or contact the maintainer.

---

**Built with React, TypeScript, Recharts, and Tailwind CSS**

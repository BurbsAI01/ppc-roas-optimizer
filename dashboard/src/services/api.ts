const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  timestamp?: string;
}

export const apiClient = {
  async getCampaigns() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/campaigns`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      return { campaigns: [], error: String(error) };
    }
  },

  async getRecommendations() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      return { recommendations: [], error: String(error) };
    }
  },

  async getTrends(days: number = 30) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/trends?days=${days}`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch trends:", error);
      return { trends: [], error: String(error) };
    }
  },

  async getKeywords(campaignId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/keywords/${campaignId}`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch keywords for campaign ${campaignId}:`, error);
      return { keywords: [], error: String(error) };
    }
  },

  async getAlerts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
      return { alerts: [], error: String(error) };
    }
  },

  async getSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/summary`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch summary:", error);
      return { error: String(error) };
    }
  },

  async getHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to check health:", error);
      return { status: "unhealthy", error: String(error) };
    }
  },
};

// API Configuration
const API_CONFIG = {
  // Finnhub API configuration
  FINNHUB_API_KEY: process.env.REACT_APP_FINNHUB_API_KEY || 'c343v2iad3idr8a2ed70',
  FINNHUB_BASE_URL: 'https://finnhub.io/api/v1',
  
  // Legacy configuration (kept for backward compatibility)
  API_KEY: process.env.REACT_APP_STOCK_API_KEY || 'YOUR_API_KEY_HERE',
  BASE_URL: 'https://api.example.com/v1',
  ENDPOINTS: {
    MARKET_DATA: '/market/indices',
    STOCK_QUOTE: '/stock/quote',
    BATCH_QUOTES: '/stock/batch'
  }
};

// Sample mock data for development and demonstration
const MOCK_DATA = [
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    price: 445.67,
    change: 2.34,
    changePercent: 0.53,
    volume: 45678900,
    marketCap: 1200000000000,
    high: 447.23,
    low: 443.12
  },
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    price: 378.45,
    change: -1.23,
    changePercent: -0.32,
    volume: 34567800,

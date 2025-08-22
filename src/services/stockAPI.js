// API Configuration
const API_CONFIG = {
  // Finnhub API configuration
  FINNHUB_API_KEY: process.env.REACT_APP_FINNHUB_API_KEY || 'YOUR_FINNHUB_API_KEY_HERE',
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
    marketCap: 850000000000,
    high: 380.12,
    low: 376.89
  },
  {
    symbol: 'IWM',
    name: 'iShares Russell 2000 ETF',
    price: 198.76,
    change: 3.45,
    changePercent: 1.77,
    volume: 23456700,
    marketCap: 45000000000,
    high: 199.23,
    low: 195.34
  }
];

/**
 * Fetch comprehensive stock details including quote, profile, and news
 * @param {string} symbol - Stock symbol (e.g., 'AAPL')
 * @returns {Promise<Object>} Object containing quote, profile, and news data
 */
export const fetchStockDetails = async (symbol) => {
  try {
    const { FINNHUB_API_KEY: apiKey, FINNHUB_BASE_URL: baseUrl } = API_CONFIG;
    
    if (!apiKey || apiKey === 'YOUR_FINNHUB_API_KEY_HERE') {
      throw new Error('Finnhub API key is required');
    }

    // Fetch quote, profile, and news data in parallel
    const [quoteResponse, profileResponse, newsResponse] = await Promise.all([
      fetch(`${baseUrl}/quote?symbol=${symbol}&token=${apiKey}`),
      fetch(`${baseUrl}/stock/profile2?symbol=${symbol}&token=${apiKey}`),
      fetch(`${baseUrl}/company-news?symbol=${symbol}&from=${getDateString(30)}&to=${getDateString(0)}&token=${apiKey}`)
    ]);

    // Check if all requests were successful
    if (!quoteResponse.ok || !profileResponse.ok || !newsResponse.ok) {
      throw new Error('One or more API requests failed');
    }

    // Parse JSON responses
    const [quote, profile, news] = await Promise.all([
      quoteResponse.json(),
      profileResponse.json(),
      newsResponse.json()
    ]);

    return {
      quote,
      profile,
      news: news.slice(0, 10) // Limit to 10 most recent news items
    };
  } catch (error) {
    console.error(`Error fetching stock details for ${symbol}:`, error);
    throw new Error(`Failed to fetch stock details for ${symbol}: ${error.message}`);
  }
};

/**
 * Helper function to get date string in YYYY-MM-DD format
 * @param {number} daysAgo - Number of days ago from today
 * @returns {string} Date string in YYYY-MM-DD format
 */
const getDateString = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

/**
 * Fetch market data for homepage indices
 * @returns {Promise<Array>} Market data array
 */
export const fetchMarketData = async () => {
  // For now, return MOCK_DATA (can be replaced by real API logic)
  console.log('Using mock data for market indices - can be replaced with real API logic');
  return MOCK_DATA;
};

/**
 * Legacy function to fetch stock quote data - returns mock data for compatibility
 * @param {string} symbol - Stock symbol (e.g., 'AAPL')
 * @returns {Promise<Object>} Mock stock quote data
 */
export const fetchStockQuote = async (symbol) => {
  // Return mock data for legacy compatibility
  console.log(`Fetching mock quote data for ${symbol} (legacy compatibility)`);
  
  // Find matching symbol in MOCK_DATA, or return default data
  const mockStock = MOCK_DATA.find(stock => stock.symbol === symbol) || {
    symbol: symbol,
    name: `${symbol} Corporation`,
    price: 150.00,
    change: 2.50,
    changePercent: 1.69,
    volume: 1000000,
    marketCap: 50000000000,
    high: 152.00,
    low: 148.50
  };
  
  return mockStock;
};

// Legacy export for backward compatibility
export default {
  API_CONFIG,
  MOCK_DATA,
  fetchStockDetails,
  fetchMarketData,
  fetchStockQuote
};

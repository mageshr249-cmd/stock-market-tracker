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
    marketCap: 890000000000,
    high: 380.67,
    low: 376.89
  }
];

/**
 * Fetches comprehensive stock details including quote, profile, and news from Finnhub
 * @param {string} symbol - The stock symbol (e.g., 'AAPL', 'GOOGL')
 * @returns {Promise<Object>} Object containing quote, profile, and news data
 */
export const fetchStockDetails = async (symbol) => {
  if (!symbol) {
    throw new Error('Stock symbol is required');
  }

  const apiKey = API_CONFIG.FINNHUB_API_KEY;
  const baseUrl = API_CONFIG.FINNHUB_BASE_URL;

  if (!apiKey || apiKey === 'YOUR_FINNHUB_API_KEY_HERE') {
    console.warn('Finnhub API key not configured, using mock data');
    // Return mock data structure for development
    return {
      quote: {
        c: 150.00, // current price
        h: 152.00, // high price
        l: 148.00, // low price
        o: 149.00, // open price
        pc: 148.50, // previous close
        t: Date.now() / 1000 // timestamp
      },
      profile: {
        name: `${symbol} Company`,
        ticker: symbol,
        exchange: 'NASDAQ',
        ipo: '2000-01-01',
        marketCapitalization: 1000000,
        shareOutstanding: 1000000,
        logo: '',
        weburl: `https://example.com`,
        finnhubIndustry: 'Technology'
      },
      news: [
        {
          category: 'general',
          datetime: Date.now() / 1000,
          headline: `Latest news about ${symbol}`,
          id: 1,
          image: '',
          related: symbol,
          source: 'Example News',
          summary: `This is a sample news article about ${symbol}.`,
          url: 'https://example.com/news'
        }
      ]
    };
  }

  try {
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

// Legacy export for backward compatibility
export default {
  API_CONFIG,
  MOCK_DATA,
  fetchStockDetails
};

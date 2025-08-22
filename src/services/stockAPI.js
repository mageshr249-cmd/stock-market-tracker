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
    high: 379.87,
    low: 376.21
  },
  {
    symbol: 'IWM',
    name: 'iShares Russell 2000 ETF',
    price: 201.34,
    change: 0.89,
    changePercent: 0.44,
    volume: 23456700,
    marketCap: 450000000000,
    high: 202.15,
    low: 199.87
  }
];

/**
 * Fetch detailed stock information including quote, profile, and news
 * @param {string} symbol - Stock symbol to fetch details for
 * @returns {Promise<Object>} Stock details including quote, profile, and news
 */
export const fetchStockDetails = async (symbol) => {
  const apiKey = API_CONFIG.FINNHUB_API_KEY;
  const baseUrl = API_CONFIG.FINNHUB_BASE_URL;
  
  // Return mock data if no API key is configured
  if (!apiKey || apiKey === 'YOUR_FINNHUB_API_KEY_HERE') {
    console.warn('Using mock data - please configure FINNHUB_API_KEY for live data');
    
    // Return mock stock details
    return {
      quote: {
        c: 150.25, // current price
        h: 152.10, // high price of the day
        l: 149.80, // low price of the day
        o: 151.00, // open price of the day
        pc: 149.50, // previous close price
        dp: 0.75,  // change
        dp: 0.50   // percent change
      },
      profile: {
        country: 'US',
        currency: 'USD',
        exchange: 'NASDAQ NMS - GLOBAL MARKET',
        finnhubIndustry: 'Technology',
        ipo: '1980-12-12',
        logo: '',
        marketCapitalization: 2500000,
        name: `${symbol} Company`,
        phone: '14089961010.0',
        shareOutstanding: 16406.4,
        ticker: symbol,
        weburl: 'https://example.com'
      },
      news: [
        {
          category: 'technology',
          datetime: Math.floor(Date.now() / 1000),
          headline: `${symbol} Reports Strong Quarterly Results`,
          id: 12345,
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

/**
 * Fetch market data for homepage indices
 * @returns {Promise<Array>} Market data array
 */
export const fetchMarketData = async () => {
  // For now, return MOCK_DATA (can be replaced by real API logic)
  console.log('Using mock data for market indices - can be replaced with real API logic');
  return MOCK_DATA;
};

// Legacy export for backward compatibility
export default {
  API_CONFIG,
  MOCK_DATA,
  fetchStockDetails,
  fetchMarketData
};

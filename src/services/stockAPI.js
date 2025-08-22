// API Configuration
const API_CONFIG = {
  // Replace with your actual API key from your chosen financial data provider
  API_KEY: process.env.REACT_APP_STOCK_API_KEY || 'YOUR_API_KEY_HERE',
  BASE_URL: 'https://api.example.com/v1', // Replace with actual API base URL
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
  },
  {
    symbol: 'IWM',
    name: 'iShares Russell 2000 ETF',
    price: 198.76,
    change: 0.87,
    changePercent: 0.44,
    volume: 23456700,
    marketCap: 340000000000,
    high: 199.45,
    low: 197.23
  },
  {
    symbol: 'DIA',
    name: 'SPDR Dow Jones Industrial Average ETF Trust',
    price: 354.23,
    change: 1.56,
    changePercent: 0.44,
    volume: 12345600,
    marketCap: 280000000000,
    high: 355.12,
    low: 352.67
  },
  {
    symbol: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    price: 234.89,
    change: 0.98,
    changePercent: 0.42,
    volume: 18765400,
    marketCap: 1500000000000,
    high: 235.67,
    low: 233.45
  },
  {
    symbol: 'ARKK',
    name: 'ARK Innovation ETF',
    price: 67.34,
    change: -0.45,
    changePercent: -0.66,
    volume: 9876543,
    marketCap: 45000000000,
    high: 68.12,
    low: 66.78
  }
];

/**
 * Fetches market data from the API or returns mock data
 * @returns {Promise<Array>} Array of market index data
 */
export const fetchMarketData = async () => {
  try {
    // Check if we should use real API (when API key is configured)
    if (API_CONFIG.API_KEY && API_CONFIG.API_KEY !== 'YOUR_API_KEY_HERE') {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MARKET_DATA}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data.indices || data; // Adjust based on API response structure
    } else {
      // Use mock data for development
      console.log('Using mock data - configure API_KEY for real data');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add some randomness to mock data to simulate real-time updates
      return MOCK_DATA.map(item => ({
        ...item,
        price: item.price + (Math.random() - 0.5) * 2, // Random price fluctuation
        change: (Math.random() - 0.5) * 10, // Random change
        changePercent: (Math.random() - 0.5) * 2 // Random percentage change
      }));
    }
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

/**
 * Fetches a single stock quote
 * @param {string} symbol - Stock symbol to fetch
 * @returns {Promise<Object>} Stock quote data
 */
export const fetchStockQuote = async (symbol) => {
  try {
    if (API_CONFIG.API_KEY && API_CONFIG.API_KEY !== 'YOUR_API_KEY_HERE') {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STOCK_QUOTE}?symbol=${symbol}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } else {
      // Return mock data for the requested symbol
      const mockQuote = MOCK_DATA.find(item => item.symbol === symbol.toUpperCase());
      
      if (!mockQuote) {
        throw new Error(`Symbol ${symbol} not found in mock data`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        ...mockQuote,
        price: mockQuote.price + (Math.random() - 0.5) * 2,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 2
      };
    }
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Fetches multiple stock quotes in batch
 * @param {Array<string>} symbols - Array of stock symbols
 * @returns {Promise<Array>} Array of stock quote data
 */
export const fetchBatchQuotes = async (symbols) => {
  try {
    if (API_CONFIG.API_KEY && API_CONFIG.API_KEY !== 'YOUR_API_KEY_HERE') {
      const symbolsParam = symbols.join(',');
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BATCH_QUOTES}?symbols=${symbolsParam}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.quotes || data.results || data;
    } else {
      // Return mock data for requested symbols
      const quotes = symbols.map(symbol => {
        const mockQuote = MOCK_DATA.find(item => item.symbol === symbol.toUpperCase());
        
        if (!mockQuote) {
          return null; // Skip symbols not found in mock data
        }
        
        return {
          ...mockQuote,
          price: mockQuote.price + (Math.random() - 0.5) * 2,
          change: (Math.random() - 0.5) * 10,
          changePercent: (Math.random() - 0.5) * 2
        };
      }).filter(Boolean); // Remove null entries
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return quotes;
    }
  } catch (error) {
    console.error('Error fetching batch quotes:', error);
    throw error;
  }
};

/**
 * Utility function to format API errors for user display
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const formatAPIError = (error) => {
  if (error.message.includes('403')) {
    return 'API access denied. Please check your API key.';
  }
  if (error.message.includes('429')) {
    return 'API rate limit exceeded. Please try again later.';
  }
  if (error.message.includes('500')) {
    return 'API server error. Please try again later.';
  }
  if (error.message.includes('network')) {
    return 'Network error. Please check your connection.';
  }
  
  return 'Unable to fetch market data. Please try again later.';
};

/**
 * Configuration helper to check if API is properly configured
 * @returns {boolean} True if API is configured
 */
export const isAPIConfigured = () => {
  return API_CONFIG.API_KEY && API_CONFIG.API_KEY !== 'YOUR_API_KEY_HERE';
};

// Export configuration for external use
export { API_CONFIG };

import React, { useState, useEffect } from 'react';
import { fetchStockQuote } from '../services/stockAPI';
import StockChart from './StockChart';
import CompanySummary from './CompanySummary';
import NewsSection from './NewsSection';
import LoadingSpinner from './LoadingSpinner';

const DetailedStockView = ({ symbol, onClose }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('chart');

  useEffect(() => {
    const loadStockData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStockQuote(symbol);
        setStockData(data);
      } catch (err) {
        setError('Failed to load stock data');
        console.error('Error loading stock data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      loadStockData();
    }
  }, [symbol]);

  const formatPrice = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatPercentage = (num) => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  const getChangeColor = (change) => {
    if (change > 0) return '#00C853';
    if (change < 0) return '#FF1744';
    return '#9E9E9E';
  };

  if (loading) {
    return (
      <div className="detailed-stock-view">
        <div className="stock-header">
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !stockData) {
    return (
      <div className="detailed-stock-view">
        <div className="stock-header">
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="error-state">
          <h2>Error Loading Stock Data</h2>
          <p>{error || 'Stock data could not be loaded'}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detailed-stock-view">
      <div className="stock-header">
        <div className="header-content">
          <div className="stock-title">
            <h1 className="symbol">{stockData.symbol}</h1>
            <h2 className="company-name">{stockData.name}</h2>
          </div>
          <div className="price-section">
            <div className="current-price">{formatPrice(stockData.price)}</div>
            <div 
              className="change-info"
              style={{ color: getChangeColor(stockData.change) }}
            >
              <span className="change">
                {stockData.change >= 0 ? '+' : ''}{formatPrice(Math.abs(stockData.change))}
              </span>
              <span className="change-percent">
                ({formatPercentage(stockData.changePercent)})
              </span>
            </div>
          </div>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      <div className="stock-tabs">
        <button 
          className={`tab ${activeTab === 'chart' ? 'active' : ''}`}
          onClick={() => setActiveTab('chart')}
        >
          Charts
        </button>
        <button 
          className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Company
        </button>
        <button 
          className={`tab ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTab('news')}
        >
          News
        </button>
      </div>

      <div className="stock-content">
        {activeTab === 'chart' && (
          <div className="chart-section">
            <StockChart symbol={symbol} data={stockData} />
            <div className="key-metrics">
              <div className="metric-card">
                <span className="metric-label">Volume</span>
                <span className="metric-value">{stockData.volume?.toLocaleString()}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Market Cap</span>
                <span className="metric-value">
                  ${(stockData.marketCap / 1e9).toFixed(1)}B
                </span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Day High</span>
                <span className="metric-value">{formatPrice(stockData.high)}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Day Low</span>
                <span className="metric-value">{formatPrice(stockData.low)}</span>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'summary' && (
          <CompanySummary symbol={symbol} data={stockData} />
        )}
        
        {activeTab === 'news' && (
          <NewsSection symbol={symbol} />
        )}
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
.detailed-stock-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stock-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1;
  margin-right: 2rem;
}

.stock-title .symbol {
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stock-title .company-name {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0 0 0;
  font-weight: 300;
}

.price-section {
  text-align: right;
}

.current-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.change-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.change, .change-percent {
  font-size: 1.1rem;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.stock-tabs {
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 2rem;
  display: flex;
  gap: 0;
}

.tab {
  background: transparent;
  border: none;
  padding: 1rem 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}

.tab:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
}

.tab.active {
  color: #00C853;
  border-bottom-color: #00C853;
  background: rgba(0, 200, 83, 0.1);
}

.stock-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.chart-section {
  display: grid;
  gap: 2rem;
}

.key-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.metric-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.metric-value {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  text-align: center;
  color: white;
}

.error-state h2 {
  color: #ff6b6b;
  margin-bottom: 1rem;
}

.retry-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-top: 1rem;
}

.retry-btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .stock-header {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    margin-right: 1rem;
  }
  
  .price-section {
    text-align: left;
  }
  
  .stock-title .symbol {
    font-size: 2rem;
  }
  
  .current-price {
    font-size: 1.8rem;
  }
  
  .stock-content {
    padding: 1rem;
  }
  
  .key-metrics {
    grid-template-columns: 1fr;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default DetailedStockView;

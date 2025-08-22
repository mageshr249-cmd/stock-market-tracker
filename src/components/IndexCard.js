import React from 'react';

const IndexCard = ({ data }) => {
  // Default values if data is not provided or incomplete
  const {
    symbol = 'N/A',
    name = 'Unknown Index',
    price = 0,
    change = 0,
    changePercent = 0,
    volume = 0,
    marketCap = 0,
    high = 0,
    low = 0
  } = data || {};

  // Format numbers for display
  const formatPrice = (num) => {
    if (num === 0) return '0.00';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatLargeNumber = (num) => {
    if (num === 0) return '0';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  };

  const formatPercentage = (num) => {
    if (num === 0) return '0.00%';
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  const getChangeColor = (change) => {
    if (change > 0) return '#4caf50'; // Green for positive
    if (change < 0) return '#f44336'; // Red for negative
    return '#9e9e9e'; // Gray for no change
  };

  return (
    <div className="index-card">
      <div className="card-header">
        <div className="symbol-section">
          <h3 className="symbol">{symbol}</h3>
          <p className="name">{name}</p>
        </div>
        <div className="price-section">
          <div className="current-price">${formatPrice(price)}</div>
          <div 
            className="change-info" 
            style={{ color: getChangeColor(change) }}
          >
            <span className="change">{change >= 0 ? '+' : ''}${formatPrice(Math.abs(change))}</span>
            <span className="change-percent">({formatPercentage(changePercent)})</span>
          </div>
        </div>
      </div>
      
      <div className="card-stats">
        <div className="stat">
          <span className="stat-label">Volume</span>
          <span className="stat-value">{formatLargeNumber(volume)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Market Cap</span>
          <span className="stat-value">${formatLargeNumber(marketCap)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">High</span>
          <span className="stat-value">${formatPrice(high)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Low</span>
          <span className="stat-value">${formatPrice(low)}</span>
        </div>
      </div>
      
      <div className="card-footer">
        <div className="trend-indicator">
          <span className="trend-arrow" style={{ color: getChangeColor(change) }}>
            {change > 0 ? '↗' : change < 0 ? '↘' : '→'}
          </span>
          <span className="trend-text">Real-time data</span>
        </div>
      </div>
    </div>
  );
};

// CSS-in-JS styles for the component
const styles = `
.index-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.index-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.symbol-section .symbol {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.symbol-section .name {
  margin: 0;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

.price-section {
  text-align: right;
}

.current-price {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.change-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.change, .change-percent {
  font-size: 0.875rem;
  font-weight: 600;
}

.card-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.stat-value {
  font-size: 0.875rem;
  color: white;
  font-weight: 600;
}

.card-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  display: flex;
  justify-content: center;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trend-arrow {
  font-size: 1.25rem;
  font-weight: 700;
}

.trend-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 480px) {
  .index-card {
    padding: 1rem;
  }
  
  .card-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .price-section {
    text-align: left;
  }
  
  .change-info {
    align-items: flex-start;
  }
  
  .card-stats {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default IndexCard;

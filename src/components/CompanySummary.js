import React from 'react';

const CompanySummary = ({ symbol, data }) => {
  // Mock company information for demonstration
  const companyInfo = {
    SPY: {
      description: 'The SPDR S&P 500 ETF Trust seeks to provide investment results that, before expenses, correspond generally to the price and yield performance of the S&P 500 Index.',
      sector: 'Financial Services',
      employees: 'N/A',
      founded: '1993',
      headquarters: 'Boston, MA',
      website: 'https://www.ssga.com'
    },
    QQQ: {
      description: 'The Invesco QQQ Trust tracks the Nasdaq-100 Index, which includes 100 of the largest domestic and international non-financial companies listed on Nasdaq.',
      sector: 'Technology',
      employees: 'N/A', 
      founded: '1999',
      headquarters: 'Atlanta, GA',
      website: 'https://www.invesco.com'
    },
    IWM: {
      description: 'The iShares Russell 2000 ETF seeks to track the investment results of the Russell 2000 Index, which measures the performance of small-cap U.S. equities.',
      sector: 'Financial Services',
      employees: 'N/A',
      founded: '2000',
      headquarters: 'New York, NY', 
      website: 'https://www.ishares.com'
    }
  };

  const info = companyInfo[symbol] || {
    description: `Detailed information for ${symbol} is not available in our database. This is a financial instrument or security that is actively traded on major exchanges.`,
    sector: 'Unknown',
    employees: 'N/A',
    founded: 'N/A',
    headquarters: 'N/A',
    website: 'N/A'
  };

  const formatNumber = (num) => {
    if (!num || num === 0) return 'N/A';
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="company-summary">
      <div className="summary-header">
        <h3>Company Overview</h3>
        <div className="symbol-badge">{symbol}</div>
      </div>
      
      <div className="company-description">
        <h4>About</h4>
        <p>{info.description}</p>
      </div>
      
      <div className="company-details">
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Sector</span>
            <span className="detail-value">{info.sector}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Founded</span>
            <span className="detail-value">{info.founded}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Headquarters</span>
            <span className="detail-value">{info.headquarters}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Employees</span>
            <span className="detail-value">{info.employees}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Market Cap</span>
            <span className="detail-value">${formatNumber(data.marketCap)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Website</span>
            <span className="detail-value">
              {info.website !== 'N/A' ? (
                <a href={info.website} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              ) : (
                'N/A'
              )}
            </span>
          </div>
        </div>
      </div>
      
      <div className="key-metrics">
        <h4>Key Financial Metrics</h4>
        <div className="metrics-grid">
          <div className="metric">
            <div className="metric-label">Current Price</div>
            <div className="metric-value">${data.price?.toFixed(2) || 'N/A'}</div>
          </div>
          
          <div className="metric">
            <div className="metric-label">Day Range</div>
            <div className="metric-value">
              ${data.low?.toFixed(2) || 'N/A'} - ${data.high?.toFixed(2) || 'N/A'}
            </div>
          </div>
          
          <div className="metric">
            <div className="metric-label">Volume</div>
            <div className="metric-value">{formatNumber(data.volume)}</div>
          </div>
          
          <div className="metric">
            <div className="metric-label">Change</div>
            <div className="metric-value" style={{
              color: data.change >= 0 ? '#00C853' : '#FF1744'
            }}>
              {data.change >= 0 ? '+' : ''}${data.change?.toFixed(2) || 'N/A'} 
              ({data.changePercent >= 0 ? '+' : ''}{data.changePercent?.toFixed(2) || 'N/A'}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
.company-summary {
  color: #ffffff;
  padding: 1.5rem;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.symbol-badge {
  background: rgba(0, 200, 83, 0.2);
  border: 1px solid #00C853;
  color: #00C853;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.company-description {
  margin-bottom: 2rem;
}

.company-description h4 {
  color: #ffffff;
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.company-description p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
}

.company-details {
  margin-bottom: 2rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.detail-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: transform 0.2s ease;
}

.detail-item:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.detail-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.detail-value {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
}

.detail-value a {
  color: #00C853;
  text-decoration: none;
  transition: color 0.2s ease;
}

.detail-value a:hover {
  color: #00E676;
  text-decoration: underline;
}

.key-metrics {
  background: linear-gradient(135deg, rgba(0, 200, 83, 0.1) 0%, rgba(0, 200, 83, 0.05) 100%);
  border: 1px solid rgba(0, 200, 83, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
}

.key-metrics h4 {
  color: #ffffff;
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.metric-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .summary-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .metrics-grid {
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

export default CompanySummary;

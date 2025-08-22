import React from 'react';
import IndexCard from './IndexCard';

const IndexList = ({ marketData }) => {
  if (!marketData || marketData.length === 0) {
    return (
      <div className="empty-state">
        <h2>No market data available</h2>
        <p>Market data will appear here once loaded.</p>
      </div>
    );
  }

  return (
    <div className="index-list">
      <div className="market-overview">
        <h2>Market Overview</h2>
        <div className="market-grid">
          {marketData.map((indexData, index) => (
            <IndexCard 
              key={indexData.symbol || index} 
              data={indexData} 
            />
          ))}
        </div>
      </div>
      
      <div className="market-stats">
        <div className="stat-card">
          <h3>Active Indices</h3>
          <p className="stat-value">{marketData.length}</p>
        </div>
        
        <div className="stat-card">
          <h3>Market Status</h3>
          <p className="stat-value market-open">OPEN</p>
        </div>
        
        <div className="stat-card">
          <h3>Last Update</h3>
          <p className="stat-value">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

// CSS-in-JS styles for the component
const styles = `
.index-list {
  width: 100%;
}

.market-overview h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.market-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.market-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
}

.market-open {
  color: #4caf50;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.empty-state h2 {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .market-grid {
    grid-template-columns: 1fr;
  }
  
  .market-stats {
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

export default IndexList;

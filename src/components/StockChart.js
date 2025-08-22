import React, { useState, useEffect, useRef } from 'react';

const StockChart = ({ symbol, data }) => {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  // Generate mock historical data for demonstration
  useEffect(() => {
    const generateMockData = () => {
      const basePrice = data.price || 100;
      const dataPoints = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : 365;
      const mockData = [];
      
      for (let i = dataPoints - 1; i >= 0; i--) {
        const randomChange = (Math.random() - 0.5) * 10;
        const price = Math.max(basePrice + randomChange - (i * 0.1), basePrice * 0.8);
        const date = new Date();
        
        if (timeframe === '1D') {
          date.setHours(date.getHours() - i);
        } else if (timeframe === '1W') {
          date.setDate(date.getDate() - i);
        } else if (timeframe === '1M') {
          date.setDate(date.getDate() - i);
        } else {
          date.setDate(date.getDate() - i);
        }
        
        mockData.push({
          timestamp: date.toISOString(),
          price: price,
          volume: Math.floor(Math.random() * 1000000) + 100000
        });
      }
      
      return mockData.reverse();
    };

    setLoading(true);
    setTimeout(() => {
      setChartData(generateMockData());
      setLoading(false);
    }, 500);
  }, [timeframe, data.price]);

  // Draw chart on canvas
  useEffect(() => {
    if (!canvasRef.current || chartData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up chart dimensions
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    // Find min and max prices
    const prices = chartData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 200, 83, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 200, 83, 0.01)');
    
    // Draw price line
    ctx.strokeStyle = '#00C853';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    chartData.forEach((point, index) => {
      const x = padding + (index / (chartData.length - 1)) * chartWidth;
      const y = padding + (1 - (point.price - minPrice) / priceRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Fill area under curve
    ctx.fillStyle = gradient;
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.closePath();
    ctx.fill();
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i / 4) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 6; i++) {
      const x = padding + (i / 6) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    }
    
    // Draw price labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 4; i++) {
      const price = maxPrice - (i / 4) * priceRange;
      const y = padding + (i / 4) * chartHeight;
      ctx.fillText(`$${price.toFixed(2)}`, padding - 10, y + 4);
    }
    
  }, [chartData]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    if (timeframe === '1D') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="stock-chart">
      <div className="chart-header">
        <h3>Price Chart - {symbol}</h3>
        <div className="timeframe-selector">
          {['1D', '1W', '1M', '1Y'].map((tf) => (
            <button
              key={tf}
              className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => setTimeframe(tf)}
              disabled={loading}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <div className="chart-container">
        {loading ? (
          <div className="chart-loading">
            <div className="loading-spinner"></div>
            <p>Loading chart data...</p>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="price-chart"
            />
            <div className="chart-info">
              <div className="data-points">
                <span className="data-label">Data Points:</span>
                <span className="data-value">{chartData.length}</span>
              </div>
              <div className="last-updated">
                <span className="data-label">Last Updated:</span>
                <span className="data-value">
                  {chartData.length > 0 ? formatDate(chartData[chartData.length - 1].timestamp) : 'N/A'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
.stock-chart {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  color: #ffffff;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.timeframe-selector {
  display: flex;
  gap: 0.5rem;
}

.timeframe-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.timeframe-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.timeframe-btn.active {
  background: rgba(0, 200, 83, 0.2);
  border-color: #00C853;
  color: #00C853;
}

.timeframe-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.price-chart {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.7);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #00C853;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.chart-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  width: 100%;
}

.data-points,
.last-updated {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.data-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-value {
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .timeframe-selector {
    width: 100%;
    justify-content: space-between;
  }
  
  .timeframe-btn {
    flex: 1;
    text-align: center;
  }
  
  .price-chart {
    height: 300px;
  }
  
  .chart-container {
    height: 300px;
  }
  
  .chart-info {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default StockChart;

import React, { useState, useEffect } from 'react';

const NewsSection = ({ symbol }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock news data for demonstration
  const mockNews = {
    SPY: [
      {
        id: 1,
        title: 'S&P 500 Index Fund Shows Strong Performance Amid Market Volatility',
        summary: 'The SPDR S&P 500 ETF Trust continues to attract investors as market conditions remain favorable for diversified investment strategies.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: 'MarketWatch',
        category: 'market'
      },
      {
        id: 2,
        title: 'Federal Reserve Policy Impact on Index Funds',
        summary: 'Recent Federal Reserve announcements have significant implications for broad market index funds like SPY.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        source: 'Reuters',
        category: 'policy'
      },
      {
        id: 3,
        title: 'Institutional Investors Increase S&P 500 Holdings',
        summary: 'Major pension funds and institutional investors are expanding their positions in S&P 500 index funds.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        source: 'Financial Times',
        category: 'institutional'
      }
    ],
    QQQ: [
      {
        id: 4,
        title: 'Tech Stocks Rally Boosts Nasdaq-100 ETF Performance',
        summary: 'The Invesco QQQ Trust benefits from strong performance in major technology companies.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        source: 'CNBC',
        category: 'market'
      },
      {
        id: 5,
        title: 'AI Revolution Drives QQQ to New Highs',
        summary: 'Artificial intelligence developments continue to propel technology-focused ETFs higher.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        source: 'Bloomberg',
        category: 'technology'
      }
    ]
  };

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const symbolNews = mockNews[symbol] || [
        {
          id: Date.now(),
          title: `Latest ${symbol} News`,
          summary: `Stay updated with the latest news and analysis for ${symbol}. Market data and insights coming soon.`,
          timestamp: new Date().toISOString(),
          source: 'Market News',
          category: 'general'
        }
      ];
      
      setNews(symbolNews);
      setLoading(false);
    };

    loadNews();
  }, [symbol]);

  const categories = ['all', 'market', 'policy', 'technology', 'institutional', 'general'];
  
  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMins > 0) {
      return `${diffMins}m ago`;
    } else {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <div className="news-section loading">
        <div className="news-header">
          <h3>Latest News - {symbol}</h3>
        </div>
        <div className="news-loading">
          <div className="loading-spinner"></div>
          <p>Loading latest news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-section">
      <div className="news-header">
        <h3>Latest News - {symbol}</h3>
        <div className="news-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="news-list">
        {filteredNews.length === 0 ? (
          <div className="no-news">
            <p>No news available for the selected category.</p>
          </div>
        ) : (
          filteredNews.map(article => (
            <div key={article.id} className="news-item">
              <div className="news-content">
                <div className="news-meta">
                  <span className="news-source">{article.source}</span>
                  <span className="news-time">{formatTimestamp(article.timestamp)}</span>
                  <span className={`news-category category-${article.category}`}>
                    {article.category}
                  </span>
                </div>
                <h4 className="news-title">{article.title}</h4>
                <p className="news-summary">{article.summary}</p>
                <button className="read-more-btn">
                  Read More →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
.news-section {
  color: #ffffff;
  padding: 1.5rem;
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
}

.news-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.news-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
}

.filter-btn.active {
  background: rgba(0, 200, 83, 0.2);
  border-color: #00C853;
  color: #00C853;
}

.news-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
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

.news-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.news-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.news-item:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.news-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.news-source {
  color: #00C853;
  font-size: 0.875rem;
  font-weight: 600;
}

.news-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

.news-category {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-market { background: rgba(0, 200, 83, 0.2); color: #00C853; }
.category-policy { background: rgba(255, 193, 7, 0.2); color: #FFC107; }
.category-technology { background: rgba(33, 150, 243, 0.2); color: #2196F3; }
.category-institutional { background: rgba(156, 39, 176, 0.2); color: #9C27B0; }
.category-general { background: rgba(158, 158, 158, 0.2); color: #9E9E9E; }

.news-title {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.news-summary {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.read-more-btn {
  background: transparent;
  border: 1px solid rgba(0, 200, 83, 0.5);
  color: #00C853;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.read-more-btn:hover {
  background: rgba(0, 200, 83, 0.1);
  border-color: #00C853;
  transform: translateX(2px);
}

.no-news {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 768px) {
  .news-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .news-filters {
    width: 100%;
  }
  
  .filter-btn {
    flex: 1;
    text-align: center;
    min-width: 80px;
  }
  
  .news-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default NewsSection;

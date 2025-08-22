import React, { useState, useEffect } from 'react';
import './App.css';
import IndexCard from './components/IndexCard';
import DetailedStockView from './components/DetailedStockView';
import LoadingSpinner from './components/LoadingSpinner';
import SearchBar from './components/SearchBar';
import { fetchMarketData, fetchStockDetails } from './services/stockAPI';

function App() {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const loadMarketData = async () => {
      try {
        setLoading(true);
        const data = await fetchMarketData();
        setMarketData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch market data');
        console.error('Error fetching market data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMarketData();
    
    // Update data every 30 seconds
    const interval = setInterval(loadMarketData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleStockClick = async (stock) => {
    try {
      setModalLoading(true);
      setShowModal(true);
      
      // Fetch detailed data for the selected stock
      const detailedData = await fetchStockDetails(stock.symbol);
      setSelectedStock(detailedData);
    } catch (err) {
      console.error('Error fetching stock details:', err);
      setSelectedStock(stock); // Fallback to basic data
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStock(null);
    setModalLoading(false);
  };

  // Universal search handler - supports search-to-modal integration
  const handleSymbolSelect = async (symbol) => {
    try {
      setModalLoading(true);
      setShowModal(true);
      
      // Fetch detailed data for the searched symbol
      const detailedData = await fetchStockDetails(symbol);
      setSelectedStock(detailedData);
    } catch (err) {
      console.error('Error fetching stock details for search:', err);
      // Create a fallback stock object for search results
      const fallbackStock = {
        symbol: symbol,
        name: symbol,
        price: 0,
        change: 0,
        changePercent: 0
      };
      setSelectedStock(fallbackStock);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>📈 Stock Market Tracker</h1>
          <SearchBar 
            onSymbolSelect={handleSymbolSelect}
            placeholder="Search stocks, funds, bonds..."
          />
        </div>
        
        <div className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </header>
      
      <main className="app-main">
        {loading && (
          <div className="loading-container">
            <LoadingSpinner size="large" />
            <p>Loading market data...</p>
          </div>
        )}
        
        {error && (
          <div className="error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="market-grid">
            {marketData.map((item, index) => (
              <IndexCard
                key={item.symbol || index}
                data={item}
                onClick={() => handleStockClick(item)}
              />
            ))}
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Real-time market data • Updates every 30 seconds</p>
      </footer>
      
      {/* Modern Yahoo-view Modal with Universal Search Integration */}
      {showModal && (
        <DetailedStockView
          stock={selectedStock}
          loading={modalLoading}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;

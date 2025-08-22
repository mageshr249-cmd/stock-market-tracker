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

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStock(null);
    setModalLoading(false);
  };

  const handleSymbolSelect = async (symbol) => {
    try {
      setModalLoading(true);
      setShowModal(true);
      
      // Fetch detailed data for the selected symbol
      const stockDetails = await fetchStockDetails(symbol);
      
      setSelectedStock(stockDetails);
      setModalLoading(false);
    } catch (err) {
      console.error('Error fetching stock details:', err);
      setError(`Failed to fetch details for ${symbol}`);
      setModalLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Stock Market Tracker</h1>
        
        {/* Universal Search Bar */}
        <div className="search-container">
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
      
      {/* Detailed Stock Modal */}
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

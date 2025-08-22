import React, { useState, useEffect } from 'react';
import './App.css';
import IndexList from './components/IndexList';
import { fetchMarketData } from './services/stockAPI';

function App() {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="App">
      <header className="app-header">
        <h1>Stock Market Tracker</h1>
        <div className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </header>
      
      <main className="app-main">
        {loading && <div className="loading">Loading market data...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && (
          <IndexList marketData={marketData} />
        )}
      </main>
      
      <footer className="app-footer">
        <p>Real-time market data • Updates every 30 seconds</p>
      </footer>
    </div>
  );
}

export default App;

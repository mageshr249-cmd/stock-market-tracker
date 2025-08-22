import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSymbolSelect, apiKey }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const searchRef = useRef(null);

  // Debounced search function
  const searchSymbols = async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      // Using Alpha Vantage symbol search (free tier available)
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(searchQuery)}&apikey=${apiKey}`
      );
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      
      if (data['bestMatches']) {
        const results = data['bestMatches'].slice(0, 10).map(match => ({
          symbol: match['1. symbol'],
          name: match['2. name'],
          type: match['3. type'],
          region: match['4. region'],
          currency: match['8. currency']
        }));
        
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setQuery(value);
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new debounce
    debounceRef.current = setTimeout(() => {
      searchSymbols(value);
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.symbol);
    setShowSuggestions(false);
    setSuggestions([]);
    onSymbolSelect(suggestion);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[0]);
      } else if (query.trim()) {
        // Direct symbol lookup
        onSymbolSelect({ symbol: query.trim(), name: query.trim() });
        setShowSuggestions(false);
      }
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Get security type icon
  const getTypeIcon = (type) => {
    if (type?.toLowerCase().includes('equity')) return '📈';
    if (type?.toLowerCase().includes('etf')) return '📊';
    if (type?.toLowerCase().includes('fund')) return '🏛️';
    if (type?.toLowerCase().includes('bond')) return '💰';
    return '🔍';
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <div className="search-icon">🔍</div>
        <input
          type="text"
          className="search-input"
          placeholder="Search stocks, ETFs, mutual funds, bonds..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          autoComplete="off"
        />
        {isLoading && <div className="loading-spinner">⏳</div>}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          <div className="suggestions-header">
            <span>Search Results</span>
            <span className="results-count">{suggestions.length} found</span>
          </div>
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.symbol}-${index}`}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="suggestion-main">
                <span className="suggestion-icon">
                  {getTypeIcon(suggestion.type)}
                </span>
                <div className="suggestion-info">
                  <div className="suggestion-symbol">{suggestion.symbol}</div>
                  <div className="suggestion-name">{suggestion.name}</div>
                </div>
              </div>
              <div className="suggestion-meta">
                <span className="suggestion-type">{suggestion.type}</span>
                <span className="suggestion-region">{suggestion.region}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showSuggestions && suggestions.length === 0 && !isLoading && query.length >= 2 && (
        <div className="suggestions-dropdown">
          <div className="no-results">
            <div className="no-results-icon">❌</div>
            <div>No securities found for "{query}"</div>
            <div className="no-results-hint">Try a different symbol or company name</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

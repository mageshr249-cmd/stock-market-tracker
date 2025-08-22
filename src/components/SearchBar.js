import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

const SearchBar = ({ 
  onSymbolSelect, 
  placeholder = "Search stocks, ETFs, mutual funds...",
  apiProvider = 'finnhub', // 'finnhub' or 'alphavantage'
  apiKey,
  className = '',
  disabled = false 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState(null);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search function
  const debouncedSearch = (searchQuery) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  };

  // Search function for different API providers
  const performSearch = async (searchQuery) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let results = [];
      
      if (apiProvider === 'finnhub') {
        results = await searchFinnhub(searchQuery);
      } else if (apiProvider === 'alphavantage') {
        results = await searchAlphaVantage(searchQuery);
      }
      
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search symbols');
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Finnhub API search
  const searchFinnhub = async (searchQuery) => {
    if (!apiKey) {
      throw new Error('Finnhub API key is required');
    }
    
    const response = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(searchQuery)}&token=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Finnhub');
    }
    
    const data = await response.json();
    
    return data.result?.map(item => ({
      symbol: item.symbol,
      description: item.description,
      type: item.type || 'Common Stock',
      displayText: item.displaySymbol || item.symbol
    })) || [];
  };

  // Alpha Vantage API search
  const searchAlphaVantage = async (searchQuery) => {
    if (!apiKey) {
      throw new Error('Alpha Vantage API key is required');
    }
    
    const response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(searchQuery)}&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Alpha Vantage');
    }
    
    const data = await response.json();
    
    return data.bestMatches?.map(item => ({
      symbol: item['1. symbol'],
      description: item['2. name'],
      type: item['3. type'],
      region: item['4. region'],
      displayText: item['1. symbol']
    })) || [];
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    if (onSymbolSelect) {
      onSymbolSelect(suggestion);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
        
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
        
      default:
        break;
    }
  };

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={`search-bar ${className}`}>
      <div className="search-input-container">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="search-input"
          autoComplete="off"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-owns="search-suggestions"
          aria-activedescendant={
            selectedIndex >= 0 ? `suggestion-${selectedIndex}` : null
          }
        />
        
        {isLoading && (
          <div className="search-loading">
            <div className="spinner" />
          </div>
        )}
        
        <button
          type="button"
          className="search-button"
          disabled={disabled || !query.trim()}
          onClick={() => query.trim() && debouncedSearch(query)}
          aria-label="Search"
        >
          🔍
        </button>
      </div>
      
      {error && (
        <div className="search-error" role="alert">
          {error}
        </div>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          id="search-suggestions"
          className="search-suggestions"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.symbol}-${index}`}
              id={`suggestion-${index}`}
              className={`suggestion-item ${
                index === selectedIndex ? 'selected' : ''
              }`}
              onClick={() => handleSuggestionSelect(suggestion)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <div className="suggestion-content">
                <div className="suggestion-symbol">
                  {suggestion.displayText || suggestion.symbol}
                </div>
                <div className="suggestion-description">
                  {suggestion.description}
                </div>
                <div className="suggestion-meta">
                  {suggestion.type && (
                    <span className="suggestion-type">{suggestion.type}</span>
                  )}
                  {suggestion.region && (
                    <span className="suggestion-region">{suggestion.region}</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  onSymbolSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  apiProvider: PropTypes.oneOf(['finnhub', 'alphavantage']),
  apiKey: PropTypes.string.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default SearchBar;

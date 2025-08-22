import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', color = '#00C853' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'spinner-small';
      case 'large': return 'spinner-large';
      default: return 'spinner-medium';
    }
  };

  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner ${getSizeClass()}`} style={{ borderTopColor: color }}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

// CSS Styles
const styles = `
.loading-spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #00C853;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.spinner-medium {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

.spinner-large {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-message {
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  text-align: center;
  font-weight: 500;
}

@media (max-width: 768px) {
  .loading-spinner-container {
    padding: 1rem;
  }
  
  .loading-message {
    font-size: 0.875rem;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default LoadingSpinner;

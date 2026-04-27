import './LoadingSpinner.css';

export const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
    <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading...</p>
  </div>
);

export default LoadingSpinner;
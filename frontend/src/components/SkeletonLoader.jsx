import './SkeletonLoader.css';

export const SkeletonLoader = ({ count = 3 }) => (
  <div className="skeleton-container">
    {Array(count).fill(0).map((_, i) => (
      <div key={i} className="skeleton skeleton-row">
        <div className="skeleton-cell"></div>
        <div className="skeleton-cell" style={{ flex: 2 }}></div>
        <div className="skeleton-cell"></div>
      </div>
    ))}
  </div>
);
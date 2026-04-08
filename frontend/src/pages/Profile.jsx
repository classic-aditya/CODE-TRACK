import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProblems } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProblems()
      .then((res) => setProblems(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  // Compute stats
  const total = problems.length;
  const byPlatform = problems.reduce((acc, p) => {
    const key = p.platform || 'other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const tagCount = problems.flatMap((p) => p.tags || []).reduce((acc, t) => {
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const favTopic = topTags[0]?.[0] || '—';
  const recent = [...problems].reverse().slice(0, 5);

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase()
    : (user?.email?.[0] || 'U').toUpperCase();

  return (
    <div className="profile-wrapper">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.photoURL
            ? <img src={user.photoURL} alt="avatar" />
            : <span>{initials}</span>}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user?.displayName || 'Your Profile'}</h1>
          <p className="profile-email">{user?.email}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-text">Loading stats...</div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="stat-row">
            <div className="stat-card">
              <span className="stat-number">{total}</span>
              <span className="stat-label">Total Solved</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{byPlatform['leetcode'] || 0}</span>
              <span className="stat-label" style={{ color: '#f59e0b' }}>LeetCode</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{byPlatform['codeforces'] || 0}</span>
              <span className="stat-label" style={{ color: '#3b82f6' }}>Codeforces</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{byPlatform['geeksforgeeks'] || 0}</span>
              <span className="stat-label" style={{ color: '#22c55e' }}>GeeksforGeeks</span>
            </div>
            <div className="stat-card">
              <span className="stat-number fav">{favTopic}</span>
              <span className="stat-label">Favorite Topic</span>
            </div>
          </div>

          {/* Bottom section */}
          <div className="profile-grid">
            <div className="profile-section">
              <h2 className="section-title">Recent Problems</h2>
              {recent.length === 0 && <p className="empty-msg">No problems yet.</p>}
              <ul className="recent-list">
                {recent.map((p) => (
                  <li key={p._id} className="recent-item">
                    <span className="recent-title">{p.title}</span>
                    <span className={`badge diff-${p.difficulty}`}>{p.difficulty}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="profile-section">
              <h2 className="section-title">Top Tags</h2>
              <div className="tag-cloud">
                {topTags.length === 0 && <p className="empty-msg">No tags yet.</p>}
                {topTags.map(([tag, count]) => (
                  <span key={tag} className="tag-chip">#{tag} <strong>{count}</strong></span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;

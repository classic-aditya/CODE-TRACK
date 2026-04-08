import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteProblem } from '../services/api';
import './ProblemTable.css';

const ProblemTable = ({ problems, onDelete, showDelete = true }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [platform, setPlatform] = useState('All');

  const filtered = problems.filter((p) => {
    const s = search.toLowerCase();
    const matchSearch =
      p.title.toLowerCase().includes(s) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(s));
    const matchDiff = difficulty === 'All' || p.difficulty?.toLowerCase() === difficulty.toLowerCase();
    const matchPlat = platform === 'All' || p.platform?.toLowerCase() === platform.toLowerCase();
    return matchSearch && matchDiff && matchPlat;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this problem?')) return;
    try {
      await deleteProblem(id);
      onDelete?.(id);
    } catch {
      alert('Failed to delete problem.');
    }
  };

  return (
    <div className="problem-table-container">
      <section className="filter-bar">
        <input
          type="text"
          placeholder="Search by title or tag..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-group">
          <select className="filter-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="All">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select className="filter-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="All">All Platforms</option>
            <option value="leetcode">LeetCode</option>
            <option value="codeforces">Codeforces</option>
            <option value="geeksforgeeks">GeeksforGeeks</option>
          </select>
        </div>
      </section>

      <div className="table-responsive-wrapp">
        <table className="problems-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Problem Title</th>
              <th>Platform</th>
              <th>Difficulty</th>
              <th>Tags</th>
              {showDelete && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <tr key={p._id}>
                  <td>✅</td>
                  <td className="problem-title">
                    <span onClick={() => navigate(`/problem/${p._id}`)}>
                      {p.title}
                    </span>
                  </td>
                  <td>
                    <span className={`badge platform-${(p.platform || '').toLowerCase()}`}>
                      {p.platform}
                    </span>
                  </td>
                  <td>
                    <span className={`badge diff-${(p.difficulty || '').toLowerCase()}`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td>
                    <div className="tag-list">
                      {(p.tags || []).map((tag, i) => (
                        <span key={i} className="tag-item">#{tag}</span>
                      ))}
                    </div>
                  </td>
                  {showDelete && (
                    <td>
                      <div className="action-group">
                        <button className="btn-edit" onClick={() => navigate(`/add-problem?edit=${p._id}`)}>✏️</button>
                        <button className="btn-delete" onClick={() => handleDelete(p._id)}>🗑️</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <div className="empty-state-container">
                    <p>No problems found.</p>
                    <button className="reset-btn" onClick={() => { setSearch(''); setDifficulty('All'); setPlatform('All'); }}>
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemTable;

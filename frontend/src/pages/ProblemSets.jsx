import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createProblemSet, getProblemSets, deleteProblemSet } from '../services/api';
import './ProblemSets.css';

const ProblemSets = () => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getProblemSets()
      .then((res) => setSets(res.data.data))
      .catch(() => alert('Failed to load problem sets.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      const res = await createProblemSet(form);
      setSets([...sets, res.data.data]);
      setForm({ name: '', description: '' });
      setShowModal(false);
    } catch {
      alert('Failed to create problem set.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this problem set?')) return;
    try {
      await deleteProblemSet(id);
      setSets(sets.filter((s) => s._id !== id));
    } catch {
      alert('Failed to delete.');
    }
  };

  return (
    <div className="problem-sets-wrapper">
      <header className="page-header">
        <div>
          <h1 className="page-title">Problem Sets</h1>
          <p className="page-subtitle">Organize your practice by topic or goal</p>
        </div>
        <button className="add-new-btn" onClick={() => setShowModal(true)}>
          + Create New Set
        </button>
      </header>

      {loading ? (
        <div className="loading-text">Loading sets...</div>
      ) : (
        <div className="sets-grid">
          {sets.length === 0 && (
            <p style={{ color: '#6b7280' }}>No problem sets yet. Create one!</p>
          )}
          {sets.map((set) => (
            <div className="set-card" key={set._id}>
              <div className="set-card-header">
                <h3 className="set-title">{set.name}</h3>
                <button
                  className="set-delete-btn"
                  onClick={() => handleDelete(set._id)}
                  title="Delete set"
                >X</button>
              </div>
              <p className="set-desc">{set.description || 'No description.'}</p>
              <p className="set-count">{(set.problems || []).length} Problems</p>
              <Link to={`/problem-sets/${set._id}`}>
                <button className="view-set-btn">View Problems</button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Create Problem Set</h2>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                className="modal-input"
                placeholder="Set name (e.g. Interview Questions)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                autoFocus
              />
              <input
                type="text"
                className="modal-input"
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="modal-submit" disabled={creating}>
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemSets;

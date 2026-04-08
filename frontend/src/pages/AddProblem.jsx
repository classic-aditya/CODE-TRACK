import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createProblem, updateProblem, getProblems } from '../services/api';
import './AddProblem.css';

const blank = {
  title: '', platform: 'leetcode', difficulty: 'medium',
  problemLink: '', tags: [], approach: '', timeComplexity: '', spaceComplexity: '',
};

const AddProblem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(blank);
  const [tagInput, setTagInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('edit');
    if (!id) return;
    setIsEditing(true);
    setEditId(id);
    getProblems().then((res) => {
      const p = res.data.data.find((x) => x._id === id);
      if (p) setForm({ ...blank, ...p });
    });
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await updateProblem(editId, form);
      } else {
        await createProblem(form);
      }
      navigate('/all-problems');
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] });
    }
    setTagInput('');
  };

  const removeTag = (tag) => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });

  return (
    <div className="form-page-wrapper">
      <header className="form-header">
        <h1 className="header-title">{isEditing ? 'Edit Problem' : 'Add New Problem'}</h1>
      </header>

      <form className="form-container" onSubmit={handleSubmit}>
        <section className="input-group">
          <label className="input-label">Title</label>
          <input
            type="text"
            className="text-input"
            placeholder="Enter problem title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </section>

        <section className="input-group">
          <label className="input-label">Platform</label>
          <div className="toggle-group">
            {['leetcode', 'codeforces', 'geeksforgeeks'].map((p) => (
              <button
                key={p}
                type="button"
                className={`toggle-btn ${form.platform === p ? 'active' : ''}`}
                onClick={() => setForm({ ...form, platform: p })}
              >
                {p === 'leetcode' ? 'LeetCode' : p === 'codeforces' ? 'Codeforces' : 'GeeksforGeeks'}
              </button>
            ))}
          </div>
        </section>

        <section className="input-group">
          <label className="input-label">Difficulty</label>
          <div className="toggle-group">
            {['easy', 'medium', 'hard'].map((d) => (
              <button
                key={d}
                type="button"
                className={`toggle-btn btn-${d} ${form.difficulty === d ? 'active' : ''}`}
                onClick={() => setForm({ ...form, difficulty: d })}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </section>

        <section className="input-group">
          <label className="input-label">Problem Link</label>
          <input
            type="url"
            className="text-input"
            placeholder="https://..."
            value={form.problemLink}
            onChange={(e) => setForm({ ...form, problemLink: e.target.value })}
          />
        </section>

        <section className="input-group">
          <label className="input-label">Tags</label>
          <div className="tag-input-row">
            <input
              type="text"
              className="text-input"
              placeholder="e.g. Array, DP, Graph"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            />
            <button type="button" className="tag-add-btn" onClick={addTag}>Add</button>
          </div>
          <div className="toggle-group" style={{ marginTop: '8px' }}>
            {form.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className="toggle-btn active-tag"
                onClick={() => removeTag(tag)}
              >
                {tag} ✕
              </button>
            ))}
          </div>
        </section>

        <section className="input-group">
          <label className="input-label">Approach</label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g. Two Pointer / DP"
            value={form.approach}
            onChange={(e) => setForm({ ...form, approach: e.target.value })}
          />
        </section>

        <section className="input-group">
          <label className="input-label">Time Complexity</label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g. O(n log n)"
            value={form.timeComplexity}
            onChange={(e) => setForm({ ...form, timeComplexity: e.target.value })}
          />
        </section>

        <section className="input-group">
          <label className="input-label">Space Complexity</label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g. O(1)"
            value={form.spaceComplexity}
            onChange={(e) => setForm({ ...form, spaceComplexity: e.target.value })}
          />
        </section>

        <footer className="form-footer">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Problem' : 'Save Problem'}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default AddProblem;

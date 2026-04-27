import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createProblem, updateProblem, getProblemById } from '../services/api';
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
    const id = new URLSearchParams(location.search).get('edit');
    if (!id) return;
    setIsEditing(true);
    setEditId(id);
    getProblemById(id)
      .then((res) => setForm({ ...blank, ...(res.data?.data || res.data) }))
      .catch((err) => console.error(err));
  }, [location.search]);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

 const validateForm = () => {
  if (!form.title.trim()) {
    alert('Please enter a problem title');
    return false;
  }
  
  
  if (form.problemLink.trim()) {
    try {
      new URL(form.problemLink);
    } catch {
      alert('Please enter a valid URL for problem link');
      return false;
    }
  }
  if (form.tags.length === 0) {
    alert('Please add at least one tag');
    return false;
  }
  
  return true;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setLoading(true);
  try {
    isEditing ? await updateProblem(editId, form) : await createProblem(form);
    navigate('/all-problems');
  } catch (err) {
    alert(err.response?.data?.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};
  const handleTags = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const t = tagInput.trim();
      if (t && !form.tags.includes(t)) setForm({ ...form, tags: [...form.tags, t] });
      setTagInput('');
    }
  };
  const removeTag = (tag) => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });

  const renderInput = (label, name, placeholder, type = "text") => (
    <section className="input-group">
      <label className="input-label">{label}</label>
      <input type={type} name={name} className="text-input" placeholder={placeholder} value={form[name]} onChange={handleChange} required={name === 'title'} />
    </section>
  );

  const renderToggles = (label, name, options) => (
    <section className="input-group">
      <label className="input-label">{label}</label>
      <div className="toggle-group">
        {options.map((opt) => (
          <button key={opt.value} type="button" 
            className={`toggle-btn ${name === 'difficulty' ? `btn-${opt.value}` : ''} ${form[name] === opt.value ? 'active' : ''}`}
            onClick={() => setForm({ ...form, [name]: opt.value })}>
            {opt.label}
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <div className="form-page-wrapper">
      <header className="form-header">
        <h1 className="header-title">{isEditing ? 'Edit Problem' : 'Add New Problem'}</h1>
      </header>

      <form className="form-container" onSubmit={handleSubmit}>
        
       
        {renderInput('Title', 'title', 'Enter problem title')}
        
        {renderToggles('Platform', 'platform', [
          { label: 'LeetCode', value: 'leetcode' },
          { label: 'Codeforces', value: 'codeforces' },
          { label: 'GeeksforGeeks', value: 'geeksforgeeks' }
        ])}

        {renderToggles('Difficulty', 'difficulty', [
          { label: 'Easy', value: 'easy' },
          { label: 'Medium', value: 'medium' },
          { label: 'Hard', value: 'hard' }
        ])}

        {renderInput('Problem Link', 'problemLink', 'https://...', 'url')}
        <section className="input-group">
          <label className="input-label">Tags</label>
          <div className="tag-input-row">
            <input type="text" className="text-input" placeholder="e.g. Array, DP (Press Enter)" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTags} />
          </div>
          <div className="toggle-group" style={{ marginTop: '8px' }}>
            {form.tags.map((tag) => (
              <button key={tag} type="button" className="toggle-btn active-tag" onClick={() => removeTag(tag)}>{tag} ✕</button>
            ))}
          </div>
        </section>
        {renderInput('Approach', 'approach', 'e.g. Two Pointer / DP')}
        {renderInput('Time Complexity', 'timeComplexity', 'e.g. O(n log n)')}
        {renderInput('Space Complexity', 'spaceComplexity', 'e.g. O(1)')}

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
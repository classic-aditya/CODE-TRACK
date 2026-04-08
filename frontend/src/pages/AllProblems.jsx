import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemTable from '../components/ProblemTable';
import { getProblems } from '../services/api';
import './AllProblems.css';

const AllProblems = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProblems = async () => {
    try {
      const res = await getProblems();
      setProblems(res.data.data);
    } catch {
      alert('Failed to load problems.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProblems(); }, []);

  const handleDelete = (id) => setProblems((prev) => prev.filter((p) => p._id !== id));

  return (
    <div className="all-problems-wrapper">
      <header className="page-header">
        <div className="header-left">
          <h1 className="page-title">Problem Library</h1>
          <p className="page-subtitle">Manage and track your DSA progress</p>
        </div>
        <button className="add-new-btn" onClick={() => navigate('/add-problem')}>
          + Add Problem
        </button>
      </header>
      {loading ? (
        <div className="loading-text">Loading problems...</div>
      ) : (
        <ProblemTable problems={problems} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default AllProblems;

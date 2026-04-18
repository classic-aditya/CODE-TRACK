import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProblemById } from '../services/api';
import './ProblemDetail.css';

const PLATFORM_NAMES = {
  leetcode: 'LeetCode',
  codeforces: 'Codeforces',
  geeksforgeeks: 'GeeksforGeeks',
};

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProblemById(id)
      .then((res) => setProblem(res.data?.data || res.data))
      .catch(() => { 
        alert('Problem not found.'); 
        navigate('/all-problems'); 
      })
      .finally(() => setLoading(false));
  }, [id, navigate]); 

  if (loading) return <div className="loading-text">Loading problem details...</div>;
  if (!problem) return null;

  const platformName = PLATFORM_NAMES[problem.platform] || problem.platform;

  return (
    <div className="detail-wrapper">
      <div className="detail-header">
        <h1 className="detail-title">{problem.title}</h1>
        <button className="detail-edit-btn" onClick={() => navigate(`/add-problem?edit=${problem._id}`)}>
          ✏️ Edit Details
        </button>
      </div>
      <div className="detail-card">
        <div className="detail-row">
          <span className="detail-key">Platform</span>
          <span className={`detail-platform platform-${(problem.platform || '').toLowerCase()}`}>
            {platformName}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-key">Difficulty</span>
          <span className={`badge diff-${(problem.difficulty || '').toLowerCase()}`}>
            {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-key">Tags</span>
          <div className="detail-tags">
            {(problem.tags || []).length > 0
              ? problem.tags.map((t) => <span key={t} className="detail-tag">{t}</span>)
              : <span className="detail-empty">No tags</span>
            }
          </div>
        </div>
      </div>
      {(problem.approach || problem.timeComplexity || problem.spaceComplexity) && (
        <div className="detail-section">
          <h2 className="detail-section-title">My Approach</h2>
          {problem.approach && <p className="detail-approach">{problem.approach}</p>}
          
          {(problem.timeComplexity || problem.spaceComplexity) && (
            <div className="complexity-row">
              <div className="complexity-card">
                <span className="complexity-label">Time Complexity</span>
                <span className="complexity-val">{problem.timeComplexity || '—'}</span>
              </div>
              <div className="complexity-card">
                <span className="complexity-label">Space Complexity</span>
                <span className="complexity-val">{problem.spaceComplexity || '—'}</span>
              </div>
            </div>
          )}
        </div>
      )}
      {problem.problemLink && (
        <a href={problem.problemLink} target="_blank" rel="noreferrer" className="detail-link-btn">
          View Problem on {platformName} ↗
        </a>
      )}
    </div>
  );
};

export default ProblemDetail;
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { deleteProblem } from '../services/api'
import './ProblemTable.css'

function ProblemTable({ problems, onDelete, showDelete }) {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [platform, setPlatform] = useState('All')

  if (showDelete === undefined) {
    showDelete = true
  }

  const filtered = problems.filter(function(p) {
    const s = search.toLowerCase()

    const titleMatch = p.title.toLowerCase().includes(s)
    const tagMatch = (p.tags || []).some(function(t) {
      return t.toLowerCase().includes(s)
    })
    const matchSearch = titleMatch || tagMatch

    const matchDiff = difficulty === 'All' || (p.difficulty || '').toLowerCase() === difficulty.toLowerCase()
    const matchPlat = platform === 'All' || (p.platform || '').toLowerCase() === platform.toLowerCase()

    return matchSearch && matchDiff && matchPlat
  })

  async function handleDelete(id) {
    if (!window.confirm('Delete this problem?')) return
    try {
      await deleteProblem(id)
      if (onDelete) onDelete(id)
    } catch (err) {
      alert('Failed to delete problem.')
    }
  }

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
          <select
            className="filter-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="All">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="filter-select"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
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
              filtered.map(function(p) {
                const { _id, title, platform, difficulty, tags } = p
                return (
                  <tr key={_id}>
                    <td>✅</td>
                    <td className="problem-title">
                      <Link to={'/problem/' + _id}>{title}</Link>
                    </td>
                    <td>
                      <span className={'badge platform-' + (platform || '').toLowerCase()}>
                        {platform}
                      </span>
                    </td>
                    <td>
                      <span className={'badge diff-' + (difficulty || '').toLowerCase()}>
                        {difficulty}
                      </span>
                    </td>
                    <td>
                      <div className="tag-list">
                        {(tags || []).map(function(tag, i) {
                          return <span key={i} className="tag-item">#{tag}</span>
                        })}
                      </div>
                    </td>
                    {showDelete && (
                      <td>
                        <div className="action-group">
                          <button
                            className="btn-edit"
                            onClick={() => navigate('/add-problem?edit=' + _id)}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(_id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="6">
                  <div className="empty-state-container">
                    <p>No problems found.</p>
                    <button
                      className="reset-btn"
                      onClick={() => {
                        setSearch('')
                        setDifficulty('All')
                        setPlatform('All')
                      }}
                    >
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
  )
}

export default ProblemTable

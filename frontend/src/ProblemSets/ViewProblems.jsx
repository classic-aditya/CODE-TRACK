import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProblemSetById, getProblems, addProblemToSet, removeProblemFromSet } from '../services/api'
import ProblemTable from '../components/ProblemTable'
import './ViewProblems.css'

function ViewProblems() {
  const { setId } = useParams()
  const navigate = useNavigate()

  const [set, setSet] = useState(null)
  const [allProblems, setAllProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [adding, setAdding] = useState(false)

  async function fetchSet() {
    try {
      const res = await getProblemSetById(setId)
      setSet(res.data.data)
    } catch (err) {
      alert('Failed to load problem set.')
      navigate('/problem-sets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSet()
    getProblems().then(function(res) {
      setAllProblems(res.data.data)
    })
  }, [setId])

  async function handleAdd(problemId) {
    setAdding(true)
    try {
      await addProblemToSet(setId, problemId)
      await fetchSet()
      setSearchQuery('')
    } catch (err) {
      alert('Failed to add problem to set.')
    }
    setAdding(false)
  }

  async function handleRemove(problemId) {
    if (!window.confirm('Remove this problem from the set?')) return
    try {
      await removeProblemFromSet(setId, problemId)
      setSet(function(prev) {
        return {
          ...prev,
          problems: prev.problems.filter(function(p) { return p._id !== problemId })
        }
      })
    } catch (err) {
      alert('Failed to remove problem.')
    }
  }

  const setProblemsIds = new Set((set?.problems || []).map(function(p) { return p._id }))
  const available = allProblems.filter(function(p) { return !setProblemsIds.has(p._id) })

  const searchFiltered = searchQuery.trim()
    ? available.filter(function(p) {
        const q = searchQuery.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          (p.tags || []).some(function(t) { return t.toLowerCase().includes(q) }) ||
          (p.platform || '').toLowerCase().includes(q) ||
          (p.difficulty || '').toLowerCase().includes(q)
        )
      })
    : available

  if (loading) {
    return <div className="loading-text">Loading...</div>
  }

  return (
    <div className="view-problems-wrapper">
      <header className="view-header">
        <div className="title-stack">
          <h1 className="view-title">{set?.name?.toUpperCase()}</h1>
          <p className="view-subtitle">{(set?.problems || []).length} problems in this set</p>
        </div>
        <button className="action-add-btn" onClick={() => setShowAddModal(true)}>
          + Add Problems
        </button>
      </header>

      <ProblemTable
        problems={set?.problems || []}
        onDelete={handleRemove}
        showDelete={true}
      />

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card modal-wide" onClick={function(e) { e.stopPropagation() }}>
            <div className="modal-header">
              <h2 className="modal-title">Add Problem to Set</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>x</button>
            </div>

            <input
              type="text"
              className="modal-search"
              placeholder="Search by title, tag, platform, difficulty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />

            <div className="modal-results">
              {available.length === 0 ? (
                <p className="modal-empty">All your problems are already in this set.</p>
              ) : searchFiltered.length === 0 ? (
                <p className="modal-empty">No problems match "{searchQuery}"</p>
              ) : (
                searchFiltered.map(function(p) {
                  return (
                    <div key={p._id} className="modal-problem-row">
                      <div className="modal-problem-info">
                        <span className="modal-problem-title">{p.title}</span>
                        <div className="modal-problem-meta">
                          <span className={'badge platform-' + p.platform}>{p.platform}</span>
                          <span className={'badge diff-' + p.difficulty}>{p.difficulty}</span>
                          {(p.tags || []).slice(0, 3).map(function(t) {
                            return <span key={t} className="modal-tag">#{t}</span>
                          })}
                        </div>
                      </div>
                      <button
                        className="modal-add-btn"
                        disabled={adding}
                        onClick={() => handleAdd(p._id)}
                      >
                        + Add
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewProblems

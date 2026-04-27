import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createProblemSet, getProblemSets, deleteProblemSet } from '../services/api'
import './ProblemSets.css'

function ProblemSets() {
  const [sets, setSets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newSetName, setNewSetName] = useState('')
  const [newSetDesc, setNewSetDesc] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    getProblemSets().then(function(res) {
      setSets(res.data.data)
    }).catch(function() {
      alert('Failed to load problem sets.')
    }).finally(function() {
      setLoading(false)
    })
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!newSetName.trim()) return

    setCreating(true)
    try {
      const res = await createProblemSet({ name: newSetName, description: newSetDesc })
      setSets([...sets, res.data.data])
      setNewSetName('')
      setNewSetDesc('')
      setShowModal(false)
    } catch (err) {
      alert('Failed to create problem set.')
    }
    setCreating(false)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this problem set?')) return
    try {
      await deleteProblemSet(id)
      setSets(sets.filter(function(s) { return s._id !== id }))
    } catch (err) {
      alert('Failed to delete.')
    }
  }

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
          {sets.map(function(set) {
            return (
              <div className="set-card" key={set._id}>
                <div className="set-card-header">
                  <h3 className="set-title">{set.name}</h3>
                  <button
                    className="set-delete-btn"
                    onClick={() => handleDelete(set._id)}
                    title="Delete set"
                  >
                    X
                  </button>
                </div>
                <p className="set-desc">{set.description || 'No description.'}</p>
                <p className="set-count">{(set.problems || []).length} Problems</p>
                <Link to={'/problem-sets/' + set._id}>
                  <button className="view-set-btn">View Problems</button>
                </Link>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={function(e) { e.stopPropagation() }}>
            <h2 className="modal-title">Create Problem Set</h2>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                className="modal-input"
                placeholder="Set name (e.g. Interview Questions)"
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                required
                autoFocus
              />
              <input
                type="text"
                className="modal-input"
                placeholder="Description (optional)"
                value={newSetDesc}
                onChange={(e) => setNewSetDesc(e.target.value)}
              />
              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-submit" disabled={creating}>
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProblemSets

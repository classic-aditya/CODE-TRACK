import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProblemTable from '../components/ProblemTable'
import { getProblems } from '../services/api'
import './AllProblems.css'

function AllProblems() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchProblems() {
    try {
      const res = await getProblems()
      const data = res.data?.data || res.data || []
      setProblems(data)
    } catch (err) {
      alert('Failed to load problems.')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProblems()
  }, [])

  function handleDelete(id) {
    setProblems(function(prev) {
      return prev.filter(function(p) { return p._id !== id })
    })
  }

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
  )
}

export default AllProblems

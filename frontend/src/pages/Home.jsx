import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, Grid, PlusCircle, User } from 'lucide-react'
import { getProblems } from '../services/api'
import { getProblemSets } from '../services/api'
import { useAuth } from '../context/AuthContext'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [totalProblems, setTotalProblems] = useState(0)
  const [totalSets, setTotalSets] = useState(0)

  useEffect(() => {
    getProblems().then(function(res) {
      setTotalProblems(res.data.data.length)
    }).catch(function() {})

    getProblemSets().then(function(res) {
      setTotalSets(res.data.data.length)
    }).catch(function() {})
  }, [])

  const firstName = user?.displayName ? user.displayName.split(' ')[0] : ''

  return (
    <div className="home-wrapper">
      <div className="home-hero">
        <h1>Welcome{firstName ? ', ' + firstName : ''}!</h1>
      </div>

      <div className="home-grid">
        <div className="home-card" onClick={() => navigate('/all-problems')}>
          <div className="home-card-icon">
            <List size={24} />
          </div>
          <div className="home-card-info">
            <span className="home-card-label">All Problems</span>
            <span className="home-card-count">{totalProblems}</span>
          </div>
        </div>

        <div className="home-card accent" onClick={() => navigate('/problem-sets')}>
          <div className="home-card-icon accent">
            <Grid size={24} />
          </div>
          <div className="home-card-info">
            <span className="home-card-label">Problem Sets</span>
            <span className="home-card-count">+{totalSets}</span>
          </div>
        </div>

        <div className="home-card" onClick={() => navigate('/add-problem')}>
          <div className="home-card-icon">
            <PlusCircle size={24} />
          </div>
          <div className="home-card-info">
            <span className="home-card-label">Add Problem</span>
          </div>
        </div>

        <div className="home-card" onClick={() => navigate('/profile')}>
          <div className="home-card-icon">
            <User size={24} />
          </div>
          <div className="home-card-info">
            <span className="home-card-label">Profile</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

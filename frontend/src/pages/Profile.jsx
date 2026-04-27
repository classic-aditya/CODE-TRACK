import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getProblems } from '../services/api'
import './Profile.css'

function Profile() {
  const { user } = useAuth()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProblems().then(function(res) {
      setProblems(res.data.data)
    }).finally(function() {
      setLoading(false)
    })
  }, [])

  const total = problems.length

  const byPlatform = {}
  for (let i = 0; i < problems.length; i++) {
    const key = problems[i].platform || 'other'
    if (!byPlatform[key]) {
      byPlatform[key] = 0
    }
    byPlatform[key]++
  }

  const tagCount = {}
  for (let i = 0; i < problems.length; i++) {
    const tags = problems[i].tags || []
    for (let j = 0; j < tags.length; j++) {
      if (!tagCount[tags[j]]) {
        tagCount[tags[j]] = 0
      }
      tagCount[tags[j]]++
    }
  }

  const topTags = Object.entries(tagCount).sort(function(a, b) {
    return b[1] - a[1]
  }).slice(0, 5)

  const favTopic = topTags[0] ? topTags[0][0] : '—'

  const recent = problems.slice().reverse().slice(0, 5)

  let initials = 'U'
  if (user?.displayName) {
    initials = user.displayName.split(' ').map(function(n) { return n[0] }).join('').toUpperCase()
  } else if (user?.email) {
    initials = user.email[0].toUpperCase()
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.photoURL
            ? <img src={user.photoURL} alt="avatar" />
            : <span>{initials}</span>
          }
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user?.displayName || 'Your Profile'}</h1>
          <p className="profile-email">{user?.email}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-text">Loading stats...</div>
      ) : (
        <>
          <div className="stat-row">
            <div className="stat-card">
              <span className="stat-number">{total}</span>
              <span className="stat-label">Total Solved</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{byPlatform['leetcode'] || 0}</span>
              <span className="stat-label" style={{ color: '#f59e0b' }}>LeetCode</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{byPlatform['codeforces'] || 0}</span>
              <span className="stat-label" style={{ color: '#3b82f6' }}>Codeforces</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{byPlatform['geeksforgeeks'] || 0}</span>
              <span className="stat-label" style={{ color: '#22c55e' }}>GeeksforGeeks</span>
            </div>
            <div className="stat-card">
              <span className="stat-number fav">{favTopic}</span>
              <span className="stat-label">Favourite Topic</span>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-section">
              <h2 className="section-title">Recent Problems</h2>
              {recent.length === 0 && <p className="empty-msg">No problems yet.</p>}
              <ul className="recent-list">
                {recent.map(function(p) {
                  return (
                    <li key={p._id} className="recent-item">
                      <span className="recent-title">{p.title}</span>
                      <span className={'badge diff-' + p.difficulty}>{p.difficulty}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="profile-section">
              <h2 className="section-title">Top Tags</h2>
              <div className="tag-cloud">
                {topTags.length === 0 && <p className="empty-msg">No tags yet.</p>}
                {topTags.map(function([tag, count]) {
                  return (
                    <span key={tag} className="tag-chip">#{tag} <strong>{count}</strong></span>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Profile

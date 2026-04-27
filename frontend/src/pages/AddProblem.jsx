import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createProblem, updateProblem, getProblemById } from '../services/api'
import './AddProblem.css'

const defaultForm = {
  title: '',
  platform: 'leetcode',
  difficulty: 'medium',
  problemLink: '',
  tags: [],
  approach: '',
  timeComplexity: '',
  spaceComplexity: '',
}

function AddProblem() {
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState(defaultForm)
  const [tagInput, setTagInput] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const id = params.get('edit')
    if (!id) return

    setIsEditing(true)
    setEditId(id)

    getProblemById(id).then(function(res) {
      const data = res.data?.data || res.data
      setForm({ ...defaultForm, ...data })
    }).catch(function(err) {
      console.error(err)
    })
  }, [location.search])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validateForm() {
    if (!form.title.trim()) {
      alert('Please enter a problem title')
      return false
    }
    if (form.problemLink.trim()) {
      try {
        new URL(form.problemLink)
      } catch {
        alert('Please enter a valid URL for problem link')
        return false
      }
    }
    if (form.tags.length === 0) {
      alert('Please add atleast one tag')
      return false
    }
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      if (isEditing) {
        await updateProblem(editId, form)
      } else {
        await createProblem(form)
      }
      navigate('/all-problems')
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  function handleTagKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const tag = tagInput.trim()
      if (tag && !form.tags.includes(tag)) {
        setForm({ ...form, tags: [...form.tags, tag] })
      }
      setTagInput('')
    }
  }

  function removeTag(tag) {
    setForm({ ...form, tags: form.tags.filter(function(t) { return t !== tag }) })
  }

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
            name="title"
            className="text-input"
            placeholder="Enter problem title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </section>

        <section className="input-group">
          <label className="input-label">Platform</label>
          <div className="toggle-group">
            <button
              type="button"
              className={form.platform === 'leetcode' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => setForm({ ...form, platform: 'leetcode' })}
            >
              LeetCode
            </button>
            <button
              type="button"
              className={form.platform === 'codeforces' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => setForm({ ...form, platform: 'codeforces' })}
            >
              Codeforces
            </button>
            <button
              type="button"
              className={form.platform === 'geeksforgeeks' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => setForm({ ...form, platform: 'geeksforgeeks' })}
            >
              GeeksforGeeks
            </button>
          </div>
        </section>

        <section className="input-group">
          <label className="input-label">Difficulty</label>
          <div className="toggle-group">
            <button
              type="button"
              className={form.difficulty === 'easy' ? 'toggle-btn btn-easy active' : 'toggle-btn btn-easy'}
              onClick={() => setForm({ ...form, difficulty: 'easy' })}
            >
              Easy
            </button>
            <button
              type="button"
              className={form.difficulty === 'medium' ? 'toggle-btn btn-medium active' : 'toggle-btn btn-medium'}
              onClick={() => setForm({ ...form, difficulty: 'medium' })}
            >
              Medium
            </button>
            <button
              type="button"
              className={form.difficulty === 'hard' ? 'toggle-btn btn-hard active' : 'toggle-btn btn-hard'}
              onClick={() => setForm({ ...form, difficulty: 'hard' })}
            >
              Hard
            </button>
          </div>
        </section>

        <section className="input-group">
          <label className="input-label">Problem Link</label>
          <input
            type="url"
            name="problemLink"
            className="text-input"
            placeholder="https://..."
            value={form.problemLink}
            onChange={handleChange}
          />
        </section>

        <section className="input-group">
          <label className="input-label">Tags</label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g. Array, DP (Press Enter)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
          <div className="toggle-group" style={{ marginTop: '8px' }}>
            {form.tags.map(function(tag) {
              return (
                <button
                  key={tag}
                  type="button"
                  className="toggle-btn active-tag"
                  onClick={() => removeTag(tag)}
                >
                  {tag} x
                </button>
              )
            })}
          </div>
        </section>

        <section className="input-group">
          <label className="input-label">Approach</label>
          <input
            type="text"
            name="approach"
            className="text-input"
            placeholder="e.g. Two Pointer / DP"
            value={form.approach}
            onChange={handleChange}
          />
        </section>

        <section className="input-group">
          <label className="input-label">Time Complexity</label>
          <input
            type="text"
            name="timeComplexity"
            className="text-input"
            placeholder="e.g. O(n log n)"
            value={form.timeComplexity}
            onChange={handleChange}
          />
        </section>

        <section className="input-group">
          <label className="input-label">Space Complexity</label>
          <input
            type="text"
            name="spaceComplexity"
            className="text-input"
            placeholder="e.g. O(1)"
            value={form.spaceComplexity}
            onChange={handleChange}
          />
        </section>

        <footer className="form-footer">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Problem' : 'Save Problem'}
          </button>
        </footer>

      </form>
    </div>
  )
}

export default AddProblem

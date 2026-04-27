import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, List, LayoutGrid, PlusSquare, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/Code_Tracker.jpeg'
import './Sidebar.css'

function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Code Track Logo" className="logo-img" />
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <Home size={20} />
          Home
        </NavLink>

        <NavLink
          to="/all-problems"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <List size={20} />
          All Problems
        </NavLink>

        <NavLink
          to="/problem-sets"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <LayoutGrid size={20} />
          Problem Sets
        </NavLink>

        <NavLink
          to="/add-problem"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <PlusSquare size={20} />
          Add Problem
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <User size={20} />
          Profile
        </NavLink>
      </nav>

      <button
        className="logout-btn"
        onClick={handleLogout}
        style={{ marginTop: 'auto' }}
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  )
}

export default Sidebar

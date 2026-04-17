import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, List, LayoutGrid, PlusSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Code_Tracker.jpeg';
import './Sidebar.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      
      <div className="logo-container" >
        <img className="logo-img" src={logo} alt="Code Track Logo" />
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <Home size={20} /> Home
        </NavLink>
        
        <NavLink to="/all-problems" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <List size={20} /> All Problems
        </NavLink>
        
        <NavLink to="/problem-sets" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutGrid size={20} /> Problem Sets
        </NavLink>
        
        <NavLink to="/add-problem" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <PlusSquare size={20} /> Add Problem
        </NavLink>
        
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={20} /> Profile
        </NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout} style={{ marginTop: 'auto' }}>
        <LogOut size={20} /> Logout
      </button>
      
    </div>
  );
};

export default Sidebar;
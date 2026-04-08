import { NavLink, useNavigate } from 'react-router-dom';
import { Home, List, Grid, PlusCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/all-problems', label: 'All Problems', icon: List },
    { to: '/problem-sets', label: 'Problem Sets', icon: Grid },
    { to: '/add-problem', label: 'Add Problem', icon: PlusCircle },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-logo">CT</span>
        <span className="brand-name">CodeTrack</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="sidebar-user">
            <div className="user-avatar">
              {user.photoURL
                ? <img src={user.photoURL} alt="avatar" />
                : <span>{(user.displayName || user.email || 'U')[0].toUpperCase()}</span>
              }
            </div>
            <span className="user-name">{user.displayName || user.email}</span>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

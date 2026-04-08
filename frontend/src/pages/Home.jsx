import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Grid, PlusCircle, User } from 'lucide-react';
import { getProblems } from '../services/api';
import { getProblemSets } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ problems: 0, sets: 0 });

  useEffect(() => {
    Promise.all([getProblems(), getProblemSets()])
      .then(([pRes, sRes]) => {
        setStats({ problems: pRes.data.data.length, sets: sRes.data.data.length });
      })
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'All Problems', count: stats.problems, icon: List, path: '/all-problems', accent: false },
    { label: 'Problem Sets', count: `+${stats.sets}`, icon: Grid, path: '/problem-sets', accent: true },
    { label: 'Add Problem', icon: PlusCircle, path: '/add-problem', accent: false },
    { label: 'Profile', icon: User, path: '/profile', accent: false },
  ];

  return (
    <div className="home-wrapper">
      <div className="home-hero">
        <h1>Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}! </h1>
        <p>Keep pushing — consistency beats intensity.</p>
      </div>

      <div className="home-grid">
        {cards.map(({ label, count, icon: Icon, path, accent }) => (
          <div
            key={label}
            className={`home-card ${accent ? 'accent' : ''}`}
            onClick={() => navigate(path)}
          >
            <div className={`home-card-icon ${accent ? 'accent' : ''}`}>
              <Icon size={24} />
            </div>
            <div className="home-card-info">
              <span className="home-card-label">{label}</span>
              {count !== undefined && <span className="home-card-count">{count}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

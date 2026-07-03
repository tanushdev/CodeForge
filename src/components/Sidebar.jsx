import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/lessons', label: 'Lessons' },
  { to: '/labs', label: 'Labs' },
  { to: '/algorithms', label: 'Algorithms' },
  { to: '/system-design', label: 'System Design' },
  { to: '/review', label: 'Review' },
  { to: '/resources', label: 'Resources' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">C</div>
        <div>
          <h1>CodeForge</h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--muted)', margin: 0, lineHeight: 1.2 }}>Made By Tanush</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Menu</span>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-email">{user.email}</div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}

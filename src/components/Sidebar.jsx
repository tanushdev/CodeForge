import { useState } from 'react';
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
  { to: '/playground', label: 'Visualizer' },
  { to: '/resources', label: 'Resources' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const close = () => setOpen(false);

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
        <span className={`sidebar-toggle-line${open ? ' open' : ''}`} />
      </button>
      {open && <div className="sidebar-overlay" onClick={close} />}
      <aside className={`sidebar${open ? ' open' : ''}`}>
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
              onClick={close}
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
    </>
  );
}

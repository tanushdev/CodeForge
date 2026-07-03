import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: 'D' },
  { to: '/roadmap', label: 'Roadmap', icon: 'R' },
  { to: '/learn', label: 'Learn', icon: 'L' },
  { to: '/labs', label: 'Labs', icon: 'B' },
  { to: '/algorithms', label: 'Algorithms', icon: 'A' },
  { to: '/system-design', label: 'System Design', icon: 'S' },
  { to: '/review', label: 'Review', icon: 'V' },
  { to: '/resources', label: 'Resources', icon: 'F' },
];

const bottomLinks = [
  { to: '/dashboard', label: 'Home', icon: 'H' },
  { to: '/learn', label: 'Learn', icon: 'L' },
  { to: '/roadmap', label: 'Roadmap', icon: 'R' },
  { to: '/labs', label: 'Labs', icon: 'B' },
  { to: '/algorithms', label: 'Code', icon: 'C' },
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
              <span className="sidebar-link-icon">{link.icon}</span>
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

      <nav className="bottom-bar">
        {bottomLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `bottom-link${isActive ? ' active' : ''}`}
          >
            <span className="bottom-link-icon">{link.icon}</span>
            <span className="bottom-link-label">{link.label}</span>
          </NavLink>
        ))}
        <button className="bottom-link bottom-menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
          <span className="bottom-link-icon">M</span>
          <span className="bottom-link-label">Menu</span>
        </button>
      </nav>
    </>
  );
}

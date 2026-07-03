import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: 'var(--primary)',
          color: 'var(--on-primary)', fontSize: '1.4rem', fontWeight: 800,
          display: 'grid', placeItems: 'center', margin: '0 auto 20px'
        }}>
          D
        </div>
        <h1>CodeForge</h1>
        <p style={{ marginBottom: 8 }}>Made By Tanush</p>
        <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 28, lineHeight: 1.5 }}>
          Levels, theory, dry runs, handwritten notes, algorithm code, and solve-to-unlock missions.
          Track your progress across all devices.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 280, margin: '0 auto' }}>
          <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex' }}>
            Sign In
          </Link>
          <Link to="/signup" className="btn" style={{ textDecoration: 'none', display: 'flex' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

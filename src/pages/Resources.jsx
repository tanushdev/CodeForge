import { resources } from '../data';

export default function ResourcesPage() {
  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Resources</p>
        <h1>Learn, watch, solve</h1>
        <p>Curated links to practice platforms and learning materials.</p>
      </div>

      <div className="grid-3">
        {resources.map((r, i) => (
          <a key={i} href={r.url} target="_blank" rel="noreferrer" className="card-white" style={{
            padding: 18, textDecoration: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
          }}>
            <span className="tag tag-warning" style={{ marginBottom: 8, display: 'inline-block' }}>{r.kind}</span>
            <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.3 }}>{r.title}</strong>
          </a>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { algorithmGuide, resources } from '../data';

export default function Algorithms() {
  const [search, setSearch] = useState('');

  const filtered = algorithmGuide.filter((a) =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.useWhen.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Algorithm map</p>
        <h1>What to use, when, and why</h1>
        <p>Use this as your interview decision table before coding. Match the signal in the question to the pattern, then check complexity and tradeoffs.</p>
      </div>

      <div className="card-white" style={{ padding: '12px 16px', marginBottom: 24 }}>
        <input className="form-input" style={{ minHeight: 40 }} placeholder="Search algorithms..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid-2">
        {filtered.map((a, i) => (
          <article key={i} className="card-white" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
              <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--ink)', fontWeight: 600 }}>{a.name}</h3>
              <span className="tag tag-brand">{a.time}</span>
            </div>
            <dl style={{ display: 'grid', gap: 8, margin: 0 }}>
              <div>
                <dt style={{ color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>Use when</dt>
                <dd style={{ margin: '2px 0 0', color: 'var(--body)', fontSize: '0.88rem', lineHeight: 1.45 }}>{a.useWhen}</dd>
              </div>
              <div>
                <dt style={{ color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>Space</dt>
                <dd style={{ margin: '2px 0 0', color: 'var(--body)', fontSize: '0.88rem' }}>{a.space}</dd>
              </div>
              <div>
                <dt style={{ color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>Questions</dt>
                <dd style={{ margin: '2px 0 0', color: 'var(--body)', fontSize: '0.88rem' }}>{a.examples}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      {/* Resources section */}
      <div className="page-header" style={{ marginTop: 48 }}>
        <p className="eyebrow">Resources</p>
        <h1>Learn, watch, solve</h1>
        <p>Curated links to practice platforms and learning resources.</p>
      </div>

      <div className="grid-3">
        {resources.map((r, i) => (
          <a key={i} href={r.url} target="_blank" rel="noreferrer" className="card-white" style={{
            padding: 16, textDecoration: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
          }}>
            <span className="tag tag-warning" style={{ marginBottom: 6, display: 'inline-block' }}>{r.kind}</span>
            <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--ink)' }}>{r.title}</strong>
          </a>
        ))}
      </div>
    </div>
  );
}

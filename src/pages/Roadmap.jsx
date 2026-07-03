import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPut } from '../api/client';
import { roadmap as roadmapData } from '../data';

export default function Roadmap() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(new Set());
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiGet('/api/progress').then((data) => {
      if (data?.checked) setChecked(new Set(data.checked));
    }).catch(() => {});
  }, []);

  const toggle = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      apiPut('/api/progress', { checked: [...next] });
      return next;
    });
  };

  const resetAll = () => {
    setChecked(new Set());
    apiPut('/api/progress', { checked: [] });
  };

  const totalTopics = roadmapData.flatMap((s) => s.topics).length;
  const doneCount = checked.size;

  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Roadmap</p>
        <h1>DSA Topic Roadmap</h1>
        <p>{roadmapData.length} phases covering Python basics to system design.</p>
      </div>

      <div className="card-white" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 18px', marginBottom: 24, flexWrap: 'wrap' }}>
        <input className="form-input" style={{ flex: '1 1 200px', minHeight: 40 }} placeholder="Search topics..." value={search} onChange={(e) => setSearch(e.target.value)} />
        {['all', 'important', 'pending', 'done'].map((f) => (
          <button key={f} className={`btn${filter === f ? ' btn-primary' : ''}`}
            onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button className="btn" onClick={resetAll}>Reset</button>
        <span style={{ color: 'var(--muted)', fontSize: '0.85rem', marginLeft: 'auto' }}>{doneCount}/{totalTopics} done</span>
      </div>

      <div className="grid-2">
        {roadmapData.map((phase, si) => {
          const phaseDone = phase.topics.filter((t) => {
            const id = `topic-${si}-${phase.topics.indexOf(t)}-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            return checked.has(id);
          }).length;
          const phaseTotal = phase.topics.length;

          const filteredTopics = phase.topics.filter((t) => {
            const id = `topic-${si}-${phase.topics.indexOf(t)}-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            const done = checked.has(id);
            const match = filter === 'all' || (filter === 'important' && t.priority === 'important') || (filter === 'pending' && !done) || (filter === 'done' && done);
            const textMatch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.detail.toLowerCase().includes(search.toLowerCase());
            return match && textMatch;
          });

          if (filteredTopics.length === 0) return null;

          return (
            <article key={si} className="card-white" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', borderBottom: '1px solid var(--hairline)' }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 4, fontSize: '0.72rem' }}>{phase.level}</div>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--ink)', fontWeight: 600 }}>{phase.title}</h3>
                </div>
                <span className="tag tag-success">{phaseDone}/{phaseTotal}</span>
              </div>
              <div>
                {filteredTopics.map((t, ti) => {
                  const origIdx = phase.topics.indexOf(t);
                  const id = `topic-${si}-${origIdx}-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                  const done = checked.has(id);
                  const tagStyle = t.priority === 'important' ? 'tag-warning' : t.priority === 'core' ? 'tag-success' : 'tag-brand';
                  return (
                    <div key={id} className="topic-row"
                      style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 10, padding: '12px 18px', borderBottom: '1px solid var(--hairline)', transition: 'background 0.15s' }}>
                      <div style={{ display: 'grid', placeItems: 'center', width: 22, height: 22, border: `2px solid ${done ? 'var(--success)' : 'var(--hairline)'}`, borderRadius: 6, background: done ? 'var(--success)' : 'transparent', marginTop: 2, flexShrink: 0, cursor: 'pointer' }}
                        onClick={(e) => { e.stopPropagation(); toggle(id); }}>
                        {done && <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}>X</span>}
                      </div>
                      <div onClick={() => { if (t.link) navigate(t.link); else toggle(id); }}
                        style={{ cursor: t.link ? 'pointer' : 'default' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '0.92rem', color: done ? 'var(--success)' : 'var(--ink)', textDecoration: done ? 'line-through' : 'none' }}>{t.name}</strong>
                          <span className={`tag ${tagStyle}`}>{t.priority.toUpperCase()}</span>
                          {t.leetcode && (
                            <a href={t.leetcode} target="_blank" rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{ color: 'var(--muted)', fontSize: '0.7rem', textDecoration: 'underline' }}>
                              LeetCode
                            </a>
                          )}
                        </div>
                        <small style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 3, display: 'block' }}>{t.detail}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

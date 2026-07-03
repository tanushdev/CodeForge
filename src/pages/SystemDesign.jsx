import { useState, useEffect } from 'react';
import { sdDesignProblems, sdFundamentals } from '../data/systemDesign';
import { apiGet, apiPut } from '../api/client';
import MermaidDiagram from '../components/MermaidDiagram';

const difficultyColors = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };
const sectionNames = ['requirements', 'api_design', 'schema', 'components', 'scaling'];
const sectionLabels = { requirements: 'Requirements', api_design: 'API Design', schema: 'Data Schema', components: 'Components', scaling: 'Scaling Approach' };

function TechStackTable({ techStack }) {
  return (
    <div className="sd-table-wrap">
      <table className="sd-tech-table">
        <thead>
          <tr>
            <th>Component</th>
            <th>Tech</th>
            <th>Why (by numbers)</th>
            <th>Alternatives</th>
            <th>Tradeoffs</th>
          </tr>
        </thead>
        <tbody>
          {techStack.map((t, i) => (
            <tr key={i}>
              <td className="sd-tech-component">{t.component}</td>
              <td><span className="tag tag-ghost" style={{ fontSize: '0.78rem' }}>{t.tech}</span></td>
              <td className="sd-tech-detail">{t.why}</td>
              <td className="sd-tech-detail" style={{ color: 'var(--muted)' }}>{t.alternatives}</td>
              <td className="sd-tech-detail">{t.tradeoffs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProblemDetail({ problem, onBack, onPractice }) {
  return (
    <div>
      <button className="btn" style={{ marginBottom: 14 }} onClick={onBack}>Back to list</button>

      <div className="card-white" style={{ padding: 20, marginBottom: 16 }}>
        <div className="sd-detail-header">
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--ink)', fontWeight: 600 }}>{problem.title}</h2>
          <span className="tag sd-difficulty-tag" style={{ color: difficultyColors[problem.difficulty], border: `1px solid ${difficultyColors[problem.difficulty]}44`, background: `${difficultyColors[problem.difficulty]}16` }}>{problem.difficulty}</span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>{problem.usedBy}</p>
      </div>

      <div className="card-white" style={{ padding: 20, marginBottom: 14 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 10, color: 'var(--ink)', fontWeight: 600 }}>Requirements</h3>
        <div className="sd-text-content">{problem.requirements}</div>
      </div>

      <div className="card-white" style={{ padding: 20, marginBottom: 14 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 10, color: 'var(--ink)', fontWeight: 600 }}>Back-of-the-Envelope Estimation</h3>
        <div className="code-block" style={{ border: '1px solid var(--hairline)' }}>
          {problem.estimation}
        </div>
      </div>

      <div className="card-white" style={{ padding: 20, marginBottom: 14 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 12, color: 'var(--ink)', fontWeight: 600 }}>Tech Stack</h3>
        <TechStackTable techStack={problem.techStack} />
      </div>

      <div className="card-white" style={{ padding: 20, marginBottom: 14 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 10, color: 'var(--ink)', fontWeight: 600 }}>Architecture</h3>
        <MermaidDiagram chart={problem.architecture} />
      </div>

      <div className="card-white" style={{ padding: 20, marginBottom: 14 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 10, color: 'var(--ink)', fontWeight: 600 }}>Data Model</h3>
        <div className="sd-text-content">{problem.dataModel}</div>
      </div>

      <div className="card-white" style={{ padding: 20, marginBottom: 14 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 10, color: 'var(--ink)', fontWeight: 600 }}>Deep Dive</h3>
        <div className="sd-text-content">{problem.deepDive}</div>
      </div>

      <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => onPractice(problem)}>
        Practice: Design This System
      </button>
    </div>
  );
}

function ScoreCard({ result }) {
  if (!result) return null;
  return (
    <div style={{ marginTop: 16 }}>
      <div className="sd-score-header">
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--ink)', fontWeight: 600 }}>Score</h3>
        <div className="sd-score-val" style={{ color: result.overall >= 70 ? 'var(--success)' : result.overall >= 40 ? 'var(--warning)' : 'var(--error)' }}>
          {result.overall}%
        </div>
      </div>
      {sectionNames.map(name => {
        const s = result.sections[name];
        if (!s) return null;
        return (
          <details key={name} className="card-white sd-score-section" open>
            <summary style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>
              {sectionLabels[name]} - {s.score}% <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({s.points})</span>
            </summary>
            {s.matched.length > 0 && (
              <div style={{ marginTop: 10, marginBottom: 8 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600, marginBottom: 4 }}>Matched</div>
                <div className="sd-tag-list">
                  {s.matched.map(m => <span key={m} className="tag tag-success" style={{ fontSize: '0.75rem' }}>{m}</span>)}
                </div>
              </div>
            )}
            {s.missing.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--error)', fontWeight: 600, marginBottom: 4 }}>Missing</div>
                <div className="sd-tag-list">
                  {s.missing.map(m => <span key={m} className="tag" style={{ fontSize: '0.75rem', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.3)' }}>{m}</span>)}
                </div>
              </div>
            )}
          </details>
        );
      })}
      <div className="card-white" style={{ padding: 16, marginTop: 12 }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--ink)', fontWeight: 600, marginBottom: 8 }}>Model Answer</h4>
        <div className="sd-text-content" style={{ fontSize: '0.85rem' }}>
          {sectionNames.map(name => (
            result.modelAnswer && result.modelAnswer[name] ? (
              <div key={name} style={{ marginBottom: 10 }}>
                <strong style={{ color: 'var(--ink)' }}>{sectionLabels[name]}:</strong> {result.modelAnswer[name]}
              </div>
            ) : null
          ))}
        </div>
      </div>
    </div>
  );
}

function PracticeView({ problem, onBack, onGradeSaved }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const setAnswer = (section, val) => setAnswers(a => ({ ...a, [section]: val }));

  const submit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch('/api/grade/' + problem.id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: {
            requirements: answers.requirements || '',
            api_design: answers.api_design || '',
            schema: answers.schema || '',
            components: answers.components || '',
            scaling: answers.scaling || ''
          }
        })
      });
      if (!r.ok) {
        const err = await r.json();
        alert('Grading error: ' + (err.error || r.status));
        return;
      }
      const grade = await r.json();
      setResult(grade);
      await apiPut('/api/design-grades', { problemId: problem.id, grade });
      if (onGradeSaved) onGradeSaved(problem.id, grade);
    } catch (e) {
      alert('Failed to grade: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button className="btn" style={{ marginBottom: 14 }} onClick={onBack}>Back to detail</button>
      <div className="card-white" style={{ padding: 20, marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--ink)', fontWeight: 600, marginBottom: 4 }}>Practice: {problem.title}</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>Write your design answer for each section.</p>
      </div>

      {sectionNames.map(name => (
        <div key={name} className="card-white sd-practice-section">
          <label className="sd-practice-label">{sectionLabels[name]}</label>
          <textarea
            className="form-input sd-practice-input"
            placeholder={`Enter your ${sectionLabels[name].toLowerCase()} design...`}
            value={answers[name] || ''}
            onChange={e => setAnswer(name, e.target.value)}
          />
        </div>
      ))}

      <button className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} onClick={submit} disabled={loading}>
        {loading ? 'Grading...' : 'Submit for Grading'}
      </button>

      <ScoreCard result={result} />
    </div>
  );
}

export default function SystemDesign() {
  const [view, setView] = useState('list');
  const [tab, setTab] = useState('problems');
  const [selected, setSelected] = useState(null);
  const [savedGrades, setSavedGrades] = useState({});

  useEffect(() => {
    apiGet('/api/design-grades').then(data => {
      if (data?.designGrades) setSavedGrades(data.designGrades);
    }).catch(() => {});
  }, []);

  const gradedCount = Object.keys(savedGrades).length;
  const showDetail = (problem) => { setSelected(problem); setView('detail'); };
  const showPractice = (problem) => { setSelected(problem); setView('practice'); };

  const handleGradeSaved = (problemId, grade) => {
    setSavedGrades(prev => ({ ...prev, [problemId]: grade }));
  };

  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Interview prep</p>
        <h1>System Design</h1>
        <p>18 design problems with requirements, estimation, tech-stack analysis, architecture, and practice grading.</p>
        {gradedCount > 0 && <p className="tag tag-success" style={{ marginTop: 8 }}>{gradedCount} problem{gradedCount > 1 ? 's' : ''} graded</p>}
      </div>

      {view === 'list' && (
        <>
          <div className="nav-pill-group" style={{ marginBottom: 20 }}>
            <button className={`pill-item${tab === 'problems' ? ' active' : ''}`} onClick={() => setTab('problems')}>
              Design Problems ({sdDesignProblems.length})
            </button>
            <button className={`pill-item${tab === 'fundamentals' ? ' active' : ''}`} onClick={() => setTab('fundamentals')}>
              Fundamentals ({sdFundamentals.length})
            </button>
          </div>

          {tab === 'problems' && (
            <div className="sd-problem-list">
              {sdDesignProblems.map(p => (
                <div key={p.id} className="card-white sd-problem-card" onClick={() => showDetail(p)}>
                  <div className="sd-problem-row">
                    <div className="sd-problem-info">
                      <div className="sd-problem-tags">
                        <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--ink)', fontWeight: 600 }}>{p.title}</h3>
                        <span className="tag sd-difficulty-tag" style={{ fontSize: '0.7rem', color: difficultyColors[p.difficulty], border: `1px solid ${difficultyColors[p.difficulty]}44`, background: `${difficultyColors[p.difficulty]}12`, padding: '2px 6px' }}>{p.difficulty}</span>
                        {savedGrades[p.id] && <span className="tag tag-success" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>{savedGrades[p.id].overall}%</span>}
                      </div>
                      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>{p.summary}</p>
                    </div>
                    <span className="sd-problem-used-by">{p.usedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'fundamentals' && (
            <div className="sd-problem-list">
              {sdFundamentals.map(f => (
                <details key={f.id} className="card-white sd-funda-card">
                  <summary style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                    {f.title}
                    <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '0.8rem', marginLeft: 10 }}>{f.complexity}</span>
                  </summary>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: 4 }}>Used by: {f.usedBy}</p>
                  <div className="sd-text-content" style={{ fontSize: '0.88rem', marginTop: 8 }}>{f.content}</div>
                </details>
              ))}
            </div>
          )}
        </>
      )}

      {view === 'detail' && selected && (
        <ProblemDetail problem={selected} onBack={() => setView('list')} onPractice={showPractice} />
      )}

      {view === 'practice' && selected && (
        <PracticeView problem={selected} onBack={() => setView('detail')} onGradeSaved={handleGradeSaved} />
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiGet, apiPut } from '../api/client';
import { lessons } from '../data';
import Timer from '../components/Timer';

function isLessonComplete(lessonProg, index) {
  const id = `lesson-${index}`;
  const lesson = lessons[index];
  if (!lesson) return false;
  const codeDone = lessonProg?.codeDone?.[id] === true;
  const practiceDone = lesson.practice.every((_, pi) => lessonProg?.practiceDone?.[`${id}-practice-${pi}`] === true);
  return codeDone && practiceDone;
}

function isUnlocked(lessonProg, index) {
  if (index === 0) return true;
  return isLessonComplete(lessonProg, index - 1);
}

export default function Lessons() {
  const [searchParams] = useSearchParams();
  const [lessonProg, setLessonProg] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    apiGet('/api/progress').then((data) => {
      if (data?.lessonProgress) {
        setLessonProg(data.lessonProgress);
        setCurrent(data.lessonProgress.current || 0);
      } else {
        setLessonProg({ current: 0, completed: [], codeDone: {}, practiceDone: {}, notes: {} });
      }
    }).catch(() => {
      setLessonProg({ current: 0, completed: [], codeDone: {}, practiceDone: {}, notes: {} });
    });
  }, []);

  const levelParam = searchParams.get('level');
  useEffect(() => {
    if (lessonProg && levelParam !== null) {
      const idx = Math.max(0, Math.min(lessons.length - 1, parseInt(levelParam, 10) - 1));
      if (!isNaN(idx)) setCurrent(idx);
    }
  }, [lessonProg, levelParam]);

  const lesson = lessons[current];
  const complete = lesson && lessonProg ? isLessonComplete(lessonProg, current) : false;
  const unlocked = lesson && lessonProg ? isUnlocked(lessonProg, current) : false;

  const save = useCallback((updated) => {
    setLessonProg(updated);
    apiPut('/api/progress', { checked: null, lessonProgress: { current: updated.current, completed: updated.completed, codeDone: updated.codeDone, practiceDone: updated.practiceDone, notes: updated.notes } });
  }, []);

  if (!lessonProg) return <div className="loading">Loading lessons...</div>;
  if (!lesson) return <div className="loading">Lesson not found</div>;

  const completedXp = lessons.reduce((sum, _, i) => sum + (isLessonComplete(lessonProg, i) ? lessons[i].xp : 0), 0);
  const id = `lesson-${current}`;
  const codeDone = lessonProg.codeDone?.[id] === true;
  const solved = lesson.practice.filter((_, pi) => lessonProg.practiceDone?.[`${id}-practice-${pi}`] === true).length;
  const notes = lessonProg.notes?.[id] || '';

  const markCode = () => {
    save({ ...lessonProg, codeDone: { ...lessonProg.codeDone, [id]: !codeDone } });
  };

  const togglePractice = (pi) => {
    const key = `${id}-practice-${pi}`;
    const isDone = lessonProg.practiceDone?.[key] === true;
    save({ ...lessonProg, practiceDone: { ...lessonProg.practiceDone, [key]: !isDone } });
  };

  const saveNotes = (text) => {
    save({ ...lessonProg, notes: { ...lessonProg.notes, [id]: text } });
  };

  const goNext = () => {
    if (complete && current < lessons.length - 1) {
      const next = current + 1;
      setCurrent(next);
      save({ ...lessonProg, current: next });
    }
  };

  const goPrev = () => {
    if (current > 0) {
      const next = current - 1;
      setCurrent(next);
      save({ ...lessonProg, current: next });
    }
  };

  const navigateTo = (idx) => {
    if (isUnlocked(lessonProg, idx)) {
      setCurrent(idx);
      save({ ...lessonProg, current: idx });
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Learn mode</p>
        <h1>Level-based DSA Lessons</h1>
        <p>Complete each level to unlock the next. Master theory, code, dry runs, and interview scripts.</p>
      </div>

      <div className="card-white" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 18, padding: 18 }}>
        {/* Level sidebar */}
        <div style={{ minWidth: 0 }}>
          <h3 style={{ marginBottom: 14, fontSize: '1rem', color: 'var(--ink)', fontWeight: 600 }}>Level path</h3>
          <div style={{ display: 'grid', gap: 8, maxHeight: 500, overflow: 'auto', paddingRight: 4 }}>
            {lessons.map((l, i) => {
              const done = isLessonComplete(lessonProg, i);
              const unlock = isUnlocked(lessonProg, i);
              return (
                <button key={i} onClick={() => navigateTo(i)} disabled={!unlock}
                  style={{
                    display: 'grid', gridTemplateColumns: '40px 1fr', gap: 10, alignItems: 'center',
                    width: '100%', padding: 10, border: current === i ? '2px solid var(--primary)' : '1px solid var(--hairline)',
                    borderRadius: 8, background: current === i ? 'var(--surface-card)' : 'var(--canvas)',
                    color: 'var(--ink)', cursor: unlock ? 'pointer' : 'not-allowed', textAlign: 'left',
                    opacity: unlock ? 1 : 0.5,
                  }}>
                  <div style={{
                    display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: '50%',
                    background: done ? 'var(--success)' : 'var(--surface-soft)',
                    color: done ? '#fff' : 'var(--muted)', fontWeight: 700, fontSize: '0.75rem',
                  }}>
                    {done ? 'D' : unlock ? String(i + 1) : 'X'}
                  </div>
                  <strong style={{ fontSize: '0.85rem', lineHeight: 1.25 }}>{l.title}</strong>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lesson panel */}
        <div style={{ padding: 20, background: 'var(--canvas)', border: '1px solid var(--hairline)', borderRadius: 'var(--rounded-lg)' }}>
          {!unlocked ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '2rem', marginBottom: 8 }}>[X]</p>
              <h2 style={{ marginBottom: 6, color: 'var(--ink)', fontWeight: 600 }}>Level locked</h2>
              <p style={{ color: 'var(--muted)' }}>Complete the previous level first.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
                <div>
                  <div className="eyebrow" style={{ fontSize: '0.72rem', marginBottom: 4 }}>Level {lesson.level} . {lessons.length} levels</div>
                  <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', margin: 0, color: 'var(--ink)', fontWeight: 600 }}>{lesson.title}</h2>
                  <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginTop: 6, lineHeight: 1.5 }}>{lesson.theory}</p>
                </div>
                <span className="tag tag-warning" style={{ height: 'fit-content', fontSize: '0.82rem', padding: '6px 12px' }}>{completedXp} XP</span>
              </div>

              {/* Meta */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 16 }}>
                <div style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--hairline)', background: 'var(--surface-soft)' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>Use: {lesson.use}</span>
                </div>
                <div style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--hairline)', background: 'var(--surface-soft)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                  {lesson.complexity}
                </div>
              </div>

              {/* Deep notes, dry run, interview */}
              <div className="grid-3" style={{ marginBottom: 16 }}>
                {[
                  { title: 'Deep notes', items: lesson.deepNotes || [], mono: false },
                  { title: 'Numerical dry run', items: lesson.dryRun || [], mono: true },
                  { title: 'Interview script', items: lesson.interview || [], mono: false },
                ].map((section) => (
                  <div key={section.title} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--hairline)', background: section.mono ? 'var(--canvas)' : 'var(--surface-soft)' }}>
                    <h4 style={{ fontSize: '0.92rem', marginBottom: 10, color: 'var(--ink)', fontWeight: 600 }}>{section.title}</h4>
                    <ul style={{ paddingLeft: 18, color: 'var(--body)', fontSize: '0.85rem', lineHeight: 1.55, fontFamily: section.mono ? "'SF Mono', 'Consolas', 'Menlo', monospace" : 'inherit' }}>
                      {section.items.map((item, i) => <li key={i} style={{ marginBottom: 4, whiteSpace: section.mono ? 'pre-wrap' : 'normal' }}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Code + explanation */}
              <div className="grid-2" style={{ marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--ink)', fontWeight: 600 }}>Python code</h4>
                    <span className="tag tag-ghost" style={{ fontSize: '0.7rem' }}>No shortcuts</span>
                  </div>
                  <pre className="code-block" style={{ border: '1px solid var(--hairline)', minHeight: 120 }}>
                    <code>{lesson.code}</code>
                  </pre>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--ink)', fontWeight: 600 }}>Line explanation</h4>
                    <span className="tag tag-ghost" style={{ fontSize: '0.7rem' }}>Interview style</span>
                  </div>
                  <ol style={{
                    margin: 0, padding: '14px 14px 14px 34px', border: '1px solid var(--hairline)', borderRadius: 8,
                    background: 'var(--surface-soft)', color: 'var(--body)', lineHeight: 1.55, minHeight: 120,
                  }}>
                    {lesson.explanation.map((line, i) => <li key={i} style={{ marginBottom: 4 }}>{line}</li>)}
                  </ol>
                </div>
              </div>

              {/* Equation */}
              <div style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--hairline)', marginBottom: 16, background: 'var(--surface-soft)' }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: 4, color: 'var(--muted)', fontWeight: 600 }}>Formula and key insight</h4>
                <p style={{ color: 'var(--body)', fontSize: '0.9rem', margin: 0 }}>{lesson.equation}</p>
              </div>

              {/* Timer */}
              <details style={{ padding: 14, borderRadius: 8, border: '1px solid var(--hairline)', marginBottom: 16, cursor: 'pointer', background: 'var(--surface-soft)' }}>
                <summary style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: 8, color: 'var(--ink)' }}>Timed practice mode</summary>
                <Timer />
              </details>

              {/* Practice */}
              <div style={{ padding: 14, borderRadius: 8, border: '1px solid var(--hairline)', marginBottom: 16, background: 'var(--surface-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <h4 style={{ fontSize: '0.92rem', margin: 0, color: 'var(--ink)', fontWeight: 600 }}>Solve to clear this level</h4>
                  <span className="tag tag-ghost">{solved}/{lesson.practice.length} done</span>
                </div>
                {lesson.practice.map((p, pi) => {
                  const done = lessonProg.practiceDone?.[`${id}-practice-${pi}`] === true;
                  return (
                    <label key={pi} style={{
                      display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12, alignItems: 'center',
                      padding: 10, marginTop: 8, border: `2px solid ${done ? 'var(--success)' : 'var(--hairline)'}`,
                      borderRadius: 8, background: done ? 'rgba(16,185,129,0.06)' : 'var(--canvas)',
                      cursor: 'pointer',
                    }}>
                      <div style={{
                        display: 'grid', placeItems: 'center', width: 20, height: 20,
                        border: `2px solid ${done ? 'var(--success)' : 'var(--hairline)'}`,
                        borderRadius: 5, background: done ? 'var(--success)' : 'transparent',
                      }}>
                        {done && <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.65rem' }}>X</span>}
                        <input type="checkbox" checked={done} onChange={() => togglePractice(pi)} style={{ display: 'none' }} />
                      </div>
                      <a href={p.url} target="_blank" rel="noreferrer" style={{
                        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 10, alignItems: 'center',
                        color: 'var(--ink)', fontWeight: 600, textDecoration: 'none', fontSize: '0.88rem',
                      }}>
                        <span className="tag tag-success" style={{ fontSize: '0.7rem' }}>{p.platform}</span>
                        <span>{p.name}</span>
                        <span className="tag tag-warning" style={{ fontSize: '0.7rem' }}>{p.difficulty}</span>
                      </a>
                    </label>
                  );
                })}
              </div>

              {/* Notes */}
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label htmlFor="lessonNotes">My notes</label>
                <textarea id="lessonNotes" className="form-input" rows={3} placeholder="Write your own explanation, mistakes, or tricks..."
                  value={notes} onChange={(e) => saveNotes(e.target.value)}
                  style={{ padding: 12, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5, textTransform: 'none' }} />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button className="btn" onClick={goPrev} disabled={current === 0}>Previous</button>
                <button className="btn" onClick={markCode}
                  style={codeDone ? { background: 'var(--success)', color: '#fff', border: '1px solid var(--success)' } : {}}>
                  {codeDone ? 'Code understood' : 'Mark code understood'}
                </button>
                <button className="btn btn-primary" onClick={goNext} disabled={!complete || current === lessons.length - 1}>
                  {current === lessons.length - 1 ? 'Final level' : complete ? 'Next level' : 'Complete level first'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

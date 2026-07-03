import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiGet, apiPut } from '../api/client';
import { lessons } from '../data';
import { visualizations } from '../data/visualizations';
import Timer from '../components/Timer';
import AlgorithmVisualizer from '../components/AlgorithmVisualizer';

const LESSON_VIZ_MAP = {
  0: 'linear-search',
  1: 'selection-sort',
  2: 'binary-search',
  3: 'two-pointers',
  4: 'sliding-window',
  5: 'stack',
  6: 'bfs',
  7: 'dfs',
  8: 'heap',
};

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

export default function Learn() {
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
  const vizKey = LESSON_VIZ_MAP[current];
  const hasViz = vizKey && visualizations[vizKey];

  const save = useCallback((updated) => {
    setLessonProg(updated);
    apiPut('/api/progress', { checked: null, lessonProgress: { current: updated.current, completed: updated.completed, codeDone: updated.codeDone, practiceDone: updated.practiceDone, notes: updated.notes } });
  }, []);

  const id = `lesson-${current}`;
  const codeDone = lessonProg?.codeDone?.[id] === true;
  const solved = lesson.practice.filter((_, pi) => lessonProg?.practiceDone?.[`${id}-practice-${pi}`] === true).length;
  const notes = lessonProg?.notes?.[id] || '';
  const completedXp = lessons.reduce((sum, _, i) => sum + (isLessonComplete(lessonProg, i) ? lessons[i].xp : 0), 0);

  const markCode = () => {
    const updated = { ...lessonProg, codeDone: { ...lessonProg.codeDone, [id]: !codeDone } };
    save(updated);
  };

  const togglePractice = (pi) => {
    const key = `${id}-practice-${pi}`;
    const current = lessonProg.practiceDone?.[key] === true;
    const updated = { ...lessonProg, practiceDone: { ...lessonProg.practiceDone, [key]: !current } };
    save(updated);
  };

  const saveNotes = (val) => {
    const updated = { ...lessonProg, notes: { ...lessonProg.notes, [id]: val } };
    save(updated);
  };

  const goPrev = () => { if (current > 0) setCurrent(current - 1); };
  const goNext = () => { if (current < lessons.length - 1 && isLessonComplete(lessonProg, current)) setCurrent(current + 1); };
  const navigateTo = (idx) => { if (isUnlocked(lessonProg, idx)) setCurrent(idx); };

  if (!lessonProg) return <div className="loading">Loading lessons...</div>;
  if (!lesson) return <div className="loading">Lesson not found</div>;

  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Learn mode</p>
        <h1>Level-based DSA Lessons</h1>
        <p>Complete each level to unlock the next. Each lesson includes an interactive visualizer.</p>
      </div>

      <div className="learn-layout">
        {/* Level sidebar */}
        <div className="card-white learn-sidebar">
          <h3 style={{ marginBottom: 14, fontSize: '1rem', color: 'var(--ink)', fontWeight: 600 }}>Level path</h3>
          <div className="learn-level-list">
            {lessons.map((l, i) => {
              const done = isLessonComplete(lessonProg, i);
              const unlock = isUnlocked(lessonProg, i);
              const has = LESSON_VIZ_MAP[i] && visualizations[LESSON_VIZ_MAP[i]];
              return (
                <button key={i} onClick={() => navigateTo(i)} disabled={!unlock}
                  className={`learn-level-btn${current === i ? ' active' : ''}`}>
                  <div className={`learn-level-circle${done ? ' done' : ''}`}>
                    {done ? 'D' : unlock ? String(i + 1) : 'X'}
                  </div>
                  <div className="learn-level-info">
                    <strong>{l.title}</strong>
                    {has && <span className="learn-viz-badge">Viz</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="learn-main">
          {!unlocked ? (
            <div className="card-white" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '2rem', marginBottom: 8 }}>[X]</p>
              <h2 style={{ marginBottom: 6, color: 'var(--ink)', fontWeight: 600 }}>Level locked</h2>
              <p style={{ color: 'var(--muted)' }}>Complete the previous level first.</p>
            </div>
          ) : (
            <>
              {/* Lesson Content */}
              <div className="card-white" style={{ padding: 20, marginBottom: 14 }}>
                <div className="learn-header">
                  <div>
                    <div className="eyebrow" style={{ fontSize: '0.72rem', marginBottom: 4 }}>Level {lesson.level} . {lessons.length} levels</div>
                    <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', margin: 0, color: 'var(--ink)', fontWeight: 600 }}>{lesson.title}</h2>
                    <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginTop: 6, lineHeight: 1.5 }}>{lesson.theory}</p>
                  </div>
                  <span className="tag tag-warning" style={{ height: 'fit-content', fontSize: '0.82rem', padding: '6px 12px' }}>{completedXp} XP</span>
                </div>

                <div className="learn-meta">
                  <div className="learn-use-box">
                    <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>Use: {lesson.use}</span>
                  </div>
                  <div className="learn-complexity-box">
                    {lesson.complexity}
                  </div>
                </div>

                {hasViz && (
                  <div className="learn-viz-section">
                    <AlgorithmVisualizer lessonVizKey={vizKey} />
                  </div>
                )}

                <div className="learn-grid-3">
                  {[
                    { title: 'Deep notes', items: lesson.deepNotes || [], mono: false },
                    { title: 'Numerical dry run', items: lesson.dryRun || [], mono: true },
                    { title: 'Interview script', items: lesson.interview || [], mono: false },
                  ].map((section) => (
                    <div key={section.title} className={`learn-section-card${section.mono ? ' mono' : ''}`}>
                      <h4>{section.title}</h4>
                      <ul>
                        {section.items.map((item, i) => <li key={i} className={section.mono ? 'mono' : ''}>{item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="learn-grid-2">
                  <div>
                    <div className="learn-section-header">
                      <h4>Python code</h4>
                      <span className="tag tag-ghost" style={{ fontSize: '0.7rem' }}>No shortcuts</span>
                    </div>
                    <pre className="code-block"><code>{lesson.code}</code></pre>
                  </div>
                  <div>
                    <div className="learn-section-header">
                      <h4>Line explanation</h4>
                      <span className="tag tag-ghost" style={{ fontSize: '0.7rem' }}>Interview style</span>
                    </div>
                    <ol className="learn-explanation">
                      {lesson.explanation.map((line, i) => <li key={i}>{line}</li>)}
                    </ol>
                  </div>
                </div>

                <div className="learn-equation-box">
                  <h4>Formula and key insight</h4>
                  <p>{lesson.equation}</p>
                </div>

                <details className="learn-timer-box">
                  <summary>Timed practice mode</summary>
                  <Timer />
                </details>

                <div className="learn-practice-box">
                  <div className="learn-practice-header">
                    <h4>Solve to clear this level</h4>
                    <span className="tag tag-ghost">{solved}/{lesson.practice.length} done</span>
                  </div>
                  {lesson.practice.map((p, pi) => {
                    const done = lessonProg.practiceDone?.[`${id}-practice-${pi}`] === true;
                    return (
                      <label key={pi} className={`learn-practice-item${done ? ' done' : ''}`}>
                        <div className={`learn-checkbox${done ? ' checked' : ''}`}>
                          {done && <span>X</span>}
                          <input type="checkbox" checked={done} onChange={() => togglePractice(pi)} style={{ display: 'none' }} />
                        </div>
                        <a href={p.url} target="_blank" rel="noreferrer" className="learn-practice-link">
                          <span className="tag tag-success">{p.platform}</span>
                          <span>{p.name}</span>
                          <span className="tag tag-warning">{p.difficulty}</span>
                        </a>
                      </label>
                    );
                  })}
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label htmlFor="lessonNotes">My notes</label>
                  <textarea id="lessonNotes" className="form-input" rows={3} placeholder="Write your own explanation, mistakes, or tricks..."
                    value={notes} onChange={(e) => saveNotes(e.target.value)}
                    style={{ padding: 12, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5, textTransform: 'none' }} />
                </div>

                <div className="learn-actions">
                  <button className="btn" onClick={goPrev} disabled={current === 0}>Previous</button>
                  <button className={`btn${codeDone ? ' btn-success' : ''}`} onClick={markCode}>
                    {codeDone ? 'Code understood' : 'Mark code understood'}
                  </button>
                  <button className="btn btn-primary" onClick={goNext} disabled={!complete || current === lessons.length - 1}>
                    {current === lessons.length - 1 ? 'Final level' : complete ? 'Next level' : 'Complete level first'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

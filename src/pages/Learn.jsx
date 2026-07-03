import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

function LearnList({ lessonProg, save }) {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Learn mode</p>
        <h1>All Topics</h1>
        <p>Select a topic to view lessons and interactive visualizers.</p>
      </div>
      <div className="learn-grid-cards">
        {lessons.map((l, i) => {
          const done = isLessonComplete(lessonProg, i);
          const unlock = isUnlocked(lessonProg, i);
          const has = LESSON_VIZ_MAP[i] && visualizations[LESSON_VIZ_MAP[i]];
          return (
            <button key={i} onClick={() => { if (unlock) navigate(`/learn/${i + 1}`); }} disabled={!unlock}
              className={`learn-card${done ? ' done' : ''}${!unlock ? ' locked' : ''}`}>
              <div className="learn-card-top">
                <div className={`learn-card-circle${done ? ' done' : ''}`}>
                  {done ? 'D' : unlock ? String(i + 1) : 'X'}
                </div>
                <span className="tag tag-ghost" style={{ fontSize: '0.7rem' }}>{l.xp} XP</span>
              </div>
              <h3>{l.title}</h3>
              <p>{l.theory}</p>
              <div className="learn-card-footer">
                <span className="tag tag-warning">Level {l.level}</span>
                {has && <span className="learn-viz-badge">Viz</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LessonDetail({ lessonProg, save, index }) {
  const navigate = useNavigate();
  const current = parseInt(index, 10) - 1;
  if (isNaN(current) || current < 0 || current >= lessons.length) {
    return <div className="page"><p>Lesson not found.</p></div>;
  }

  const lesson = lessons[current];
  const complete = lessonProg && isLessonComplete(lessonProg, current);
  const unlocked = lessonProg && isUnlocked(lessonProg, current);
  const vizKey = LESSON_VIZ_MAP[current];
  const hasViz = vizKey && visualizations[vizKey];

  if (!lessonProg) return <div className="loading">Loading lesson...</div>;

  if (!unlocked) {
    return (
      <div className="page">
        <div className="card-white" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 500, margin: '40px auto' }}>
          <p style={{ fontSize: '2rem', marginBottom: 8 }}>[X]</p>
          <h2 style={{ marginBottom: 6, color: 'var(--ink)', fontWeight: 600 }}>Level locked</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Complete the previous level first.</p>
          <button className="btn" onClick={() => navigate('/learn')}>Back to topics</button>
        </div>
      </div>
    );
  }

  const id = `lesson-${current}`;
  const codeDone = lessonProg?.codeDone?.[id] === true;
  const solved = lesson.practice.filter((_, pi) => lessonProg?.practiceDone?.[`${id}-practice-${pi}`] === true).length;
  const notes = lessonProg?.notes?.[id] || '';
  const completedXp = lessons.reduce((sum, _, i) => sum + (isLessonComplete(lessonProg, i) ? lessons[i].xp : 0), 0);

  const goPrev = () => { if (current > 0) navigate(`/learn/${current}`); };
  const goNext = () => { if (current < lessons.length - 1 && isLessonComplete(lessonProg, current)) navigate(`/learn/${current + 2}`); };

  return (
    <div className="page">
      <div className="learn-detail-header">
        <button className="btn btn-ghost" onClick={() => navigate('/learn')} style={{ marginRight: 12 }}>Back to topics</button>
        <span className="tag tag-warning" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>{completedXp} XP</span>
      </div>
      <div className="card-white" style={{ padding: 20, marginBottom: 14 }}>
        <div className="learn-header">
          <div>
            <div className="eyebrow" style={{ fontSize: '0.72rem', marginBottom: 4 }}>Level {lesson.level} . {lessons.length} levels</div>
            <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', margin: 0, color: 'var(--ink)', fontWeight: 600 }}>{lesson.title}</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginTop: 6, lineHeight: 1.5 }}>{lesson.theory}</p>
          </div>
        </div>

        <div className="learn-meta">
          <div className="learn-use-box">
            <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>Use: {lesson.use}</span>
          </div>
          <div className="learn-complexity-box">{lesson.complexity}</div>
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
              <ul>{section.items.map((item, i) => <li key={i} className={section.mono ? 'mono' : ''}>{item}</li>)}</ul>
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
                  <input type="checkbox" checked={done} onChange={() => {
                    const key = `${id}-practice-${pi}`;
                    const current = lessonProg.practiceDone?.[key] === true;
                    save({ ...lessonProg, practiceDone: { ...lessonProg.practiceDone, [key]: !current } });
                  }} style={{ display: 'none' }} />
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
            value={notes} onChange={(e) => save({ ...lessonProg, notes: { ...lessonProg.notes, [id]: e.target.value } })}
            style={{ padding: 12, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5, textTransform: 'none' }} />
        </div>

        <div className="learn-actions">
          <button className="btn" onClick={goPrev} disabled={current === 0}>Previous</button>
          <button className={`btn${codeDone ? ' btn-success' : ''}`} onClick={() => {
            save({ ...lessonProg, codeDone: { ...lessonProg.codeDone, [id]: !codeDone } });
          }}>
            {codeDone ? 'Code understood' : 'Mark code understood'}
          </button>
          <button className="btn btn-primary" onClick={goNext} disabled={!complete || current === lessons.length - 1}>
            {current === lessons.length - 1 ? 'Final level' : complete ? 'Next level' : 'Complete level first'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Learn() {
  const { lessonId } = useParams();
  const [lessonProg, setLessonProg] = useState(null);

  useEffect(() => {
    apiGet('/api/progress').then((data) => {
      if (data?.lessonProgress) {
        setLessonProg(data.lessonProgress);
      } else {
        setLessonProg({ current: 0, completed: [], codeDone: {}, practiceDone: {}, notes: {} });
      }
    }).catch(() => {
      setLessonProg({ current: 0, completed: [], codeDone: {}, practiceDone: {}, notes: {} });
    });
  }, []);

  const save = useCallback((updated) => {
    setLessonProg(updated);
    apiPut('/api/progress', { checked: null, lessonProgress: { current: updated.current, completed: updated.completed, codeDone: updated.codeDone, practiceDone: updated.practiceDone, notes: updated.notes } });
  }, []);

  if (!lessonProg) return <div className="loading">Loading lessons...</div>;

  if (lessonId !== undefined) {
    return <LessonDetail lessonProg={lessonProg} save={save} index={lessonId} />;
  }

  return <LearnList lessonProg={lessonProg} save={save} />;
}

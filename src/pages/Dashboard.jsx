import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../api/client';
import { roadmap, lessons } from '../data';
import ProgressRing from '../components/ProgressRing';

export default function Dashboard() {
  const { user } = useAuth();
  const [checked, setChecked] = useState(new Set());
  const [lessonProg, setLessonProg] = useState(null);

  useEffect(() => {
    apiGet('/api/progress').then((data) => {
      if (data) {
        setChecked(new Set(data.checked || []));
        setLessonProg(data.lessonProgress || { current: 0, completed: [], codeDone: {}, practiceDone: {}, notes: {} });
      }
    }).catch(() => {});
  }, []);

  const topics = roadmap.flatMap((s) => s.topics);
  const total = topics.length;
  const done = checked.size;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const important = topics.filter((t) => t.priority === 'important').length;
  const lessonsDone = lessonProg ? lessons.filter((_, i) => {
    const id = `lesson-${i}`;
    const codeDone = lessonProg.codeDone?.[id] === true;
    const practiceDone = (lessonProg.practiceDone || {});
    const allPractice = lessons[i].practice.every((_, pi) => practiceDone[`${id}-practice-${pi}`] === true);
    return codeDone && allPractice;
  }).length : 0;
  const lessonCount = lessons.length;
  const problems = topics.reduce((sum, t) => sum + (t.problems?.length || 0), 0);

  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Overview</p>
        <h1>Your DSA Progress</h1>
        <p>Track what you've covered and what's next on your interview prep journey.</p>
      </div>

      <div className="card-white" style={{ display: 'flex', gap: 24, marginBottom: 28, flexWrap: 'wrap', padding: 20 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flex: '1 1 340px' }}>
          <ProgressRing pct={pct} size={100} />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)' }}>{done} of {total} topics done</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 2 }}>{pct}% complete</div>
            <div style={{ color: 'var(--muted-soft)', fontSize: '0.78rem', marginTop: 6 }}>
              Progress synced to your account
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{important}</span>
          <p className="stat-label">Important topics</p>
        </div>
        <div className="stat-card">
          <span className="stat-value">{total - done}</span>
          <p className="stat-label">Still pending</p>
        </div>
        <div className="stat-card">
          <span className="stat-value">{done}</span>
          <p className="stat-label">Topics completed</p>
        </div>
        <div className="stat-card">
          <span className="stat-value">~{problems}</span>
          <p className="stat-label">Practice questions</p>
        </div>
        <div className="stat-card">
          <span className="stat-value">{lessonCount}</span>
          <p className="stat-label">Total lessons</p>
        </div>
        <div className="stat-card">
          <span className="stat-value">{lessonsDone}/{lessonCount}</span>
          <p className="stat-label">Levels cleared</p>
        </div>
      </div>
    </div>
  );
}

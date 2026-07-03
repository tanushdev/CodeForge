import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPut } from '../api/client';
import { lessons, roadmap } from '../data';

const INTERVALS = [0, 1, 3, 7, 14, 30];
const LEVEL_LABELS = ['New', '1 day', '3 days', '1 week', '2 weeks', '1 month'];

function getDueItems(schedule) {
  const now = Date.now();
  const due = [];
  for (const [key, entry] of Object.entries(schedule || {})) {
    if (!entry.nextReview) continue;
    if (new Date(entry.nextReview).getTime() <= now) {
      const lesson = lessons.find((_, i) => `lesson-${i}` === key);
      const topicData = findRoadmapTopic(key);
      due.push({
        key,
        label: lesson?.title || topicData?.name || key,
        type: lesson ? 'lesson' : 'topic',
        level: entry.level ?? 0,
        nextReview: entry.nextReview,
      });
    }
  }
  due.sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview));
  return due;
}

function findRoadmapTopic(key) {
  for (const phase of roadmap) {
    for (const topic of phase.topics) {
      if (`topic-${topic.name}` === key) return topic;
    }
  }
  return null;
}

function nextReviewDate(level) {
  const days = INTERVALS[Math.min(level + 1, INTERVALS.length - 1)];
  if (days === 0) return new Date();
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export default function Review() {
  const [schedule, setSchedule] = useState({});
  const [dueItems, setDueItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/review').then((data) => {
      const s = data?.reviewSchedule || {};
      setSchedule(s);
      setDueItems(getDueItems(s));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const persist = useCallback((s) => {
    setSchedule(s);
    setDueItems(getDueItems(s));
    apiPut('/api/review', { reviewSchedule: s });
  }, []);

  const markReviewed = (key) => {
    const entry = schedule[key] || { level: 0 };
    const nextLevel = Math.min((entry.level || 0) + 1, INTERVALS.length - 1);
    const updated = {
      ...schedule,
      [key]: { level: nextLevel, nextReview: nextReviewDate(nextLevel), lastReviewed: new Date().toISOString() },
    };
    persist(updated);
  };

  const needsWork = (key) => {
    const updated = {
      ...schedule,
      [key]: { level: 0, nextReview: nextReviewDate(0), lastReviewed: new Date().toISOString() },
    };
    persist(updated);
  };

  const allReviewed = () => {
    const now = new Date();
    const updated = { ...schedule };
    for (const item of dueItems) {
      const entry = updated[item.key] || { level: 0 };
      const nextLevel = Math.min((entry.level || 0) + 1, INTERVALS.length - 1);
      updated[item.key] = { level: nextLevel, nextReview: nextReviewDate(nextLevel), lastReviewed: now.toISOString() };
    }
    persist(updated);
  };

  if (loading) return <div className="loading">Loading review schedule...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Spaced repetition</p>
        <h1>Review due items</h1>
        <p>Revisit completed topics at expanding intervals so patterns stick.</p>
      </div>

      {dueItems.length === 0 ? (
        <div className="card-white" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: 8, color: 'var(--success)', fontWeight: 600 }}>[OK]</p>
          <h2 style={{ color: 'var(--ink)', fontWeight: 600 }}>All caught up</h2>
          <p style={{ color: 'var(--muted)', maxWidth: 400, margin: '8px auto 0' }}>
            Complete lessons and mark roadmap topics to schedule them for review.
            New items appear here when their review date arrives.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span className="tag tag-warning" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
              {dueItems.length} item{dueItems.length > 1 ? 's' : ''} due
            </span>
            <button className="btn" onClick={allReviewed}>Mark all reviewed</button>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {dueItems.map((item) => (
              <div key={item.key} className="card-white" style={{
                display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'center', padding: '16px 18px',
              }}>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--ink)' }}>{item.label}</strong>
                  <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: '0.8rem', color: 'var(--muted)' }}>
                    <span className="tag tag-ghost">{item.type}</span>
                    <span>{LEVEL_LABELS[item.level] || 'New'}</span>
                  </div>
                </div>
                <button className="btn" onClick={() => markReviewed(item.key)}
                  style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  Mark reviewed
                </button>
                <button className="btn" onClick={() => needsWork(item.key)}
                  style={{ color: 'var(--error)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  Needs work
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

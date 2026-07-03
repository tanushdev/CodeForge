import { useState, useRef, useEffect, useCallback } from 'react';
import { visualizations } from '../data/visualizations';

const POINTER_COLORS = {
  L: { bg: '#ef4444', label: 'L' }, R: { bg: '#ef4444', label: 'R' },
  M: { bg: '#f59e0b', label: 'M' }, i: { bg: '#3b82f6', label: 'i' },
  j: { bg: '#8b5cf6', label: 'j' }, min: { bg: '#10b981', label: 'min' },
  start: { bg: '#3b82f6', label: 'start' }, end: { bg: '#ef4444', label: 'end' },
  top: { bg: '#f59e0b', label: 'top' }, ptr: { bg: '#3b82f6', label: 'ptr' },
};

function getMaxVal(arr) {
  let m = 1;
  for (const v of arr) if (v > m) m = v;
  return m || 1;
}

export default function AlgorithmVisualizer({ lessonVizKey }) {
  const [algoKey, setAlgoKey] = useState(lessonVizKey || 'binary-search');
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [inputStr, setInputStr] = useState('');
  const [targetStr, setTargetStr] = useState('');
  const [kStr, setKStr] = useState('');
  const timerRef = useRef(null);

  const algo = visualizations[algoKey];
  const current = steps[stepIdx] || { array: [], stack: [], pointers: {}, highlights: [], codeLine: 0, log: '', done: false };
  const maxVal = getMaxVal(current.array || []);
  const totalSteps = steps.length;
  const parentViz = lessonVizKey;

  useEffect(() => { if (lessonVizKey) setAlgoKey(lessonVizKey); }, [lessonVizKey]);

  const run = useCallback(() => {
    if (!algo) return;
    const def = algo.defaultInput;
    let arr, extra;
    try {
      arr = JSON.parse(inputStr || JSON.stringify(def.arr));
      if (algoKey === 'binary-search' || algoKey === 'linear-search' || algoKey === 'two-pointers') {
        extra = parseInt(targetStr || def.target, 10);
        if (isNaN(extra)) throw new Error('bad target');
      } else if (algoKey === 'sliding-window') {
        extra = parseInt(kStr || def.k, 10);
        if (isNaN(extra) || extra < 1) throw new Error('bad k');
      } else {
        extra = undefined;
      }
    } catch {
      arr = [...def.arr];
      extra = algoKey === 'sliding-window' ? def.k : (def.target ?? undefined);
    }
    const generated = algo.generateSteps(arr, extra);
    setSteps(generated);
    setStepIdx(0);
    setPlaying(false);
  }, [algoKey, inputStr, targetStr, kStr, algo]);

  useEffect(() => { if (algo) run(); }, [algoKey]);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStepIdx((prev) => {
          const next = prev + 1;
          if (next >= steps.length - 1) { setPlaying(false); return steps.length - 1; }
          return next;
        });
      }, speed);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, speed, steps.length]);

  const play = () => { if (stepIdx < steps.length - 1) setPlaying(true); };
  const pause = () => setPlaying(false);
  const reset = () => { setPlaying(false); setStepIdx(0); };
  const stepForward = () => setStepIdx((p) => Math.min(p + 1, steps.length - 1));
  const stepBack = () => setStepIdx((p) => Math.max(p - 1, 0));

  if (!algo) return null;

  const barW = Math.max(24, Math.min(50, Math.floor(560 / (current.array?.length || 1))));
  const barGap = Math.max(2, Math.min(5, barW > 36 ? 5 : 3));

  return (
    <div className="viz-container" style={parentViz ? { marginTop: 14 } : {}}>
      {!parentViz && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {Object.entries(visualizations).map(([key, v]) => (
            <button key={key} className={`btn ${algoKey === key ? 'btn-primary' : ''}`}
              onClick={() => { setAlgoKey(key); setPlaying(false); }}>
              {v.title}
            </button>
          ))}
        </div>
      )}

      {!parentViz && (
        <div className="card-white" style={{ padding: 18, marginBottom: 14 }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 10 }}>{algo.description}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'end' }}>
            <div className="form-group" style={{ flex: '1 1 180px' }}>
              <label>Array</label>
              <input className="form-input" value={inputStr} onChange={(e) => setInputStr(e.target.value)}
                placeholder={`e.g. ${JSON.stringify(algo.defaultInput.arr)}`} />
            </div>
            {(algoKey === 'binary-search' || algoKey === 'linear-search' || algoKey === 'two-pointers') && (
              <div className="form-group" style={{ flex: '0 1 100px' }}>
                <label>Target</label>
                <input className="form-input" value={targetStr} onChange={(e) => setTargetStr(e.target.value)}
                  placeholder={String(algo.defaultInput.target)} />
              </div>
            )}
            {algoKey === 'sliding-window' && (
              <div className="form-group" style={{ flex: '0 1 80px' }}>
                <label>K</label>
                <input className="form-input" value={kStr} onChange={(e) => setKStr(e.target.value)}
                  placeholder={String(algo.defaultInput.k)} />
              </div>
            )}
            <button className="btn btn-primary" onClick={run} style={{ minHeight: 40, alignSelf: 'end' }}>Run</button>
          </div>
        </div>
      )}

      {/* Visualization area */}
      <div className="card-white" style={{ padding: 16, marginBottom: 12, overflow: 'hidden' }}>
        {current.array && current.array.length > 0 && (
          <div className="viz-array-container" style={{
            display: 'flex', alignItems: 'end', gap: barGap,
            minHeight: 130, padding: '18px 4px 34px',
            overflowX: 'auto', overflowY: 'hidden',
            justifyContent: current.array.length < 8 ? 'center' : 'flex-start',
          }}>
            {current.array.map((val, idx) => {
              const isHL = current.highlights?.includes(idx);
              const pct = maxVal > 0 ? (val / maxVal) * 100 : 50;
              const ptrs = Object.entries(current.pointers || {}).filter(([, pos]) => pos === idx);
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flexShrink: 0 }}>
                  {ptrs.map(([name]) => {
                    const pc = POINTER_COLORS[name] || { bg: '#3b82f6', label: name };
                    return (
                      <span key={name} style={{
                        position: 'absolute', top: -20, fontSize: '0.65rem', fontWeight: 700,
                        color: pc.bg, background: 'white', padding: '0 4px', borderRadius: 3,
                        border: `1.5px solid ${pc.bg}`, lineHeight: 1.3, zIndex: 2,
                      }}>{pc.label}</span>
                    );
                  })}
                  <div style={{
                    width: barW, height: Math.max(18, pct),
                    background: isHL ? 'var(--primary)' : 'var(--surface-card)',
                    border: `1.5px solid ${isHL ? 'var(--primary)' : 'var(--hairline)'}`,
                    borderRadius: '4px 4px 0 0', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {barW >= 28 && (
                      <span style={{ color: isHL ? '#fff' : 'var(--ink)', fontWeight: 600, fontSize: barW >= 36 ? '0.75rem' : '0.6rem' }}>{val}</span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--muted)', marginTop: 3 }}>{idx}</span>
                </div>
              );
            })}
          </div>
        )}

        {current.stack && current.stack.length > 0 && (
          <div className="viz-stack-container" style={{
            display: 'flex', flexDirection: 'column-reverse', alignItems: 'center',
            minHeight: 100, padding: 12, gap: 4,
          }}>
            {current.stack.map((val, idx) => {
              const isTop = idx === current.stack.length - 1;
              const isHL = current.highlights?.includes(idx);
              return (
                <div key={idx} style={{
                  width: '60%', maxWidth: 160, padding: '6px 14px',
                  background: isHL ? 'var(--primary)' : isTop ? 'var(--surface-strong)' : 'var(--surface-card)',
                  border: `1.5px solid ${isHL ? 'var(--primary)' : isTop ? 'var(--ink)' : 'var(--hairline)'}`,
                  borderRadius: 6, textAlign: 'center',
                  color: isHL ? '#fff' : 'var(--ink)', fontWeight: isTop ? 700 : 400,
                  fontSize: '0.82rem', transition: 'all 0.15s',
                }}>
                  {val}
                </div>
              );
            })}
            {current.stack.length > 0 && (
              <div style={{ fontSize: '0.6rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: 4 }}>Stack</div>
            )}
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
          <button className="btn" onClick={reset} disabled={stepIdx === 0} style={{ fontSize: '0.78rem', padding: '0 12px', minHeight: 34 }}>Reset</button>
          <button className="btn" onClick={stepBack} disabled={stepIdx === 0} style={{ fontSize: '0.78rem', padding: '0 12px', minHeight: 34 }}>Step Back</button>
          {!playing ? (
            <button className="btn btn-primary" onClick={play} disabled={stepIdx >= steps.length - 1 || totalSteps === 0}
              style={{ fontSize: '0.78rem', padding: '0 12px', minHeight: 34 }}>
              Play
            </button>
          ) : (
            <button className="btn" onClick={pause} style={{ fontSize: '0.78rem', padding: '0 12px', minHeight: 34 }}>Pause</button>
          )}
          <button className="btn" onClick={stepForward} disabled={stepIdx >= steps.length - 1 || totalSteps === 0}
            style={{ fontSize: '0.78rem', padding: '0 12px', minHeight: 34 }}>
            Step
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 600 }}>Speed</span>
            <input type="range" min="100" max="1500" value={1600 - speed}
              onChange={(e) => setSpeed(1600 - parseInt(e.target.value, 10))}
              style={{ width: 64 }} />
          </div>
        </div>
        {totalSteps > 0 && (
          <div style={{ display: 'flex', gap: 1.5, justifyContent: 'center', marginTop: 6 }}>
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} onClick={() => { setPlaying(false); setStepIdx(i); }} style={{
                flex: 1, maxWidth: 6, height: 3, borderRadius: 2,
                background: i < stepIdx ? 'var(--primary)' : i === stepIdx ? 'var(--brand-accent)' : 'var(--hairline)',
                cursor: 'pointer', transition: 'background 0.15s',
              }} />
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--muted)', marginTop: 4 }}>
          Step {Math.min(stepIdx + 1, totalSteps)} / {totalSteps}
        </div>
      </div>

      {/* Code + Console */}
      <div className="viz-panels" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="card-soft" style={{ padding: 12, overflow: 'auto' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Code</div>
          {algo.code.map((line, idx) => (
            <div key={idx} style={{
              padding: '3px 6px', borderRadius: 3, marginBottom: 1,
              fontFamily: "'SF Mono','Consolas','Menlo',monospace", fontSize: '0.78rem',
              lineHeight: 1.45, whiteSpace: 'pre-wrap',
              background: idx === current.codeLine ? 'rgba(59,130,246,0.12)' : 'transparent',
              borderLeft: idx === current.codeLine ? '3px solid #3b82f6' : '3px solid transparent',
              color: idx === current.codeLine ? 'var(--ink)' : 'var(--body)',
              fontWeight: idx === current.codeLine ? 600 : 400,
              transition: 'all 0.15s',
            }}>{line}</div>
          ))}
        </div>
        <div className="card-soft" style={{ padding: 12, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Console</div>
          <div className="console-log" style={{
            fontFamily: "'SF Mono','Consolas','Menlo',monospace", fontSize: '0.78rem',
            lineHeight: 1.5, color: 'var(--body)', flex: 1,
            overflowY: 'auto', maxHeight: 150,
            padding: 6, borderRadius: 4, background: 'var(--surface-soft)',
            border: '1px solid var(--hairline)',
          }}>
            {steps.slice(0, stepIdx + 1).map((s, i) => (
              <div key={i} style={{
                padding: '1px 0',
                color: s.done ? 'var(--success)' : i === stepIdx ? 'var(--ink)' : 'var(--muted)',
                fontWeight: i === stepIdx ? 600 : 400,
              }}>
                {i > 0 && <span style={{ color: 'var(--muted-soft)', marginRight: 4 }}>{'>'}</span>}
                {s.log}
              </div>
            ))}
            {steps.length === 0 && <span style={{ color: 'var(--muted)' }}>Run to see steps</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

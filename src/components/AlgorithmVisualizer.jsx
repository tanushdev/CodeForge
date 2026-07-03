import { useState, useRef, useEffect, useCallback } from 'react';
import { visualizations } from '../data/visualizations';

const POINTER_COLORS = {
  L: { bg: '#ef4444', label: 'L' },
  R: { bg: '#ef4444', label: 'R' },
  M: { bg: '#f59e0b', label: 'M' },
  i: { bg: '#3b82f6', label: 'i' },
  j: { bg: '#8b5cf6', label: 'j' },
  min: { bg: '#10b981', label: 'min' },
  start: { bg: '#3b82f6', label: 'start' },
  end: { bg: '#ef4444', label: 'end' },
};

function getMaxVal(arr) {
  let m = 1;
  for (const v of arr) if (v > m) m = v;
  return m || 1;
}

export default function AlgorithmVisualizer() {
  const [algoKey, setAlgoKey] = useState('binary-search');
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [inputStr, setInputStr] = useState('');
  const [targetStr, setTargetStr] = useState('');
  const [kStr, setKStr] = useState('');
  const timerRef = useRef(null);

  const algo = visualizations[algoKey];
  const current = steps[stepIdx] || { array: [], pointers: {}, highlights: [], codeLine: 0, log: '', done: false };
  const maxVal = getMaxVal(current.array);
  const totalSteps = steps.length;
  const pointerMap = algo?.pointerMap || {};

  const run = useCallback(() => {
    const def = algo.defaultInput;
    let arr, extra;
    try {
      arr = JSON.parse(inputStr || JSON.stringify(def.arr));
      if (algoKey === 'binary-search' || algoKey === 'linear-search' || algoKey === 'two-pointers') {
        const t = parseInt(targetStr || def.target, 10);
        if (isNaN(t)) throw new Error('Invalid target');
        if (algoKey === 'two-pointers') {
          extra = t;
        } else {
          extra = t;
        }
      } else if (algoKey === 'sliding-window') {
        const k = parseInt(kStr || def.k, 10);
        if (isNaN(k) || k < 1) throw new Error('Invalid window size');
        extra = k;
      }
    } catch {
      arr = [...def.arr];
      extra = algoKey === 'sliding-window' ? def.k : def.target;
    }
    const generated = algo.generateSteps(arr, extra);
    setSteps(generated);
    setStepIdx(0);
    setPlaying(false);
  }, [algoKey, inputStr, targetStr, kStr, algo]);

  useEffect(() => {
    run();
  }, [algoKey]);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStepIdx((prev) => {
          const next = prev + 1;
          if (next >= steps.length - 1) {
            setPlaying(false);
            return steps.length - 1;
          }
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

  const barW = Math.max(28, Math.min(60, Math.floor(680 / current.array.length)));
  const barGap = Math.max(2, Math.min(6, barW > 40 ? 6 : 4));

  return (
    <div className="viz-container">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {Object.entries(visualizations).map(([key, v]) => (
          <button key={key} className={`btn ${algoKey === key ? 'btn-primary' : ''}`}
            onClick={() => { setAlgoKey(key); setPlaying(false); }}>
            {v.title}
          </button>
        ))}
      </div>

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

      <div className="card-white" style={{ padding: 20, marginBottom: 14, overflow: 'hidden' }}>
        <div className="viz-array-container" style={{
          display: 'flex', alignItems: 'end', gap: barGap,
          minHeight: 160, padding: '20px 4px 40px',
          overflowX: 'auto', overflowY: 'hidden',
          justifyContent: current.array.length < 8 ? 'center' : 'flex-start',
        }}>
          {current.array.map((val, idx) => {
            const isHighlighted = current.highlights.includes(idx);
            const pct = maxVal > 0 ? (val / maxVal) * 100 : 50;
            const ptrs = Object.entries(current.pointers).filter(([, pos]) => pos === idx);
            return (
              <div key={idx} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                position: 'relative', flexShrink: 0,
              }}>
                {ptrs.map(([name]) => {
                  const pc = POINTER_COLORS[name] || { bg: '#3b82f6', label: name };
                  return (
                    <span key={name} style={{
                      position: 'absolute', top: -22, fontSize: '0.7rem', fontWeight: 700,
                      color: pc.bg, background: 'white', padding: '0 4px', borderRadius: 3,
                      border: `1.5px solid ${pc.bg}`, lineHeight: 1.4,
                    }}>{pc.label}</span>
                  );
                })}
                <div style={{
                  width: barW, height: Math.max(20, pct * 1.2),
                  background: isHighlighted ? 'var(--primary)' : 'var(--surface-card)',
                  border: `1.5px solid ${isHighlighted ? 'var(--primary)' : 'var(--hairline)'}`,
                  borderRadius: '4px 4px 0 0',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  {barW >= 32 && (
                    <span style={{
                      color: isHighlighted ? '#fff' : 'var(--ink)',
                      fontWeight: 600, fontSize: barW >= 40 ? '0.8rem' : '0.65rem',
                    }}>{val}</span>
                  )}
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: 4 }}>{idx}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
          <button className="btn" onClick={reset} disabled={stepIdx === 0} title="Reset">Reset</button>
          <button className="btn" onClick={stepBack} disabled={stepIdx === 0} title="Step Back">Step Back</button>
          {!playing ? (
            <button className="btn btn-primary" onClick={play} disabled={stepIdx >= steps.length - 1 || totalSteps === 0}>
              Play
            </button>
          ) : (
            <button className="btn" onClick={pause}>Pause</button>
          )}
          <button className="btn" onClick={stepForward} disabled={stepIdx >= steps.length - 1 || totalSteps === 0} title="Step">
            Step
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>Speed</span>
            <input type="range" min="100" max="1500" value={1600 - speed}
              onChange={(e) => setSpeed(1600 - parseInt(e.target.value, 10))}
              style={{ width: 80 }} />
          </div>
        </div>
        {totalSteps > 0 && (
          <div style={{
            display: 'flex', gap: 2, justifyContent: 'center', marginBottom: 6,
          }}>
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} onClick={() => { setPlaying(false); setStepIdx(i); }} style={{
                flex: 1, maxWidth: 8, height: 4, borderRadius: 2,
                background: i < stepIdx ? 'var(--primary)' : i === stepIdx ? 'var(--brand-accent)' : 'var(--hairline)',
                cursor: 'pointer', transition: 'background 0.15s',
              }} />
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--muted)' }}>
          Step {Math.min(stepIdx + 1, totalSteps)} / {totalSteps}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}
        className="viz-panels">
        <div className="card-soft" style={{ padding: 14, overflow: 'auto' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>
            Code
          </div>
          {algo.code.map((line, idx) => (
            <div key={idx} style={{
              padding: '4px 8px', borderRadius: 4, marginBottom: 2,
              fontFamily: "'SF Mono','Consolas','Menlo',monospace", fontSize: '0.82rem',
              lineHeight: 1.5, whiteSpace: 'pre-wrap',
              background: idx === current.codeLine ? 'rgba(59,130,246,0.12)' : 'transparent',
              borderLeft: idx === current.codeLine ? '3px solid #3b82f6' : '3px solid transparent',
              color: idx === current.codeLine ? 'var(--ink)' : 'var(--body)',
              fontWeight: idx === current.codeLine ? 600 : 400,
              transition: 'all 0.15s',
            }}>{line}</div>
          ))}
        </div>
        <div className="card-soft" style={{ padding: 14, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>
            Console
          </div>
          <div className="console-log" style={{
            fontFamily: "'SF Mono','Consolas','Menlo',monospace", fontSize: '0.82rem',
            lineHeight: 1.55, color: 'var(--body)', flex: 1,
            overflowY: 'auto', maxHeight: 200,
            padding: 8, borderRadius: 6, background: 'var(--surface-soft)',
            border: '1px solid var(--hairline)',
          }}>
            {steps.slice(0, stepIdx + 1).map((s, i) => (
              <div key={i} style={{
                padding: '2px 0',
                color: s.done ? 'var(--success)' : i === stepIdx ? 'var(--ink)' : 'var(--muted)',
                fontWeight: i === stepIdx ? 600 : 400,
              }}>
                {i > 0 && <span style={{ color: 'var(--muted-soft)', marginRight: 6 }}>{'>'}</span>}
                {s.log}
              </div>
            ))}
            {steps.length === 0 && <span style={{ color: 'var(--muted)' }}>No steps generated.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

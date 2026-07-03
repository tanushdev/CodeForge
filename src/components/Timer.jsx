import { useState, useRef, useCallback, useEffect } from 'react';

const PRESETS = [25, 30, 45];

export default function Timer({ onComplete }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);
  const presetRef = useRef(25);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
  }, []);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const start = () => {
    if (done) {
      setMinutes(presetRef.current);
      setSeconds(0);
      setDone(false);
    }
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s > 0) return s - 1;
        setMinutes((m) => {
          if (m <= 0) {
            stop();
            setDone(true);
            onComplete?.();
            return 0;
          }
          return m - 1;
        });
        return 59;
      });
    }, 1000);
  };

  const reset = () => {
    stop();
    setMinutes(presetRef.current);
    setSeconds(0);
    setDone(false);
  };

  const total = presetRef.current * 60;
  const elapsed = total - (minutes * 60 + seconds);
  const pct = total > 0 ? (elapsed / total) * 100 : 0;

  return (
    <div className="timer">
      <div className="timer-presets">
        {PRESETS.map((p) => (
          <button key={p} className={`btn${minutes === p && !running ? ' active' : ''}`}
            onClick={() => { if (!running) { setMinutes(p); presetRef.current = p; } }}
            disabled={running}>
            {p} min
          </button>
        ))}
      </div>
      <div className={`timer-display${done ? ' timer-done' : ''}${running && minutes === 0 && seconds <= 10 ? ' timer-warning' : ''}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      {running && (
        <div className="timer-bar-track">
          <div className="timer-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      )}
      <div className="timer-actions">
        {!running ? (
          <button className="btn btn-primary" onClick={start}>
            {done ? 'Restart' : 'Start'}
          </button>
        ) : (
          <button className="btn" onClick={stop}>Pause</button>
        )}
        {running && <button className="btn" onClick={reset}>Reset</button>}
      </div>
      {done && <p className="timer-message">Time is up!</p>}
    </div>
  );
}

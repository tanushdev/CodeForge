import { useState } from 'react';
import { numericalLabs } from '../data';

function LabViewer({ lab }) {
  const [step, setStep] = useState(0);
  const current = lab.steps[step];

  return (
    <div className="card-white" style={{ padding: 20, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', marginBottom: 4, color: 'var(--ink)', fontWeight: 600 }}>{lab.title}</h3>
          <span className="tag tag-success">{lab.pattern}</span>
        </div>
        <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{lab.complexity}</span>
      </div>

      {/* Theory / explanation */}
      <div style={{ padding: 14, borderRadius: 8, border: '1px solid var(--hairline)', marginBottom: 12, background: 'var(--surface-soft)' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>How it works</div>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.55, margin: 0, color: 'var(--body)' }}>{lab.theory}</p>
      </div>

      {/* Formula */}
      <div style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--hairline)', marginBottom: 12, background: 'var(--surface-soft)' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Core formula</div>
        <p style={{ color: 'var(--ink)', fontSize: '0.9rem', margin: 0, fontFamily: 'monospace', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{lab.formula}</p>
      </div>

      {/* Intuition (one-liner) */}
      {lab.intuition && (
        <div style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--hairline)', marginBottom: 12, background: 'var(--surface-soft)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Why this works</div>
          <p style={{ color: 'var(--body)', fontSize: '0.88rem', margin: 0, fontStyle: 'italic' }}>{lab.intuition}</p>
        </div>
      )}

      <div className="code-block" style={{ marginBottom: 16 }}>
        {lab.input}
      </div>

      {/* Step visualization */}
      <div className="lab-steps-grid">
        <div style={{ padding: 14, borderRadius: 8, border: '1px solid var(--hairline)', background: 'var(--surface-soft)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Step {step + 1}</div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              display: 'grid', placeItems: 'center', width: 26, height: 26, borderRadius: '50%',
              background: 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0,
            }}>
              {step + 1}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.5, margin: 0, color: 'var(--body)' }}>{current?.desc}</p>
              {current?.formula && (
                <div style={{
                  marginTop: 8, padding: '8px 10px', borderRadius: 6,
                  border: '1px solid var(--hairline)', background: 'var(--canvas)', fontFamily: 'monospace', fontSize: '0.82rem',
                  color: 'var(--ink)', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Formula: </span>
                  {current.formula}
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ padding: 14, borderRadius: 8, border: '1px solid var(--hairline)', background: 'var(--surface-soft)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>State</div>
          <div className="code-block" style={{ margin: 0 }}>
            {current?.state}
          </div>
        </div>
      </div>

      {/* Step progress bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, alignItems: 'center' }}>
        {lab.steps.map((_, i) => (
          <button key={i} onClick={() => setStep(i)}
            style={{
              flex: 1, height: 6, border: 0, borderRadius: 999, cursor: 'pointer',
              background: i === step ? 'var(--primary)' : i < step ? 'var(--success)' : 'var(--hairline)',
              transition: 'background 0.2s',
            }} />
        ))}
      </div>

      {/* Intuition bottom */}
      {lab.intuitionBottom && (
        <div style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', marginBottom: 14, background: 'rgba(239,68,68,0.04)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--error)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Key takeaway</div>
          <p style={{ color: 'var(--error)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>{lab.intuitionBottom}</p>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button className="btn" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          Previous
        </button>
        <span style={{ color: 'var(--muted)', fontSize: '0.85rem', alignSelf: 'center' }}>
          Step {step + 1} of {lab.steps.length}
        </span>
        <button className="btn btn-primary" onClick={() => setStep(Math.min(lab.steps.length - 1, step + 1))} disabled={step === lab.steps.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
}

export default function Labs() {
  const [open, setOpen] = useState(null);

  return (
    <div className="page">
      <div className="page-header">
        <p className="eyebrow">Solved area</p>
        <h1>Numerical dry runs</h1>
        <p>Worked examples with step-by-step state visualization. Follow the input, watch the state change, then solve a similar problem.</p>
      </div>

      <div className="grid-2">
        {numericalLabs.map((lab, i) => (
          <div key={i}>
            {open === i ? (
              <LabViewer lab={lab} />
            ) : (
              <div className="card-white" style={{ padding: 18, cursor: 'pointer' }} onClick={() => setOpen(i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                  <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--ink)', fontWeight: 600 }}>{lab.title}</h3>
                  <span className="tag tag-success" style={{ whiteSpace: 'nowrap' }}>{lab.pattern}</span>
                </div>
                {lab.intuition && (
                  <p style={{ color: 'var(--body)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 8, fontStyle: 'italic' }}>
                    {lab.intuition}
                  </p>
                )}
                <div className="code-block" style={{ marginBottom: 8 }}>
                  {lab.input}
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>
                  {lab.steps.length} steps . {lab.complexity}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

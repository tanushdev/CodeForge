import { useEffect, useRef, useState } from 'react';

function archToMermaid(arch) {
  const lines = arch.split('\n').filter(Boolean);
  const mainLine = lines.find(l => l.includes('-->'));
  if (!mainLine) return null;

  const parts = mainLine.split('-->').map(s => s.trim());
  const nodes = parts.map((p, i) => {
    const label = p.replace(/^\[|\]$/g, '');
    return `n${i}["${label.replace(/"/g, '\\"')}"]`;
  });
  const edges = [];
  for (let i = 0; i < parts.length - 1; i++) {
    edges.push(`n${i} --> n${i + 1}`);
  }

  return `flowchart LR
  ${nodes.join('\n  ')}
  ${edges.join('\n  ')}`;
}

export default function MermaidDiagram({ chart }) {
  const ref = useRef(null);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const [key, setKey] = useState(0);
  const initialized = useRef(false);

  useEffect(() => {
    let mermaidInstance = null;
    let mounted = true;

    (async () => {
      const mod = await import('mermaid');
      mermaidInstance = mod.default;

      if (!initialized.current) {
        mermaidInstance.initialize({
          startOnLoad: false,
          theme: 'default',
          themeVariables: {
            background: '#ffffff',
            primaryColor: '#f5f5f5',
            primaryTextColor: '#111111',
            primaryBorderColor: '#e5e7eb',
            lineColor: '#111111',
            secondaryColor: '#ffffff',
            tertiaryColor: '#f8f9fa',
            mainBkg: '#f5f5f5',
            nodeBorder: '#e5e7eb',
            clusterBkg: '#ffffff',
            clusterBorder: '#e5e7eb',
            titleColor: '#111111',
            edgeLabelBackground: '#ffffff',
            nodeTextColor: '#111111',
          },
          flowchart: { htmlLabels: true, curve: 'basis', padding: 16 },
        });
        initialized.current = true;
      }

      if (mounted) setReady(true);
    })();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!ready || !ref.current) return;

    const render = async () => {
      setError(null);
      ref.current.removeAttribute('data-processed');
      try {
        const mod = await import('mermaid');
        await mod.default.run({ nodes: [ref.current], suppressErrors: true });
      } catch (err) {
        setError(err.message || 'Failed to render diagram');
      }
    };
    render();
    setKey(k => k + 1);
  }, [chart, ready]);

  const mmd = archToMermaid(chart);
  if (!mmd) {
    return (
      <div className="code-block" style={{ marginBottom: 16, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
        {chart.split('\n').filter(Boolean).map((p, i) => <div key={i}>{p}</div>)}
      </div>
    );
  }

  return (
    <div style={{ overflow: 'auto', padding: '16px 0' }}>
      {!ready && <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Loading diagram...</div>}
      {error && (
        <div className="code-block" style={{ marginBottom: 8, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
          {chart.split('\n').filter(Boolean).map((p, i) => <div key={i}>{p}</div>)}
        </div>
      )}
      <div key={key} className="mermaid" ref={ref} style={{ display: error || !ready ? 'none' : 'block' }}>
        {mmd}
      </div>
    </div>
  );
}

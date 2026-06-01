export default function BatchProgress({ progress }) {
  const { current, total, currentLabel, results } = progress;
  const pct = total ? Math.round((current / total) * 100) : 0;

  return (
    <div style={{ border: '1px solid var(--border-soft)', borderLeft: '4px solid var(--gold)', background: 'var(--paper)' }}>
      <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>Batch Running</span>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>{current} / {total}</span>
      </div>
      <div style={{ padding: '12px 20px' }}>
        <div className="progress-track" style={{ marginBottom: 8 }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--gold)' }} />
        </div>
        {currentLabel && (
          <p style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 10 }}>↳ {currentLabel}</p>
        )}
        {results.length > 0 && (
          <div style={{ maxHeight: 120, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {results.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10 }}>
                <span style={{ color: r.error ? 'var(--strike)' : 'var(--jade)', fontWeight: 700 }}>
                  {r.error ? '✕' : '✓'}
                </span>
                <span style={{ color: 'var(--muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.topic}
                </span>
                {r.modelUsed && <span style={{ color: 'var(--warm-gray)', fontSize: 9 }}>{r.modelUsed}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
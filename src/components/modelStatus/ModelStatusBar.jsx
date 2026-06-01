import { useModelStatus } from '../../hooks/useModelStatus';
import { MODELS } from '../../config/models';

function fmt(ms) {
  if (!ms) return null;
  const diff = Math.max(0, ms - Date.now());
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return diff > 3600000 ? `${Math.floor(diff / 3600000)}h` : `${m}m ${s}s`;
}

export default function ModelStatusBar() {
  const { modelStatus } = useModelStatus();

  return (
    <div className="fade-up" style={{ border: '1px solid var(--border-soft)', marginBottom: 0 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 16px', background: 'var(--ink)'
      }}>
        <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--warm-gray)' }}>
          Model Status
        </span>
        <span style={{ fontSize: 9, color: 'var(--muted)' }}>live feed</span>
      </div>

      {/* Model rows */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {Object.values(MODELS).map((model, i) => {
          const s = modelStatus[model.id];
          const exhausted = s?.isExhausted && s.resetAt > Date.now();
          const pct = Math.min(100, ((s?.dailyCount || 0) / 50) * 100);

          return (
            <div key={model.id} className="model-cell" style={{
              borderRight: i < 3 ? '1px solid var(--border-soft)' : 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.04em' }}>
                  {model.name}
                </span>
                <span style={{
                  fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: exhausted ? 'var(--strike)' : 'var(--jade)',
                  fontWeight: 500,
                }}>
                  {exhausted ? `↺ ${fmt(s.resetAt)}` : 'active'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="progress-track" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{
                    width: `${pct}%`,
                    background: exhausted ? 'var(--strike)' : 'var(--ink)'
                  }} />
                </div>
                <span style={{ fontSize: 9, color: 'var(--muted)', minWidth: 24, textAlign: 'right' }}>
                  {s?.dailyCount || 0}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
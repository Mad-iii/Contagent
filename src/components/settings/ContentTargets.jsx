import { useStore } from '../../store/contentStore';
import { CONTENT_TYPES } from '../../config/taskRoutes';

export default function ContentTargets() {
  const { state, dispatch } = useStore();

  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>
        Monthly Targets — pieces per channel
      </div>
      {Object.values(CONTENT_TYPES).map((ct) => (
        <div key={ct.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-soft)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, background: ct.color, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 11 }}>{ct.label}</span>
          </div>
          <input
            type="number" min={0} max={200}
            value={state.monthlyTargets[ct.id] ?? ct.monthlyTarget}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              if (!isNaN(n) && n >= 0) dispatch({ type: 'SET_MONTHLY_TARGETS', payload: { [ct.id]: n } });
            }}
            style={{
              width: 64, textAlign: 'center',
              background: 'var(--paper)',
              border: '1px solid var(--border-soft)',
              borderBottom: '2px solid var(--ink)',
              padding: '4px 8px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              outline: 'none',
            }}
          />
        </div>
      ))}
    </div>
  );
}
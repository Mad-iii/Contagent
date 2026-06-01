import { useState } from 'react';
import { useModelStatus } from '../../hooks/useModelStatus';
import { MODELS } from '../../config/models';
import { CONTENT_TYPES } from '../../config/taskRoutes';
import { X } from 'lucide-react';

export default function QuotaWarning() {
  const { warnings } = useModelStatus();
  const [dismissed, setDismissed] = useState([]);
  const visible = warnings.filter((id) => !dismissed.includes(id));
  if (!visible.length) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      {visible.map((modelId) => {
        const model = MODELS[modelId];
        const affected = Object.values(CONTENT_TYPES)
          .filter((ct) => ct.primary === modelId)
          .map((ct) => ct.label);
        return (
          <div key={modelId} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 16px',
            background: '#fff8e6',
            border: '1px solid var(--gold)',
            borderLeft: '4px solid var(--gold)',
            marginBottom: 6,
          }}>
            <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>
              ⚠ Quota
            </span>
            <span style={{ fontSize: 11, flex: 1 }}>
              <strong>{model.name}</strong> nearing limit — {affected.join(', ')} may failover.
            </span>
            <button onClick={() => setDismissed(d => [...d, modelId])}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
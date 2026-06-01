import { FileText, Mail, Share2, Megaphone, Layout, BookOpen } from 'lucide-react';
import { CONTENT_TYPES } from '../../config/taskRoutes';
import { MODELS } from '../../config/models';
import { useModelStatus } from '../../hooks/useModelStatus';

const ICONS = { FileText, Mail, Share2, Megaphone, Layout, BookOpen };

export default function ChannelSelector({ selected, onChange }) {
  const { modelStatus } = useModelStatus();

  const getRoutedModel = (ct) => {
    const chain = [ct.primary, ...ct.fallbacks];
    for (const id of chain) {
      if (!modelStatus[id]?.isExhausted) return MODELS[id];
    }
    return MODELS[chain[chain.length - 1]];
  };

  return (
    <div className="channel-grid">
      {Object.values(CONTENT_TYPES).map((ct) => {
        const Icon = ICONS[ct.icon] || FileText;
        const model = getRoutedModel(ct);
        const active = selected === ct.id;

        return (
          <button
            key={ct.id}
            onClick={() => onChange(ct.id)}
            className={`channel-card ${active ? 'active' : ''}`}
            style={{ textAlign: 'left' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Icon size={13} style={{ color: ct.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.04em' }}>{ct.label}</span>
            </div>
            <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.04em', marginBottom: 8 }}>
              {ct.description}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: model?.color, display: 'inline-block' }} />
              <span style={{ fontSize: 8, color: 'var(--warm-gray)', letterSpacing: '0.08em' }}>{model?.name}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
import { useState } from 'react';
import { Zap } from 'lucide-react';
import BatchProgress from './BatchProgress';
import { useContentGeneration } from '../../hooks/useContentGeneration';
import { rateLimiter } from '../../utils/rateLimiter';

const BATCH_PRESETS = [
  {
    id: 'weekly-social',
    label: "Weekly Social Posts",
    description: '7 social posts, one per day',
    items: Array.from({ length: 7 }, (_, i) => ({
      contentType: 'social', topic: `Day ${i + 1} social post for the week`, tone: 'conversational',
    })),
  },
  {
    id: 'email-sequence',
    label: '5-Part Email Sequence',
    description: 'Welcome, value, case study, objection, CTA',
    items: [
      { contentType: 'email', topic: 'Welcome email — introduce the brand', tone: 'conversational' },
      { contentType: 'email', topic: 'Value email — teach one high-impact concept', tone: 'professional' },
      { contentType: 'email', topic: 'Case study email — customer win with ROI', tone: 'empathetic' },
      { contentType: 'email', topic: 'Objection email — address top 3 hesitations', tone: 'bold' },
      { contentType: 'email', topic: 'CTA email — direct offer with urgency', tone: 'urgent' },
    ],
  },
  {
    id: 'ad-set',
    label: 'Ad Copy Set',
    description: '4 ad variants for A/B testing',
    items: ['benefit-led', 'fear-of-missing-out', 'social-proof', 'direct-offer'].map((angle) => ({
      contentType: 'ad', topic: `Ad copy using ${angle} angle`, tone: 'bold',
    })),
  },
];

export default function BatchGenerator() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentLabel: '', results: [] });
  const { generate, saveContent } = useContentGeneration();

  const runBatch = async (preset) => {
    setRunning(true);
    const results = [];
    setProgress({ current: 0, total: preset.items.length, currentLabel: '', results: [] });
    for (let i = 0; i < preset.items.length; i++) {
      const item = preset.items[i];
      setProgress((p) => ({ ...p, current: i, currentLabel: item.topic }));
      try {
        const result = await generate(item);
        saveContent(item);
        results.push({ ...item, ...result, saved: true });
      } catch (err) {
        results.push({ ...item, error: err.message });
      }
      await rateLimiter.throttle('gemini');
      setProgress((p) => ({ ...p, results: [...results] }));
    }
    setProgress((p) => ({ ...p, current: preset.items.length, currentLabel: 'Complete' }));
    setRunning(false);
  };

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid var(--border-soft)' }}>
        <span className="section-number">04</span>
        <div>
          <div className="section-title">Batch Generator</div>
          <div className="section-sub">Full content sets with auto rate-limiting</div>
        </div>
      </div>

      {running && <div style={{ marginBottom: 24 }}><BatchProgress progress={progress} /></div>}

      <div className="batch-list">
        {BATCH_PRESETS.map((preset, i) => (
          <div key={preset.id} className={`batch-card fade-up fade-up-${i + 1}`}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.02em', marginBottom: 4 }}>{preset.label}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>{preset.description}</div>
              <div style={{ fontSize: 9, color: 'var(--warm-gray)', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {preset.items.length} pieces
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => runBatch(preset)}
              disabled={running}
            >
              <Zap size={12} />
              Run Batch
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
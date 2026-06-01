import { useState } from 'react';
import { Copy, Save, CheckCircle, Cpu } from 'lucide-react';
import { MODELS } from '../../config/models';
import { copyToClipboard } from '../../utils/contentFormatter';
import { countWords, estimateReadTime } from '../../utils/seoHelpers';

export default function OutputPanel({ output, modelUsed, isFailover, failoverFrom, loading, error, onSave }) {
  const [copied, setCopied] = useState(false);
  const model = modelUsed ? MODELS[modelUsed] : null;

  const handleCopy = async () => {
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 16, border: '1px solid var(--border-soft)', borderLeft: '4px solid var(--strike)',
      minHeight: 360, background: 'var(--paper)'
    }}>
      <div style={{
        width: 24, height: 24,
        border: '2px solid var(--ink)', borderTopColor: 'transparent',
        borderRadius: '50%'
      }} className="spin" />
      <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }} className="cursor">
        Generating
      </span>
    </div>
  );

  if (error) return (
    <div style={{
      border: '1px solid var(--border-soft)', borderLeft: '4px solid var(--strike)',
      padding: 24, background: '#fff5f5'
    }}>
      <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--strike)', marginBottom: 8, fontWeight: 600 }}>
        Generation failed
      </div>
      <p style={{ fontSize: 12, color: 'var(--ink)' }}>{error}</p>
      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>Check your API keys in Settings.</p>
    </div>
  );

  if (!output) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 12, border: '1px dashed var(--border-soft)', minHeight: 360
    }}>
      <Cpu size={28} style={{ color: 'var(--warm-gray)', opacity: 0.4 }} />
      <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--warm-gray)' }}>
        Output will appear here
      </span>
    </div>
  );

  return (
    <div className="output-panel">
      <div className="output-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {model && (
            <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: model.color, fontWeight: 600 }}>
              {isFailover ? `↪ Failover → ${model.name}` : model.name}
            </span>
          )}
          {isFailover && failoverFrom.length > 0 && (
            <span style={{ fontSize: 9, color: 'var(--muted)' }}>
              (skipped: {failoverFrom.map((id) => MODELS[id]?.name).join(', ')})
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 9, color: 'var(--muted)' }}>
            {countWords(output)}w · {estimateReadTime(output)}
          </span>
          <button className="btn btn-ghost" onClick={handleCopy} style={{ padding: '4px 10px', fontSize: 9 }}>
            {copied ? <CheckCircle size={11} style={{ color: 'var(--jade)' }} /> : <Copy size={11} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          {onSave && (
            <button className="btn btn-primary" onClick={onSave} style={{ padding: '4px 10px', fontSize: 9 }}>
              <Save size={11} /> Save
            </button>
          )}
        </div>
      </div>
      <div className="output-body">{output}</div>
    </div>
  );
}
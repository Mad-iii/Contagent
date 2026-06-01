import { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { useStore } from '../../store/contentStore';

const FIELDS = [
  { key: 'gemini', label: 'Gemini Flash', hint: 'aistudio.google.com', placeholder: 'AIza…' },
  { key: 'grok', label: 'Grok (xAI)', hint: 'console.x.ai', placeholder: 'xai-…' },
  { key: 'openrouter', label: 'OpenRouter', hint: 'openrouter.ai — covers Mistral & Llama', placeholder: 'sk-or-…' },
];

export default function ApiKeySettings() {
  const { state, dispatch } = useStore();
  const [show, setShow] = useState({});
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>
        API Keys — stored locally in browser only
      </div>
      {FIELDS.map(({ key, label, hint, placeholder }) => (
        <div key={key} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: 9, color: 'var(--muted)' }}>{hint}</span>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={show[key] ? 'text' : 'password'}
              className="input"
              value={state.apiKeys[key] || ''}
              onChange={(e) => dispatch({ type: 'SET_API_KEYS', payload: { [key]: e.target.value } })}
              placeholder={placeholder}
              style={{ paddingRight: 40 }}
            />
            <button onClick={() => setShow(s => ({ ...s, [key]: !s[key] }))} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)'
            }}>
              {show[key] ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>
      ))}
      <button className="btn btn-primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
        {saved && <Check size={12} />} {saved ? 'Saved!' : 'Save Keys'}
      </button>
    </div>
  );
}
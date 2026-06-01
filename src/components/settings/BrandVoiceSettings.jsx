import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useBrandVoice } from '../../hooks/useBrandVoice';

export default function BrandVoiceSettings() {
  const { brandVoice, update } = useBrandVoice();
  const [kwInput, setKwInput] = useState('');
  const [fwInput, setFwInput] = useState('');

  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>
        Brand Voice — injected into every prompt
      </div>

      {[{ key: 'name', label: 'Brand Name', placeholder: 'Acme Corp' }, { key: 'tagline', label: 'Tagline', placeholder: 'We make things better' }].map(({ key, label, placeholder }) => (
        <div key={key} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, marginBottom: 6 }}>{label}</div>
          <input className="input" value={brandVoice[key] || ''} onChange={(e) => update({ [key]: e.target.value })} placeholder={placeholder} />
        </div>
      ))}

      {[
        { label: 'Brand Keywords', inputVal: kwInput, setInput: setKwInput, field: 'keywords', btnStyle: { background: 'var(--ink)' }, tagStyle: { color: 'var(--jade)', borderColor: 'var(--jade)' } },
        { label: 'Forbidden Words', inputVal: fwInput, setInput: setFwInput, field: 'forbiddenWords', btnStyle: { background: 'var(--strike)' }, tagStyle: { color: 'var(--strike)', borderColor: 'var(--strike)' } },
      ].map(({ label, inputVal, setInput, field, btnStyle, tagStyle }) => (
        <div key={field} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, marginBottom: 8 }}>{label}</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <input className="input" style={{ flex: 1 }} value={inputVal}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && inputVal.trim()) { update({ [field]: [...(brandVoice[field] || []), inputVal.trim()] }); setInput(''); }}}
              placeholder="Add…" />
            <button className="btn" style={{ ...btnStyle, color: 'white', padding: '8px 14px' }}
              onClick={() => { if (inputVal.trim()) { update({ [field]: [...(brandVoice[field] || []), inputVal.trim()] }); setInput(''); }}}>
              <Plus size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(brandVoice[field] || []).map((w) => (
              <span key={w} className="tag" style={{ ...tagStyle, background: 'transparent', gap: 4, cursor: 'default' }}>
                {w}
                <button onClick={() => update({ [field]: brandVoice[field].filter((k) => k !== w) })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex', alignItems: 'center' }}>
                  <X size={9} />
                </button>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
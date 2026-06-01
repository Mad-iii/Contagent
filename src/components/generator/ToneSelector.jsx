const TONES = [
  { id: 'professional', label: 'Professional' },
  { id: 'conversational', label: 'Conversational' },
  { id: 'witty', label: 'Witty' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'empathetic', label: 'Empathetic' },
  { id: 'bold', label: 'Bold' },
];

export default function ToneSelector({ selected, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {TONES.map((tone) => (
        <button
          key={tone.id}
          onClick={() => onChange(tone.id)}
          className={`tone-pill ${selected === tone.id ? 'active' : ''}`}
        >
          {tone.label}
        </button>
      ))}
    </div>
  );
}
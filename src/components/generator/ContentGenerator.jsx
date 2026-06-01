import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import ChannelSelector from './ChannelSelector';
import ToneSelector from './ToneSelector';
import OutputPanel from './OutputPanel';
import { useContentGeneration } from '../../hooks/useContentGeneration';

export default function ContentGenerator() {
  const [contentType, setContentType] = useState('blog');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [additionalContext, setAdditionalContext] = useState('');

  const { generate, saveContent, output, modelUsed, isFailover, failoverFrom, loading, error } =
    useContentGeneration();

  return (
    <div className="fade-up">
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid var(--border-soft)' }}>
        <span className="section-number">01</span>
        <div>
          <div className="section-title">Generate Content</div>
          <div className="section-sub">Pick channel → AI routes automatically</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Left col — controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Channel */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
              Channel
            </div>
            <ChannelSelector selected={contentType} onChange={setContentType} />
          </div>

          {/* Tone */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
              Tone
            </div>
            <ToneSelector selected={tone} onChange={setTone} />
          </div>

          {/* Topic */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
              Topic / Brief
            </div>
            <textarea
              className="input"
              rows={4}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 'How SaaS companies reduce churn by 30% with proactive CS'"
            />
          </div>

          {/* Context */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
              Context <span style={{ color: 'var(--warm-gray)', fontStyle: 'italic', letterSpacing: 0, textTransform: 'none', fontSize: 10 }}>(optional)</span>
            </div>
            <input
              className="input"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Audience, stats, competitor names…"
            />
          </div>

          <button
            className="btn btn-primary"
            disabled={loading || !topic.trim()}
            onClick={() => generate({ contentType, topic, tone, additionalContext })}
            style={{ width: '100%', padding: '14px', fontSize: 11, letterSpacing: '0.14em' }}
          >
            <Wand2 size={14} />
            {loading ? 'Generating…' : 'Generate Content'}
          </button>
        </div>

        {/* Right col — output */}
        <OutputPanel
          output={output}
          modelUsed={modelUsed}
          isFailover={isFailover}
          failoverFrom={failoverFrom}
          loading={loading}
          error={error}
          onSave={output ? () => saveContent({ contentType, topic, tone }) : null}
        />
      </div>
    </div>
  );
}
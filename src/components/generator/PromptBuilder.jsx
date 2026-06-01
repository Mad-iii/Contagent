import { useState } from 'react';
import { ChevronDown, ChevronUp, Code2 } from 'lucide-react';
import { buildPrompt } from '../../utils/promptTemplates';
import { CONTENT_TYPES } from '../../config/taskRoutes';
import { useBrandVoice } from '../../hooks/useBrandVoice';

export default function PromptBuilder({ contentType, topic, tone, additionalContext }) {
  const [open, setOpen] = useState(false);
  const { brandVoice } = useBrandVoice();

  const preview = buildPrompt({ contentType, topic, tone, brandVoice, additionalContext });
  const ct = CONTENT_TYPES[contentType];

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-[var(--accent)]" />
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Prompt Preview
          </span>
          {ct && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: ct.color + '20', color: ct.color }}
            >
              {ct.label}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={14} className="text-[var(--text-muted)]" /> : <ChevronDown size={14} className="text-[var(--text-muted)]" />}
      </button>

      {open && (
        <div className="border-t border-[var(--border)] px-4 py-3">
          {/* Prompt sections */}
          <div className="space-y-3">
            <PromptSection
              label="System Prompt"
              color="text-purple-400"
              content={preview.split('\n\n')[0]}
            />
            {brandVoice?.name && (
              <PromptSection
                label="Brand Context"
                color="text-blue-400"
                content={extractSection(preview, 'Brand Context')}
              />
            )}
            <PromptSection
              label="Tone Modifier"
              color="text-amber-400"
              content={preview.split('\n\n')[1] || '—'}
            />
            {topic && (
              <PromptSection
                label="Task"
                color="text-emerald-400"
                content={`Task: ${topic}${additionalContext ? `\n\nAdditional context: ${additionalContext}` : ''}`}
              />
            )}
          </div>

          {/* Full prompt */}
          <details className="mt-4">
            <summary className="text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--text)] transition-colors select-none">
              Show full assembled prompt
            </summary>
            <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-[var(--text-muted)] bg-[var(--bg)] rounded-lg p-3 max-h-48 overflow-y-auto border border-[var(--border)]">
              {preview}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

function PromptSection({ label, color, content }) {
  if (!content || content === '—') return null;
  return (
    <div>
      <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${color}`}>{label}</p>
      <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">{content}</p>
    </div>
  );
}

function extractSection(text, sectionName) {
  const idx = text.indexOf(sectionName);
  if (idx === -1) return '';
  const chunk = text.slice(idx);
  const end = chunk.indexOf('\n\n');
  return end === -1 ? chunk : chunk.slice(0, end);
}
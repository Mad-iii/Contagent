import { useState } from 'react';
import { Copy, Trash2, ChevronDown, ChevronUp, CheckCircle, Clock } from 'lucide-react';
import { CONTENT_TYPES } from '../../config/taskRoutes';
import { MODELS } from '../../config/models';
import { copyToClipboard } from '../../utils/contentFormatter';
import { countWords } from '../../utils/seoHelpers';

const STATUS_CONFIG = {
  draft:     { label: 'Draft',     color: 'text-amber-400',  bg: 'bg-amber-400/10' },
  published: { label: 'Published', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  scheduled: { label: 'Scheduled', color: 'text-blue-400',   bg: 'bg-blue-400/10' },
};

export default function ContentItem({ item, onDelete, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied]     = useState(false);

  const ct    = CONTENT_TYPES[item.contentType];
  const model = MODELS[item.modelUsed];
  const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.draft;

  const handleCopy = async () => {
    await copyToClipboard(item.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Header row */}
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Channel dot */}
        <span
          className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
          style={{ backgroundColor: ct?.color || '#888' }}
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text)] truncate">{item.topic}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {/* Channel badge */}
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: (ct?.color || '#888') + '20',
                color: ct?.color || '#888',
              }}
            >
              {ct?.label || item.contentType}
            </span>

            {/* Model badge */}
            {model && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: model.color + '20',
                  color: model.color,
                }}
              >
                {item.wasFailover ? `↪ ${model.name}` : model.name}
              </span>
            )}

            {/* Status badge */}
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
              {statusCfg.label}
            </span>

            {/* Word count */}
            {item.output && (
              <span className="text-[10px] text-[var(--text-muted)]">
                {countWords(item.output)} words
              </span>
            )}

            {/* Timestamp */}
            <span className="text-[10px] text-[var(--text-muted)]">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Status cycle */}
          <button
            onClick={() => {
              const cycle = { draft: 'scheduled', scheduled: 'published', published: 'draft' };
              onStatusChange?.(item.id, cycle[item.status] || 'draft');
            }}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            title="Cycle status"
          >
            {item.status === 'published'
              ? <CheckCircle size={14} className="text-emerald-400" />
              : <Clock size={14} />
            }
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            title="Copy content"
          >
            <Copy size={14} className={copied ? 'text-emerald-400' : ''} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete?.(item.id)}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded preview */}
      {expanded && item.output && (
        <div className="px-4 pb-4 border-t border-[var(--border)] pt-3">
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[var(--text-muted)] max-h-64 overflow-y-auto">
            {item.output}
          </pre>
        </div>
      )}
    </div>
  );
}
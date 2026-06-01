import { useState } from 'react';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const METRICS = ['clicks', 'impressions', 'conversions', 'shares', 'opens'];

export default function EngagementTracker() {
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('engagement-data') || '[]'); }
    catch { return []; }
  });

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    channel: 'blog',
    metric: 'clicks',
    value: '',
    label: '',
  });

  const save = (data) => {
    setEntries(data);
    localStorage.setItem('engagement-data', JSON.stringify(data));
  };

  const addEntry = () => {
    if (!form.value || !form.date) return;
    const entry = { ...form, id: Date.now().toString(), value: Number(form.value) };
    save([...entries, entry].sort((a, b) => a.date.localeCompare(b.date)));
    setForm((f) => ({ ...f, value: '', label: '' }));
  };

  const removeEntry = (id) => save(entries.filter((e) => e.id !== id));

  // Build chart data: group by date, sum selected metric
  const selectedMetric = form.metric;
  const chartData = Object.values(
    entries
      .filter((e) => e.metric === selectedMetric)
      .reduce((acc, e) => {
        acc[e.date] = acc[e.date] || { date: e.date, value: 0 };
        acc[e.date].value += e.value;
        return acc;
      }, {})
  ).slice(-30);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp size={18} className="text-[var(--accent)]" />
        <h2 className="text-lg font-semibold text-[var(--text)]">Engagement Tracker</h2>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">
            {selectedMetric} — last {chartData.length} entries
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: 'var(--text)' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--accent)' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Entry form */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 space-y-4">
        <p className="text-sm font-semibold text-[var(--text)]">Log Engagement</p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Metric</label>
            <select
              value={form.metric}
              onChange={(e) => setForm((f) => ({ ...f, metric: e.target.value }))}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
            >
              {METRICS.map((m) => (
                <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Value</label>
            <input
              type="number"
              min={0}
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              placeholder="e.g. 1240"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs text-[var(--text-muted)] mb-1">Label (optional)</label>
            <input
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="e.g. 'SaaS churn blog post'"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={addEntry}
              disabled={!form.value}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Entry log */}
      {entries.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Recent Entries
            </p>
          </div>
          <div className="divide-y divide-[var(--border)] max-h-64 overflow-y-auto">
            {[...entries].reverse().slice(0, 20).map((e) => (
              <div key={e.id} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-muted)] w-24 shrink-0">{e.date}</span>
                  <span className="text-xs font-medium text-[var(--accent)] capitalize">{e.metric}</span>
                  <span className="text-sm font-semibold text-[var(--text)]">{e.value.toLocaleString()}</span>
                  {e.label && (
                    <span className="text-xs text-[var(--text-muted)] truncate max-w-[160px]">{e.label}</span>
                  )}
                </div>
                <button
                  onClick={() => removeEntry(e.id)}
                  className="text-[var(--text-muted)] hover:text-red-400 transition-colors ml-2"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
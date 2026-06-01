import VolumeChart from './VolumeChart';
import ModelUsageBreakdown from './ModelUsageBreakdown';
import { useAnalytics } from '../../hooks/useAnalytics';
import { CONTENT_TYPES } from '../../config/taskRoutes';

export default function AnalyticsDashboard() {
  const { byChannel, byModel, targetProgress, totalGenerated, failoverCount } = useAnalytics();

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid var(--border-soft)' }}>
        <span className="section-number">03</span>
        <div>
          <div className="section-title">Analytics</div>
          <div className="section-sub">This month's performance</div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total Generated', value: totalGenerated },
          { label: 'Failovers', value: failoverCount, sub: totalGenerated ? `${Math.round((failoverCount / totalGenerated) * 100)}% of total` : '—' },
          { label: 'Active Channels', value: Object.values(byChannel).filter(v => v > 0).length },
        ].map(({ label, value, sub }) => (
          <div key={label} className="kpi-block fade-up fade-up-1">
            <div className="kpi-value">{value}</div>
            <div className="kpi-label">{label}</div>
            {sub && <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        <div className="fade-up fade-up-2"><VolumeChart targetProgress={targetProgress} /></div>
        <div className="fade-up fade-up-3"><ModelUsageBreakdown byModel={byModel} /></div>
      </div>

      {/* Targets */}
      <div style={{ border: '1px solid var(--border-soft)', background: 'var(--paper)' }} className="fade-up fade-up-4">
        <div style={{ padding: '10px 20px', background: 'var(--ink)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--warm-gray)' }}>Monthly Targets</span>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Object.entries(targetProgress).map(([type, { actual, target, percent }]) => {
            const ct = CONTENT_TYPES[type];
            return (
              <div key={type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.04em' }}>{ct?.label}</span>
                  <span style={{ fontSize: 9, color: 'var(--muted)' }}>{actual} / {target}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${percent}%`, background: ct?.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
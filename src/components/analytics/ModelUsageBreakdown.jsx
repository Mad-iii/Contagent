import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MODELS } from '../../config/models';

export default function ModelUsageBreakdown({ byModel }) {
  const data = Object.entries(byModel)
    .filter(([, c]) => c > 0)
    .map(([id, count]) => ({ name: MODELS[id]?.name || id, value: count, color: MODELS[id]?.color || '#888' }));

  if (!data.length) return (
    <div style={{ border: '1px solid var(--border-soft)', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
      <span style={{ fontSize: 10, color: 'var(--muted)' }}>No data yet</span>
    </div>
  );

  return (
    <div style={{ border: '1px solid var(--border-soft)', padding: 20, background: 'var(--paper)' }}>
      <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
        Model Usage Split
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={2}>
            {data.map((e, i) => <Cell key={i} fill={e.color} stroke="var(--paper)" strokeWidth={2} />)}
          </Pie>
          <Tooltip contentStyle={{ background: 'var(--ink)', border: 'none', borderRadius: 0, fontSize: 10, fontFamily: 'JetBrains Mono', color: 'var(--cream)' }} />
          <Legend iconType="square" iconSize={7} wrapperStyle={{ fontSize: 9, fontFamily: 'JetBrains Mono', letterSpacing: '0.06em' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
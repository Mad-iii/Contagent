import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CONTENT_TYPES } from '../../config/taskRoutes';

export default function VolumeChart({ targetProgress }) {
  const data = Object.entries(targetProgress).map(([type, { actual, target }]) => ({
    name: CONTENT_TYPES[type]?.label.split(' ')[0],
    actual, target,
    color: CONTENT_TYPES[type]?.color,
  }));

  return (
    <div style={{ border: '1px solid var(--border-soft)', padding: 20, background: 'var(--paper)' }}>
      <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
        Volume vs Target
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={12} barGap={3}>
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--muted)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: 'var(--muted)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: 'var(--ink)', border: 'none', borderRadius: 0, fontSize: 10, fontFamily: 'JetBrains Mono', color: 'var(--cream)' }} />
          <Bar dataKey="target" fill="var(--cream)" radius={0} name="Target" stroke="var(--border-soft)" strokeWidth={1} />
          <Bar dataKey="actual" radius={0} name="Actual">
            {data.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
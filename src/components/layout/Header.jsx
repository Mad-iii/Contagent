import { useModelStatus } from '../../hooks/useModelStatus';
import { MODELS } from '../../config/models';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, BarChart2, Zap, Settings } from 'lucide-react';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Generate', num: '01' },
  { to: '/calendar', icon: Calendar, label: 'Calendar', num: '02' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics', num: '03' },
  { to: '/batch', icon: Zap, label: 'Batch', num: '04' },
  { to: '/settings', icon: Settings, label: 'Settings', num: '05' },
];

export default function Header() {
  const { modelStatus } = useModelStatus();

  return (
    <header className="topbar">
      {/* Brand */}
      <div className="topbar-brand">
        <span className="topbar-brand-name">ContentAgent</span>
        <span className="topbar-brand-pill">AI Engine</span>
      </div>

      {/* Nav */}
      <nav className="topbar-nav">
        {NAV.map(({ to, label, num }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `topbar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span style={{ color: 'var(--muted)', fontSize: 9 }}>{num}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Status dots */}
      <div className="topbar-status">
        {Object.values(MODELS).map((m) => {
          const s = modelStatus[m.id];
          const dead = s?.isExhausted && s.resetAt > Date.now();
          return (
            <span key={m.id} className={`status-dot ${dead ? 'dead' : ''}`}
              title={`${m.name} — ${dead ? 'exhausted' : 'active'}`}>
              {m.name.split(' ')[0]}
            </span>
          );
        })}
      </div>
    </header>
  );
}
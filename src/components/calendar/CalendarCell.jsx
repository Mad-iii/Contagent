import { CONTENT_TYPES } from '../../config/taskRoutes';

export default function CalendarCell({ day, items, isToday }) {
  return (
    <div className="cal-cell" style={{ borderRight: '1px solid var(--border-soft)' }}>
      <span className={`cal-day-num ${isToday ? 'today' : ''}`}>{day}</span>
      <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.slice(0, 3).map((item) => {
          const ct = CONTENT_TYPES[item.contentType];
          return (
            <div key={item.id} style={{
              fontSize: 9, padding: '1px 5px',
              background: (ct?.color || '#888') + '18',
              color: ct?.color || '#888',
              letterSpacing: '0.04em',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {item.topic?.substring(0, 18)}…
            </div>
          );
        })}
        {items.length > 3 && (
          <span style={{ fontSize: 8, color: 'var(--muted)', paddingLeft: 4 }}>+{items.length - 3}</span>
        )}
      </div>
    </div>
  );
}
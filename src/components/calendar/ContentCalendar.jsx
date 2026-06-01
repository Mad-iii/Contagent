import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarCell from './CalendarCell';
import { useCalendar } from '../../hooks/useCalendar';

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { return new Date(y, m, 1).getDay(); }

export default function ContentCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const { getItemsForDay } = useCalendar();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  const prev = () => month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1);
  const next = () => month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <span className="section-number">02</span>
          <div>
            <div className="section-title">Content Calendar</div>
            <div className="section-sub">Scheduled & drafted pieces</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={prev} className="btn btn-ghost" style={{ padding: '6px 10px' }}><ChevronLeft size={13} /></button>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, letterSpacing: '0.06em', textAlign: 'center' }}>
            {monthName} {year}
          </span>
          <button onClick={next} className="btn btn-ghost" style={{ padding: '6px 10px' }}><ChevronRight size={13} /></button>
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{ border: '1px solid var(--border-soft)' }}>
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '2px solid var(--ink)' }}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} style={{
              padding: '6px 8px', textAlign: 'center',
              fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--muted)', background: 'var(--cream)',
              borderRight: '1px solid var(--border-soft)',
            }}>
              {d}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {cells.map((day, i) => {
            if (!day) return (
              <div key={`e-${i}`} style={{ minHeight: 88, borderRight: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)', background: 'var(--cream)', opacity: 0.4 }} />
            );
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const items = getItemsForDay(dateStr);
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            return <CalendarCell key={day} day={day} items={items} isToday={isToday} />;
          })}
        </div>
      </div>
    </div>
  );
}
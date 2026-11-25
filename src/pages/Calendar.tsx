import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CalendarDays, CalendarRange, List, Sun } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useCollection } from '../hooks/useCollection';
import type { ScoutEvent } from '../types';

type View = 'month' | 'week' | 'day' | 'agenda';
const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const weekdays = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const pad = (n: number) => String(n).padStart(2, '0');
const keyOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseDate = (s: string) => new Date(`${s}T12:00:00`);
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate()+n); return x; };
const monday = (d: Date) => addDays(d, -((d.getDay()+6)%7));
const nthWeekday = (year: number, month: number, weekday: number, nth: number) => {
  const first = new Date(year, month, 1); return new Date(year, month, 1 + ((weekday-first.getDay()+7)%7) + (nth-1)*7);
};
function mexicanHolidays(year: number) {
  // Días de descanso obligatorio del artículo 74 de la Ley Federal del Trabajo.
  return [
    { date: `${year}-01-01`, name: 'Año Nuevo' },
    { date: keyOf(nthWeekday(year, 1, 1, 1)), name: 'Día de la Constitución (conmemoración)' },
    { date: keyOf(nthWeekday(year, 2, 1, 3)), name: 'Natalicio de Benito Juárez (conmemoración)' },
    { date: `${year}-05-01`, name: 'Día del Trabajo' },
    { date: `${year}-09-16`, name: 'Independencia de México' },
    { date: keyOf(nthWeekday(year, 10, 1, 3)), name: 'Revolución Mexicana (conmemoración)' },
    { date: `${year}-12-25`, name: 'Navidad' },
  ];
}
function eventTouchesDate(e: ScoutEvent, date: string) {
  return e.status !== 'Cancelado' && e.start <= date && (e.end || e.start) >= date;
}

export default function Calendar() {
  const { items } = useCollection<ScoutEvent>('events');
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => keyOf(new Date()));
  const [view, setView] = useState<View>('month');
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const holidays = useMemo(() => mexicanHolidays(year), [year]);
  const holidayMap = useMemo(() => new Map(holidays.map(h => [h.date, h.name])), [holidays]);
  const selectedDate = parseDate(selected);
  const visibleDates = useMemo(() => {
    if (view === 'day') return [selectedDate];
    if (view === 'week') return Array.from({length:7}, (_,i)=>addDays(monday(selectedDate),i));
    if (view === 'agenda') return Array.from({length:35},(_,i)=>addDays(selectedDate,i));
    const first = new Date(year,month,1); const start = monday(first);
    const last = new Date(year,month+1,0); const end = addDays(last, 6-((last.getDay()+6)%7));
    const count = Math.round((end.getTime()-start.getTime())/86400000)+1;
    return Array.from({length:count},(_,i)=>addDays(start,i));
  }, [view, selected, year, month]);
  const selectedEvents = items.filter(e => eventTouchesDate(e, selected)).sort((a,b)=>a.title.localeCompare(b.title,'es'));
  const move = (delta: number) => {
    if (view === 'day') { const d=addDays(selectedDate,delta); setSelected(keyOf(d)); setCursor(d); }
    else if (view === 'week') { const d=addDays(selectedDate,delta*7); setSelected(keyOf(d)); setCursor(d); }
    else if (view === 'agenda') { const d=addDays(selectedDate,delta*35); setSelected(keyOf(d)); setCursor(d); }
    else setCursor(new Date(year,month+delta,1));
  };
  const goToday = () => { const d=new Date(); setCursor(d); setSelected(keyOf(d)); };
  const title = view === 'month' ? `${monthNames[month]} ${year}` : view === 'week' ? `Semana del ${monday(selectedDate).toLocaleDateString('es-MX',{day:'numeric',month:'short'})}` : view === 'day' ? selectedDate.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : 'Próximos 35 días';
  const dateButton = (d: Date) => {
    const date=keyOf(d); const isToday=date===keyOf(new Date()); const isSelected=date===selected;
    const events=items.some(e=>eventTouchesDate(e,date)); const holiday=holidayMap.get(date);
    return <button key={date} className={`calendar-cell ${isSelected?'selected':''} ${isToday?'today':''} ${d.getMonth()!==month&&view==='month'?'outside-month':''}`} onClick={()=>{setSelected(date);setCursor(d);setView(view==='month'?'day':view);}} title={holiday || ''}>
      <span>{d.getDate()}</span>{events&&<i/>}{holiday&&<small className="holiday-mark">Festivo</small>}
    </button>;
  };
  return <>
    <PageHeader title="Calendario" subtitle="Consulta tus actividades y organiza tus fechas." />
    <div className="calendar-toolbar">
      <div className="calendar-views" role="group" aria-label="Vista del calendario">
        {([['month','Mes'],['week','Semana'],['day','Día'],['agenda','Agenda']] as [View,string][]).map(([v,label])=><button key={v} className={`view-button ${view===v?'active':''}`} onClick={()=>setView(v)}>{label}</button>)}
      </div>
      <button className="button" onClick={goToday}>Hoy</button>
    </div>
    <div className="card calendar-card calendar-wide">
      <div className="calendar-head"><button className="icon-button" onClick={()=>move(-1)} aria-label="Anterior"><ChevronLeft/></button><h2>{title}</h2><button className="icon-button" onClick={()=>move(1)} aria-label="Siguiente"><ChevronRight/></button></div>
      {view==='month' && <div className="calendar-grid">{weekdays.map(w=><div className="weekday" key={w}>{w}</div>)}{visibleDates.map(dateButton)}</div>}
      {view==='week' && <><div className="calendar-grid">{visibleDates.map((d)=><div className="weekday" key={keyOf(d)}>{weekdays[(d.getDay()+6)%7]} {d.getDate()}</div>)}</div><div className="calendar-grid">{visibleDates.map(dateButton)}</div></>}
      {view==='day' && <div className="day-focus"><div className="day-focus-number">{selectedDate.getDate()}</div><div><strong>{selectedDate.toLocaleDateString('es-MX',{weekday:'long',month:'long',year:'numeric'})}</strong><p>{holidayMap.get(selected) || 'Consulta las actividades programadas para este día.'}</p></div></div>}
      {view==='agenda' && <div className="agenda-dates">{visibleDates.map(d=><button key={keyOf(d)} className={`agenda-date ${keyOf(d)===selected?'active':''}`} onClick={()=>setSelected(keyOf(d))}><strong>{d.getDate()}</strong><span>{weekdays[(d.getDay()+6)%7]}</span>{holidayMap.has(keyOf(d))&&<i/>}{items.some(e=>eventTouchesDate(e,keyOf(d)))&&<i className="agenda-event-dot"/>}</button>)}</div>}
      <div className="calendar-legend"><span><i className="legend-dot"/> Día con actividad</span><span><i className="legend-today"/> Hoy</span><span><i className="legend-holiday"/> Festivo oficial</span></div>
    </div>
    <section className="selected-day selected-day-wide">
      <div className="section-title"><div><span className="eyebrow">Agenda del día</span><h2>{selectedDate.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'})}</h2>{holidayMap.has(selected)&&<p className="holiday-description"><Sun size={14}/> {holidayMap.get(selected)}</p>}</div><div className="calendar-day-actions"><button className="button" onClick={()=>setView('day')}><CalendarRange size={16}/> Ver día</button><Link className="button primary" to="/eventos" state={{startDate:selected}}><CalendarDays size={16}/> Crear evento</Link></div></div>
      {selectedEvents.length===0?<div className="card empty compact"><div className="icon-wrap"><CalendarDays size={20}/></div><h2>Sin actividades para este día</h2><p>Cuando registres un evento que coincida con esta fecha, aparecerá aquí.</p></div>:<div className="event-list">{selectedEvents.map(e=><div className="card day-event" key={e.id}><span className="eyebrow">{e.category}</span><strong>{e.title}</strong><span className="muted">{e.start===e.end? '':`${e.start} — ${e.end} · `}{e.location||'Sin ubicación'}</span></div>)}</div>}
      {view==='agenda'&&<p className="muted agenda-hint"><List size={14}/> Selecciona una fecha para consultar sus actividades.</p>}
    </section>
  </>;
}

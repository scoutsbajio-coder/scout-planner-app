import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, CalendarDays, Tent, NotebookPen, Settings, Award, Trees } from 'lucide-react';
import Logo from './Logo';
import PwaUpdatePrompt from './PwaUpdatePrompt';
import BackupReminder from './BackupReminder';
import { useTheme } from '../hooks/useTheme';

const links = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/calendario', label: 'Calendario', icon: CalendarDays },
  { to: '/eventos', label: 'Eventos', icon: Tent },
  { to: '/campamentos', label: 'Campamentos', icon: Trees },
  { to: '/adelanto', label: 'Adelanto de Tropa', icon: Award },
  { to: '/bitacora', label: 'Bitácora', icon: NotebookPen },
  { to: '/configuracion', label: 'Ajustes', icon: Settings },
];

const isMobile = () => window.matchMedia('(max-width: 899px)').matches;

export default function Layout() {
  useTheme();
  // En celular el menú empieza cerrado; en computadora, abierto.
  const [open, setOpen] = useState(() => !isMobile());

  const afterNavigate = () => {
    // En escritorio, al elegir una sección se contrae la barra y quedan los iconos.
    // En móvil, la navegación inferior permanece visible.
    if (!isMobile()) setOpen(false);
  };

  return (
    <div className="app">
      <nav className="dock" data-open={open} aria-label="Navegación principal">
        <div className="dock-head">
          <button
            className="dock-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            <Logo size={34} />
          </button>
          <div className="dock-brand">
            <strong>Scout Planner</strong>
            <small>Tu bitácora, siempre contigo</small>
          </div>
        </div>

        <div className="dock-items">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              title={label}
              onClick={afterNavigate}
              className={({ isActive }) => 'dock-item' + (isActive ? ' active' : '')}
            >
              <Icon size={22} aria-hidden />
              <span className="label">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="main">
        <BackupReminder />
        <Outlet />
      </main>
      <PwaUpdatePrompt />
    </div>
  );
}

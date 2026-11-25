import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Events from './pages/Events';
import Journal from './pages/Journal';
import SettingsPage from './pages/SettingsPage';
import Tasks from './pages/Tasks';
import Camps from './pages/Camps';
import Advancement from './pages/Advancement';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendario" element={<Calendar />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/campamentos" element={<Camps />} />
          <Route path="/adelanto" element={<Advancement />} />
          <Route path="/tareas" element={<Tasks />} />
          <Route path="/bitacora" element={<Journal />} />
          <Route path="/configuracion" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

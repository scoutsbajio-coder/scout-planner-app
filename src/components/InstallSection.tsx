import { Download, Smartphone } from 'lucide-react';
import { isIOS, promptInstall, useInstall } from '../services/install';

export default function InstallSection() {
  const { canPrompt, installed } = useInstall();

  let body: JSX.Element;
  if (installed) {
    body = <p>Scout Planner ya está instalada en este dispositivo y puedes abrirla desde tu pantalla de inicio.</p>;
  } else if (canPrompt) {
    body = (
      <>
        <p>Instálala para abrirla como una app, a pantalla completa y sin conexión.</p>
        <div className="setting-control">
          <button className="button primary" onClick={() => void promptInstall()}>
            <Download size={16} /> Instalar aplicación
          </button>
        </div>
      </>
    );
  } else if (isIOS()) {
    body = <p>En iPhone o iPad, abre esta página en Safari, toca <strong>Compartir</strong> y elige <strong>Agregar a pantalla de inicio</strong>.</p>;
  } else {
    body = <p>Abre el menú del navegador (⋮) y elige <strong>Instalar aplicación</strong> o <strong>Agregar a pantalla principal</strong>. Si no aparece, verifica que estés usando la dirección HTTPS publicada.</p>;
  }

  return (
    <section className="card settings-section">
      <div className="settings-icon"><Smartphone /></div>
      <div className="settings-content">
        <h2>Instalar en este dispositivo</h2>
        {body}
      </div>
    </section>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { HardDrive } from 'lucide-react';
import { formatBytes, getStorageStatus, requestPersistence, type StorageStatus } from '../services/persistence';

export default function StorageSection() {
  const [status, setStatus] = useState<StorageStatus | null>(null);
  const [denied, setDenied] = useState(false);

  const refresh = useCallback(async () => setStatus(await getStorageStatus()), []);
  useEffect(() => { void refresh(); }, [refresh]);

  const protect = async () => {
    const granted = await requestPersistence();
    setDenied(!granted);
    await refresh();
  };

  let body: JSX.Element;
  if (!status) {
    body = <p>Revisando el estado del almacenamiento…</p>;
  } else if (!status.supported) {
    body = <p>Este navegador no permite pedir protección de almacenamiento. Exporta respaldos con frecuencia para no perder tu información.</p>;
  } else if (status.persisted) {
    body = <p><strong>Protegido.</strong> El navegador no borrará los datos de Scout Planner por falta de espacio. Aun así, conviene exportar respaldos: borrar los datos del navegador o desinstalar la app sí los elimina.</p>;
  } else {
    body = (
      <>
        <p>
          <strong>Sin protección.</strong> Si el dispositivo se queda sin espacio, el navegador podría borrar los datos de la app sin avisar.
          Instalar la app y pedir la protección ayuda a evitarlo.
        </p>
        <div className="setting-control">
          <button className="button primary" onClick={() => void protect()}>Proteger mis datos</button>
        </div>
        {denied && <p className="muted">El navegador no lo concedió por ahora. Instala la aplicación, úsala con regularidad y mantén tus respaldos al día.</p>}
      </>
    );
  }

  return (
    <section className="card settings-section">
      <div className="settings-icon"><HardDrive /></div>
      <div className="settings-content">
        <h2>Protección de datos</h2>
        {body}
        {status?.usage != null && (
          <span className="version-label">Espacio usado: {formatBytes(status.usage)}{status.quota != null ? ` de ${formatBytes(status.quota)} disponibles` : ''}</span>
        )}
      </div>
    </section>
  );
}

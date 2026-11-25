import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const HOUR = 60 * 60 * 1000;

export default function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Busca versiones nuevas cada hora mientras la app permanece abierta.
      if (registration) setInterval(() => { if (!registration.installing && navigator.onLine) void registration.update(); }, HOUR);
    },
    onRegisterError(error) { console.error('No se pudo registrar el Service Worker', error); },
  });

  // El aviso de "lista sin conexión" se oculta solo.
  useEffect(() => {
    if (!offlineReady) return;
    const timer = setTimeout(() => setOfflineReady(false), 6000);
    return () => clearTimeout(timer);
  }, [offlineReady, setOfflineReady]);

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="pwa-toast" role="status" aria-live="polite">
      {needRefresh ? (
        <>
          <div>
            <strong>Hay una versión nueva</strong>
            <span>Guarda lo que estés editando y actualiza para usarla.</span>
          </div>
          <div className="pwa-toast-actions">
            <button className="button" onClick={() => setNeedRefresh(false)}>Más tarde</button>
            <button className="button primary" onClick={() => void updateServiceWorker(true)}>Actualizar</button>
          </div>
        </>
      ) : (
        <>
          <div>
            <strong>Lista para usarse sin conexión</strong>
            <span>Scout Planner ya quedó guardada en este dispositivo.</span>
          </div>
          <div className="pwa-toast-actions">
            <button className="button" onClick={() => setOfflineReady(false)}>Cerrar</button>
          </div>
        </>
      )}
    </div>
  );
}

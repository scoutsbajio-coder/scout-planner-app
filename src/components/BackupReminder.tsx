import { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { ensureBackupBaseline, exportBackup } from '../services/backup';
import { needsBackup, snoozeBackupReminder, useBackupState } from '../services/backupState';

const DAY = 24 * 60 * 60 * 1000;

/** Texto legible del último respaldo, p. ej. «hace 3 días». */
export function describeLastBackup(lastBackup: number | null, now = Date.now()): string {
  if (lastBackup === null) return 'Todavía no has exportado un respaldo.';
  const days = Math.floor((now - lastBackup) / DAY);
  const date = new Date(lastBackup).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  if (days <= 0) return `Último respaldo: hoy (${date}).`;
  return `Último respaldo: ${date} (hace ${days} ${days === 1 ? 'día' : 'días'}).`;
}

export function BackupStatusLine() {
  const state = useBackupState();
  return <p className="muted">{describeLastBackup(state.lastBackup)}</p>;
}

export default function BackupReminder() {
  const state = useBackupState();
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);

  useEffect(() => { void ensureBackupBaseline(); }, []);
  // Al volver a la app (p. ej. tras días en segundo plano) se reevalúa.
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => { document.removeEventListener('visibilitychange', refresh); window.removeEventListener('focus', refresh); };
  }, []);

  if (!needsBackup(state, now)) return null;

  const days = state.lastBackup === null ? null : Math.floor((now - state.lastBackup) / DAY);
  const message = days === null
    ? 'Aún no has respaldado tu información. Tus datos viven solo en este dispositivo.'
    : `Hace ${days} ${days === 1 ? 'día' : 'días'} que no respaldas tu información y hay cambios nuevos.`;

  return (
    <div className="backup-banner" role="status">
      <ShieldAlert size={20} aria-hidden />
      <div className="backup-banner-text">
        <strong>Conviene hacer un respaldo</strong>
        <span>{message}</span>
      </div>
      <div className="backup-banner-actions">
        <button className="button" onClick={() => snoozeBackupReminder(1)}>Mañana</button>
        <button
          className="button primary"
          disabled={busy}
          onClick={async () => { setBusy(true); try { await exportBackup(); } finally { setBusy(false); } }}
        >
          Respaldar ahora
        </button>
      </div>
    </div>
  );
}

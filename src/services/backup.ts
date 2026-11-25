import { getAll } from './db';
import { isIOS } from './install';
import { markBackup, seedBaseline } from './backupState';
import type { CollectionName } from '../types';

const COLLECTIONS: CollectionName[] = ['events', 'tasks', 'notes', 'templates', 'scouts', 'evaluations', 'camps'];

export type ExportResult = 'downloaded' | 'shared' | 'cancelled';

/** Genera el respaldo JSON completo y lo entrega al usuario. */
export async function exportBackup(): Promise<ExportResult> {
  const entries = await Promise.all(COLLECTIONS.map(async (name) => [name, await getAll<unknown>(name)] as const));
  const data = { app: 'Scout Planner', version: 3, exportedAt: new Date().toISOString(), ...Object.fromEntries(entries) };
  const json = JSON.stringify(data, null, 2);
  const fileName = `scout-planner-respaldo-${new Date().toISOString().slice(0, 10)}.json`;

  // En iPhone/iPad la descarga directa dentro de la app instalada es poco confiable:
  // la hoja de compartir permite guardar en Archivos, iCloud, Drive o enviarlo por WhatsApp.
  if (isIOS() && typeof navigator.canShare === 'function') {
    const file = new File([json], fileName, { type: 'application/json' });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Respaldo de Scout Planner' });
        markBackup();
        return 'shared';
      } catch (error) {
        if ((error as DOMException)?.name === 'AbortError') return 'cancelled';
        // Cualquier otro fallo: se intenta la descarga normal.
      }
    }
  }

  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  markBackup();
  return 'downloaded';
}

/** Detecta si ya hay datos guardados (instalaciones anteriores al recordatorio). */
export async function ensureBackupBaseline(): Promise<void> {
  try {
    const counts = await Promise.all(COLLECTIONS.map(async (name) => (await getAll<unknown>(name)).length));
    seedBaseline(counts.some((count) => count > 0));
  } catch { /* se ignora: el recordatorio es opcional */ }
}

import { useSyncExternalStore } from 'react';

const DAY = 24 * 60 * 60 * 1000;
/** Cada cuántos días se recuerda respaldar si hubo cambios. */
export const REMINDER_DAYS = 7;

const KEYS = {
  backup: 'scout-planner:last-backup',
  change: 'scout-planner:last-change',
  first: 'scout-planner:first-change',
  snooze: 'scout-planner:backup-snooze',
} as const;

export interface BackupState {
  /** Último respaldo exportado (ms) */
  lastBackup: number | null;
  /** Último cambio guardado en los datos (ms) */
  lastChange: number | null;
  /** Primer momento en que hubo datos (ms) */
  firstChange: number | null;
  /** No mostrar el recordatorio hasta esta hora (ms) */
  snoozeUntil: number | null;
}

const read = (key: string): number | null => {
  try {
    const raw = localStorage.getItem(key);
    const value = raw === null ? NaN : Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch { return null; }
};
const write = (key: string, value: number) => {
  try { localStorage.setItem(key, String(value)); } catch { /* almacenamiento no disponible */ }
};
const load = (): BackupState => ({
  lastBackup: read(KEYS.backup),
  lastChange: read(KEYS.change),
  firstChange: read(KEYS.first),
  snoozeUntil: read(KEYS.snooze),
});

let state: BackupState = load();
const listeners = new Set<() => void>();
const publish = () => { state = load(); listeners.forEach((l) => l()); };

if (typeof window !== 'undefined') {
  // Si otra pestaña/ventana cambia estos valores, esta se entera.
  window.addEventListener('storage', (event) => {
    if (event.key && (Object.values(KEYS) as string[]).includes(event.key)) publish();
  });
}

/** Debe llamarse cada vez que se guarda, borra o importa información. */
export function markChanged(now = Date.now()) {
  write(KEYS.change, now);
  if (read(KEYS.first) === null) write(KEYS.first, now);
  publish();
}

/** Debe llamarse cuando el usuario exporta (o importa) un respaldo completo. */
export function markBackup(now = Date.now()) {
  write(KEYS.backup, now);
  try { localStorage.removeItem(KEYS.snooze); } catch { /* se ignora */ }
  publish();
}

export function snoozeBackupReminder(days = 1, now = Date.now()) {
  write(KEYS.snooze, now + days * DAY);
  publish();
}

/**
 * Para instalaciones que ya tenían datos antes de existir el recordatorio:
 * se considera que los datos son antiguos para avisar de inmediato.
 */
export function seedBaseline(hasData: boolean, now = Date.now()) {
  if (!hasData || read(KEYS.change) !== null) return;
  write(KEYS.change, now);
  write(KEYS.first, 0);
  publish();
}

/** Regla pura (fácil de probar): ¿hay que recordar el respaldo? */
export function needsBackup(s: BackupState, now = Date.now()): boolean {
  if (s.lastChange === null) return false;                    // no hay datos
  if (s.snoozeUntil !== null && s.snoozeUntil > now) return false; // pospuesto
  if (s.lastBackup !== null && s.lastChange <= s.lastBackup) return false; // nada nuevo desde el respaldo
  const reference = s.lastBackup ?? s.firstChange ?? s.lastChange;
  return now - reference >= REMINDER_DAYS * DAY;
}

export function useBackupState(): BackupState {
  return useSyncExternalStore(
    (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
    () => state
  );
}

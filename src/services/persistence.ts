const ASKED_KEY = 'scout-planner:persist-asked';

export interface StorageStatus {
  supported: boolean;
  persisted: boolean | null;
  usage: number | null;
  quota: number | null;
}

export async function getStorageStatus(): Promise<StorageStatus> {
  const storage = typeof navigator !== 'undefined' ? navigator.storage : undefined;
  if (!storage) return { supported: false, persisted: null, usage: null, quota: null };
  let persisted: boolean | null = null;
  let usage: number | null = null;
  let quota: number | null = null;
  try { persisted = storage.persisted ? await storage.persisted() : null; } catch { /* se ignora */ }
  try {
    const estimate = storage.estimate ? await storage.estimate() : undefined;
    usage = estimate?.usage ?? null;
    quota = estimate?.quota ?? null;
  } catch { /* se ignora */ }
  return { supported: typeof storage.persist === 'function', persisted, usage, quota };
}

/** Pide al navegador que no borre los datos de la app automáticamente. */
export async function requestPersistence(): Promise<boolean> {
  try {
    const storage = navigator.storage;
    if (!storage?.persist) return false;
    if (storage.persisted && (await storage.persisted())) return true;
    return await storage.persist();
  } catch { return false; }
}

/**
 * Se llama la primera vez que el usuario guarda datos. Chrome/Android suelen concederlo en silencio
 * (sobre todo con la app instalada); Firefox muestra un permiso, por eso se pide en un momento con contexto
 * y solo una vez. En Ajustes siempre se puede volver a solicitar.
 */
export async function maybeRequestPersistence(): Promise<void> {
  try {
    if (localStorage.getItem(ASKED_KEY)) return;
    localStorage.setItem(ASKED_KEY, '1');
  } catch { /* se continúa igualmente */ }
  await requestPersistence();
}

export function formatBytes(bytes: number | null): string {
  if (bytes === null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

import { useCallback, useEffect, useState } from 'react';
import { getAll, remove, save } from '../services/db';
import type { CollectionName } from '../types';

export function useCollection<T extends { id: string }>(store: CollectionName) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try { setItems(await getAll<T>(store)); }
    catch (error) { console.error(`No se pudo leer ${store}`, error); }
    finally { setLoading(false); }
  }, [store]);
  useEffect(() => { void refresh(); }, [refresh]);
  const upsert = async (item: T) => { await save(store, item); await refresh(); };
  const erase = async (id: string) => { await remove(store, id); await refresh(); };
  return { items, loading, refresh, upsert, erase };
}

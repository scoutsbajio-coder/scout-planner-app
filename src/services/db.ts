import type { CollectionName } from '../types';
import { markChanged } from './backupState';
import { maybeRequestPersistence } from './persistence';

const DB_NAME = 'scout-planner-db';
const DB_VERSION = 3;
const STORES: CollectionName[] = ['events', 'tasks', 'notes', 'templates', 'scouts', 'evaluations', 'camps'];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      STORES.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: 'id' });
      });
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getAll<T>(store: CollectionName): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const request = tx.objectStore(store).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}
export async function save<T extends { id: string }>(store: CollectionName, value: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(value);
    tx.oncomplete = () => { db.close(); markChanged(); void maybeRequestPersistence(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}
export async function remove(store: CollectionName, id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(id);
    tx.oncomplete = () => { db.close(); markChanged(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}
export async function replaceAll(store: CollectionName, values: Array<{ id: string }>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const objectStore = tx.objectStore(store);
    objectStore.clear();
    values.forEach((value) => objectStore.put(value));
    tx.oncomplete = () => { db.close(); markChanged(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

/** Reemplaza varias colecciones dentro de una sola transacción. Si falla una escritura,
 * IndexedDB revierte todos los cambios y evita respaldos importados a medias. */
export async function replaceAllCollections(
  collections: Partial<Record<CollectionName, Array<{ id: string }>>>
): Promise<void> {
  const entries = Object.entries(collections) as Array<[CollectionName, Array<{ id: string }>] >;
  if (!entries.length) return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(entries.map(([store]) => store), 'readwrite');
    for (const [store, values] of entries) {
      const objectStore = tx.objectStore(store);
      objectStore.clear();
      values.forEach((value) => objectStore.put(value));
    }
    tx.oncomplete = () => { db.close(); markChanged(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error ?? new Error('La importación fue cancelada.')); };
  });
}

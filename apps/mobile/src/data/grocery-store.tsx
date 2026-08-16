import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GroceryItem } from '@cravekeep/domain';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { useAuthStore } from './auth-store';
import { fetchCloudGroceries, replaceCloudGroceries, setCloudGroceryChecked } from './cloud-groceries';

const STORAGE_KEY = 'cravekeep.groceries.v1';

type GroceryStoreValue = {
  items: GroceryItem[];
  ready: boolean;
  error: string | null;
  replaceItems: (items: GroceryItem[]) => Promise<void>;
  addItem: (item: GroceryItem) => Promise<void>;
  toggleChecked: (key: string) => Promise<void>;
  clearChecked: () => Promise<void>;
};

const GroceryStore = createContext<GroceryStoreValue | null>(null);

export function GroceryStoreProvider({ children }: PropsWithChildren) {
  const { user } = useAuthStore();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsRef = useRef(items);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  const persist = useCallback(async (next: GroceryItem[]) => {
    itemsRef.current = next;
    setItems(next);
    writeQueue.current = writeQueue.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)))
      .then(() => setError(null))
      .catch(() => setError('Your grocery change is visible but could not be saved on this device.'));
    await writeQueue.current;
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!value) return;
        const parsed: unknown = JSON.parse(value);
        if (!Array.isArray(parsed)) throw new Error('Invalid saved groceries');
        const next = parsed as GroceryItem[];
        itemsRef.current = next;
        setItems(next);
      })
      .catch(() => setError('Your grocery list could not be loaded.'))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!user) return;
    void fetchCloudGroceries(user.id).then((cloud) => {
      if (!cloud.length) return;
      itemsRef.current = cloud;
      setItems(cloud);
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cloud)).catch(() => setError('Groceries refreshed, but the local cache could not be updated.'));
    }).catch(() => setError('Cloud groceries could not be refreshed.'));
  }, [user]);

  const value = useMemo<GroceryStoreValue>(() => ({
    items,
    ready,
    error,
    replaceItems: async (next) => {
      await persist(next);
      if (user) {
        try { await replaceCloudGroceries(user.id, next); }
        catch { setError('List generated locally but cloud sync could not finish.'); }
      }
    },
    addItem: async (item) => {
      const next = [item, ...itemsRef.current.filter((candidate) => candidate.key !== item.key)];
      await persist(next);
      if (user) {
        try { await replaceCloudGroceries(user.id, next); }
        catch { setError('Item saved locally but cloud sync could not finish.'); }
      }
    },
    toggleChecked: async (key) => {
      const item = itemsRef.current.find((candidate) => candidate.key === key);
      if (!item) return;
      const checked = !item.checked;
      const next = itemsRef.current.map((candidate) => candidate.key === key ? { ...candidate, checked } : candidate);
      await persist(next);
      if (user) {
        try { await setCloudGroceryChecked(user.id, key, checked); }
        catch { setError('Check-off saved locally but cloud sync could not finish.'); }
      }
    },
    clearChecked: async () => {
      const next = itemsRef.current.filter((item) => !item.checked);
      await persist(next);
      if (user) {
        try { await replaceCloudGroceries(user.id, next); }
        catch { setError('Checked items cleared locally but cloud sync could not finish.'); }
      }
    }
  }), [error, items, persist, ready, user]);

  return <GroceryStore.Provider value={value}>{children}</GroceryStore.Provider>;
}

export function useGroceryStore() {
  const value = useContext(GroceryStore);
  if (!value) throw new Error('useGroceryStore must be used inside GroceryStoreProvider');
  return value;
}

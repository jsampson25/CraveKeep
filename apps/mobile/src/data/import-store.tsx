import AsyncStorage from '@react-native-async-storage/async-storage';
import { createCaptureJob, type CaptureJob, type SourcePreview } from '@cravekeep/domain';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

const STORAGE_KEY = 'cravekeep.imports.v1';

type ImportStoreValue = {
  jobs: CaptureJob[];
  ready: boolean;
  error: string | null;
  createJob: (source: SourcePreview) => Promise<CaptureJob>;
  updateJob: (id: string, update: Partial<CaptureJob>) => Promise<void>;
  findJob: (id: string) => CaptureJob | undefined;
};

const ImportStore = createContext<ImportStoreValue | null>(null);

export function ImportStoreProvider({ children }: PropsWithChildren) {
  const [jobs, setJobs] = useState<CaptureJob[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { AsyncStorage.getItem(STORAGE_KEY).then((value) => setJobs(value ? JSON.parse(value) as CaptureJob[] : [])).catch(() => setError('Saved imports could not be loaded.')).finally(() => setReady(true)); }, []);
  const createJob = useCallback(async (source: SourcePreview) => {
    const job = createCaptureJob(source);
    setJobs((current) => {
      const next = [job, ...current];
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => setError('Import created, but it could not be saved on this device.'));
      return next;
    });
    return job;
  }, []);
  const updateJob = useCallback(async (id: string, update: Partial<CaptureJob>) => {
    setJobs((current) => {
      const next = current.map((job) => job.id === id ? { ...job, ...update, updatedAt: new Date().toISOString() } : job);
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => setError('Import updated, but it could not be saved on this device.'));
      return next;
    });
  }, []);
  const value = useMemo<ImportStoreValue>(() => ({
    jobs, ready, error,
    createJob,
    updateJob,
    findJob: (id) => jobs.find((job) => job.id === id)
  }), [createJob, jobs, ready, updateJob]);
  return <ImportStore.Provider value={value}>{children}</ImportStore.Provider>;
}

export function useImportStore() {
  const value = useContext(ImportStore);
  if (!value) throw new Error('useImportStore must be used inside ImportStoreProvider');
  return value;
}

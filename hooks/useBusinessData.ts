'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { BusinessData, BusinessDataPatch } from '@/templates/types';

export interface UseBusinessDataReturn {
  data: BusinessData;
  update: (patch: BusinessDataPatch) => void;
  flush: () => Promise<void>;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
}

const DEBOUNCE_MS = 800;

export function useBusinessData(
  siteId: string,
  initialData: BusinessData
): UseBusinessDataReturn {
  const [data, setData] = useState<BusinessData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const pendingPatch = useRef<BusinessDataPatch>({});
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

  const flush = useCallback(async () => {
    const patch = pendingPatch.current;
    if (Object.keys(patch).length === 0) return;
    pendingPatch.current = {};

    setIsSaving(true);
    setSaveError(null);

    try {
      const res = await fetch(`/api/update/${siteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Save failed');
      }
      setLastSaved(new Date());
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  }, [siteId]);

  const update = useCallback((patch: BusinessDataPatch) => {
    setData(prev => ({ ...prev, ...patch }));
    pendingPatch.current = { ...pendingPatch.current, ...patch };
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(flush, DEBOUNCE_MS);
  }, [flush]);

  useEffect(() => () => {
    clearTimeout(debounceTimer.current);
    flush();
  }, [flush]);

  return { data, update, flush, isSaving, lastSaved, saveError };
}

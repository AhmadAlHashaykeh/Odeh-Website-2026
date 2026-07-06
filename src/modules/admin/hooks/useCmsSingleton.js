import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../api/client';

export function useCmsSingleton({ showFn, updateFn }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await showFn();
      setData(response.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load content.');
    } finally {
      setIsLoading(false);
    }
  }, [showFn]);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(
    async (payload) => {
      setIsSaving(true);

      try {
        const response = await updateFn(payload);
        setData(response.data);
        return { success: true, data: response.data };
      } catch (err) {
        return {
          success: false,
          error: err instanceof ApiError ? err : new ApiError('Failed to save changes.', 0),
        };
      } finally {
        setIsSaving(false);
      }
    },
    [updateFn],
  );

  const refresh = useCallback(() => load(), [load]);

  return {
    data,
    setData,
    isLoading,
    error,
    isSaving,
    update,
    refresh,
  };
}

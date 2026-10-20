import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

export default function useFocusedResource(loader) {
  const requestId = useRef(0);
  const hasData = useRef(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setError('');
    if (!hasData.current) setIsLoading(true);
    setIsRefreshing(true);

    try {
      const nextData = await loader();
      if (requestId.current === currentRequest) {
        hasData.current = true;
        setData(nextData);
      }
    } catch (loadError) {
      if (requestId.current === currentRequest) {
        setError(loadError.message || 'Please try again in a moment.');
      }
    } finally {
      if (requestId.current === currentRequest) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [loader]);

  useFocusEffect(
    useCallback(() => {
      refresh();
      return () => {
        requestId.current += 1;
      };
    }, [refresh])
  );

  return { data, isLoading, isRefreshing, error, refresh };
}

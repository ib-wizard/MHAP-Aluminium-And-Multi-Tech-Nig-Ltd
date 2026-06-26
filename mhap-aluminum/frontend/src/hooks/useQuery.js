import { useEffect, useState, useCallback } from 'react';

/**
 * Minimal data-fetching hook: calls `fetcher()` on mount (and whenever
 * `deps` changes), tracking loading/error/data state. Not a cache layer -
 * good enough for a marketing site's read-mostly public pages.
 *
 * @param {() => Promise<any>} fetcher
 * @param {any[]} deps
 */
export function useQuery(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetcher()
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetcher()
      .then((res) => active && setData(res))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch };
}

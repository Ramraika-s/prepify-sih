"use client";
import { useState, useEffect } from "react";

export function useFetch<T>({ queryKey, queryFn, enabled = true, initialData }: { queryKey: any[], queryFn: () => Promise<T>, enabled?: boolean, initialData?: T }) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData && enabled);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;
    
    let isMounted = true;
    setIsLoading(true);

    queryFn()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(queryKey), enabled]);

  return { data, isLoading, error, isFetching: isLoading };
}

import { useEffect, useState } from 'react';

/** Simulates an initial page load delay for preview-mode CMS pages. */
export function useSimulatedLoading(delay = 480) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isLoading;
}

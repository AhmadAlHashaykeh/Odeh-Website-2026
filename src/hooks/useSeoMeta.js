import { useEffect, useState } from 'react';
import { getSeoByRoute } from '../api/public/content';
import { usePageMeta } from './usePageMeta';

export function useSeoMeta(route, fallback = {}) {
  const [meta, setMeta] = useState({
    title: fallback.title ?? '',
    description: fallback.description ?? '',
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await getSeoByRoute(route);
        if (!cancelled && response.data) {
          setMeta({
            title: response.data.metaTitle ?? fallback.title ?? '',
            description: response.data.metaDescription ?? fallback.description ?? '',
          });
        }
      } catch {
        if (!cancelled) {
          setMeta({
            title: fallback.title ?? '',
            description: fallback.description ?? '',
          });
        }
      }
    }

    if (route) {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [route, fallback.title, fallback.description]);

  usePageMeta(meta);
}

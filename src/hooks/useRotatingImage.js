import { useEffect, useRef, useState } from 'react';
import { CATEGORY_IMAGE_ROTATION_MS } from '../utils/categoryProjectImages';

function imagesKey(images) {
  return (images ?? []).join('\0');
}

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Rotate through image URLs on an interval.
 * - Stable across re-renders when the URL list content is unchanged
 * - Skips consecutive duplicates when the list has repeats
 * - Pauses while the document is hidden
 * - Stays on the first image when reduced-motion is preferred or only one URL exists
 */
export function useRotatingImage(images, { intervalMs = CATEGORY_IMAGE_ROTATION_MS } = {}) {
  const sources = Array.isArray(images) ? images.filter(Boolean) : [];
  const key = imagesKey(sources);
  const sourcesRef = useRef(sources);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    sourcesRef.current = sources;
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps -- content-stable via key

  useEffect(() => {
    indexRef.current = 0;
    setIndex(0);
  }, [key]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion || sourcesRef.current.length <= 1) {
      return undefined;
    }

    let timerId = null;

    const clearTimer = () => {
      if (timerId != null) {
        window.clearInterval(timerId);
        timerId = null;
      }
    };

    const advance = () => {
      const list = sourcesRef.current;
      if (list.length <= 1) return;

      let next = (indexRef.current + 1) % list.length;
      // Avoid consecutive duplicate URLs if the list still contains repeats.
      if (list[next] === list[indexRef.current]) {
        const start = next;
        do {
          next = (next + 1) % list.length;
        } while (list[next] === list[indexRef.current] && next !== start);
      }

      indexRef.current = next;
      setIndex(next);
    };

    const startTimer = () => {
      clearTimer();
      if (document.hidden || sourcesRef.current.length <= 1) return;
      timerId = window.setInterval(advance, intervalMs);
    };

    const onVisibility = () => {
      if (document.hidden) {
        clearTimer();
      } else {
        startTimer();
      }
    };

    startTimer();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearTimer();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [key, intervalMs, reducedMotion]);

  const currentSrc = sources[index] ?? sources[0] ?? '';

  return {
    index,
    currentSrc,
    sources,
    isRotating: !reducedMotion && sources.length > 1,
    prefersReducedMotion: reducedMotion,
  };
}

import { useEffect, useRef, useState } from 'react';

/**
 * Parses numeric prefix from strings like "7+", "1000+", "Middle East".
 * Returns { numeric, suffix, isNumeric }.
 */
function parseStatValue(value) {
  const match = String(value).match(/^(\d+(?:\.\d+)?)(\+?)$/);
  if (match) {
    return { numeric: parseFloat(match[1]), suffix: match[2] || '', isNumeric: true };
  }
  return { numeric: 0, suffix: '', isNumeric: false, text: value };
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

/**
 * Animates a number when the element enters the viewport.
 * @param {string|number} target - Display value (e.g. "7+", 1000)
 * @param {{ duration?: number, threshold?: number }} [options]
 */
export function useCountUp(target, options = {}) {
  const { duration = 1800, threshold = 0.2 } = options;
  const ref = useRef(null);
  const parsed = parseStatValue(target);
  const [display, setDisplay] = useState(parsed.isNumeric ? '0' + parsed.suffix : parsed.text || target);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!parsed.isNumeric) return undefined;

    const element = ref.current;
    if (!element) return undefined;

    const animate = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const start = performance.now();
      const endValue = parsed.numeric;

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = easeOutCubic(progress);
        const current = Math.round(eased * endValue);
        setDisplay(`${current}${parsed.suffix}`);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: Math.min(threshold, 0.05), rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(element);

    const checkInitial = () => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight - 40 && rect.bottom > 40) animate();
    };
    checkInitial();
    requestAnimationFrame(checkInitial);

    return () => observer.disconnect();
  }, [target, duration, threshold, parsed.isNumeric, parsed.numeric, parsed.suffix]);

  return { ref, display: parsed.isNumeric ? display : target };
}

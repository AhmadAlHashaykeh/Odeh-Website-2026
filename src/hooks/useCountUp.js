import { useEffect, useRef, useState } from 'react';

/**
 * Parses numeric stats like "+7", "+1000", legacy "7+", or plain "1000".
 * Returns { numeric, prefix, suffix, isNumeric }.
 */
function parseStatValue(value) {
  const raw = String(value).trim();
  const prefixPlus = raw.match(/^\+(\d+(?:\.\d+)?)$/);
  if (prefixPlus) {
    return { numeric: parseFloat(prefixPlus[1]), prefix: '+', suffix: '', isNumeric: true };
  }

  const suffixPlus = raw.match(/^(\d+(?:\.\d+)?)\+$/);
  if (suffixPlus) {
    // Normalize legacy "7+" to prefix form for display.
    return { numeric: parseFloat(suffixPlus[1]), prefix: '+', suffix: '', isNumeric: true };
  }

  const plain = raw.match(/^(\d+(?:\.\d+)?)$/);
  if (plain) {
    return { numeric: parseFloat(plain[1]), prefix: '', suffix: '', isNumeric: true };
  }

  return { numeric: 0, prefix: '', suffix: '', isNumeric: false, text: value };
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

/**
 * Animates a number when the element enters the viewport.
 * @param {string|number} target - Display value (e.g. "+7", 1000)
 * @param {{ duration?: number, threshold?: number }} [options]
 */
export function useCountUp(target, options = {}) {
  const { duration = 1800, threshold = 0.2 } = options;
  const ref = useRef(null);
  const parsed = parseStatValue(target);
  const [display, setDisplay] = useState(
    parsed.isNumeric ? `${parsed.prefix}0${parsed.suffix}` : parsed.text || target,
  );
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
        setDisplay(`${parsed.prefix}${current}${parsed.suffix}`);

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
  }, [target, duration, threshold, parsed.isNumeric, parsed.numeric, parsed.prefix, parsed.suffix]);

  return { ref, display: parsed.isNumeric ? display : target };
}

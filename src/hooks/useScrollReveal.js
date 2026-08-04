import { useCallback, useEffect, useState } from 'react';

export function useScrollReveal(threshold = 0.15) {
  const [element, setElement] = useState(null);

  const ref = useCallback((node) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return undefined;

    const reveal = () => {
      element.classList.add('visible');
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.unobserve(element);
        }
      },
      { threshold: Math.min(threshold, 0.05), rootMargin: '0px 0px -20px 0px' },
    );

    observer.observe(element);

    // Fallback if the element is already in view when mounted (or observer misses)
    const checkInitialVisibility = () => {
      const rect = element.getBoundingClientRect();
      const inView = rect.top < window.innerHeight - 20 && rect.bottom > 20;
      if (inView) reveal();
    };

    checkInitialVisibility();
    requestAnimationFrame(checkInitialVisibility);

    return () => observer.disconnect();
  }, [element, threshold]);

  return ref;
}

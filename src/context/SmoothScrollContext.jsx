import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const SmoothScrollContext = createContext({
  isSmooth: false,
  setScrollLocked: () => {},
  scrollToTop: () => {},
  subscribeScroll: () => () => {},
});

function shouldUseSmoothScroll() {
  return (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !window.matchMedia('(pointer: coarse)').matches &&
    window.matchMedia('(hover: hover)').matches
  );
}

function notifyScrollListeners(listeners, scrollY) {
  listeners.forEach((listener) => listener(scrollY));
}

function cleanupLenisClasses() {
  document.documentElement.classList.remove('lenis-smooth', 'lenis', 'lenis-stopped');
  document.body.classList.remove('lenis', 'lenis-stopped');
}

export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const scrollLockedRef = useRef(false);
  const scrollListenersRef = useRef(new Set());
  const evaluateRef = useRef(null);
  const [isSmooth, setIsSmooth] = useState(false);
  const location = useLocation();

  const subscribeScroll = useCallback((listener) => {
    scrollListenersRef.current.add(listener);
    listener(lenisRef.current?.scroll ?? window.scrollY);

    return () => {
      scrollListenersRef.current.delete(listener);
    };
  }, []);

  const setScrollLocked = useCallback((locked) => {
    scrollLockedRef.current = locked;
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
  }, []);

  const scrollToTop = useCallback(() => {
    const lenis = lenisRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (lenis) {
      lenis.scrollTo(0, {
        lock: false,
        immediate: reducedMotion,
        duration: reducedMotion ? 0 : 1.15,
      });
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reducedMotion ? 'instant' : 'smooth',
    });
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const hoverCapable = window.matchMedia('(hover: hover)');

    const onNativeScroll = () => {
      notifyScrollListeners(scrollListenersRef.current, window.scrollY);
    };

    const initLenis = () => {
      const lenis = new Lenis({
        lerp: 0.085,
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 0,
        syncTouch: false,
        autoRaf: true,
        allowNestedScroll: true,
        anchors: {
          offset: -76,
        },
      });

      lenis.on('scroll', ({ scroll }) => {
        notifyScrollListeners(scrollListenersRef.current, scroll);
      });

      lenisRef.current = lenis;
      setIsSmooth(true);
      document.documentElement.classList.add('lenis-smooth');

      if (scrollLockedRef.current) lenis.stop();
      notifyScrollListeners(scrollListenersRef.current, lenis.scroll);
    };

    const destroyLenis = () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      setIsSmooth(false);
      cleanupLenisClasses();
      notifyScrollListeners(scrollListenersRef.current, window.scrollY);
    };

    const evaluate = () => {
      if (window.location.pathname.startsWith('/admin')) {
        destroyLenis();
        return;
      }

      if (shouldUseSmoothScroll()) {
        if (!lenisRef.current) initLenis();
        window.removeEventListener('scroll', onNativeScroll);
      } else {
        destroyLenis();
        window.addEventListener('scroll', onNativeScroll, { passive: true });
        onNativeScroll();
      }
    };

    evaluateRef.current = evaluate;
    evaluate();
    reducedMotion.addEventListener('change', evaluate);
    coarsePointer.addEventListener('change', evaluate);
    hoverCapable.addEventListener('change', evaluate);
    window.addEventListener('resize', evaluate, { passive: true });

    return () => {
      reducedMotion.removeEventListener('change', evaluate);
      coarsePointer.removeEventListener('change', evaluate);
      hoverCapable.removeEventListener('change', evaluate);
      window.removeEventListener('resize', evaluate);
      window.removeEventListener('scroll', onNativeScroll);
      destroyLenis();
    };
  }, []);

  useEffect(() => {
    const isAdmin = location.pathname.startsWith('/admin');

    if (isAdmin) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        setIsSmooth(false);
      }
      cleanupLenisClasses();

      const adminScroll = document.querySelector('[data-admin-scroll]');
      if (adminScroll) {
        adminScroll.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      return;
    }

    evaluateRef.current?.();

    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { lock: false });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  const value = useMemo(
    () => ({
      isSmooth,
      setScrollLocked,
      scrollToTop,
      subscribeScroll,
    }),
    [isSmooth, setScrollLocked, scrollToTop, subscribeScroll],
  );

  return (
    <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

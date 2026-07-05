import { useEffect, useRef } from 'react';

const LERP = 0.068;
const MAX_TX = 24;
const MAX_TY = 16;
const MAX_ROTATE_X = 2;
const MAX_ROTATE_Y = 3;
const BASE_SCALE = 1.08;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function useHeroDepth() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;
    if (!hero || !video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    let enabled = !reducedMotion.matches && !coarsePointer.matches && window.innerWidth > 768;

    const resetVideo = () => {
      video.style.transform = '';
    };

    const applyFrame = () => {
      current.current.x += (target.current.x - current.current.x) * LERP;
      current.current.y += (target.current.y - current.current.y) * LERP;

      if (enabled) {
        const cx = current.current.x;
        const cy = current.current.y;
        const tx = cx * MAX_TX;
        const ty = cy * MAX_TY;
        const rotateX = -cy * MAX_ROTATE_X;
        const rotateY = cx * MAX_ROTATE_Y;

        video.style.transform = [
          `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`,
          `scale(${BASE_SCALE})`,
          `rotateX(${rotateX.toFixed(3)}deg)`,
          `rotateY(${rotateY.toFixed(3)}deg)`,
        ].join(' ');
      }

      const settled =
        Math.abs(target.current.x - current.current.x) < 0.0008 &&
        Math.abs(target.current.y - current.current.y) < 0.0008;

      if (!settled) {
        rafId.current = requestAnimationFrame(applyFrame);
      } else {
        rafId.current = null;
      }
    };

    const scheduleFrame = () => {
      if (!rafId.current) rafId.current = requestAnimationFrame(applyFrame);
    };

    const onPointerMove = (event) => {
      if (!enabled) return;
      const rect = hero.getBoundingClientRect();
      target.current.x = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      target.current.y = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
      scheduleFrame();
    };

    const onPointerLeave = () => {
      if (!enabled) return;
      target.current.x = 0;
      target.current.y = 0;
      scheduleFrame();
    };

    const onReducedMotionChange = () => {
      enabled = !reducedMotion.matches && !coarsePointer.matches && window.innerWidth > 768;
      if (reducedMotion.matches || !enabled) {
        target.current = { x: 0, y: 0 };
        current.current = { x: 0, y: 0 };
        resetVideo();
      }
    };

    const onResize = () => {
      enabled = !reducedMotion.matches && !coarsePointer.matches && window.innerWidth > 768;
      if (!enabled) {
        target.current = { x: 0, y: 0 };
        current.current = { x: 0, y: 0 };
        resetVideo();
      }
    };

    if (enabled) {
      hero.addEventListener('mousemove', onPointerMove, { passive: true });
      hero.addEventListener('mouseleave', onPointerLeave, { passive: true });
    }

    reducedMotion.addEventListener('change', onReducedMotionChange);
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      hero.removeEventListener('mousemove', onPointerMove);
      hero.removeEventListener('mouseleave', onPointerLeave);
      reducedMotion.removeEventListener('change', onReducedMotionChange);
      window.removeEventListener('resize', onResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      resetVideo();
    };
  }, []);

  return { heroRef, videoRef };
}

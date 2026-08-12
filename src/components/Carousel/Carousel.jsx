import { useCallback, useEffect, useRef, useState, Children } from 'react';
import styles from './Carousel.module.css';

export default function Carousel({ children, className = '' }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const DRAG_THRESHOLD = 5;

  const dragState = useRef({
    pending: false,
    active: false,
    startX: 0,
    startY: 0,
    scrollStart: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    moved: false,
    pointerId: null,
  });
  const momentumRef = useRef(null);

  const updateState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    const maxScroll = scrollWidth - clientWidth;

    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateState();
    track.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);

    return () => {
      track.removeEventListener('scroll', updateState);
      window.removeEventListener('resize', updateState);
    };
  }, [updateState, children]);

  useEffect(() => {
    return () => {
      if (momentumRef.current) cancelAnimationFrame(momentumRef.current);
    };
  }, []);

  const stopMomentum = () => {
    if (momentumRef.current) {
      cancelAnimationFrame(momentumRef.current);
      momentumRef.current = null;
    }
  };

  const applyMomentum = () => {
    const track = trackRef.current;
    if (!track) return;

    let velocity = dragState.current.velocity * 18;
    const step = () => {
      if (Math.abs(velocity) < 0.4) {
        momentumRef.current = null;
        return;
      }
      track.scrollLeft -= velocity;
      velocity *= 0.92;
      momentumRef.current = requestAnimationFrame(step);
    };
    momentumRef.current = requestAnimationFrame(step);
  };

  const releaseDrag = (pointerId) => {
    const track = trackRef.current;
    const wasActive = dragState.current.active;

    dragState.current.pending = false;
    dragState.current.active = false;
    setIsDragging(false);

    if (track && pointerId != null) {
      if (track.hasPointerCapture(pointerId)) {
        track.releasePointerCapture(pointerId);
      }
      track.style.scrollBehavior = 'smooth';
    }

    if (wasActive && dragState.current.moved) {
      applyMomentum();
    }
  };

  const handlePointerDown = (e) => {
    if (e.button !== 0 || e.pointerType !== 'mouse') return;

    const track = trackRef.current;
    if (!track) return;

    stopMomentum();
    dragState.current = {
      pending: true,
      active: false,
      startX: e.clientX,
      startY: e.clientY,
      scrollStart: track.scrollLeft,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocity: 0,
      moved: false,
      pointerId: e.pointerId,
    };
  };

  const handlePointerMove = (e) => {
    if (!dragState.current.pending && !dragState.current.active) return;

    const track = trackRef.current;
    if (!track) return;

    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;

    if (dragState.current.pending && !dragState.current.active) {
      if (Math.abs(dx) <= DRAG_THRESHOLD && Math.abs(dy) <= DRAG_THRESHOLD) return;

      if (Math.abs(dy) > Math.abs(dx)) {
        dragState.current.pending = false;
        return;
      }

      dragState.current.pending = false;
      dragState.current.active = true;
      setIsDragging(true);
      track.setPointerCapture(e.pointerId);
      track.style.scrollBehavior = 'auto';
    }

    if (!dragState.current.active) return;

    dragState.current.moved = true;
    e.preventDefault();
    track.scrollLeft = dragState.current.scrollStart - dx;

    const now = performance.now();
    const dt = now - dragState.current.lastTime;
    if (dt > 0) {
      dragState.current.velocity = (e.clientX - dragState.current.lastX) / dt;
    }
    dragState.current.lastX = e.clientX;
    dragState.current.lastTime = now;
  };

  const handlePointerUp = (e) => {
    if (!dragState.current.pending && !dragState.current.active) return;
    releaseDrag(e.pointerId);
  };

  const handlePointerLeave = () => {
    if (dragState.current.pending && !dragState.current.active) {
      dragState.current.pending = false;
    }
  };

  const handleWheel = (e) => {
    const track = trackRef.current;
    if (!track) return;

    const isHorizontalIntent =
      Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;

    if (!isHorizontalIntent) return;

    e.preventDefault();
    stopMomentum();
    track.style.scrollBehavior = 'auto';
    track.scrollLeft += e.shiftKey ? e.deltaY : e.deltaX;
    requestAnimationFrame(() => {
      if (track) track.style.scrollBehavior = 'smooth';
    });
  };

  const scrollBySlide = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    stopMomentum();
    const slide = track.querySelector('[data-slide]');
    const gap = parseFloat(getComputedStyle(track).gap) || 20;
    const amount = slide ? slide.offsetWidth + gap : track.clientWidth * 0.85;

    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  return (
    <div className={`${styles.carousel} ${className}`}>
      <div className={styles.trackWrap}>
        <div
          className={`${styles.edgeFade} ${styles.edgeFadeLeft} ${canPrev ? '' : styles.edgeFadeHidden}`}
          aria-hidden="true"
        />
        <div
          className={`${styles.edgeFade} ${styles.edgeFadeRight} ${canNext ? '' : styles.edgeFadeHidden}`}
          aria-hidden="true"
        />

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowPrev} ${canPrev ? '' : styles.arrowHidden}`}
          aria-label="Previous slide"
          tabIndex={canPrev ? 0 : -1}
          aria-hidden={!canPrev}
          onClick={() => scrollBySlide(-1)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowNext} ${canNext ? '' : styles.arrowHidden}`}
          aria-label="Next slide"
          tabIndex={canNext ? 0 : -1}
          aria-hidden={!canNext}
          onClick={() => scrollBySlide(1)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div
          className={`${styles.track} ${isDragging ? styles.trackDragging : ''}`}
          ref={trackRef}
          onPointerDownCapture={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onWheel={handleWheel}
          onDragStart={(e) => e.preventDefault()}
        >
          {Children.toArray(children).map((child) => (
                <div key={child.key} className={styles.slide} data-slide>
                  {child}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

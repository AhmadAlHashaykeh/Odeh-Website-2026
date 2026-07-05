import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import { ArrowIcon, CloseIcon } from './GalleryIcons';
import styles from './GalleryLightbox.module.css';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.35;
const SWIPE_THRESHOLD = 48;

export default function GalleryLightbox({
  images,
  activeIndex,
  onClose,
  onPrev,
  onNext,
  enableZoom = true,
  ariaLabel = 'Gallery viewer',
}) {
  const closeRef = useRef(null);
  const { setScrollLocked } = useSmoothScroll();
  const imageWrapRef = useRef(null);
  const panRef = useRef({ active: false, startX: 0, startY: 0, translateX: 0, translateY: 0 });
  const swipeRef = useRef({ active: false, startX: 0, startY: 0, moved: false });

  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const image = images[activeIndex];
  const hasMultiple = images.length > 1;
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < images.length - 1;
  const isZoomed = enableZoom && zoom > MIN_ZOOM + 0.05;

  const resetView = useCallback(() => {
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    resetView();
  }, [activeIndex, resetView]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setScrollLocked(true);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      setScrollLocked(false);
    };
  }, [setScrollLocked]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (isZoomed) return;
      if (event.key === 'ArrowLeft' && hasPrev) {
        event.preventDefault();
        onPrev();
      }
      if (event.key === 'ArrowRight' && hasNext) {
        event.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasNext, hasPrev, isZoomed, onClose, onNext, onPrev]);

  const toggleZoom = () => {
    if (!enableZoom) return;
    if (isZoomed) {
      resetView();
    } else {
      setZoom(2);
      setPan({ x: 0, y: 0 });
    }
  };

  const handleWheel = (event) => {
    if (!enableZoom) return;
    event.preventDefault();
    const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((current) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current + delta));
      if (next <= MIN_ZOOM) {
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;

    if (isZoomed) {
      panRef.current = {
        active: true,
        startX: event.clientX,
        startY: event.clientY,
        translateX: pan.x,
        translateY: pan.y,
        pointerId: event.pointerId,
      };
      imageWrapRef.current?.setPointerCapture(event.pointerId);
      return;
    }

    swipeRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      pointerId: event.pointerId,
    };
    imageWrapRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (panRef.current.active) {
      const dx = event.clientX - panRef.current.startX;
      const dy = event.clientY - panRef.current.startY;
      setPan({
        x: panRef.current.translateX + dx,
        y: panRef.current.translateY + dy,
      });
      return;
    }

    if (!swipeRef.current.active) return;

    const dx = event.clientX - swipeRef.current.startX;
    const dy = event.clientY - swipeRef.current.startY;

    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      swipeRef.current.moved = true;
    }
  };

  const handlePointerUp = (event) => {
    if (panRef.current.active) {
      panRef.current.active = false;
      imageWrapRef.current?.releasePointerCapture(event.pointerId);
      return;
    }

    if (!swipeRef.current.active) return;

    const dx = event.clientX - swipeRef.current.startX;

    if (swipeRef.current.moved && hasMultiple) {
      if (dx <= -SWIPE_THRESHOLD && hasNext) onNext();
      else if (dx >= SWIPE_THRESHOLD && hasPrev) onPrev();
    } else if (!swipeRef.current.moved && enableZoom) {
      toggleZoom();
    }

    swipeRef.current.active = false;
    imageWrapRef.current?.releasePointerCapture(event.pointerId);
  };

  if (!image) return null;

  return createPortal(
    <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={ariaLabel}>
      <button type="button" className={styles.backdrop} aria-label="Close gallery" onClick={onClose} />

      <button
        ref={closeRef}
        type="button"
        className={styles.closeBtn}
        aria-label="Close gallery"
        onClick={onClose}
      >
        <CloseIcon />
      </button>

      {hasMultiple && hasPrev && !isZoomed && (
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navPrev}`}
          aria-label="Previous image"
          onClick={onPrev}
        >
          <ArrowIcon direction="prev" />
        </button>
      )}

      <div
        ref={imageWrapRef}
        className={`${styles.imageWrap} ${isZoomed ? styles.imageWrapZoomed : ''} ${enableZoom ? styles.imageWrapZoomable : ''}`}
        onWheel={enableZoom ? handleWheel : undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <figure className={styles.figure} key={image.src}>
          <img
            src={image.src}
            alt={image.alt}
            className={styles.image}
            style={
              enableZoom
                ? { transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }
                : undefined
            }
            draggable={false}
            decoding="async"
            onDoubleClick={enableZoom ? toggleZoom : undefined}
          />
        </figure>
      </div>

      {hasMultiple && hasNext && !isZoomed && (
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navNext}`}
          aria-label="Next image"
          onClick={onNext}
        >
          <ArrowIcon direction="next" />
        </button>
      )}

      {hasMultiple && (
        <p className={styles.counter} aria-live="polite">
          {activeIndex + 1} / {images.length}
        </p>
      )}
    </div>,
    document.body,
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import GalleryLightbox from './GalleryLightbox';
import { ArrowIcon } from './GalleryIcons';
import styles from './GallerySlider.module.css';

const SWIPE_THRESHOLD = 48;

export default function GallerySlider({
  gallery,
  title,
  ariaLabel,
  enableZoom = true,
}) {
  const sectionRef = useScrollReveal(0.06);
  const viewportRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, moved: false });

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const hasMultiple = gallery.length > 1;
  const currentImage = gallery[activeIndex];
  const label = ariaLabel ?? `${title} photo gallery`;

  const goTo = useCallback(
    (index) => {
      if (index < 0 || index >= gallery.length || index === activeIndex) return;
      setIsTransitioning(true);
      setActiveIndex(index);
    },
    [activeIndex, gallery.length],
  );

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  useEffect(() => {
    if (!isTransitioning) return;
    const timer = window.setTimeout(() => setIsTransitioning(false), 450);
    return () => window.clearTimeout(timer);
  }, [isTransitioning, activeIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (lightboxIndex !== null) return;

      const target = event.target;
      if (target instanceof HTMLElement && target.closest('[role="dialog"]')) return;

      if (event.key === 'ArrowLeft' && hasMultiple) {
        event.preventDefault();
        goPrev();
      }
      if (event.key === 'ArrowRight' && hasMultiple) {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, hasMultiple, lightboxIndex]);

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    dragRef.current = {
      active: true,
      pending: true,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      horizontal: false,
      pointerId: event.pointerId,
    };
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current.active) return;

    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;

    if (dragRef.current.pending) {
      if (Math.abs(dx) <= 8 && Math.abs(dy) <= 8) return;

      dragRef.current.pending = false;

      if (Math.abs(dy) > Math.abs(dx)) {
        dragRef.current.active = false;
        return;
      }

      dragRef.current.horizontal = true;
      viewportRef.current?.setPointerCapture(event.pointerId);
    }

    if (dragRef.current.horizontal) {
      dragRef.current.moved = true;
    }
  };

  const handlePointerUp = (event) => {
    if (!dragRef.current.active) return;

    const dx = event.clientX - dragRef.current.startX;

    if (dragRef.current.horizontal && dragRef.current.moved && hasMultiple) {
      if (dx <= -SWIPE_THRESHOLD) goNext();
      else if (dx >= SWIPE_THRESHOLD) goPrev();
    } else if (!dragRef.current.moved) {
      openLightbox(activeIndex);
    }

    dragRef.current.active = false;
    dragRef.current.pending = false;
    dragRef.current.horizontal = false;

    if (viewportRef.current?.hasPointerCapture(event.pointerId)) {
      viewportRef.current.releasePointerCapture(event.pointerId);
    }
  };

  if (!currentImage) return null;

  return (
    <section className={styles.gallery} aria-label={label}>
      <div className={styles.frame}>
        <div ref={sectionRef} className={`${styles.wrapper} reveal`}>
          <div
            ref={viewportRef}
            className={`${styles.viewport} ${hasMultiple ? styles.viewportMultiple : styles.viewportSingle}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <figure
              className={`${styles.figure} ${isTransitioning ? styles.figureTransitioning : ''}`}
              key={currentImage.src}
            >
              <img
                src={currentImage.src}
                alt={currentImage.alt}
                className={styles.mainImage}
                loading={activeIndex === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            </figure>
          </div>

          {hasMultiple && (
            <>
              <div className={styles.thumbnails} role="tablist" aria-label="Gallery thumbnails">
                {gallery.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={`Show image ${index + 1}: ${image.alt}`}
                    className={`${styles.thumb} ${index === activeIndex ? styles.thumbActive : ''}`}
                    onClick={() => goTo(index)}
                  >
                    <img src={resolveMediaUrl(image.src)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>

              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.navBtn}
                  aria-label="Previous image"
                  onClick={goPrev}
                  disabled={activeIndex === 0}
                >
                  <ArrowIcon direction="prev" />
                  <span className={styles.navLabel}>Previous</span>
                </button>

                <button
                  type="button"
                  className={styles.navBtn}
                  aria-label="Next image"
                  onClick={goNext}
                  disabled={activeIndex === gallery.length - 1}
                >
                  <span className={styles.navLabel}>Next</span>
                  <ArrowIcon direction="next" />
                </button>
              </div>

              <p className={styles.counter} aria-live="polite">
                {activeIndex + 1} / {gallery.length}
              </p>
            </>
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={gallery}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={() => setLightboxIndex((current) => (current > 0 ? current - 1 : current))}
          onNext={() =>
            setLightboxIndex((current) =>
              current < gallery.length - 1 ? current + 1 : current,
            )
          }
          enableZoom={enableZoom}
          ariaLabel={label}
        />
      )}
    </section>
  );
}

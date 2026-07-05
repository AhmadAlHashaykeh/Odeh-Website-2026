import { useCallback, useState } from 'react';
import Carousel from '../Carousel/Carousel';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import OfficeGalleryLightbox from './OfficeGalleryLightbox';
import styles from './OverviewOfficeSlider.module.css';

function ExpandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function SlideImage({ image, index, onOpen }) {
  return (
    <figure className={styles.slide}>
      <button
        type="button"
        className={styles.imageBtn}
        aria-label={`View ${image.alt}`}
        onClick={() => onOpen(index)}
      >
        <div className={styles.imageWrap}>
          <img src={image.src} alt={image.alt} loading="lazy" draggable={false} decoding="async" />
          <span className={styles.expandHint} aria-hidden="true">
            <ExpandIcon />
          </span>
        </div>
      </button>
    </figure>
  );
}

export default function OverviewOfficeSlider({ label, description, images }) {
  const headerRef = useScrollReveal(0.08);
  const carouselRef = useScrollReveal(0.05);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((current) => (current > 0 ? current - 1 : current));
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((current) =>
      current < images.length - 1 ? current + 1 : current,
    );
  }, [images.length]);

  return (
    <section className={styles.slider} aria-label="Office gallery">
      <div className="container">
        <div ref={headerRef} className={`${styles.header} reveal`}>
          <h2 className={styles.heading}>{label}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </div>

      <div ref={carouselRef} className={`${styles.carouselOuter} reveal reveal-delay-1`}>
        <div className="container">
          <Carousel className={styles.carousel}>
            {images.map((image, index) => (
              <SlideImage
                key={image.src}
                image={image}
                index={index}
                onOpen={openLightbox}
              />
            ))}
          </Carousel>
        </div>
      </div>

      {lightboxIndex !== null && (
        <OfficeGalleryLightbox
          images={images}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </section>
  );
}

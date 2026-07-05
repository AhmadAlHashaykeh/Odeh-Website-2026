import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './OfficeMap.module.css';

export default function OfficeMap({ heading, subheading, embedUrl }) {
  const headerRef = useScrollReveal(0.1);
  const mapRef = useScrollReveal(0.08);

  return (
    <section className={styles.section} aria-labelledby="office-map-heading">
      <div className="container">
        <div ref={headerRef} className={`${styles.header} reveal`}>
          <h2 id="office-map-heading" className={styles.heading}>
            {heading}
          </h2>
          <p className={styles.subheading}>{subheading}</p>
        </div>

        <div ref={mapRef} className={`${styles.mapWrap} reveal reveal-delay-1`}>
          <iframe
            src={embedUrl}
            title="Odeh Design Office location on Google Maps"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className={styles.map}
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

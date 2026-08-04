import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { getServicePath } from '../../utils/contentPaths';
import SafeImage from '../SafeImage/SafeImage';
import Carousel from '../Carousel/Carousel';
import styles from './Services.module.css';

function ServiceCard({ service }) {
  const path = getServicePath(service) || (service.slug ? `/services/${service.slug}` : null);

  const inner = (
    <>
      <div className={styles.imageWrap}>
        <SafeImage
          src={resolveMediaUrl(service.image)}
          alt={service.title}
          className={styles.cardImage}
          loading="lazy"
        />
        <div className={styles.imageOverlay} aria-hidden="true" />
        <div className={styles.content}>
          <span className={styles.accentLine} aria-hidden="true" />
          <h3 className={styles.cardTitle}>{service.title}</h3>
          <p className={styles.cardDesc}>{service.description}</p>
        </div>
      </div>
    </>
  );

  if (!path) {
    return <article className={styles.card}>{inner}</article>;
  }

  return (
    <Link to={path} className={`${styles.card} ${styles.cardLink}`} aria-label={service.title}>
      {inner}
    </Link>
  );
}

export default function Services({ content = {} }) {
  const headerRef = useScrollReveal();
  const carouselRef = useScrollReveal(0.08);

  const sectionLabel = content.sectionLabel ?? 'What We Do';
  const heading = content.heading ?? 'Our Services';
  const description =
    content.description ??
    "A dedicated section showcasing the company's primary engineering and consulting services.";
  const services = content.services ?? [];

  return (
    <section className={styles.services} id="services">
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className="container">
        <div ref={headerRef} className={`${styles.header} reveal`}>
          <div className={styles.headerInner}>
            <span className="section-label">{sectionLabel}</span>
            <h2 className={styles.sectionHeading}>{heading}</h2>
            <p className={styles.sectionDesc}>{description}</p>
          </div>
        </div>

        <div ref={carouselRef} className={`${styles.carouselReveal} reveal reveal-delay-1`}>
          <Carousel className={styles.carousel}>
            {services.map((service) => (
              <ServiceCard key={service.id ?? service.slug} service={service} />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}

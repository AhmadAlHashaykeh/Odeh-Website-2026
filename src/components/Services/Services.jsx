import { useScrollReveal } from '../../hooks/useScrollReveal';
import { services } from '../../data/services';
import Carousel from '../Carousel/Carousel';
import styles from './Services.module.css';

function ServiceCard({ service }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={service.image} alt={service.title} loading="lazy" draggable={false} />
        <div className={styles.imageOverlay} aria-hidden="true" />
        <div className={styles.content}>
          <span className={styles.accentLine} aria-hidden="true" />
          <h3 className={styles.cardTitle}>{service.title}</h3>
          <p className={styles.cardDesc}>{service.description}</p>
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  const headerRef = useScrollReveal();
  const carouselRef = useScrollReveal(0.08);

  return (
    <section className={styles.services} id="services">
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className="container">
        <div ref={headerRef} className={`${styles.header} reveal`}>
          <div className={styles.headerInner}>
            <span className="section-label">What We Do</span>
            <h2 className={styles.sectionHeading}>Our Services</h2>
            <p className={styles.sectionDesc}>
              A dedicated section showcasing the company&apos;s primary engineering and consulting
              services.
            </p>
          </div>
        </div>

        <div ref={carouselRef} className={`${styles.carouselReveal} reveal reveal-delay-1`}>
          <Carousel className={styles.carousel}>
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}

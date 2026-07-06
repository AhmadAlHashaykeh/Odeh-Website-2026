import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './About.module.css';

export default function About({ content = {} }) {
  const imageRef = useScrollReveal();
  const contentRef = useScrollReveal();

  const sectionLabel = content.sectionLabel ?? 'About Us';
  const titleMain = content.titleMain ?? 'ODEH &';
  const titleAccent = content.titleAccent ?? 'PARTNERS DESIGN';
  const body =
    content.body ??
    'Welcome to the online platform of ODEH & PARTNERS DESIGN, an avant-garde structural design firm with a global vision.';
  const stats = content.stats ?? [
    { value: '7+', label: 'Years of Excellence' },
    { value: '1000+', label: 'Projects Completed' },
  ];
  const image = content.image ?? '/assets/about/odeh-about-office.webp';
  const imageAlt = content.imageAlt ?? 'ODEH & PARTNERS DESIGN workspace';
  const readMoreLabel = content.readMoreLabel ?? 'Read More';
  const readMorePath = content.readMorePath ?? '/about/overview';

  return (
    <section className={styles.about} id="about">
      <div className="container">
        <div className={styles.grid}>
          <div ref={imageRef} className={`${styles.imageWrap} reveal`}>
            <div className={styles.imageFrame}>
              <img src={image} alt={imageAlt} loading="lazy" />
            </div>
            <div className={styles.imageAccent} aria-hidden="true" />
          </div>

          <div ref={contentRef} className={`${styles.content} reveal reveal-delay-2`}>
            <span className="section-label">{sectionLabel}</span>
            <h2 className={styles.aboutTitle}>
              {titleMain} <span>{titleAccent}</span>
            </h2>
            <p className={styles.description}>{body}</p>

            <div className={styles.stats}>
              {stats.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>

            <Link to={readMorePath} className="btn btn-primary">
              {readMoreLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

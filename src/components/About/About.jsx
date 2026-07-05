import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './About.module.css';

export default function About() {
  const imageRef = useScrollReveal();
  const contentRef = useScrollReveal();

  return (
    <section className={styles.about} id="about">
      <div className="container">
        <div className={styles.grid}>
          <div ref={imageRef} className={`${styles.imageWrap} reveal`}>
            <div className={styles.imageFrame}>
              <img
                src="/assets/about/odeh-about-office.webp"
                alt="ODEH & PARTNERS DESIGN workspace"
                loading="lazy"
              />
            </div>
            <div className={styles.imageAccent} aria-hidden="true" />
          </div>

          <div ref={contentRef} className={`${styles.content} reveal reveal-delay-2`}>
            <span className="section-label">About Us</span>
            <h2 className={styles.aboutTitle}>
              ODEH & <span>PARTNERS DESIGN</span>
            </h2>
            <p className={styles.description}>
              Welcome to the online platform of ODEH & PARTNERS DESIGN, an avant-garde structural
              design firm with a global vision. Our practice transcends conventional boundaries by
              delivering innovative engineering solutions backed by technical expertise, cultural
              insight, and a commitment to excellence. From concept to construction, we create
              sustainable structures that shape the future of the built environment.
            </p>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>7+</span>
                <span className={styles.statLabel}>Years of Excellence</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>1000+</span>
                <span className={styles.statLabel}>Projects Completed</span>
              </div>
            </div>

            <Link to="/about/overview" className="btn btn-primary">
              Read More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

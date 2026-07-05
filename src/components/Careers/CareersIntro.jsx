import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './CareersIntro.module.css';

export default function CareersIntro({ title, description }) {
  const sectionRef = useScrollReveal(0.1);

  return (
    <section className={styles.intro} aria-label="Careers introduction">
      <div className="container">
        <div ref={sectionRef} className={`${styles.content} reveal`}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </section>
  );
}

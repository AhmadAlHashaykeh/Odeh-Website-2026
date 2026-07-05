import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './HistoryStory.module.css';

export default function HistoryStory({ label, title, lead, body }) {
  const headerRef = useScrollReveal();
  const textRef = useScrollReveal(0.08);

  return (
    <section className={styles.story} aria-label="Our story">
      <div className="container">
        <div ref={headerRef} className={`${styles.header} reveal`}>
          <span className="section-label">{label}</span>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <article ref={textRef} className={`${styles.textBlock} reveal reveal-delay-1`}>
          <p className={styles.lead}>{lead}</p>
          <div className={styles.textFrame}>
            <p className={styles.body}>{body}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

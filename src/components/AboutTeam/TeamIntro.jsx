import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './TeamIntro.module.css';

export default function TeamIntro({
  label = 'Our People',
  title = 'Engineering minds. Shared craft.',
  lead,
  body,
}) {
  const headerRef = useScrollReveal();
  const textRef = useScrollReveal(0.08);

  if (!title && !lead && !body) return null;

  return (
    <section className={styles.intro} aria-label="Team introduction">
      <div className="container">
        <div ref={headerRef} className={`${styles.header} reveal`}>
          {label ? <span className="section-label">{label}</span> : null}
          {title ? <h2 className={styles.title}>{title}</h2> : null}
        </div>

        {(lead || body) && (
          <article ref={textRef} className={`${styles.textBlock} reveal reveal-delay-1`}>
            {lead ? <p className={styles.lead}>{lead}</p> : null}
            {body ? (
              <div className={styles.textFrame}>
                <p className={styles.body}>{body}</p>
              </div>
            ) : null}
          </article>
        )}
      </div>
    </section>
  );
}

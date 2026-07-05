import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './ProjectInfo.module.css';

function SpecRow({ label, value, isLast }) {
  if (!value) return null;

  return (
    <div className={`${styles.specRow} ${isLast ? styles.specRowLast : ''}`}>
      <dt className={styles.specLabel}>
        <span className={styles.specLabelText}>{label}</span>
        <span className={styles.specLabelMark} aria-hidden="true" />
      </dt>
      <dd className={styles.specValue}>{value}</dd>
    </div>
  );
}

export default function ProjectInfo({ project }) {
  const sectionRef = useScrollReveal(0.08);

  const specs = [
    { label: 'Type', value: project.type },
    { label: 'Area', value: project.area },
    { label: 'Status', value: project.status },
    { label: 'Services', value: project.services },
  ].filter((item) => item.value);

  return (
    <section className={styles.info} aria-label="Project information">
      <div className="container">
        <div ref={sectionRef} className={`${styles.layout} reveal`}>
          <p className={styles.description}>{project.description}</p>

          {specs.length > 0 && (
            <aside className={styles.specPanel} aria-label="Project specifications">
              <dl className={styles.specList}>
                {specs.map((spec, index) => (
                  <SpecRow
                    key={spec.label}
                    label={spec.label}
                    value={spec.value}
                    isLast={index === specs.length - 1}
                  />
                ))}
              </dl>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}

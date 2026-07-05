import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './SectionHeading.module.css';

export default function SectionHeading({
  label,
  title,
  description,
  as: TitleTag = 'h2',
  align = 'left',
  className = '',
}) {
  const ref = useScrollReveal(0.1);

  return (
    <header
      ref={ref}
      className={`${styles.header} ${styles[align]} reveal ${className}`}
    >
      {label && <span className="section-label">{label}</span>}
      <TitleTag className={styles.title}>{title}</TitleTag>
      {description && <p className={styles.description}>{description}</p>}
    </header>
  );
}

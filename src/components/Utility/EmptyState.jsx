import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './EmptyState.module.css';

export default function EmptyState({
  heading = 'No results found.',
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
  align = 'left',
}) {
  const ref = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`${styles.empty} ${styles[align]} reveal`}
      role="status"
    >
      <h2 className={styles.heading}>{heading}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {(primaryLabel || secondaryLabel) && (
        <div className={styles.actions}>
          {primaryLabel && primaryTo && (
            <Link to={primaryTo} className="btn btn-primary">
              {primaryLabel}
            </Link>
          )}
          {secondaryLabel && secondaryTo && (
            <Link to={secondaryTo} className="btn btn-secondary">
              {secondaryLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

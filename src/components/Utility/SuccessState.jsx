import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './SuccessState.module.css';

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m8 12.5 2.5 2.5L16 9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SuccessState({
  label,
  heading,
  description,
  primaryLabel = 'Return Home',
  primaryTo = '/',
  secondaryLabel,
  secondaryTo,
}) {
  const ref = useScrollReveal(0.08);

  return (
    <div ref={ref} className={`${styles.success} reveal`} role="status" aria-live="polite">
      <div className={styles.iconWrap} aria-hidden="true">
        <CheckIcon />
      </div>
      {label && <span className="section-label">{label}</span>}
      <h1 className={styles.heading}>{heading}</h1>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.actions}>
        <Link to={primaryTo} className="btn btn-primary">
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryTo && (
          <Link to={secondaryTo} className="btn btn-secondary">
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './CareersEmptyState.module.css';

export default function CareersEmptyState({ heading, description, buttonLabel, buttonTo }) {
  const sectionRef = useScrollReveal(0.1);

  return (
    <div ref={sectionRef} className={`${styles.empty} reveal`} role="status">
      <h2 className={styles.heading}>{heading}</h2>
      <p className={styles.description}>{description}</p>
      {buttonLabel && buttonTo && (
        <Link to={buttonTo} className="btn btn-primary">
          {buttonLabel}
        </Link>
      )}
    </div>
  );
}

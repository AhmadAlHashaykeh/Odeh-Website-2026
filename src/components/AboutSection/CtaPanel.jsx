/**
 * Premium call-to-action panel for About pages.
 *
 * @param {Object} props
 * @param {string} props.heading - CTA heading
 * @param {string} props.description - Supporting paragraph
 * @param {string} props.buttonLabel - Button text
 * @param {string} props.buttonTo - React Router path for the button link
 * @param {string} [props.ariaLabel='Call to action'] - Accessible section label
 */
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './CtaPanel.module.css';

export default function CtaPanel({
  heading,
  description,
  buttonLabel,
  buttonTo,
  ariaLabel = 'Call to action',
}) {
  const ctaRef = useScrollReveal(0.1);

  return (
    <section className={styles.cta} aria-label={ariaLabel}>
      <div className="container">
        <div ref={ctaRef} className={`${styles.panel} reveal`}>
          <div className={styles.glow} aria-hidden="true" />
          <div className={styles.content}>
            <h2 className={styles.heading}>{heading}</h2>
            <p className={styles.description}>{description}</p>
            <Link to={buttonTo} className="btn btn-primary">
              {buttonLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

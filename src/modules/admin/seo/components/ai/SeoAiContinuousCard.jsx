import { SEO_AI_CONTINUOUS_FEATURES } from '../../ai/seoAiConfig';
import SeoAiBadge from './SeoAiBadge';
import styles from './SeoAiContinuousCard.module.css';

export default function SeoAiContinuousCard() {
  return (
    <aside className={styles.card} aria-label="Continuous AI optimization">
      <div className={styles.header}>
        <span className={styles.title}>Continuous AI Optimization</span>
        <SeoAiBadge label="Future API" variant="neutral" />
      </div>
      <p className={styles.description}>
        This workspace will support ongoing AI-assisted SEO monitoring and suggestions.
      </p>
      <ul className={styles.list}>
        {SEO_AI_CONTINUOUS_FEATURES.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </aside>
  );
}

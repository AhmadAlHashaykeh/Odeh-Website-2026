import AdminIcon from '../../../components/AdminIcons';
import { SEO_AI_BATCH_ACTIONS } from '../../ai/seoAiActions';
import SeoAiBadge from './SeoAiBadge';
import styles from './SeoAiBatchOptimization.module.css';

export default function SeoAiBatchOptimization({ module, onAction }) {
  if (!module) return null;

  return (
    <section className={styles.card} aria-label="AI Batch Optimization">
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <AdminIcon name="seo" size={16} />
          <h3 className={styles.title}>AI Batch Optimization</h3>
          <SeoAiBadge label="Future OpenAI Ready" variant="neutral" />
        </div>
        <p className={styles.subtitle}>
          Prepare bulk SEO workflows for <strong>{module.label}</strong> — {module.pageCount} pages.
        </p>
      </div>

      <div className={styles.actions}>
        {SEO_AI_BATCH_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            className={styles.actionBtn}
            onClick={() => onAction(action)}
            title={action.description}
          >
            <span className={styles.actionLabel}>{action.label}</span>
            <AdminIcon name="arrow" size={12} />
          </button>
        ))}
      </div>
    </section>
  );
}

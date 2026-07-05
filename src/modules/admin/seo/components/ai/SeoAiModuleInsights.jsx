import AdminIcon from '../../../components/AdminIcons';
import { Button } from '../../../ui';
import SeoAiBadge from './SeoAiBadge';
import SeoAiContinuousCard from './SeoAiContinuousCard';
import styles from './SeoAiModuleInsights.module.css';

const SEVERITY_ICON = {
  info: 'seo',
  warn: 'warning',
  opportunity: 'star',
};

export default function SeoAiModuleInsights({
  module,
  insights,
  improvementPlan,
  isAnalyzing,
  isPlanGenerating,
  onAnalyze,
  onGeneratePlan,
}) {
  if (!module) return null;

  return (
    <section className={styles.panel} aria-label="AI SEO Insights">
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.titleRow}>
            <AdminIcon name="seo" size={16} />
            <h2 className={styles.title}>AI SEO Insights</h2>
            <SeoAiBadge label="AI Ready" variant="info" />
          </div>
          <p className={styles.subtitle}>
            Mock insights for <strong>{module.label}</strong> — {module.pageCount} pages
          </p>
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="sm"
            icon={<AdminIcon name="search" size={14} />}
            onClick={onAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing…' : 'Analyze Module'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<AdminIcon name="edit" size={14} />}
            onClick={onGeneratePlan}
            disabled={isPlanGenerating}
          >
            {isPlanGenerating ? 'Generating…' : 'Generate Improvement Plan'}
          </Button>
        </div>
      </div>

      {insights?.length > 0 ? (
        <ul className={styles.insightList}>
          {insights.map((insight) => (
            <li key={insight.id} className={`${styles.insightItem} ${styles[insight.severity]}`}>
              <AdminIcon name={SEVERITY_ICON[insight.severity] ?? 'info'} size={14} />
              <span>{insight.message}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.placeholder}>
          Run <strong>Analyze Module</strong> to generate AI insights for this content module.
        </p>
      )}

      {improvementPlan && (
        <div className={styles.plan}>
          <div className={styles.planHeader}>
            <span className={styles.planTitle}>Improvement Plan</span>
            <SeoAiBadge label="Suggestion Available" variant="info" />
          </div>
          <p className={styles.planSummary}>{improvementPlan.summary}</p>
          <ol className={styles.planList}>
            {improvementPlan.priorities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      )}

      <SeoAiContinuousCard />
    </section>
  );
}

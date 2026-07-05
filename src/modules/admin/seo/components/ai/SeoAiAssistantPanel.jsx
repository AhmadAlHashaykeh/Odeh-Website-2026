import AdminIcon from '../../../components/AdminIcons';
import { Button } from '../../../ui';
import { SEO_AI_MODAL_ACTIONS } from '../../ai/seoAiActions';
import SeoAiBadge from './SeoAiBadge';
import styles from './SeoAiAssistantPanel.module.css';

export default function SeoAiAssistantPanel({
  suggestion,
  isLoading,
  tone,
  metaTitle,
  metaDescription,
  onAnalyze,
  onAction,
}) {
  const titleLen = metaTitle?.length ?? 0;
  const descLen = metaDescription?.length ?? 0;

  return (
    <aside className={styles.panel} aria-label="AI SEO Assistant">
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <AdminIcon name="seo" size={16} />
          <h3 className={styles.title}>AI Assistant</h3>
          <SeoAiBadge label="AI Optimization Preview" variant="info" />
        </div>
        <p className={styles.subtitle}>Analyze, improve, and apply — changes stay in preview until saved.</p>
      </div>

      {suggestion && (
        <div className={styles.scoreBlock}>
          <span className={styles.scoreLabel}>SEO score estimate</span>
          <span className={styles.scoreValue}>{suggestion.estimatedScore}%</span>
        </div>
      )}

      <div className={styles.feedback}>
        <div className={styles.feedbackItem}>
          <span className={styles.feedbackLabel}>Title length</span>
          <span className={styles.feedbackValue}>
            {titleLen} chars
            {suggestion?.lengthFeedback?.title && (
              <span className={styles.feedbackHint}> — {suggestion.lengthFeedback.title}</span>
            )}
          </span>
        </div>
        <div className={styles.feedbackItem}>
          <span className={styles.feedbackLabel}>Description length</span>
          <span className={styles.feedbackValue}>
            {descLen} chars
            {suggestion?.lengthFeedback?.description && (
              <span className={styles.feedbackHint}> — {suggestion.lengthFeedback.description}</span>
            )}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        {SEO_AI_MODAL_ACTIONS.map((action) => (
          <Button
            key={action.id}
            type="button"
            variant={action.type === 'apply-all' ? 'primary' : action.type === 'analyze' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onAction(action)}
            disabled={isLoading && action.type !== 'analyze'}
          >
            {action.label}
          </Button>
        ))}
      </div>

      {isLoading && <p className={styles.loading}>Updating AI suggestions…</p>}

      {suggestion && !isLoading && (
        <>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Suggested rewrite</span>
            <p className={styles.rewrite}>{suggestion.suggestedRewrite ?? `${suggestion.suggestedMetaTitle ?? suggestion.metaTitle} — ${(suggestion.suggestedMetaDescription ?? suggestion.metaDescription)?.slice(0, 90)}`}</p>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Keyword suggestions</span>
            <div className={styles.keywords}>
              {(suggestion.focusKeywords ?? []).map((keyword) => (
                <span key={keyword} className={styles.keyword}>
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

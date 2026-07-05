import AdminIcon from '../../../components/AdminIcons';
import { Button } from '../../../ui';
import { SEO_AI_SECONDARY_ACTIONS } from '../../ai/seoAiActions';
import SeoAiBadge from './SeoAiBadge';
import styles from './SeoAiOptimizerPanel.module.css';

function ScoreBar({ current, potential }) {
  const improvement = Math.max(0, potential - current);

  return (
    <div className={styles.scoreBlock}>
      <div className={styles.scoreRow}>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>Current</span>
          <span className={styles.scoreValue}>{current}%</span>
        </div>
        <div className={styles.scoreArrow} aria-hidden="true">
          <AdminIcon name="arrow" size={14} />
        </div>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>Potential</span>
          <span className={`${styles.scoreValue} ${styles.scorePotential}`}>{potential}%</span>
        </div>
        {improvement > 0 && (
          <span className={styles.scoreGain}>+{improvement}%</span>
        )}
      </div>
      <div className={styles.scoreTrack} aria-hidden="true">
        <div className={styles.scoreFillCurrent} style={{ width: `${current}%` }} />
        <div className={styles.scoreFillPotential} style={{ width: `${potential}%` }} />
      </div>
    </div>
  );
}

export default function SeoAiOptimizerPanel({
  analysis,
  suggestion,
  isLoading,
  applyState,
  appliedFields,
  onOptimizeMetadata,
  onSecondaryAction,
  isReviewLoading,
}) {
  const currentScore = analysis?.currentScore ?? suggestion?.estimatedScore ?? 0;
  const potentialScore = analysis?.potentialScore ?? suggestion?.estimatedScore ?? currentScore;

  return (
    <section className={styles.panel} aria-label="AI SEO Optimizer">
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <AdminIcon name="seo" size={18} />
          <h3 className={styles.title}>AI SEO Optimizer</h3>
          <SeoAiBadge label="AI Optimization Preview" variant="info" />
          {applyState === 'full' && <SeoAiBadge label="AI Optimized" variant="success" />}
          {applyState === 'partial' && <SeoAiBadge label="Applied Locally" variant="success" />}
          {applyState !== 'none' && applyState !== 'full' && (
            <SeoAiBadge label="Unsaved AI Changes" variant="warning" />
          )}
        </div>
        <p className={styles.subtitle}>Actionable improvements — apply when ready, save when satisfied.</p>
      </div>

      {isLoading && !analysis ? (
        <p className={styles.loading}>Analyzing page SEO…</p>
      ) : (
        <>
          <ScoreBar current={currentScore} potential={potentialScore} />

          {analysis?.mainIssue && (
            <div className={styles.issueBlock}>
              <span className={styles.issueLabel}>Main issue</span>
              <p className={styles.issueText}>{analysis.mainIssue}</p>
            </div>
          )}

          {analysis?.insightChips?.length > 0 && (
            <div className={styles.chips}>
              {analysis.insightChips.map((chip) => (
                <span key={chip} className={styles.chip}>
                  {chip}
                </span>
              ))}
            </div>
          )}

          <div className={styles.primaryAction}>
            <Button
              variant="primary"
              size="sm"
              icon={<AdminIcon name="seo" size={14} />}
              onClick={onOptimizeMetadata}
              disabled={isReviewLoading}
            >
              {isReviewLoading ? 'Preparing review…' : 'Optimize Metadata'}
            </Button>
            <span className={styles.primaryHint}>Opens review before applying both fields</span>
          </div>

          <div className={styles.secondaryActions}>
            <span className={styles.secondaryLabel}>Quick actions</span>
            <div className={styles.actionGrid}>
              {SEO_AI_SECONDARY_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className={styles.actionChip}
                  onClick={() => onSecondaryAction(action)}
                  disabled={isLoading}
                >
                  {action.label}
                  {appliedFields[action.applyField === 'both' ? 'metaTitle' : action.applyField] && (
                    <span className={styles.appliedDot} title="Applied locally" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

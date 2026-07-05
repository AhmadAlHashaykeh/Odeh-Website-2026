import AdminIcon from '../../../components/AdminIcons';
import { Button } from '../../../ui';
import SeoAiBadge from './SeoAiBadge';
import styles from './SeoAiPageSuggestions.module.css';

function SuggestionField({ label, value, onApply, applyLabel, applied }) {
  return (
    <div className={styles.field}>
      <div className={styles.fieldHeader}>
        <span className={styles.fieldLabel}>{label}</span>
        <SeoAiBadge label="AI Suggestion" variant="info" />
        {applied && <SeoAiBadge label="Applied Locally" variant="success" />}
      </div>
      <p className={styles.fieldValue}>{value}</p>
      {onApply && (
        <Button variant="ghost" size="sm" onClick={onApply}>
          {applyLabel}
        </Button>
      )}
    </div>
  );
}

export default function SeoAiPageSuggestions({
  suggestion,
  isLoading,
  appliedFields,
  onApplyTitle,
  onApplyDescription,
  onCopy,
  onRegenerate,
}) {
  return (
    <section className={styles.panel} aria-label="AI Suggestions">
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>AI Suggestions</h3>
          <SeoAiBadge label="Suggestion Available" variant="info" />
          {suggestion?.isMock && (
            <SeoAiBadge label="Preview Mode" variant="neutral" title="Mock suggestions only" />
          )}
        </div>
        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="sm"
            icon={<AdminIcon name="copy" size={14} />}
            onClick={onCopy}
            disabled={!suggestion || isLoading}
          >
            Copy Suggestions
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<AdminIcon name="refresh" size={14} />}
            onClick={onRegenerate}
            disabled={isLoading}
          >
            {isLoading ? 'Regenerating…' : 'Regenerate'}
          </Button>
        </div>
      </div>

      {isLoading && !suggestion && (
        <p className={styles.loading}>Generating AI suggestions…</p>
      )}

      {suggestion && (
        <div className={styles.content}>
          <SuggestionField
            label="Suggested Meta Title"
            value={suggestion.suggestedMetaTitle}
            onApply={onApplyTitle}
            applyLabel="Apply Title"
            applied={appliedFields.metaTitle}
          />
          <SuggestionField
            label="Suggested Meta Description"
            value={suggestion.suggestedMetaDescription}
            onApply={onApplyDescription}
            applyLabel="Apply Description"
            applied={appliedFields.metaDescription}
          />

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Suggested Focus Keywords</span>
            <div className={styles.keywords}>
              {suggestion.focusKeywords.map((keyword) => (
                <span key={keyword} className={styles.keyword}>
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {suggestion.improvementNotes.length > 0 && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Suggested Improvement Notes</span>
              <ul className={styles.notes}>
                {suggestion.improvementNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

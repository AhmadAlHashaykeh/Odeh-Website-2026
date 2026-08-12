import BulkActions from './BulkActions';
import styles from './SelectionToolbar.module.css';

export default function SelectionToolbar({
  selectedCount,
  onClearSelection,
  bulkActionOptions = [],
  bulkAction,
  onBulkActionChange,
  onBulkApply,
  onDelete,
  targetOptions = [],
  targetValue = '',
  onTargetChange,
  targetAriaLabel = 'Target section',
  showTargetForActions = [],
}) {
  if (selectedCount === 0) return null;

  const showTarget = showTargetForActions.includes(bulkAction);
  const targetRequired = showTarget && !targetValue;
  const applyDisabled = targetRequired;

  const handleApply = () => {
    if (bulkAction === 'delete') {
      onDelete?.();
      return;
    }

    if (targetRequired) return;

    onBulkApply?.(bulkAction);
  };

  return (
    <div className={styles.bar} role="status" aria-live="polite">
      <div className={styles.info}>
        <span className={styles.count}>
          <strong>{selectedCount}</strong> selected
        </span>
        <button type="button" className={styles.clearBtn} onClick={onClearSelection}>
          Clear selection
        </button>
      </div>

      <BulkActions
        options={bulkActionOptions}
        value={bulkAction}
        onChange={onBulkActionChange}
        onApply={handleApply}
        disabled={applyDisabled}
        showTarget={showTarget}
        targetOptions={targetOptions}
        targetValue={targetValue}
        onTargetChange={onTargetChange}
        targetAriaLabel={targetAriaLabel}
      />
    </div>
  );
}

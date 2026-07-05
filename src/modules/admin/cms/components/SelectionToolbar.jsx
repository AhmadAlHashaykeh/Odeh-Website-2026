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
}) {
  if (selectedCount === 0) return null;

  const handleApply = () => {
    if (bulkAction === 'delete') {
      onDelete?.();
    } else {
      onBulkApply?.(bulkAction);
    }
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
      />
    </div>
  );
}

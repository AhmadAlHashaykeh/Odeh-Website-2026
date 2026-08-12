import FilterDropdown from './FilterDropdown';
import styles from './BulkActions.module.css';

export default function BulkActions({
  options = [],
  value,
  onChange,
  onApply,
  disabled = false,
  targetOptions = [],
  targetValue = '',
  onTargetChange,
  targetAriaLabel = 'Target',
  showTarget = false,
}) {
  return (
    <div className={styles.wrap}>
      <FilterDropdown
        value={value}
        onChange={onChange}
        options={options}
        icon={null}
        ariaLabel="Bulk action"
      />
      {showTarget ? (
        <FilterDropdown
          value={targetValue}
          onChange={onTargetChange}
          options={targetOptions}
          icon={null}
          ariaLabel={targetAriaLabel}
        />
      ) : null}
      <button
        type="button"
        className={styles.applyBtn}
        onClick={onApply}
        disabled={disabled}
      >
        Apply
      </button>
    </div>
  );
}

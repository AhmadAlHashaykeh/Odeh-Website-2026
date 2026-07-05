import { useEffect } from 'react';
import AdminIcon from '../../components/AdminIcons';
import styles from './ActionFeedback.module.css';

export default function ActionFeedback({
  open,
  message,
  type = 'success',
  onClose,
  autoHideMs = 3200,
}) {
  useEffect(() => {
    if (!open || !autoHideMs) return undefined;

    const timer = setTimeout(() => onClose?.(), autoHideMs);
    return () => clearTimeout(timer);
  }, [open, message, autoHideMs, onClose]);

  if (!open || !message) return null;

  return (
    <div
      className={`${styles.feedback} ${styles[type] || styles.success}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.icon} aria-hidden="true">
        <AdminIcon name={type === 'info' ? 'external' : 'check'} size={14} />
      </span>
      <span className={styles.message}>{message}</span>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        <AdminIcon name="close" size={14} />
      </button>
    </div>
  );
}

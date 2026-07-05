import { useEffect } from 'react';
import AdminIcon from '../../components/AdminIcons';
import Button from './Button';
import styles from './Modal.module.css';

function useModalLock(open, onClose) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
}

export function ModalActions({
  children,
  align = 'center',
  className = '',
}) {
  const alignClass = {
    center: styles.actions,
    start: `${styles.actions} ${styles.actionsStart}`,
    end: `${styles.actions} ${styles.actionsEnd}`,
    between: `${styles.actions} ${styles.actionsBetween}`,
  }[align] || styles.actions;

  return <div className={`${alignClass} ${className}`}>{children}</div>;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = 'default',
  scrollable = false,
  centered = false,
  ariaLabelledBy,
  ariaDescribedBy,
  className = '',
  header,
  footer,
  bodyClassName = '',
}) {
  useModalLock(open, onClose);

  if (!open) return null;

  const modalClasses = [
    styles.modal,
    size === 'large' ? styles.large : '',
    size === 'form' ? styles.form : '',
    scrollable ? styles.scrollable : '',
    centered ? styles.centered : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const showDefaultHeader = !header && (title || onClose);
  const bodyClasses = [
    styles.body,
    size === 'form' ? styles.formBody : '',
    bodyClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        onClick={(e) => e.stopPropagation()}
      >
        {header}
        {showDefaultHeader && (
          <div className={styles.header}>
            {title && (
              <h2 id={ariaLabelledBy} className={styles.title}>
                {title}
              </h2>
            )}
            {onClose && (
              <button
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close modal"
              >
                <AdminIcon name="close" size={18} />
              </button>
            )}
          </div>
        )}
        <div className={bodyClasses}>{children}</div>
        {footer && (
          <div className={`${styles.footer} ${size === 'form' ? styles.formFooter : ''}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmationModal({
  open,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  icon = 'warning',
  iconVariant = 'error',
  itemCount = 0,
}) {
  useModalLock(open, onCancel);

  if (!open) return null;

  const iconWrapClass = [
    styles.iconWrap,
    iconVariant !== 'error' ? styles[iconVariant] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.overlay} role="presentation" onClick={onCancel}>
      <div
        className={`${styles.modal} ${styles.centered}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={iconWrapClass}>
          <AdminIcon name={icon} size={24} />
        </div>

        <h2 id="confirm-modal-title" className={styles.title}>{title}</h2>
        <p id="confirm-modal-desc" className={styles.message}>
          {message}
          {itemCount > 0 && (
            <span>
              {' '}({itemCount} item{itemCount !== 1 ? 's' : ''} selected)
            </span>
          )}
        </p>

        <ModalActions>
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" icon={<AdminIcon name={icon} size={16} />} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </ModalActions>
      </div>
    </div>
  );
}

Modal.Confirmation = ConfirmationModal;
Modal.Actions = ModalActions;

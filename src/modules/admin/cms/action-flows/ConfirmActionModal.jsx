import { ConfirmationModal, Modal, ModalActions, Button } from '../../ui';
import AdminIcon from '../../components/AdminIcons';
import styles from './ConfirmActionModal.module.css';

const ICON_VARIANTS = {
  accent: 'accent',
  default: 'info',
  danger: 'error',
};

export default function ConfirmActionModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  icon = 'warning',
}) {
  if (variant === 'danger') {
    return (
      <ConfirmationModal
        open={open}
        title={title}
        message={message}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        onConfirm={onConfirm}
        onCancel={onCancel}
        icon={icon}
        iconVariant="error"
      />
    );
  }

  const iconVariant = ICON_VARIANTS[variant] || ICON_VARIANTS.default;

  return (
    <Modal
      open={open}
      onClose={onCancel}
      centered
      ariaLabelledBy="action-confirm-title"
      ariaDescribedBy="action-confirm-desc"
      className={styles.confirmModal}
    >
      <div className={`${styles.iconWrap} ${styles[iconVariant]}`}>
        <AdminIcon name={icon} size={24} />
      </div>

      <h2 id="action-confirm-title" className={styles.title}>{title}</h2>
      <p id="action-confirm-desc" className={styles.message}>{message}</p>

      <ModalActions>
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'accent' ? 'accent' : 'primary'}
          icon={<AdminIcon name={icon} size={16} />}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </ModalActions>
    </Modal>
  );
}

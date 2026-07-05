import { ConfirmationModal } from '../../ui';

export default function DeleteModal({
  open,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete the selected items? This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  itemCount = 0,
}) {
  return (
    <ConfirmationModal
      open={open}
      title={title}
      message={message}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      onConfirm={onConfirm}
      onCancel={onCancel}
      icon="trash"
      iconVariant="error"
      itemCount={itemCount}
    />
  );
}

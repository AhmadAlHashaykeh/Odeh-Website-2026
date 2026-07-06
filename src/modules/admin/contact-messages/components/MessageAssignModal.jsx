import { useState } from 'react';
import { Modal, ModalActions, Button, Select } from '../../ui';
import AdminIcon from '../../components/AdminIcons';
import styles from './MessageAssignModal.module.css';

export default function MessageAssignModal({
  open,
  message,
  assigneeOptions = [],
  onClose,
  onAssign,
}) {
  const [assignee, setAssignee] = useState(assigneeOptions[0]?.value || '');

  const handleClose = () => {
    setAssignee(assigneeOptions[0]?.value || '');
    onClose?.();
  };

  const handleAssign = () => {
    const selected = assigneeOptions.find((opt) => opt.value === assignee);
    onAssign?.(message, assignee, selected?.label || assignee);
    setAssignee(assigneeOptions[0]?.value || '');
  };

  if (!message) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      centered
      title="Assign Message"
      ariaLabelledBy="message-assign-modal-title"
      className={styles.modal}
    >
      <p className={styles.subtitle}>
        Assign inquiry from <strong>{message.senderName}</strong> to a team member.
      </p>

      <label className={styles.label} htmlFor="message-assignee">
        Assign To
      </label>
      <Select
        id="message-assignee"
        value={assignee}
        onChange={setAssignee}
        options={assigneeOptions}
        className={styles.select}
      />

      <ModalActions>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          icon={<AdminIcon name="team" size={16} />}
          onClick={handleAssign}
          disabled={!assignee}
        >
          Assign
        </Button>
      </ModalActions>
    </Modal>
  );
}

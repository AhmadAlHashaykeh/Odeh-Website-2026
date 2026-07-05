import { useState } from 'react';
import { Modal, ModalActions, Button } from '../../ui';
import AdminIcon from '../../components/AdminIcons';
import styles from './MessageNoteModal.module.css';

export default function MessageNoteModal({
  open,
  message,
  onClose,
  onSave,
}) {
  const [note, setNote] = useState('');

  const handleClose = () => {
    setNote('');
    onClose?.();
  };

  const handleSave = () => {
    onSave?.(message, note);
    setNote('');
  };

  if (!message) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      centered
      title="Add Internal Note"
      ariaLabelledBy="message-note-modal-title"
      className={styles.modal}
    >
      <p className={styles.subtitle}>
        Adding note for <strong>{message.senderName}</strong> — {message.subject}
      </p>

      <label className={styles.label} htmlFor="message-note">
        Note
      </label>
      <textarea
        id="message-note"
        className={styles.textarea}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Enter an internal note about this inquiry..."
        rows={5}
      />

      <ModalActions>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          icon={<AdminIcon name="edit" size={16} />}
          onClick={handleSave}
        >
          Save Note
        </Button>
      </ModalActions>
    </Modal>
  );
}

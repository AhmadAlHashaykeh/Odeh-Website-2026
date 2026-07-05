import { useState } from 'react';
import { Modal, ModalActions, Button } from '../../ui';
import AdminIcon from '../../components/AdminIcons';
import styles from './ApplicationNoteModal.module.css';

export default function ApplicationNoteModal({
  open,
  application,
  onClose,
  onSave,
}) {
  const [note, setNote] = useState('');

  const handleClose = () => {
    setNote('');
    onClose?.();
  };

  const handleSave = () => {
    onSave?.(application, note);
    setNote('');
  };

  if (!application) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      centered
      title="Add Internal Note"
      ariaLabelledBy="note-modal-title"
      className={styles.modal}
    >
      <p className={styles.subtitle}>
        Adding note for <strong>{application.applicantName}</strong> — {application.jobTitle}
      </p>

      <label className={styles.label} htmlFor="application-note">
        Note
      </label>
      <textarea
        id="application-note"
        className={styles.textarea}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Enter an internal note about this candidate..."
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

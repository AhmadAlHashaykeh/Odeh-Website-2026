import { useEffect, useRef, useState } from 'react';
import AdminIcon from '../../components/AdminIcons';
import {
  contactMessageStatusLabels,
  contactMessagePriorityLabels,
} from '../mock/contactMessagesConfig';
import styles from './MessageQuickActions.module.css';

function buildActions(message) {
  const statusActions = [
    { id: 'mark-read', label: 'Mark as Read', icon: 'eye' },
    { id: 'mark-replied', label: 'Mark as Replied', icon: 'check' },
    { id: 'archive', label: 'Archive', icon: 'export' },
  ].filter((action) => {
    if (action.id === 'mark-read' && message.status !== 'new') return false;
    if (action.id === 'mark-replied' && (message.status === 'replied' || message.status === 'archived')) return false;
    if (action.id === 'archive' && message.status === 'archived') return false;
    return true;
  });

  return [
    { id: 'view', label: 'View', icon: 'eye' },
    ...statusActions,
    { id: 'assign', label: 'Assign', icon: 'team' },
    { id: 'add-note', label: 'Add Note', icon: 'edit' },
    { id: 'copy-email', label: 'Copy Email', icon: 'messages' },
  ];
}

export default function MessageQuickActions({ message, onView, onAction }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const actions = buildActions(message);

  useEffect(() => {
    if (!open) return undefined;

    const handleClick = (e) => {
      if (!wrapRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleAction = (actionId) => {
    setOpen(false);

    if (actionId === 'view') {
      onView?.(message.id);
      return;
    }

    onAction?.(actionId, message);
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Actions for ${message.senderName}`}
        aria-expanded={open}
      >
        <AdminIcon name="more" size={16} />
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              className={`${styles.menuItem} ${action.danger ? styles.danger : ''}`}
              onClick={() => handleAction(action.id)}
            >
              <AdminIcon name={action.icon} size={15} />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MessageStatusBadge({ status }) {
  const label = contactMessageStatusLabels[status] || status;
  const config = {
    new: styles.new,
    read: styles.read,
    replied: styles.replied,
    archived: styles.archived,
  }[status] || styles.read;

  return <span className={`${styles.statusBadge} ${config}`}>{label}</span>;
}

export function MessagePriorityBadge({ priority }) {
  const label = contactMessagePriorityLabels[priority] || priority;
  const config = {
    normal: styles.priorityNormal,
    high: styles.priorityHigh,
    urgent: styles.priorityUrgent,
  }[priority] || styles.priorityNormal;

  return <span className={`${styles.priorityBadge} ${config}`}>{label}</span>;
}
